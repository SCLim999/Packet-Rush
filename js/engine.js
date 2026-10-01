/* ============================================================================
   PACKET RUSH — rules engine
   A Lemmings-style simulation on a pixel bitmap. Packets fall out of a router,
   walk until something stops them, and do exactly one job each if you give
   them one. Everything here is deterministic and tick based (TICK_HZ ticks per
   game second), so tools/check.js can replay a solution in Node and prove
   that a level can be won.

   Coordinates: x, y is the pixel a packet's feet occupy. The ground it stands
   on is row y + 1. A packet is 5 px wide and 8 px tall.
   ========================================================================== */

const LW = 400, LH = 200;
const TICK_HZ = 20;
const M = { EMPTY: 0, DIRT: 1, STEEL: 2, BRICK: 3, GATE: 4 };

const SAFE_FALL = 56;             // further than this without a buffer corrupts the packet
const BUFFER_OPENS = 12;          // a buffer slows the fall after this many pixels
const STEP_UP = 6;                // highest ledge a walker climbs without help
const BRICKS = 12;                // bricks in one bridge
const OVERFLOW_TICKS = 5 * TICK_HZ;
const BLAST = 9;                  // overflow crater radius
const RETRANSMIT_TICKS = 2 * TICK_HZ;  // a lost TCP packet is resent this long after
const LOAD_DECAY_TICKS = 5 * TICK_HZ;  // the server sheds one unit of junk load this often

/* Packet types. A level may set `types`, a string cycled over its releases
   (T = TCP, U = UDP); levels without it release plain packets, which behave
   exactly as they always have.
   TCP: lost on the way, it is resent once from the router.
   UDP: walks twice as fast and is never resent. */
const PACKET_KINDS = { T: "tcp", U: "udp" };
/* Losses TCP recovers from. A firewall, an overflow or the clock are not
   the network dropping a packet, so they are not retransmitted. */
const RETRANSMIT_ON = ["splat", "void", "short", "mitm", "refused", "congestion", "timeout"];
/* Congestion: a level may mark narrow `links`, each with a capacity. A packet
   that enters a link already carrying that many packets is dropped. A level
   with a `rateRange` lets the player slow the router down or speed it up
   (ticks between releases), which is how TCP congestion control avoids it. */
/* Routing: a level may list several `servers`, each with an address, and a
   `dests` string (A, B, ...) cycled over releases saying where each packet
   is going. Delivering to the wrong server loses the packet. Route
   `switches` on the floor point walking packets left or right; clicking one
   flips it and costs nothing. */
const DEST_LETTERS = "ABCD";

/* The skills, in toolbar order. `on` lists the states a skill can interrupt. */
const SKILLS = [
  { id: "uplink",   key: "1", flag: true },
  { id: "buffer",   key: "2", flag: true },
  { id: "overflow", key: "3" },
  { id: "firewall", key: "4", on: ["walk", "build", "bash", "dig", "shrug"] },
  { id: "bridge",   key: "5", on: ["walk", "bash", "dig", "shrug", "build"] },
  { id: "tunnel",   key: "6", on: ["walk", "build", "dig", "shrug"] },
  { id: "pipe",     key: "7", on: ["walk", "build", "bash", "shrug"] }
];

class PacketGame {
  constructor(level) {
    this.level = level;
    this.map = new Uint8Array(LW * LH);
    for (const op of level.terrain) this.paint(op);
    this.hazards = level.hazards || [];
    this.skills = {};
    for (const s of SKILLS) this.skills[s.id] = (level.skills && level.skills[s.id]) || 0;
    this.packets = [];
    this.tick = 0;
    this.spawned = 0;
    this.saved = 0;
    this.lost = 0;
    this.losses = {};
    this.nuking = false;
    this.rate = level.rate;                  // ticks between releases
    this.ticksLeft = level.ttl * TICK_HZ;
    this.state = "playing";                  // playing | won | lost
    this.dirty = true;                       // terrain changed since last render
    this.mapVersion = 0;                     // bumped on every terrain change (edge markers cache on it)
    this.events = [];                        // sounds and effects for the UI to drain

    this.used = 0;                           // skills handed out, for the star rating
    this.resent = 0;                         // TCP retransmissions so far
    this.retx = [];                          // pending retransmissions: { due, id }
    /* enemies */
    this.mitm = level.mitm || [];            // zones that steal unencrypted packets
    this.botnet = level.botnet || null;      // a second router releasing junk traffic
    this.junkSpawned = 0;
    this.server = { capacity: 3, down: 6 * TICK_HZ, ...(level.server || {}) };
    this.load = 0;                           // junk packets the server is choking on
    this.downTicks = 0;                      // > 0 while the server is knocked offline
    this.outages = 0;
    /* routing */
    this.servers = level.servers ? level.servers.map(s => ({ ...s })) : [{ ...level.exit }];
    this.switches = (level.switches || []).map(s => ({ ...s }));
    this.flips = 0;
    /* congestion */
    this.links = (level.links || []).map(l => ({ ...l, load: 0 }));
    this.drops = 0;
    /* sessions: a gate that stays open only while the session is alive. A
       packet crossing the handshake plate (re)starts the session; after
       `timeout` ticks without one it closes. */
    this.session = level.session ? { ...level.session, ticks: 0, open: true } : null;
    if (this.session) this.setGate(false);
  }

  /* Edges a walking packet would fall from: the end of every surface where
     the ground drops away by more than a packet steps down. Each edge says
     which way the drop is, how far it falls, and whether that fall is deadly
     (further than SAFE_FALL, or straight off the map). Cached until the
     terrain changes. */
  edges() {
    if (this._edges && this._edgesAt === this.mapVersion) return this._edges;
    const out = [];
    const drop = (x, y) => {                  // how far a packet falls stepping off at (x, y)
      let d = 0;
      while (y + d + 1 < LH && !this.solid(x, y + d + 1)) d++;
      return y + d + 1 >= LH ? Infinity : d;
    };
    for (let y = 1; y < LH - 1; y++) {
      for (let x = 0; x < LW; x++) {
        if (this.solid(x, y) || !this.solid(x, y + 1)) continue;   // a surface pixel to stand on
        for (const dir of [-1, 1]) {
          const nx = x + dir;
          if (this.solid(nx, y) || this.solid(nx, y + 1)) continue;     // off the screen side counts as a drop
          const d = drop(nx, y);
          if (d <= 3) continue;                // a small step down, walked without falling
          const land = y + d;                  // where it lands — on a live wire is as bad as too far
          const shorts = d !== Infinity && this.hazards.some(h => nx >= h.x - 2 && nx < h.x + h.w + 2 && land >= h.y - 2 && land < h.y + h.h + 2);
          out.push({ x, y, dir, drop: d, deadly: d > SAFE_FALL || shorts });
        }
      }
    }
    /* leave out ledges no packet can stand on: tops narrower than a packet,
       and anything above the router unless packets can climb */
    const climb = (this.level.skills && this.level.skills.uplink) || 0;
    const run = e => { let w = 0; for (let x = e.x; x >= 0 && x < LW && !this.solid(x, e.y) && this.solid(x, e.y + 1) && w < 14; x -= e.dir) w++; return w; };
    const shown = out.filter(e => run(e) >= 12 && (climb || e.y >= this.level.hatch.y - 2));
    this._edges = shown;
    this._edgesAt = this.mapVersion;
    return shown;
  }

  setGate(open) {
    const s = this.session, g = s.gate;
    for (let y = g.y; y < g.y + g.h; y++) for (let x = g.x; x < g.x + g.w; x++) {
      if (x >= 0 && x < LW && y >= 0 && y < LH) this.map[y * LW + x] = open ? M.EMPTY : M.GATE;
    }
    s.open = open;
    this.dirty = true; this.mapVersion++;
  }

  stepSession() {
    const s = this.session, pl = s.plate;
    for (const p of this.packets) {
      /* traffic heading for the gate opens a session; a packet standing on the
         plate (a firewall, a crash) is a keep-alive and holds it open */
      const standing = p.state === "block" || p.state === "crash";
      if (p.alive && !p.junk && p.x >= pl.x && p.x < pl.x + pl.w && Math.abs(p.y - pl.y) <= 2 &&
          (standing || !pl.dir || p.dir === pl.dir)) {
        if (s.ticks === 0) this.events.push({ type: "session" });
        s.ticks = s.timeout;
      }
    }
    if (s.ticks > 0) s.ticks--;
    const want = s.ticks > 0;
    if (want && !s.open) this.setGate(true);
    if (!want && s.open) {
      /* never close on a packet standing in the doorway */
      const g = s.gate;
      const busy = this.packets.some(p => p.alive && p.x >= g.x - 3 && p.x < g.x + g.w + 3 && p.y >= g.y && p.y - 8 < g.y + g.h);
      if (!busy) { this.setGate(false); this.events.push({ type: "timeout" }); }
    }
  }

  setRate(r) {
    const range = this.level.rateRange;
    if (!range || this.state !== "playing") return false;
    const next = Math.max(range[0], Math.min(range[1], Math.round(r)));
    if (next === this.rate) return false;
    this.rate = next;
    this.events.push({ type: "rate" });
    return true;
  }

  /* route switch i, or the one nearest (x, y) within reach; returns it */
  switchAt(x, y, reach = 10) {
    let best = null, bestD = reach;
    for (const s of this.switches) {
      const d = Math.hypot(s.x - x, (s.y - 11) - y);      // the sign, 11 px above the floor
      if (d <= bestD) { bestD = d; best = s; }
    }
    return best;
  }
  flip(s) {
    if (!s || this.state !== "playing") return false;
    s.dir = -s.dir;
    this.flips++;
    this.events.push({ type: "flip" });
    return true;
  }

  /* ------------------------------------------------------------ terrain */
  paint(op) {
    const m = op.m === undefined ? M.DIRT : op.m;
    for (let y = Math.max(0, op.y); y < Math.min(LH, op.y + op.h); y++) {
      for (let x = Math.max(0, op.x); x < Math.min(LW, op.x + op.w); x++) {
        this.map[y * LW + x] = m;
      }
    }
  }

  at(x, y) {
    if (x < 0 || x >= LW) return M.EMPTY;    // no walls at the screen edges: walk off and you fall
    if (y < 0 || y >= LH) return M.EMPTY;
    return this.map[y * LW + x];
  }

  solid(x, y) { return this.at(x, y) !== M.EMPTY; }

  /* Clears dirt and bricks, never steel. Returns true if steel got in the way. */
  carve(x, y) {
    if (x < 0 || x >= LW || y < 0 || y >= LH) return false;
    const i = y * LW + x, v = this.map[i];
    if (v === M.STEEL || v === M.GATE) return true;
    if (v !== M.EMPTY) { this.map[i] = M.EMPTY; this.dirty = true; this.mapVersion++; }
    return false;
  }

  diggable(x, y) { const v = this.at(x, y); return v === M.DIRT || v === M.BRICK; }

  /* ------------------------------------------------------------- skills */
  canAssign(p, id) {
    if (!p || !p.alive || p.junk || this.skills[id] <= 0 || this.state !== "playing") return false;
    const s = SKILLS.find(k => k.id === id);
    if (id === "uplink") return !p.climber;
    if (id === "buffer") return !p.floater;
    if (id === "overflow") return p.bomb === 0;
    if (!s.on.includes(p.state)) return false;
    if (id === "bridge" && p.state === "build" && p.bricks > 2) return false;
    return true;
  }

  assign(p, id) {
    if (!this.canAssign(p, id)) return false;
    this.skills[id]--;
    this.used++;
    switch (id) {
      case "uplink": p.climber = true; break;
      case "buffer": p.floater = true; break;
      case "overflow": p.bomb = OVERFLOW_TICKS; break;
      case "firewall": p.state = "block"; break;
      case "bridge": p.state = "build"; p.bricks = BRICKS; p.timer = 0; break;
      case "tunnel": p.state = "bash"; p.timer = 0; p.encrypted = true; break;
      case "pipe": p.state = "dig"; p.timer = 0; break;
    }
    this.events.push({ type: "assign", skill: id });
    return true;
  }

  /* The packet under a point, preferring the one nearest the middle of its body.
     With a skill selected, packets that cannot take it are skipped, so a click
     on a crowd lands on someone useful. `slack` widens the target in world
     pixels — a fingertip on a phone covers far more of the map than a mouse. */
  pick(x, y, skill, slack = 0) {
    let best = null, bestD = Infinity;
    for (const p of this.packets) {
      if (!p.alive || p.junk) continue;
      if (Math.abs(p.x - x) > 5 + slack || y < p.y - 11 - slack || y > p.y + 3 + slack) continue;
      if (skill && !this.canAssign(p, skill)) continue;
      const d = Math.abs(p.x - x) + Math.abs(p.y - 4 - y);
      if (d < bestD) { bestD = d; best = p; }
    }
    return best;
  }

  nuke() {
    if (this.nuking || this.state !== "playing") return;
    this.nuking = true;
    let stagger = 0;
    for (const p of this.packets) if (p.alive && p.bomb === 0) p.bomb = OVERFLOW_TICKS + (stagger += 2);
  }

  /* --------------------------------------------------------------- loop */
  step() {
    if (this.state !== "playing") return;
    this.tick++;
    this.ticksLeft--;

    const lv = this.level;
    if (!this.nuking && this.spawned < lv.count && (this.tick === 1 || this.tick - (this.lastRelease || 1) >= this.rate)) {
      this.lastRelease = this.tick;
      const id = this.spawned++;
      const kind = lv.types ? PACKET_KINDS[lv.types[id % lv.types.length]] : undefined;
      const p = this.makePacket(id, lv.hatch, kind);
      if (lv.dests) p.dest = DEST_LETTERS.indexOf(lv.dests[id % lv.dests.length]);
      this.packets.push(p);
      this.events.push({ type: "spawn" });
    }
    /* TCP retransmissions come back out of the same router */
    while (!this.nuking && this.retx.length && this.retx[0].due <= this.tick) {
      const r = this.retx.shift();
      const p = this.makePacket(r.id, lv.hatch, "tcp");
      p.retry = 1;
      if (lv.dests) p.dest = DEST_LETTERS.indexOf(lv.dests[r.id % lv.dests.length]);
      this.packets.push(p);
      this.resent++;
      this.events.push({ type: "resend" });
    }
    /* the botnet floods the server with junk */
    const bn = this.botnet;
    if (bn && !this.nuking && this.junkSpawned < bn.count && this.tick >= (bn.start || 1) &&
        (this.tick - (bn.start || 1)) % bn.rate === 0) {
      const p = this.makePacket(1000 + this.junkSpawned++, bn, undefined);
      p.junk = true;
      this.packets.push(p);
    }
    if (this.downTicks > 0 && --this.downTicks === 0) this.events.push({ type: "up" });
    if (this.load > 0 && this.tick % LOAD_DECAY_TICKS === 0) this.load--;

    if (this.session) this.stepSession();
    for (const p of this.packets) if (p.alive) this.update(p);
    if (this.links.length) this.checkLinks();

    /* firewalls never move again, so once they are all that is left the run is over;
       junk traffic does not keep a level going */
    const alive = this.packets.some(p => p.alive && !p.junk && p.state !== "block") || this.retx.length > 0;
    if (this.ticksLeft <= 0) {
      this.retx.length = 0;
      for (const p of this.packets) if (p.alive) this.kill(p, "ttl");
      this.finish();
    } else if (!alive && (this.spawned >= lv.count || this.nuking)) {
      for (const p of this.packets) if (p.alive) this.kill(p, "firewall");
      this.finish();
    }
  }

  /* packets entering a full link are dropped, newest first */
  checkLinks() {
    this.links.forEach((l, li) => {
      const inside = this.packets.filter(p => p.alive && !p.junk &&
        p.x >= l.x && p.x < l.x + l.w && p.y >= l.y && p.y < l.y + l.h);
      const already = inside.filter(p => p.inLink === li);
      const entering = inside.filter(p => p.inLink !== li);
      let load = already.length;
      for (const p of entering) {
        if (load >= l.capacity) { this.drops++; this.kill(p, "congestion"); continue; }
        p.inLink = li;
        load++;
      }
      l.load = load;
      for (const p of this.packets) if (p.inLink === li && !inside.includes(p)) p.inLink = -1;
    });
  }

  makePacket(id, at, kind) {
    return {
      id, x: at.x, y: at.y, dir: at.dir || 1, kind,
      state: "fall", fall: 0, climber: false, floater: false, bomb: 0,
      bricks: 0, timer: 0, anim: 0, alive: true, retry: 0, encrypted: false, junk: false, lastSwitch: -1, inLink: -1
    };
  }

  finish() {
    this.state = this.saved >= this.level.need ? "won" : "lost";
    this.events.push({ type: this.state });
  }

  kill(p, why) {
    p.alive = false;
    p.death = why;
    if (p.junk) { this.events.push({ type: "junkdown", x: p.x, y: p.y }); return; }
    if (p.kind === "tcp" && !p.retry && !this.nuking && RETRANSMIT_ON.includes(why)) {
      this.retx.push({ due: this.tick + RETRANSMIT_TICKS, id: p.id });
      this.events.push({ type: "lost", why, x: p.x, y: p.y, recoverable: true });
      return;
    }
    this.lost++;
    this.losses[why] = (this.losses[why] || 0) + 1;
    this.events.push({ type: "lost", why, x: p.x, y: p.y });
  }

  update(p) {
    p.anim++;

    if (p.bomb > 0 && --p.bomb === 0) {
      for (let dy = -BLAST; dy <= BLAST; dy++) {
        for (let dx = -BLAST; dx <= BLAST; dx++) {
          if (dx * dx + dy * dy <= BLAST * BLAST) this.carve(p.x + dx, p.y - 3 + dy);
        }
      }
      this.events.push({ type: "boom", x: p.x, y: p.y - 3 });
      this.kill(p, "overflow");
      return;
    }
    /* an overflowing packet has crashed: it stops dead where it stands */
    if (p.bomb > 0 && ["walk", "shrug", "build", "bash", "dig"].includes(p.state)) p.state = "crash";

    switch (p.state) {
      case "fall": this.doFall(p); break;
      case "walk":
        this.doWalk(p);
        if (p.kind === "udp" && p.state === "walk" && p.alive) this.doWalk(p);   // UDP: twice the pace
        break;
      case "climb": this.doClimb(p); break;
      case "block":
      case "crash": if (!this.solid(p.x, p.y + 1)) this.startFall(p); break;
      case "build": this.doBuild(p); break;
      case "bash": this.doBash(p); break;
      case "dig": this.doDig(p); break;
      case "shrug": if (++p.timer > 10) p.state = "walk"; break;
    }
    if (!p.alive) return;

    if (p.y >= LH + 8 || p.x < -6 || p.x >= LW + 6) { this.kill(p, "void"); return; }
    for (const h of this.hazards) {
      if (p.x >= h.x && p.x < h.x + h.w && p.y >= h.y && p.y < h.y + h.h) { this.kill(p, "short"); return; }
    }
    /* a man in the middle reads (and keeps) anything that is not encrypted */
    if (!p.junk && !p.encrypted) {
      for (const z of this.mitm) {
        if (p.x >= z.x && p.x < z.x + z.w && p.y >= z.y && p.y < z.y + z.h) { this.kill(p, "mitm"); return; }
      }
    }
    /* a packet reaching a closed session gate has timed out */
    if (this.session && !this.session.open && !p.junk) {
      const g = this.session.gate;
      if (p.x + p.dir * 2 >= g.x && p.x + p.dir * 2 < g.x + g.w && p.y >= g.y && p.y - 4 < g.y + g.h) { this.kill(p, "timeout"); return; }
    }
    /* route switches point walking packets the way they are set */
    for (let i = 0; i < this.switches.length; i++) {
      const s = this.switches[i];
      const near = Math.abs(p.x - s.x) <= 2 && Math.abs(p.y - s.y) <= 3;
      if (near && p.state === "walk" && p.lastSwitch !== i) { p.dir = s.dir; p.lastSwitch = i; }
      else if (!near && p.lastSwitch === i && Math.abs(p.x - s.x) > 4) p.lastSwitch = -1;
    }
    for (let si = 0; si < this.servers.length; si++) {
      const ex = this.servers[si];
      if (p.state === "block" || Math.abs(p.x - ex.x) > 3 || p.y > ex.y || p.y < ex.y - 6) continue;
      if (!p.junk && p.dest !== undefined && p.dest !== si) { this.kill(p, "misrouted"); return; }
      p.alive = false;
      if (p.junk) {                           // junk eats server capacity
        this.events.push({ type: "junkin" });
        if (this.downTicks === 0 && ++this.load >= this.server.capacity) {
          this.load = 0;
          this.downTicks = this.server.down;
          this.outages++;
          this.events.push({ type: "down" });
        }
        return;
      }
      if (this.downTicks > 0) { p.alive = true; this.kill(p, "refused"); return; }
      p.saved = true;
      this.saved++;
      this.events.push({ type: "saved", server: si });
      return;
    }
  }

  startFall(p) { p.state = "fall"; p.fall = 0; }

  doFall(p) {
    const slow = p.floater && p.fall >= BUFFER_OPENS;
    const speed = slow ? 1 : 3;
    for (let i = 0; i < speed; i++) {
      if (this.solid(p.x, p.y + 1)) {
        if (p.fall > SAFE_FALL && !p.floater) { this.kill(p, "splat"); return; }
        p.state = "walk";
        p.fall = 0;
        return;
      }
      p.y++;
      p.fall++;
    }
  }

  blockedByFirewall(p, nx) {
    /* with a filter rule the firewall drops botnet junk and lets real traffic through */
    if (this.level.firewallRule === "junk" && !p.junk) return false;
    for (const b of this.packets) {
      if (b === p || !b.alive || b.state !== "block") continue;
      if (Math.abs(b.y - p.y) > 6) continue;
      if (Math.sign(b.x - p.x) === p.dir && Math.abs(b.x - nx) <= 4) return true;
    }
    return false;
  }

  doWalk(p) {
    const nx = p.x + p.dir;
    if (this.blockedByFirewall(p, nx)) { p.dir = -p.dir; return; }

    if (this.solid(nx, p.y)) {
      for (let k = 1; k <= STEP_UP; k++) {
        if (!this.solid(nx, p.y - k)) { p.x = nx; p.y -= k; return; }
      }
      if (p.climber) { p.state = "climb"; return; }
      p.dir = -p.dir;
      return;
    }

    p.x = nx;
    for (let k = 0; k < 3 && !this.solid(p.x, p.y + 1); k++) p.y++;
    if (!this.solid(p.x, p.y + 1)) { p.state = "fall"; p.fall = 3; }
  }

  doClimb(p) {
    if (this.solid(p.x, p.y - 9)) {          // head against an overhang: let go
      p.dir = -p.dir;
      this.startFall(p);
      return;
    }
    p.y--;
    if (!this.solid(p.x + p.dir, p.y)) { p.x += p.dir; p.state = "walk"; }
  }

  doBuild(p) {
    if (++p.timer % 4) return;
    /* stop if the next step up would put the packet's head in a wall */
    for (let r = 1; r <= 9; r++) {
      if (this.solid(p.x + p.dir * 2, p.y - r)) { p.dir = -p.dir; p.state = "shrug"; p.timer = 0; return; }
    }
    for (let i = 0; i < 6; i++) {
      const bx = p.x + p.dir * i;
      if (bx >= 0 && bx < LW && p.y >= 0 && p.y < LH && this.map[p.y * LW + bx] === M.EMPTY) {
        this.map[p.y * LW + bx] = M.BRICK;
        this.dirty = true; this.mapVersion++;
      }
    }
    this.events.push({ type: "brick" });
    p.y--;
    p.x += p.dir * 2;
    if (--p.bricks === 0) { p.state = "shrug"; p.timer = 0; }
  }

  doBash(p) {
    if (++p.timer % 2) return;
    let ahead = false;
    for (let c = 1; c <= 10 && !ahead; c++) {
      for (let r = 0; r <= 8; r++) if (this.diggable(p.x + p.dir * c, p.y - r)) { ahead = true; break; }
    }
    if (!ahead) { p.state = "walk"; return; }
    for (let c = 1; c <= 3; c++) {
      let steel = false;
      for (let r = 0; r <= 8; r++) steel = this.carve(p.x + p.dir * c, p.y - r) || steel;
      if (steel) { p.dir = -p.dir; p.state = "shrug"; p.timer = 0; return; }
    }
    p.x += p.dir;
    if (!this.solid(p.x, p.y + 1)) {
      for (let k = 0; k < 3 && !this.solid(p.x, p.y + 1); k++) p.y++;
      if (!this.solid(p.x, p.y + 1)) this.startFall(p);
    }
  }

  doDig(p) {
    if (++p.timer % 3) return;
    const row = p.y + 1;
    for (let dx = -3; dx <= 3; dx++) {
      if (this.at(p.x + dx, row) === M.STEEL && Math.abs(dx) <= 1) { p.state = "shrug"; p.timer = 0; return; }
    }
    for (let dx = -3; dx <= 3; dx++) this.carve(p.x + dx, row);
    p.y++;
    let floor = false;
    for (let dx = -3; dx <= 3; dx++) if (this.solid(p.x + dx, p.y + 1)) floor = true;
    if (!floor) this.startFall(p);
  }
}

/* Stars. One for finishing; two for also delivering par.saved packets; three
   for doing that with no more than par.skills skills. tools/check.js proves
   every level's par is reachable. */
function starsFor(level, saved, used, won) {
  if (!won) return 0;
  const par = level.par || { saved: level.need, skills: Infinity };
  if (saved < par.saved) return 1;
  return used <= par.skills ? 3 : 2;
}

if (typeof module !== "undefined") {
  module.exports = { PacketGame, SKILLS, M, LW, LH, TICK_HZ, SAFE_FALL, PACKET_KINDS, DEST_LETTERS, starsFor };
}
