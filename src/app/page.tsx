"use client";

import { useEffect, useRef, useState } from "react";

/* ---------------- MISSION DATA ---------------- */
const missions = [
  { year: 2001, title: "Birth", desc: "System initialization", status: "DONE" },
  { year: 2008, title: "Early curiosity", desc: "First scientific structuring", status: "DONE" },
  { year: 2012, title: "Cognitive modeling", desc: "Formal system thinking", status: "DONE" },
  { year: 2015, title: "Aviation exploration", desc: "Flight systems trajectory", status: "DONE" },
  { year: 2019, title: "Cosmology research", desc: "Astrophysics foundations", status: "DONE" },
  { year: 2023, title: "Aerospace systems", desc: "Trajectory simulation phase", status: "DONE" },
  { year: 2026, title: "Research phase", desc: "Astrophysics + Cosmology + Philosophy", status: "ACTIVE" },
  { year: 2028, title: "Engineering M2", desc: "Aerospace integration", status: "PLANNED" },
  { year: 2035, title: "Unified exploration doctrine", desc: "System synthesis", status: "FUTURE" },
];

/* ---------------- HOME ---------------- */
export default function Home() {
  const [page, setPage] = useState(0);
  const [hover, setHover] = useState<number | null>(null);
  const [boot, setBoot] = useState(true);
  const [utc, setUtc] = useState("");

  /* ---------------- BOOT ---------------- */
  useEffect(() => {
    const t = setTimeout(() => setBoot(false), 2500);
    return () => clearTimeout(t);
  }, []);

  /* ---------------- UTC CLOCK ---------------- */
  useEffect(() => {
    const update = () => setUtc(new Date().toUTCString());
    update();
    const i = setInterval(update, 1000);
    return () => clearInterval(i);
  }, []);

  /* ---------------- NAVIGATION ---------------- */
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
        <div>{utc}</div>
      </header>

      {/* NAME (clean overlay instead of big metric) */}
      <div className="heroName">
        RAMZI ZIRIAT
      </div>

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
      <div
        className="viewport"
        style={{ transform: `translateY(-${page * 100}vh)` }}
      >

        {/* ---------------- PAGE 1 ---------------- */}
        <section className="section center">
          <NeuralNetwork />
        </section>

        {/* ---------------- PAGE 2 TIMELINE ---------------- */}
        <section className="section">
          <h2>VISION TIMELINE</h2>

          <div className="timelineV2">
            <div className="timelineLine" />

            {missions.map((m, i) => (
              <div
                key={i}
                className="timelineItem"
                onMouseEnter={() => setHover(i)}
                onMouseLeave={() => setHover(null)}
              >
                <div className="timelineLeft">
                  <div className="year">{m.year}</div>
                  <div className={`status ${m.status.toLowerCase()}`}>
                    {m.status}
                  </div>
                </div>

                <div className="timelineDot" />

                <div className="timelineRight">
                  <h3>{m.title}</h3>
                  <p>{m.desc}</p>
                </div>

                {hover === i && <div className="timelineGlow" />}
              </div>
            ))}
          </div>
        </section>

        {/* ---------------- PAGE 3 ---------------- */}
        <section className="section">
          <h2>FLIGHT LAB</h2>

          <div className="labGrid">
            <div className="panel">Flight Model</div>
            <div className="panel">Astro Module</div>
            <div className="panel">Propulsion</div>
            <div className="panel">Simulation</div>
          </div>
        </section>

        {/* ---------------- PAGE 4 ---------------- */}
        <section className="section">
          <h2>EXPLORATION MAP</h2>

          <iframe
            className="map"
            src="https://www.openstreetmap.org/export/embed.html"
          />
        </section>

        {/* ---------------- PAGE 5 ---------------- */}
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

/* ---------------- NEURAL NETWORK (UNCHANGED CORE) ---------------- */
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
    const TOTAL = 55;
    const nodes: any[] = [];

    const center = () => ({
      x: canvas.width / 2,
      y: canvas.height / 2,
    });

    const labels = [
      "Aerospace",
      "Astrophysics",
      "Cosmology",
      "Philosophy",
      "Pilot",
    ];

    for (let i = 0; i < TOTAL; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = (Math.pow(Math.random(), 1.6) * 220 + 40) * 2.0;

      nodes.push({
        angle,
        radius,
        x: 0,
        y: 0,
        vx: 0,
        vy: 0,
        active: i < 5,
        label: i < 5 ? labels[i] : "",
        pulse: 0,
      });
    }

    const signals: any[] = [];
    const waves: any[] = [];

    const spawnWave = (origin: any) => {
      waves.push({
        origin,
        radius: 0,
        speed: 1.7,
        max: 270,
      });
    };

    canvas.addEventListener("mousemove", (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    });

    const draw = () => {
      const c = center();
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const n of nodes) {
        const ox = c.x + Math.cos(n.angle) * n.radius;
        const oy = c.y + Math.sin(n.angle) * n.radius;

        const dx = mouse.x - n.x;
        const dy = mouse.y - n.y;

        n.vx += dx * 0.0008;
        n.vy += dy * 0.0008;

        n.vx += (ox - n.x) * 0.015;
        n.vy += (oy - n.y) * 0.015;

        n.vx *= 0.92;
        n.vy *= 0.92;

        n.x += n.vx;
        n.y += n.vy;

        n.angle += 0.0005;

        if (n.active && Math.random() < 0.02) spawnWave(n);
      }

      for (const n of nodes) {
        ctx.beginPath();
        ctx.fillStyle = n.active ? "#4cc9f0" : "rgba(255,255,255,0.3)";
        ctx.arc(n.x, n.y, n.active ? 6 : 3, 0, Math.PI * 2);
        ctx.fill();

        if (n.active) {
          ctx.fillStyle = "white";
          ctx.fillText(n.label, n.x + 10, n.y);
        }
      }

      requestAnimationFrame(draw);
    };

    draw();
  }, []);

  return <canvas ref={ref} className="neural" />;
}