/* ============================================================================
   PACKET RUSH — level share codes
   A custom level travels as text: "PL1." followed by the level as JSON in
   URL-safe base64. index.html#lvl=<code> plays it, editor.html#lvl=<code>
   edits it. Decoding never trusts the text: every number is clamped, every
   list is capped and anything unknown is dropped, so a hand-made code can
   at worst produce a strange level, never a broken page.
   ========================================================================== */

const LEVEL_PREFIX = "PL1.";
const SKILL_IDS = ["uplink", "buffer", "overflow", "firewall", "bridge", "tunnel", "pipe"];

function b64urlEncode(text) {
  const bytes = new TextEncoder().encode(text);
  let bin = "";
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
function b64urlDecode(text) {
  const bin = atob(text.replace(/-/g, "+").replace(/_/g, "/"));
  return new TextDecoder().decode(Uint8Array.from(bin, c => c.charCodeAt(0)));
}

const clampInt = (v, lo, hi, d) => {
  const n = Math.round(Number(v));
  return Number.isFinite(n) ? Math.max(lo, Math.min(hi, n)) : d;
};
const rect = (r, extra) => {
  const out = {
    x: clampInt(r && r.x, -50, 450, 0), y: clampInt(r && r.y, -50, 250, 0),
    w: clampInt(r && r.w, 1, 500, 10), h: clampInt(r && r.h, 1, 300, 10)
  };
  return Object.assign(out, extra ? extra(r || {}) : {});
};
const point = (p, d) => ({ x: clampInt(p && p.x, 0, 399, d.x), y: clampInt(p && p.y, 0, 199, d.y) });
const text = (v, max) => String(v == null ? "" : v).slice(0, max);

/* Keep only what the engine understands, within sane limits. */
function sanitizeLevel(raw) {
  const r = raw && typeof raw === "object" ? raw : {};
  /* name and goal arrive either as text or as { en, zh } from a sanitized level */
  const plain = v => (v && typeof v === "object" ? v.en : v);
  const name = text(plain(r.name) || "Custom level", 40) || "Custom level";
  const goal = text(plain(r.goal) || "", 400);
  const count = clampInt(r.count, 1, 40, 10);
  const lv = {
    id: "custom",
    custom: true,
    name: { en: name, zh: name },
    goal: { en: goal, zh: goal },
    count,
    need: clampInt(r.need, 1, count, Math.min(count, 5)),
    rate: clampInt(r.rate, 10, 200, 40),
    ttl: clampInt(r.ttl, 10, 600, 150),
    hatch: Object.assign(point(r.hatch, { x: 40, y: 80 }), { dir: r.hatch && r.hatch.dir === -1 ? -1 : 1 }),
    exit: point(r.exit, { x: 360, y: 139 }),
    skills: {},
    terrain: (Array.isArray(r.terrain) ? r.terrain : []).slice(0, 200).map(t => rect(t, x => ({ m: [0, 1, 2].includes(x.m) ? x.m : 1 }))),
    hazards: (Array.isArray(r.hazards) ? r.hazards : []).slice(0, 30).map(h => rect(h)),
    mitm: (Array.isArray(r.mitm) ? r.mitm : []).slice(0, 10).map(z => rect(z))
  };
  for (const id of SKILL_IDS) {
    const n = clampInt(r.skills && r.skills[id], 0, 99, 0);
    if (n) lv.skills[id] = n;
  }
  if (typeof r.types === "string" && /^[TU]{1,12}$/.test(r.types)) lv.types = r.types;
  if (r.botnet && typeof r.botnet === "object") {
    lv.botnet = Object.assign(point(r.botnet, { x: 200, y: 80 }), {
      dir: r.botnet.dir === -1 ? -1 : 1,
      count: clampInt(r.botnet.count, 1, 60, 10), rate: clampInt(r.botnet.rate, 10, 200, 40), start: clampInt(r.botnet.start, 1, 2000, 30)
    });
    lv.server = { capacity: clampInt(r.server && r.server.capacity, 1, 20, 3), down: clampInt(r.server && r.server.down, 20, 1000, 120) };
    if (r.firewallRule === "junk") lv.firewallRule = "junk";
  }
  return lv;
}

/* The fields worth sharing (sanitizeLevel fills in the rest when read back). */
function encodeLevel(level) {
  const lv = sanitizeLevel(level);
  const out = {
    name: lv.name.en, goal: lv.goal.en, count: lv.count, need: lv.need, rate: lv.rate, ttl: lv.ttl,
    hatch: lv.hatch, exit: lv.exit, skills: lv.skills, terrain: lv.terrain
  };
  if (lv.hazards.length) out.hazards = lv.hazards;
  if (lv.mitm.length) out.mitm = lv.mitm;
  if (lv.types) out.types = lv.types;
  if (lv.botnet) { out.botnet = lv.botnet; out.server = lv.server; if (lv.firewallRule) out.firewallRule = lv.firewallRule; }
  return LEVEL_PREFIX + b64urlEncode(JSON.stringify(out));
}

/* Returns a playable level, or throws with a readable message. */
function decodeLevel(code) {
  const s = String(code || "").trim().replace(/^.*#lvl=/, "");
  if (!s.startsWith(LEVEL_PREFIX)) throw new Error("not a Packet Rush level code");
  let raw;
  try { raw = JSON.parse(b64urlDecode(s.slice(LEVEL_PREFIX.length))); } catch (e) { throw new Error("the level code is damaged or incomplete"); }
  return sanitizeLevel(raw);
}

if (typeof module !== "undefined") module.exports = { encodeLevel, decodeLevel, sanitizeLevel, LEVEL_PREFIX };
