# Packet Rush

[![Level checks](https://github.com/SCLim999/Packet-Rush/actions/workflows/checks.yml/badge.svg)](https://github.com/SCLim999/Packet-Rush/actions/workflows/checks.yml)

**English · [中文](#中文)**

*Lemmings*, but the lemmings are network packets. They drop out of a router
and march blindly forward; you hand out jobs so that enough of them reach the
server before their **TTL** (time to live) runs out. Every job is a real
networking or systems idea, and every level teaches one of them — tied to the
OSI layer it lives on.

Pure static HTML/CSS/JS. No build step, no dependencies, no image assets —
the 3D view is a hand-written WebGL2 renderer and every sprite is drawn in
code. Clone it and open `index.html`, or serve the folder anywhere static.

**Play it:** https://sclim999.github.io/Packet-Rush/ (enable GitHub Pages under
*Settings → Pages → Deploy from a branch → `main` / root*).

## How to play

Packets walk forward until they hit a wall, then turn around. They step up
small ledges, but a long fall **corrupts** them and walking off the map
**drops** them. There are **no walls at the sides of the screen**: a
packet that walks off the left or right edge falls out of the network and is
lost. Every drop — including the screen sides — is marked on its lip with
warning stripes and an arrow: **amber** where the fall is survivable, **red** (with a
red line down the cliff) where it is deadly — too far, onto a live wire, or off
the map. The markers update as packets dig, build and blast. Pick a skill in the toolbar (or press <kbd>1</kbd>–<kbd>7</kbd>),
then click a packet to give it that job. Each level hands out a limited number
of each skill.

| Skill | Key | What it does | The idea behind it |
|---|---|---|---|
| Uplink | <kbd>1</kbd> | climbs any wall (permanent) | an uplink carries traffic up to the next network |
| Buffer | <kbd>2</kbd> | survives any fall (permanent) | a buffer absorbs a burst that would otherwise be lost |
| Overflow | <kbd>3</kbd> | freezes, then blows a hole five seconds later | a buffer overflow spills into neighbouring memory |
| Firewall | <kbd>4</kbd> | stands still and turns traffic back | a firewall filters packets between networks |
| Bridge | <kbd>5</kbd> | builds a twelve-step staircase | a bridge joins two network segments |
| Tunnel | <kbd>6</kbd> | digs sideways through silicon | a VPN tunnel carries traffic through a network that would block it |
| Pipe | <kbd>7</kbd> | digs straight down | a pipe passes one program's output down to the next |

| Action | Keys |
|---|---|
| Pause / fast forward / restart | <kbd>P</kbd> / <kbd>F</kbd> / <kbd>R</kbd> |
| Switch 3D / 2D view | <kbd>V</kbd>, or the *View* button |
| Tilt / zoom / reset the 3D camera | drag empty space / scroll / double-click |
| Sound on / off | <kbd>M</kbd>, or the *Sound* button (remembered) |
| Full screen | <kbd>G</kbd>, the *Full screen* button, or the ⛶ icon at the end of the status bar |
| End the run (*kill -9*) | <kbd>K</kbd> twice |
| Language | the *中文 / EN* button |
| Colours | the *Theme* picker: Bright, Dark, Soft, Energy, Excited |
| What is behind the board | the *Background* picker: OSI layers, TCP/IP layers, Data centre |

### Phones and tablets

- **Tap** a skill, then tap a packet. Taps reach a little further than a mouse
  click, so a fingertip near a packet still counts, and a short buzz confirms
  the job on phones that support it.
- **Portrait** stacks the board over a grid of skills and suggests turning the
  phone. **Landscape** puts the board on the left and the skills in a column
  on the right, sized to fill the screen.
- **3D view:** drag to tilt, pinch to zoom.
- **Full screen** hides the menu bar and gives the board the whole screen. On
  Android and desktops it is the browser's real full screen, and phones are
  asked to lock to landscape. iPhones do not let web pages go full screen, so
  there the button switches to an immersive mode instead — for true full
  screen on an iPhone, use *Share → Add to Home Screen*: the web app manifest
  opens it full screen, in landscape, with its own icon.
- Level cards open as full-screen sheets on small screens.

Progress and best scores are kept in `localStorage`, so finishing a level
unlocks the next one on that browser.

## The levels

| # | Level | Skill introduced | OSI layer |
|---|---|---|---|
| 1 | Packet Drop | Pipe | 3 Network |
| 2 | Firewall | Firewall | 3 Network, 4 Transport |
| 3 | Bridge the Gap | Bridge | 2 Data Link |
| 4 | Tunnel Vision | Tunnel | 3 Network, 6 Presentation |
| 5 | Uplink | Uplink + Buffer | 4 Transport |
| 6 | Stack Overflow | Overflow | 7 Application |
| 7 | Full Stack | everything | all seven |
| 8 | Best Effort | TCP and UDP packets | 4 Transport |
| 9 | Man in the Middle | an eavesdropper; tunnelling encrypts | 3 Network, 6 Presentation |
| 10 | Denial of Service | a botnet flood; a filtering firewall | 3, 4, 7 |
| 11 | Routing Table | addressed servers and route switches | 3 Network |
| 12 | Congestion Control | a link with a capacity; the release-rate control | 4 Transport |
| 13 | Keep-Alive | a session gate that times out | 5 Session |
| 14 | Fibre Cut | a cut cable and interference | 1 Physical |

The level list can show them **by OSI layer** — seven worlds climbing the
stack from Physical to Application, each with its stars — or in order.

### The Challenge Pack

Sixteen extra levels outside the campaign — the **Challenges** button, or
*Levels → Challenge Pack*: four categories, each with an **Easy**,
**Intermediate**, **Difficult** and **Insane** level. Every stage is open from
the start, so players choose what to play; the difficulty filter shows one
difficulty across all four categories (say, every Insane stage), and is
remembered. Challenge stars are kept separately from the campaign, and a win
offers the next difficulty in the same category.

| Category | Easy | Intermediate | Difficult | Insane |
|---|---|---|---|---|
| ⛏ Dig & Tunnel | Trapdoor — one pipe | Under the Wall — pipe, then tunnel under steel | Bedrock — tunnel, then pipe through the one gap in the bedrock | Demolition — firewall, overflow and pipe, no spares |
| 🌉 Bridges & Climbs | Mind the Gap — one bridge | Two Hops — one packet bridges twice | Up and Over — uplinks for everyone, a bridge at the top | Staircase — four bridges over live wires, one chained |
| 🧭 Routing & Congestion | Left or Right — one switch | Three Subnets — two switches, three servers | Rush Hour — routing plus a congested link | Backbone — three servers, a one-packet link, UDP |
| 🛡 Security | Edge Firewall — one firewall | Public Wi-Fi — tunnel past the eavesdropper (uplinks are a trap) | Botnet — a weaker server and a bigger flood | Zero Trust — botnet, eavesdropper and UDP together |

They live in `js/challenges.js`; their scripted solutions are in
`tools/challenge-solutions.js` (kept out of the game so the answers are not
shipped), and `node tools/check.js` proves each one winnable, not
self-winning and three-star reachable — `node tools/check.js dig-insane`
checks one by id.

### Stars and the daily challenge

Every level awards up to three stars: **★** for finishing, **★★** for
delivering the level's par number of packets, **★★★** for doing that with no
more than its par number of skills. `tools/check.js` proves three stars are
reachable on every level. The **daily challenge** picks one level per date
(the same for everyone) and asks for three stars within its par time; the
level list shows the challenge and your streak.

### Routing, congestion and sessions

| | What it does | The idea behind it |
|---|---|---|
| **Addressed servers** | several servers, each with an IP address and a colour; each packet carries a destination tag; delivering to the wrong server loses it | IP addressing |
| **Route switch** | a sign on the floor pointing packets left or right; click it to flip it — it costs no skill | a router forwarding by its routing table |
| **Congested link** | carries a set number of packets at a time; the newest to enter a full link is dropped | congestion and packet loss |
| **Release rate** | on some levels, − / + (or `-` / `=`) sets how often the router sends | TCP congestion control slows down on loss |
| **Session gate** | opens while a session is alive; crossing the handshake plate starts one, a packet standing on it keeps it alive, and packets reaching a closed gate time out | sessions, time-outs and keep-alives |

### Classroom mode

- **Quick check** — after each win, one question about the level's OSI
  layer: which layer the idea is on, what that layer's data unit is called, or
  which layer does a given job. The score is kept.
- **Class** — a student enters their name and the class code, and copies a
  **result code**: one line of text holding their stars per level, quiz score
  and daily streak, with a checksum so edited codes are rejected.
- **[Teacher page](teacher.html)** — paste the codes (one per line); it keeps
  the newest per student, filters by class, ranks the class by stars and quiz
  accuracy, shows stars per level, and copies the table as CSV.

No server is involved: codes travel however the class already shares text,
and nothing is uploaded.

### Level editor

**[The editor](editor.html)** paints a network the way the built-in levels are
written — rectangles of silicon, steel or empty space — and places the router,
the server, live wires, man-in-the-middle zones and a botnet. Set the packet
count and target, the release gap, the time limit, the packet types and how
many of each skill to hand out. **Check** runs the real engine: it catches a
floating or buried server and warns when the level wins with no skills.
**Test play** opens it in the game; **Copy share link** gives a link
(`index.html#lvl=<code>`) that anyone can open to play it. Custom levels never
touch the player's progress.

### Packet types and enemies

From level 8 on, the network fights back.

| | What it does | The idea behind it |
|---|---|---|
| **TCP packet** (blue) | lost once, it is resent from the router two seconds later | TCP acknowledges every segment and retransmits what goes missing |
| **UDP packet** (orange) | walks twice as fast, never resent | UDP is best effort: fast, no guarantees |
| **Botnet** (red router) | releases junk packets you cannot command; three reaching the server knock it offline (503) for a few seconds, and real packets arriving then are refused | a DDoS floods a server until it cannot answer real users |
| **Filtering firewall** | on the DDoS level the firewall drops junk and lets real traffic through | firewall rules filter attack traffic |
| **Man in the middle** (red zone) | steals any packet crossing it in the open; a packet given Tunnel is encrypted (padlock) and safe, and packets walking through its tunnel never enter the zone | encryption — a VPN tunnel or TLS — defeats eavesdropping |

The status bar shows how many packets were resent and whether the server is
online. The original seven levels use plain packets and are unchanged.

### The protocol stack behind the board

By default the play area sits on the **OSI model** itself: seven coloured
bands from 7 Application at the top to 1 Physical at the bottom, each labelled
with its number, name and data unit, and each showing what that layer carries
— HTTP and DNS requests, TLS and UTF-8, sessions opening and closing, TCP
segments to ports, a packet hopping between routers, Ethernet frames with MAC
header and checksum, and a square-wave bit signal. A message on the right
travels down the stack and picks up a header at each layer (DATA →
TCP|DATA → IP|TCP|DATA → ETH|IP|TCP|DATA|FCS → bits): encapsulation, made
visible. The layers the current level teaches are highlighted. The
*Background* picker switches to the four **TCP/IP** layers (the same space
grouped as Application, Transport, Internet and Link) or back to the data
centre. Works in both the 2D and 3D views.

Each level card explains its concept and names the OSI layer it belongs to.
The **OSI model** button opens a reference panel: the seven layers with their
job, data unit, example protocols and the levels that use them; encapsulation,
attacks by layer and a mnemonic; the four-layer TCP/IP model mapped onto OSI;
TCP versus UDP; and ports and sockets. Background reading linked from the
panel:

- [The OSI Model Explained — Network Supply](https://www.network-supply.com/blogs/knowledge/the-osi-model-explained)
- [TCP/IP protocols — IBM CICS TS 5.5 documentation](https://www.ibm.com/docs/en/cics-ts/5.5.0?topic=concepts-tcpip-protocols)
- [What is the OSI model? — Cloudflare Learning Center](https://www.cloudflare.com/learning/ddos/glossary/open-systems-interconnection-model-osi/)

## Files

| File | Purpose |
|---|---|
| `index.html` | the game |
| `css/base.css` | palette variables, top bar, buttons, dialogs, overlay |
| `css/game.css` | the five themes and everything specific to Packet Rush |
| `js/engine.js` | deterministic, tick-based simulation: pixel terrain, packets, skills |
| `js/levels.js` | **the levels** — rectangles of silicon and steel, hazards, skill budgets, concept notes, OSI tags — plus the OSI and TCP/IP reference text |
| `js/challenges.js`, `tools/challenge-solutions.js` | the Challenge Pack and its proven solutions |
| `js/backdrop.js` | the data centre behind the play area, shared by both views |
| `js/layers.js` | the OSI / TCP/IP layer bands, their animations and the encapsulation message |
| `js/render3d.js` | the 3D view: a WebGL2 renderer built from one instanced cube, camera and picking |
| `js/main.js` | 2D rendering, input, overlays, progress, interface text in English and Mandarin |
| `js/classroom.js` | the quiz questions, result codes and class ranking |
| `js/codec.js` | level share codes: encode, decode, and clamp anything untrusted |
| `editor.html`, `js/editor.js`, `css/editor.css` | the level editor |
| `teacher.html` | the class results page |
| `tools/check.js` | proves every level is winnable, not self-winning and three-star reachable; checks worlds, quiz questions, result codes and level codes |
| `manifest.webmanifest`, `icons/` | home-screen install: full screen, landscape, app icon |

## Editing levels

Levels live in `js/levels.js`. The world is 400 × 200 pixels; terrain is a list
of rectangles painted in order (`m: 1` silicon, the default and diggable;
`m: 2` shielded steel; `m: 0` cuts a hole). `hatch` is where packets drop in,
`exit` is the feet position of the server port, `rate` is ticks between
releases (20 ticks = one second) and `ttl` is the time limit in seconds.

After editing, run the checker (Node, no dependencies):

```bash
node tools/check.js       # every level
node tools/check.js 3     # one level, with a per-packet report
```

It replays a scripted solution for every level through the real engine and
fails if the level cannot be won, if it can be won without using any skill,
or if any text is missing in either language. A new level needs a scripted
solution added to `SOLUTIONS` in `tools/check.js`. The same check runs in CI on
every push and pull request.

---

## 中文

**Packet Rush（数据包大冲关）** 是一款旅鼠风格的网络解谜游戏：旅鼠变成了网络数据包。
它们从路由器里掉出来，只会盲目地向前走；你要给它们分配工作，让足够多的数据包在
**TTL**（生存时间）耗尽之前到达服务器。每一种技能都是真实的网络或系统概念，每一关
讲解其中一个，并标明它属于 OSI 模型的哪一层。

纯静态 HTML / CSS / JS：没有构建步骤，没有第三方依赖，也没有图片素材 —— 3D 视图由
手写的 WebGL2 渲染器绘制。克隆后直接打开 `index.html` 即可。

**屏幕两侧没有墙**：走出左右边缘的数据包会掉出网络并丢失。每个落差处（包括屏幕两侧）都有条纹和箭头标记：**琥珀色**表示可以安全落下，
**红色**表示会致命（太高、落在带电导线上或掉出地图）。挖掘、搭桥和爆破后，标记会随之更新。

**操作**：在工具栏选择技能（或按 <kbd>1</kbd>–<kbd>7</kbd>），再点击数据包分配工作。
<kbd>P</kbd> 暂停，<kbd>F</kbd> 快进，<kbd>R</kbd> 重来，<kbd>V</kbd> 切换 3D / 2D，<kbd>G</kbd> 全屏，<kbd>M</kbd> 声音开关，
连按两次 <kbd>K</kbd> 结束本局。3D 视图中拖动空白处旋转镜头，滚轮缩放，双击复位。
**配色**选单提供明亮、暗夜、柔和、活力、热烈五种配色。

**协议栈背景**：棋盘背后默认是 OSI 七层模型 —— 从顶部的第 7 层应用层到底部的第 1 层
物理层，每层都标有编号、名称和数据单位，并展示该层传输的内容（HTTP 请求、TLS、会话、
TCP 段与端口、在路由器之间跳转的数据包、以太网帧、比特信号）。右侧有一条消息沿协议栈
向下移动，每经过一层就加上一个首部，直观展示封装过程。当前关卡涉及的层会高亮显示。
**背景**选单可切换为 TCP/IP 四层或数据中心。

**星星与每日挑战**：每关最多三颗星 —— 通关得 ★，送达目标数量得 ★★，同时技能用量不超过
目标得 ★★★。每日挑战每天选定一关（所有人相同），要求在限定时间内拿到三颗星，并记录连续天数。

**路由、拥塞与会话**（第 11–14 关）：多台带 IP 地址的服务器，数据包带有目的地标签，点击
路由开关为它们指路；链路有容量上限，挤满时会丢包，部分关卡可以用 − / + 调整发送速率；
会话门在会话存活时才开放，站在握手板上的数据包就是保活信号；还有物理层关卡「光纤断裂」。
关卡列表可按 OSI 七层分组显示。

**课堂模式**：每次过关后有一道关于该关 OSI 层的小测验；学生在「班级」中输入名字和班级代码，
复制成绩码（含各关星星、测验得分和连续天数，带校验和）；老师在[教师页面](teacher.html)
粘贴成绩码即可为全班排名并导出 CSV。全程无需服务器，不上传任何数据。

**关卡编辑器**：在[编辑器](editor.html)中绘制硅层、钢板和空洞，放置路由器、服务器、带电
导线、中间人区域和僵尸网络，设置数量、目标、间隔、时限、数据包类型和技能；「检查」会用真实
引擎验证关卡，「试玩」直接进入游戏，「复制分享链接」生成任何人都能打开的关卡链接。

**挑战包**：在「关卡 → 挑战包」中有 16 个额外关卡，分为挖掘与隧道、架桥与攀爬、路由与拥塞、
网络安全四个类别，每类各有简单、中等、困难、疯狂四种难度。所有关卡一开始就全部开放，玩家可以
自由选择；难度筛选可以只显示某一难度（例如全部疯狂级）。点击顶栏的「挑战」按钮即可进入。每个关卡都经过检查程序验证：可以通关、不操作会失败、并且能拿到三颗星。

**手机与平板**：点选技能后点击数据包即可，触屏的点击范围更大。竖屏时技能排成网格，
横屏时棋盘在左、技能栏在右。3D 视图可双指缩放。**全屏**按钮会隐藏菜单栏；安卓和电脑上
使用浏览器的真正全屏并尝试锁定横屏，iPhone 不支持网页全屏，因此改用沉浸模式 —— 想在
iPhone 上真正全屏，请用「分享 → 添加到主屏幕」。

**七项技能**：上行链路（攀墙）、缓冲区（安全落地）、溢出（原地崩溃并炸出洞）、
防火墙（挡回数据包）、网桥（搭台阶）、隧道（横向挖掘）、管道（向下挖掘）。

**数据包类型与敌人**（第 8 关起）：蓝色 TCP 数据包丢失后会重传一次；橙色 UDP 数据包速度
快一倍但不会重传。红色路由器是**僵尸网络**，它放出的垃圾包无法指挥，三个进入服务器就会让
它下线（503），期间到达的真实数据包会被拒绝；拒绝服务关卡中的防火墙带有过滤规则，只拦截
垃圾包。红色的**中间人**区域会截获任何未加密的数据包 —— 挖隧道的数据包会被加密（锁形
标志），走隧道的数据包也不会进入该区域。

**学习内容**：每关的关卡卡片都有知识点说明，并标注对应的 OSI 层。**OSI 模型**按钮打开
参考面板：七层各自的作用、数据单位、示例协议，封装过程，按层划分的攻击，记忆口诀，
TCP/IP 四层模型与 OSI 的对应关系，TCP 与 UDP 的区别，以及端口与套接字。

**修改关卡**：关卡数据在 `js/levels.js` 中。修改后运行 `node tools/check.js`，它会用
真实引擎回放每关的参考解法，确认每关都能通关、且不操作就无法通关。
