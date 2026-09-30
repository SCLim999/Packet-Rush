/* ============================================================================
   PACKET RUSH — the protocol stack as the background
   The play area is laid over the network model itself: seven OSI bands from
   7 Application at the top to 1 Physical at the bottom (or the same space
   grouped into the four TCP/IP layers). Each band shows what its layer
   actually carries, and a message on the right travels down the stack,
   picking up a header at each layer — encapsulation, made visible.
   Geometry and animation live here; both renderers use it.
   ========================================================================== */

const OSI_COLORS = { 7: "#f472b6", 6: "#c084fc", 5: "#818cf8", 4: "#38bdf8", 3: "#34d399", 2: "#facc15", 1: "#fb923c" };
const TCPIP_COLORS = { app: "#e879f9", transport: "#38bdf8", internet: "#34d399", link: "#fbbf24" };
const BAND_H = 200 / 7;

/* Bands top to bottom. `nums` are the OSI layers each band covers; `focus`
   marks the layers the current level teaches. */
function layerBands(mode, focus) {
  const f = new Set(focus || []);
  if (mode === "tcpip") {
    const groups = [
      { key: "app", nums: [7, 6, 5] }, { key: "transport", nums: [4] },
      { key: "internet", nums: [3] }, { key: "link", nums: [2, 1] }
    ];
    return groups.map(g => ({
      key: g.key, nums: g.nums, color: TCPIP_COLORS[g.key],
      y0: (7 - g.nums[0]) * BAND_H, y1: (8 - g.nums[g.nums.length - 1]) * BAND_H,
      focus: g.nums.some(n => f.has(n))
    }));
  }
  return [7, 6, 5, 4, 3, 2, 1].map(n => ({
    key: "osi" + n, nums: [n], color: OSI_COLORS[n],
    y0: (7 - n) * BAND_H, y1: (8 - n) * BAND_H, focus: f.has(n)
  }));
}

const bandOf = n => ({ y0: (7 - n) * BAND_H, y1: (8 - n) * BAND_H, cy: (7.5 - n) * BAND_H });

/* The message on its way down the stack: where it is, and what it looks
   like by the time it reaches each layer. */
const ENCAP = { 7: "DATA", 6: "DATA", 5: "DATA", 4: "TCP|DATA", 3: "IP|TCP|DATA", 2: "ETH|IP|TCP|DATA|FCS", 1: "0110 1001" };
const ENCAP_PERIOD = 460;
function encapAt(frame) {
  const t = frame % ENCAP_PERIOD;
  const travel = Math.min(1, t / (ENCAP_PERIOD - 80));    // then pause at the bottom
  const y = 6 + travel * (200 - 12);
  const n = Math.max(1, Math.min(7, 7 - Math.floor(y / BAND_H)));
  return { y, n, label: ENCAP[n], fade: t > ENCAP_PERIOD - 30 ? (ENCAP_PERIOD - t) / 30 : Math.min(1, t / 20) };
}

/* ------------------------------------------------------------------ 2D -- */
function rgbaHex(hex, a) {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${n >> 16},${(n >> 8) & 255},${n & 255},${a})`;
}

/* What each layer carries, drawn inside its band. `a` is the base opacity. */
function drawLayerMotifs(ctx, frame, light, focusSet) {
  const alphaFor = n => (focusSet.has(n) ? (light ? 0.62 : 0.55) : (light ? 0.34 : 0.26));
  const mono = s => `${s}px ui-monospace, "SFMono-Regular", Menlo, monospace`;
  ctx.textBaseline = "middle";
  ctx.textAlign = "left";

  /* 7 Application: requests drifting left */
  {
    const b = bandOf(7), c = rgbaHex(OSI_COLORS[7], alphaFor(7));
    ctx.fillStyle = c; ctx.font = mono(6.5);
    const words = ["GET /index.html", "DNS ? example.com", "SMTP MAIL FROM", "HTTPS 200 OK"];
    words.forEach((w, i) => {
      const x = ((i * 118 - frame * 0.25) % 472 + 472) % 472 - 60;
      ctx.fillText(w, x, b.cy + (i % 2 ? 5 : -3));
    });
  }
  /* 6 Presentation: formats and encryption drifting right */
  {
    const b = bandOf(6), c = rgbaHex(OSI_COLORS[6], alphaFor(6));
    ctx.fillStyle = c; ctx.strokeStyle = c; ctx.font = mono(6.5); ctx.lineWidth = 0.7;
    const words = ["UTF-8", "TLS", "JPEG", "gzip", "AES-256", "PNG"];
    words.forEach((w, i) => {
      const x = ((i * 80 + frame * 0.2) % 480 + 480) % 480 - 40;
      ctx.fillText(w, x, b.cy + (i % 2 ? 4 : -4));
      if (w === "TLS" || w === "AES-256") {                     // a small padlock
        const lx = x - 8, ly = b.cy + (i % 2 ? 4 : -4);
        ctx.strokeRect(lx, ly - 1, 5, 4);
        ctx.beginPath(); ctx.arc(lx + 2.5, ly - 1, 1.8, Math.PI, 0); ctx.stroke();
      }
    });
  }
  /* 5 Session: conversations opening and closing */
  {
    const b = bandOf(5), c = rgbaHex(OSI_COLORS[5], alphaFor(5));
    ctx.strokeStyle = c; ctx.fillStyle = c; ctx.lineWidth = 0.7; ctx.font = mono(5.5);
    for (let i = 0; i < 4; i++) {
      const x0 = 30 + i * 100, x1 = x0 + 56, y = b.cy + 5;
      ctx.setLineDash([2, 2]);
      ctx.beginPath(); ctx.moveTo(x0, y); ctx.quadraticCurveTo((x0 + x1) / 2, y - 14, x1, y); ctx.stroke();
      ctx.setLineDash([]);
      ctx.beginPath(); ctx.arc(x0, y, 1.6, 0, 7); ctx.arc(x1, y, 1.6, 0, 7); ctx.fill();
      const t = ((frame * 0.012 + i * 0.3) % 1);
      const px = (1 - t) * (1 - t) * x0 + 2 * (1 - t) * t * ((x0 + x1) / 2) + t * t * x1;
      const py = (1 - t) * (1 - t) * y + 2 * (1 - t) * t * (y - 14) + t * t * y;
      ctx.beginPath(); ctx.arc(px, py, 1.3, 0, 7); ctx.fill();
      ctx.fillText(i % 2 ? "close" : "open", x0 + 16, y + 5);
    }
  }
  /* 4 Transport: numbered segments to ports */
  {
    const b = bandOf(4), c = rgbaHex(OSI_COLORS[4], alphaFor(4));
    ctx.strokeStyle = c; ctx.fillStyle = c; ctx.lineWidth = 0.7; ctx.font = mono(5.5);
    const segs = [":443 seq 1", ":443 seq 2", ":80 seq 1", ":53 UDP"];
    segs.forEach((s, i) => {
      const x = ((i * 105 + frame * 0.35) % 420 + 420) % 420 - 50;
      ctx.strokeRect(x, b.cy - 5, 44, 10);
      ctx.fillText(s, x + 3, b.cy);
    });
  }
  /* 3 Network: routers and a packet hopping between them */
  {
    const b = bandOf(3), c = rgbaHex(OSI_COLORS[3], alphaFor(3));
    ctx.strokeStyle = c; ctx.fillStyle = c; ctx.lineWidth = 0.7; ctx.font = mono(5);
    const nodes = [[20, 1], [95, -1], [170, 1], [245, -1], [320, 1], [395, -1]].map(([x, s]) => [x, b.cy + s * 5]);
    ctx.beginPath();
    nodes.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
    ctx.stroke();
    const ips = ["10.0.0.1", "10.0.1.1", "172.16.0.1", "192.168.1.1", "203.0.113.5", "8.8.8.8"];
    nodes.forEach(([x, y], i) => {
      ctx.strokeRect(x - 3, y - 3, 6, 6);
      ctx.fillText(ips[i], x + 5, y + (y < b.cy ? -4 : 5));
    });
    const hop = (frame * 0.01) % (nodes.length - 1), k = Math.floor(hop), t = hop - k;
    const [ax, ay] = nodes[k], [bx, by] = nodes[k + 1];
    ctx.fillRect(ax + (bx - ax) * t - 2, ay + (by - ay) * t - 1.5, 4, 3);
  }
  /* 2 Data Link: frames with MAC header and checksum */
  {
    const b = bandOf(2), c = rgbaHex(OSI_COLORS[2], alphaFor(2));
    ctx.strokeStyle = c; ctx.fillStyle = c; ctx.lineWidth = 0.7; ctx.font = mono(5);
    for (let i = 0; i < 4; i++) {
      const x = ((i * 110 - frame * 0.3) % 440 + 440) % 440 - 60;
      ctx.strokeRect(x, b.cy - 5, 58, 10);
      ctx.beginPath(); ctx.moveTo(x + 20, b.cy - 5); ctx.lineTo(x + 20, b.cy + 5); ctx.moveTo(x + 46, b.cy - 5); ctx.lineTo(x + 46, b.cy + 5); ctx.stroke();
      ctx.fillText("MAC", x + 4, b.cy);
      ctx.fillText("data", x + 25, b.cy);
      ctx.fillText("FCS", x + 47.5, b.cy);
    }
  }
  /* 1 Physical: a square-wave signal with its bits */
  {
    const b = bandOf(1), c = rgbaHex(OSI_COLORS[1], alphaFor(1));
    ctx.strokeStyle = c; ctx.fillStyle = c; ctx.lineWidth = 0.8; ctx.font = mono(5.5);
    const bits = "0110100101101110";
    const w = 12, off = (frame * 0.4) % w, start = Math.floor(frame * 0.4 / w);
    ctx.beginPath();
    for (let i = -1; i < 400 / w + 2; i++) {
      const bit = bits[((i + start) % bits.length + bits.length) % bits.length] === "1";
      const x = i * w - off, y = bit ? b.cy - 4 : b.cy + 4;
      if (i === -1) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      ctx.lineTo(x + w, y);
      if (i % 2 === 0) ctx.fillText(bit ? "1" : "0", x + w / 2 - 1.5, b.cy - 9);
    }
    ctx.stroke();
  }
  ctx.textBaseline = "alphabetic";
}

function drawEncapsulation(ctx, frame, light) {
  const e = encapAt(frame);
  const col = OSI_COLORS[e.n];
  ctx.font = `bold 6px ui-monospace, "SFMono-Regular", Menlo, monospace`;
  ctx.textBaseline = "middle";
  ctx.textAlign = "center";
  const w = ctx.measureText(e.label).width + 8, x = 360;
  ctx.globalAlpha = Math.max(0, e.fade) * (light ? 0.9 : 0.85);
  ctx.fillStyle = rgbaHex(col, light ? 0.25 : 0.2);
  ctx.strokeStyle = col;
  ctx.lineWidth = 0.8;
  ctx.fillRect(x - w / 2, e.y - 5, w, 10);
  ctx.strokeRect(x - w / 2, e.y - 5, w, 10);
  ctx.fillStyle = col;
  ctx.fillText(e.label, x, e.y + 0.3);
  ctx.globalAlpha = 1;
  ctx.textBaseline = "alphabetic";
}

if (typeof module !== "undefined") module.exports = { layerBands, encapAt, OSI_COLORS, TCPIP_COLORS, BAND_H, ENCAP };
