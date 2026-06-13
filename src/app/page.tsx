"use client";

import { useEffect, useRef, useState } from "react";

/* ============================================================
   TIMELINE DATA
   ============================================================ */
const TIMELINE_W = 1200;
const TIMELINE_H = 320;

const missions = [
  {
    year: 2001, hue: 200, yBase: 230, offset: 10,
    entries: [
      { status: "DONE", title: "System Boot", desc: "Born in Algeria. First breath, first curiosity.", image: null as string | null },
    ],
  },
  {
    year: 2010, hue: 205, yBase: 140, offset: -16,
    entries: [
      { status: "DONE", title: "Early Curiosity", desc: "First telescope, first questions about the sky and how things really work.", image: null as string | null },
    ],
  },
  {
    year: 2015, hue: 210, yBase: 250, offset: 14,
    entries: [
      { status: "DONE", title: "First Signal", desc: "Structured scientific thought ignites. Physics, math, the cosmos.", image: null as string | null },
    ],
  },
  {
    year: 2020, hue: 225, yBase: 110, offset: -12,
    entries: [
      { status: "DONE", title: "Foundations", desc: "Baccalaureate preparation. Building the rigor needed for the years ahead.", image: null as string | null },
    ],
  },
  {
    year: 2023, hue: 240, yBase: 210, offset: 18,
    entries: [
      { status: "DONE", title: "Lift-off — Theory", desc: "PPL ground school begins. Aerodynamics, navigation, meteorology.", image: null as string | null },
      { status: "DONE", title: "Lift-off — First Solo", desc: "Solo flight hours begin. Aviation becomes reality.", image: null as string | null },
    ],
  },
  {
    year: 2026, hue: 280, yBase: 90, offset: -14,
    entries: [
      { status: "ACTIVE", title: "Deep Field — Astrophysics", desc: "Astrophysics research phase active. Observation and spectroscopy focus.", image: null as string | null },
      { status: "ACTIVE", title: "Deep Field — Cosmology", desc: "Cosmology seminars. Large-scale structure and the early universe.", image: null as string | null },
      { status: "ACTIVE", title: "Deep Field — Philosophy", desc: "Philosophy of science reading group. The epistemology of discovery.", image: null as string | null },
    ],
  },
  {
    year: 2028, hue: 260, yBase: 230, offset: 12,
    entries: [
      { status: "PLANNED", title: "Integration", desc: "Aerospace Engineering + M2. Propulsion meets spaceflight.", image: null as string | null },
    ],
  },
  {
    year: 2032, hue: 270, yBase: 130, offset: -16,
    entries: [
      { status: "PLANNED", title: "Field Operations", desc: "Flight test programs and aerospace industry placements.", image: null as string | null },
    ],
  },
  {
    year: 2035, hue: 300, yBase: 200, offset: 10,
    entries: [
      { status: "FUTURE", title: "Unified Doctrine", desc: "Pilot. Scientist. Engineer. One exploration philosophy.", image: null as string | null },
    ],
  },
];

/* ============================================================
   VORONOI NEURAL NETWORK CONSTANTS
   ============================================================ */
const GRID_RES      = 10;
const VORONOI_EVERY = 3;
const REGION_COUNT  = 5;

// 5 thematic regions — each has domain nodes
const REGION_DEFS = [
  {
    name: "Astrophysics",
    hue: 200,
    labels: ["Pulsars", "Neutron Stars", "Observation", "Spectroscopy", "Astrophotography"],
  },
  {
    name: "Cosmology",
    hue: 260,
    labels: ["Dark Matter", "CMB", "Inflation", "Large-Scale Structure", "Redshift"],
  },
  {
    name: "Aerospace",
    hue: 170,
    labels: ["Propulsion", "Orbital Mechanics", "Re-entry", "Avionics", "Structures"],
  },
  {
    name: "Philosophy",
    hue: 300,
    labels: ["Epistemology", "Science Ethics", "Consciousness", "Logic", "Metaphysics"],
  },
  {
    name: "Aviation",
    hue: 210,
    labels: ["PPL", "Navigation", "Meteorology", "Flight Dynamics", "Airspace"],
  },
];

const INACTIVE_PER_REGION = 14; // extra background nodes per region
const TOTAL_NODES = REGION_COUNT * (REGION_DEFS[0].labels.length + INACTIVE_PER_REGION);

function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  const f = (t: number) => {
    if (t < 0) t += 1; if (t > 1) t -= 1;
    if (t < 1/6) return p + (q-p)*6*t;
    if (t < 1/2) return q;
    if (t < 2/3) return p + (q-p)*(2/3-t)*6;
    return p;
  };
  return [Math.round(f(h+1/3)*255), Math.round(f(h)*255), Math.round(f(h-1/3)*255)];
}

/* Find the two parametric values t where the line through (mx,my) with
   direction (dx,dy) intersects the ellipse centered at (cx,cy) with radii rx,ry. */
function ellipseLineT(mx: number, my: number, dx: number, dy: number, cx: number, cy: number, rx: number, ry: number): [number, number] | null {
  const ax = (mx - cx) / rx, ay = (my - cy) / ry;
  const bx = dx / rx, by = dy / ry;
  const a = bx*bx + by*by;
  const b = 2 * (ax*bx + ay*by);
  const c = ax*ax + ay*ay - 1;
  const disc = b*b - 4*a*c;
  if (disc < 0 || a === 0) return null;
  const sq = Math.sqrt(disc);
  return [(-b - sq) / (2*a), (-b + sq) / (2*a)];
}

/* Catmull-Rom -> cubic bezier path string, used for the gently undulating
   timeline curve. */
function catmullRom2bezier(pts: { x: number; y: number }[]): string {
  if (pts.length < 2) return "";
  let d = `M ${pts[0].x.toFixed(2)} ${pts[0].y.toFixed(2)}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] || pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] || p2;
    const c1x = p1.x + (p2.x - p0.x) / 6;
    const c1y = p1.y + (p2.y - p0.y) / 6;
    const c2x = p2.x - (p3.x - p1.x) / 6;
    const c2y = p2.y - (p3.y - p1.y) / 6;
    d += ` C ${c1x.toFixed(2)} ${c1y.toFixed(2)}, ${c2x.toFixed(2)} ${c2y.toFixed(2)}, ${p2.x.toFixed(2)} ${p2.y.toFixed(2)}`;
  }
  return d;
}

/* ============================================================
   COUNTER HOOK — ease in/out (slow-fast-slow)
   ============================================================ */
function useCounter(target: number, duration = 2800, active = true) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!active) return;
    const start = performance.now();
    let raf: number;
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      // ease in-out cubic
      const e = p < 0.5 ? 4*p*p*p : 1 - Math.pow(-2*p+2,3)/2;
      setVal(Math.round(e * target));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration, active]);
  return val;
}

/* ============================================================
   FLIGHT HOURS WIDGET
   ============================================================ */
function FlightHoursWidget() {
  const [expanded, setExpanded] = useState(false);
  const [countActive, setCountActive] = useState(false);

  const total   = useCounter(100, 2400, countActive);
  const planeur = useCounter(50,  2800, expanded && countActive);
  const avion   = useCounter(50,  2800, expanded && countActive);

  useEffect(() => {
    const t = setTimeout(() => setCountActive(true), 400);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      className={`flightWidget ${expanded ? "expanded" : ""}`}
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
    >
      <div className="flightMain">
        <span className="flightNum">{total}</span>
        <span className="flightLabel">FLIGHT HOURS</span>
      </div>
      {expanded && (
        <div className="flightBreakdown">
          <div className="flightRow">
            <span className="flightSub">PLANEUR</span>
            <span className="flightSubNum">{planeur}h</span>
          </div>
          <div className="flightDivider" />
          <div className="flightRow">
            <span className="flightSub">AVION</span>
            <span className="flightSubNum">{avion}h</span>
          </div>
        </div>
      )}
    </div>
  );
}

/* ============================================================
   NEURAL NETWORK CANVAS
   ============================================================ */
function NeuralNetwork() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current!;
    const ctx    = canvas.getContext("2d")!;
    const offFill    = document.createElement("canvas");
    const offFillCtx = offFill.getContext("2d")!;

    const FILL_RES = GRID_RES * 2;
    const SCALE    = 1.3; // overall network size multiplier

    const resize = () => {
      const r = canvas.getBoundingClientRect();
      canvas.width  = r.width;
      canvas.height = r.height;
      offFill.width  = Math.ceil(r.width  / FILL_RES);
      offFill.height = Math.ceil(r.height / FILL_RES);
      // Reposition node home positions when canvas resizes
      nodes.forEach(n => {
        const c = center();
        n.homeX = c.x + Math.cos(n.regionAngle) * eRX() * 0.45 + Math.cos(n.spreadAngle) * n.spreadR;
        n.homeY = c.y + Math.sin(n.regionAngle) * eRY() * 0.45 + Math.sin(n.spreadAngle) * n.spreadR;
      });
    };

    const mouse  = { x: -9999, y: -9999 };
    const center = () => ({ x: canvas.width / 2, y: canvas.height / 2 });
    const eRX    = () => Math.min(canvas.width  * 0.42 * SCALE, canvas.width  * 0.49, 480 * SCALE);
    const eRY    = () => Math.min(canvas.height * 0.40 * SCALE, canvas.height * 0.49, 380 * SCALE);

    const inEllipse = (px: number, py: number, cx: number, cy: number, rx: number, ry: number) => {
      const dx = (px - cx) / rx, dy = (py - cy) / ry;
      return dx*dx + dy*dy <= 1;
    };

    /* ---- Build nodes (NO canvas-size dependency at init) ---- */
    const nodes: any[] = [];

    REGION_DEFS.forEach((rDef, rid) => {
      const regionAngle = (rid / REGION_COUNT) * Math.PI * 2;

      rDef.labels.forEach((label, li) => {
        const spreadAngle = (li / rDef.labels.length) * Math.PI * 2 + regionAngle;
        const spreadR = (55 + Math.random() * 65) * SCALE;
        nodes.push({
          id: nodes.length, regionId: rid, active: true, label,
          regionAngle, spreadAngle, spreadR,
          homeX: 0, homeY: 0,           // set after first resize
          x: 0, y: 0, vx: 0, vy: 0,
          orbitPhase: Math.random() * Math.PI * 2,
          orbitSpeed: 0.004 + Math.random() * 0.004, // visible speed
          orbitAmp: (8 + Math.random() * 14) * SCALE, // small orbit wobble
          pulse: 0, activity: 0,
        });
      });

      for (let i = 0; i < INACTIVE_PER_REGION; i++) {
        const spreadAngle = Math.random() * Math.PI * 2;
        const spreadR = (20 + Math.random() * 100) * SCALE;
        nodes.push({
          id: nodes.length, regionId: rid, active: false, label: "",
          regionAngle, spreadAngle, spreadR,
          homeX: 0, homeY: 0,
          x: 0, y: 0, vx: 0, vy: 0,
          orbitPhase: Math.random() * Math.PI * 2,
          orbitSpeed: 0.002 + Math.random() * 0.003,
          orbitAmp: (5 + Math.random() * 10) * SCALE,
          pulse: 0, activity: 0,
        });
      }
    });

    /* ---- Regions ---- */
    const regions = REGION_DEFS.map((rDef, id) => ({
      id, hue: rDef.hue, name: rDef.name,
      seed: { x: 0, y: 0 },
      nodeIds: nodes.filter(n => n.regionId === id).map(n => n.id),
      rgba: hslToRgb(rDef.hue / 360, 0.62, 0.24),
    }));

    /* ---- Voronoi grid ---- */
    let gW = 1, gH = 1;
    let grid = new Uint8Array(1);
    let fillImageData = offFillCtx.createImageData(1, 1);

    const updateSeeds = () => {
      for (const r of regions) {
        let sx = 0, sy = 0;
        for (const nid of r.nodeIds) { sx += nodes[nid].x; sy += nodes[nid].y; }
        const n = r.nodeIds.length || 1;
        r.seed.x = sx / n; r.seed.y = sy / n;
      }
    };

    const updateGrid = () => {
      gW = offFill.width; gH = offFill.height;
      if (gW < 1 || gH < 1) return;
      if (grid.length !== gW * gH) {
        grid = new Uint8Array(gW * gH);
        fillImageData = offFillCtx.createImageData(gW, gH);
      }
      const c = center(); const rx = eRX(), ry = eRY();

      for (let gy = 0; gy < gH; gy++) {
        for (let gx = 0; gx < gW; gx++) {
          const px = gx * FILL_RES + FILL_RES / 2;
          const py = gy * FILL_RES + FILL_RES / 2;
          if (!inEllipse(px, py, c.x, c.y, rx, ry)) { grid[gy*gW+gx] = 255; continue; }
          let best = Infinity, bestId = 0;
          for (const r of regions) {
            const dx = px - r.seed.x, dy = py - r.seed.y;
            const d2 = dx*dx + dy*dy;
            if (d2 < best) { best = d2; bestId = r.id; }
          }
          grid[gy*gW+gx] = bestId;
        }
      }
    };

    const drawFill = () => {
      const W = gW, H = gH;
      if (W < 1 || H < 1) return;
      const d = fillImageData.data;
      const c = center(); const rx = eRX(), ry = eRY();

      for (let i = 0; i < W * H; i++) {
        const rid = grid[i];
        const base = i * 4;
        if (rid === 255) { d[base+3] = 0; continue; }
        const px = (i % W) * FILL_RES + FILL_RES / 2;
        const py = Math.floor(i / W) * FILL_RES + FILL_RES / 2;
        const edgeDist = 1 - Math.sqrt(Math.pow((px-c.x)/rx,2) + Math.pow((py-c.y)/ry,2));
        const alpha = Math.min(1, edgeDist * 4) * 100;
        const [r, g, b] = regions[rid].rgba;
        d[base]=r; d[base+1]=g; d[base+2]=b; d[base+3]=Math.round(alpha);
      }
      offFillCtx.putImageData(fillImageData, 0, 0);
      ctx.save();
      ctx.imageSmoothingEnabled = true; ctx.imageSmoothingQuality = "high";
      ctx.beginPath(); ctx.ellipse(center().x, center().y, eRX(), eRY(), 0, 0, Math.PI*2); ctx.clip();
      ctx.drawImage(offFill, 0, 0, canvas.width, canvas.height);
      ctx.restore();
    };

    /* Region boundaries drawn as soft, thin lines (the perpendicular
       bisectors between angularly-adjacent region seeds), clipped to the
       ellipse. They move and deform smoothly as the seeds drift with the
       global rotation — far less "busy" than a dotted ring grid. */
    const drawRegionBoundaries = () => {
      const c = center(); const rx = eRX(), ry = eRY();
      ctx.save();
      ctx.beginPath(); ctx.ellipse(c.x, c.y, rx, ry, 0, 0, Math.PI*2); ctx.clip();

      for (let i = 0; i < REGION_COUNT; i++) {
        const a = regions[i];
        const b = regions[(i + 1) % REGION_COUNT];
        const dx = b.seed.x - a.seed.x, dy = b.seed.y - a.seed.y;
        const len = Math.sqrt(dx*dx + dy*dy);
        if (len < 1) continue;
        const mx = (a.seed.x + b.seed.x) / 2, my = (a.seed.y + b.seed.y) / 2;
        // perpendicular direction to the seed-to-seed vector
        const pdx = -dy / len, pdy = dx / len;
        const ts = ellipseLineT(mx, my, pdx, pdy, c.x, c.y, rx, ry);
        if (!ts) continue;
        const [t1, t2] = ts;
        const x1 = mx + pdx * t1, y1 = my + pdy * t1;
        const x2 = mx + pdx * t2, y2 = my + pdy * t2;

        const avgHue = (a.hue + b.hue) / 2;
        const grad = ctx.createLinearGradient(x1, y1, x2, y2);
        grad.addColorStop(0,   `hsla(${a.hue},75%,75%,0)`);
        grad.addColorStop(0.5, `hsla(${avgHue},85%,82%,0.45)`);
        grad.addColorStop(1,   `hsla(${b.hue},75%,75%,0)`);

        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.6;
        ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
      }
      ctx.restore();
    };

    const drawOuterRing = () => {
      const c = center(); const rx = eRX(), ry = eRY();
      ctx.save();
      ctx.beginPath(); ctx.ellipse(c.x, c.y, rx, ry, 0, 0, Math.PI*2);
      ctx.strokeStyle = "rgba(76,201,240,0.3)";
      ctx.lineWidth = 1.5; ctx.setLineDash([6,8]); ctx.stroke(); ctx.setLineDash([]);
      ctx.restore();

      for (const r of regions) {
        const angle = (r.id / REGION_COUNT) * Math.PI * 2 + globalAngle;
        const lx = c.x + Math.cos(angle) * rx * 0.80;
        const ly = c.y + Math.sin(angle) * ry * 0.80;
        ctx.save();
        ctx.font = "9px system-ui";
        ctx.fillStyle = `hsla(${r.hue},70%,72%,0.55)`;
        ctx.textAlign = "center";
        ctx.fillText(REGION_DEFS[r.id].name.toUpperCase(), lx, ly);
        ctx.restore();
      }
    };

    /* ---- Signals ---- */
    interface Sig { a: any; b: any; t: number; speed: number; color: string }
    const signals: Sig[] = [];

    const spawnSignalBetween = (a: any, b: any) => {
      const same = a.regionId === b.regionId;
      const hue  = REGION_DEFS[a.regionId].hue;
      signals.push({
        a, b, t: 0,
        speed: 0.007 + Math.random() * 0.013,
        color: same ? `hsla(${hue},90%,80%,0.95)` : "rgba(180,220,255,0.7)",
      });
    };

    /* ---- Pulse propagation (invisible "waves") ----
       Triggered only when the mouse rests on an active node. The pulse
       hops to that node's adjacent neighbors (and, fading, their
       neighbors), giving each a small outward impulse + glow boost.
       Nothing is drawn for the wave itself — only its effect on nodes. */
    interface Pulse { from: any; node: any; strength: number; delay: number; depth: number }
    let pulses: Pulse[] = [];
    let hoveredNodeId = -1;

    const triggerPulse = (origin: any) => {
      pulses.push({ from: origin, node: origin, strength: 1, delay: 0, depth: 0 });
    };

    /* ---- Region containment (adaptive constraint) ----
       A node should never visually leave its own region's slice — i.e. it
       must stay at least as close to its own region's seed as to either
       angularly adjacent region's seed. Rather than teleporting the node
       back, we nudge it back gently each frame. Because the region seed is
       itself the average of its member nodes' positions, a node pressing
       toward a border pulls its own seed (and therefore the boundary line)
       toward it too — so the boundary visibly bulges/adapts to keep the
       node inside instead of the node snapping. */
    const REGION_MARGIN = 6;
    const enforceContainment = (n: any) => {
      const r = n.regionId;
      const own = regions[r].seed;
      const neighborIds = [(r - 1 + REGION_COUNT) % REGION_COUNT, (r + 1) % REGION_COUNT];
      for (const otherId of neighborIds) {
        const other = regions[otherId].seed;
        const dx = other.x - own.x, dy = other.y - own.y;
        const dLen2 = dx*dx + dy*dy;
        if (dLen2 < 1) continue;
        const mx = (own.x + other.x) / 2, my = (own.y + other.y) / 2;
        const relx = n.x - mx, rely = n.y - my;
        const proj = relx*dx + rely*dy; // >0 means leaning toward "other"
        const marginTerm = REGION_MARGIN * Math.sqrt(dLen2);
        if (proj > -marginTerm) {
          const excess = proj + marginTerm;
          const factor = (excess / dLen2) * 0.6; // soft, partial correction
          n.x -= dx * factor;
          n.y -= dy * factor;
          n.vx *= 0.6; n.vy *= 0.6;
        }
      }
    };

    /* ---- Global rotation ---- */
    let globalAngle = 0;
    const ROTATION_SPEED = 0.0004; // smooth, visible

    /* ---- Mouse ---- */
    const onMove = (e: MouseEvent) => {
      const r = canvas.getBoundingClientRect();
      mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top;
    };
    canvas.addEventListener("mousemove", onMove);

    /* ---- Init: size canvas then place nodes ---- */
    resize(); // sets canvas.width/height properly
    nodes.forEach(n => {
      const c = center();
      n.homeX = c.x + Math.cos(n.regionAngle) * eRX() * 0.45 + Math.cos(n.spreadAngle) * n.spreadR;
      n.homeY = c.y + Math.sin(n.regionAngle) * eRY() * 0.45 + Math.sin(n.spreadAngle) * n.spreadR;
      n.x = n.homeX; n.y = n.homeY;
    });
    updateSeeds();
    window.addEventListener("resize", resize);

    let frame = 0;

    const HOVER_R  = 28;  // distance counted as "mouse is on the node"
    const ATTRACT_R = 260 * SCALE; // beyond this, mouse has no pull at all

    const draw = () => {
      const c = center(); const rx = eRX(), ry = eRY();
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      frame++;

      /* Global rotation — update home positions each frame */
      globalAngle += ROTATION_SPEED;
      nodes.forEach(n => {
        const rotAngle = n.regionAngle + globalAngle;
        const regionCX = c.x + Math.cos(rotAngle) * rx * 0.45;
        const regionCY = c.y + Math.sin(rotAngle) * ry * 0.45;
        const nodeAngle = n.spreadAngle + globalAngle;
        n.homeX = regionCX + Math.cos(nodeAngle) * n.spreadR;
        n.homeY = regionCY + Math.sin(nodeAngle) * n.spreadR;
      });

      /* Voronoi seeds (cheap, every frame) + raster fill (occasional) */
      updateSeeds();
      if (frame % VORONOI_EVERY === 0) updateGrid();
      drawFill();
      drawRegionBoundaries();
      drawOuterRing();

      /* ---- Node physics ---- */
      for (const n of nodes) {
        // Subtle personal orbit wobble on top of global rotation
        n.orbitPhase += n.orbitSpeed;
        const wobbleX = Math.cos(n.orbitPhase) * n.orbitAmp;
        const wobbleY = Math.sin(n.orbitPhase * 1.3) * n.orbitAmp;

        const targetX = n.homeX + wobbleX;
        const targetY = n.homeY + wobbleY;

        // Mouse attraction — quadratic falloff: noticeable when close,
        // faint at medium range, essentially nothing beyond ATTRACT_R.
        const mdx = mouse.x - n.x, mdy = mouse.y - n.y;
        const md  = Math.sqrt(mdx*mdx + mdy*mdy);
        if (md < ATTRACT_R && md > 0.1) {
          const t = 1 - md / ATTRACT_R;
          const pull = t * t * 0.55;
          n.vx += (mdx/md) * pull;
          n.vy += (mdy/md) * pull;
        }

        // Spring toward rotating home
        n.vx += (targetX - n.x) * 0.022;
        n.vy += (targetY - n.y) * 0.022;
        n.vx *= 0.86; n.vy *= 0.86;
        n.x  += n.vx;  n.y  += n.vy;

        // Ellipse boundary bounce
        const ndx = (n.x - c.x) / rx, ndy = (n.y - c.y) / ry;
        const nd  = Math.sqrt(ndx*ndx + ndy*ndy);
        if (nd > 0.94) {
          const scale = 0.92 / nd;
          n.x = c.x + ndx * rx * scale;
          n.y = c.y + ndy * ry * scale;
          n.vx *= -0.25; n.vy *= -0.25;
        }

        // Hard constraint: stay inside the node's own Voronoi region
        enforceContainment(n);
      }

      /* ---- Hover detection -> trigger a pulse from the hovered node ---- */
      let nearestId = -1, nearestD = Infinity;
      for (const n of nodes) {
        if (!n.active) continue;
        const dx = mouse.x - n.x, dy = mouse.y - n.y;
        const d = Math.sqrt(dx*dx + dy*dy);
        if (d < HOVER_R && d < nearestD) { nearestD = d; nearestId = n.id; }
      }
      if (nearestId !== hoveredNodeId) {
        hoveredNodeId = nearestId;
        if (hoveredNodeId !== -1) triggerPulse(nodes[hoveredNodeId]);
      }

      /* ---- Process pulses: propagate from the hovered node to its
         adjacent neighbors only, decaying with each hop. No visuals. ---- */
      for (let i = pulses.length-1; i >= 0; i--) {
        const p = pulses[i];
        p.delay -= 1;
        if (p.delay > 0) continue;
        const n = p.node;
        n.pulse    = Math.max(n.pulse, p.strength);
        n.activity = Math.max(n.activity, p.strength);
        if (p.from !== n) {
          const dx = n.x - p.from.x, dy = n.y - p.from.y;
          const d = Math.sqrt(dx*dx+dy*dy) || 1;
          const imp = p.strength * 0.6;
          n.vx += (dx/d) * imp;
          n.vy += (dy/d) * imp;
        }
        pulses.splice(i, 1);
        if (p.depth < 2 && p.strength > 0.15) {
          for (const other of nodes) {
            if (other === n) continue;
            const dx = other.x - n.x, dy = other.y - n.y;
            const dist = Math.sqrt(dx*dx + dy*dy);
            if (dist < 160) {
              pulses.push({
                from: n, node: other,
                strength: p.strength * 0.55,
                delay: Math.max(2, Math.round(dist / 12)),
                depth: p.depth + 1,
              });
            }
          }
        }
      }

      /* ---- Build & draw edges (live, every frame for correct positions) ---- */
      const activeEdges: [any,any,number][] = []; // [a, b, dist]
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i+1; j < nodes.length; j++) {
          const a = nodes[i], b = nodes[j];
          const dx = a.x-b.x, dy = a.y-b.y;
          const d  = Math.sqrt(dx*dx + dy*dy);
          if (d < 160) {
            activeEdges.push([a, b, d]);
            const same  = a.regionId === b.regionId;
            const fade  = Math.max(0, 1 - d/160);
            const hue   = same ? REGION_DEFS[a.regionId].hue : 200;
            const alpha = (same ? 0.28 : 0.09) * fade;
            ctx.strokeStyle = `hsla(${hue},65%,72%,${alpha})`;
            ctx.lineWidth   = same ? 0.9 : 0.4;
            ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
          }
        }
      }

      /* ---- Spawn signals randomly on live edges ---- */
      if (activeEdges.length > 0 && Math.random() < 0.045) {
        const [a, b] = activeEdges[Math.floor(Math.random() * activeEdges.length)];
        spawnSignalBetween(a, b);
      }
      // Extra signals near mouse
      for (const n of nodes) {
        const mdx = mouse.x - n.x, mdy = mouse.y - n.y;
        const md  = Math.sqrt(mdx*mdx + mdy*mdy);
        if (md < 60 && Math.random() < 0.04) {
          const candidates = activeEdges.filter(([a,b]) => a===n || b===n);
          if (candidates.length) {
            const [a,b] = candidates[Math.floor(Math.random()*candidates.length)];
            spawnSignalBetween(a, b);
          }
        }
      }

      /* ---- Update & draw signals ---- */
      for (let i = signals.length-1; i >= 0; i--) {
        signals[i].t += signals[i].speed;
        if (signals[i].t >= 1) { signals.splice(i, 1); continue; }
        const s = signals[i];
        const x = s.a.x + (s.b.x - s.a.x) * s.t;
        const y = s.a.y + (s.b.y - s.a.y) * s.t;
        const tx2 = s.a.x + (s.b.x - s.a.x) * Math.max(0, s.t - 0.15);
        const ty2 = s.a.y + (s.b.y - s.a.y) * Math.max(0, s.t - 0.15);

        const grad = ctx.createLinearGradient(tx2, ty2, x, y);
        grad.addColorStop(0, "rgba(0,0,0,0)");
        grad.addColorStop(1, s.color);
        ctx.strokeStyle = grad; ctx.lineWidth = 1.8;
        ctx.beginPath(); ctx.moveTo(tx2, ty2); ctx.lineTo(x, y); ctx.stroke();

        ctx.save();
        ctx.shadowBlur = 12; ctx.shadowColor = s.color;
        ctx.fillStyle = "white";
        ctx.beginPath(); ctx.arc(x, y, 2.4, 0, Math.PI*2); ctx.fill();
        ctx.restore();
      }

      /* ---- Draw nodes ---- */
      for (const n of nodes) {
        const mdx = mouse.x - n.x, mdy = mouse.y - n.y;
        const dist = Math.sqrt(mdx*mdx + mdy*mdy);
        const near  = dist < 110;
        const hover = dist < 30;

        let size = n.active ? 5.5 : 2.5;
        size *= 1 + n.pulse * 0.7;
        if (near)  size *= 1.4;
        if (hover) size *= 2.2;  // noticeably bigger on direct hover
        n.pulse    *= 0.88;
        n.activity *= 0.88;

        const hue = REGION_DEFS[n.regionId].hue;
        if (n.active) {
          ctx.save();
          ctx.shadowBlur  = 14 + n.activity * 12;
          ctx.shadowColor = `hsla(${hue},85%,65%,0.7)`;
          ctx.fillStyle   = `hsla(${hue},80%,72%,${0.82 + n.activity * 0.18})`;
          ctx.beginPath(); ctx.arc(n.x, n.y, size, 0, Math.PI*2); ctx.fill();
          ctx.restore();
        } else {
          ctx.fillStyle = `hsla(${hue},35%,65%,0.40)`;
          ctx.beginPath(); ctx.arc(n.x, n.y, size, 0, Math.PI*2); ctx.fill();
        }

        if (n.active && near) {
          ctx.save();
          ctx.fillStyle = hover ? "white" : `hsla(${hue},60%,90%,0.85)`;
          ctx.font = hover ? "bold 13px system-ui" : "11px system-ui";
          ctx.fillText(n.label, n.x + 10, n.y + 4);
          ctx.restore();
        }
      }

      requestAnimationFrame(draw);
    };

    updateGrid();
    draw();

    return () => {
      canvas.removeEventListener("mousemove", onMove);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={ref} className="neural" />;
}

/* ============================================================
   TIMELINE PAGE
   ============================================================ */
function TimelinePage() {
  const [hover, setHover] = useState<number | null>(null);
  const [entryPage, setEntryPage] = useState<Record<number, number>>({});
  const pathRef = useRef<SVGPathElement>(null);
  const glowPathRef = useRef<SVGPathElement>(null);
  const nodeRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Slow, organic undulation of the curve + the nodes that ride near it —
  // like a calm one-dimensional creature gently drifting, not snapping.
  useEffect(() => {
    let raf: number;
    const basePoints = missions.map((m, i) => ({
      x: (i / (missions.length - 1)) * (TIMELINE_W - 80) + 40,
      y: m.yBase,
    }));

    const animate = (time: number) => {
      const pts = basePoints.map((p, i) => ({
        x: p.x,
        y: p.y
          + Math.sin(time * 0.00035 + i * 0.9) * 10
          + Math.sin(time * 0.00015 + i * 1.6) * 5,
      }));
      const d = catmullRom2bezier(pts);
      if (pathRef.current) pathRef.current.setAttribute("d", d);
      if (glowPathRef.current) glowPathRef.current.setAttribute("d", d);
      nodeRefs.current.forEach((el, i) => {
        if (!el) return;
        const y = pts[i].y + missions[i].offset;
        el.style.top = `${(y / TIMELINE_H) * 100}%`;
      });
      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <section className="timelineSection">
      <div className="timelineHeader">
        <span className="timelineEyebrow">TRAJECTORY</span>
        <h2 className="timelineTitle">VISION TIMELINE</h2>
      </div>

      <div className="timelineTrack">
        {/* Gently undulating connecting path */}
        <svg className="timelineSVG" viewBox={`0 0 ${TIMELINE_W} ${TIMELINE_H}`} preserveAspectRatio="none">
          <defs>
            <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              {missions.map((m, i) => (
                <stop
                  key={i}
                  offset={`${(i / (missions.length - 1)) * 100}%`}
                  stopColor={`hsl(${m.hue},70%,65%)`}
                  stopOpacity="0.5"
                />
              ))}
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>
          {/* Soft glow trail beneath the line */}
          <path ref={glowPathRef} fill="none" stroke="url(#lineGrad)" strokeWidth="6" opacity="0.12" filter="url(#glow)" />
          {/* Main wavy line, animated via ref each frame */}
          <path ref={pathRef} fill="none" stroke="url(#lineGrad)" strokeWidth="1.5" strokeDasharray="6 5" />
        </svg>

        {/* Nodes float close to — but not pinned to — the curve */}
        {missions.map((m, i) => {
          const bx = (i / (missions.length - 1)) * (TIMELINE_W - 80) + 40;
          const xPct = (bx / TIMELINE_W) * 100;
          const yPct = ((m.yBase + m.offset) / TIMELINE_H) * 100;
          const page = entryPage[i] || 0;
          const entry = m.entries[page] || m.entries[0];

          return (
            <div
              key={i}
              ref={el => { nodeRefs.current[i] = el; }}
              className={`tlNode ${entry.status.toLowerCase()} ${hover === i ? "tlHovered" : ""}`}
              style={{ left: `${xPct}%`, top: `${yPct}%`, ["--hue" as any]: m.hue }}
              onMouseEnter={() => setHover(i)}
              onMouseLeave={() => setHover(null)}
            >
              {/* Outer ring pulse for ACTIVE */}
              {entry.status === "ACTIVE" && <div className="tlPulseRing" />}

              {/* Dot */}
              <div className="tlDot" />

              {/* Year chip */}
              <div className="tlYear" style={{ color: `hsl(${m.hue},65%,72%)` }}>{m.year}</div>

              {/* Card — alternates above/below */}
              {hover === i && (
                <div className={`tlCard ${i % 2 === 0 ? "above" : "below"}`}>
                  <div className="tlCardImage">
                    {entry.image
                      ? <img src={entry.image} alt={entry.title} />
                      : <div className="tlImagePlaceholder">IMAGE</div>}
                  </div>
                  <div className="tlCardBody">
                    <div className="tlCardStatus">{entry.status}</div>
                    <div className="tlCardTitle">{entry.title}</div>
                    <div className="tlCardDesc">{entry.desc}</div>
                  </div>
                  {m.entries.length > 1 && (
                    <div className="tlCardPagination">
                      {m.entries.map((_, p) => (
                        <button
                          key={p}
                          className={`tlPageDot ${p === page ? "active" : ""}`}
                          onMouseEnter={(e) => { e.stopPropagation(); setEntryPage(prev => ({ ...prev, [i]: p })); }}
                          onClick={(e) => { e.stopPropagation(); setEntryPage(prev => ({ ...prev, [i]: p })); }}
                          aria-label={`Show entry ${p + 1}`}
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Legend row */}
      <div className="tlLegend">
        {(["DONE", "ACTIVE", "PLANNED", "FUTURE"] as const).map(s => (
          <div key={s} className="tlLegendItem">
            <div className={`tlLegendDot ${s.toLowerCase()}`} />
            <span>{s}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ============================================================
   ROOT PAGE
   ============================================================ */
export default function Home() {
  const [page, setPage] = useState(0);
  const [boot, setBoot] = useState(true);
  const [utc, setUtc]   = useState("");

  useEffect(() => {
    const t = setTimeout(() => setBoot(false), 3000);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const update = () => setUtc(new Date().toUTCString().slice(0, 25));
    update();
    const i = setInterval(update, 1000);
    return () => clearInterval(i);
  }, []);

  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      if (boot) return;
      if (e.deltaY > 0) setPage(p => Math.min(4, p+1));
      else              setPage(p => Math.max(0, p-1));
    };
    window.addEventListener("wheel", onWheel, { passive: true });
    return () => window.removeEventListener("wheel", onWheel);
  }, [boot]);

  if (boot) return (
    <div className="boot">
      <div className="bootTextGlow">INITIALIZING MISSION SYSTEM...</div>
    </div>
  );

  return (
    <main>
      <div className="bg" />
      <div className="grid" />
      <div className="glow" />

      {/* HUD */}
      <header className="hud">
        <div className="hudItem">STATUS: ONLINE</div>
        <div className="hudItem hudCenter">RAMZI ZIRIAT // EXPLORATION SYSTEM</div>
        <div className="hudItem hudRight">{utc}</div>
      </header>

      {/* Flight hours — floating bottom-left */}
      <FlightHoursWidget />

      {/* Sidebar dots */}
      <aside className="sidebar">
        {["HOME","VISION","LAB","MAP","COLLAB"].map((s, i) => (
          <div key={s} className={`dot ${page===i?"active":""}`} onClick={() => setPage(i)} title={s} />
        ))}
      </aside>

      {/* Scrollable viewport */}
      <div className="viewport" style={{ transform: `translateY(-${page*100}vh)` }}>

        {/* PAGE 1 */}
        <section className="neuralSection">
          <div className="titleOverlay"><h1>RAMZI ZIRIAT</h1></div>
          <NeuralNetwork />
        </section>

        {/* PAGE 2 */}
        <TimelinePage />

        {/* PAGE 3 */}
        <section className="section">
          <h2>FLIGHT LAB</h2>
          <div className="labGrid">
            <div className="panel">Flight Model</div>
            <div className="panel">Astro Module</div>
            <div className="panel">Propulsion</div>
            <div className="panel">Simulation</div>
          </div>
        </section>

        {/* PAGE 4 */}
        <section className="section">
          <h2>EXPLORATION MAP</h2>
          <iframe className="map" src="https://www.openstreetmap.org/export/embed.html" />
        </section>

        {/* PAGE 5 */}
        <section className="section">
          <h2>COLLABORATION</h2>
          <p style={{ maxWidth:"700px", textAlign:"center" }}>
            Research institutions, aerospace industry & scientific media partners.
          </p>
          <button className="cta">CONTACT MISSION CONTROL</button>
        </section>

      </div>
    </main>
  );
}