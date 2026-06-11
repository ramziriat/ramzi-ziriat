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

    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);

    const center = { x: w / 2, y: h / 2 };
    const mouse = { x: w / 2, y: h / 2 };

    const totalNodes = 25;

    const activeLabels = [
      "Aerospace",
      "Astrophysics",
      "Cosmology",
      "Philosophy",
      "Pilot",
    ];

    const nodes: any[] = [];

    /* ---------------- ORBITAL RANDOM STRUCTURE ---------------- */
    for (let i = 0; i < totalNodes; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 150 + Math.random() * 100; // NOT PERFECT CIRCLE

      const isActive = i < 5;

      nodes.push({
        angle,
        radius,
        baseRadius: radius,
        x: center.x + Math.cos(angle) * radius,
        y: center.y + Math.sin(angle) * radius,
        vx: 0,
        vy: 0,
        active: isActive,
        label: isActive ? activeLabels[i] : "",
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, w, h);

      /* ---------------- UPDATE CENTER (VERY STABLE) ---------------- */
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];

        const dxm = mouse.x - n.x;
        const dym = mouse.y - n.y;

        const distMouse = Math.sqrt(dxm * dxm + dym * dym);

        /* ---------------- VERY SOFT DIRECTIONAL INFLUENCE ---------------- */
        const dirX = dxm / (distMouse || 1);
        const dirY = dym / (distMouse || 1);

        // only if close enough
        const influence = distMouse < 250 ? (1 - distMouse / 250) : 0;

        // IMPORTANT: asymmetry based on position relative to center
        const fromCenterX = (n.x - center.x) / w;

        const sideFactor = 0.90;

        // movement is subtle, not destabilizing orbit
        n.vx += dirX * influence * 0.25 * sideFactor;
        n.vy += dirY * influence * 0.25 * sideFactor;

        /* ---------------- ORBIT STABILITY ---------------- */
        const ox = center.x + Math.cos(n.angle) * n.radius * 1.15;
        const oy = center.y + Math.sin(n.angle) * n.radius * 1.15;

        n.vx += (ox - n.x) * 0.01;
        n.vy += (oy - n.y) * 0.01;

        n.vx *= 0.92;
        n.vy *= 0.92;

        n.x += n.vx;
        n.y += n.vy;

        // slow orbital drift (organic motion)
        n.angle += 0.0008;
      }

      /* ---------------- LINKS ---------------- */
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i];
          const b = nodes[j];

          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d = Math.sqrt(dx * dx + dy * dy);

          if (d < 160) {
            ctx.strokeStyle = "rgba(76,201,240,0.06)";
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      /* ---------------- NODES ---------------- */
      for (const n of nodes) {
        const dx = mouse.x - n.x;
        const dy = mouse.y - n.y;
        const d = Math.sqrt(dx * dx + dy * dy);

        const isNear = d < 120;

        const baseSize = n.active ? 6 : 3;
        const size = isNear ? baseSize * 1.6 : baseSize;

        ctx.beginPath();

        if (n.active) {
          ctx.fillStyle = "#4cc9f0";
        } else {
          ctx.fillStyle = "rgba(255,255,255,0.25)";
        }

        ctx.arc(n.x, n.y, size, 0, Math.PI * 2);
        ctx.fill();

        /* ---------------- TEXT ONLY ACTIVE ---------------- */
        if (n.active && isNear) {
          ctx.fillStyle = "rgba(255,255,255,0.9)";
          ctx.font = "12px system-ui";
          ctx.fillText(n.label, n.x + 10, n.y);
        }
      }

      requestAnimationFrame(draw);
    };

    window.addEventListener("mousemove", (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });

    draw();
  }, []);

  return <canvas className="neural" ref={ref} />;
}