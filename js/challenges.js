/* ============================================================================
   PACKET RUSH — the Challenge Pack
   Sixteen extra levels outside the campaign: four categories, each with an
   Easy, Intermediate, Difficult and Insane level. Easy is always open; each
   harder level unlocks when the one before it in the same category is
   cleared. Same format as levels.js (m: 2 is shielded steel, m: 0 cuts a
   hole). Every level is proven winnable, not self-winning and three-star
   reachable by tools/check.js, using tools/challenge-solutions.js.
   ========================================================================== */

const CATEGORIES = [
  { id: "dig", icon: "⛏", name: { en: "Dig & Tunnel", zh: "挖掘与隧道" } },
  { id: "bridge", icon: "🌉", name: { en: "Bridges & Climbs", zh: "架桥与攀爬" } },
  { id: "route", icon: "🧭", name: { en: "Routing & Congestion", zh: "路由与拥塞" } },
  { id: "secure", icon: "🛡", name: { en: "Security", zh: "网络安全" } }
];
const DIFFICULTIES = [
  { id: "easy", name: { en: "Easy", zh: "简单" }, color: "#4ade80" },
  { id: "intermediate", name: { en: "Intermediate", zh: "中等" }, color: "#38bdf8" },
  { id: "difficult", name: { en: "Difficult", zh: "困难" }, color: "#f5a524" },
  { id: "insane", name: { en: "Insane", zh: "疯狂" }, color: "#f87171" }
];

const CHALLENGE_LEVELS = [
  /* ------------------------------------------------------- Dig & Tunnel */
  {
    id: "dig-easy", category: "dig", difficulty: "easy", world: 3, osi: [3],
    name: { en: "Trapdoor", zh: "活板门" },
    count: 10, need: 7, rate: 40, ttl: 120,
    par: { saved: 10, skills: 1, time: 40 },
    hatch: { x: 100, y: 60 }, exit: { x: 330, y: 149 },
    skills: { pipe: 1 },
    terrain: [
      { x: 0, y: 150, w: 400, h: 50 },
      { x: 40, y: 100, w: 320, h: 16 },
      { x: 30, y: 60, w: 10, h: 56, m: 2 }, { x: 360, y: 60, w: 10, h: 56, m: 2 }
    ],
    goal: { en: "The packets are pacing a shelf above the server. One <b>Pipe</b> is all it takes.", zh: "数据包在服务器上方的平台上来回走。只需要一次<b>管道</b>。" },
    note: { en: "Every packet carries its destination; a path down is all it needs.", zh: "每个数据包都带着目的地址，它只需要一条往下的路。" },
    osiWhy: { en: "Packets are the Network layer's unit of data.", zh: "数据包是网络层的数据单位。" }
  },
  {
    id: "dig-intermediate", category: "dig", difficulty: "intermediate", world: 3, osi: [3],
    name: { en: "Under the Wall", zh: "墙下通道" },
    count: 10, need: 7, rate: 45, ttl: 150,
    par: { saved: 10, skills: 2, time: 60 },
    hatch: { x: 50, y: 95 }, exit: { x: 256, y: 169 },
    skills: { pipe: 1, tunnel: 1 },
    terrain: [
      { x: 0, y: 140, w: 400, h: 30 },
      { x: 0, y: 170, w: 400, h: 30, m: 2 },
      { x: 200, y: 40, w: 10, h: 100, m: 2 },
      { x: 242, y: 140, w: 28, h: 30, m: 0 }
    ],
    goal: { en: "A shielded wall blocks the road and nothing digs through it — but the ground underneath is silicon. <b>Pipe</b> down, then <b>Tunnel</b> under the wall into the server's pit.", zh: "一堵屏蔽墙挡住了道路，什么都挖不穿 —— 但下面的地层是硅。先用<b>管道</b>向下挖，再用<b>隧道</b>从墙下穿到服务器所在的坑里。" },
    note: { en: "When one route is blocked, a different path through the network still gets there.", zh: "一条路线被封锁时，换一条穿过网络的路径照样能到达。" },
    osiWhy: { en: "Finding another path is routing — the Network layer.", zh: "寻找另一条路径就是路由 —— 网络层的工作。" }
  },
  {
    id: "dig-difficult", category: "dig", difficulty: "difficult", world: 3, osi: [1, 3],
    name: { en: "Bedrock", zh: "基岩" },
    count: 10, need: 8, rate: 32, ttl: 140,
    par: { saved: 10, skills: 2, time: 60 },
    hatch: { x: 40, y: 75 }, exit: { x: 330, y: 171 },
    skills: { tunnel: 1, pipe: 1 },
    terrain: [
      { x: 0, y: 120, w: 400, h: 20 },
      { x: 0, y: 130, w: 400, h: 10, m: 2 },
      { x: 240, y: 130, w: 10, h: 10, m: 0 },
      { x: 240, y: 130, w: 10, h: 10, m: 1 },
      { x: 140, y: 60, w: 24, h: 60 },
      { x: 120, y: 40, w: 70, h: 20, m: 2 },
      { x: 390, y: 60, w: 10, h: 60, m: 2 },
      { x: 0, y: 172, w: 400, h: 28 }
    ],
    goal: { en: "<b>Tunnel</b> through the silicon block, then find the <b>one gap</b> in the steel bedrock and <b>Pipe</b> straight down through it. Dig a pixel off and you hit steel.", zh: "先用<b>隧道</b>穿过硅块，再找到钢质基岩上<b>唯一的缺口</b>，用<b>管道</b>从那里垂直挖下去。偏一点就会碰到钢板。" },
    note: { en: "Real networks have chokepoints: one cable, one exchange, one way down.", zh: "真实的网络也有咽喉要道：一根线缆、一个交换中心、唯一的一条路。" },
    osiWhy: { en: "Cables and ducts are the Physical layer; the way through them is routing.", zh: "线缆和管道属于物理层，穿过它们的路径属于路由。" }
  },
  {
    id: "dig-insane", category: "dig", difficulty: "insane", world: 7, osi: [3, 7],
    name: { en: "Demolition", zh: "爆破" },
    count: 10, need: 7, rate: 30, ttl: 120,
    par: { saved: 8, skills: 3, time: 70 },
    hatch: { x: 220, y: 75 }, exit: { x: 70, y: 174 },
    skills: { firewall: 1, overflow: 1, pipe: 1 },
    terrain: [
      { x: 0, y: 120, w: 330, h: 20 },
      { x: 0, y: 130, w: 330, h: 10, m: 2 },
      { x: 40, y: 130, w: 10, h: 10, m: 0 },
      { x: 40, y: 130, w: 10, h: 10, m: 1 },
      { x: 110, y: 60, w: 6, h: 60 },
      { x: 60, y: 40, w: 120, h: 20, m: 2 },
      { x: 0, y: 175, w: 110, h: 25 }
    ],
    goal: { en: "Three moves, no spares: a <b>Firewall</b> before the cliff, an <b>Overflow</b> against the thin wall, and a <b>Pipe</b> through the only gap in the bedrock beyond it.", zh: "三步，没有备用：在悬崖前设<b>防火墙</b>，在薄墙旁<b>溢出</b>，再从墙后基岩唯一的缺口用<b>管道</b>挖下去。" },
    note: { en: "An overflow is destructive — and a firewall is only as good as where you put it.", zh: "溢出具有破坏性 —— 防火墙的作用取决于你把它放在哪里。" },
    osiWhy: { en: "Overflows are application bugs; the path they open is a Network-layer route.", zh: "溢出是应用程序的缺陷；它炸开的通路是网络层的路径。" }
  },

  /* --------------------------------------------------- Bridges & Climbs */
  {
    id: "bridge-easy", category: "bridge", difficulty: "easy", world: 2, osi: [2],
    name: { en: "Mind the Gap", zh: "小心缺口" },
    count: 10, need: 7, rate: 75, ttl: 150,
    par: { saved: 10, skills: 1, time: 65 },
    hatch: { x: 50, y: 85 }, exit: { x: 340, y: 129 },
    skills: { bridge: 2 },
    terrain: [{ x: 0, y: 130, w: 180, h: 20 }, { x: 198, y: 130, w: 202, h: 20 }],
    goal: { en: "One small gap between two segments. <b>Bridge</b> it with the first packet.", zh: "两个网段之间有一个小缺口。让第一个数据包<b>搭桥</b>。" },
    note: { en: "A bridge joins two segments into one network.", zh: "网桥把两个网段连成一个网络。" },
    osiWhy: { en: "Bridges work at the Data Link layer.", zh: "网桥工作在数据链路层。" }
  },
  {
    id: "bridge-intermediate", category: "bridge", difficulty: "intermediate", world: 2, osi: [2],
    name: { en: "Two Hops", zh: "两跳" },
    count: 10, need: 7, rate: 80, ttl: 160,
    par: { saved: 10, skills: 2, time: 80 },
    hatch: { x: 40, y: 85 }, exit: { x: 360, y: 129 },
    skills: { bridge: 3 },
    terrain: [{ x: 0, y: 130, w: 120, h: 20 }, { x: 138, y: 130, w: 112, h: 20 }, { x: 268, y: 130, w: 132, h: 20 }],
    goal: { en: "Two gaps now. The same packet can <b>Bridge</b> both — if it gets to the second one in time.", zh: "这次有两个缺口。同一个数据包可以把两个都<b>搭桥</b> —— 只要它及时赶到第二个缺口。" },
    note: { en: "Traffic crossing several segments passes through a bridge or switch at each one.", zh: "跨越多个网段的流量，在每一段都要经过网桥或交换机。" },
    osiWhy: { en: "Each hop between segments is a Data Link frame.", zh: "网段之间的每一跳都是一个数据链路层帧。" }
  },
  {
    id: "bridge-difficult", category: "bridge", difficulty: "difficult", world: 4, osi: [2, 4],
    name: { en: "Up and Over", zh: "翻越" },
    count: 6, need: 5, rate: 60, ttl: 160,
    par: { saved: 6, skills: 7, time: 75 },
    hatch: { x: 40, y: 125 }, exit: { x: 360, y: 134 },
    skills: { uplink: 6, bridge: 2 },
    terrain: [
      { x: 0, y: 170, w: 150, h: 30 },
      { x: 150, y: 80, w: 10, h: 120, m: 2 },
      { x: 160, y: 80, w: 70, h: 8 },
      { x: 248, y: 80, w: 52, h: 8 },
      { x: 300, y: 135, w: 100, h: 65 }
    ],
    goal: { en: "Every packet needs an <b>Uplink</b> to climb the shielded wall. At the top a gap waits — <b>Bridge</b> it before the climbers get there.", zh: "每个数据包都需要<b>上行链路</b>才能爬上屏蔽墙。墙顶有一个缺口 —— 在攀爬者到达之前把它<b>搭桥</b>。" },
    note: { en: "Getting traffic up to a higher network is an uplink; crossing at the top is a bridge.", zh: "把流量送到更高一层的网络叫上行链路；在顶端跨越缺口就是网桥。" },
    osiWhy: { en: "Uplinks and bridges are Data Link; getting every packet across is Transport's job.", zh: "上行链路和网桥属于数据链路层；让每个数据包都送达是传输层的职责。" }
  },
  {
    id: "bridge-insane", category: "bridge", difficulty: "insane", world: 1, osi: [1, 2],
    name: { en: "Staircase", zh: "天梯" },
    count: 10, need: 8, rate: 64, ttl: 150,
    par: { saved: 9, skills: 4, time: 90 },
    hatch: { x: 40, y: 85 }, exit: { x: 370, y: 129 },
    skills: { bridge: 4 },
    hazards: [{ x: 100, y: 150, w: 20, h: 10 }, { x: 200, y: 150, w: 38, h: 10 }, { x: 300, y: 150, w: 20, h: 10 }],
    terrain: [
      { x: 0, y: 130, w: 100, h: 20 }, { x: 120, y: 130, w: 80, h: 20 },
      { x: 238, y: 130, w: 62, h: 20 }, { x: 320, y: 130, w: 80, h: 20 },
      { x: 0, y: 160, w: 400, h: 40, m: 2 }
    ],
    goal: { en: "Three gaps over live wires and exactly <b>four bridges</b>. The middle gap is too wide for one — chain a second bridge straight off the end of the first.", zh: "三个缺口下面都是带电导线，你正好有<b>四座桥</b>。中间的缺口一座桥不够 —— 在第一座桥的末端立刻接上第二座。" },
    note: { en: "Long cables need repeaters: each one carries the signal a little further.", zh: "长距离线缆需要中继器：每一个都把信号再往前送一段。" },
    osiWhy: { en: "Spans over long distances are a Physical-layer problem.", zh: "长距离的跨越是物理层的问题。" }
  },

  /* ----------------------------------------------- Routing & Congestion */
  {
    id: "route-easy", category: "route", difficulty: "easy", world: 3, osi: [3],
    name: { en: "Left or Right", zh: "向左还是向右" },
    count: 8, need: 6, rate: 90, ttl: 120,
    par: { saved: 8, skills: 0, time: 50 },
    dests: "ABBAABAB",
    hatch: { x: 200, y: 95 }, exit: { x: 50, y: 139 },
    servers: [{ x: 50, y: 139, addr: "10.1.0.1" }, { x: 350, y: 139, addr: "10.2.0.1" }],
    switches: [{ x: 200, y: 139, dir: 1 }],
    skills: {},
    terrain: [{ x: 0, y: 140, w: 400, h: 20 }, { x: 0, y: 160, w: 400, h: 40, m: 2 }],
    goal: { en: "Click the <b>route switch</b> to send each packet to the server its tag matches. Plenty of time between packets.", zh: "点击<b>路由开关</b>，把每个数据包送到与它标签颜色相同的服务器。数据包之间的间隔很充裕。" },
    note: { en: "A router reads the destination address and picks the way out.", zh: "路由器读取目的地址，选择出口方向。" },
    osiWhy: { en: "Forwarding by IP address is the Network layer.", zh: "按 IP 地址转发属于网络层。" }
  },
  {
    id: "route-intermediate", category: "route", difficulty: "intermediate", world: 3, osi: [3],
    name: { en: "Three Subnets", zh: "三个子网" },
    count: 9, need: 7, rate: 90, ttl: 150,
    par: { saved: 9, skills: 0, time: 65 },
    dests: "ACBCABBAC",
    hatch: { x: 200, y: 40 }, exit: { x: 60, y: 129 },
    servers: [{ x: 60, y: 129, addr: "10.0.1.1" }, { x: 180, y: 174, addr: "10.0.2.1" }, { x: 370, y: 129, addr: "10.0.3.1" }],
    switches: [{ x: 200, y: 79, dir: 1 }, { x: 300, y: 129, dir: 1 }],
    skills: {},
    terrain: [
      { x: 120, y: 80, w: 160, h: 8 },
      { x: 30, y: 130, w: 130, h: 10 },
      { x: 240, y: 130, w: 160, h: 10 },
      { x: 100, y: 175, w: 140, h: 25 },
      { x: 20, y: 90, w: 10, h: 50, m: 2 }
    ],
    goal: { en: "Three subnets and <b>two switches</b>. The top switch splits left from right; the lower one splits the right-hand traffic between the pink and green servers.", zh: "三个子网，<b>两个开关</b>。上面的开关分左右；下面的开关再把右边的流量分给粉色和绿色服务器。" },
    note: { en: "Routing is hop by hop: each router only decides the next step.", zh: "路由是逐跳进行的：每个路由器只决定下一步往哪走。" },
    osiWhy: { en: "Subnets and next hops are the Network layer.", zh: "子网与下一跳属于网络层。" }
  },
  {
    id: "route-difficult", category: "route", difficulty: "difficult", world: 4, osi: [3, 4],
    name: { en: "Rush Hour", zh: "高峰时段" },
    count: 12, need: 9, rate: 18, ttl: 60,
    par: { saved: 11, skills: 0, time: 60 },
    rateRange: [14, 60],
    dests: "ABABBAABABBA",
    hatch: { x: 120, y: 95 }, exit: { x: 30, y: 139 },
    servers: [{ x: 30, y: 139, addr: "10.0.0.10" }, { x: 370, y: 139, addr: "10.0.0.20" }],
    switches: [{ x: 120, y: 139, dir: 1 }],
    links: [{ x: 160, y: 100, w: 140, h: 40, capacity: 3 }],
    skills: {},
    terrain: [{ x: 0, y: 140, w: 400, h: 20 }, { x: 0, y: 160, w: 400, h: 40, m: 2 }],
    goal: { en: "Route every packet — and the road to the pink server runs through a <b>link that carries three at a time</b>. The router is flooding it: slow the release with <b>−</b>.", zh: "为每个数据包选路 —— 通往粉色服务器的路要经过<b>一次只能容纳三个数据包的链路</b>。路由器发得太快了：用 <b>−</b> 放慢发送。" },
    note: { en: "Routing and congestion meet at peak time: the right path can still be too full.", zh: "高峰时段，路由与拥塞同时出现：路走对了，也可能太挤。" },
    osiWhy: { en: "Routing is layer 3; pacing the traffic is layer 4.", zh: "选路属于第 3 层，控制流量节奏属于第 4 层。" }
  },
  {
    id: "route-insane", category: "route", difficulty: "insane", world: 4, osi: [3, 4],
    name: { en: "Backbone", zh: "骨干网" },
    count: 12, need: 10, rate: 20, ttl: 100,
    par: { saved: 11, skills: 0, time: 60 },
    rateRange: [16, 80],
    types: "TU",
    dests: "ACBCABBACABC",
    hatch: { x: 200, y: 40 }, exit: { x: 60, y: 129 },
    servers: [{ x: 60, y: 129, addr: "172.16.0.1" }, { x: 180, y: 174, addr: "172.16.1.1" }, { x: 370, y: 129, addr: "172.16.2.1" }],
    switches: [{ x: 200, y: 79, dir: 1 }, { x: 300, y: 129, dir: 1 }],
    links: [{ x: 240, y: 95, w: 50, h: 35, capacity: 1 }],
    skills: {},
    terrain: [
      { x: 120, y: 80, w: 160, h: 8 },
      { x: 30, y: 130, w: 130, h: 10 },
      { x: 240, y: 130, w: 160, h: 10 },
      { x: 100, y: 175, w: 140, h: 25 },
      { x: 20, y: 90, w: 10, h: 50, m: 2 }
    ],
    goal: { en: "Three subnets, two switches, a link on the right that carries <b>one packet at a time</b> — and half the traffic is fast <b>UDP</b> that is never resent. Slow the router down and route without a mistake.", zh: "三个子网、两个开关、右侧一条<b>一次只能通过一个数据包</b>的链路 —— 而且一半流量是不会重传的高速 <b>UDP</b>。放慢路由器，并且一次都不要送错。" },
    note: { en: "A backbone carries everyone's traffic: one bad routing decision or one overloaded link and packets are gone.", zh: "骨干网承载着所有人的流量：一次错误的路由或一条过载的链路，数据包就没了。" },
    osiWhy: { en: "Routing at layer 3, congestion and UDP at layer 4.", zh: "路由属于第 3 层，拥塞与 UDP 属于第 4 层。" }
  },

  /* ------------------------------------------------------------ Security */
  {
    id: "secure-easy", category: "secure", difficulty: "easy", world: 3, osi: [3, 4],
    name: { en: "Edge Firewall", zh: "边界防火墙" },
    count: 8, need: 6, rate: 40, ttl: 100,
    par: { saved: 7, skills: 1, time: 40 },
    hatch: { x: 220, y: 100 }, exit: { x: 50, y: 139 },
    skills: { firewall: 1 },
    terrain: [{ x: 0, y: 140, w: 300, h: 20 }, { x: 0, y: 160, w: 60, h: 40 }],
    goal: { en: "Traffic is heading off the edge of the network. Put up a <b>Firewall</b> before the cliff.", zh: "流量正冲向网络边缘。在悬崖前设一道<b>防火墙</b>。" },
    note: { en: "A firewall at the edge decides what may pass.", zh: "边界上的防火墙决定什么可以通过。" },
    osiWhy: { en: "Packet filters read layer-3 addresses and layer-4 ports.", zh: "包过滤读取第 3 层地址和第 4 层端口。" }
  },
  {
    id: "secure-intermediate", category: "secure", difficulty: "intermediate", world: 6, osi: [3, 6],
    name: { en: "Public Wi-Fi", zh: "公共 Wi-Fi" },
    count: 10, need: 7, rate: 50, ttl: 150,
    par: { saved: 9, skills: 1, time: 65 },
    types: "T",
    hatch: { x: 50, y: 95 }, exit: { x: 340, y: 139 },
    mitm: [{ x: 140, y: 30, w: 120, h: 70 }],
    skills: { tunnel: 1, uplink: 4 },
    terrain: [
      { x: 0, y: 140, w: 400, h: 20 },
      { x: 0, y: 160, w: 400, h: 40, m: 2 },
      { x: 150, y: 100, w: 100, h: 40 }
    ],
    goal: { en: "Climbing over the hill means crossing the open Wi-Fi where someone is listening. The safe way is through: one <b>Tunnel</b>. (The Uplinks are a trap.)", zh: "爬过山丘就要穿过有人监听的公共 Wi-Fi。安全的走法是从中间穿过去：一次<b>隧道</b>。（上行链路是陷阱。）" },
    note: { en: "On shared Wi-Fi anyone nearby can listen; a VPN tunnel keeps your traffic private.", zh: "在共享 Wi-Fi 上，附近的任何人都可能在监听；VPN 隧道能保护你的流量。" },
    osiWhy: { en: "The eavesdropper is on the network path; encryption is Presentation.", zh: "窃听者位于网络路径上；加密属于表示层。" }
  },
  {
    id: "secure-difficult", category: "secure", difficulty: "difficult", world: 7, osi: [3, 4, 7],
    name: { en: "Botnet", zh: "僵尸网络" },
    count: 12, need: 7, rate: 45, ttl: 180,
    par: { saved: 8, skills: 2, time: 60 },
    types: "TU",
    hatch: { x: 40, y: 95 }, exit: { x: 340, y: 139 },
    skills: { firewall: 1, bridge: 1 },
    firewallRule: "junk",
    botnet: { x: 150, y: 95, dir: 1, count: 18, rate: 30, start: 20 },
    server: { capacity: 2, down: 160 },
    terrain: [
      { x: 0, y: 140, w: 88, h: 20 }, { x: 108, y: 140, w: 292, h: 20 },
      { x: 0, y: 160, w: 400, h: 40, m: 2 }, { x: 88, y: 160, w: 20, h: 40, m: 0 }
    ],
    goal: { en: "A bigger botnet and a weaker server: <b>two</b> junk packets take it offline. Bridge the gap fast and filter the flood with the <b>Firewall</b>.", zh: "更大的僵尸网络、更弱的服务器：<b>两个</b>垃圾包就能让它下线。尽快搭桥，再用<b>防火墙</b>过滤洪水。" },
    note: { en: "The weaker the server, the less junk it takes to knock it over — so filter early.", zh: "服务器越弱，越少的垃圾流量就能把它击垮 —— 所以要尽早过滤。" },
    osiWhy: { en: "Floods hit layers 3, 4 and 7.", zh: "洪水攻击涉及第 3、4、7 层。" }
  },
  {
    id: "secure-insane", category: "secure", difficulty: "insane", world: 6, osi: [3, 6, 7],
    name: { en: "Zero Trust", zh: "零信任" },
    count: 10, need: 7, rate: 50, ttl: 200,
    par: { saved: 8, skills: 3, time: 75 },
    types: "TU",
    hatch: { x: 40, y: 75 }, exit: { x: 304, y: 159 },
    skills: { firewall: 1, pipe: 1, tunnel: 1 },
    firewallRule: "junk",
    botnet: { x: 110, y: 75, dir: 1, count: 14, rate: 40, start: 150 },
    server: { capacity: 3, down: 140 },
    mitm: [{ x: 170, y: 80, w: 100, h: 40 }],
    terrain: [
      { x: 0, y: 120, w: 400, h: 40 },
      { x: 0, y: 160, w: 400, h: 40, m: 2 },
      { x: 290, y: 120, w: 28, h: 40, m: 0 }
    ],
    goal: { en: "Everything at once: a botnet flooding the server, an eavesdropper on the road, UDP that will not be resent. <b>Filter</b> the junk, then <b>Pipe</b> down and <b>Tunnel</b> under the eavesdropper to the server in the pit.", zh: "全部一起来：僵尸网络淹没服务器，路上有窃听者，UDP 不会重传。先<b>过滤</b>垃圾包，再用<b>管道</b>向下挖，并从窃听者下方挖<b>隧道</b>到坑底的服务器。" },
    note: { en: "Zero trust means assuming every link is hostile: filter, encrypt and verify everything.", zh: "零信任意味着假设每条链路都不可信：过滤一切、加密一切、验证一切。" },
    osiWhy: { en: "Filtering at 3, encryption at 6, the flood at 7.", zh: "过滤在第 3 层，加密在第 6 层，洪水攻击在第 7 层。" }
  }
];

if (typeof module !== "undefined") module.exports = { CHALLENGE_LEVELS, CATEGORIES, DIFFICULTIES };
