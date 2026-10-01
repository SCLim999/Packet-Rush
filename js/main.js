/* ============================================================================
   PACKET RUSH — game loop, rendering, input and interface text
   The engine (engine.js) knows nothing about the screen. This file runs it
   at TICK_HZ, draws the world at 2x, turns clicks into skill assignments, and
   remembers the language and theme between visits.
   ========================================================================== */

const TEXT = {
  en: {
    "lang.other": "中文",
    "app.title": "Packet Rush",
    "app.tagline": "Packets march blindly across the network. Give them jobs so enough of them reach the server.",
    "btn.osi": "OSI model",
    "bg.label": "Background", "bg.osi": "Background: OSI layers", "bg.tcpip": "Background: TCP/IP layers", "bg.datacentre": "Background: Data centre",
    "bg.osiRange": "OSI {range}",
    "osi.title": "The OSI model", "osi.sub": "Seven layers, each with one job. Data travels down the stack to be sent and back up to be received.",
    "osi.source": "Background reading:", "osi.layer": "Layer {n}", "osi.pdu": "unit: {pdu}", "osi.inGame": "In Packet Rush:",
    "osi.chip": "OSI layer {n} · {name}", "osi.chipAll": "All seven OSI layers",
    "tcpip.title": "The TCP/IP model", "tcpip.layer": "TCP/IP layer", "tcpip.osi": "OSI layers", "tcpip.job": "What it does", "tcpip.eg": "Examples",
    "btn.levels": "Levels", "btn.help": "How to play", "btn.close": "Close",
    "theme.label": "Theme", "theme.bright": "Theme: Bright", "theme.dark": "Theme: Dark",
    "theme.soft": "Theme: Soft", "theme.energy": "Theme: Energy", "theme.excited": "Theme: Excited",
    "btn.sound": "Sound: {state}", "state.on": "on", "state.off": "off",
    "hud.level": "Level {n}", "hud.out": "Out", "hud.in": "Delivered", "hud.need": "Need", "hud.lost": "Lost", "hud.ttl": "TTL",
    "mobile.rotate": "Turn your phone sideways for a bigger board.",
    "ctl.full": "Full screen", "ctl.exitFull": "Exit full screen",
    "view.3d": "View: 3D", "view.2d": "View: 2D",
    "view.hint": "3D view — drag empty space to tilt the camera, scroll or pinch to zoom, double-click to reset.",
    "ctl.pause": "Pause", "ctl.resume": "Resume", "ctl.fast": "Fast", "ctl.restart": "Restart", "ctl.nuke": "kill -9",
    "ctl.nukeConfirm": "Press again to end the run",
    "levels.title": "Levels", "levels.sub": "Deliver enough packets to unlock the next network.",
    "btn.class": "Class", "btn.editor": "Editor",
    "hud.custom": "Custom", "ov.freePlay": "Free play: every skill, unlimited — just get enough packets through alive.", "ov.customIntro": "Custom level — {name}", "ov.edit": "Edit this level", "ov.customGoal": "Release {count} packets · deliver at least {need}",
    "custom.bad": "This level link could not be opened: {why}. Playing level 1 instead.",
    "quiz.title": "Quick check", "quiz.layer": "Which OSI layer is the idea behind “{level}” on?",
    "quiz.pdu": "At layer {n}, {name}, what is the unit of data called?", "quiz.job": "Which layer does this job? “{job}”",
    "quiz.right": "Right!", "quiz.wrong": "Not quite — it is {answer}.", "quiz.tally": "Quiz score: {right}/{asked}",
    "class.title": "Classroom", "class.sub": "Enter your name and the class code your teacher gave you. When your teacher asks, copy your result code and send it to them — no account, nothing uploaded.",
    "class.name": "Your name", "class.code": "Class code", "class.result": "Your result code", "class.copy": "Copy result code",
    "class.teacher": "Teacher page", "class.copied": "Copied — paste it wherever your teacher asked.", "class.copyFail": "Could not copy automatically — the code is selected, copy it yourself.",
    "class.needName": "Type your name first.", "class.stars": "Stars", "class.cleared": "Levels cleared", "class.quiz": "Quiz", "class.streak": "Daily streak",
    "levels.byLayer": "By OSI layer", "levels.inOrder": "In order", "levels.challenges": "Challenge Pack",
    "ch.intro": "Four categories, four difficulties each — every stage is open, so pick any one. Easy is a good place to start a category.",
    "btn.challenges": "Challenges", "ch.all": "All",
    "ch.title": "{cat} · {diff} — {name}", "ch.locked": "clear {prev} first", "ch.hud": "{diff}", "ch.next": "Next: {diff}", "levels.worldStars": "★ {n}/{max}",
    "levels.best": "best {n}/{count}", "levels.none": "not delivered yet", "levels.locked": "locked",
    "ov.intro": "Level {n} — {name}", "ov.start": "Start",
    "ov.goal": "Release {count} packets · deliver at least {need}",
    "ov.won": "Delivered!", "ov.wonAll": "Every network is up!",
    "ov.lost": "Too much packet loss",
    "ov.lostText": "Only {saved} of the {need} packets you needed reached the server.",
    "ov.wonText": "{saved} of {count} packets reached the server — {need} were needed.",
    "ov.wonAllText": "Every network is delivering. Replay any level to beat your best.",
    "ov.next": "Next level", "ov.retry": "Try again", "ov.levels": "Levels", "ov.replay": "Replay",
    "ov.paused": "Paused", "ov.pausedText": "The network is frozen. Nothing moves until you resume.",
    "ov.concept": "Concept", "ov.newBest": "New best!",
    "loss.splat": "corrupted by a long fall", "loss.void": "dropped off the network",
    "loss.short": "shorted on a live wire", "loss.overflow": "overflowed",
    "loss.ttl": "TTL expired", "loss.firewall": "stayed on as a firewall",
    "loss.mitm": "intercepted by a man in the middle", "loss.refused": "refused by the overloaded server",
    "loss.timeout": "timed out at a closed session", "fx.timeout": "session timed out",
    "hud.skills": "Skills", "loss.misrouted": "delivered to the wrong address", "loss.congestion": "dropped by a congested link",
    "ctl.rate": "Release every",
    "stars.need2": "Deliver {n} packets for ★★.", "stars.need3": "Use {n} skill(s) or fewer for ★★★.", "stars.all": "Perfect — every star earned.",
    "daily.title": "Today's challenge", "daily.text": "Level {n} · {name}: earn ★★★ within {time}.",
    "daily.play": "Play", "daily.locked": "Unlock level {n} to take it on.", "daily.done": "Challenge complete — come back tomorrow.",
    "daily.streak": "Streak: {n} day(s)", "daily.won": "Daily challenge complete!", "daily.missed": "Daily challenge: ★★★ within {time} needed.",
    "hud.resent": "Resent", "hud.server": "Server", "server.up": "online", "server.down": "offline (503)",
    "fx.resend": "resent", "fx.down": "503 overloaded", "fx.up": "back online",
    "help.p4": "<b>Packet types:</b> blue packets are <b>TCP</b> — lost once, they are resent from the router. Orange packets are <b>UDP</b> — twice as fast, never resent. <b>Enemies:</b> red junk packets come from a <b>botnet</b> and knock the server offline when three get in; a red <b>man-in-the-middle</b> zone steals any packet that is not encrypted — a packet that tunnels carries a padlock and is safe.",
    "stat.saved": "Delivered", "stat.lost": "Lost", "stat.time": "Time",
    "note.pick": "Pick a skill, then click a packet to give it that job.",
    "note.none": "No <b>{skill}</b> left — try another skill.",
    "help.title": "How to play",
    "help.p1": "Packets drop out of the <b>router</b> and walk forward until they hit a wall, then turn around. They step up small ledges, but a fall that is too long <b>corrupts</b> them, and walking off the edge of the map <b>drops</b> them. There are <b>no walls at the sides of the screen</b>: a packet that walks off the edge falls out of the network. An <b>arrow and stripes</b> mark every drop — <b>amber</b> if the fall is safe, <b>red</b> if it is deadly.",
    "help.p2": "Choose a skill in the toolbar (or press <kbd>1</kbd>–<kbd>7</kbd>), then click a packet to give it that job. Each level hands out a limited number of each skill. Get enough packets into the <b>server</b> before their <b>TTL</b> — time to live — runs out.",
    "help.p3": "<kbd>P</kbd> pause · <kbd>F</kbd> fast forward · <kbd>V</kbd> 3D / 2D view · <kbd>G</kbd> full screen · <kbd>M</kbd> sound on / off · <kbd>R</kbd> restart · <kbd>K</kbd> twice: <b>kill -9</b> ends the run by overflowing every packet.",
    "foot.text": "A Lemmings-style networking puzzle. Mouse, keyboard or touch — no install, no plugins.",
    "skill.uplink": "Uplink", "skill.buffer": "Buffer", "skill.overflow": "Overflow", "skill.firewall": "Firewall",
    "skill.bridge": "Bridge", "skill.tunnel": "Tunnel", "skill.pipe": "Pipe",
    "sk.uplink": "climbs any wall it walks into. Stays with the packet.",
    "sk.buffer": "absorbs a fall of any height. Stays with the packet.",
    "sk.overflow": "the packet crashes on the spot and blows a hole five seconds later.",
    "sk.firewall": "stands still and turns back every packet that reaches it.",
    "sk.bridge": "lays twelve bricks of rising staircase.",
    "sk.tunnel": "digs sideways through silicon — never through shielded steel.",
    "sk.pipe": "digs straight down until it breaks through."
  },
  zh: {
    "lang.other": "EN",
    "app.title": "数据包大冲关",
    "app.tagline": "数据包只会盲目地向前走。给它们分配工作，让足够多的数据包到达服务器。",
    "btn.osi": "OSI 模型",
    "bg.label": "背景", "bg.osi": "背景：OSI 七层", "bg.tcpip": "背景：TCP/IP 四层", "bg.datacentre": "背景：数据中心",
    "bg.osiRange": "OSI {range}",
    "osi.title": "OSI 七层模型", "osi.sub": "七层结构，每层只负责一件事。发送时数据沿协议栈向下传递，接收时再向上传回。",
    "osi.source": "背景阅读：", "osi.layer": "第 {n} 层", "osi.pdu": "数据单位：{pdu}", "osi.inGame": "对应关卡：",
    "osi.chip": "OSI 第 {n} 层 · {name}", "osi.chipAll": "OSI 全部七层",
    "tcpip.title": "TCP/IP 四层模型", "tcpip.layer": "TCP/IP 层", "tcpip.osi": "对应 OSI 层", "tcpip.job": "作用", "tcpip.eg": "示例",
    "btn.levels": "关卡", "btn.help": "玩法说明", "btn.close": "关闭",
    "theme.label": "配色", "theme.bright": "配色：明亮", "theme.dark": "配色：暗夜",
    "theme.soft": "配色：柔和", "theme.energy": "配色：活力", "theme.excited": "配色：热烈",
    "btn.sound": "声音：{state}", "state.on": "开", "state.off": "关",
    "hud.level": "第 {n} 关", "hud.out": "已发出", "hud.in": "已送达", "hud.need": "需要", "hud.lost": "丢失", "hud.ttl": "TTL",
    "mobile.rotate": "把手机横过来，棋盘会更大。",
    "ctl.full": "全屏", "ctl.exitFull": "退出全屏",
    "view.3d": "视图：3D", "view.2d": "视图：2D",
    "view.hint": "3D 视图 —— 拖动空白处旋转镜头，滚轮或双指缩放，双击复位。",
    "ctl.pause": "暂停", "ctl.resume": "继续", "ctl.fast": "快进", "ctl.restart": "重来", "ctl.nuke": "kill -9",
    "ctl.nukeConfirm": "再按一次结束本局",
    "levels.title": "关卡", "levels.sub": "送达足够的数据包即可解锁下一个网络。",
    "btn.class": "班级", "btn.editor": "编辑器",
    "hud.custom": "自定义", "ov.freePlay": "自由模式：所有技能无限使用 —— 只要有足够的数据包存活送达。", "ov.customIntro": "自定义关卡 —— {name}", "ov.edit": "编辑这个关卡", "ov.customGoal": "发出 {count} 个数据包 · 至少送达 {need} 个",
    "custom.bad": "无法打开这个关卡链接：{why}。改为进入第 1 关。",
    "quiz.title": "小测验", "quiz.layer": "“{level}”背后的知识点属于 OSI 的哪一层？",
    "quiz.pdu": "第 {n} 层（{name}）的数据单位叫什么？", "quiz.job": "哪一层负责这项工作？“{job}”",
    "quiz.right": "答对了！", "quiz.wrong": "不对哦 —— 答案是{answer}。", "quiz.tally": "测验得分：{right}/{asked}",
    "class.title": "课堂", "class.sub": "输入你的名字和老师给的班级代码。老师需要时，复制你的成绩码发给老师 —— 无需注册，不上传任何数据。",
    "class.name": "你的名字", "class.code": "班级代码", "class.result": "你的成绩码", "class.copy": "复制成绩码",
    "class.teacher": "教师页面", "class.copied": "已复制 —— 粘贴到老师指定的地方即可。", "class.copyFail": "无法自动复制 —— 成绩码已选中，请手动复制。",
    "class.needName": "请先输入你的名字。", "class.stars": "星星", "class.cleared": "已通关", "class.quiz": "测验", "class.streak": "每日连续",
    "levels.byLayer": "按 OSI 层", "levels.inOrder": "按顺序", "levels.challenges": "挑战包",
    "ch.intro": "四个类别，每类四种难度 —— 所有关卡全部开放，随便挑。想入门某个类别，可以从简单级开始。",
    "btn.challenges": "挑战", "ch.all": "全部",
    "ch.title": "{cat} · {diff} —— {name}", "ch.locked": "先通关{prev}", "ch.hud": "{diff}", "ch.next": "下一关：{diff}", "levels.worldStars": "★ {n}/{max}",
    "levels.best": "最佳 {n}/{count}", "levels.none": "尚未送达", "levels.locked": "未解锁",
    "ov.intro": "第 {n} 关 —— {name}", "ov.start": "开始",
    "ov.goal": "发出 {count} 个数据包 · 至少送达 {need} 个",
    "ov.won": "送达成功！", "ov.wonAll": "所有网络都已接通！",
    "ov.lost": "丢包太多",
    "ov.lostText": "只有 {saved} 个数据包到达服务器，需要 {need} 个。",
    "ov.wonText": "{count} 个数据包中有 {saved} 个到达服务器 —— 需要 {need} 个。",
    "ov.wonAllText": "所有网络全部畅通。可以重玩任意关卡，刷新你的最佳成绩。",
    "ov.next": "下一关", "ov.retry": "再试一次", "ov.levels": "关卡", "ov.replay": "重玩",
    "ov.paused": "已暂停", "ov.pausedText": "网络已冻结，继续之前一切都不会动。",
    "ov.concept": "知识点", "ov.newBest": "新纪录！",
    "loss.splat": "摔得太远而损坏", "loss.void": "掉出了网络",
    "loss.short": "碰到带电导线短路", "loss.overflow": "溢出了",
    "loss.ttl": "TTL 耗尽", "loss.firewall": "留作防火墙",
    "loss.mitm": "被中间人截获", "loss.refused": "被过载的服务器拒绝",
    "loss.timeout": "在关闭的会话前超时", "fx.timeout": "会话超时",
    "hud.skills": "技能", "loss.misrouted": "送到了错误的地址", "loss.congestion": "被拥塞的链路丢弃",
    "ctl.rate": "发送间隔",
    "stars.need2": "送达 {n} 个数据包可得 ★★。", "stars.need3": "使用不超过 {n} 次技能可得 ★★★。", "stars.all": "完美 —— 拿到了全部星星。",
    "daily.title": "今日挑战", "daily.text": "第 {n} 关 · {name}：在 {time} 内拿到 ★★★。",
    "daily.play": "开始", "daily.locked": "解锁第 {n} 关后即可挑战。", "daily.done": "挑战完成 —— 明天再来。",
    "daily.streak": "连续：{n} 天", "daily.won": "今日挑战完成！", "daily.missed": "今日挑战：需要在 {time} 内拿到 ★★★。",
    "hud.resent": "重传", "hud.server": "服务器", "server.up": "在线", "server.down": "离线 (503)",
    "fx.resend": "重传", "fx.down": "503 过载", "fx.up": "恢复在线",
    "help.p4": "<b>数据包类型：</b>蓝色是 <b>TCP</b> —— 丢失一次会从路由器重新发送。橙色是 <b>UDP</b> —— 速度快一倍，但不会重传。<b>敌人：</b>红色垃圾包来自<b>僵尸网络</b>，三个进入服务器就会让它下线；红色的<b>中间人</b>区域会截获任何未加密的数据包 —— 挖过隧道的数据包带有锁形标志，是安全的。",
    "stat.saved": "送达", "stat.lost": "丢失", "stat.time": "用时",
    "note.pick": "先选一个技能，再点击一个数据包，把这项工作交给它。",
    "note.none": "<b>{skill}</b>已经用完了 —— 换个技能试试。",
    "help.title": "玩法说明",
    "help.p1": "数据包从<b>路由器</b>里掉出来，一直向前走，碰到墙就掉头。它们能迈上小台阶，但摔得太远会<b>损坏</b>，走出地图边缘会<b>丢失</b>。<b>屏幕两侧没有墙</b>：走出边缘的数据包会掉出网络。每个落差处都有<b>箭头和条纹</b>标记 —— <b>琥珀色</b>表示可以安全落下，<b>红色</b>表示会致命。",
    "help.p2": "在工具栏选择一个技能（或按 <kbd>1</kbd>–<kbd>7</kbd>），再点击一个数据包，把这项工作交给它。每关每种技能的数量有限。要在数据包的 <b>TTL</b>（生存时间）耗尽之前，把足够多的数据包送进<b>服务器</b>。",
    "help.p3": "<kbd>P</kbd> 暂停 · <kbd>F</kbd> 快进 · <kbd>V</kbd> 切换 3D / 2D · <kbd>G</kbd> 全屏 · <kbd>M</kbd> 声音开关 · <kbd>R</kbd> 重来 · 连按两次 <kbd>K</kbd>：<b>kill -9</b> 让所有数据包溢出，结束本局。",
    "foot.text": "旅鼠风格的网络解谜游戏。鼠标、键盘或触屏均可 —— 无需安装，无需插件。",
    "skill.uplink": "上行链路", "skill.buffer": "缓冲区", "skill.overflow": "溢出", "skill.firewall": "防火墙",
    "skill.bridge": "网桥", "skill.tunnel": "隧道", "skill.pipe": "管道",
    "sk.uplink": "碰到墙就往上爬。永久有效。",
    "sk.buffer": "从任何高度落下都不会损坏。永久有效。",
    "sk.overflow": "数据包当场崩溃，五秒后炸出一个洞。",
    "sk.firewall": "原地站定，把碰到它的数据包全部挡回去。",
    "sk.bridge": "铺出十二级向上的台阶。",
    "sk.tunnel": "横向挖穿硅层 —— 但挖不动屏蔽钢板。",
    "sk.pipe": "垂直向下挖，直到挖穿为止。"
  }
};

/* ------------------------------------------------------------ settings */
const store = {
  get(k, d) { try { const v = localStorage.getItem(k); return v === null ? d : v; } catch (e) { return d; } },
  set(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* storage disabled */ } }
};
let lang = store.get("bitbuilder.lang", (navigator.language || "en").toLowerCase().startsWith("zh") ? "zh" : "en");
/* The theme has its own key. "bitbuilder.theme" is still read and written for
   bright and dark: Bit Builder, the sister game, is served from the same
   GitHub Pages origin, so the two stay in step when both are played. */
let theme = store.get("packetrush.theme", store.get("bitbuilder.theme", "bright"));
let soundOn = store.get("packetrush.sound", "on") === "on";
/* What sits behind the play area: the OSI stack (default), the TCP/IP stack, or the data centre. */
let backdrop = store.get("packetrush.backdrop", "osi");
if (!["osi", "tcpip", "datacentre"].includes(backdrop)) backdrop = "osi";
let progress;
try { progress = JSON.parse(store.get("packetrush.progress", "")) || null; } catch (e) { progress = null; }
if (!progress || typeof progress !== "object") progress = { unlocked: 1, best: {} };
progress.stars = progress.stars || {};
progress.quiz = progress.quiz || { right: 0, asked: 0 };
progress.student = progress.student || { name: "", cls: "" };
progress.daily = progress.daily || {};

/* ------------------------------------------------------ daily challenge */
/* One level a day, the same for everyone on that date: earn three stars
   within the level's par time. */
const todayKey = () => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`; };
function dailyLevel(key = todayKey()) {
  let h = 2166136261;
  for (const c of key) h = Math.imul(h ^ c.charCodeAt(0), 16777619);
  return (h >>> 0) % PACKET_LEVELS.length;
}
function dailyStreak() {
  let n = 0;
  const d = new Date();
  if (!progress.daily[todayKey()]) d.setDate(d.getDate() - 1);    // today not done yet: count up to yesterday
  for (;;) {
    const k = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    if (!progress.daily[k]) return n;
    n++; d.setDate(d.getDate() - 1);
  }
}
let dailyRun = false;                       // the current run was started from the challenge card
const starText = n => "★".repeat(n) + `<span class="off">${"★".repeat(3 - n)}</span>`;

function t(key, vars) {
  let s = (TEXT[lang] && TEXT[lang][key]) || TEXT.en[key] || key;
  if (vars) for (const [k, v] of Object.entries(vars)) s = s.split("{" + k + "}").join(v);
  return s;
}
const L = obj => (obj ? obj[lang] || obj.en || "" : "");
const el = id => document.getElementById(id);

/* --------------------------------------------------------------- sound */
let audio = null;
function beep(freq, ms, type = "square", vol = 0.05, slide = 0) {
  if (!soundOn) return;
  try {
    audio = audio || new (window.AudioContext || window.webkitAudioContext)();
    const o = audio.createOscillator(), g = audio.createGain(), now = audio.currentTime;
    o.type = type;
    o.frequency.setValueAtTime(freq, now);
    if (slide) o.frequency.linearRampToValueAtTime(freq + slide, now + ms / 1000);
    g.gain.setValueAtTime(vol, now);
    g.gain.exponentialRampToValueAtTime(0.0001, now + ms / 1000);
    o.connect(g).connect(audio.destination);
    o.start(now);
    o.stop(now + ms / 1000);
  } catch (e) { /* no audio */ }
}

/* --------------------------------------------------------------- state */
const canvas = el("world");
const fxCanvas = el("fx");
const fx = fxCanvas.getContext("2d");
/* The 3D view needs WebGL2; without it the game simply stays flat. */
let r3 = null;
try { r3 = typeof createRenderer3D === "function" ? createRenderer3D(el("world3d")) : null; } catch (e) { r3 = null; }
let view3d = !!r3 && store.get("packetrush.view", "3d") === "3d";
let hoverScreen = null;           // pointer position in CSS pixels, for the 3D overlay
const ctx = canvas.getContext("2d");
const SCALE = canvas.width / LW;
const terrainCanvas = document.createElement("canvas");
terrainCanvas.width = LW; terrainCanvas.height = LH;
const tctx = terrainCanvas.getContext("2d");
const terrainImg = tctx.createImageData(LW, LH);

let levelIndex = 0;
let customLevel = null;               // a level from the editor or a share link; levelIndex is -1 while it plays
let game = null;
let selected = null;
let paused = false;
let fast = false;
let running = false;              // false while an overlay is up
let hover = null;                 // world coordinates of the pointer
let nukeArmed = 0;
let effects = [];
let acc = 0, last = 0, frame = 0;

/* -------------------------------------------------------------- colours */
/* One palette per theme. sky/grid paint the background, dirt/trace the
   circuit-board silicon, steel and brick the other two materials, and pulse
   makes the grid breathe (only the excited theme uses it). */
const THEMES = {
  bright:  { sky1: "#16233a", sky2: "#23405a", grid: [160, 220, 255, 0.07], dirt: [34, 128, 84], trace: [230, 190, 80], via: [250, 230, 150], steel: [128, 142, 160], brick: [240, 160, 50], rack: "#1a2a40", rackLine: "#2c4262", leds: ["#4ade80", "#45d0e0", "#f5a524"], pulse: "#7fe7f2", light: [150, 210, 255], floor: "#131f31" },
  dark:    { sky1: "#05080d", sky2: "#0b1624", grid: [69, 208, 224, 0.05], dirt: [22, 92, 60], trace: [201, 162, 58], via: [240, 220, 140], steel: [96, 108, 124], brick: [214, 139, 38], rack: "#0b1320", rackLine: "#18263a", leds: ["#4ade80", "#45d0e0", "#f5a524"], pulse: "#45d0e0", light: [90, 170, 220], floor: "#070c14" },
  soft:    { sky1: "#e8e6fb", sky2: "#fdebf1", grid: [120, 100, 180, 0.09], dirt: [150, 208, 184], trace: [246, 196, 160], via: [255, 240, 225], steel: [178, 184, 208], brick: [243, 170, 150], rack: "#dcd6f0", rackLine: "#c6bee3", leds: ["#6cc59f", "#8fa8ee", "#f0a878"], pulse: "#8fa8ee", light: [255, 255, 255], floor: "#e2dcf2" },
  energy:  { sky1: "#0a2a44", sky2: "#0f5a66", grid: [34, 211, 238, 0.10], dirt: [16, 150, 118], trace: [255, 160, 40], via: [255, 236, 160], steel: [92, 126, 156], brick: [255, 118, 54], rack: "#0b3149", rackLine: "#15506f", leds: ["#a3e635", "#22d3ee", "#ff8f2e"], pulse: "#ffb35c", light: [120, 230, 255], floor: "#082233" },
  excited: { sky1: "#2a0a4a", sky2: "#7a1a72", grid: [255, 79, 216, 0.10], dirt: [118, 42, 176], trace: [255, 225, 77], via: [255, 255, 200], steel: [150, 128, 200], brick: [255, 92, 184], pulse: true, rack: "#3b1060", rackLine: "#5a1d88", leds: ["#ff4fd8", "#ffe14d", "#3dfcb4"], pulse: "#ff7ae3", light: [255, 120, 230], floor: "#240940" }
};
function palette() { return THEMES[theme] || THEMES.bright; }

/* The terrain is repainted into an ImageData whenever the engine carves or
   builds. Silicon gets a circuit-board pattern of gold traces and vias, steel
   gets rivets, bricks get mortar lines; every exposed top edge is lit. */
function paintTerrain() {
  const pal = palette(), d = terrainImg.data, map = game.map;
  for (let y = 0; y < LH; y++) {
    for (let x = 0; x < LW; x++) {
      const i = y * LW + x, o = i * 4, m = map[i];
      if (m === M.EMPTY) { d[o + 3] = 0; continue; }
      let c;
      const top = y === 0 || map[i - LW] === M.EMPTY;
      const side = (x > 0 && map[i - 1] === M.EMPTY) || (x < LW - 1 && map[i + 1] === M.EMPTY);
      if (m === M.DIRT) {
        const traceH = y % 12 === 5 && (x + (y >> 3) * 17) % 48 < 30;
        const traceV = x % 16 === 9 && (y + (x >> 4) * 11) % 36 < 20;
        const via = x % 16 === 9 && y % 12 === 5;
        c = via ? pal.via : traceH || traceV ? pal.trace : pal.dirt;
        const n = ((x * 73856093) ^ (y * 19349663)) & 7;
        c = [c[0] + n - 3, c[1] + n - 3, c[2] + n - 3];
      } else if (m === M.STEEL) {
        const rivet = x % 10 === 2 && y % 10 === 2;
        const seam = x % 20 === 0 || y % 20 === 0;
        c = rivet ? [210, 220, 232] : seam ? pal.steel.map(v => v - 30) : pal.steel;
      } else if (m === M.GATE) {                          // session gate: violet bars
        c = x % 3 === 0 ? [196, 181, 253] : [109, 40, 217];
      } else {
        const mortar = y % 2 === 0 && x % 6 === 0;
        c = mortar ? pal.brick.map(v => v - 60) : pal.brick;
      }
      if (top) c = c.map(v => Math.min(255, v + 55));
      else if (side) c = c.map(v => Math.min(255, v + 20));
      d[o] = c[0]; d[o + 1] = c[1]; d[o + 2] = c[2]; d[o + 3] = 255;
    }
  }
  tctx.putImageData(terrainImg, 0, 0);
  game.dirty = false;
}

/* ----------------------------------------------------------- rendering */
const STATE_COLOR = { block: "#f87171", build: "#f5a524", bash: "#c084fc", dig: "#60a5fa", crash: "#fb7185" };

/* The data centre behind the play area (layout in backdrop.js). The still
   parts are drawn once per theme into a cached layer at screen resolution;
   status lights, data pulses and drifting bits are drawn live on top. */
const reduceMotion = (() => { try { return matchMedia("(prefers-reduced-motion: reduce)").matches; } catch (e) { return false; } })();
const backdropCanvas = document.createElement("canvas");
backdropCanvas.width = LW * SCALE; backdropCanvas.height = LH * SCALE;
let backdropFor = null;

const rgba = (hex, a) => {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${n >> 16},${(n >> 8) & 255},${n & 255},${a})`;
};

function paintBackdrop(pal) {
  const b = backdropCanvas.getContext("2d");
  b.setTransform(SCALE, 0, 0, SCALE, 0, 0);
  const light = pal.sky1.startsWith("#e") || pal.sky1.startsWith("#f");

  const g = b.createLinearGradient(0, 0, 0, LH);
  g.addColorStop(0, pal.sky1); g.addColorStop(1, pal.sky2);
  b.fillStyle = g;
  b.fillRect(0, 0, LW, LH);

  /* ceiling lights wash the top of the room */
  const [lr, lg, lb] = pal.light;
  for (const x of BACKDROP.lights) {
    const r = b.createRadialGradient(x, 0, 2, x, 0, 120);
    r.addColorStop(0, `rgba(${lr},${lg},${lb},${light ? 0.55 : 0.16})`);
    r.addColorStop(1, `rgba(${lr},${lg},${lb},0)`);
    b.fillStyle = r;
    b.fillRect(x - 120, 0, 240, 120);
    b.fillStyle = `rgba(${lr},${lg},${lb},${light ? 0.9 : 0.5})`;
    b.fillRect(x - 14, 0, 28, 2);
  }

  /* faint wall grid */
  const [gr, gg, gb, ga] = pal.grid;
  b.strokeStyle = `rgba(${gr},${gg},${gb},${ga * 0.7})`;
  b.lineWidth = 0.5;
  b.beginPath();
  for (let x = 0; x <= LW; x += 20) { b.moveTo(x, 0); b.lineTo(x, LH); }
  for (let y = 0; y <= LH; y += 20) { b.moveTo(0, y); b.lineTo(LW, y); }
  b.stroke();

  /* two rows of racks: the far row fainter, so the room has depth */
  for (const r of BACKDROP.racks) {
    const far = r.depth === "far";
    b.globalAlpha = far ? (light ? 0.45 : 0.5) : (light ? 0.75 : 0.85);
    b.fillStyle = pal.rack;
    b.fillRect(r.x, r.y, r.w, r.h);
    b.fillStyle = pal.rackLine;
    b.fillRect(r.x, r.y, r.w, 2);                        // top cap
    b.fillRect(r.x, r.y, 1, r.h);                        // posts
    b.fillRect(r.x + r.w - 1, r.y, 1, r.h);
    b.globalAlpha *= 0.55;
    for (let y = r.y + 4; y < LH; y += r.slot) {         // one line per unit
      b.fillRect(r.x + 2, y, r.w - 4, 0.6);
    }
    for (let y = r.y + 6; y < LH; y += r.slot * 4) {     // vent dots
      for (let x = r.x + 4; x < r.x + r.w - 9; x += 2.5) b.fillRect(x, y + 1.2, 1, 1);
    }
    b.globalAlpha = 1;
  }

  /* cable tray, hangers and drooping cables */
  const t = BACKDROP.tray;
  b.fillStyle = pal.rackLine;
  for (const x of BACKDROP.hangers) b.fillRect(x, 0, 1, t.y);
  b.fillRect(0, t.y, LW, t.h);
  b.fillStyle = pal.rack;
  b.fillRect(0, t.y + 1, LW, t.h - 2);
  b.lineWidth = 0.8;
  pal.leds.forEach((c, i) => {
    b.strokeStyle = rgba(c, light ? 0.45 : 0.35);
    b.beginPath();
    for (let k = 0; k < BACKDROP.hangers.length - 1; k++) {
      const x0 = BACKDROP.hangers[k] + i * 6, x1 = BACKDROP.hangers[k + 1] + i * 6;
      b.moveTo(x0, t.y + t.h);
      b.quadraticCurveTo((x0 + x1) / 2, t.y + t.h + 7 + i * 2, x1, t.y + t.h);
    }
    b.stroke();
  });
  b.strokeStyle = rgba(pal.pulse, light ? 0.35 : 0.22);
  b.lineWidth = 0.6;
  b.beginPath();
  for (const y of BACKDROP.fibres) { b.moveTo(0, y); b.lineTo(LW, y); }
  b.stroke();

  /* vignette */
  const v = b.createRadialGradient(LW / 2, LH / 2, LH * 0.35, LW / 2, LH / 2, LW * 0.62);
  v.addColorStop(0, "rgba(0,0,0,0)");
  v.addColorStop(1, light ? "rgba(90,70,140,0.12)" : "rgba(0,0,0,0.38)");
  b.fillStyle = v;
  b.fillRect(0, 0, LW, LH);
  backdropFor = pal;
}

/* ------------------------------------------------ the protocol-stack backdrop */
const layerCanvas = document.createElement("canvas");
layerCanvas.width = LW * SCALE; layerCanvas.height = LH * SCALE;
let layerKey = "";

const isLight = pal => pal.sky1.startsWith("#e") || pal.sky1.startsWith("#f");
const currentBands = () => layerBands(backdrop, game ? game.level.osi : []);

/* Name and data unit for a band, in the current language. */
function bandLabel(band) {
  if (backdrop === "tcpip") {
    const tl = TCPIP_LAYERS[["app", "transport", "internet", "link"].indexOf(band.key)], nums = band.nums;
    return { badge: "", name: L(tl.name), sub: t("bg.osiRange", { range: nums.length > 1 ? `${nums[nums.length - 1]}–${nums[0]}` : nums[0] }) };
  }
  const l = OSI_LAYERS.find(x => x.n === band.nums[0]);
  return { badge: String(l.n), name: L(l.name), sub: L(l.pdu) };
}

function paintLayers(pal, bands) {
  const b = layerCanvas.getContext("2d"), light = isLight(pal);
  b.setTransform(SCALE, 0, 0, SCALE, 0, 0);
  const g = b.createLinearGradient(0, 0, 0, LH);
  g.addColorStop(0, pal.sky1); g.addColorStop(1, pal.sky2);
  b.fillStyle = g;
  b.fillRect(0, 0, LW, LH);
  for (const band of bands) {
    const a = band.focus ? (light ? 0.30 : 0.20) : (light ? 0.13 : 0.08);
    b.fillStyle = rgba(band.color, a);
    b.fillRect(0, band.y0, LW, band.y1 - band.y0);
    b.fillStyle = rgba(band.color, band.focus ? 0.8 : 0.4);
    b.fillRect(0, band.y0, LW, band.focus ? 0.9 : 0.5);                 // divider
    if (band.focus) b.fillRect(0, band.y0, 2.5, band.y1 - band.y0);       // marker on the edge
    /* label on the left: badge, name, data unit */
    const lab = bandLabel(band), cy = (band.y0 + band.y1) / 2;
    let x = 6;
    b.textBaseline = "middle";
    if (lab.badge) {
      b.fillStyle = rgba(band.color, band.focus ? 0.95 : 0.6);
      b.beginPath(); b.roundRect ? b.roundRect(x, cy - 5, 10, 10, 2) : b.rect(x, cy - 5, 10, 10); b.fill();
      b.fillStyle = "#0b1020";
      b.font = "bold 7px ui-sans-serif, system-ui, sans-serif";
      b.textAlign = "center";
      b.fillText(lab.badge, x + 5, cy + 0.4);
      x += 14;
    }
    b.textAlign = "left";
    b.fillStyle = rgba(band.color, band.focus ? 0.95 : (light ? 0.7 : 0.6));
    b.font = `bold 7.5px ui-sans-serif, system-ui, sans-serif`;
    b.fillText(lab.name, x, cy - 3);
    b.font = `6px ui-sans-serif, system-ui, sans-serif`;
    b.fillStyle = rgba(band.color, band.focus ? 0.8 : 0.45);
    b.fillText(lab.sub, x, cy + 5);
    b.textBaseline = "alphabetic";
  }
  const v = b.createRadialGradient(LW / 2, LH / 2, LH * 0.4, LW / 2, LH / 2, LW * 0.65);
  v.addColorStop(0, "rgba(0,0,0,0)");
  v.addColorStop(1, light ? "rgba(90,70,140,0.10)" : "rgba(0,0,0,0.32)");
  b.fillStyle = v;
  b.fillRect(0, 0, LW, LH);
}

function drawLayers(pal) {
  const bands = currentBands();
  const key = [theme, backdrop, lang, bands.map(x => x.focus ? 1 : 0).join("")].join("|");
  if (key !== layerKey) { paintLayers(pal, bands); layerKey = key; }
  ctx.drawImage(layerCanvas, 0, 0, LW, LH);
  const f = reduceMotion ? 0 : frame, light = isLight(pal);
  const focus = new Set(game ? game.level.osi : []);
  ctx.save();
  ctx.beginPath(); ctx.rect(70, 0, LW - 70, LH); ctx.clip();          // keep the labels clear
  drawLayerMotifs(ctx, f, light, focus);
  ctx.restore();
  drawEncapsulation(ctx, reduceMotion ? 200 : frame, light);
}

function drawBackground(pal) {
  if (backdrop !== "datacentre") { drawLayers(pal); return; }
  if (backdropFor !== pal) paintBackdrop(pal);
  ctx.drawImage(backdropCanvas, 0, 0, LW, LH);
  const light = pal.sky1.startsWith("#e") || pal.sky1.startsWith("#f");
  const f = reduceMotion ? 0 : frame;

  for (const l of BACKDROP.leds) {
    if (!reduceMotion && !BACKDROP.ledOn(l, f)) continue;
    ctx.fillStyle = rgba(pal.leds[l.color], l.depth === "far" ? 0.55 : 0.9);
    ctx.fillRect(l.x, l.y, 1.4, 1);
  }
  if (!reduceMotion) {
    for (const p of BACKDROP.pulses) {
      const { x, y } = BACKDROP.pulseAt(p, f);
      const tail = x - p.dir * p.len;
      const g = ctx.createLinearGradient(tail, 0, x, 0);
      g.addColorStop(0, rgba(pal.pulse, 0));
      g.addColorStop(1, rgba(pal.pulse, light ? 0.8 : 0.9));
      ctx.fillStyle = g;
      ctx.fillRect(Math.min(x, tail), y - 0.6, p.len, 1.2);
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(x - 0.6, y - 0.6, 1.2, 1.2);
    }
    ctx.textAlign = "center";
    for (const bit of BACKDROP.bits) {
      const { x, y } = BACKDROP.bitAt(bit, f);
      ctx.fillStyle = rgba(pal.pulse, light ? 0.22 : 0.16);
      ctx.font = `${bit.size}px ui-monospace, monospace`;
      ctx.fillText(bit.ch, x, y);
    }
  }
}

function drawRouter(h, accent = "#45d0e0") {
  const x = h.x - 12, y = h.y - 14;
  ctx.fillStyle = "#1e293b";
  ctx.fillRect(x, y, 24, 9);
  ctx.strokeStyle = accent;
  ctx.lineWidth = 0.75;
  ctx.strokeRect(x + 0.5, y + 0.5, 23, 8);
  for (let i = 0; i < 4; i++) {           // blinking link lights
    const on = ((frame >> 3) + i * 3) % 5 < 3;
    ctx.fillStyle = on ? (accent === "#45d0e0" ? (i % 2 ? "#4ade80" : "#f5a524") : accent) : "#334155";
    ctx.fillRect(x + 3 + i * 3, y + 3, 1.5, 1.5);
  }
  ctx.fillStyle = "#94a3b8";                // antennae
  ctx.fillRect(x + 3, y - 5, 1, 5);
  ctx.fillRect(x + 20, y - 5, 1, 5);
  ctx.fillStyle = "#0f172a";                // the slot packets drop out of
  ctx.fillRect(h.x - 5, y + 8, 10, 2);
}

function drawServer(ex, si = 0) {
  const x = ex.x - 9, y = ex.y - 22;
  ctx.fillStyle = "#1e293b";
  ctx.fillRect(x, y, 18, 23);
  ctx.strokeStyle = "#4ade80";
  ctx.lineWidth = 0.75;
  ctx.strokeRect(x + 0.5, y + 0.5, 17, 22);
  for (let i = 0; i < 3; i++) {             // drive bays
    ctx.fillStyle = "#334155";
    ctx.fillRect(x + 2, y + 2 + i * 3, 14, 2);
    ctx.fillStyle = (frame + i * 7) % 20 < 10 ? "#4ade80" : "#166534";
    ctx.fillRect(x + 13, y + 2.5 + i * 3, 1.5, 1);
  }
  const glow = 0.55 + 0.35 * Math.sin(frame / 8);
  const down = game.downTicks > 0;
  ctx.fillStyle = down ? `rgba(248,113,113,${0.5 + 0.4 * (frame % 10 < 5)})` : `rgba(74,222,128,${glow})`;   // the port
  ctx.fillRect(ex.x - 4, ex.y - 11, 8, 12);
  ctx.fillStyle = "rgba(255,255,255,0.8)";
  ctx.fillRect(ex.x - 1, ex.y - 13, 2, 1);
  if (ex.addr) {                                          // address plate in the server's colour
    ctx.fillStyle = DEST_COLOR[si];
    ctx.fillRect(x, y + 23, 18, 1.2);
    ctx.font = "bold 5px ui-monospace, monospace";
    ctx.textAlign = "center";
    ctx.fillText(ex.addr, ex.x, y - (down ? 10 : 3));
  }
  if (down) {
    ctx.fillStyle = "#f87171";
    ctx.font = "bold 7px ui-monospace, monospace";
    ctx.textAlign = "center";
    ctx.fillText("503", ex.x, y - 3);
  } else if (game.botnet && game.load > 0) {            // how close the server is to falling over
    for (let i = 0; i < game.server.capacity; i++) {
      ctx.fillStyle = i < game.load ? "#fb923c" : "#334155";
      ctx.fillRect(x + 2 + i * 5, y - 3, 4, 1.5);
    }
  }
}

/* A man-in-the-middle zone: a watched patch of network with a scanning line. */
function drawMitm(z) {
  ctx.fillStyle = "rgba(248,113,113,0.10)";
  ctx.fillRect(z.x, z.y, z.w, z.h);
  ctx.strokeStyle = "rgba(248,113,113,0.7)";
  ctx.lineWidth = 0.6;
  ctx.setLineDash([3, 2]);
  ctx.strokeRect(z.x + 0.3, z.y + 0.3, z.w - 0.6, z.h - 0.6);
  ctx.setLineDash([]);
  const sy = z.y + ((frame * 0.6) % z.h);
  ctx.fillStyle = "rgba(248,113,113,0.35)";
  ctx.fillRect(z.x, sy, z.w, 0.8);
  const cx = z.x + z.w / 2, cy = z.y - 5;                // the eye
  ctx.fillStyle = "#1e293b";
  ctx.beginPath(); ctx.ellipse(cx, cy, 7, 3.6, 0, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = "#f87171"; ctx.lineWidth = 0.8;
  ctx.beginPath(); ctx.ellipse(cx, cy, 7, 3.6, 0, 0, Math.PI * 2); ctx.stroke();
  const look = Math.sin(frame / 25) * 3;
  ctx.fillStyle = "#f87171";
  ctx.beginPath(); ctx.arc(cx + look, cy, 1.8, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = "rgba(248,113,113,0.85)";
  ctx.font = "bold 5px ui-monospace, monospace";
  ctx.textAlign = "center";
  ctx.fillText("MITM", cx, z.y + 6);
}

const KIND_COLOR = { tcp: "#93c5fd", udp: "#fdba74" };
/* destination colours for routed levels: server A, B, C, D */
const DEST_COLOR = ["#22d3ee", "#f472b6", "#a3e635", "#fbbf24"];

/* Edges of the world. The screen sides are walls packets turn around at,
   drawn as a striped boundary; every drop a packet would fall from gets
   warning stripes on its lip — amber if the fall is survivable, red (with a
   red line down the cliff) if it is deadly. */
function drawBounds() {
  for (const x of [0, LW - 3]) {
    ctx.fillStyle = "#334155";
    ctx.fillRect(x, 0, 3, LH);
    for (let y = (frame >> 1) % 8 - 8; y < LH; y += 8) {
      ctx.fillStyle = "#facc15";
      ctx.beginPath();
      ctx.moveTo(x, y); ctx.lineTo(x + 3, y + 3); ctx.lineTo(x + 3, y + 6); ctx.lineTo(x, y + 3); ctx.fill();
    }
    ctx.fillStyle = "rgba(69,208,224,0.7)";
    ctx.fillRect(x === 0 ? 3 : x - 0.6, 0, 0.6, LH);
  }
}
function drawEdges() {
  for (const e of game.edges()) {
    const x0 = e.dir > 0 ? e.x - 7 : e.x, hot = e.deadly ? "#ef4444" : "#f59e0b";
    for (let i = 0; i < 8; i++) {
      ctx.fillStyle = (i + (e.dir > 0 ? 0 : 1)) % 2 ? "#111827" : hot;
      ctx.fillRect(x0 + i, e.y + 1, 1, 2);
    }
    /* a small arrow over the lip, pointing down the drop */
    const ax = e.x + e.dir * 1.5, ay = e.y - 8 + Math.sin(frame / 6) * 1.2;
    ctx.fillStyle = hot;
    ctx.globalAlpha = 0.85;
    ctx.beginPath();
    ctx.moveTo(ax - 2.5, ay); ctx.lineTo(ax + 2.5, ay); ctx.lineTo(ax, ay + 3); ctx.closePath();
    ctx.fill();
    ctx.globalAlpha = 1;
    if (e.deadly) {
      const lip = e.dir > 0 ? e.x + 1 : e.x - 0.6;
      const len = Math.min(e.drop === Infinity ? 22 : e.drop, 22);
      const g = ctx.createLinearGradient(0, e.y + 1, 0, e.y + 1 + len);
      g.addColorStop(0, "rgba(239,68,68,0.9)"); g.addColorStop(1, "rgba(239,68,68,0)");
      ctx.fillStyle = g;
      ctx.fillRect(lip, e.y + 1, 0.6, len);
    }
  }
}

/* The handshake plate and the state of the session it controls. */
function drawSession(se) {
  const pl = se.plate, on = se.ticks > 0;
  ctx.fillStyle = on ? "#a78bfa" : "#4c1d95";
  ctx.fillRect(pl.x, pl.y - 0.5, pl.w, 1.6);
  ctx.fillStyle = on ? "rgba(167,139,250,0.25)" : "rgba(76,29,149,0.2)";
  ctx.fillRect(pl.x, pl.y - 6, pl.w, 5.5);
  /* countdown ring above the gate */
  const g = se.gate, cx = g.x + g.w / 2, cy = g.y - 8;
  ctx.strokeStyle = "rgba(167,139,250,0.35)"; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.arc(cx, cy, 4, 0, Math.PI * 2); ctx.stroke();
  if (on) {
    ctx.strokeStyle = "#a78bfa";
    ctx.beginPath(); ctx.arc(cx, cy, 4, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * se.ticks / se.timeout); ctx.stroke();
  }
  ctx.fillStyle = on ? "#c4b5fd" : "#7c3aed";
  ctx.font = "bold 4.5px ui-monospace, monospace";
  ctx.textAlign = "center";
  ctx.fillText(on ? "OPEN" : "CLOSED", cx, cy - 6.5);
}

/* A congestion-prone link: a duct with a load meter. */
function drawLink(l) {
  const full = l.load >= l.capacity;
  ctx.fillStyle = full ? "rgba(248,113,113,0.12)" : "rgba(56,189,248,0.08)";
  ctx.fillRect(l.x, l.y, l.w, l.h);
  ctx.strokeStyle = full ? "rgba(248,113,113,0.8)" : "rgba(56,189,248,0.6)";
  ctx.lineWidth = 0.6;
  ctx.strokeRect(l.x + 0.3, l.y + 0.3, l.w - 0.6, l.h - 0.6);
  for (let i = 0; i < l.capacity; i++) {
    ctx.fillStyle = i < l.load ? (full ? "#f87171" : "#38bdf8") : "rgba(148,163,184,0.35)";
    ctx.fillRect(l.x + l.w / 2 - l.capacity * 3 + i * 6, l.y + 3, 5, 2.5);
  }
  ctx.fillStyle = full ? "#f87171" : "#7dd3fc";
  ctx.font = "bold 5px ui-monospace, monospace";
  ctx.textAlign = "center";
  ctx.fillText(`${l.load}/${l.capacity}`, l.x + l.w / 2, l.y + 11);
}

/* A route switch: a post with an arrow showing which way it sends packets. */
function drawSwitch(s, hot) {
  const col = hot ? "#ffffff" : "#facc15";
  ctx.fillStyle = "#334155";
  ctx.fillRect(s.x - 0.5, s.y - 13, 1, 13);
  ctx.fillStyle = "#1e293b";
  ctx.fillRect(s.x - 6, s.y - 19, 12, 7);
  ctx.strokeStyle = col; ctx.lineWidth = 0.7;
  ctx.strokeRect(s.x - 6, s.y - 19, 12, 7);
  ctx.fillStyle = col;
  ctx.beginPath();
  const d = s.dir;
  ctx.moveTo(s.x + d * 4.5, s.y - 15.5); ctx.lineTo(s.x + d * 0.5, s.y - 18); ctx.lineTo(s.x + d * 0.5, s.y - 13); ctx.closePath();
  ctx.fill();
  ctx.fillRect(s.x - d * 3.5 - (d > 0 ? 0 : 4), s.y - 16.2, 4, 1.4);
}

/* A tiny padlock for encrypted packets. */
function drawLock(x, y) {
  ctx.fillStyle = "#facc15";
  ctx.fillRect(x - 1.8, y - 1, 3.6, 2.6);
  ctx.strokeStyle = "#facc15"; ctx.lineWidth = 0.6;
  ctx.beginPath(); ctx.arc(x, y - 1, 1.2, Math.PI, 0); ctx.stroke();
}

function drawHazard(h) {
  ctx.fillStyle = "rgba(15,23,42,0.85)";
  ctx.fillRect(h.x, h.y, h.w, h.h);
  ctx.strokeStyle = "#facc15";
  ctx.lineWidth = 0.8;
  ctx.beginPath();
  for (let row = 0; row < 2; row++) {
    const yy = h.y + h.h - 3 - row * 5;
    ctx.moveTo(h.x, yy);
    for (let x = h.x; x <= h.x + h.w; x += 4) {
      ctx.lineTo(x, yy + (((x + frame * (row ? 1 : -1)) >> 2) % 2 ? -2 : 2));
    }
  }
  ctx.stroke();
  if (frame % 6 < 3) {                      // sparks
    ctx.fillStyle = "#fef08a";
    const sx = h.x + ((frame * 37) % h.w), sy = h.y + h.h - 6 - ((frame * 13) % 6);
    ctx.fillRect(sx, sy, 1, 1);
  }
}

/* A packet is a little envelope on legs. Colour and props show its job. */
function drawPacket(p, highlight) {
  const x = p.x, y = p.y, f = p.dir;
  const body = p.junk ? "#fca5a5"
    : STATE_COLOR[p.state] || KIND_COLOR[p.kind] || (p.climber || p.floater ? "#a7f3d0" : "#e0f2fe");

  if (p.kind === "udp" && p.state === "walk") {             // UDP: speed lines behind it
    ctx.fillStyle = "rgba(253,186,116,0.6)";
    ctx.fillRect(x - f * 6 - 1.5, y - 7, 2.5, 0.6);
    ctx.fillRect(x - f * 7 - 1.5, y - 5, 3, 0.6);
  }

  if (p.state === "fall" && p.floater && p.fall >= 12) {   // the buffer opens like a canopy
    ctx.fillStyle = "#45d0e0";
    ctx.beginPath();
    ctx.arc(x, y - 11, 5, Math.PI, 0);
    ctx.fill();
    ctx.strokeStyle = "#e0f2fe";
    ctx.lineWidth = 0.4;
    ctx.beginPath();
    ctx.moveTo(x - 5, y - 11); ctx.lineTo(x - 2, y - 7);
    ctx.moveTo(x + 5, y - 11); ctx.lineTo(x + 2, y - 7);
    ctx.stroke();
  }

  /* legs */
  ctx.fillStyle = "#94a3b8";
  const walkingish = p.state === "walk" || p.state === "bash";
  const phase = walkingish ? (p.anim >> 1) % 4 : 0;
  const la = [0, 1, 0, -1][phase];
  if (p.state === "climb") {
    ctx.fillRect(x + f * 1.5, y - 2 - ((p.anim >> 1) % 2), 1, 2);
    ctx.fillRect(x + f * 1.5, y - 5 + ((p.anim >> 1) % 2), 1, 2);
  } else {
    ctx.fillRect(x - 2 + la * 0.5, y - 2, 1, 2.5);
    ctx.fillRect(x + 1 - la * 0.5, y - 2, 1, 2.5);
  }

  /* envelope */
  const bx = p.state === "climb" ? x - 3 + f * -1 : x - 3.5;
  const by = y - 8;
  ctx.fillStyle = body;
  ctx.fillRect(bx, by, 7, 6);
  ctx.strokeStyle = "#0f172a";
  ctx.lineWidth = 0.5;
  ctx.strokeRect(bx + 0.25, by + 0.25, 6.5, 5.5);
  ctx.beginPath();
  ctx.moveTo(bx + 0.25, by + 0.25);
  ctx.lineTo(bx + 3.5, by + 3);
  ctx.lineTo(bx + 6.75, by + 0.25);
  ctx.stroke();
  ctx.fillStyle = "#0f172a";                // eye, looking where it walks
  if (p.junk) {                             // junk: crossed-out eyes
    ctx.strokeStyle = "#7f1d1d"; ctx.lineWidth = 0.5;
    const ex = bx + 3.5 + f * 1.6;
    ctx.beginPath(); ctx.moveTo(ex - 0.8, by + 3); ctx.lineTo(ex + 0.8, by + 4.6); ctx.moveTo(ex + 0.8, by + 3); ctx.lineTo(ex - 0.8, by + 4.6); ctx.stroke();
  } else {
    ctx.fillRect(bx + 3.5 + f * 1.8 - 0.5, by + 3.4, 1, 1);
  }
  if (p.encrypted) drawLock(x, by - 2.5);
  if (p.dest !== undefined && !p.junk) {        // destination tag
    ctx.fillStyle = DEST_COLOR[p.dest];
    ctx.fillRect(bx + 1, by - 2, 5, 1.6);
  }
  if (p.retry) {                            // a resent copy
    ctx.strokeStyle = "#93c5fd"; ctx.lineWidth = 0.5;
    ctx.beginPath(); ctx.arc(bx - 1.5, by + 1, 1.3, 0.3, Math.PI * 1.7); ctx.stroke();
  }

  if (p.climber) { ctx.fillStyle = "#4ade80"; ctx.fillRect(bx, by + 5, 7, 0.8); }

  switch (p.state) {
    case "block":                           // arms out, a wall of flame each side
      ctx.fillStyle = "#f87171";
      ctx.fillRect(x - 6, y - 6, 2.5, 1);
      ctx.fillRect(x + 3.5, y - 6, 2.5, 1);
      ctx.fillStyle = (frame >> 2) % 2 ? "#fb923c" : "#facc15";
      ctx.fillRect(x - 7, y - 9 + ((frame >> 2) % 2), 1, 3);
      ctx.fillRect(x + 6, y - 9 + (((frame >> 2) + 1) % 2), 1, 3);
      break;
    case "build":
      ctx.fillStyle = "#f5a524";
      ctx.fillRect(x + f * 3, y - 4, 2 * f, 1.5);
      break;
    case "bash":
      if (frame % 4 < 2) { ctx.fillStyle = "#e9d5ff"; ctx.fillRect(x + f * 5, y - 5 + (frame % 3), 1, 1); }
      break;
    case "dig":
      if (frame % 4 < 2) {
        ctx.fillStyle = "#a3e635";
        ctx.fillRect(x - 4 + (frame % 3), y - 1, 1, 1);
        ctx.fillRect(x + 3 - (frame % 2), y - 2, 1, 1);
      }
      break;
    case "shrug":
      ctx.fillStyle = "#e0f2fe";
      ctx.fillRect(x - 5, y - 9, 1, 1); ctx.fillRect(x + 4, y - 9, 1, 1);
      break;
  }

  if (p.bomb > 0) {
    const secs = Math.ceil(p.bomb / TICK_HZ);
    ctx.fillStyle = secs <= 1 && frame % 4 < 2 ? "#ffffff" : "#fb7185";
    ctx.font = "bold 7px ui-monospace, monospace";
    ctx.textAlign = "center";
    ctx.fillText(String(secs), x, y - 11);
  }

  if (highlight) {
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 0.6;
    ctx.strokeRect(x - 5.5, y - 11.5, 11, 13);
  }
}

function stepEffects() {
  effects = effects.filter(e => e.life > 0);
  for (const e of effects) {
    e.life--;
    if (e.kind === "text") e.y -= 0.35;
    else { e.x += e.vx; e.y += e.vy; e.vy += 0.12; }
  }
}

function drawEffects() {
  for (const e of effects) {
    if (e.kind === "text") {
      ctx.globalAlpha = Math.min(1, e.life / 20);
      ctx.fillStyle = e.color;
      ctx.font = "bold 7px ui-sans-serif, system-ui, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(e.text, e.x, e.y);
    } else {
      ctx.globalAlpha = Math.min(1, e.life / 15);
      ctx.fillStyle = e.color;
      ctx.fillRect(e.x, e.y, 1.2, 1.2);
    }
    ctx.globalAlpha = 1;
  }
}

function burst(x, y, colors, n) {
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2 + Math.random() * 0.4, s = 0.6 + Math.random() * 1.6;
    effects.push({ kind: "spark", x, y, z: (Math.random() - 0.5) * 18, vx: Math.cos(a) * s, vy: Math.sin(a) * s - 1, life: 25 + Math.random() * 20, color: colors[i % colors.length] });
  }
}

function render() {
  frame++;
  stepEffects();
  if (view3d) render3D(); else render2D();
}

/* The 3D renderer draws the world; this overlay adds what reads better flat:
   floating labels, overflow countdowns, the target ring and the pause card. */
function render3D() {
  const target = hover && running ? game.pick(hover.x, hover.y, selected) : null;
  const bands = backdrop === "datacentre" ? null : currentBands();
  r3.render(game, { pal: palette(), frame, hot: target, effects, bands,
    bandsKey: bands ? [backdrop, bands.map(x => x.focus ? 1 : 0).join("")].join("|") : "" });

  const dpr = Math.min(2, window.devicePixelRatio || 1);
  const W = Math.round(fxCanvas.clientWidth * dpr), H = Math.round(fxCanvas.clientHeight * dpr);
  if (fxCanvas.width !== W || fxCanvas.height !== H) { fxCanvas.width = W; fxCanvas.height = H; }
  fx.setTransform(1, 0, 0, 1, 0, 0);
  fx.clearRect(0, 0, W, H);
  const unit = W / 400;                     // roughly one world pixel on screen
  const at = (x, y, z) => { const s = r3.project(x, y, z); return [s.x * W, s.y * H]; };
  fx.textAlign = "center";

  /* layer names on the back wall, and the header the message has picked up */
  if (backdrop !== "datacentre") {
    const light = isLight(palette());
    fx.textBaseline = "middle";
    for (const band of currentBands()) {
      const cy = (band.y0 + band.y1) / 2;
      if (r3.occluded(game, 4, cy, r3.bandZ + 1) || r3.occluded(game, 40, cy, r3.bandZ + 1)) continue;
      const lab = bandLabel(band), [sx, sy] = at(4, cy, r3.bandZ + 1);
      fx.textAlign = "left";
      fx.globalAlpha = band.focus ? 0.95 : (light ? 0.75 : 0.6);
      fx.fillStyle = band.color;
      fx.font = `bold ${Math.round(7 * unit)}px ui-sans-serif, system-ui, sans-serif`;
      fx.fillText((lab.badge ? lab.badge + "  " : "") + lab.name, sx, sy - 3.5 * unit);
      fx.font = `${Math.round(5.5 * unit)}px ui-sans-serif, system-ui, sans-serif`;
      fx.fillText(lab.sub, sx + (lab.badge ? 9 * unit : 0), sy + 4.5 * unit);
    }
    const e = encapAt(reduceMotion ? 200 : frame), [ex, ey] = at(360, e.y, r3.bandZ + 3);
    fx.globalAlpha = r3.occluded(game, 360, e.y, r3.bandZ + 3) ? 0 : Math.max(0, e.fade);
    fx.textAlign = "center";
    fx.font = `bold ${Math.round(5.5 * unit)}px ui-monospace, monospace`;
    fx.fillStyle = light ? "#1f1a33" : "#ffffff";
    fx.fillText(ENCAP[e.n], ex, ey);
    fx.globalAlpha = 1;
    fx.textBaseline = "alphabetic";
    fx.textAlign = "center";
  }

  for (const e of effects) {
    if (e.kind !== "text") continue;
    const [sx, sy] = at(e.x, e.y, 4);
    fx.globalAlpha = Math.min(1, e.life / 20);
    fx.font = `bold ${Math.round(8 * unit)}px ui-sans-serif, system-ui, sans-serif`;
    fx.lineWidth = 3 * dpr; fx.strokeStyle = "rgba(0,0,0,0.55)";
    fx.strokeText(e.text, sx, sy);
    fx.fillStyle = e.color;
    fx.fillText(e.text, sx, sy);
  }
  fx.globalAlpha = 1;
  for (const p of game.packets) {
    if (!p.alive || p.bomb <= 0) continue;
    const secs = Math.ceil(p.bomb / TICK_HZ);
    const [sx, sy] = at(p.x, p.y - 16, 0);
    fx.font = `bold ${Math.round(9 * unit)}px ui-monospace, monospace`;
    fx.lineWidth = 3 * dpr; fx.strokeStyle = "rgba(0,0,0,0.6)";
    fx.strokeText(String(secs), sx, sy);
    fx.fillStyle = secs <= 1 && frame % 4 < 2 ? "#ffffff" : "#fb7185";
    fx.fillText(String(secs), sx, sy);
  }
  /* enemy labels: the outage over the server, the zone name */
  if (game.downTicks > 0) {
    const [sx, sy] = at(game.servers[0].x, game.servers[0].y - 28, -4);
    fx.font = `bold ${Math.round(9 * unit)}px ui-monospace, monospace`;
    fx.lineWidth = 3 * dpr; fx.strokeStyle = "rgba(0,0,0,0.6)";
    fx.strokeText("503", sx, sy);
    fx.fillStyle = "#f87171";
    fx.fillText("503", sx, sy);
  }
  game.servers.forEach((sv, i) => {                      // server addresses
    if (!sv.addr) return;
    const [sx, sy] = at(sv.x, sv.y - 26, -4);
    fx.font = `bold ${Math.round(6 * unit)}px ui-monospace, monospace`;
    fx.lineWidth = 3 * dpr; fx.strokeStyle = "rgba(0,0,0,0.55)";
    fx.strokeText(sv.addr, sx, sy);
    fx.fillStyle = DEST_COLOR[i];
    fx.fillText(sv.addr, sx, sy);
  });
  for (const z of game.mitm) {
    const [sx, sy] = at(z.x + z.w / 2, z.y + 6, 10);
    fx.font = `bold ${Math.round(6 * unit)}px ui-monospace, monospace`;
    fx.fillStyle = "rgba(248,113,113,0.9)";
    fx.fillText("MITM", sx, sy);
  }
  if (target) {
    const [sx, sy] = at(target.x, target.y - 6, 0);
    fx.strokeStyle = "#4ade80";
    fx.lineWidth = 1.5 * dpr;
    fx.beginPath();
    fx.arc(sx, sy, 11 * unit, 0, Math.PI * 2);
    fx.stroke();
  } else if (hoverScreen && running) {
    const sx = hoverScreen.x * dpr, sy = hoverScreen.y * dpr, r = 5 * dpr;
    fx.strokeStyle = "rgba(255,255,255,0.6)";
    fx.lineWidth = 1 * dpr;
    fx.beginPath();
    fx.moveTo(sx - r, sy); fx.lineTo(sx - r / 3, sy); fx.moveTo(sx + r / 3, sy); fx.lineTo(sx + r, sy);
    fx.moveTo(sx, sy - r); fx.lineTo(sx, sy - r / 3); fx.moveTo(sx, sy + r / 3); fx.lineTo(sx, sy + r);
    fx.stroke();
  }
  if (paused && running) {
    fx.fillStyle = "rgba(0,0,0,0.35)";
    fx.fillRect(0, 0, W, H);
    fx.fillStyle = "#ffffff";
    fx.font = `bold ${Math.round(16 * unit)}px ui-sans-serif, system-ui, sans-serif`;
    fx.fillText(t("ov.paused"), W / 2, H / 2);
  }
}

function render2D() {
  const pal = palette();
  if (game.dirty) paintTerrain();
  ctx.setTransform(SCALE, 0, 0, SCALE, 0, 0);
  ctx.imageSmoothingEnabled = false;
  drawBackground(pal);
  ctx.drawImage(terrainCanvas, 0, 0);
  for (const h of game.hazards) drawHazard(h);
  drawEdges();
  for (const z of game.mitm) drawMitm(z);
  for (const l of game.links) drawLink(l);
  if (game.session) drawSession(game.session);
  game.servers.forEach((sv, i) => drawServer(sv, i));
  const hotSwitch = hover && running ? game.switchAt(hover.x, hover.y) : null;
  for (const s of game.switches) drawSwitch(s, s === hotSwitch);
  drawRouter(game.level.hatch);
  if (game.botnet) drawRouter(game.botnet, "#f87171");

  const target = hover && running ? game.pick(hover.x, hover.y, selected) : null;
  for (const p of game.packets) if (p.alive) drawPacket(p, p === target);
  drawEffects();

  if (hover && running) {                   // crosshair cursor
    ctx.strokeStyle = target ? "#4ade80" : "rgba(255,255,255,0.55)";
    ctx.lineWidth = 0.5;
    ctx.beginPath();
    ctx.moveTo(hover.x - 4, hover.y); ctx.lineTo(hover.x - 1.5, hover.y);
    ctx.moveTo(hover.x + 1.5, hover.y); ctx.lineTo(hover.x + 4, hover.y);
    ctx.moveTo(hover.x, hover.y - 4); ctx.lineTo(hover.x, hover.y - 1.5);
    ctx.moveTo(hover.x, hover.y + 1.5); ctx.lineTo(hover.x, hover.y + 4);
    ctx.stroke();
  }
  if (paused && running) {
    ctx.fillStyle = "rgba(0,0,0,0.35)";
    ctx.fillRect(0, 0, LW, LH);
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 14px ui-sans-serif, system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(t("ov.paused"), LW / 2, LH / 2);
  }
}

/* --------------------------------------------------------- skill icons */
function drawSkillIcon(c, id) {
  const g = c.getContext("2d");
  c.width = 30; c.height = 30;
  g.setTransform(2, 0, 0, 2, 0, 0);
  g.clearRect(0, 0, 15, 15);
  g.lineWidth = 1.2;
  g.lineCap = "round";
  g.lineJoin = "round";
  const wall = (x, y, w, h, col) => { g.fillStyle = col; g.fillRect(x, y, w, h); };
  switch (id) {
    case "uplink":
      wall(10, 1, 3, 13, "#94a3b8");
      g.strokeStyle = "#4ade80";
      g.beginPath(); g.moveTo(6, 13); g.lineTo(6, 3); g.moveTo(3, 6); g.lineTo(6, 3); g.lineTo(9, 6); g.stroke();
      break;
    case "buffer":
      g.fillStyle = "#45d0e0";
      g.beginPath(); g.arc(7.5, 6, 6, Math.PI, 0); g.fill();
      g.strokeStyle = "#e0f2fe"; g.lineWidth = 0.7;
      g.beginPath(); g.moveTo(1.5, 6); g.lineTo(6, 11); g.moveTo(13.5, 6); g.lineTo(9, 11); g.stroke();
      wall(5.5, 10, 4, 3, "#e0f2fe");
      break;
    case "overflow":
      g.fillStyle = "#fb7185";
      g.beginPath();
      for (let i = 0; i < 16; i++) {
        const r = i % 2 ? 3 : 6.5, a = (i / 16) * Math.PI * 2;
        g.lineTo(7.5 + Math.cos(a) * r, 7.5 + Math.sin(a) * r);
      }
      g.fill();
      wall(6, 6, 3, 3, "#fef08a");
      break;
    case "firewall":
      for (let r = 0; r < 3; r++) for (let k = 0; k < 3; k++) wall((r % 2 ? 0 : 2) + k * 5, 6 + r * 3, 4, 2.3, "#f87171");
      g.fillStyle = "#facc15";
      g.beginPath(); g.moveTo(4, 6); g.quadraticCurveTo(3, 2, 6, 0.5); g.quadraticCurveTo(6, 3, 8, 3); g.quadraticCurveTo(9, 1, 11, 1.5); g.quadraticCurveTo(12, 4, 11, 6); g.fill();
      break;
    case "bridge":
      for (let i = 0; i < 5; i++) wall(1 + i * 2.6, 12 - i * 2.4, 4, 1.6, "#f5a524");
      break;
    case "tunnel":
      wall(5, 1, 5, 13, "#22805a");
      wall(5, 6, 5, 4, "rgba(0,0,0,0)");
      g.clearRect(5, 6, 5, 4);
      g.strokeStyle = "#c084fc";
      g.beginPath(); g.moveTo(1, 8); g.lineTo(14, 8); g.moveTo(11, 5.5); g.lineTo(14, 8); g.lineTo(11, 10.5); g.stroke();
      break;
    case "pipe":
      wall(1, 8, 13, 6, "#22805a");
      g.clearRect(5.5, 8, 4, 6);
      g.strokeStyle = "#60a5fa";
      g.beginPath(); g.moveTo(7.5, 1); g.lineTo(7.5, 13); g.moveTo(5, 10.5); g.lineTo(7.5, 13); g.lineTo(10, 10.5); g.stroke();
      break;
  }
}

/* ------------------------------------------------------------- toolbar */
function buildSkills() {
  const box = el("skills");
  box.innerHTML = "";
  for (const s of SKILLS) {
    const b = document.createElement("button");
    b.className = "skill";
    b.dataset.skill = s.id;
    b.title = t("skill." + s.id) + " — " + t("sk." + s.id);
    const c = document.createElement("canvas");
    drawSkillIcon(c, s.id);
    b.append(c);
    const name = document.createElement("span");
    name.textContent = t("skill." + s.id);
    const count = document.createElement("span");
    count.className = "count";
    const k = document.createElement("kbd");
    k.textContent = s.key;
    b.append(name, count, k);
    b.onclick = () => selectSkill(s.id);
    box.append(b);
  }
  updateSkills();
}

function updateSkills() {
  for (const b of el("skills").children) {
    const id = b.dataset.skill, n = game ? game.skills[id] : 0;
    b.querySelector(".count").textContent = n === Infinity ? "∞" : n;
    b.classList.toggle("empty", n <= 0);
    b.classList.toggle("selected", id === selected);
  }
}

function selectSkill(id) {
  selected = id;
  updateSkills();
  const n = game.skills[id];
  el("skill-note").innerHTML = n > 0
    ? `<b>${t("skill." + id)}</b> — ${t("sk." + id)}`
    : t("note.none", { skill: t("skill." + id) });
  beep(660, 40, "triangle", 0.03);
}

function defaultSkill() {
  const first = SKILLS.find(s => game.skills[s.id] > 0);
  selected = first ? first.id : null;
  if (selected) selectSkill(selected); else el("skill-note").innerHTML = t("note.pick");
}

/* ----------------------------------------------------------------- HUD */
function fmtTime(ticks) {
  const s = Math.max(0, Math.ceil(ticks / TICK_HZ));
  return Math.floor(s / 60) + ":" + String(s % 60).padStart(2, "0");
}

function updateHUD() {
  el("hud-level").textContent = game.level.category ? L(DIFFICULTIES.find(d => d.id === game.level.difficulty).name)
    : levelIndex < 0 ? t("hud.custom") : t("hud.level", { n: levelIndex + 1 });
  el("hud-name").textContent = L(game.level.name);
  el("hud-out").textContent = `${game.spawned}/${game.level.count}`;
  el("hud-in").textContent = game.saved;
  el("hud-need").textContent = game.level.need;
  el("hud-lost").textContent = game.lost;
  el("rate-box").hidden = !game.level.rateRange;
  el("rate-val").textContent = (game.rate / TICK_HZ).toFixed(1) + "s";
  el("hud-skills").textContent = game.level.par ? `${game.used}/${game.level.par.skills}` : game.used;
  el("hud-resent-box").hidden = !game.level.types;
  el("hud-resent").textContent = game.resent;
  el("hud-server-box").hidden = !game.botnet;
  const srv = el("hud-server");
  srv.textContent = t(game.downTicks > 0 ? "server.down" : "server.up");
  srv.classList.toggle("down", game.downTicks > 0);
  const ttl = el("hud-ttl");
  ttl.textContent = fmtTime(game.ticksLeft);
  ttl.style.color = game.ticksLeft < 20 * TICK_HZ ? "var(--red)" : "";
}

/* ------------------------------------------------------------ overlays */
function overlay({ title, goal, note, stats, stars, quiz, primary, secondary }) {
  el("ov-title").textContent = title;
  el("ov-goal").innerHTML = goal || "";
  el("ov-note").innerHTML = note ? `<h4>${t("ov.concept")}</h4>${note}` : "";
  renderOsiChips(note ? game.level : null);
  el("ov-stats").innerHTML = stats || "";
  el("ov-stars").innerHTML = stars || "";
  el("ov-quiz").innerHTML = "";
  if (quiz) renderQuiz(game.level);
  const btn = (node, spec) => {
    node.style.display = spec ? "" : "none";
    if (spec) { node.textContent = spec[0]; node.onclick = spec[1]; }
  };
  btn(el("ov-primary"), primary);
  btn(el("ov-secondary"), secondary);
  el("overlay").classList.remove("hidden");
  running = false;
  setTimeout(() => el("ov-primary").focus(), 0);
}
function hideOverlay() { el("overlay").classList.add("hidden"); running = true; last = performance.now(); acc = 0; }

/* ------------------------------------------------------------ OSI model */

function renderOsiChips(lv) {
  const box = el("ov-osi");
  box.innerHTML = "";
  if (!lv || !lv.osi) return;
  const layers = lv.osi.length === 7 ? [null] : lv.osi.slice().sort((a, b) => b - a);
  for (const n of layers) {
    const b = document.createElement("button");
    b.className = "osi-chip";
    const layer = n && OSI_LAYERS.find(l => l.n === n);
    b.style.setProperty("--layer", n ? OSI_COLORS[n] : "#34d399");
    b.textContent = n ? t("osi.chip", { n, name: L(layer.name) }) : t("osi.chipAll");
    b.onclick = () => openOsi(n);
    box.append(b);
  }
  if (lv.osiWhy) {
    const why = document.createElement("p");
    why.className = "ov-osi-why";
    why.innerHTML = L(lv.osiWhy);
    box.append(why);
  }
}

function openOsi(focus) {
  const list = el("osi-stack");
  list.innerHTML = "";
  for (const layer of OSI_LAYERS) {
    const li = document.createElement("li");
    li.className = "osi-layer" + (focus === layer.n ? " focus" : "");
    li.style.setProperty("--layer", OSI_COLORS[layer.n]);
    const levels = PACKET_LEVELS
      .map((lv, i) => (lv.osi || []).includes(layer.n) ? `<span>${i + 1} · ${L(lv.name)}</span>` : "")
      .join("");
    li.innerHTML = `<span class="osi-num" aria-label="${t("osi.layer", { n: layer.n })}">${layer.n}</span>
      <div>
        <div class="osi-head"><strong>${L(layer.name)}</strong><span class="osi-pdu">${t("osi.pdu", { pdu: L(layer.pdu) })}</span></div>
        <p class="osi-job">${L(layer.job)}</p>
        <div class="osi-eg">${layer.eg}</div>
        ${levels ? `<div class="osi-levels" title="${t("osi.inGame")}">${levels}</div>` : ""}
      </div>`;
    list.append(li);
  }
  el("osi-extra").innerHTML = ["encap", "attacks", "mnemonic"].map(k => `<p>${L(OSI_EXTRA[k])}</p>`).join("");
  el("tcpip-table").innerHTML =
    `<thead><tr><th>${t("tcpip.layer")}</th><th>${t("tcpip.osi")}</th><th>${t("tcpip.job")}</th><th>${t("tcpip.eg")}</th></tr></thead><tbody>`
    + TCPIP_LAYERS.map(l => `<tr><td>${L(l.name)}</td><td><div class="osi-dots">${l.osi.map(n => `<span style="--layer:${OSI_COLORS[n]}">${n}</span>`).join("")}</div></td><td>${L(l.job)}</td><td class="osi-eg">${l.eg}</td></tr>`).join("")
    + "</tbody>";
  el("tcpip-extra").innerHTML = ["tcpip", "tcpudp", "sockets"].map(k => `<p>${L(OSI_EXTRA[k])}</p>`).join("");
  el("osi-links").innerHTML = OSI_SOURCES
    .map(s => `<li><a href="${s.url}" target="_blank" rel="noopener noreferrer">${s.title}</a></li>`).join("");
  const d = el("osi-dialog");
  if (!d.open) d.showModal();
  const hit = list.querySelector(".focus");
  if (hit) hit.scrollIntoView({ block: "nearest" });
}

/* ------------------------------------------------------------ the quiz */
function renderQuiz(lv) {
  const box = el("ov-quiz");
  if (!lv.world) return;                  // custom levels have no layer to ask about
  const q = quizFor(lv, OSI_LAYERS, levelIndex * 7919 + progress.quiz.asked * 104729 + 17);
  const layer = OSI_LAYERS.find(l => l.n === q.n);
  const text = q.kind === "layer" ? t("quiz.layer", { level: L(lv.name) })
    : q.kind === "pdu" ? t("quiz.pdu", { n: q.n, name: L(layer.name) })
    : t("quiz.job", { job: L(layer.job) });
  const label = o => (q.kind === "pdu" ? L(o.layer.pdu) : `${o.n} · ${L(o.layer.name)}`);
  box.innerHTML = `<h4>${t("quiz.title")}</h4><p>${text}</p>`;
  const opts = document.createElement("div");
  opts.className = "quiz-opts";
  const verdict = document.createElement("div");
  verdict.className = "quiz-verdict";
  let answered = false;
  for (const o of q.options) {
    const b = document.createElement("button");
    b.className = "btn";
    b.textContent = label(o);
    b.onclick = () => {
      if (answered) return;
      answered = true;
      const right = o.n === q.answer;
      progress.quiz.asked++;
      if (right) progress.quiz.right++;
      store.set("packetrush.progress", JSON.stringify(progress));
      for (const other of opts.children) {
        if (other === b) other.classList.add(right ? "right" : "wrong");
        if (other.dataset.n === String(q.answer)) other.classList.add("right");
        other.disabled = true;
      }
      const ans = q.options.find(x => x.n === q.answer);
      verdict.textContent = (right ? t("quiz.right") : t("quiz.wrong", { answer: label(ans) })) + " · "
        + t("quiz.tally", { right: progress.quiz.right, asked: progress.quiz.asked });
      beep(right ? 880 : 200, 120, "triangle", 0.04, right ? 200 : -60);
    };
    b.dataset.n = o.n;
    opts.append(b);
  }
  box.append(opts, verdict);
}

/* -------------------------------------------------------------- the class */
function resultCode() {
  return makeResultCode({
    name: progress.student.name, cls: progress.student.cls, stars: progress.stars, levels: PACKET_LEVELS,
    quiz: progress.quiz, streak: dailyStreak(), when: Math.floor(Date.now() / 1000)
  });
}
function refreshClass() {
  const total = PACKET_LEVELS.reduce((a, l) => a + (progress.stars[l.id] || 0), 0);
  const cleared = PACKET_LEVELS.filter(l => progress.stars[l.id]).length;
  el("class-summary").innerHTML = `<span>${t("class.stars")} <b>${total}/${PACKET_LEVELS.length * 3}</b></span>`
    + `<span>${t("class.cleared")} <b>${cleared}/${PACKET_LEVELS.length}</b></span>`
    + `<span>${t("class.quiz")} <b>${progress.quiz.right}/${progress.quiz.asked}</b></span>`
    + `<span>${t("class.streak")} <b>${dailyStreak()}</b></span>`;
  el("result-code").value = progress.student.name.trim() ? resultCode() : "";
  el("result-code").placeholder = t("class.needName");
}
function openClass() {
  el("student-name").value = progress.student.name;
  el("class-code").value = progress.student.cls;
  el("copy-note").textContent = "";
  refreshClass();
  el("class-dialog").showModal();
}
for (const id of ["student-name", "class-code"]) {
  el(id).addEventListener("input", () => {
    progress.student = { name: el("student-name").value, cls: el("class-code").value.toUpperCase() };
    store.set("packetrush.progress", JSON.stringify(progress));
    refreshClass();
  });
}
el("btn-copy-code").onclick = () => {
  const box = el("result-code");
  if (!box.value) { el("copy-note").textContent = t("class.needName"); el("student-name").focus(); return; }
  const fallback = () => { box.focus(); box.select(); el("copy-note").textContent = t("class.copyFail"); };
  try {
    navigator.clipboard.writeText(box.value).then(() => { el("copy-note").textContent = t("class.copied"); }, fallback);
  } catch (e) { fallback(); }
};

function showIntro() {
  const lv = game.level;
  if (lv.custom) {
    overlay({
      title: t("ov.customIntro", { name: L(lv.name) }),
      goal: `<b>${t("ov.customGoal", { count: lv.count, need: lv.need })}</b>` + (lv.unlimited ? "<br>" + t("ov.freePlay") : "") + (L(lv.goal) ? "<br>" + escapeHtml(L(lv.goal)) : ""),
      primary: [t("ov.start"), hideOverlay],
      secondary: [t("ov.edit"), editCustom]
    });
    return;
  }
  overlay({
    title: lv.category ? challengeTitle(lv) : t("ov.intro", { n: levelIndex + 1, name: L(lv.name) }),
    goal: `<b>${t("ov.goal", { count: lv.count, need: lv.need })}</b><br>${L(lv.goal)}`,
    note: L(lv.note),
    primary: [t("ov.start"), hideOverlay],
    secondary: [t("ov.levels"), openLevels]
  });
}

const escapeHtml = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
function editCustom() { location.href = "editor.html#lvl=" + encodeLevel(customLevel); }

/* ------------------------------------------------------- challenge pack */
const challengeRow = lv => CHALLENGE_LEVELS.filter(c => c.category === lv.category);
/* every special stage is open: players choose what to play */
function challengeOpen() { return true; }
let challengeFilter = store.get("packetrush.chFilter", "all");
function challengeTitle(lv) {
  return t("ch.title", {
    cat: L(CATEGORIES.find(c => c.id === lv.category).name),
    diff: L(DIFFICULTIES.find(d => d.id === lv.difficulty).name), name: L(lv.name)
  });
}
function startChallenge(lv) {
  customLevel = lv;
  startLevel(-1);
}

function showResult() {
  const lv = game.level, won = game.state === "won";
  if (lv.category) {
    const losses = Object.entries(game.losses).map(([k, n]) => `${n} ${t("loss." + k)}`).join(" · ");
    const stats = `<span>${t("stat.saved")} <b>${game.saved}/${lv.count}</b></span><span>${t("stat.time")} <b>${fmtTime(game.tick)}</b></span>`
      + (losses ? `<span>${t("stat.lost")}: ${losses}</span>` : "");
    if (won) {
      const stars = starsFor(lv, game.saved, game.used, true);
      progress.stars[lv.id] = Math.max(progress.stars[lv.id] || 0, stars);
      progress.best[lv.id] = Math.max(progress.best[lv.id] || 0, game.saved);
      store.set("packetrush.progress", JSON.stringify(progress));
      const row = challengeRow(lv), next = row[row.indexOf(lv) + 1];
      overlay({
        title: t("ov.won"),
        goal: t("ov.wonText", { saved: game.saved, count: lv.count, need: lv.need }),
        note: L(lv.note), stats, quiz: true,
        stars: starText(stars) + "<small>" + (stars === 3 ? t("stars.all") : stars === 2 ? t("stars.need3", { n: lv.par.skills }) : t("stars.need2", { n: lv.par.saved })) + "</small>",
        primary: next ? [t("ch.next", { diff: L(DIFFICULTIES.find(d => d.id === next.difficulty).name) }), () => startChallenge(next)] : [t("ov.levels"), openChallenges],
        secondary: [t("ov.replay"), () => startLevel(-1)]
      });
      beep(523, 120, "triangle", 0.05); setTimeout(() => beep(784, 200, "triangle", 0.05), 120);
    } else {
      overlay({
        title: t("ov.lost"),
        goal: t("ov.lostText", { saved: game.saved, need: lv.need }) + "<br>" + L(lv.goal),
        stats,
        primary: [t("ov.retry"), () => startLevel(-1, true)],
        secondary: [t("ov.levels"), openChallenges]
      });
      beep(220, 300, "sawtooth", 0.04, -100);
    }
    return;
  }
  if (lv.custom) {                       // custom levels record nothing
    overlay({
      title: won ? t("ov.won") : t("ov.lost"),
      goal: won ? t("ov.wonText", { saved: game.saved, count: lv.count, need: lv.need }) : t("ov.lostText", { saved: game.saved, need: lv.need }),
      stats: `<span>${t("stat.saved")} <b>${game.saved}/${lv.count}</b></span><span>${t("stat.time")} <b>${fmtTime(game.tick)}</b></span>`,
      primary: [t("ov.retry"), () => startLevel(-1, true)],
      secondary: [t("ov.edit"), editCustom]
    });
    return;
  }
  const losses = Object.entries(game.losses)
    .map(([k, n]) => `${n} ${t("loss." + k)}`).join(" · ");
  const stats = `<span>${t("stat.saved")} <b>${game.saved}/${lv.count}</b></span>`
    + `<span>${t("stat.time")} <b>${fmtTime(game.tick)}</b></span>`
    + (losses ? `<span>${t("stat.lost")}: ${losses}</span>` : "");
  if (won) {
    const stars = starsFor(lv, game.saved, game.used, true);
    progress.stars[lv.id] = Math.max(progress.stars[lv.id] || 0, stars);
    let starsHtml = starText(stars) + "<small>" + (stars === 3 ? t("stars.all")
      : stars === 2 ? t("stars.need3", { n: lv.par.skills }) : t("stars.need2", { n: lv.par.saved })) + "</small>";
    if (dailyRun && levelIndex === dailyLevel()) {
      const inTime = game.tick / TICK_HZ <= lv.par.time;
      if (stars === 3 && inTime) progress.daily[todayKey()] = true;
      starsHtml += `<small>${stars === 3 && inTime ? "🏁 " + t("daily.won") + " · " + t("daily.streak", { n: dailyStreak() })
        : t("daily.missed", { time: fmtTime(lv.par.time * TICK_HZ) })}</small>`;
    }
    const prev = progress.best[lv.id] || 0;
    const newBest = game.saved > prev;
    if (newBest) progress.best[lv.id] = game.saved;
    progress.unlocked = Math.max(progress.unlocked, Math.min(PACKET_LEVELS.length, levelIndex + 2));
    store.set("packetrush.progress", JSON.stringify(progress));
    const last = levelIndex === PACKET_LEVELS.length - 1;
    overlay({
      title: last ? t("ov.wonAll") : t("ov.won"),
      goal: (last ? t("ov.wonAllText") : t("ov.wonText", { saved: game.saved, count: lv.count, need: lv.need }))
        + (newBest && prev ? ` <b>${t("ov.newBest")}</b>` : ""),
      note: L(lv.note),
      stats,
      stars: starsHtml,
      quiz: true,
      primary: last ? [t("ov.replay"), () => startLevel(levelIndex)] : [t("ov.next"), () => startLevel(levelIndex + 1)],
      secondary: last ? [t("ov.levels"), openLevels] : [t("ov.replay"), () => startLevel(levelIndex)]
    });
    beep(523, 120, "triangle", 0.05); setTimeout(() => beep(784, 200, "triangle", 0.05), 120);
  } else {
    overlay({
      title: t("ov.lost"),
      goal: t("ov.lostText", { saved: game.saved, need: lv.need }) + "<br>" + L(lv.goal),
      stats,
      primary: [t("ov.retry"), () => startLevel(levelIndex, true)],
      secondary: [t("ov.levels"), openLevels]
    });
    beep(220, 300, "sawtooth", 0.04, -100);
  }
}

function togglePause() {
  if (!running) return;
  paused = !paused;
  el("btn-pause").querySelector("span").textContent = t(paused ? "ctl.resume" : "ctl.pause");
}

/* ---------------------------------------------------------------- flow */
function startLevel(i, skipIntro, fromDaily = false) {
  dailyRun = fromDaily;
  if (i < 0 && !customLevel) i = 0;
  levelIndex = i;
  game = new PacketGame(i < 0 ? customLevel : PACKET_LEVELS[i]);
  effects = [];
  paused = false;
  nukeArmed = 0;
  el("btn-nuke").classList.remove("armed");
  el("btn-pause").querySelector("span").textContent = t("ctl.pause");
  if (i >= 0) store.set("packetrush.level", String(i));
  buildSkills();
  defaultSkill();
  updateHUD();
  if (skipIntro) hideOverlay(); else showIntro();
}

function drainEvents() {
  for (const e of game.events) {
    switch (e.type) {
      case "spawn": beep(880, 25, "square", 0.015); break;
      case "saved":
        beep(988, 60, "triangle", 0.04, 200);
        { const sv = game.servers[e.server || 0]; effects.push({ kind: "text", text: "+1", x: sv.x, y: sv.y - 16, life: 40, color: "#4ade80" }); }
        break;
      case "lost":
        if (e.why !== "overflow" && e.why !== "ttl" && e.why !== "firewall") {
          beep(160, 120, "sawtooth", 0.03, -60);
          burst(e.x, e.y - 4, e.recoverable ? ["#93c5fd", "#e0f2fe"] : ["#e0f2fe", "#f87171"], 10);
          effects.push({ kind: "text", text: e.recoverable ? "↻" : "×", x: e.x, y: e.y - 10, life: 35, color: e.recoverable ? "#93c5fd" : "#f87171" });
        }
        break;
      case "resend":
        beep(620, 60, "triangle", 0.03, 180);
        effects.push({ kind: "text", text: "↻ " + t("fx.resend"), x: game.level.hatch.x, y: game.level.hatch.y - 20, life: 45, color: "#93c5fd" });
        break;
      case "down":
        beep(110, 400, "sawtooth", 0.06, -50);
        effects.push({ kind: "text", text: t("fx.down"), x: game.servers[0].x, y: game.servers[0].y - 30, life: 70, color: "#f87171" });
        break;
      case "up":
        beep(700, 120, "triangle", 0.04, 200);
        effects.push({ kind: "text", text: t("fx.up"), x: game.servers[0].x, y: game.servers[0].y - 30, life: 50, color: "#4ade80" });
        break;
      case "flip":
        beep(520, 40, "square", 0.03, 120);
        break;
      case "junkin": beep(200, 40, "square", 0.02); break;
      case "session": beep(760, 40, "triangle", 0.025, 160); break;
      case "timeout":
        effects.push({ kind: "text", text: t("fx.timeout"), x: game.session.gate.x, y: game.session.gate.y - 18, life: 40, color: "#c4b5fd" });
        break;
      case "junkdown": burst(e.x, e.y - 4, ["#fca5a5", "#7f1d1d"], 6); break;
      case "boom":
        beep(90, 250, "sawtooth", 0.06, -40);
        burst(e.x, e.y, ["#fb7185", "#facc15", "#ffffff", "#22805a"], 26);
        break;
      case "brick": beep(420, 15, "square", 0.012); break;
    }
  }
  game.events.length = 0;
}

function loop(now) {
  if (running && !paused && game.state === "playing") {
    acc += Math.min(250, now - last) * (fast ? 3 : 1);
    const dt = 1000 / TICK_HZ;
    while (acc >= dt && game.state === "playing") { game.step(); acc -= dt; }
    drainEvents();
    updateHUD();
    updateSkills();
    if (game.state !== "playing") {
      const finished = game;                   // ignore it if a new level starts in the meantime
      setTimeout(() => { if (game === finished) showResult(); }, 700);
    }
  }
  last = now;
  if (nukeArmed && now > nukeArmed) { nukeArmed = 0; el("btn-nuke").classList.remove("armed"); el("skill-note").innerHTML = ""; }
  render();
  requestAnimationFrame(loop);
}

/* --------------------------------------------------------------- input */
function worldPoint(ev) {
  const r = canvas.getBoundingClientRect();
  return { x: (ev.clientX - r.left) / r.width * LW, y: (ev.clientY - r.top) / r.height * LH };
}

/* Returns true if the click landed on a packet (whether or not it took the skill).
   `slack` is extra reach in world pixels, used for fingers. */
function clickAt(pt, slack = 0) {
  if (!running || game.state !== "playing") return false;
  hover = pt;
  const sw = game.switchAt(pt.x, pt.y, 10 + slack);
  if (sw) { game.flip(sw); drainEvents(); return true; }
  const any = game.pick(pt.x, pt.y, null, slack);
  if (!selected) return !!any;
  if (game.skills[selected] <= 0) { el("skill-note").innerHTML = t("note.none", { skill: t("skill." + selected) }); return !!any; }
  const p = game.pick(pt.x, pt.y, selected, slack);
  if (p && game.assign(p, selected)) {
    try { if (navigator.vibrate) navigator.vibrate(12); } catch (e) { /* no haptics */ }
    effects.push({ kind: "text", text: t("skill." + selected), x: p.x, y: p.y - 12, life: 30, color: "#fef08a" });
    beep(740, 50, "square", 0.04, 120);
    drainEvents();
    updateSkills();
    return true;
  }
  return !!any;
}

/* A fingertip is about 14 CSS pixels of reach either side; in world pixels
   that depends on how big the board is drawn. Capped so a tap never grabs a
   packet from across the map. */
const FINGER = 14;
function touchSlack2D() {
  return Math.min(10, FINGER * LW / canvas.getBoundingClientRect().width);
}

canvas.addEventListener("pointermove", ev => { if (ev.pointerType !== "touch") hover = worldPoint(ev); });
canvas.addEventListener("pointerleave", () => { hover = null; });
canvas.addEventListener("pointerdown", ev => {
  clickAt(worldPoint(ev), ev.pointerType === "touch" ? touchSlack2D() : 0);
  if (ev.pointerType === "touch") hover = null;      // no hover ring left behind under a finger
});

/* In 3D a click on a packet assigns the skill; a drag that starts anywhere
   else tilts the camera. */
if (r3) {
  const c3 = el("world3d");
  let drag = null;
  const touches = new Map();                          // pointerId -> {x, y}, for pinch
  let pinch = 0;
  const slack3D = ev => {
    const a = r3.pickPoint(ev.clientX, ev.clientY), b = r3.pickPoint(ev.clientX + FINGER, ev.clientY);
    return Math.min(12, Math.hypot(b.x - a.x, b.y - a.y));
  };
  const local = ev => { const r = c3.getBoundingClientRect(); return { x: ev.clientX - r.left, y: ev.clientY - r.top }; };
  c3.addEventListener("pointermove", ev => {
    if (touches.has(ev.pointerId)) {
      touches.set(ev.pointerId, { x: ev.clientX, y: ev.clientY });
      if (touches.size === 2) {
        const [a, b] = [...touches.values()], d = Math.hypot(a.x - b.x, a.y - b.y);
        if (pinch) r3.zoom(pinch / d);
        pinch = d;
        return;
      }
    }
    if (ev.pointerType !== "touch") {
      hoverScreen = local(ev);
      hover = r3.pickPoint(ev.clientX, ev.clientY);
    }
    if (drag) {
      r3.orbit(ev.clientX - drag.x, ev.clientY - drag.y);
      drag.x = ev.clientX; drag.y = ev.clientY;
    }
  });
  c3.addEventListener("pointerleave", () => { hover = null; hoverScreen = null; });
  c3.addEventListener("pointerdown", ev => {
    const touch = ev.pointerType === "touch";
    if (touch) {
      touches.set(ev.pointerId, { x: ev.clientX, y: ev.clientY });
      if (touches.size === 2) { drag = null; pinch = 0; return; }   // second finger: pinch, not tap
    }
    hoverScreen = touch ? null : local(ev);
    const hit = clickAt(r3.pickPoint(ev.clientX, ev.clientY), touch ? slack3D(ev) : 0);
    if (touch) hover = null;
    if (hit) return;
    drag = { x: ev.clientX, y: ev.clientY };
    c3.classList.add("orbiting");
    c3.setPointerCapture(ev.pointerId);
  });
  const stop = ev => {
    drag = null;
    c3.classList.remove("orbiting");
    if (ev) touches.delete(ev.pointerId);
    if (touches.size < 2) pinch = 0;
  };
  c3.addEventListener("pointerup", stop);
  c3.addEventListener("pointercancel", stop);
  c3.addEventListener("dblclick", () => r3.resetView());
  c3.addEventListener("wheel", ev => { ev.preventDefault(); r3.zoom(ev.deltaY > 0 ? 1.08 : 1 / 1.08); }, { passive: false });
  c3.addEventListener("contextmenu", ev => ev.preventDefault());
}

function applyView() {
  if (!r3) { el("btn-view").hidden = true; view3d = false; }
  document.body.classList.toggle("view-3d", view3d);
  el("world3d").hidden = !view3d;
  el("fx").hidden = !view3d;
  el("btn-view").querySelector("span").textContent = t(view3d ? "view.3d" : "view.2d");
  el("btn-full").querySelector("span").textContent = t(isFull() ? "ctl.exitFull" : "ctl.full");
  if (r3) r3.markDirty();
  if (game) game.dirty = true;
  if (r3) r3.markDirty();
}

/* Full screen. Where the browser allows it (desktops, Android) this is real
   full screen, and phones are asked to lock to landscape. iPhones do not let
   a page go full screen, so there — or if the request is refused — the game
   switches to an immersive mode that hides the menu bar and gives the board
   the whole page. Added to the home screen, the manifest opens it full screen
   either way. */
const fsEl = () => document.fullscreenElement || document.webkitFullscreenElement;
let pseudoFs = false;
const isFull = () => !!fsEl() || pseudoFs;

function setPseudo(on) {
  pseudoFs = on;
  document.body.classList.toggle("pseudo-fs", on);
  if (on) window.scrollTo(0, 0);
  onFullChange();
}

function toggleFull() {
  if (pseudoFs) { setPseudo(false); return; }
  if (fsEl()) {
    /* update the layout when the exit completes too: fullscreenchange is not
       delivered reliably everywhere */
    Promise.resolve((document.exitFullscreen || document.webkitExitFullscreen).call(document))
      .catch(() => {}).then(() => setTimeout(onFullChange, 50));
    return;
  }
  const root = document.documentElement;
  const req = root.requestFullscreen || root.webkitRequestFullscreen;
  const native = req && (document.fullscreenEnabled || document.webkitFullscreenEnabled);
  if (!native) { setPseudo(true); return; }
  Promise.resolve(req.call(root, { navigationUI: "hide" })).then(() => {
    onFullChange();
    if (!fsEl()) { setPseudo(true); return; }   // "succeeded" without actually going full screen
    try { screen.orientation && screen.orientation.lock && screen.orientation.lock("landscape").catch(() => {}); } catch (e) { /* not allowed */ }
  }).catch(() => setPseudo(true));
}

function onFullChange() {
  const on = isFull();
  document.body.classList.toggle("fullscreen", on);
  el("btn-full").setAttribute("aria-pressed", String(on));
  el("btn-full").querySelector("span").textContent = t(on ? "ctl.exitFull" : "ctl.full");
  el("btn-full-hud").title = el("btn-full-hud").ariaLabel = t(on ? "ctl.exitFull" : "ctl.full");
  if (r3) r3.markDirty();
}
document.addEventListener("fullscreenchange", onFullChange);
document.addEventListener("webkitfullscreenchange", onFullChange);
el("btn-full").onclick = toggleFull;

/* Sound on / off, remembered between visits. */
function showSound() {
  el("btn-sound").setAttribute("aria-pressed", String(soundOn));
  el("btn-sound").querySelector("span").textContent = t("btn.sound", { state: t(soundOn ? "state.on" : "state.off") });
}
function toggleSound() {
  soundOn = !soundOn;
  store.set("packetrush.sound", soundOn ? "on" : "off");
  showSound();
  if (soundOn) beep(660, 60, "triangle", 0.04, 200);      // a short confirmation, after the click unlocks audio
}
el("btn-sound").onclick = toggleSound;
el("btn-full-hud").onclick = toggleFull;

function toggleView() {
  if (!r3) return;
  view3d = !view3d;
  store.set("packetrush.view", view3d ? "3d" : "2d");
  applyView();
  el("skill-note").innerHTML = view3d ? t("view.hint") : "";
}

function nuke() {
  if (!running || game.state !== "playing") return;
  if (nukeArmed) {
    game.nuke();
    nukeArmed = 0;
    el("btn-nuke").classList.remove("armed");
  } else {
    nukeArmed = performance.now() + 2000;
    el("btn-nuke").classList.add("armed");
    el("skill-note").innerHTML = t("ctl.nukeConfirm");
  }
}

function toggleFast() {
  fast = !fast;
  el("btn-fast").setAttribute("aria-pressed", String(fast));
}

el("btn-pause").onclick = togglePause;
el("btn-fast").onclick = toggleFast;
const nudgeRate = d => { if (game && game.setRate(game.rate + d)) { beep(d > 0 ? 440 : 660, 30, "triangle", 0.03); updateHUD(); } };
el("btn-rate-down").onclick = () => nudgeRate(4);     // longer gap = slower release
el("btn-rate-up").onclick = () => nudgeRate(-4);
el("btn-view").onclick = toggleView;
el("btn-restart").onclick = () => startLevel(levelIndex, true);
el("btn-nuke").onclick = nuke;

document.addEventListener("keydown", ev => {
  if (ev.target.closest && ev.target.closest("dialog[open]")) return;
  if (ev.ctrlKey || ev.metaKey || ev.altKey) return;
  const k = ev.key.toLowerCase();
  const skill = SKILLS.find(s => s.key === k);
  if (skill) { selectSkill(skill.id); ev.preventDefault(); return; }
  if (k === "p" || k === " " && running) { togglePause(); ev.preventDefault(); }
  else if (k === "f") toggleFast();
  else if (k === "v") toggleView();
  else if (k === "-" || k === "_") nudgeRate(4);
  else if (k === "=" || k === "+") nudgeRate(-4);
  else if (k === "g") toggleFull();
  else if (k === "m") toggleSound();
  else if (k === "escape" && pseudoFs) setPseudo(false);
  else if (k === "r") startLevel(levelIndex, true);
  else if (k === "k") nuke();
  else if (k === "enter" && !running && !el("overlay").classList.contains("hidden")) { el("ov-primary").click(); ev.preventDefault(); }
});

/* ------------------------------------------------------------- dialogs */
function renderDaily() {
  const box = el("daily"), i = dailyLevel(), lv = PACKET_LEVELS[i], done = !!progress.daily[todayKey()];
  const locked = i + 1 > progress.unlocked;
  box.className = "daily" + (done ? " done" : "");
  box.innerHTML = `<div><h3>🏁 ${t("daily.title")}</h3><p>${t("daily.text", { n: i + 1, name: L(lv.name), time: fmtTime(lv.par.time * TICK_HZ) })}</p>`
    + `<span class="streak">${done ? t("daily.done") : locked ? t("daily.locked", { n: i + 1 }) : ""} ${t("daily.streak", { n: dailyStreak() })}</span></div>`;
  if (!locked) {
    const b = document.createElement("button");
    b.className = "btn btn-primary";
    b.textContent = t("daily.play");
    b.onclick = () => { el("levels-dialog").close(); startLevel(i, false, true); };
    box.append(b);
  }
}

let levelView = store.get("packetrush.levelView", "layers");
function levelCard(lv, i) {
  const b = document.createElement("button");
  const locked = i + 1 > progress.unlocked;
  b.className = "level-card" + (locked ? " locked" : "");
  const best = progress.best[lv.id], st = progress.stars[lv.id] || 0;
  b.innerHTML = `<span class="pill">${t("hud.level", { n: i + 1 })}</span><strong>${L(lv.name)}</strong>`
    + `<span class="lv-best">${locked ? t("levels.locked") : best ? t("levels.best", { n: best, count: lv.count }) : t("levels.none")}</span>`
    + (locked ? "" : `<span class="lv-stars" aria-label="${st}/3">${starText(st)}</span>`);
  b.disabled = locked;
  b.onclick = () => { el("levels-dialog").close(); startLevel(i); };
  return b;
}

function openChallenges() { levelView = "challenges"; store.set("packetrush.levelView", levelView); openLevels(); }

function renderChallenges(list) {
  list.innerHTML = `<p class="ch-intro">${t("ch.intro")}</p>`;
  /* difficulty filter: show one difficulty across every category, or all */
  const filters = document.createElement("div");
  filters.className = "ch-filters";
  for (const f of [{ id: "all", name: null, color: null }, ...DIFFICULTIES]) {
    const b = document.createElement("button");
    b.className = "ch-filter";
    b.textContent = f.name ? L(f.name) : t("ch.all");
    if (f.color) b.style.setProperty("--f", f.color);
    b.setAttribute("aria-pressed", String(challengeFilter === f.id));
    b.onclick = () => { challengeFilter = f.id; store.set("packetrush.chFilter", f.id); renderChallenges(list); };
    filters.append(b);
  }
  list.append(filters);
  for (const cat of CATEGORIES) {
    const all = CHALLENGE_LEVELS.filter(c => c.category === cat.id);
    const row = challengeFilter === "all" ? all : all.filter(c => c.difficulty === challengeFilter);
    const earned = row.reduce((a, lv) => a + (progress.stars[lv.id] || 0), 0);
    const sec = document.createElement("section");
    sec.className = "ch-cat";
    const earnedAll = all.reduce((a, lv) => a + (progress.stars[lv.id] || 0), 0);
    sec.innerHTML = `<h3><span>${cat.icon}</span>${L(cat.name)}<span class="wstars">${t("levels.worldStars", { n: earnedAll, max: all.length * 3 })}</span></h3>`;
    const grid = document.createElement("div");
    grid.className = "ch-row" + (challengeFilter === "all" ? "" : " filtered");
    row.forEach((lv, i) => {
      const diff = DIFFICULTIES.find(d => d.id === lv.difficulty), open = challengeOpen(lv), st = progress.stars[lv.id] || 0;
      const b = document.createElement("button");
      b.className = "level-card" + (open ? "" : " locked");
      b.style.setProperty("--diff", diff.color);
      b.innerHTML = `<span class="diff">${L(diff.name)}</span><strong>${L(lv.name)}</strong>`
        + (open ? `<span class="lv-best">${progress.best[lv.id] ? t("levels.best", { n: progress.best[lv.id], count: lv.count }) : t("levels.none")}</span><span class="lv-stars">${starText(st)}</span>`
          : `<span class="lv-best">${t("ch.locked", { prev: L(DIFFICULTIES.find(d => d.id === row[i - 1].difficulty).name) })}</span>`);
      b.disabled = !open;
      b.onclick = () => { el("levels-dialog").close(); startChallenge(lv); };
      grid.append(b);
    });
    sec.append(grid);
    list.append(sec);
  }
}

function openLevels() {
  renderDaily();
  el("tab-layers").setAttribute("aria-selected", String(levelView === "layers"));
  el("tab-order").setAttribute("aria-selected", String(levelView === "order"));
  el("tab-challenges").setAttribute("aria-selected", String(levelView === "challenges"));
  const list = el("level-list");
  list.innerHTML = "";
  list.classList.toggle("worlds", levelView === "layers");
  list.classList.toggle("challenges", levelView === "challenges");
  if (levelView === "challenges") {
    renderChallenges(list);
    if (!el("levels-dialog").open) el("levels-dialog").showModal();
    return;
  }
  if (levelView === "layers") {
    /* seven worlds, climbing the stack from the wire to the application */
    for (let n = 1; n <= 7; n++) {
      const layer = OSI_LAYERS.find(l => l.n === n), levels = PACKET_LEVELS.map((lv, i) => [lv, i]).filter(([lv]) => lv.world === n);
      const earned = levels.reduce((a, [lv]) => a + (progress.stars[lv.id] || 0), 0);
      const w = document.createElement("section");
      w.className = "world";
      w.style.setProperty("--layer", OSI_COLORS[n]);
      w.innerHTML = `<div class="world-head"><span class="num">${n}</span><strong>${L(layer.name)}</strong>`
        + `<span class="sub">${L(layer.job)}</span><span class="wstars">${t("levels.worldStars", { n: earned, max: levels.length * 3 })}</span></div>`;
      const grid = document.createElement("div");
      grid.className = "world-levels";
      for (const [lv, i] of levels) grid.append(levelCard(lv, i));
      w.append(grid);
      list.append(w);
    }
    if (!el("levels-dialog").open) el("levels-dialog").showModal();
    return;
  }
  PACKET_LEVELS.forEach((lv, i) => list.append(levelCard(lv, i)));
  if (!el("levels-dialog").open) el("levels-dialog").showModal();
}

function buildHelp() {
  const box = el("help-skills");
  box.innerHTML = "";
  for (const s of SKILLS) {
    const row = document.createElement("div");
    row.className = "help-skill";
    const c = document.createElement("canvas");
    drawSkillIcon(c, s.id);
    const txt = document.createElement("div");
    txt.innerHTML = `<b>${t("skill." + s.id)}</b> <kbd>${s.key}</kbd> — ${t("sk." + s.id)}`;
    row.append(c, txt);
    box.append(row);
  }
}

/* --------------------------------------------------- language and theme */
function applyText() {
  if (typeof showSound === "function") showSound();
  document.documentElement.lang = lang === "zh" ? "zh-CN" : "en";
  document.body.classList.toggle("lang-zh", lang === "zh");
  document.title = t("app.title") + (lang === "zh" ? " —— 把数据包送到服务器" : " — guide the packets to the server");
  for (const n of document.querySelectorAll("[data-t]")) n.textContent = t(n.dataset.t);
  for (const n of document.querySelectorAll("[data-th]")) n.innerHTML = t(n.dataset.th);
  el("btn-lang").textContent = t("lang.other");
  for (const o of el("theme-pick").options) o.textContent = t("theme." + o.value);
  for (const o of el("backdrop-pick").options) o.textContent = t("bg." + o.value);
  el("backdrop-pick").value = backdrop;
  el("backdrop-pick").title = t("bg.label");
  el("theme-pick").title = t("theme.label");
  el("btn-pause").querySelector("span").textContent = t(paused ? "ctl.resume" : "ctl.pause");
  buildHelp();
  el("btn-view").querySelector("span").textContent = t(view3d ? "view.3d" : "view.2d");
  if (game) {
    buildSkills();
    if (selected) selectSkill(selected);
    updateHUD();
    if (!running && game.state === "playing") showIntro();
    else if (!running) showResult();
  }
}

function applyTheme() {
  if (!THEMES[theme]) theme = "bright";
  for (const name of Object.keys(THEMES)) document.body.classList.toggle("rush-" + name, name === theme);
  el("theme-pick").value = theme;
  if (game) game.dirty = true;
}

el("btn-lang").onclick = () => { lang = lang === "zh" ? "en" : "zh"; store.set("bitbuilder.lang", lang); applyText(); };
el("theme-pick").onchange = ev => {
  theme = ev.target.value;
  store.set("packetrush.theme", theme);
  if (theme === "bright" || theme === "dark") store.set("bitbuilder.theme", theme);
  applyTheme();
  ev.target.blur();                      // hand the keyboard back to the game
};
el("btn-levels").onclick = openLevels;
el("tab-layers").onclick = () => { levelView = "layers"; store.set("packetrush.levelView", levelView); openLevels(); };
el("tab-order").onclick = () => { levelView = "order"; store.set("packetrush.levelView", levelView); openLevels(); };
el("tab-challenges").onclick = openChallenges;
el("btn-challenges").onclick = openChallenges;
el("backdrop-pick").onchange = ev => {
  backdrop = ev.target.value;
  store.set("packetrush.backdrop", backdrop);
  layerKey = "";
  if (r3) r3.markDirty();
  ev.target.blur();
};
el("btn-help").onclick = () => el("help-dialog").showModal();
el("btn-osi").onclick = () => openOsi(null);
el("btn-class").onclick = openClass;

/* ---------------------------------------------------------------- boot */
applyTheme();
applyText();
applyView();
/* index.html#lvl=<code> plays a shared level; #custom plays the editor's test level */
let bootError = "";
try {
  const h = location.hash;
  if (h.startsWith("#lvl=")) customLevel = decodeLevel(h);
  else if (h === "#custom") customLevel = decodeLevel(store.get("packetrush.custom", ""));
} catch (e) { customLevel = null; bootError = e.message; }
const saved = Number(store.get("packetrush.level", "0"));
startLevel(customLevel ? -1 : Math.min(Number.isFinite(saved) ? saved : 0, progress.unlocked - 1, PACKET_LEVELS.length - 1));
if (bootError) el("skill-note").innerHTML = t("custom.bad", { why: escapeHtml(bootError) });
requestAnimationFrame(t0 => { last = t0; requestAnimationFrame(loop); });
