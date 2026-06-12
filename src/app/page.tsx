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

    /* ---------------- DOMAINS ---------------- */
    const domains = [
      {
        name: "cosmology",
        color: "rgba(120,180,255,0.9)",
        centerBias: 0.9,
      },
      {
        name: "astrophysics",
        color: "rgba(80,160,255,0.9)",
        centerBias: 0.8,
      },
      {
        name: "pilot",
        color: "rgba(60,140,255,0.9)",
        centerBias: 0.7,
      },
      {
        name: "aerospace",
        color: "rgba(40,120,255,0.9)",
        centerBias: 0.85,
      },
      {
        name: "philosophy",
        color: "rgba(160,200,255,0.9)",
        centerBias: 0.75,
      },
    ];

    const ACTIVE_PER_DOMAIN = 4;
    const INACTIVE_TOTAL = 200;

    const nodes: any[] = [];

    const center = () => ({
      x: canvas.width / 2,
      y: canvas.height / 2,
    });

    /* ---------------- CREATE CLUSTERED ACTIVE NODES ---------------- */
    domains.forEach((d, di) => {
      for (let i = 0; i < ACTIVE_PER_DOMAIN; i++) {
        const angle = Math.random() * Math.PI * 2;
        const radius = 180 + di * 30 + Math.random() * 40;

        nodes.push({
          id: nodes.length,
          domain: di,
          active: true,
          label: `${d.name}-${i}`,
          x: 0,
          y: 0,
          vx: 0,
          vy: 0,
          angle,
          radius,
        });
      }
    });

    /* ---------------- INACTIVE NODES ---------------- */
    for (let i = 0; i < INACTIVE_TOTAL; i++) {
      const di = Math.floor(Math.random() * domains.length);
      const angle = Math.random() * Math.PI * 2;
      const radius = 220 + Math.random() * 220;

      nodes.push({
        id: nodes.length,
        domain: di,
        active: false,
        label: "",
        x: 0,
        y: 0,
        vx: 0,
        vy: 0,
        angle,
        radius,
      });
    }

    /* ---------------- GRAPH CONNECTIONS (LOCAL ONLY) ---------------- */
    const links: any[] = [];

    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i];
        const b = nodes[j];

        if (a.domain !== b.domain) continue;

        const dx = a.radius - b.radius;
        if (Math.abs(dx) < 120) {
          links.push({ a, b });
        }
      }
    }

    /* ---------------- SIGNALS ---------------- */
    const signals: any[] = [];

    const spawnSignal = (a: any, b: any) => {
      if (!links.find(l => l.a === a && l.b === b || l.a === b && l.b === a)) return;

      signals.push({
        a,
        b,
        t: 0,
        speed: 0.012 + Math.random() * 0.01,
      });
    };

    /* ---------------- MOUSE ---------------- */
    const onMove = (e: MouseEvent) => {
      const r = canvas.getBoundingClientRect();
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
    };

    canvas.addEventListener("mousemove", onMove);

    const draw = () => {
      const c = center();

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      /* ---------------- UPDATE NODES ---------------- */
      for (const n of nodes) {
        const domain = domains[n.domain];

        const dx = mouse.x - n.x;
        const dy = mouse.y - n.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        const influence = dist < 260 ? (1 - dist / 260) * 0.12 : 0;

        const ox =
          c.x +
          Math.cos(n.angle) *
          (n.radius * domain.centerBias);

        const oy =
          c.y +
          Math.sin(n.angle) *
          (n.radius * domain.centerBias);

        n.vx += (ox - n.x) * 0.02;
        n.vy += (oy - n.y) * 0.02;

        n.vx += dx * influence * 0.005;
        n.vy += dy * influence * 0.005;

        n.vx *= 0.92;
        n.vy *= 0.92;

        n.x += n.vx;
        n.y += n.vy;

        n.angle += 0.0004;
      }

      /* ---------------- LINKS ---------------- */
      for (const l of links) {
        ctx.strokeStyle = "rgba(120,160,255,0.06)";
        ctx.beginPath();
        ctx.moveTo(l.a.x, l.a.y);
        ctx.lineTo(l.b.x, l.b.y);
        ctx.stroke();
      }

      /* ---------------- SPIKES (ONLY ON LINKS) ---------------- */
      if (Math.random() < 0.02) {
        const l = links[Math.floor(Math.random() * links.length)];
        if (l) spawnSignal(l.a, l.b);
      }

      for (const s of signals) {
        s.t += s.speed;
        if (s.t >= 1) continue;

        const x = s.a.x + (s.b.x - s.a.x) * s.t;
        const y = s.a.y + (s.b.y - s.a.y) * s.t;

        ctx.beginPath();
        ctx.fillStyle = "rgba(120,200,255,0.85)";
        ctx.arc(x, y, 2, 0, Math.PI * 2);
        ctx.fill();
      }

      /* ---------------- NODES ---------------- */
      for (const n of nodes) {
        const domain = domains[n.domain];

        ctx.beginPath();
        ctx.fillStyle = n.active
          ? domain.color
          : "rgba(255,255,255,0.25)";

        ctx.arc(n.x, n.y, n.active ? 5 : 3, 0, Math.PI * 2);
        ctx.fill();

        if (n.active) {
          ctx.fillStyle = domain.color;
          ctx.font = "10px system-ui";
          ctx.fillText(n.label, n.x + 6, n.y + 3);
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