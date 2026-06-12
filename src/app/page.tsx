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

    /* ---------------- ACTIVE LABELS ---------------- */
    const activeLabels = [
      "Orbital Mechanics",
      "Propulsion",
      "Aircraft Systems",
      "Astrophysics",
      "Cosmology",
      "Black Holes",
      "Dark Matter",
      "Expansion",
      "Epistemology",
      "Logic",
      "Ontology",
      "Pilot Training",
      "Navigation",
      "Aerodynamics",
      "Flight Systems",
    ];

    const CLUSTERS = [
      "Aerospace",
      "Astrophysics",
      "Cosmology",
      "Philosophy",
      "Pilot",
    ];

    const resizeCenter = () => ({
      x: canvas.width / 2,
      y: canvas.height / 2,
    });

    const clusterCenters = CLUSTERS.map((_, i) => {
      const angle = (i / CLUSTERS.length) * Math.PI * 2;
      const radius = 220; // léger agrandissement réseau

      return {
        x: resizeCenter().x + Math.cos(angle) * radius,
        y: resizeCenter().y + Math.sin(angle) * radius,
      };
    });

    const nodes: any[] = [];

    const TOTAL = 165;
    const ACTIVE_PER_CLUSTER = 3; // 15 actifs total

    /* =========================================================
       FIX IMPORTANT : DÉMARRAGE STABLE (NO COLLAPSE)
    ========================================================= */

    for (let c = 0; c < CLUSTERS.length; c++) {
      const base = clusterCenters[c];

      for (let i = 0; i < ACTIVE_PER_CLUSTER; i++) {
        const angle = Math.random() * Math.PI * 2;
        const r = 35 + Math.random() * 60;

        nodes.push({
          id: c * 100 + i,
          angle,
          radius: r,
          x: base.x + Math.cos(angle) * r,
          y: base.y + Math.sin(angle) * r,
          vx: (Math.random() - 0.5) * 0.2, // 🔥 anti-collapse
          vy: (Math.random() - 0.5) * 0.2,
          active: true,
          label: activeLabels[c * ACTIVE_PER_CLUSTER + i],
          cluster: c,
          pulse: 0,
          activity: 0,
        });
      }

      const INACTIVE = 30; // + dense, demandé 150 total global

      for (let i = 0; i < INACTIVE; i++) {
        const angle = Math.random() * Math.PI * 2;
        const r = 60 + Math.random() * 120;

        nodes.push({
          id: c * 1000 + i,
          angle,
          radius: r,
          x: base.x + Math.cos(angle) * r,
          y: base.y + Math.sin(angle) * r,
          vx: (Math.random() - 0.5) * 0.2, // 🔥 important
          vy: (Math.random() - 0.5) * 0.2,
          active: false,
          label: "",
          cluster: c,
          pulse: 0,
          activity: 0,
        });
      }
    }

    const signals: any[] = [];
    const waves: any[] = [];

    const spawnSignal = (a: any, b: any, bias = 1) => {
      signals.push({
        a,
        b,
        t: 0,
        speed: (0.010 + Math.random() * 0.014) * bias * 0.7, // 🔻 slower
        bias,
      });
    };

    const spawnWave = (origin: any) => {
      waves.push({
        origin,
        radius: 0,
        speed: 1.1 + Math.random() * 0.4, // 🔻 reduced wave speed
        max: 240,
      });
    };

    const onMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };

    canvas.addEventListener("mousemove", onMove);

    const draw = () => {
      const c = resizeCenter();
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      let mouseOnNetwork = false;

      for (const n of nodes) {
        const dx = mouse.x - n.x;
        const dy = mouse.y - n.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 260) mouseOnNetwork = true;

        /* =========================================================
           FIX IMPORTANT : FORCE PLUS FAIBLE + STABLE INIT
        ========================================================= */

        const influence = dist < 240 ? (1 - dist / 240) * 0.12 : 0; // 🔻 reduced

        n.vx += dx * influence * 0.006;
        n.vy += dy * influence * 0.006;

        const ox = c.x + Math.cos(n.angle) * n.radius;
        const oy = c.y + Math.sin(n.angle) * n.radius;

        n.vx += (ox - n.x) * 0.008; // 🔻 softer anchor (IMPORTANT FIX)
        n.vy += (oy - n.y) * 0.008;

        n.vx *= 0.94; // 🔻 more damping
        n.vy *= 0.94;

        n.x += n.vx;
        n.y += n.vy;

        n.angle += 0.00035;

        if (n.active && dist < 160 && Math.random() < 0.02) {
          spawnWave(n);
        }
      }

      /* ---------------- SPIKES REDUCED ---------------- */
      if (Math.random() < 0.008) {
        const a = nodes[Math.floor(Math.random() * nodes.length)];
        const b = nodes[Math.floor(Math.random() * nodes.length)];
        if (a !== b) spawnSignal(a, b);
      }

      if (mouseOnNetwork && Math.random() < 0.02) {
        const a = nodes[Math.floor(Math.random() * nodes.length)];
        const b = nodes[Math.floor(Math.random() * nodes.length)];
        if (a !== b) spawnSignal(a, b);
      }

      /* ---------------- WAVE UPDATE ---------------- */
      for (let i = waves.length - 1; i >= 0; i--) {
        const w = waves[i];
        w.radius += w.speed;
        if (w.radius > w.max) waves.splice(i, 1);
      }

      /* ---------------- LINKS (UNCHANGED LOGIC) ---------------- */
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i];
          const b = nodes[j];

          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d = Math.sqrt(dx * dx + dy * dy);

          if (d < 190) {
            ctx.strokeStyle = "rgba(76,201,240,0.08)";
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      /* ---------------- SIGNALS ---------------- */
      for (const s of signals) {
        const x = s.a.x + (s.b.x - s.a.x) * s.t;
        const y = s.a.y + (s.b.y - s.a.y) * s.t;

        ctx.beginPath();
        ctx.fillStyle = "rgba(120,200,255,0.7)";
        ctx.arc(x, y, 2, 0, Math.PI * 2);
        ctx.fill();

        s.t += s.speed;
      }

      /* ---------------- NODES ---------------- */
      for (const n of nodes) {
        const dx = mouse.x - n.x;
        const dy = mouse.y - n.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        const near = dist < 110;
        const hover = dist < 28;

        let size = n.active ? 6 : 3;

        if (near) size *= 1.2;
        if (hover) size *= 1.7;

        ctx.beginPath();
        ctx.fillStyle = n.active
          ? "#4cc9f0"
          : "rgba(255,255,255,0.28)";

        ctx.arc(n.x, n.y, size, 0, Math.PI * 2);
        ctx.fill();

        if (n.active && near) {
          ctx.fillStyle = "rgba(255,255,255,0.75)";
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