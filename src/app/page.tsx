"use client";

import { useEffect, useRef, useState } from "react";

/* ============================================================
   MISSION DATA
   ============================================================ */
const missions = [
  {
    year: 2001, title: "System Boot", desc: "Born in Algeria. First breath, first curiosity.",
    status: "DONE", hue: 200,
  },
  {
    year: 2015, title: "First Signal", desc: "Structured scientific thought ignites. Physics, math, the cosmos.",
    status: "DONE", hue: 210,
  },
  {
    year: 2023, title: "Lift-off", desc: "Solo flight hours begin. PPL pathway. Aviation becomes reality.",
    status: "DONE", hue: 240,
  },
  {
    year: 2026, title: "Deep Field", desc: "Astrophysics · Cosmology · Philosophy of Science. Research phase active.",
    status: "ACTIVE", hue: 280,
  },
  {
    year: 2028, title: "Integration", desc: "Aerospace Engineering + M2. Propulsion meets spaceflight.",
    status: "PLANNED", hue: 260,
  },
  {
    year: 2035, title: "Unified Doctrine", desc: "Pilot. Scientist. Engineer. One exploration philosophy.",
    status: "FUTURE", hue: 300,
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

const INACTIVE_PER_REGION = 6; // extra background nodes per region
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

    // Smooth fill canvas (2× grid for bilinear feel)
    const FILL_RES = GRID_RES * 2;

    const resize = () => {
      const r = canvas.getBoundingClientRect();
      canvas.width  = r.width;
      canvas.height = r.height;
      offFill.width  = Math.ceil(r.width  / FILL_RES);
      offFill.height = Math.ceil(r.height / FILL_RES);
    };
    resize();
    window.addEventListener("resize", resize);

    const mouse = { x: -9999, y: -9999 };
    const center = () => ({ x: canvas.width / 2, y: canvas.height / 2 });

    /* Ellipse radii — fits page */
    const eRX = () => Math.min(canvas.width  * 0.42, 480);
    const eRY = () => Math.min(canvas.height * 0.40, 380);

    /* Point-in-ellipse test */
    const inEllipse = (px: number, py: number, cx: number, cy: number, rx: number, ry: number) => {
      const dx = (px - cx) / rx, dy = (py - cy) / ry;
      return dx*dx + dy*dy <= 1;
    };

    /* ---- Build nodes ---- */
    const nodes: any[] = [];

    REGION_DEFS.forEach((rDef, rid) => {
      // Place region center in ellipse at evenly-spaced angle
      const regionAngle = (rid / REGION_COUNT) * Math.PI * 2;
      const cx = () => center().x + Math.cos(regionAngle) * eRX() * 0.45;
      const cy = () => center().y + Math.sin(regionAngle) * eRY() * 0.45;

      // Active (domain) nodes — clustered near region center
      rDef.labels.forEach((label, li) => {
        const spreadAngle = (li / rDef.labels.length) * Math.PI * 2 + regionAngle;
        const spreadR = 60 + Math.random() * 60;
        nodes.push({
          id: nodes.length,
          regionId: rid,
          active: true,
          label,
          baseX: cx() + Math.cos(spreadAngle) * spreadR,
          baseY: cy() + Math.sin(spreadAngle) * spreadR,
          x: 0, y: 0, vx: 0, vy: 0,
          angle: spreadAngle,
          orbitR: spreadR,
          orbitSpeed: 0.0003 + Math.random() * 0.0003,
          orbitPhase: Math.random() * Math.PI * 2,
          pulse: 0, activity: 0,
        });
      });

      // Inactive background nodes — scattered wider in region
      for (let i = 0; i < INACTIVE_PER_REGION; i++) {
        const a = Math.random() * Math.PI * 2;
        const r = 20 + Math.random() * 110;
        nodes.push({
          id: nodes.length,
          regionId: rid,
          active: false,
          label: "",
          baseX: cx() + Math.cos(a) * r,
          baseY: cy() + Math.sin(a) * r,
          x: 0, y: 0, vx: 0, vy: 0,
          angle: a,
          orbitR: r,
          orbitSpeed: 0.0002 + Math.random() * 0.0002,
          orbitPhase: Math.random() * Math.PI * 2,
          pulse: 0, activity: 0,
        });
      }
    });

    // Initialize positions
    nodes.forEach(n => { n.x = n.baseX; n.y = n.baseY; });

    /* ---- Region seed positions (centroids, recomputed per frame) ---- */
    const regions = REGION_DEFS.map((rDef, id) => ({
      id, hue: rDef.hue, name: rDef.name,
      seed: { x: 0, y: 0 },
      nodeIds: nodes.filter(n => n.regionId === id).map(n => n.id),
      rgba: hslToRgb(rDef.hue / 360, 0.55, 0.14),
    }));

    /* ---- Voronoi grid ---- */
    let gW = offFill.width, gH = offFill.height;
    let grid = new Uint8Array(gW * gH);
    let fillImageData = offFillCtx.createImageData(gW, gH);

    const updateGrid = () => {
      gW = offFill.width; gH = offFill.height;
      if (grid.length !== gW * gH) {
        grid = new Uint8Array(gW * gH);
        fillImageData = offFillCtx.createImageData(gW, gH);
      }

      const c = center();
      const rx = eRX(), ry = eRY();

      // Update seeds
      for (const r of regions) {
        let sx = 0, sy = 0;
        for (const nid of r.nodeIds) { sx += nodes[nid].x; sy += nodes[nid].y; }
        const n = r.nodeIds.length || 1;
        r.seed.x = sx / n; r.seed.y = sy / n;
      }

      // Fill grid
      for (let gy = 0; gy < gH; gy++) {
        for (let gx = 0; gx < gW; gx++) {
          const px = gx * FILL_RES + FILL_RES / 2;
          const py = gy * FILL_RES + FILL_RES / 2;

          if (!inEllipse(px, py, c.x, c.y, rx, ry)) {
            grid[gy * gW + gx] = 255;
            continue;
          }

          let best = Infinity, bestId = 0;
          for (const r of regions) {
            const dx = px - r.seed.x, dy = py - r.seed.y;
            const d2 = dx*dx + dy*dy;
            if (d2 < best) { best = d2; bestId = r.id; }
          }
          grid[gy * gW + gx] = bestId;
        }
      }
    };

    /* ---- Smooth Voronoi fill via distance-weighted color blend ---- */
    const drawFill = () => {
      const W = gW, H = gH;
      const d = fillImageData.data;
      const c = center();
      const rx = eRX(), ry = eRY();

      for (let i = 0; i < W * H; i++) {
        const rid = grid[i];
        const base = i * 4;
        if (rid === 255) { d[base+3] = 0; continue; }

        // Soft edge: fade alpha near ellipse boundary
        const px = (i % W) * FILL_RES + FILL_RES / 2;
        const py = Math.floor(i / W) * FILL_RES + FILL_RES / 2;
        const edgeDist = 1 - Math.sqrt(
          Math.pow((px - c.x) / rx, 2) + Math.pow((py - c.y) / ry, 2)
        );
        const alpha = Math.min(1, edgeDist * 6) * 48; // ramp at edge

        const [r, g, b] = regions[rid].rgba;
        d[base] = r; d[base+1] = g; d[base+2] = b;
        d[base+3] = Math.round(alpha);
      }

      offFillCtx.putImageData(fillImageData, 0, 0);

      ctx.save();
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";

      // Clip draw to ellipse so fill never bleeds outside
      ctx.beginPath();
      ctx.ellipse(c.x, c.y, rx, ry, 0, 0, Math.PI * 2);
      ctx.clip();

      ctx.drawImage(offFill, 0, 0, canvas.width, canvas.height);
      ctx.restore();
    };

    /* ---- Smooth Voronoi borders via Gaussian-blurred edge detection ---- */
    const drawBorders = () => {
      const W = Math.ceil(canvas.width  / GRID_RES);
      const H = Math.ceil(canvas.height / GRID_RES);

      // We need a border grid at GRID_RES (finer than fill grid)
      // Reuse the fill grid but at GRID_RES scale by sampling
      const c = center();
      const rx = eRX(), ry = eRY();

      ctx.save();
      ctx.beginPath();
      ctx.ellipse(c.x, c.y, rx, ry, 0, 0, Math.PI * 2);
      ctx.clip();

      // Draw smooth border: for each boundary pixel, draw a soft glow line
      ctx.lineWidth = 2;
      ctx.setLineDash([]);

      // Sample fine grid for borders
      for (let gy = 0; gy < H - 1; gy++) {
        for (let gx = 0; gx < W - 1; gx++) {
          const px = gx * GRID_RES + GRID_RES / 2;
          const py = gy * GRID_RES + GRID_RES / 2;

          if (!inEllipse(px, py, c.x, c.y, rx, ry)) continue;

          // Find nearest two regions at this point
          let d1 = Infinity, d2 = Infinity, r1 = 0, r2 = 1;
          for (const r of regions) {
            const dx = px - r.seed.x, dy = py - r.seed.y;
            const d = dx*dx + dy*dy;
            if (d < d1) { d2 = d1; r2 = r1; d1 = d; r1 = r.id; }
            else if (d < d2) { d2 = d; r2 = r.id; }
          }

          // Proximity to Voronoi boundary = how close d1 and d2 are
          const borderProx = 1 - (Math.sqrt(d2) - Math.sqrt(d1)) / (GRID_RES * 3);
          if (borderProx > 0.6) {
            const alpha = Math.pow((borderProx - 0.6) / 0.4, 1.5) * 0.85;
            const h1 = REGION_DEFS[r1].hue, h2 = REGION_DEFS[r2].hue;
            const avgH = (h1 + h2) / 2;
            ctx.strokeStyle = `hsla(${avgH},75%,80%,${alpha})`;
            ctx.beginPath();
            ctx.arc(px, py, GRID_RES * 0.6, 0, Math.PI * 2);
            ctx.stroke();
          }
        }
      }

      ctx.restore();
    };

    /* ---- Outer ellipse ring ---- */
    const drawOuterRing = () => {
      const c = center();
      const rx = eRX(), ry = eRY();
      ctx.save();
      ctx.beginPath();
      ctx.ellipse(c.x, c.y, rx, ry, 0, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(76,201,240,0.25)";
      ctx.lineWidth = 1.5;
      ctx.setLineDash([6, 8]);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.restore();

      // Region name labels on the boundary
      for (const r of regions) {
        const angle = (r.id / REGION_COUNT) * Math.PI * 2;
        const lx = c.x + Math.cos(angle) * (rx * 0.78);
        const ly = c.y + Math.sin(angle) * (ry * 0.78);
        ctx.save();
        ctx.font = "9px system-ui";
        ctx.letterSpacing = "0.12em";
        ctx.fillStyle = `hsla(${r.hue},70%,72%,0.6)`;
        ctx.textAlign = "center";
        ctx.fillText(REGION_DEFS[r.id].name.toUpperCase(), lx, ly);
        ctx.restore();
      }
    };

    /* ---- Signals (travel along edges only) ---- */
    interface Signal { a: any; b: any; t: number; speed: number; color: string }
    const signals: Signal[] = [];
    // Edge list: pairs of node indices that are "connected"
    const edges: [number, number][] = [];

    // Build edges once (within-region and some cross-region)
    const buildEdges = () => {
      edges.length = 0;
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i], b = nodes[j];
          const dx = a.x - b.x, dy = a.y - b.y;
          const d = Math.sqrt(dx*dx + dy*dy);
          if (d < 160) edges.push([i, j]);
        }
      }
    };

    // Rebuild edges every 60 frames
    let edgeTimer = 0;

    const spawnSignal = (edgeIdx: number) => {
      if (edges.length === 0) return;
      const [ai, bi] = edges[edgeIdx % edges.length];
      const a = nodes[ai], b = nodes[bi];
      const sameRegion = a.regionId === b.regionId;
      const hue = REGION_DEFS[a.regionId].hue;
      signals.push({
        a, b,
        t: 0,
        speed: 0.008 + Math.random() * 0.012,
        color: sameRegion
          ? `hsla(${hue},90%,80%,0.9)`
          : "rgba(180,220,255,0.7)",
      });
    };

    /* ---- Waves ---- */
    const waves: any[] = [];
    const spawnWave = (origin: any) =>
      waves.push({ origin, radius: 0, speed: 1.4 + Math.random() * 0.6, max: 220 });

    const onMove = (e: MouseEvent) => {
      const r = canvas.getBoundingClientRect();
      mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top;
    };
    canvas.addEventListener("mousemove", onMove);

    /* ============================================================
       MAIN DRAW LOOP
       ============================================================ */
    let frame = 0;

    const draw = () => {
      const c = center();
      const rx = eRX(), ry = eRY();
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      frame++;

      /* Voronoi */
      if (frame % VORONOI_EVERY === 0) updateGrid();
      drawFill();
      drawBorders();
      drawOuterRing();

      /* Node physics — orbit around baseX/baseY, soft ellipse constraint */
      for (const n of nodes) {
        n.orbitPhase += n.orbitSpeed;

        // Gently drift toward orbit point
        const tx = n.baseX + Math.cos(n.orbitPhase) * (n.orbitR * 0.18);
        const ty = n.baseY + Math.sin(n.orbitPhase) * (n.orbitR * 0.18);

        // Mouse repulsion
        const mdx = n.x - mouse.x, mdy = n.y - mouse.y;
        const md = Math.sqrt(mdx*mdx + mdy*mdy);
        if (md < 180) {
          const push = (1 - md/180) * 1.2;
          n.vx += (mdx/md) * push;
          n.vy += (mdy/md) * push;
        }

        n.vx += (tx - n.x) * 0.018;
        n.vy += (ty - n.y) * 0.018;
        n.vx *= 0.88; n.vy *= 0.88;
        n.x  += n.vx;  n.y  += n.vy;

        // Hard ellipse clamp
        const ndx = (n.x - c.x) / rx, ndy = (n.y - c.y) / ry;
        const nd = Math.sqrt(ndx*ndx + ndy*ndy);
        if (nd > 0.95) {
          const scale = 0.93 / nd;
          n.x = c.x + ndx * rx * scale;
          n.y = c.y + ndy * ry * scale;
          n.vx *= -0.3; n.vy *= -0.3;
        }

        if (n.active) {
          const dist = Math.sqrt(mdx*mdx + mdy*mdy);
          if (dist < 140 && Math.random() < 0.025) spawnWave(n);
        }
      }

      /* Rebuild edges periodically */
      edgeTimer++;
      if (edgeTimer % 60 === 0) buildEdges();

      /* Spawn signals on existing edges */
      if (edges.length > 0 && Math.random() < 0.04) {
        spawnSignal(Math.floor(Math.random() * edges.length));
      }

      /* Wave → node impulses */
      for (let i = waves.length-1; i >= 0; i--) {
        waves[i].radius += waves[i].speed;
        if (waves[i].radius > waves[i].max) { waves.splice(i, 1); continue; }
        const w = waves[i];
        for (const n of nodes) {
          const dx = n.x - w.origin.x, dy = n.y - w.origin.y;
          const dist = Math.sqrt(dx*dx + dy*dy);
          const diff = Math.abs(dist - w.radius);
          if (diff < 18) {
            const p = (1 - diff/18) * 0.25;
            n.pulse    = Math.min(1, n.pulse + p);
            n.activity = Math.min(1, n.activity + p);
          }
        }
      }

      /* Update signals */
      for (let i = signals.length-1; i >= 0; i--) {
        signals[i].t += signals[i].speed;
        if (signals[i].t >= 1) signals.splice(i, 1);
      }

      /* Draw edges */
      for (const [ai, bi] of edges) {
        const a = nodes[ai], b = nodes[bi];
        const dx = a.x-b.x, dy = a.y-b.y;
        const d = Math.sqrt(dx*dx + dy*dy);
        const same = a.regionId === b.regionId;
        const alpha = same ? 0.22 : 0.07;
        const hue   = same ? REGION_DEFS[a.regionId].hue : 200;
        const fade  = Math.max(0, 1 - d / 160);
        ctx.strokeStyle = `hsla(${hue},60%,72%,${alpha * fade})`;
        ctx.lineWidth = same ? 0.8 : 0.4;
        ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
      }

      /* Draw signals — travel along edge, glow tail */
      for (const s of signals) {
        const x = s.a.x + (s.b.x - s.a.x) * s.t;
        const y = s.a.y + (s.b.y - s.a.y) * s.t;

        // Tail
        const tx2 = s.a.x + (s.b.x - s.a.x) * Math.max(0, s.t - 0.12);
        const ty2 = s.a.y + (s.b.y - s.a.y) * Math.max(0, s.t - 0.12);
        const grad = ctx.createLinearGradient(tx2, ty2, x, y);
        grad.addColorStop(0, "rgba(0,0,0,0)");
        grad.addColorStop(1, s.color);
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.moveTo(tx2, ty2); ctx.lineTo(x, y); ctx.stroke();

        // Head glow
        ctx.save();
        ctx.shadowBlur = 10;
        ctx.shadowColor = s.color;
        ctx.fillStyle   = "white";
        ctx.beginPath(); ctx.arc(x, y, 2.2, 0, Math.PI * 2); ctx.fill();
        ctx.restore();
      }

      /* Draw nodes */
      for (const n of nodes) {
        const dx = mouse.x - n.x, dy = mouse.y - n.y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        const near  = dist < 100;
        const hover = dist < 22;

        let size = n.active ? 5.5 : 2.5;
        size *= 1 + n.pulse * 0.6;
        if (near)  size *= 1.3;
        if (hover) size *= 1.8;
        n.pulse    *= 0.88;
        n.activity *= 0.88;

        const hue = REGION_DEFS[n.regionId].hue;

        // Outer glow for active nodes
        if (n.active) {
          ctx.save();
          ctx.shadowBlur  = 12 + n.activity * 10;
          ctx.shadowColor = `hsla(${hue},80%,65%,0.6)`;
          ctx.fillStyle   = `hsla(${hue},80%,72%,${0.8 + n.activity * 0.2})`;
          ctx.beginPath(); ctx.arc(n.x, n.y, size, 0, Math.PI * 2); ctx.fill();
          ctx.restore();
        } else {
          ctx.fillStyle = `hsla(${hue},35%,65%,0.38)`;
          ctx.beginPath(); ctx.arc(n.x, n.y, size, 0, Math.PI * 2); ctx.fill();
        }

        // Label
        if (n.active && near) {
          ctx.save();
          ctx.fillStyle = hover ? "white" : `hsla(${hue},60%,90%,0.85)`;
          ctx.font = hover ? "bold 13px system-ui" : "11px system-ui";
          ctx.fillText(n.label, n.x + 9, n.y + 4);
          ctx.restore();
        }
      }

      requestAnimationFrame(draw);
    };

    buildEdges();
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

  return (
    <section className="timelineSection">
      <div className="timelineHeader">
        <span className="timelineEyebrow">TRAJECTORY</span>
        <h2 className="timelineTitle">VISION TIMELINE</h2>
      </div>

      <div className="timelineTrack">
        {/* Curved connecting path */}
        <svg className="timelineSVG" viewBox="0 0 1000 260" preserveAspectRatio="none">
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
          {/* Wavy baseline */}
          <path
            d="M 30 160 C 150 80, 250 200, 380 130 S 550 60, 680 140 S 820 200, 970 110"
            fill="none"
            stroke="url(#lineGrad)"
            strokeWidth="1.5"
            strokeDasharray="6 5"
          />
        </svg>

        {/* Nodes mapped to curve points */}
        {missions.map((m, i) => {
          // Approximate y positions matching the SVG curve
          const yOffsets = [160, 80, 200, 130, 60, 110];
          const xPct = (i / (missions.length - 1)) * 88 + 3; // 3%–91%
          const yPct = (yOffsets[i] / 260) * 100;

          return (
            <div
              key={i}
              className={`tlNode ${m.status.toLowerCase()} ${hover === i ? "tlHovered" : ""}`}
              style={{ left: `${xPct}%`, top: `${yPct}%` }}
              onMouseEnter={() => setHover(i)}
              onMouseLeave={() => setHover(null)}
            >
              {/* Outer ring pulse for ACTIVE */}
              {m.status === "ACTIVE" && <div className="tlPulseRing" style={{ ["--hue" as any]: m.hue }} />}

              {/* Dot */}
              <div className="tlDot" style={{ ["--hue" as any]: m.hue }} />

              {/* Year chip */}
              <div className="tlYear" style={{ color: `hsl(${m.hue},65%,72%)` }}>{m.year}</div>

              {/* Card — alternates above/below */}
              {hover === i && (
                <div className={`tlCard ${i % 2 === 0 ? "above" : "below"}`} style={{ ["--hue" as any]: m.hue }}>
                  <div className="tlCardStatus">{m.status}</div>
                  <div className="tlCardTitle">{m.title}</div>
                  <div className="tlCardDesc">{m.desc}</div>
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