/* Proves every Packet Rush level can be won, and that none wins itself.

   Each level gets a scripted run through the real engine: a list of skill
   assignments, each fired the first tick its condition holds for the named
   packet (packets are numbered in release order). The run must deliver at
   least `need` packets without spending more skills than the level hands out.
   A second run with no assignments at all must lose — otherwise the level is
   not a puzzle.

   node tools/check.js            all levels, campaign and challenge pack
   node tools/check.js 3          just campaign level 3, with a per-packet report
   node tools/check.js dig-hard   just one level by id */

const { PacketGame, SKILLS, LW, LH, PACKET_KINDS, DEST_LETTERS, starsFor, TICK_HZ } = require("../js/engine.js");
const { PACKET_LEVELS, OSI_LAYERS, OSI_EXTRA, TCPIP_LAYERS } = require("../js/levels.js");
const { CHALLENGE_LEVELS, CATEGORIES, DIFFICULTIES } = require("../js/challenges.js");
const CHALLENGE_SOLUTIONS = require("./challenge-solutions.js");

const walking = (dir) => p => p.state === "walk" && (dir === undefined || p.dir === dir);

const SOLUTIONS = {
  drop: [
    { id: 0, skill: "pipe", when: p => walking()(p) && p.x >= 200 }
  ],
  firewall: [
    { id: 0, skill: "firewall", when: p => walking(1)(p) && p.x >= 290 }
  ],
  bridge: [
    { id: 0, skill: "bridge", when: p => walking(1)(p) && p.x >= 177 }
  ],
  tunnel: [
    { id: 0, skill: "tunnel", when: p => walking(1)(p) && p.x >= 175 }
  ],
  uplink: [0, 1, 2, 3, 4, 5].flatMap(id => [
    { id, skill: "uplink", when: p => p.state === "walk" },
    { id, skill: "buffer", when: p => p.state === "walk" }
  ]),
  overflow: [
    { id: 0, skill: "firewall", when: p => walking(1)(p) && p.x >= 310 },
    { id: 1, skill: "overflow", when: p => walking(-1)(p) && p.x <= 118 }
  ],
  besteffort: [
    { id: 0, skill: "bridge", when: p => walking(1)(p) && p.x >= 187 }
  ],
  mitm: [
    { id: 0, skill: "pipe", when: p => walking(1)(p) && p.x >= 100 },
    { id: 0, skill: "tunnel", when: p => walking(1)(p) && p.y >= 150 }
  ],
  ddos: [
    { id: 0, skill: "bridge", when: p => walking(1)(p) && p.x >= 85 },
    { id: 0, skill: "firewall", when: p => walking(1)(p) && p.x >= 165 }
  ],
  routing: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(id => ({ id, route: 0, when: p => p.state === "fall" })),
  congestion: [{ rate: 36 }],
  keepalive: [{ id: 0, skill: "firewall", when: p => walking(-1)(p) && p.x <= 18 }],
  fibre: [
    { id: 0, skill: "bridge", when: p => walking(1)(p) && p.x >= 117 },
    { id: 0, skill: "bridge", when: p => walking(1)(p) && p.x >= 240 }
  ],
  stack: [
    { id: 0, skill: "bridge", when: p => walking(1)(p) && p.x >= 117 },
    { id: 0, skill: "tunnel", when: p => walking(1)(p) && p.x >= 195 },
    { id: 0, skill: "pipe", when: p => walking()(p) && p.x >= 300 && p.y < 110 }
  ]
};

function run(level, script, verbose) {
  const g = new PacketGame(level);
  const pending = script.map(s => ({ ...s }));
  const budget = { ...g.skills };
  let guard = level.ttl * 20 + 10;
  while (g.state === "playing" && guard-- > 0) {
    for (const s of pending) {
      if (s.done) continue;
      if (s.rate !== undefined) { g.setRate(s.rate); s.done = true; continue; }   // release rate, from the start
      const p = g.packets.find(q => q.id === s.id);
      if (s.route !== undefined) {                 // point switch s.route at this packet's server —
        s.seen = s.seen || new Set();              // once for the packet and once for a resent copy
        for (const q of g.packets) {
          if (q.id !== s.id || !q.alive || s.seen.has(q) || !s.when(q, g)) continue;
          const sw = g.switches[s.route], srv = g.servers[q.dest];
          const want = s.want ? s.want(q, g) : srv.x < sw.x ? -1 : 1;
          if (sw.dir !== want) g.flip(sw);
          s.seen.add(q);
          if (verbose) console.log(`  t=${g.tick} switch ${s.route} -> ${want > 0 ? "right" : "left"} for packet ${q.id}${q.retry ? " (resent)" : ""}`);
        }
        continue;
      }
      if (p && p.alive && s.when(p, g) && g.canAssign(p, s.skill)) {
        g.assign(p, s.skill);
        s.done = true;
        if (verbose) console.log(`  t=${g.tick} packet ${p.id} at (${p.x},${p.y}) <- ${s.skill}`);
      }
    }
    g.step();
  }
  /* route entries only fire for packets that actually reach that switch */
  const unfired = pending.filter(s => !s.done && s.route === undefined);
  if (verbose) {
    for (const p of g.packets) console.log(`  packet ${p.id}: ${p.saved ? "delivered" : p.death || p.state} at (${p.x},${p.y})`);
  }
  return { g, unfired, budget };
}

const arg = process.argv[2] || null;
const only = arg && /^\d+$/.test(arg) ? Number(arg) : arg;
const problems = [];

/* the challenge pack: every category has one level of every difficulty, in order */
for (const c of CATEGORIES) for (const d of DIFFICULTIES) {
  const n = CHALLENGE_LEVELS.filter(l => l.category === c.id && l.difficulty === d.id).length;
  if (n !== 1) problems.push(`challenges: ${c.id} has ${n} ${d.id} level(s), expected 1`);
}
for (const l of CHALLENGE_LEVELS) if (PACKET_LEVELS.some(p => p.id === l.id)) problems.push(`challenges: id ${l.id} clashes with a campaign level`);

/* the campaign: every OSI layer has a world with at least one level */
for (let n = 1; n <= 7; n++) if (!PACKET_LEVELS.some(l => l.world === n)) problems.push(`campaign: OSI layer ${n} has no levels`);

/* the OSI reference: seven layers, each explained in both languages */
if (OSI_LAYERS.map(l => l.n).join() !== "7,6,5,4,3,2,1") problems.push("OSI: layers must be listed 7 down to 1");
for (const l of OSI_LAYERS) {
  for (const f of ["name", "job", "pdu"]) {
    if (!l[f] || !l[f].en || !l[f].zh) problems.push(`OSI layer ${l.n}: ${f} needs both English and Mandarin`);
  }
}
for (const [k, v] of Object.entries(OSI_EXTRA)) if (!v.en || !v.zh) problems.push(`OSI ${k}: needs both languages`);
/* the TCP/IP layers must cover OSI 1-7 exactly once between them */
const covered = TCPIP_LAYERS.flatMap(l => l.osi).sort().join();
if (covered !== "1,2,3,4,5,6,7") problems.push(`TCP/IP: layers cover OSI ${covered}, expected 1-7 once each`);
for (const l of TCPIP_LAYERS) if (!l.name.en || !l.name.zh || !l.job.en || !l.job.zh) problems.push(`TCP/IP ${l.name.en}: needs both languages`);

const ALL = [
  ...PACKET_LEVELS.map((level, i) => ({ level, n: i + 1, tag: `level ${i + 1} (${level.id})`, script: SOLUTIONS[level.id] })),
  ...CHALLENGE_LEVELS.map(level => ({ level, n: null, tag: `challenge ${level.id}`, script: CHALLENGE_SOLUTIONS[level.id] }))
];
let checked = 0;
ALL.forEach(({ level, n, tag, script }) => {
  if (only !== null && only !== n && only !== level.id) return;
  checked++;

  /* the level itself */
  const inside = (x, y) => x >= 0 && x < LW && y >= 0 && y < LH;
  if (!inside(level.hatch.x, level.hatch.y)) problems.push(`${tag}: hatch is off the map`);
  if (!inside(level.exit.x, level.exit.y + 1)) problems.push(`${tag}: exit is off the map`);
  if (level.need > level.count) problems.push(`${tag}: needs more packets than it releases`);
  for (const k of Object.keys(level.skills)) {
    if (!SKILLS.some(s => s.id === k)) problems.push(`${tag}: unknown skill "${k}"`);
  }
  if (!(level.world >= 1 && level.world <= 7) || !(level.osi || []).includes(level.world)) problems.push(`${tag}: world must be one of its own OSI layers`);
  if (!Array.isArray(level.osi) || !level.osi.length || level.osi.some(n => !(n >= 1 && n <= 7))) {
    problems.push(`${tag}: osi must list the OSI layers (1-7) its concept belongs to`);
  }
  for (const f of ["name", "goal", "note", "osiWhy"]) {
    if (!level[f] || !level[f].en || !level[f].zh) problems.push(`${tag}: ${f} needs both English and Mandarin`);
  }
  /* packet types and enemies */
  if (level.types !== undefined && (!level.types.length || [...level.types].some(c => !PACKET_KINDS[c]))) {
    problems.push(`${tag}: types may only use ${Object.keys(PACKET_KINDS).join(", ")}`);
  }
  for (const z of level.mitm || []) {
    if (!(z.w > 0 && z.h > 0) || !inside(z.x, z.y)) problems.push(`${tag}: a man-in-the-middle zone is off the map or empty`);
    if (level.exit.x >= z.x && level.exit.x < z.x + z.w && level.exit.y >= z.y && level.exit.y < z.y + z.h) {
      problems.push(`${tag}: the server sits inside a man-in-the-middle zone`);
    }
  }
  if (level.botnet) {
    const b = level.botnet;
    if (!inside(b.x, b.y) || !(b.count > 0) || !(b.rate > 0)) problems.push(`${tag}: botnet needs a position on the map, a count and a rate`);
  }
  /* routing */
  if (level.servers) {
    if (!level.servers.length || level.servers.some(sv => !inside(sv.x, sv.y + 1) || !sv.addr)) problems.push(`${tag}: every server needs a position and an address`);
    if (level.servers[0].x !== level.exit.x || level.servers[0].y !== level.exit.y) problems.push(`${tag}: exit must be the first server`);
    const probeS = new PacketGame(level);
    for (const sv of level.servers) if (!probeS.solid(sv.x, sv.y + 1)) problems.push(`${tag}: nothing to stand on at server ${sv.addr}`);
  }
  if (level.dests !== undefined) {
    const n = (level.servers || [level.exit]).length;
    if ([...level.dests].some(c => !(DEST_LETTERS.indexOf(c) >= 0 && DEST_LETTERS.indexOf(c) < n))) problems.push(`${tag}: dests may only name its ${n} server(s)`);
  }
  for (const l of level.links || []) if (!(l.w > 0 && l.h > 0 && l.capacity >= 1) || !inside(l.x, l.y)) problems.push(`${tag}: a link needs a size on the map and a capacity`);
  if (level.rateRange && !(level.rateRange[0] >= 1 && level.rateRange[0] <= level.rate && level.rate <= level.rateRange[1])) problems.push(`${tag}: rateRange must contain the starting rate`);
  if (level.session) {
    const se = level.session;
    if (!se.plate || !se.gate || !(se.timeout > 0) || !inside(se.plate.x, se.plate.y) || !inside(se.gate.x, se.gate.y)) problems.push(`${tag}: a session needs a plate, a gate and a timeout`);
  }
  for (const sw of level.switches || []) if (!inside(sw.x, sw.y) || Math.abs(sw.dir) !== 1) problems.push(`${tag}: a route switch needs a position and a dir of 1 or -1`);
  if (level.firewallRule !== undefined && level.firewallRule !== "junk") problems.push(`${tag}: unknown firewallRule "${level.firewallRule}"`);

  const probe = new PacketGame(level);
  if (!probe.solid(level.exit.x, level.exit.y + 1)) problems.push(`${tag}: nothing to stand on at the exit`);

  /* doing nothing must lose */
  const idle = run(level, []).g;
  if (idle.state === "won") problems.push(`${tag}: wins with no skills used (${idle.saved}/${level.count})`);

  /* the scripted solution must win */
  if (!script) { problems.push(`${tag}: no scripted solution`); return; }
  const { g, unfired } = run(level, script, only !== null);
  for (const s of unfired) problems.push(`${tag}: packet ${s.id} never got ${s.skill || "its route"}`);
  if (g.state !== "won") {
    problems.push(`${tag}: scripted run delivered ${g.saved}/${level.count}, needs ${level.need} (lost: ${JSON.stringify(g.losses)})`);
  } else if (!level.par || !(level.par.saved >= level.need && level.par.saved <= level.count) || !(level.par.skills >= 0) || !(level.par.time > 0)) {
    problems.push(`${tag}: par needs saved (between need and count), skills and time`);
  } else if (starsFor(level, g.saved, g.used, true) < 3 || g.tick / TICK_HZ > level.par.time) {
    problems.push(`${tag}: scripted run earns ${starsFor(level, g.saved, g.used, true)} stars in ${(g.tick / TICK_HZ).toFixed(1)}s — par (${JSON.stringify(level.par)}) is out of reach`);
  } else {
    console.log(`ok  ${tag.padEnd(22)} delivered ${g.saved}/${level.count} (need ${level.need}) in ${(g.tick / 20).toFixed(1)}s, ${g.used} skills: ★★★; idle run ${idle.saved}/${level.count}`);
  }
});

/* classroom: quiz questions are always answerable, result codes survive a
   round trip and reject tampering */
{
  const C = require("../js/classroom.js");
  const { OSI_LAYERS } = require("../js/levels.js");
  let bad = 0;
  for (const lv of PACKET_LEVELS) for (let s = 0; s < 100; s++) {
    const q = C.quizFor(lv, OSI_LAYERS, s * 31 + 7);
    const labels = q.options.map(o => (q.kind === "pdu" ? o.layer.pdu.en : o.layer.name.en));
    if (q.options.length !== 3 || new Set(labels).size !== 3 || !q.options.some(o => o.n === q.answer)) bad++;
  }
  if (bad) problems.push(`classroom: ${bad} quiz questions have duplicate or missing answers`);
  const stars = Object.fromEntries(PACKET_LEVELS.map((l, i) => [l.id, i % 4]));
  const code = C.makeResultCode({ name: "Test 学生", cls: "abc", stars, levels: PACKET_LEVELS, quiz: { right: 3, asked: 4 }, streak: 2, when: 1 });
  const back = C.readResultCode(code, PACKET_LEVELS);
  if (back.error || back.name !== "Test 学生" || back.cls !== "ABC" || back.perLevel.join() !== PACKET_LEVELS.map((l, i) => i % 4).join()) problems.push("classroom: result code does not survive a round trip");
  if (!C.readResultCode(code.slice(0, -1) + (code.endsWith("a") ? "b" : "a"), PACKET_LEVELS).error) problems.push("classroom: a tampered result code was accepted");
}

/* level codes: every level the editor can express survives encode → decode
   and still plays exactly the same */
{
  const { encodeLevel, decodeLevel } = require("../js/codec.js");
  for (const level of PACKET_LEVELS) {
    if (level.servers || level.switches || level.links || level.session || level.dests || level.rateRange) continue;
    const back = decodeLevel(encodeLevel(level));
    const a = new PacketGame(level), b = new PacketGame(back);
    while (a.state === "playing") a.step();
    while (b.state === "playing") b.step();
    if (a.saved !== b.saved || a.tick !== b.tick || a.lost !== b.lost) problems.push(`codec: ${level.id} plays differently after a round trip`);
  }
  const twice = decodeLevel(encodeLevel(decodeLevel(encodeLevel({ name: "N", goal: "" }))));
  if (twice.goal.en !== "" || twice.name.en !== "N") problems.push("codec: name or goal changes when a level is sanitized twice");
  let threw = false;
  try { decodeLevel("PL1.not-json"); } catch (e) { threw = true; }
  if (!threw) problems.push("codec: a damaged level code was accepted");
  const wild = decodeLevel(encodeLevel({ count: 9999, need: -4, rate: 0, ttl: 1e9, hatch: { x: 9999, y: -9 }, terrain: Array(500).fill({ x: 1, y: 1, w: 1, h: 1 }) }));
  if (wild.count > 40 || wild.need < 1 || wild.rate < 10 || wild.ttl > 600 || wild.hatch.x > 399 || wild.terrain.length > 200) problems.push("codec: out-of-range values are not clamped");
}

if (problems.length) {
  for (const p of problems) console.log("FAIL " + p);
  process.exit(1);
}
console.log(`All ${checked} Packet Rush level(s) check out (${PACKET_LEVELS.length} campaign, ${CHALLENGE_LEVELS.length} challenge).`);
