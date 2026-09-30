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
**drops** them. Pick a skill in the toolbar (or press <kbd>1</kbd>–<kbd>7</kbd>),
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
| `js/backdrop.js` | the data centre behind the play area, shared by both views |
| `js/layers.js` | the OSI / TCP/IP layer bands, their animations and the encapsulation message |
| `js/render3d.js` | the 3D view: a WebGL2 renderer built from one instanced cube, camera and picking |
| `js/main.js` | 2D rendering, input, overlays, progress, interface text in English and Mandarin |
| `tools/check.js` | proves every level is winnable and not self-winning |
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

**操作**：在工具栏选择技能（或按 <kbd>1</kbd>–<kbd>7</kbd>），再点击数据包分配工作。
<kbd>P</kbd> 暂停，<kbd>F</kbd> 快进，<kbd>R</kbd> 重来，<kbd>V</kbd> 切换 3D / 2D，<kbd>G</kbd> 全屏，
连按两次 <kbd>K</kbd> 结束本局。3D 视图中拖动空白处旋转镜头，滚轮缩放，双击复位。
**配色**选单提供明亮、暗夜、柔和、活力、热烈五种配色。

**协议栈背景**：棋盘背后默认是 OSI 七层模型 —— 从顶部的第 7 层应用层到底部的第 1 层
物理层，每层都标有编号、名称和数据单位，并展示该层传输的内容（HTTP 请求、TLS、会话、
TCP 段与端口、在路由器之间跳转的数据包、以太网帧、比特信号）。右侧有一条消息沿协议栈
向下移动，每经过一层就加上一个首部，直观展示封装过程。当前关卡涉及的层会高亮显示。
**背景**选单可切换为 TCP/IP 四层或数据中心。

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
