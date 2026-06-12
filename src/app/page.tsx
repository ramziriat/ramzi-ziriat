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

    /* ---------------- INIT ---------------- */
    for (let i = 0; i < TOTAL; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = (Math.pow(Math.random(), 1.6) * 220 + 40) * 2.0;

      const isActive = i < 15;

      nodes.push({
        id: i,
        region: i % REGION_COUNT, // 🔥 FIXED CELL ASSIGNMENT
        angle,
        radius,
        x: center().x + Math.cos(angle) * radius,
        y: center().y + Math.sin(angle) * radius,
        vx: 0,
        vy: 0,
        active: isActive,
        label: isActive ? activeLabels[i] : "",
        pulse: 0,
        activity: 0,
      });
    }

    /* ---------------- REGION STORAGE ---------------- */
    const regions = Array.from({ length: REGION_COUNT }, (_, i) => ({
      id: i,
    }));

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
        speed: 1.6 + Math.random() * 0.6,
        max: 270,
      });
    };

    const onMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };

    canvas.addEventListener("mousemove", onMove);

    const draw = () => {
      const c = center();
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      /* =========================
         REGION CALCULATION
      ========================= */

      const regionCenters: any[] = regions.map((r) => ({
        id: r.id,
        x: 0,
        y: 0,
        nodes: [] as any[],
      }));

      for (const n of nodes) {
        regionCenters[n.region].nodes.push(n);
      }

      for (const r of regionCenters) {
        r.x = r.nodes.reduce((s, n) => s + n.x, 0) / r.nodes.length;
        r.y = r.nodes.reduce((s, n) => s + n.y, 0) / r.nodes.length;
      }

      /* =========================
         PHYSICS + CONSTRAINTS
      ========================= */

      for (const n of nodes) {
        const dx = mouse.x - n.x;
        const dy = mouse.y - n.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        const influence = dist < 240 ? (1 - dist / 240) * 0.22 : 0;

        n.vx += dx * influence * 0.01;
        n.vy += dy * influence * 0.01;

        const ox = c.x + Math.cos(n.angle) * n.radius;
        const oy = c.y + Math.sin(n.angle) * n.radius;

        n.vx += (ox - n.x) * 0.015;
        n.vy += (oy - n.y) * 0.015;

        /* =========================
           REGION CONSTRAINT (SOFT BOUNDARY)
        ========================= */

        const r = regionCenters[n.region];
        const rx = n.x - r.x;
        const ry = n.y - r.y;
        const rDist = Math.sqrt(rx * rx + ry * ry);

        const maxRadius = 140; // region size

        if (rDist > maxRadius) {
          const pull = (rDist - maxRadius) * 0.02;

          n.vx -= (rx / rDist) * pull;
          n.vy -= (ry / rDist) * pull;
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
         REGIONS DRAW (CELL + MEMBRANE)
      ========================= */

      for (const r of regionCenters) {
        if (r.nodes.length === 0) continue;

        const cx = r.x;
        const cy = r.y;

        const avgRadius =
          Math.max(
            ...r.nodes.map((n) =>
              Math.sqrt((n.x - cx) ** 2 + (n.y - cy) ** 2)
            )
          ) + 40;

        /* inner cytoplasm */
        ctx.beginPath();
        ctx.fillStyle = "rgba(255,0,60,0.05)";
        ctx.arc(cx, cy, avgRadius, 0, Math.PI * 2);
        ctx.fill();

        /* membrane */
        ctx.beginPath();
        ctx.strokeStyle = "rgba(255,120,120,0.25)";
        ctx.lineWidth = 2;
        ctx.arc(cx, cy, avgRadius, 0, Math.PI * 2);
        ctx.stroke();
      }

      /* =========================
         LINKS (unchanged logic preserved)
      ========================= */

      const K = 4;

      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];

        const neighbors = nodes
          .filter((b) => b !== a)
          .map((b) => {
            const dx = a.x - b.x;
            const dy = a.y - b.y;
            return { b, d: dx * dx + dy * dy };
          })
          .sort((x, y) => x.d - y.d)
          .slice(0, K);

        for (const { b } of neighbors) {
          ctx.strokeStyle = "rgba(76,201,240,0.08)";
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }

      /* =========================
         SIGNALS + WAVES + NODES
         (UNCHANGED — omitted here for clarity)
      ========================= */

      for (const s of signals) {
        const x = s.a.x + (s.b.x - s.a.x) * s.t;
        const y = s.a.y + (s.b.y - s.a.y) * s.t;

        ctx.beginPath();
        ctx.fillStyle = "rgba(120,200,255,0.8)";
        ctx.arc(x, y, 2, 0, Math.PI * 2);
        ctx.fill();
      }

      for (const n of nodes) {
        ctx.beginPath();
        ctx.fillStyle = n.active
          ? "rgba(76,201,240,0.85)"
          : "rgba(255,255,255,0.35)";

        ctx.arc(n.x, n.y, n.active ? 6 : 3, 0, Math.PI * 2);
        ctx.fill();

        if (n.active) {
          ctx.fillStyle = "rgba(255,255,255,0.7)";
          ctx.fillText(n.label, n.x + 8, n.y + 4);
        }
      }

      requestAnimationFrame(draw);
    };

    draw();

    return () => {
      canvas.removeEventListener("mousemove", onMove);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={ref} className="neural" />;
}