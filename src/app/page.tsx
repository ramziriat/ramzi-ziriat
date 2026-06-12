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

    /* ---------------- DOMAINS (5 ZONES CÉRÉBRALES) ---------------- */
    const clusters = [
      {
        name: "Cosmology",
        active: ["CMB", "Dark Matter", "Dark Energy", "Inflation"],
      },
      {
        name: "Astrophysics",
        active: ["Pulsars", "Microlensing", "Spectroscopy"],
      },
      {
        name: "Pilot",
        active: ["IFR", "Navigation", "Flight Control"],
      },
      {
        name: "Aerospace",
        active: ["Propulsion", "Avionics", "Flight Dynamics"],
      },
      {
        name: "Philosophy",
        active: ["Epistemology", "Observation", "Uncertainty"],
      },
    ];

    const TOTAL_ACTIVE = 20;
    const TOTAL_INACTIVE = 200;
    const TOTAL = TOTAL_ACTIVE + TOTAL_INACTIVE;

    const nodes: any[] = [];

    const center = () => ({
      x: canvas.width / 2,
      y: canvas.height / 2,
    });

    /* ---------------- REDUCED RADIUS (IMPORTANT FIX) ---------------- */
    const BASE_RADIUS = Math.min(canvas.width, canvas.height) * 0.18;

    /* ---------------- INIT ---------------- */
    for (let i = 0; i < TOTAL; i++) {
      const isActive = i < TOTAL_ACTIVE;

      const clusterId = isActive
        ? i % clusters.length
        : Math.floor(Math.random() * clusters.length);

      const cluster = clusters[clusterId];

      const angle = Math.random() * Math.PI * 2;

      // 🔻 RÉSEAU PLUS COMPACT
      const radius =
        (Math.pow(Math.random(), 1.4) * BASE_RADIUS + clusterId * 12) * 2.0;

      const label =
        isActive
          ? cluster.active[i % cluster.active.length]
          : "";

      nodes.push({
        id: i,
        active: isActive,
        clusterId,
        clusterName: cluster.name,
        label,
        angle,
        radius,
        x: 0,
        y: 0,
        vx: 0,
        vy: 0,
        pulse: 0,
        activity: 0,
      });
    }

    /* ---------------- PLACE INIT ---------------- */
    const c = center();
    for (const n of nodes) {
      n.x = c.x + Math.cos(n.angle) * n.radius;
      n.y = c.y + Math.sin(n.angle) * n.radius;
    }

    /* ---------------- KNN LINKS ---------------- */
    const K = 4;
    const links: Map<number, number[]> = new Map();

    for (let i = 0; i < nodes.length; i++) {
      const a = nodes[i];

      const neighbors = nodes
        .filter((b) => b !== a)
        .map((b, j) => {
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          return { j, d: dx * dx + dy * dy };
        })
        .sort((x, y) => x.d - y.d)
        .slice(0, K)
        .map((n) => n.j);

      links.set(i, neighbors);
    }

    /* ---------------- SYSTEMS ---------------- */
    const signals: any[] = [];
    const waves: any[] = [];

    const spawnSignal = (a: any, b: any) => {
      signals.push({
        a,
        b,
        t: 0,
        speed: 0.012 + Math.random() * 0.014,
      });
    };

    const spawnWave = (origin: any) => {
      waves.push({
        origin,
        radius: 0,
        speed: 1.2,
        max: 240,
      });
    };

    /* ---------------- MOUSE ---------------- */
    const onMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };

    canvas.addEventListener("mousemove", onMove);

    const draw = () => {
      const c = center();
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      let mouseOnNetwork = false;

      /* ---------------- PHYSICS ---------------- */
      for (const n of nodes) {
        const dx = mouse.x - n.x;
        const dy = mouse.y - n.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 220) mouseOnNetwork = true;

        const influence = dist < 200 ? (1 - dist / 200) * 0.18 : 0;

        n.vx += dx * influence * 0.01;
        n.vy += dy * influence * 0.01;

        // orbit stable
        const ox = c.x + Math.cos(n.angle) * n.radius;
        const oy = c.y + Math.sin(n.angle) * n.radius;

        n.vx += (ox - n.x) * 0.02;
        n.vy += (oy - n.y) * 0.02;

        n.vx *= 0.9;
        n.vy *= 0.9;

        n.x += n.vx;
        n.y += n.vy;

        n.angle += 0.00045;

        if (n.active && dist < 120 && Math.random() < 0.015) {
          spawnWave(n);
        }
      }

      /* ---------------- SPIKES (LINK-ONLY) ---------------- */
      if (Math.random() < 0.007) {
        const i = Math.floor(Math.random() * nodes.length);
        const j = links.get(i)![
          Math.floor(Math.random() * links.get(i)!.length)
        ];
        spawnSignal(nodes[i], nodes[j]);
      }

      if (mouseOnNetwork && Math.random() < 0.018) {
        const i = Math.floor(Math.random() * nodes.length);
        const j = links.get(i)![
          Math.floor(Math.random() * links.get(i)!.length)
        ];
        spawnSignal(nodes[i], nodes[j]);
      }

      /* ---------------- LINKS ---------------- */
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        const neighbors = links.get(i)!;

        for (const j of neighbors) {
          const b = nodes[j];

          const dx = a.x - b.x;
          const dy = a.y - b.y;

          ctx.strokeStyle = "rgba(76,201,240,0.06)";
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }

      /* ---------------- SIGNALS ---------------- */
      for (const s of signals) {
        const x = s.a.x + (s.b.x - s.a.x) * s.t;
        const y = s.a.y + (s.b.y - s.a.y) * s.t;

        ctx.beginPath();
        ctx.fillStyle = "rgba(120,200,255,0.75)";
        ctx.arc(x, y, 2, 0, Math.PI * 2);
        ctx.fill();
      }

      /* ---------------- NODES ---------------- */
      for (const n of nodes) {
        const dx = mouse.x - n.x;
        const dy = mouse.y - n.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        const near = dist < 100;
        const hover = dist < 26;

        let size = n.active ? 6 : 3;

        if (near) size *= 1.25;
        if (hover) size *= 2;

        ctx.beginPath();
        ctx.fillStyle = n.active
          ? "rgba(76,201,240,0.9)"
          : "rgba(255,255,255,0.3)";

        ctx.arc(n.x, n.y, size, 0, Math.PI * 2);
        ctx.fill();

        if (n.active && near) {
          ctx.fillStyle = hover ? "white" : "rgba(255,255,255,0.7)";
          ctx.font = "11px system-ui";
          ctx.fillText(n.label, n.x + 8, n.y + 4);
        }
      }

      requestAnimationFrame(draw);
    };

    draw();

    return () => canvas.removeEventListener("mousemove", onMove);
  }, []);

  return <canvas ref={ref} className="neural" />;
}