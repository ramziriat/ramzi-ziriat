"use client";

import { useEffect, useRef, useState } from "react";

/* ---------------- MISSION DATA ---------------- */
const missions = [
  { year: 2001, title: "Birth", desc: "System initialization", status: "DONE" },
  { year: 2015, title: "Scientific curiosity", desc: "First structured cognition", status: "DONE" },
  { year: 2023, title: "Aviation exploration", desc: "Flight systems trajectory", status: "DONE" },
  { year: 2026, title: "Research phase", desc: "Astrophysics + Cosmology + Philosophy", status: "ACTIVE" },
  { year: 2028, title: "Engineering + M2", desc: "Aerospace integration", status: "PLANNED" },
  { year: 2035, title: "Exploration synthesis", desc: "Unified exploration doctrine", status: "FUTURE" },
];

const ACTIVE_LABELS = [
  "Aerospace", "Astrophysics", "Cosmology", "Philosophy", "Pilot",
  "Propulsion", "Orbital Mechanics", "Quantum Gravity",
  "Aviation Systems", "Exoplanets", "Spaceflight", "Relativity",
];

const TOTAL_NODES    = 155;
const REGION_COUNT   = 8;
const GRID_RES       = 10;   // px per Voronoi cell — bigger = faster
const VORONOI_EVERY  = 3;    // recompute grid every N frames
const NETWORK_RADIUS = 500;  // clip circle radius — Voronoi drawn only inside
const REGION_HUES    = [200, 240, 280, 170, 210, 260, 190, 300];

/* Fast HSL→RGB (h/s/l all 0-1) */
function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  const f = (t: number) => {
    if (t < 0) t += 1; if (t > 1) t -= 1;
    if (t < 1/6) return p + (q - p) * 6 * t;
    if (t < 1/2) return q;
    if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
    return p;
  };
  return [Math.round(f(h+1/3)*255), Math.round(f(h)*255), Math.round(f(h-1/3)*255)];
}

/* ---------------- NEURAL NETWORK ---------------- */
function NeuralNetwork() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current!;
    const ctx    = canvas.getContext("2d")!;

    /* Offscreen canvas for Voronoi fill (drawn at grid resolution, blitted scaled) */
    const offFill   = document.createElement("canvas");
    const offFillCtx = offFill.getContext("2d")!;

    const resize = () => {
      const r = canvas.getBoundingClientRect();
      canvas.width  = r.width;
      canvas.height = r.height;
      offFill.width  = Math.ceil(r.width  / GRID_RES);
      offFill.height = Math.ceil(r.height / GRID_RES);
    };
    resize();
    window.addEventListener("resize", resize);

    const mouse  = { x: -9999, y: -9999 };
    const center = () => ({ x: canvas.width / 2, y: canvas.height / 2 });

    /* --- Nodes --- */
    const nodes: any[] = [];
    for (let i = 0; i < TOTAL_NODES; i++) {
      const angle  = Math.random() * Math.PI * 2;
      const radius = (Math.pow(Math.random(), 1.6) * 220 + 40) * 2.0;
      const c = center();
      nodes.push({
        id: i, angle, radius,
        x: c.x + Math.cos(angle) * radius,
        y: c.y + Math.sin(angle) * radius,
        vx: 0, vy: 0,
        active: i < ACTIVE_LABELS.length,
        label: i < ACTIVE_LABELS.length ? ACTIVE_LABELS[i] : "",
        pulse: 0, activity: 0, regionId: 0,
      });
    }

    /* --- Regions --- */
    const regions: any[] = Array.from({ length: REGION_COUNT }, (_, id) => ({
      id, seed: { x: 0, y: 0 }, nodeIds: [], hue: REGION_HUES[id],
    }));
    const shuffled = [...nodes].sort(() => Math.random() - 0.5);
    shuffled.forEach((n, i) => {
      const rid = i % REGION_COUNT;
      regions[rid].nodeIds.push(n.id);
      n.regionId = rid;
    });

    /* --- Voronoi grid (grid-resolution Uint8Array) --- */
    let gW = offFill.width, gH = offFill.height;
    let grid = new Uint8Array(gW * gH);

    /* Precompute per-region RGBA so fill loop avoids hslToRgb every frame */
    const regionRGBA: [number,number,number][] = regions.map(r => hslToRgb(r.hue/360, 0.5, 0.13));

    const updateGrid = () => {
      gW = offFill.width; gH = offFill.height;
      if (grid.length !== gW * gH) grid = new Uint8Array(gW * gH);

      /* Update seeds */
      for (const r of regions) {
        let sx = 0, sy = 0;
        for (const nid of r.nodeIds) { sx += nodes[nid].x; sy += nodes[nid].y; }
        const n = r.nodeIds.length || 1;
        r.seed.x = sx / n; r.seed.y = sy / n;
      }

      const c = center();
      const R2 = NETWORK_RADIUS * NETWORK_RADIUS;

      /* Nearest-seed Voronoi, clipped to circle */
      for (let gy = 0; gy < gH; gy++) {
        for (let gx = 0; gx < gW; gx++) {
          const px = gx * GRID_RES + GRID_RES / 2;
          const py = gy * GRID_RES + GRID_RES / 2;
          const dx0 = px - c.x, dy0 = py - c.y;

          /* Outside clip circle → sentinel 255 (transparent) */
          if (dx0*dx0 + dy0*dy0 > R2) { grid[gy*gW + gx] = 255; continue; }

          let best = Infinity, bestId = 0;
          for (const r of regions) {
            const dx = px - r.seed.x, dy = py - r.seed.y;
            const d2 = dx*dx + dy*dy;
            if (d2 < best) { best = d2; bestId = r.id; }
          }
          grid[gy*gW + gx] = bestId;
        }
      }
    };

    /* Draw fill by writing to offscreen ImageData at grid resolution, then drawImage scaled */
    let fillImageData = offFillCtx.createImageData(gW, gH);

    const drawFill = () => {
      const W = gW, H = gH;
      if (fillImageData.width !== W || fillImageData.height !== H)
        fillImageData = offFillCtx.createImageData(W, H);

      const d = fillImageData.data;
      for (let i = 0; i < W * H; i++) {
        const rid = grid[i];
        const base = i * 4;
        if (rid === 255) { d[base+3] = 0; continue; }   // outside → transparent
        const [r,g,b] = regionRGBA[rid];
        d[base] = r; d[base+1] = g; d[base+2] = b; d[base+3] = 32;
      }
      offFillCtx.putImageData(fillImageData, 0, 0);

      /* Blit scaled to main canvas — browser uses GPU for this */
      ctx.save();
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "low";
      ctx.drawImage(offFill, 0, 0, canvas.width, canvas.height);
      ctx.restore();
    };

    /* Draw borders by scanning adjacent cells — only inside the clip circle */
    const drawBorders = () => {
      const W = gW, H = gH;
      ctx.lineWidth = 1.2;
      ctx.setLineDash([3, 5]);

      for (let gy = 0; gy < H - 1; gy++) {
        for (let gx = 0; gx < W - 1; gx++) {
          const c0  = grid[gy * W + gx];
          const cr  = grid[gy * W + gx + 1];
          const cb  = grid[(gy+1) * W + gx];

          /* Skip if either side is outside */
          if (c0 === 255) continue;

          const px = gx * GRID_RES, py = gy * GRID_RES;

          if (cr !== 255 && c0 !== cr) {
            const avg = (REGION_HUES[c0] + REGION_HUES[cr]) / 2;
            ctx.strokeStyle = `hsla(${avg},65%,78%,0.4)`;
            ctx.beginPath();
            ctx.moveTo(px + GRID_RES, py);
            ctx.lineTo(px + GRID_RES, py + GRID_RES);
            ctx.stroke();
          }
          if (cb !== 255 && c0 !== cb) {
            const avg = (REGION_HUES[c0] + REGION_HUES[cb]) / 2;
            ctx.strokeStyle = `hsla(${avg},65%,78%,0.4)`;
            ctx.beginPath();
            ctx.moveTo(px,            py + GRID_RES);
            ctx.lineTo(px + GRID_RES, py + GRID_RES);
            ctx.stroke();
          }
        }
      }
      ctx.setLineDash([]);
    };

    /* Draw the outer clip circle border */
    const drawOuterRing = () => {
      const c = center();
      ctx.beginPath();
      ctx.arc(c.x, c.y, NETWORK_RADIUS, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(76,201,240,0.18)";
      ctx.lineWidth = 1.5;
      ctx.setLineDash([6, 8]);
      ctx.stroke();
      ctx.setLineDash([]);
    };

    /* --- Signals & waves --- */
    const signals: any[] = [];
    const waves:   any[] = [];
    const spawnSignal = (a: any, b: any, bias = 1) =>
      signals.push({ a, b, t: 0, speed: (0.012 + Math.random()*0.016)*bias*0.7 });
    const spawnWave = (origin: any) =>
      waves.push({ origin, radius: 0, speed: 1.6 + Math.random()*0.6, max: 270 });

    const onMove = (e: MouseEvent) => {
      const r = canvas.getBoundingClientRect();
      mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top;
    };
    canvas.addEventListener("mousemove", onMove);

    /* --- Main draw loop --- */
    let frame = 0;

    const draw = () => {
      const c = center();
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      frame++;

      /* Voronoi (throttled) */
      if (frame % VORONOI_EVERY === 0) updateGrid();
      drawFill();
      drawBorders();
      drawOuterRing();

      /* Node physics */
      let mouseOnNet = false;
      for (const n of nodes) {
        const dx = mouse.x - n.x, dy = mouse.y - n.y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        if (dist < 260) mouseOnNet = true;

        const inf = dist < 240 ? (1 - dist/240) * 0.22 : 0;
        n.vx += dx * inf * 0.01;
        n.vy += dy * inf * 0.01;

        const ox = c.x + Math.cos(n.angle) * n.radius;
        const oy = c.y + Math.sin(n.angle) * n.radius;
        n.vx += (ox - n.x) * 0.015; n.vy += (oy - n.y) * 0.015;
        n.vx *= 0.92; n.vy *= 0.92;
        n.x  += n.vx;  n.y  += n.vy;
        n.angle += 0.00055;

        if (n.active && dist < 160 && Math.random() < 0.03) spawnWave(n);
      }

      /* Signals */
      if (Math.random() < 0.010) {
        const a = nodes[Math.floor(Math.random()*nodes.length)];
        const b = nodes[Math.floor(Math.random()*nodes.length)];
        if (a !== b) spawnSignal(a, b);
      }
      if (mouseOnNet && Math.random() < 0.025) {
        const a = nodes[Math.floor(Math.random()*nodes.length)];
        const b = nodes[Math.floor(Math.random()*nodes.length)];
        if (a !== b) spawnSignal(a, b);
      }
      for (const n of nodes) {
        const dx = mouse.x - n.x, dy = mouse.y - n.y;
        if (Math.sqrt(dx*dx + dy*dy) < 28 && Math.random() < 0.08)
          spawnSignal(n, nodes[Math.floor(Math.random()*nodes.length)], n.active ? 1.2 : 1);
      }

      for (let i = signals.length-1; i >= 0; i--) {
        signals[i].t += signals[i].speed;
        if (signals[i].t >= 1) signals.splice(i, 1);
      }
      for (let i = waves.length-1; i >= 0; i--) {
        waves[i].radius += waves[i].speed;
        if (waves[i].radius > waves[i].max) waves.splice(i, 1);
      }

      /* Wave impulses */
      for (const w of waves) {
        for (const n of nodes) {
          const dx = n.x - w.origin.x, dy = n.y - w.origin.y;
          const dist = Math.sqrt(dx*dx + dy*dy);
          const diff = Math.abs(dist - w.radius);
          if (diff < 22) {
            const pulse = (1 - diff/22) * 0.3;
            n.vx += (dx/(dist||1)) * pulse * 0.1;
            n.vy += (dy/(dist||1)) * pulse * 0.1;
            n.pulse    = Math.min(1, n.pulse + pulse);
            n.activity = Math.min(1, n.activity + pulse);
          }
        }
      }

      /* Links */
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i+1; j < nodes.length; j++) {
          const a = nodes[i], b = nodes[j];
          const dx = a.x-b.x, dy = a.y-b.y;
          const d = Math.sqrt(dx*dx + dy*dy);
          if (d < 190) {
            const same = a.regionId === b.regionId;
            ctx.strokeStyle = same
              ? `hsla(${REGION_HUES[a.regionId]},70%,70%,0.18)`
              : "rgba(76,201,240,0.07)";
            ctx.lineWidth = same ? 1 : 0.5;
            ctx.beginPath(); ctx.moveTo(a.x,a.y); ctx.lineTo(b.x,b.y); ctx.stroke();
          }
        }
      }

      /* Signal dots */
      ctx.shadowBlur = 8;
      ctx.shadowColor = "rgba(120,200,255,0.5)";
      ctx.fillStyle   = "rgba(120,200,255,0.8)";
      for (const s of signals) {
        const x = s.a.x + (s.b.x-s.a.x)*s.t;
        const y = s.a.y + (s.b.y-s.a.y)*s.t;
        ctx.beginPath(); ctx.arc(x, y, 2, 0, Math.PI*2); ctx.fill();
      }
      ctx.shadowBlur = 0;

      /* Nodes */
      for (const n of nodes) {
        const dx = mouse.x-n.x, dy = mouse.y-n.y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        const near  = dist < 110;
        const hover = dist < 28;

        let size = n.active ? 6 : 3;
        size *= 1 + n.pulse*0.55;
        if (near)  size *= 1.35;
        if (hover) size *= 2.0;
        n.pulse    *= 0.9;
        n.activity *= 0.9;

        ctx.beginPath();
        ctx.fillStyle = n.active
          ? `hsla(${REGION_HUES[n.regionId]},80%,72%,${0.85+n.activity*0.15})`
          : `hsla(${REGION_HUES[n.regionId]},40%,75%,0.45)`;
        ctx.arc(n.x, n.y, size, 0, Math.PI*2);
        ctx.fill();

        if (n.active && near) {
          ctx.fillStyle = hover ? "white" : "rgba(255,255,255,0.75)";
          ctx.font = hover ? "14px system-ui" : "11px system-ui";
          ctx.fillText(n.label, n.x+10, n.y+4);
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

/* ---------------- PAGE COMPONENT ---------------- */
export default function Home() {
  const [page, setPage]   = useState(0);
  const [hover, setHover] = useState<number | null>(null);
  const [boot, setBoot]   = useState(true);
  const [utc, setUtc]     = useState("");
  const [flightHours, setFlightHours] = useState(0);

  useEffect(() => {
    const target = 42, start = performance.now();
    let raf: number;
    const animate = (t: number) => {
      const p = Math.min((t-start)/2500, 1);
      setFlightHours((1 - Math.pow(1-p,4)) * target);
      if (p < 1) raf = requestAnimationFrame(animate);
      else setFlightHours(target);
    };
    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setBoot(false), 3000);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const update = () => setUtc(new Date().toUTCString());
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

      <header className="hud">
        <div>STATUS: ONLINE</div>
        <div>RAMZI ZIRIAT // EXPLORATION SYSTEM</div>
        <div>{utc}</div>
        <div>FLIGHT HOURS: {flightHours.toFixed(1)}h</div>
      </header>

      <aside className="sidebar">
        {["HOME","VISION","LAB","MAP","COLLAB"].map((s, i) => (
          <div key={s} className={`dot ${page===i?"active":""}`} onClick={() => setPage(i)} />
        ))}
      </aside>

      <div className="viewport" style={{ transform: `translateY(-${page*100}vh)` }}>

        <section className="neuralSection">
          <div className="titleOverlay"><h1>RAMZI ZIRIAT</h1></div>
          <NeuralNetwork />
        </section>

        <section className="section">
          <h2>VISION TIMELINE</h2>
          <div className="timeline">
            <div className="line" />
            {missions.map((m, i) => (
              <div key={i} className="node"
                style={{ left: `${(i/(missions.length-1))*100}%` }}
                onMouseEnter={() => setHover(i)}
                onMouseLeave={() => setHover(null)}
              >
                <div className="dotNode" />
                <span className="year">{m.year}</span>
                {hover === i && (
                  <div className="tooltip"><h3>{m.title}</h3><p>{m.desc}</p></div>
                )}
              </div>
            ))}
          </div>
        </section>

        <section className="section">
          <h2>FLIGHT LAB</h2>
          <div className="labGrid">
            <div className="panel">Flight Model</div>
            <div className="panel">Astro Module</div>
            <div className="panel">Propulsion</div>
            <div className="panel">Simulation</div>
          </div>
        </section>

        <section className="section">
          <h2>EXPLORATION MAP</h2>
          <iframe className="map" src="https://www.openstreetmap.org/export/embed.html" />
        </section>

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