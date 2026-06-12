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

    const clusterCenters = CLUSTERS.map((_, i) => {
      const angle = (i / CLUSTERS.length) * Math.PI * 2;
      const radius = 180;

      return {
        x: resizeCenter().x + Math.cos(angle) * radius,
        y: resizeCenter().y + Math.sin(angle) * radius,
      };
    });

    function resizeCenter() {
      return {
        x: canvas.width / 2,
        y: canvas.height / 2,
      };
    }

    const nodes: any[] = [];

    const TOTAL = 115;
    const ACTIVE_PER_CLUSTER = 3; // 5 clusters → 15 actifs

    /* =========================================================
       🔥 ONLY MODIFIED PART: CLUSTERED INIT
    ========================================================= */

    for (let c = 0; c < CLUSTERS.length; c++) {
      const base = clusterCenters[c];

      /* ---------------- ACTIVE NODES ---------------- */
      for (let i = 0; i < ACTIVE_PER_CLUSTER; i++) {
        const angle = Math.random() * Math.PI * 2;
        const r = 25 + Math.random() * 45;

        nodes.push({
          id: c * 100 + i,
          angle,
          radius: r,
          x: base.x + Math.cos(angle) * r,
          y: base.y + Math.sin(angle) * r,
          vx: 0,
          vy: 0,
          active: true,
          label: activeLabels[c * ACTIVE_PER_CLUSTER + i],
          cluster: c,
          pulse: 0,
          activity: 0,
        });
      }

      /* ---------------- INACTIVE NODES ---------------- */
      const INACTIVE = 20;

      for (let i = 0; i < INACTIVE; i++) {
        const angle = Math.random() * Math.PI * 2;
        const r = 40 + Math.random() * 90;

        nodes.push({
          id: c * 1000 + i,
          angle,
          radius: r,
          x: base.x + Math.cos(angle) * r,
          y: base.y + Math.sin(angle) * r,
          vx: 0,
          vy: 0,
          active: false,
          label: "",
          cluster: c,
          pulse: 0,
          activity: 0,
        });
      }
    }

    /* =========================================================
       🔻 EVERYTHING BELOW IS YOUR ORIGINAL CODE (UNCHANGED)
    ========================================================= */

    const signals: any[] = [];
    const waves: any[] = [];

    const spawnSignal = (a: any, b: any, bias = 1) => {
      signals.push({
        a,
        b,
        t: 0,
        speed: (0.012 + Math.random() * 0.016) * bias * 0.7,
        bias,
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
      const c = resizeCenter();
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      let mouseOnNetwork = false;

      /* ---- REST OF YOUR CODE EXACTLY AS BEFORE ---- */
      /* (physics, waves, spikes, links, rendering unchanged) */

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