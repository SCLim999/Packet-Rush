/* Proves every Packet Rush level can be won, and that none wins itself.

   Each level gets a scripted run through the real engine: a list of skill
   assignments, each fired the first tick its condition holds for the named
   packet (packets are numbered in release order). The run must deliver at
   least `need` packets without spending more skills than the level hands out.
   A second run with no assignments at all must lose — otherwise the level is
   not a puzzle.

   node tools/check.js          all levels
   node tools/check.js 3        just level 3, with a per-packet report */

const { PacketGame, SKILLS, LW, LH, PACKET_KINDS, DEST_LETTERS, starsFor, TICK_HZ } = require("../js/engine.js");
const { PACKET_LEVELS, OSI_LAYERS, OSI_EXTRA, TCPIP_LAYERS } = require("../js/levels.js");

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
      if (s.route !== undefined) {                 // point switch s.route at this packet's server
        if (p && p.alive && s.when(p, g)) {
          const sw = g.switches[s.route], srv = g.servers[p.dest];
          const want = srv.x < sw.x ? -1 : 1;
          if (sw.dir !== want) g.flip(sw);
          s.done = true;
          if (verbose) console.log(`  t=${g.tick} switch ${s.route} -> ${want > 0 ? "right" : "left"} for packet ${p.id}`);
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
  const unfired = pending.filter(s => !s.done);
  if (verbose) {
    for (const p of g.packets) console.log(`  packet ${p.id}: ${p.saved ? "delivered" : p.death || p.state} at (${p.x},${p.y})`);
  }
  return { g, unfired, budget };
}

const only = process.argv[2] ? Number(process.argv[2]) : null;
const problems = [];

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

PACKET_LEVELS.forEach((level, i) => {
  if (only && only !== i + 1) return;
  const tag = `level ${i + 1} (${level.id})`;

  /* the level itself */
  const inside = (x, y) => x >= 0 && x < LW && y >= 0 && y < LH;
  if (!inside(level.hatch.x, level.hatch.y)) problems.push(`${tag}: hatch is off the map`);
  if (!inside(level.exit.x, level.exit.y + 1)) problems.push(`${tag}: exit is off the map`);
  if (level.need > level.count) problems.push(`${tag}: needs more packets than it releases`);
  for (const k of Object.keys(level.skills)) {
    if (!SKILLS.some(s => s.id === k)) problems.push(`${tag}: unknown skill "${k}"`);
  }
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
  for (const sw of level.switches || []) if (!inside(sw.x, sw.y) || Math.abs(sw.dir) !== 1) problems.push(`${tag}: a route switch needs a position and a dir of 1 or -1`);
  if (level.firewallRule !== undefined && level.firewallRule !== "junk") problems.push(`${tag}: unknown firewallRule "${level.firewallRule}"`);

  const probe = new PacketGame(level);
  if (!probe.solid(level.exit.x, level.exit.y + 1)) problems.push(`${tag}: nothing to stand on at the exit`);

  /* doing nothing must lose */
  const idle = run(level, []).g;
  if (idle.state === "won") problems.push(`${tag}: wins with no skills used (${idle.saved}/${level.count})`);

  /* the scripted solution must win */
  const script = SOLUTIONS[level.id];
  if (!script) { problems.push(`${tag}: no scripted solution in tools/check.js`); return; }
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

if (problems.length) {
  for (const p of problems) console.log("FAIL " + p);
  process.exit(1);
}
console.log(`All ${only ? 1 : PACKET_LEVELS.length} Packet Rush level(s) check out.`);
