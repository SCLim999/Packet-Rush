/* Scripted solutions for the Challenge Pack, used by tools/check.js to prove
   every challenge level can be won with three stars. Kept out of js/ so the
   answers are not shipped to the browser. Same format as SOLUTIONS in
   check.js: each entry fires the first tick its condition holds for packet
   `id`; `route` entries point a switch, `rate` entries set the release rate. */

const walking = dir => p => p.state === "walk" && (dir === undefined || p.dir === dir);
const ids = n => Array.from({ length: n }, (_, i) => i);
const fallingFrom = (minY, maxY) => p => p.state === "fall" && p.y >= minY && p.y <= maxY;

module.exports = {
  /* Dig & Tunnel */
  "dig-easy": [{ id: 0, skill: "pipe", when: p => walking()(p) && p.x >= 180 }],
  "dig-intermediate": [
    { id: 0, skill: "pipe", when: p => walking(1)(p) && p.x >= 170 },
    { id: 0, skill: "tunnel", when: p => walking(1)(p) && p.y >= 165 }
  ],
  "dig-difficult": [
    { id: 0, skill: "tunnel", when: p => walking(1)(p) && p.x >= 136 },
    { id: 0, skill: "pipe", when: p => walking(1)(p) && p.x >= 244 && p.y < 125 }
  ],
  "dig-insane": [
    { id: 0, skill: "firewall", when: p => walking(1)(p) && p.x >= 312 },
    { id: 1, skill: "overflow", when: p => walking(-1)(p) && p.x <= 118 },
    { id: 2, skill: "pipe", when: p => walking(-1)(p) && p.x <= 45 && p.x >= 42 }
  ],

  /* Bridges & Climbs */
  "bridge-easy": [{ id: 0, skill: "bridge", when: p => walking(1)(p) && p.x >= 177 }],
  "bridge-intermediate": [
    { id: 0, skill: "bridge", when: p => walking(1)(p) && p.x >= 117 },
    { id: 0, skill: "bridge", when: p => walking(1)(p) && p.x >= 247 }
  ],
  "bridge-difficult": [
    ...ids(6).map(id => ({ id, skill: "uplink", when: p => p.state === "walk" })),
    { id: 0, skill: "bridge", when: p => walking(1)(p) && p.x >= 227 && p.y < 85 }
  ],
  "bridge-insane": [
    { id: 0, skill: "bridge", when: p => walking(1)(p) && p.x >= 97 },
    { id: 0, skill: "bridge", when: p => walking(1)(p) && p.x >= 197 && p.y > 125 },
    { id: 0, skill: "bridge", when: p => p.state === "shrug" && p.x >= 215 },
    { id: 0, skill: "bridge", when: p => walking(1)(p) && p.x >= 297 }
  ],

  /* Routing & Congestion: the hatch is centred over the first switch */
  "route-easy": ids(8).map(id => ({ id, route: 0, when: p => p.state === "fall" })),
  "route-intermediate": [
    ...ids(9).map(id => ({ id, route: 0, when: fallingFrom(40, 75), want: p => (p.dest === 0 ? -1 : 1) })),
    ...ids(9).map(id => ({ id, route: 1, when: p => p.state === "fall" && p.x >= 279, want: p => (p.dest === 1 ? -1 : 1) }))
  ],
  "route-difficult": [{ rate: 36 }, ...ids(12).map(id => ({ id, route: 0, when: p => p.state === "fall" }))],
  /* UDP overtakes TCP here, so the lower switch is set just before each
     packet reaches it rather than when it drops */
  "route-insane": [
    { rate: 30 },
    ...ids(12).map(id => ({ id, route: 0, when: fallingFrom(40, 75), want: p => (p.dest === 0 ? -1 : 1) })),
    ...ids(12).map(id => ({ id, route: 1, when: p => walking(1)(p) && p.y === 129 && p.x >= 288 && p.x <= 298, want: p => (p.dest === 1 ? -1 : 1) }))
  ],

  /* Security */
  "secure-easy": [{ id: 0, skill: "firewall", when: p => walking(1)(p) && p.x >= 290 }],
  "secure-intermediate": [{ id: 0, skill: "tunnel", when: p => walking(1)(p) && p.x >= 146 }],
  "secure-difficult": [
    { id: 0, skill: "bridge", when: p => walking(1)(p) && p.x >= 85 },
    { id: 0, skill: "firewall", when: p => walking(1)(p) && p.x >= 165 }
  ],
  "secure-insane": [
    { id: 0, skill: "firewall", when: p => walking(1)(p) && p.x >= 130 },
    { id: 1, skill: "pipe", when: p => walking(1)(p) && p.x >= 140 },
    { id: 1, skill: "tunnel", when: p => walking(1)(p) && p.y >= 155 }
  ]
};
