"use client";

import { useEffect, useRef, useState } from "react";

/* ---------------- NEURAL NODES ---------------- */
const activeNodes = [
  { label: "Aerospace" },
  { label: "Astrophysics" },
  { label: "Cosmology" },
  { label: "Philosophy" },
  { label: "Pilot Training" },
];

const inactiveNodes = Array.from({ length: 20 }).map((_, i) => ({
  id: i,
}));

/* ---------------- TIMELINE ---------------- */
const missions = [
  { year: 2001, title: "Birth", desc: "Initialization", status: "DONE" },
  { year: 2015, title: "Scientific curiosity", desc: "Thinking system", status: "DONE" },
  { year: 2023, title: "Aviation exploration", desc: "Flight trajectory", status: "DONE" },
  { year: 2026, title: "Active Research", desc: "Multi-domain work", status: "ACTIVE" },
  { year: 2028, title: "M2 + Engineering", desc: "Cosmos + Aero fusion", status: "PLANNED" },
  { year: 2035, title: "Exploration synthesis", desc: "Unified model", status: "FUTURE" },
];

export default function Home() {
  const [page, setPage] = useState(0);
  const [hover, setHover] = useState<number | null>(null);
  const [boot, setBoot] = useState(true);
  const [utc, setUtc] = useState("");

  /* ---------------- FLIGHT HOURS ANIMATION ---------------- */
  const [flightHours, setFlightHours] = useState(0);

  useEffect(() => {
    const target = 42;
    const duration = 2600;
    const start = performance.now();

    const ease = (t: number) =>
      t < 0.5
        ? 4 * t * t * t
        : 1 - Math.pow(-2 * t + 2, 3) / 2;

    const animate = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = ease(p);
      setFlightHours(Math.floor(eased * target));
      if (p < 1) requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
  }, []);

  /* ---------------- BOOT GLOW ---------------- */
  useEffect(() => {
    const t = setTimeout(() => setBoot(false), 3000);
    return () => clearTimeout(t);
  }, []);

  /* ---------------- CLOCK ---------------- */
  useEffect(() => {
    const u = () => setUtc(new Date().toUTCString());
    u();
    const i = setInterval(u, 1000);
    return () => clearInterval(i);
  }, []);

  /* ---------------- NAV ---------------- */
  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      if (boot) return;
      if (e.deltaY > 0) setPage((p) => Math.min(5, p + 1));
      else setPage((p) => Math.max(0, p - 1));
    };

    window.addEventListener("wheel", onWheel, { passive: true });
    return () => window.removeEventListener("wheel", onWheel);
  }, [boot]);

  /* ---------------- NEURAL STATE ---------------- */
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  if (boot) {
    return (
      <div className="bootGlow">
        <div className="bootText">INITIALIZING SYSTEM...</div>
      </div>
    );
  }

  return (
    <main
      onMouseMove={(e) => setMouse({ x: e.clientX, y: e.clientY })}
    >

      {/* BACKGROUND */}
      <div className="bg" />
      <div className="grid" />
      <div className="glow" />

      {/* HUD */}
      <header className="hud">
        <div>STATUS: ONLINE</div>
        <div>RAMZI ZIRIAT</div>
        <div>{utc}</div>
        <div>FLIGHT: {flightHours}h</div>
      </header>

      {/* SIDEBAR */}
      <aside className="sidebar">
        {["HOME", "MISSION", "TIMELINE", "LAB", "MAP", "CONTACT"].map(
          (s, i) => (
            <div
              key={s}
              className={`dot ${page === i ? "active" : ""}`}
              onClick={() => setPage(i)}
            />
          )
        )}
      </aside>

      {/* VIEWPORT */}
      <div
        className="viewport"
        style={{ transform: `translateY(-${page * 100}vh)` }}
      >

        {/* ---------------- HOME NEURAL NETWORK ---------------- */}
        <section className="section">
          <h1>EXPLORATION SYSTEM</h1>

          {/* ACTIVE NODES */}
          {activeNodes.map((n, i) => (
            <div
              key={i}
              className="nodeActive"
              style={{
                top: `${20 + i * 12}%`,
                left: `${20 + i * 10}%`,
                transform: `
                  translate(
                    ${mouse.x * 0.01}px,
                    ${mouse.y * 0.01}px
                  )
                `,
              }}
            >
              {n.label}
            </div>
          ))}

          {/* INACTIVE NODES */}
          {inactiveNodes.map((n, i) => (
            <div
              key={i}
              className="nodeInactive"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
              }}
            />
          ))}
        </section>

        {/* ---------------- CURRENT MISSION ---------------- */}
        <section className="section split">
          <div className="left">
            <h2>CURRENT MISSION</h2>
            <p>
              Multi-domain astrophysics + cosmology + philosophy program.
            </p>

            <button className="cta">SEE PROJECTS</button>
          </div>

          <div className="right">
            <div className="imgMock" />
          </div>
        </section>

        {/* ---------------- TIMELINE ---------------- */}
        <section className="section">
          <h2>VISION TIMELINE</h2>

          <div className="timeline">
            <div className="line" />

            {missions.map((m, i) => (
              <div
                key={i}
                className="node"
                style={{
                  left: `${(i / (missions.length - 1)) * 100}%`,
                }}
                onMouseEnter={() => setHover(i)}
                onMouseLeave={() => setHover(null)}
              >
                <div className={`dotNode ${m.status}`} />
                <span>{m.year}</span>

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

        {/* ---------------- FLIGHT LAB ---------------- */}
        <section className="section">
          <h2>FLIGHT LAB</h2>

          <div className="labGrid">
            <div className="panel">AERO</div>
            <div className="panel">COSMO</div>
            <div className="panel">PROPULSION</div>
            <div className="panel">SIMULATION</div>
          </div>
        </section>

        {/* ---------------- MAP ---------------- */}
        <section className="section">
          <h2>EXPLORATION MAP</h2>
          <iframe
            className="map"
            src="https://www.openstreetmap.org/export/embed.html"
          />
        </section>

        {/* ---------------- CONTACT ---------------- */}
        <section className="section">
          <h2>COLLABORATION</h2>
          <button className="cta">CONTACT MISSION CONTROL</button>
        </section>

      </div>
    </main>
  );
}