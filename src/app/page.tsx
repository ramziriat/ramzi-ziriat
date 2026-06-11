"use client";

import { useEffect, useRef, useState } from "react";

/* ---------------- MISSION DATA ---------------- */
const missions = [
  { year: 2001, title: "Birth", desc: "System initialization", status: "DONE" },
  { year: 2015, title: "Scientific curiosity", desc: "Structured cognition", status: "DONE" },
  { year: 2023, title: "Aviation exploration", desc: "Flight trajectory", status: "DONE" },
  { year: 2026, title: "Active Research Phase", desc: "Astrophysics + Cosmology", status: "ACTIVE" },
  { year: 2028, title: "Engineering Convergence", desc: "Aerospace integration", status: "PLANNED" },
  { year: 2035, title: "Exploration Synthesis", desc: "Unified scientific model", status: "FUTURE" },
];

/* ---------------- NEURAL NODES ---------------- */
const activeNodes = [
  "Aerospace",
  "Astrophysics",
  "Cosmology",
  "Philosophy",
  "Pilot",
];

const inactiveNodes = Array.from({ length: 20 }, (_, i) => `node-${i}`);

export default function Home() {
  const [page, setPage] = useState(0);
  const [hoverNode, setHoverNode] = useState<string | null>(null);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [boot, setBoot] = useState(true);
  const [utc, setUtc] = useState("");

  const [flightHours, setFlightHours] = useState(0);

  /* ---------------- BOOT SEQUENCE (CENTER + LONG FADE) ---------------- */
  useEffect(() => {
    const t = setTimeout(() => setBoot(false), 3000);
    return () => clearTimeout(t);
  }, []);

  /* ---------------- FLIGHT HOURS (EASE OUT + IN) ---------------- */
  useEffect(() => {
    const target = 42;
    const start = performance.now();

    const animate = (t: number) => {
      const p = Math.min((t - start) / 2500, 1);

      // ease in-out cubic
      const eased =
        p < 0.5
          ? 4 * p * p * p
          : 1 - Math.pow(-2 * p + 2, 3) / 2;

      setFlightHours(Math.floor(eased * target));

      if (p < 1) requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
  }, []);

  /* ---------------- UTC ---------------- */
  useEffect(() => {
    const u = () => setUtc(new Date().toUTCString());
    u();
    const i = setInterval(u, 1000);
    return () => clearInterval(i);
  }, []);

  /* ---------------- MOUSE TRACKING ---------------- */
  useEffect(() => {
    const move = (e: MouseEvent) => {
      setMouse({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  /* ---------------- WHEEL NAV ---------------- */
  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      if (boot) return;
      if (e.deltaY > 0) setPage((p) => Math.min(4, p + 1));
      else setPage((p) => Math.max(0, p - 1));
    };

    window.addEventListener("wheel", onWheel, { passive: true });
    return () => window.removeEventListener("wheel", onWheel);
  }, [boot]);

  if (boot) {
    return (
      <div className="boot">
        <div className="bootCore">
          INITIALIZING SYSTEM
          <div className="bootGlow" />
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
        {["NEURAL", "VISION", "LAB", "MAP", "COLLAB"].map((s, i) => (
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
        <section className="section neural">

          {/* ACTIVE NODES */}
          {activeNodes.map((n, i) => (
            <div
              key={n}
              className={`node activeNode ${hoverNode === n ? "hover" : ""}`}
              style={{
                left: `${20 + i * 15}%`,
                top: `${30 + Math.sin(i) * 10}%`,
                transform:
                  hoverNode === n
                    ? `scale(1.8)`
                    : `scale(1)`,
              }}
              onMouseEnter={() => setHoverNode(n)}
              onMouseLeave={() => setHoverNode(null)}
            >
              {n}
            </div>
          ))}

          {/* INACTIVE NODES */}
          {inactiveNodes.map((n, i) => (
            <div
              key={n}
              className="node inactiveNode"
              style={{
                left: `${(i * 37) % 100}%`,
                top: `${(i * 53) % 100}%`,
              }}
            />
          ))}

        </section>

        {/* ---------------- PAGE 2: VISION ---------------- */}
        <section className="section">
          <h2>VISION TIMELINE</h2>

          <div className="timeline">
            <div className="line" />

            {missions.map((m, i) => (
              <div
                key={i}
                className="node"
                style={{ left: `${(i / (missions.length - 1)) * 100}%` }}
              >
                <div className="dotNode" />
                <span className="year">{m.year}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ---------------- PAGE 3: LAB ---------------- */}
        <section className="section">
          <h2>FLIGHT LAB</h2>

          <div className="labGrid">
            <div className="panel">AEROSPACE</div>
            <div className="panel">COSMOLOGY</div>
            <div className="panel">PROPULSION</div>
            <div className="panel">SIMULATION</div>
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

          <p className="subtitle">
            Research institutions · Aerospace industry · Media partners
          </p>

          <button className="cta">CONTACT MISSION CONTROL</button>
        </section>

      </div>
    </main>
  );
}