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

    /* ---------------- CLUSTERS ---------------- */
    const clusters = [
      "Cosmology",
      "Astrophysics",
      "Pilot",
      "Aerospace",
      "Philosophy",
    ];

    const TOTAL_ACTIVE = 20;
    const TOTAL_INACTIVE = 200;
    const TOTAL = TOTAL_ACTIVE + TOTAL_INACTIVE;

    const nodes: any[] = [];

    const center = () => ({
      x: canvas.width / 2,
      y: canvas.height / 2,
    });

    /* ---------------- INIT NODES ---------------- */
    for (let i = 0; i < TOTAL; i++) {
      const isActive = i < TOTAL_ACTIVE;

      const clusterId = isActive
        ? i % clusters.length
        : Math.floor(Math.random() * clusters.length);

      const angle = Math.random() * Math.PI * 2;

      // clusters légèrement séparés mais overlap naturel
      const baseRadius = 180 + clusterId * 25;
      const radius =
        (Math.pow(Math.random(), 1.6) * 140 + baseRadius) * 2.0;

      nodes.push({
        id: i,
        active: isActive,
        clusterId,
        label: isActive ? clusters[clusterId] : "",
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

    /* ---------------- PLACE INITIAL ---------------- */
    const c = center();
    for (const n of nodes) {
      n.x = c.x + Math.cos(n.angle) * n.radius;
      n.y = c.y + Math.sin(n.angle) * n.radius;
    }

    /* ---------------- KNN LINKS (FIXED GRAPH) ---------------- */
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

    const spawnSignal = (a: any, b: any, bias = 1) => {
      signals.push({
        a,
        b,
        t: 0,
        speed: (0.012 + Math.random() * 0.016) * 0.7,
        bias,
      });
    };

    const spawnWave = (origin: any) => {
      waves.push({
        origin,
        radius: 0,
        speed: 1.4 + Math.random() * 0.4,
        max: 260,
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

        if (dist < 280) mouseOnNetwork = true;

        const influence = dist < 260 ? (1 - dist / 260) * 0.18 : 0;

        n.vx += dx * influence * 0.01;
        n.vy += dy * influence * 0.01;

        const ox = c.x + Math.cos(n.angle) * n.radius;
        const oy = c.y + Math.sin(n.angle) * n.radius;

        n.vx += (ox - n.x) * 0.015;
        n.vy += (oy - n.y) * 0.015;

        n.vx *= 0.92;
        n.vy *= 0.92;

        n.x += n.vx;
        n.y += n.vy;

        n.angle += 0.0005;

        if (n.active && dist < 140 && Math.random() < 0.02) {
          spawnWave(n);
        }
      }

      /* ---------------- SPIKES (ONLY ON LINKS) ---------------- */
      if (Math.random() < 0.008) {
        const i = Math.floor(Math.random() * nodes.length);
        const neighbors = links.get(i)!;

        if (neighbors.length > 0) {
          const j = neighbors[Math.floor(Math.random() * neighbors.length)];
          spawnSignal(nodes[i], nodes[j], 1);
        }
      }

      if (mouseOnNetwork && Math.random() < 0.02) {
        const i = Math.floor(Math.random() * nodes.length);
        const neighbors = links.get(i)!;

        const j = neighbors[Math.floor(Math.random() * neighbors.length)];
        spawnSignal(nodes[i], nodes[j], 1.1);
      }

      for (const n of nodes) {
        const dx = mouse.x - n.x;
        const dy = mouse.y - n.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 28 && Math.random() < 0.05) {
          const neighbors = links.get(n.id)!;
          const j = neighbors[Math.floor(Math.random() * neighbors.length)];
          spawnSignal(n, nodes[j], n.active ? 1.2 : 1);
        }
      }

      /* ---------------- UPDATE SIGNALS ---------------- */
      for (let i = signals.length - 1; i >= 0; i--) {
        const s = signals[i];
        s.t += s.speed;
        if (s.t >= 1) signals.splice(i, 1);
      }

      /* ---------------- UPDATE WAVES ---------------- */
      for (let i = waves.length - 1; i >= 0; i--) {
        const w = waves[i];
        w.radius += w.speed;
        if (w.radius > w.max) waves.splice(i, 1);
      }

      /* ---------------- WAVE EFFECT ---------------- */
      for (const w of waves) {
        for (const n of nodes) {
          const dx = n.x - w.origin.x;
          const dy = n.y - w.origin.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const diff = Math.abs(dist - w.radius);

          if (diff < 20) {
            const pulse = (1 - diff / 20) * 0.25;

            n.vx += (dx / (dist || 1)) * pulse * 0.08;
            n.vy += (dy / (dist || 1)) * pulse * 0.08;

            n.pulse = Math.min(1, n.pulse + pulse);
            n.activity = Math.min(1, n.activity + pulse);
          }
        }
      }

      /* ---------------- LINKS DRAW ---------------- */
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        const neighbors = links.get(i)!;

        for (const j of neighbors) {
          const b = nodes[j];

          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d = Math.sqrt(dx * dx + dy * dy);

          ctx.strokeStyle = `rgba(76,201,240,${0.07})`;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }

      /* ---------------- NODES ---------------- */
      for (const n of nodes) {
        const dx = mouse.x - n.x;
        const dy = mouse.y - n.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        const near = dist < 120;
        const hover = dist < 28;

        let size = n.active ? 6 : 3;

        size *= 1 + n.pulse * 0.5;
        if (near) size *= 1.3;
        if (hover) size *= 2;

        n.pulse *= 0.9;
        n.activity *= 0.9;

        ctx.beginPath();
        ctx.fillStyle = n.active
          ? `rgba(76,201,240,${0.9})`
          : `rgba(255,255,255,0.35)`;

        ctx.arc(n.x, n.y, size, 0, Math.PI * 2);
        ctx.fill();

        if (n.active && near) {
          ctx.fillStyle = hover ? "white" : "rgba(255,255,255,0.7)";
          ctx.font = hover ? "14px system-ui" : "11px system-ui";
          ctx.fillText(n.label, n.x + 10, n.y + 4);
        }
      }

      requestAnimationFrame(draw);
    };

    draw();

    return () => canvas.removeEventListener("mousemove", onMove);
  }, []);

  return <canvas ref={ref} className="neural" />;
}