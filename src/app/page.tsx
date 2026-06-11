"use client";

import { useEffect, useState } from "react";

/* ---------------- SYSTEM DATA ---------------- */
const missions = [
  {
    year: 2001,
    title: "Birth",
    desc: "System initialization",
    status: "DONE",
  },
  {
    year: 2015,
    title: "Scientific curiosity",
    desc: "First structured thinking phase",
    status: "DONE",
  },
  {
    year: 2023,
    title: "Aviation exploration",
    desc: "Trajectory toward flight systems",
    status: "DONE",
  },
  {
    year: 2026,
    title: "Active Research Phase",
    desc: "Astrophysics + Cosmology + Philosophy",
    status: "ACTIVE",
  },
  {
    year: 2028,
    title: "M2 + Engineering Convergence",
    desc: "Astrophysics + Aerospace integration",
    status: "PLANNED",
  },
  {
    year: 2035,
    title: "Exploration Synthesis",
    desc: "Science + Flight + Philosophy integration",
    status: "FUTURE",
  },
];

export default function Home() {
  const [page, setPage] = useState(0);
  const [hover, setHover] = useState<number | null>(null);
  const [boot, setBoot] = useState(true);
  const [utc, setUtc] = useState("");

  /* ---------------- FLIGHT HOURS ANIMATION ---------------- */
  const [flightHours, setFlightHours] = useState(0);

  useEffect(() => {
    let start = 0;
    const target = 42;
    const duration = 2200;
    const startTime = performance.now();

    const animate = (t: number) => {
      const progress = Math.min((t - startTime) / duration, 1);

      // easing (slow near end)
      const eased = 1 - Math.pow(1 - progress, 3);

      const value = Math.floor(eased * target);
      setFlightHours(value);

      if (progress < 1) requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
  }, []);

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

  if (boot) {
    return (
      <div className="boot">
        <div className="bootText">INITIALIZING MISSION SYSTEM...</div>
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
        {["HOME", "VISION", "LAB", "MAP"].map((s, i) => (
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

        {/* ---------------- HOME ---------------- */}
        <section className="section">
          <h1>RAMZI ZIRIAT</h1>

          <p className="subtitle">
            MULTI-DOMAIN EXPLORATION SYSTEM — AEROSPACE · COSMOLOGY · PHILOSOPHY
          </p>

          <div className="bigMetric">
            <h2>{flightHours}h</h2>
            <p>FLIGHT EXPERIENCE (PPL TRACK)</p>
          </div>

          <div className="cards">
            <div className="card">
              <h3>ASTROPHYSICS</h3>
              <p>Quantum gravity / pulsars / lensing systems</p>
            </div>

            <div className="card">
              <h3>PHILOSOPHY</h3>
              <p>Epistemology of observation & reality models</p>
            </div>

            <div className="card">
              <h3>EXPLORATION</h3>
              <p>Aircraft + space + scientific field missions</p>
            </div>
          </div>
        </section>

        {/* ---------------- CURRENT MISSION ---------------- */}
        <section className="section split">
          <div className="left">
            <h2>CURRENT MISSION</h2>

            <p>
              Active interdisciplinary research program combining astrophysics,
              cosmology and philosophy of science.
            </p>

            <p>
              Pulsars (LPC2E), microlensing quasars (APC Paris),
              neutron irradiation (L2C Montpellier).
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
            <div className="panel">FLIGHT MODEL</div>
            <div className="panel">ASTRO MODULE</div>
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
      </div>
    </main>
  );
}