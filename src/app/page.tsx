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

/* ---------------- NEURAL NODES ---------------- */
const activeLabels = [
  "Aerospace",
  "Astrophysics",
  "Cosmology",
  "Philosophy",
  "Pilot",
  "Propulsion",
  "Orbital Mechanics",
  "Quantum Gravity",
  "Aviation Systems",
  "Exoplanets",
  "Spaceflight",
  "Relativity",
  "Neuroscience",
  "Simulation",
  "Exploration",
];

const inactiveNodes = Array.from({ length: 20 }, (_, i) => `node-${i}`);

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

export default function Home() {
  const [page, setPage] = useState(0);
  const [hover, setHover] = useState<number | null>(null);
  const [boot, setBoot] = useState(true);
  const [utc, setUtc] = useState("");

const [flightHours, setFlightHours] = useState(0);

useEffect(() => {
  const target = 42;
  const start = performance.now();

  let raf: number;

  const animate = (t: number) => {
    const p = Math.min((t - start) / 2500, 1);

    // easing type "cosine cinematic"
    const eased = 1 - Math.pow(1 - p, 4);

    const value = eased * target;

    // IMPORTANT: keep decimals for smooth visual flow
    setFlightHours(value);

    if (p < 1) {
      raf = requestAnimationFrame(animate);
    } else {
      // lock exact value at end
      setFlightHours(target);
    }
  };

  raf = requestAnimationFrame(animate);

  return () => cancelAnimationFrame(raf);
}, []);

  /* ---------------- BOOT ---------------- */
  useEffect(() => {
    const t = setTimeout(() => setBoot(false), 3000);
    return () => clearTimeout(t);
  }, []);

  /* ---------------- UTC ---------------- */
  useEffect(() => {
    const update = () => setUtc(new Date().toUTCString());
    update();
    const i = setInterval(update, 1000);
    return () => clearInterval(i);
  }, []);

  /* ---------------- NAV ---------------- */
  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      if (boot) return;
      if (e.deltaY > 0) setPage((p) => Math.min(4, p + 1));
      else setPage((p) => Math.max(0, p - 1));
    };

    window.addEventListener("wheel", onWheel, { passive: true });
    return () => window.removeEventListener("wheel", onWheel);
  }, [boot]);

  /* ---------------- BOOT SCREEN ---------------- */
  if (boot) {
    return (
      <div className="boot">
        <div className="bootTextGlow">
          INITIALIZING MISSION SYSTEM...
        </div>
      </div>
    );
  }

  return (
    <main>

      {/* BACKGROUND */}
      <div className="bg" />
      <div className="grid" />
      <div className="glow" />

      {/* HUD */}
      <header className="hud">
        <div>STATUS: ONLINE</div>
        <div>RAMZI ZIRIAT // EXPLORATION SYSTEM</div>
        <div>{utc}</div>
        <div>FLIGHT HOURS: {flightHours}h</div>
      </header>

      {/* SIDEBAR */}
      <aside className="sidebar">
        {["HOME", "VISION", "LAB", "MAP", "COLLAB"].map((s, i) => (
          <div
            key={s}
            className={`dot ${page === i ? "active" : ""}`}
            onClick={() => setPage(i)}
          />
        ))}
      </aside>

      {/* VIEWPORT */}
      <div className="viewport" style={{ transform: `translateY(-${page * 100}vh)` }}>

        {/* ---------------- PAGE 1: NEURAL NETWORK ---------------- */}
        <section className="neuralSection">
          <div className="titleOverlay">
            <h1>RAMZI ZIRIAT</h1>
          </div>

          <NeuralNetwork />
        </section>

        {/* ---------------- PAGE 2: TIMELINE ---------------- */}
        <section className="section">
          <h2>VISION TIMELINE</h2>

          <div className="timeline">
            <div className="line" />

            {missions.map((m, i) => (
              <div
                key={i}
                className="node"
                style={{ left: `${(i / (missions.length - 1)) * 100}%` }}
                onMouseEnter={() => setHover(i)}
                onMouseLeave={() => setHover(null)}
              >
                <div className="dotNode" />
                <span className="year">{m.year}</span>

                {hover === i && (
                  <div className="tooltip">
                    <h3>{m.title}</h3>
                    <p>{m.desc}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* ---------------- PAGE 3: LAB ---------------- */}
        <section className="section">
          <h2>FLIGHT LAB</h2>

          <div className="labGrid">
            <div className="panel">Flight Model</div>
            <div className="panel">Astro Module</div>
            <div className="panel">Propulsion</div>
            <div className="panel">Simulation</div>
          </div>
        </section>

        {/* ---------------- PAGE 4: MAP ---------------- */}
        <section className="section">
          <h2>EXPLORATION MAP</h2>

          <iframe
            className="map"
            src="https://www.openstreetmap.org/export/embed.html"
          />
        </section>

        {/* ---------------- PAGE 5: COLLAB ---------------- */}
        <section className="section">
          <h2>COLLABORATION</h2>

          <p style={{ maxWidth: "700px", textAlign: "center" }}>
            Research institutions, aerospace industry & scientific media partners.
          </p>

          <button className="cta">CONTACT MISSION CONTROL</button>
        </section>

      </div>
    </main>
  );
}

function NeuralNetwork() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current!;
    const ctx = canvas.getContext("2d")!;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
    };

    resize();
    window.addEventListener("resize", resize);

    const mouse = { x: 0, y: 0 };

    /* =========================
       STATE (NEW)
    ========================= */
    let focusRegion: number | null = null;
    let zoom = 1;
    let targetZoom = 1;
    let offset = { x: 0, y: 0 };

    const activeLabels = [
      "Aerospace",
      "Astrophysics",
      "Cosmology",
      "Philosophy",
      "Pilot",
      "Propulsion",
      "Orbital Mechanics",
      "Quantum Gravity",
      "Aviation Systems",
      "Exoplanets",
      "Spaceflight",
      "Relativity",
      "Neuroscience",
      "Simulation",
      "Exploration",
    ];

    const TOTAL = 115;
    const REGION_COUNT = 15;

    const nodes: any[] = [];

    const center = () => ({
      x: canvas.width / 2,
      y: canvas.height / 2,
    });

    /* =========================
       INIT NODES
    ========================= */
    for (let i = 0; i < TOTAL; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = (Math.pow(Math.random(), 1.6) * 220 + 40) * 2.0;

      nodes.push({
        id: i,
        region: i % REGION_COUNT,
        angle,
        radius,
        x: center().x + Math.cos(angle) * radius,
        y: center().y + Math.sin(angle) * radius,
        vx: 0,
        vy: 0,
        active: i < 15,
        label: i < 15 ? activeLabels[i] : "",
        pulse: 0,
        activity: 0,
      });
    }

    const regions = Array.from({ length: REGION_COUNT });

    const signals: any[] = [];
    const waves: any[] = [];

    const spawnSignal = (a: any, b: any, bias = 1) => {
      signals.push({
        a,
        b,
        t: 0,
        speed: (0.012 + Math.random() * 0.016) * bias * 0.7,
      });
    };

    const spawnWave = (origin: any) => {
      waves.push({
        origin,
        radius: 0,
        speed: 1.6,
        max: 270,
      });
    };

    /* =========================
       INPUT
    ========================= */
    const onMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };

    const onClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const cx = center();

      /* find region clicked */
      for (let r = 0; r < REGION_COUNT; r++) {
        const nodesInR = nodes.filter((n) => n.region === r);
        if (!nodesInR.length) continue;

        const rx =
          nodesInR.reduce((s, n) => s + n.x, 0) / nodesInR.length;
        const ry =
          nodesInR.reduce((s, n) => s + n.y, 0) / nodesInR.length;

        const dist = Math.hypot(x - rx, y - ry);

        if (dist < 180) {
          focusRegion = r;
          targetZoom = 2.2;
          offset.x = cx.x - rx * 2.2;
          offset.y = cx.y - ry * 2.2;
          return;
        }
      }

      /* click outside → reset */
      focusRegion = null;
      targetZoom = 1;
      offset = { x: 0, y: 0 };
    };

    canvas.addEventListener("mousemove", onMove);
    canvas.addEventListener("click", onClick);

    /* =========================
       DRAW LOOP
    ========================= */
    const draw = () => {
      const c = center();

      /* smooth zoom */
      zoom += (targetZoom - zoom) * 0.08;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      /* =========================
         REGION CENTERS
      ========================= */
      const regionCenters = Array.from({ length: REGION_COUNT }).map(
        (_, r) => {
          const nodesR = nodes.filter((n) => n.region === r);
          return {
            r,
            x:
              nodesR.reduce((s, n) => s + n.x, 0) /
              (nodesR.length || 1),
            y:
              nodesR.reduce((s, n) => s + n.y, 0) /
              (nodesR.length || 1),
            nodes: nodesR,
          };
        }
      );

      /* =========================
         PHYSICS
      ========================= */
      for (const n of nodes) {
        const dx = mouse.x - n.x;
        const dy = mouse.y - n.y;

        const dist = Math.hypot(dx, dy);
        const influence = dist < 240 ? (1 - dist / 240) * 0.22 : 0;

        n.vx += dx * influence * 0.01;
        n.vy += dy * influence * 0.01;

        const ox = c.x + Math.cos(n.angle) * n.radius;
        const oy = c.y + Math.sin(n.angle) * n.radius;

        n.vx += (ox - n.x) * 0.015;
        n.vy += (oy - n.y) * 0.015;

        /* REGION CONSTRAINT (keeps nodes inside their region) */
        const r = regionCenters[n.region];
        const dxr = n.x - r.x;
        const dyr = n.y - r.y;
        const drr = Math.hypot(dxr, dyr);

        const maxR = 140;

        if (drr > maxR) {
          const f = (drr - maxR) * 0.02;
          n.vx -= (dxr / drr) * f;
          n.vy -= (dyr / drr) * f;
        }

        n.vx *= 0.92;
        n.vy *= 0.92;

        n.x += n.vx;
        n.y += n.vy;

        n.angle += 0.00055;

        if (n.active && dist < 160 && Math.random() < 0.03) {
          spawnWave(n);
        }
      }

      /* =========================
         REGION DRAW
      ========================= */
      for (const r of regionCenters) {
        const cx = r.x;
        const cy = r.y;

        const avg =
          r.nodes.reduce(
            (s, n) =>
              s + Math.hypot(n.x - cx, n.y - cy),
            0
          ) / (r.nodes.length || 1);

        const radius = avg + 40;

        ctx.beginPath();
        ctx.fillStyle = "rgba(255,0,60,0.04)";
        ctx.arc(cx, cy, radius, 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.strokeStyle = "rgba(255,140,140,0.25)";
        ctx.lineWidth = 2;
        ctx.arc(cx, cy, radius, 0, Math.PI * 2);
        ctx.stroke();
      }

      /* =========================
         LINKS (kNN unchanged)
      ========================= */
      const K = 4;

      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];

        const neighbors = nodes
          .filter((b) => b !== a)
          .map((b) => ({
            b,
            d: (a.x - b.x) ** 2 + (a.y - b.y) ** 2,
          }))
          .sort((a, b) => a.d - b.d)
          .slice(0, K);

        for (const { b } of neighbors) {
          ctx.strokeStyle = "rgba(76,201,240,0.08)";
          ctx.beginPath();
          ctx.moveTo(a.x * zoom + offset.x, a.y * zoom + offset.y);
          ctx.lineTo(b.x * zoom + offset.x, b.y * zoom + offset.y);
          ctx.stroke();
        }
      }

      /* =========================
         NODES (clickable focus aware)
      ========================= */
      for (const n of nodes) {
        const dx = mouse.x - n.x;
        const dy = mouse.y - n.y;
        const dist = Math.hypot(dx, dy);

        const near = dist < 110;
        const hover = dist < 28;

        let size = n.active ? 6 : 3;
        if (near) size *= 1.3;
        if (hover) size *= 2;

        ctx.beginPath();
        ctx.fillStyle = n.active
          ? "rgba(76,201,240,0.85)"
          : "rgba(255,255,255,0.35)";

        ctx.arc(
          n.x * zoom + offset.x,
          n.y * zoom + offset.y,
          size,
          0,
          Math.PI * 2
        );
        ctx.fill();

        if (focusRegion === n.region && n.active) {
          ctx.fillStyle = "white";
          ctx.fillText(
            n.label,
            n.x * zoom + offset.x + 8,
            n.y * zoom + offset.y + 4
          );
        }
      }

      requestAnimationFrame(draw);
    };

    draw();

    return () => {
      canvas.removeEventListener("mousemove", onMove);
      canvas.removeEventListener("click", onClick);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={ref} className="neural" />;
}