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
const activeNodes = [
  "Aerospace",
  "Astrophysics",
  "Cosmology",
  "Philosophy",
  "Pilot training",
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

  /* ---------------- FLIGHT HOURS (SMOOTH EASING) ---------------- */
  const [flightHours, setFlightHours] = useState(0);

  useEffect(() => {
    const target = 42;
    const start = performance.now();

    const animate = (t: number) => {
      const p = clamp((t - start) / 2500, 0, 1);

      // ease: fast start, slow end
      const eased = 1 - Math.pow(1 - p, 4);

      setFlightHours(Math.floor(eased * target));

      if (p < 1) requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
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
        <section className="section">
          <h1>RAMZI ZIRIAT</h1>

          <div className="bigMetric">
            <h2>{flightHours}h</h2>
            <p>FLIGHT EXPERIENCE</p>
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
    ];

    const TOTAL = 55; // +30 inactive added

    const nodes: any[] = [];

    const center = () => ({
      x: canvas.width / 2,
      y: canvas.height / 2,
    });

    /* ---------------- GENERATION (DENSE + CENTER ALLOWED) ---------------- */
    for (let i = 0; i < TOTAL; i++) {
      const angle = Math.random() * Math.PI * 2;

      // compact distribution INCLUDING center proximity
      const radius =
        Math.pow(Math.random(), 1.6) * 220 + 40;

      const isActive = i < 5;

      nodes.push({
        angle,
        radius,
        baseRadius: radius,
        x: 0,
        y: 0,
        vx: 0,
        vy: 0,
        active: isActive,
        label: isActive ? activeLabels[i] : "",
      });
    }

    const onMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };

    canvas.addEventListener("mousemove", onMove);

    const draw = () => {
      const c = center();

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      /* ---------------- UPDATE PHYSICS ---------------- */
      for (const n of nodes) {
        const dx = mouse.x - n.x;
        const dy = mouse.y - n.y;

        const dist = Math.sqrt(dx * dx + dy * dy);

        /* ---------------- CLUSTER INFLUENCE ---------------- */
        const influence = dist < 220 ? (1 - dist / 220) : 0;

        // soft attraction (cluster effect)
        n.vx += dx * influence * 0.012;
        n.vy += dy * influence * 0.012;

        /* ---------------- SLIGHT LIVING DRIFT ---------------- */
        const driftX = Math.sin(n.angle + Date.now() * 0.0002) * 0.05;
        const driftY = Math.cos(n.angle + Date.now() * 0.0002) * 0.05;

        n.vx += driftX;
        n.vy += driftY;

        /* ---------------- ORBIT ---------------- */
        const ox = c.x + Math.cos(n.angle) * n.radius;
        const oy = c.y + Math.sin(n.angle) * n.radius;

        n.vx += (ox - n.x) * 0.018;
        n.vy += (oy - n.y) * 0.018;

        n.vx *= 0.92;
        n.vy *= 0.92;

        n.x += n.vx;
        n.y += n.vy;

        n.angle += 0.0006;
      }

      /* ---------------- LINKS (ELASTIC FEEL) ---------------- */
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i];
          const b = nodes[j];

          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d = Math.sqrt(dx * dx + dy * dy);

          if (d < 170) {
            const alpha = 0.08 * (1 - d / 170);

            ctx.strokeStyle = `rgba(76,201,240,${alpha})`;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);

            // slight curve = living network feel
            const mx = (a.x + b.x) / 2 + Math.sin(d * 0.01) * 4;
            const my = (a.y + b.y) / 2 + Math.cos(d * 0.01) * 4;

            ctx.quadraticCurveTo(mx, my, b.x, b.y);
            ctx.stroke();
          }
        }
      }

      /* ---------------- NODES ---------------- */
      for (const n of nodes) {
        const dx = mouse.x - n.x;
        const dy = mouse.y - n.y;

        const dist = Math.sqrt(dx * dx + dy * dy);

        const near = dist < 90;
        const hover = dist < 25;

        /* ---------------- SCALE SYSTEM ---------------- */
        let size = n.active ? 6 : 3;

        if (near) size *= 1.6;
        if (hover) size *= 2.2;

        /* ---------------- DRAW NODE ---------------- */
        ctx.beginPath();

        ctx.fillStyle = n.active
          ? "#4cc9f0"
          : "rgba(255,255,255,0.25)";

        ctx.arc(n.x, n.y, size, 0, Math.PI * 2);
        ctx.fill();

        /* ---------------- LABEL SYSTEM ---------------- */
        if (n.active && near) {
          ctx.fillStyle = hover
            ? "white"
            : "rgba(255,255,255,0.7)";

          ctx.font = hover ? "14px system-ui" : "11px system-ui";
          ctx.fillText(n.label, n.x + 10, n.y + 4);
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