/* ============================================================================
   PACKET RUSH — classroom mode
   Everything a class needs without a server:
   - a one-question quiz after each level, drawn from the level's OSI layer
     and the OSI reference data;
   - a student's name and class code;
   - a result code that packs the student's stars, quiz score and streak into
     one line of text, with a checksum, for the teacher to collect;
   - decoding, used by teacher.html to rank a class.
   Pure functions only; the interface lives in main.js and teacher.html.
   ========================================================================== */

const CODE_PREFIX = "PR1-";

/* A small deterministic generator, so a question can be rebuilt from a seed. */
function seeded(seed) {
  let s = seed >>> 0 || 1;
  return () => ((s = Math.imul(s ^ (s >>> 15), 2246822507) ^ Math.imul(s ^ (s >>> 13), 3266489909)) >>> 0) / 4294967296;
}
function shuffle(list, rnd) {
  const a = list.slice();
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}

/* One question about a level. Three kinds, picked by the seed:
   which layer the level's idea lives on, what that layer's data unit is
   called, and which layer does a given job. Returns text keys resolved by
   the caller: { kind, layer, options: [{ n, label }], answer }. */
function quizFor(level, layers, seed) {
  const rnd = seeded(seed);
  const n = level.world;
  const kinds = ["layer", "pdu", "job"];
  const kind = kinds[Math.floor(rnd() * kinds.length)];
  const correct = layers.find(l => l.n === n);
  /* distractors must read differently from the answer and from each other */
  const label = l => (kind === "pdu" ? l.pdu.en : l.name.en);
  const seen = new Set([label(correct)]);
  const others = [];
  for (const l of shuffle(layers.filter(x => x.n !== n), rnd)) {
    if (others.length === 2) break;
    if (seen.has(label(l))) continue;
    seen.add(label(l));
    others.push(l);
  }
  const options = shuffle([correct, ...others], rnd).map(l => ({ n: l.n, layer: l }));
  return { kind, n, options, answer: n };
}

/* ------------------------------------------------------------ result codes */
function checksum(text) {
  let h = 2166136261;
  for (let i = 0; i < text.length; i++) h = Math.imul(h ^ text.charCodeAt(i), 16777619);
  return (h >>> 0).toString(36).slice(-4).padStart(4, "0");
}
function toBase64Url(text) {
  const bytes = new TextEncoder().encode(text);
  let bin = "";
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
function fromBase64Url(text) {
  const bin = atob(text.replace(/-/g, "+").replace(/_/g, "/"));
  const bytes = Uint8Array.from(bin, c => c.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

/* stars: one digit per level in level order, so codes stay short */
function makeResultCode({ name, cls, stars, levels, quiz, streak, when }) {
  const body = JSON.stringify({
    v: 1, n: String(name || "").slice(0, 40), c: String(cls || "").slice(0, 20).toUpperCase(),
    s: levels.map(l => Math.max(0, Math.min(3, stars[l.id] || 0))).join(""),
    q: [quiz.right | 0, quiz.asked | 0], d: streak | 0, t: when | 0
  });
  const enc = toBase64Url(body);
  return CODE_PREFIX + enc + "." + checksum(enc);
}

/* Returns the decoded record, or { error } explaining what is wrong. */
function readResultCode(code, levels) {
  const text = String(code || "").trim();
  if (!text.startsWith(CODE_PREFIX)) return { error: "not a Packet Rush result code" };
  const [enc, sum] = text.slice(CODE_PREFIX.length).split(".");
  if (!enc || !sum) return { error: "incomplete code" };
  if (checksum(enc) !== sum) return { error: "code was changed or copied incompletely" };
  let r;
  try { r = JSON.parse(fromBase64Url(enc)); } catch (e) { return { error: "unreadable code" }; }
  if (r.v !== 1) return { error: "code from a different version" };
  const perLevel = levels.map((l, i) => Number(r.s[i] || 0));
  return {
    name: r.n, cls: r.c, perLevel,
    stars: perLevel.reduce((a, b) => a + b, 0), maxStars: levels.length * 3,
    cleared: perLevel.filter(x => x > 0).length,
    quizRight: r.q[0], quizAsked: r.q[1], streak: r.d, when: r.t
  };
}

/* Class table order: most stars, then best quiz accuracy, then name. */
function rankRecords(records) {
  const acc = r => (r.quizAsked ? r.quizRight / r.quizAsked : 0);
  return records.slice().sort((a, b) => b.stars - a.stars || acc(b) - acc(a) || a.name.localeCompare(b.name));
}

if (typeof module !== "undefined") module.exports = { quizFor, makeResultCode, readResultCode, rankRecords, checksum, CODE_PREFIX };
