/* ============================================================================
   PACKET RUSH — level editor
   The level being edited is a plain object in the same shape as the built-in
   levels (see levels.js), kept in `level`. Painting pushes rectangles onto
   its terrain list, exactly as the built-in levels are written; the preview
   is drawn from the engine's own map, so what you see is what plays.
   Test play hands the level to index.html through localStorage; sharing
   packs it into a link with codec.js.
   ========================================================================== */

const E = {
  en: {
    title: "Level editor", tagline: "Paint a network, place the router and the server, hand out skills — then test it and share the link.",
    back: "Back to the game", undo: "Undo", check: "Check", test: "Test play", share: "Copy share link",
    settings: "Level settings", name: "Name", goal: "Hint for players", count: "Packets", need: "Must deliver",
    rate: "Release gap (ticks)", ttl: "TTL (seconds)", types: "Packet type", tPlain: "Plain", tTcp: "TCP only", tUdp: "UDP only", tMix: "TCP + UDP",
    dir: "Router sends", right: "Right", left: "Left", skills: "Skills to hand out", botnet: "Botnet", junk: "Junk packets", jrate: "Junk gap (ticks)",
    filter: "Firewalls drop junk only", load: "Start from", open: "Open", paste: "…or paste a level code", loadCode: "Load code", blank: "A blank network",
    "tool.silicon": "Silicon", "tool.steel": "Steel", "tool.erase": "Erase", "tool.router": "Router", "tool.server": "Server",
    "tool.wire": "Live wire", "tool.mitm": "Man in the middle", "tool.botnet": "Botnet", "tool.remove": "Remove",
    "hint.silicon": "Drag to paint diggable silicon.", "hint.steel": "Drag to paint shielded steel — nothing digs through it.",
    "hint.erase": "Drag to cut a hole in the terrain.", "hint.router": "Click where packets should drop in.",
    "hint.server": "Click on the ground where the server should stand.", "hint.wire": "Drag to lay a live wire — it shorts out any packet.",
    "hint.mitm": "Drag to mark a zone that steals unencrypted packets.", "hint.botnet": "Click to place a botnet router; click it again to remove it.",
    "hint.remove": "Click a wire, zone or painted rectangle to delete it.",
    "chk.ok": "Looks playable: the router and server are on the map and the server has ground under it.",
    "chk.idleLoses": "Doing nothing loses ({saved}/{need}) — it needs the player.", "chk.idleWins": "Doing nothing already wins ({saved}/{need}). Make it harder, or hand out fewer packets.",
    "chk.noGround": "The server is floating — put ground right under it.", "chk.inside": "The server is buried inside terrain.",
    "chk.noSkills": "No skills are handed out — make sure the level can be won without them.",
    "chk.hatchInside": "The router drops packets straight into terrain.",
    "note.copied": "Share link copied — anyone who opens it plays your level.", "note.copyFail": "Copy this link:",
    "note.loaded": "Level loaded.", "note.bad": "That code could not be read: {why}.", "note.shareHelp": "Share link:"
  },
  zh: {
    title: "关卡编辑器", tagline: "绘制网络，放置路由器和服务器，分配技能 —— 然后试玩并分享链接。",
    back: "返回游戏", undo: "撤销", check: "检查", test: "试玩", share: "复制分享链接",
    settings: "关卡设置", name: "名称", goal: "给玩家的提示", count: "数据包数量", need: "需要送达",
    rate: "发送间隔（帧）", ttl: "TTL（秒）", types: "数据包类型", tPlain: "普通", tTcp: "仅 TCP", tUdp: "仅 UDP", tMix: "TCP + UDP",
    dir: "路由器方向", right: "向右", left: "向左", skills: "可用技能", botnet: "僵尸网络", junk: "垃圾包数量", jrate: "垃圾包间隔（帧）",
    filter: "防火墙只拦截垃圾包", load: "从现有关卡开始", open: "打开", paste: "……或粘贴关卡代码", loadCode: "载入代码", blank: "空白网络",
    "tool.silicon": "硅层", "tool.steel": "钢板", "tool.erase": "擦除", "tool.router": "路由器", "tool.server": "服务器",
    "tool.wire": "带电导线", "tool.mitm": "中间人", "tool.botnet": "僵尸网络", "tool.remove": "删除",
    "hint.silicon": "拖动绘制可挖掘的硅层。", "hint.steel": "拖动绘制屏蔽钢板 —— 什么都挖不穿。",
    "hint.erase": "拖动在地形上挖出空洞。", "hint.router": "点击数据包掉落的位置。",
    "hint.server": "点击服务器所在的地面位置。", "hint.wire": "拖动铺设带电导线 —— 碰到的数据包会短路。",
    "hint.mitm": "拖动标出会截获未加密数据包的区域。", "hint.botnet": "点击放置僵尸网络路由器；再次点击可移除。",
    "hint.remove": "点击导线、区域或绘制的矩形即可删除。",
    "chk.ok": "看起来可以玩：路由器和服务器都在地图内，服务器下方有地面。",
    "chk.idleLoses": "不操作会失败（{saved}/{need}）—— 需要玩家动脑。", "chk.idleWins": "不操作就能过关（{saved}/{need}）。请增加难度或减少数据包。",
    "chk.noGround": "服务器悬空了 —— 在它正下方放上地面。", "chk.inside": "服务器被埋在地形里了。",
    "chk.noSkills": "没有分配任何技能 —— 请确认不用技能也能过关。",
    "chk.hatchInside": "路由器把数据包直接投进了地形里。",
    "note.copied": "分享链接已复制 —— 任何人打开它都能玩你的关卡。", "note.copyFail": "请复制这个链接：",
    "note.loaded": "关卡已载入。", "note.bad": "无法读取这个代码：{why}。", "note.shareHelp": "分享链接："
  }
};
const SKILL_NAMES = {
  en: { uplink: "Uplink", buffer: "Buffer", overflow: "Overflow", firewall: "Firewall", bridge: "Bridge", tunnel: "Tunnel", pipe: "Pipe" },
  zh: { uplink: "上行链路", buffer: "缓冲区", overflow: "溢出", firewall: "防火墙", bridge: "网桥", tunnel: "隧道", pipe: "管道" }
};
const TOOLS = [
  { id: "silicon", color: "#22805a", drag: true }, { id: "steel", color: "#8090a4", drag: true }, { id: "erase", color: "#0b1624", drag: true },
  { id: "router", color: "#45d0e0" }, { id: "server", color: "#4ade80" }, { id: "wire", color: "#facc15", drag: true },
  { id: "mitm", color: "#f87171", drag: true }, { id: "botnet", color: "#f87171" }, { id: "remove", color: "#94a3b8" }
];

const store = {
  get(k, d) { try { const v = localStorage.getItem(k); return v === null ? d : v; } catch (e) { return d; } },
  set(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* storage disabled */ } }
};
let lang = store.get("bitbuilder.lang", (navigator.language || "en").toLowerCase().startsWith("zh") ? "zh" : "en");
const t = (k, v) => { let s = (E[lang] && E[lang][k]) || E.en[k] || k; if (v) for (const [a, b] of Object.entries(v)) s = s.split("{" + a + "}").join(b); return s; };
const el = id => document.getElementById(id);
if (store.get("bitbuilder.theme", "bright") === "dark") document.body.className = "rush-dark";

const canvas = el("ed-canvas"), ctx = canvas.getContext("2d");
const S = canvas.width / LW;

/* ------------------------------------------------------------- the level */
function blankLevel() {
  return sanitizeLevel({
    name: "My network", count: 10, need: 7, rate: 40, ttl: 150,
    hatch: { x: 50, y: 90 }, exit: { x: 350, y: 139 }, skills: { bridge: 2 },
    terrain: [{ x: 0, y: 140, w: 160, h: 20, m: 1 }, { x: 190, y: 140, w: 210, h: 20, m: 1 }, { x: 0, y: 160, w: 400, h: 40, m: 2 }]
  });
}
let level = blankLevel();
const history = [];
const snapshot = () => { history.push(JSON.stringify(level)); if (history.length > 80) history.shift(); };
const saveDraft = () => store.set("packetrush.draft", encodeLevel(level));

/* ------------------------------------------------------------- drawing */
function draw(dragRect) {
  const g = new PacketGame(level);
  const img = ctx.createImageData(LW, LH);
  for (let i = 0; i < LW * LH; i++) {
    const m = g.map[i], o = i * 4, x = i % LW, y = (i / LW) | 0;
    const top = y > 0 && g.map[i - LW] === 0;
    let c;
    if (m === 1) c = top ? [70, 180, 120] : ((x % 16 === 9 || y % 12 === 5) ? [200, 170, 70] : [34, 128, 84]);
    else if (m === 2) c = top ? [170, 182, 198] : ((x % 10 === 2 && y % 10 === 2) ? [210, 220, 232] : [128, 142, 160]);
    else c = (x % 20 === 0 || y % 20 === 0) ? [22, 38, 58] : [11, 22, 36];
    img.data[o] = c[0]; img.data[o + 1] = c[1]; img.data[o + 2] = c[2]; img.data[o + 3] = 255;
  }
  const off = document.createElement("canvas");
  off.width = LW; off.height = LH;
  off.getContext("2d").putImageData(img, 0, 0);
  ctx.imageSmoothingEnabled = false;
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.drawImage(off, 0, 0, canvas.width, canvas.height);
  ctx.setTransform(S, 0, 0, S, 0, 0);

  for (const h of level.hazards) { ctx.fillStyle = "rgba(250,204,21,0.8)"; ctx.fillRect(h.x, h.y, h.w, h.h); }
  for (const z of level.mitm) {
    ctx.fillStyle = "rgba(248,113,113,0.15)"; ctx.fillRect(z.x, z.y, z.w, z.h);
    ctx.strokeStyle = "#f87171"; ctx.lineWidth = 0.6; ctx.setLineDash([3, 2]); ctx.strokeRect(z.x, z.y, z.w, z.h); ctx.setLineDash([]);
  }
  const router = (p, col) => {
    ctx.fillStyle = "#1e293b"; ctx.fillRect(p.x - 12, p.y - 14, 24, 9);
    ctx.strokeStyle = col; ctx.lineWidth = 0.8; ctx.strokeRect(p.x - 12, p.y - 14, 24, 9);
    ctx.fillStyle = col; ctx.beginPath();
    const d = p.dir || 1; ctx.moveTo(p.x + d * 6, p.y - 9.5); ctx.lineTo(p.x, p.y - 12.5); ctx.lineTo(p.x, p.y - 6.5); ctx.fill();
  };
  router(level.hatch, "#45d0e0");
  if (level.botnet) router(level.botnet, "#f87171");
  const ex = level.exit;
  ctx.fillStyle = "#1e293b"; ctx.fillRect(ex.x - 9, ex.y - 22, 18, 23);
  ctx.strokeStyle = "#4ade80"; ctx.strokeRect(ex.x - 9, ex.y - 22, 18, 23);
  ctx.fillStyle = "rgba(74,222,128,0.8)"; ctx.fillRect(ex.x - 4, ex.y - 11, 8, 12);

  if (dragRect) {
    const tool = TOOLS.find(x => x.id === currentTool);
    ctx.strokeStyle = "#ffffff"; ctx.lineWidth = 0.7; ctx.setLineDash([2, 2]);
    ctx.strokeRect(dragRect.x, dragRect.y, dragRect.w, dragRect.h); ctx.setLineDash([]);
    ctx.fillStyle = tool.color + "66"; ctx.fillRect(dragRect.x, dragRect.y, dragRect.w, dragRect.h);
  }
}

/* ------------------------------------------------------------- tools */
let currentTool = "silicon";
function buildTools() {
  const box = el("tools");
  box.innerHTML = "";
  for (const tool of TOOLS) {
    const b = document.createElement("button");
    b.className = "ed-tool";
    b.setAttribute("aria-pressed", String(tool.id === currentTool));
    b.innerHTML = `<i style="background:${tool.color}"></i>${t("tool." + tool.id)}`;
    b.onclick = () => { currentTool = tool.id; buildTools(); el("ed-hint").textContent = t("hint." + tool.id); };
    box.append(b);
  }
  el("ed-hint").textContent = t("hint." + currentTool);
}

const worldAt = ev => {
  const r = canvas.getBoundingClientRect();
  return { x: Math.round((ev.clientX - r.left) / r.width * LW), y: Math.round((ev.clientY - r.top) / r.height * LH) };
};
const snap = v => Math.round(v / 2) * 2;
const norm = (a, b) => ({ x: snap(Math.min(a.x, b.x)), y: snap(Math.min(a.y, b.y)), w: Math.max(2, snap(Math.abs(b.x - a.x))), h: Math.max(2, snap(Math.abs(b.y - a.y))) });
const hit = (r, p) => p.x >= r.x && p.x < r.x + r.w && p.y >= r.y && p.y < r.y + r.h;

let dragFrom = null;
canvas.addEventListener("pointerdown", ev => {
  const p = worldAt(ev), tool = TOOLS.find(x => x.id === currentTool);
  if (tool.drag) { dragFrom = p; canvas.setPointerCapture(ev.pointerId); return; }
  snapshot();
  if (currentTool === "router") {
    if (Math.abs(p.x - level.hatch.x) < 12 && Math.abs(p.y - 10 - level.hatch.y) < 10) level.hatch.dir = -(level.hatch.dir || 1);
    else level.hatch = { x: p.x, y: Math.max(20, p.y), dir: level.hatch.dir || 1 };
  } else if (currentTool === "server") {
    const g = new PacketGame(level);
    let y = p.y;
    while (y < LH - 1 && !g.solid(p.x, y + 1)) y++;          // drop it onto the ground below the click
    level.exit = { x: p.x, y };
  } else if (currentTool === "botnet") {
    if (level.botnet && Math.abs(p.x - level.botnet.x) < 12 && Math.abs(p.y - 10 - level.botnet.y) < 10) { delete level.botnet; delete level.server; delete level.firewallRule; }
    else level.botnet = { x: p.x, y: Math.max(20, p.y), dir: 1, count: (level.botnet && level.botnet.count) || 10, rate: (level.botnet && level.botnet.rate) || 40, start: 30 };
  } else if (currentTool === "remove") {
    const lists = [level.hazards, level.mitm, level.terrain];
    let removed = false;
    for (const list of lists) {
      for (let i = list.length - 1; i >= 0 && !removed; i--) if (hit(list[i], p)) { list.splice(i, 1); removed = true; }
      if (removed) break;
    }
    if (!removed) history.pop();
  }
  changed();
});
canvas.addEventListener("pointermove", ev => { if (dragFrom) draw(norm(dragFrom, worldAt(ev))); });
canvas.addEventListener("pointerup", ev => {
  if (!dragFrom) return;
  const r = norm(dragFrom, worldAt(ev));
  dragFrom = null;
  snapshot();
  if (currentTool === "silicon") level.terrain.push({ ...r, m: 1 });
  else if (currentTool === "steel") level.terrain.push({ ...r, m: 2 });
  else if (currentTool === "erase") level.terrain.push({ ...r, m: 0 });
  else if (currentTool === "wire") level.hazards.push(r);
  else if (currentTool === "mitm") level.mitm.push(r);
  changed();
});

/* ------------------------------------------------------------- the form */
function buildSkills() {
  const box = el("f-skills");
  box.innerHTML = "";
  for (const s of SKILLS) {
    const l = document.createElement("label");
    l.innerHTML = `<span>${SKILL_NAMES[lang][s.id]}</span><input type="number" min="0" max="99" id="sk-${s.id}">`;
    box.append(l);
  }
}
function fillForm() {
  el("f-name").value = level.name.en;
  el("f-goal").value = level.goal.en;
  el("f-count").value = level.count; el("f-need").value = level.need;
  el("f-rate").value = level.rate; el("f-ttl").value = level.ttl;
  el("f-types").value = level.types || "";
  el("f-dir").value = String(level.hatch.dir || 1);
  for (const s of SKILLS) el("sk-" + s.id).value = level.skills[s.id] || 0;
  el("f-botnet").hidden = !level.botnet;
  if (level.botnet) {
    el("f-bcount").value = level.botnet.count; el("f-brate").value = level.botnet.rate;
    el("f-filter").checked = level.firewallRule === "junk";
  }
}
function readForm() {
  const raw = JSON.parse(JSON.stringify(level));
  raw.name = el("f-name").value; raw.goal = el("f-goal").value;
  raw.count = el("f-count").value; raw.need = el("f-need").value; raw.rate = el("f-rate").value; raw.ttl = el("f-ttl").value;
  raw.types = el("f-types").value || undefined;
  raw.hatch.dir = Number(el("f-dir").value);
  raw.skills = {};
  for (const s of SKILLS) raw.skills[s.id] = el("sk-" + s.id).value;
  if (raw.botnet) {
    raw.botnet.count = el("f-bcount").value; raw.botnet.rate = el("f-brate").value;
    raw.firewallRule = el("f-filter").checked ? "junk" : undefined;
  }
  level = sanitizeLevel(raw);
  saveDraft();
  draw();
}
document.querySelector(".ed-panel").addEventListener("change", ev => { if (ev.target.closest("#f-start, #f-code")) return; snapshot(); readForm(); });

function changed() {
  level = sanitizeLevel(level);
  fillForm();
  saveDraft();
  draw();
  el("ed-report").innerHTML = "";
}

/* ------------------------------------------------------------- check */
function check() {
  const out = [];
  const g = new PacketGame(level);
  const ex = level.exit;
  let fatal = false;
  if (!g.solid(ex.x, ex.y + 1)) { out.push(["bad", t("chk.noGround")]); fatal = true; }
  if (g.solid(ex.x, ex.y)) { out.push(["bad", t("chk.inside")]); fatal = true; }
  if (g.solid(level.hatch.x, level.hatch.y)) { out.push(["bad", t("chk.hatchInside")]); fatal = true; }
  if (!Object.keys(level.skills).length) out.push(["warn", t("chk.noSkills")]);
  if (!fatal) {
    out.unshift(["ok", t("chk.ok")]);
    const idle = new PacketGame(level);
    while (idle.state === "playing") idle.step();
    out.push(idle.state === "won" ? ["warn", t("chk.idleWins", { saved: idle.saved, need: level.need })] : ["ok", t("chk.idleLoses", { saved: idle.saved, need: level.need })]);
  }
  el("ed-report").innerHTML = out.map(([k, m]) => `<li class="${k}">${m}</li>`).join("");
  return !fatal;
}

/* the editor can reproduce every built-in level except those using routing,
   links or sessions, which it has no tools for yet */
const editable = l => !l.servers && !l.switches && !l.links && !l.session && !l.dests && !l.rateRange;

/* ------------------------------------------------------------- actions */
const gameUrl = () => location.href.replace(/[#?].*$/, "").replace(/editor\.html$/, "index.html");
el("btn-undo").onclick = () => { if (history.length) { level = sanitizeLevel(JSON.parse(history.pop())); changed(); } };
el("btn-check").onclick = check;
el("btn-test").onclick = () => {
  if (!check()) return;
  store.set("packetrush.custom", encodeLevel(level));
  location.href = gameUrl() + "#custom";
};
el("btn-share").onclick = () => {
  const url = gameUrl() + "#lvl=" + encodeLevel(level);
  const fail = () => { el("ed-note").textContent = t("note.copyFail") + " " + url; };
  try { navigator.clipboard.writeText(url).then(() => { el("ed-note").textContent = t("note.copied"); }, fail); } catch (e) { fail(); }
};
el("btn-start").onclick = () => {
  const v = el("f-start").value;
  snapshot();
  if (v === "blank") level = blankLevel();
  else {
    const src = PACKET_LEVELS[Number(v)];
    level = sanitizeLevel({ ...src, name: src.name[lang] || src.name.en, goal: "" });
  }
  changed();
  el("ed-note").textContent = t("note.loaded");
};
el("btn-load").onclick = () => {
  try { snapshot(); level = decodeLevel(el("f-code").value); changed(); el("ed-note").textContent = t("note.loaded"); }
  catch (e) { history.pop(); el("ed-note").textContent = t("note.bad", { why: e.message }); }
};

function applyText() {
  document.documentElement.lang = lang === "zh" ? "zh-CN" : "en";
  for (const n of document.querySelectorAll("[data-e]")) n.textContent = t(n.dataset.e);
  el("btn-lang").textContent = lang === "zh" ? "EN" : "中文";
  document.title = t("title") + " — Packet Rush";
  el("f-start").innerHTML = `<option value="blank">${t("blank")}</option>`
    + PACKET_LEVELS.map((l, i) => editable(l) ? `<option value="${i}">${i + 1} · ${l.name[lang] || l.name.en}</option>` : "").join("");
  buildTools();
  buildSkills();
  fillForm();
}
el("btn-lang").onclick = () => { lang = lang === "zh" ? "en" : "zh"; store.set("bitbuilder.lang", lang); applyText(); };

/* ------------------------------------------------------------- boot */
try {
  if (location.hash.startsWith("#lvl=")) level = decodeLevel(location.hash);
  else { const d = store.get("packetrush.draft", ""); if (d) level = decodeLevel(d); }
} catch (e) { level = blankLevel(); }
applyText();
draw();
