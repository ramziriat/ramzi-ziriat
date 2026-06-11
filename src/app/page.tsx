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
  const [flightHours] = useState(42);

  /* ---------------- BOOT ---------------- */
  useEffect(() => {
    const t = setTimeout(() => setBoot(false), 2700);
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

      if (e.deltaY > 0) setPage((p) => Math.min(6, p + 1));
      else setPage((p) => Math.max(0, p - 1));
    };

    window.addEventListener("wheel", onWheel, { passive: true });
    return () => window.removeEventListener("wheel", onWheel);
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
        {["HOME", "SPONSORS", "MISSION", "VISION", "FLIGHT LAB", "MAP", "CONTACT"].map((s, i) => (
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
          <p>EXPLORATION SYSTEM — AERONAUTICS · ASTROPHYSICS · PHILOSOPHY · COSMOLOGY</p>

          <div className="cards">
            <div className="card"><h3>ASTROPHYSICS</h3><p>M2 theoretical physics systems</p></div>
            <div className="card"><h3>PHILOSOPHY</h3><p>Epistemology & models of reality</p></div>
            <div className="card"><h3>AEROSPACE</h3><p>Flight systems & propulsion</p></div>
          </div>
        </section>

        {/* ---------------- SPONSORS ---------------- */}
        <section className="section">
          <h2>MISSION PARTNERS</h2>

          <p style={{ maxWidth: "800px", textAlign: "center", opacity: 0.8 }}>
            Independent research program seeking collaboration in astrophysics,
            aerospace engineering and scientific communication.
          </p>

          <div className="cards">
            <div className="card">
              <h3>RESEARCH</h3>
              <p>Pulsars, lensing, high-energy astrophysics</p>
            </div>

            <div className="card">
              <h3>AEROSPACE</h3>
              <p>Flight training, propulsion, aviation systems</p>
            </div>

            <div className="card">
              <h3>MEDIA</h3>
              <p>Documentaries & exploration storytelling</p>
            </div>
          </div>

          <button className="cta">CONTACT MISSION CONTROL</button>
        </section>

        {/* ---------------- CURRENT MISSION ---------------- */}
        <section className="section">
          <h2>CURRENT MISSION</h2>

          <div className="panel" style={{ width: "60%" }}>
            <h3>2026 ACTIVE RESEARCH PHASE</h3>

            <p>
              Multi-domain research in astrophysics, cosmology and philosophy of science
              combined with aerospace engineering training.
            </p>

            <p>
              Pulsar spectra analysis · gravitational microlensing · neutron irradiation experiments
            </p>

            <p>Parallel track: IPSA aerospace engineering (propulsion systems)</p>
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
                    <div style={{ fontSize: "10px", opacity: 0.7 }}>
                      STATUS: {m.status}
                    </div>
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
            <div className="panel"><h3>FLIGHT MODEL</h3><p>Aerodynamics simulation</p></div>
            <div className="panel"><h3>ASTRO MODULE</h3><p>Orbital mechanics</p></div>
            <div className="panel"><h3>PHILOSOPHY ENGINE</h3><p>Observer vs reality</p></div>
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
          <h2>COLLABORATE</h2>

          <p style={{ maxWidth: "800px", textAlign: "center", opacity: 0.8 }}>
            Seeking institutional, aerospace and media partnerships.
          </p>

          <button className="cta">REQUEST PARTNERSHIP</button>
        </section>

      </div>
    </main>
  );
}