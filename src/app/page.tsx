"use client";

import { useEffect, useState } from "react";

/* ---------------- SYSTEM DATA ---------------- */
const missions = [
  { year: 2001, title: "System initialization", desc: "Birth", status: "DONE" },

  { year: 2023, title: "BIA certification", desc: "First aviation certification", status: "DONE" },

  { year: 2024, title: "Fundamental physics license", desc: "USTHB + Montpellier physics", status: "DONE" },

  { year: 2025, title: "M1 Physics Paris Cité", desc: "Microlensing quasars + Fe Kα study", status: "DONE" },

  { year: 2025, title: "Neutron irradiation L2C", desc: "Boron nitride experiments", status: "DONE" },

  { year: 2026, title: "Pulsar spectroscopy LPC2E", desc: "NenuFAR low-frequency radio analysis", status: "ACTIVE" },

  { year: 2026, title: "M2 Astrophysics Montpellier", desc: "Theoretical astrophysics", status: "ACTIVE" },

  { year: 2026, title: "M2 Cosmology + Philosophy Sorbonne", desc: "GR + epistemology", status: "PLANNED" },

  { year: 2026, title: "IPSA Aerospace Engineering", desc: "Propulsion systems + alternance", status: "PLANNED" },

  { year: 2027, title: "Private Pilot License", desc: "PPL training + exploration flights", status: "PLANNED" },

  { year: 2031, title: "Doctorates", desc: "Cosmology + Philosophy of science", status: "FUTURE" },

  { year: 2035, title: "Exploration synthesis", desc: "Space + aviation integration", status: "FUTURE" },
];

export default function Home() {
  const [page, setPage] = useState(0);
  const [hover, setHover] = useState<number | null>(null);
  const [boot, setBoot] = useState(true);
  const [utc, setUtc] = useState("");

  const [flightHours, setFlightHours] = useState(0);
  const targetFlightHours = 42;

  const [experienceYears, setExperienceYears] = useState(0);

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

  /* ---------------- SCROLL NAV ---------------- */
  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      if (boot) return;

      if (e.deltaY > 0) setPage((p) => Math.min(4, p + 1));
      else setPage((p) => Math.max(0, p - 1));
    };

    window.addEventListener("wheel", onWheel, { passive: true });
    return () => window.removeEventListener("wheel", onWheel);
  }, [boot]);

  /* ---------------- ANIMATION STATS ---------------- */
  useEffect(() => {
    if (boot) return;

    const start = performance.now();
    const duration = 2000;

    const animate = (t: number) => {
      const p = Math.min((t - start) / duration, 1);

      setFlightHours(Math.floor(p * targetFlightHours));
      setExperienceYears(Number((p * 8).toFixed(1)));

      if (p < 1) requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
  }, [boot]);

  /* ---------------- BOOT SCREEN ---------------- */
  if (boot) {
    return (
      <div className="boot">
        <div className="bootText">INITIALIZING MISSION SYSTEM...</div>
      </div>
    );
  }

  return (
    <main className="main">

      <div className="bg" />
      <div className="grid" />
      <div className="glow" />

      {/* HUD */}
      <header className="hud">
        <div>STATUS: ONLINE</div>
        <div>RAMZI ZIRIAT // EXPLORATION SYSTEM</div>
        <div>{utc}</div>
        <div className="hudStats">FLIGHT: {flightHours}h</div>
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
            Astrophysics · Cosmology · Philosophy of Science · Aerospace Engineering
          </p>

          <div className="cards">
            <div className="card">
              <h3>FLIGHT HOURS</h3>
              <p className="big">{flightHours}h</p>
            </div>

            <div className="card">
              <h3>ACADEMIC TRACK</h3>
              <p>M2 Astro + M2 Cosmo + Philosophy (Sorbonne)</p>
            </div>

            <div className="card">
              <h3>RESEARCH STATUS</h3>
              <p>Multi-institutional active program</p>
            </div>
          </div>
        </section>

        {/* ---------------- CURRENT MISSION ---------------- */}
        <section className="section">
          <h2>CURRENT MISSION</h2>

          <div className="split">

            <div className="left">
              <h3>2026 ACTIVE PROGRAM</h3>

              <p>
                Multi-domain research in astrophysics, cosmology,
                philosophy of science and aerospace engineering.
              </p>

              <p>
                Axes:
                AERO · COSMO · ASTRO · EXPLORATION
              </p>

              <button className="cta">SEE PROJECTS</button>
            </div>

            <div className="right" />
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
                    <div className="status">{m.status}</div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* ---------------- AEROSPACE LAB ---------------- */}
        <section className="section">
          <h2>AEROSPACE CENTRES</h2>

          <div className="lab">
            <div className="panel clickable">ONERA</div>
            <div className="panel clickable">CNES</div>
            <div className="panel clickable">IPSA PROPULSION</div>
            <div className="panel clickable">RESEARCH LABS</div>
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