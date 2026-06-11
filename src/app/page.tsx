"use client";

import { useEffect, useState } from "react";

/* ---------------- SYSTEM DATA ---------------- */
const missions = [
  { year: 2001, title: "Birth", desc: "System initialization", status: "DONE" },
  { year: 2015, title: "Scientific curiosity", desc: "First structured thinking phase", status: "DONE" },
  { year: 2023, title: "Aviation exploration", desc: "Trajectory toward flight systems", status: "DONE" },
  { year: 2026, title: "Exploration phase", desc: "Active multi-domain research", status: "ACTIVE" },
  { year: 2028, title: "M2 Astrophysics", desc: "Advanced theoretical physics training", status: "PLANNED" },
  { year: 2035, title: "Exploration synthesis", desc: "Aviation + space + philosophy integration", status: "FUTURE" },
];

export default function Home() {
  const [page, setPage] = useState(0);
  const [hover, setHover] = useState<number | null>(null);
  const [boot, setBoot] = useState(true);
  const [utc, setUtc] = useState("");

  /* ---------------- BOOT SEQUENCE (RESTORED EXACT STYLE) ---------------- */
  useEffect(() => {
    const t = setTimeout(() => setBoot(false), 2500);
    return () => clearTimeout(t);
  }, []);

  /* ---------------- UTC CLOCK ---------------- */
  useEffect(() => {
    const update = () => {
      setUtc(new Date().toUTCString());
    };
    update();
    const i = setInterval(update, 1000);
    return () => clearInterval(i);
  }, []);

  /* ---------------- NAV ---------------- */
  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      if (boot) return;

      if (e.deltaY > 0) setPage((p) => Math.min(3, p + 1));
      else setPage((p) => Math.max(0, p - 1));
    };

    window.addEventListener("wheel", onWheel, { passive: true });
    return () => window.removeEventListener("wheel", onWheel);
  }, [boot]);

  /* ---------------- BOOT SCREEN ---------------- */
  if (boot) {
    return (
      <div className="boot">
        <div className="bootText">
          INITIALIZING MISSION SYSTEM...
        </div>
      </div>
    );
  }

  return (
    <main className="main">

      {/* BACKGROUND */}
      <div className="bg" />
      <div className="grid" />
      <div className="glow" />

      {/* HUD */}
      <header className="hud">
        <div>STATUS: ONLINE</div>
        <div>RAMZI ZIRIAT // EXPLORATION SYSTEM</div>
        <div>{utc}</div>
      </header>

      {/* SIDEBAR */}
      <aside className="sidebar">
        {["HOME", "VISION", "FLIGHT LAB", "MAP"].map((s, i) => (
          <div
            key={s}
            className={`dot ${page === i ? "active" : ""}`}
            onClick={() => setPage(i)}
          />
        ))}
      </aside>

      {/* VIEWPORT */}
      <div className="viewport" style={{ transform: `translateY(-${page * 100}vh)` }}>

        {/* ---------------- HOME ---------------- */}
        <section className="section">
          <h1>RAMZI ZIRIAT</h1>
          <p>
            EXPLORATION SYSTEM — AERONAUTICS · ASTROPHYSICS · PHILOSOPHY · COSMOLOGY
          </p>

          <div className="cards">
            <div className="card">
              <h3>ASTROPHYSICS (M2)</h3>
              <p>Theoretical & computational physics systems</p>
            </div>

            <div className="card">
              <h3>PHILOSOPHY OF SCIENCE</h3>
              <p>Epistemology, observation limits, models of reality</p>
            </div>

            <div className="card">
              <h3>EXPLORATION SYSTEMS</h3>
              <p>Aviation + space mission conceptualization</p>
            </div>
          </div>
        </section>

        {/* ---------------- VISION TIMELINE ---------------- */}
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
                <div className={`dotNode ${m.status}`} />
                <span className="year">{m.year}</span>

                {hover === i && (
                  <div className="tooltip">
                    <h3>{m.title}</h3>
                    <p>{m.desc}</p>
                    <div className="imgBox" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* ---------------- FLIGHT LAB ---------------- */}
        <section className="section">
          <h2>FLIGHT LAB</h2>

          <div className="lab">
            <div className="panel">
              <h3>FLIGHT MODEL</h3>
              <p>Aerodynamics simulation layer</p>
              <p>Navigation: conceptual IFR/VFR</p>
            </div>

            <div className="panel">
              <h3>ASTRO MODULE</h3>
              <p>Orbital mechanics (future)</p>
              <p>Trajectory modeling systems</p>
            </div>

            <div className="panel">
              <h3>PHILOSOPHY ENGINE</h3>
              <p>Model: observer vs reality</p>
              <p>Uncertainty & epistemic limits</p>
            </div>
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

      </div>
    </main>
  );
}