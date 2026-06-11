"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

/* ---------------- SYSTEM DATA ---------------- */

const missions = [
  {
    year: 2001,
    events: [
      { title: "Birth", desc: "System initialization" }
    ],
    status: "DONE"
  },
  {
    year: 2015,
    events: [
      { title: "Scientific curiosity", desc: "First structured thinking phase" }
    ],
    status: "DONE"
  },
  {
    year: 2023,
    events: [
      { title: "Aviation exploration", desc: "Trajectory toward flight systems" }
    ],
    status: "DONE"
  },
  {
    year: 2024,
    events: [
      { title: "Neutron irradiation (L2C)", desc: "Boron nitride experiments" }
    ],
    status: "DONE"
  },
  {
    year: 2025,
    events: [
      { title: "Microlensing quasar (APC)", desc: "Gravitational lensing study" }
    ],
    status: "DONE"
  },
  {
    year: 2026,
    events: [
      { title: "Pulsar spectroscopy", desc: "Low-frequency radio analysis (LPC2E)" },
      { title: "Cosmology M2", desc: "Active enrollment" },
      { title: "Philosophy of science M2", desc: "Parallel track (Sorbonne)" }
    ],
    status: "ACTIVE"
  },
  {
    year: 2027,
    events: [
      { title: "PPL training", desc: "Pilot license progression" }
    ],
    status: "PLANNED"
  },
  {
    year: 2028,
    events: [
      { title: "Aerospace engineering IPSA", desc: "Propulsion systems specialization" }
    ],
    status: "PLANNED"
  },
  {
    year: 2031,
    events: [
      { title: "PhD Cosmology", desc: "GR + quantum cosmology research" },
      { title: "Philosophy PhD (parallel)", desc: "Epistemology of physics" }
    ],
    status: "FUTURE"
  }
];

/* ---------------- MAIN ---------------- */

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

    const step = () => {
      start += (target - start) * 0.06; // easing (smooth + slow near target)
      setFlightHours(start);

      if (Math.abs(target - start) > 0.01) {
        requestAnimationFrame(step);
      } else {
        setFlightHours(target);
      }
    };

    step();
  }, []);

  /* ---------------- BOOT ---------------- */
  useEffect(() => {
    const t = setTimeout(() => setBoot(false), 2000);
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
      if (e.deltaY > 0) setPage((p) => Math.min(5, p + 1));
      else setPage((p) => Math.max(0, p - 1));
    };

    window.addEventListener("wheel", onWheel, { passive: true });
    return () => window.removeEventListener("wheel", onWheel);
  }, [boot]);

  /* ---------------- BOOT ---------------- */
  if (boot) {
    return (
      <div className="boot">
        <div className="bootText">INITIALIZING EXPLORATION SYSTEM...</div>
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
        <div className="flightCounter">
          FLIGHT HOURS: {flightHours.toFixed(1)}h
        </div>
      </header>

      {/* SIDEBAR */}
      <aside className="sidebar">
        {["HOME", "SPONSOR", "MISSION", "VISION", "LAB", "MAP"].map((s, i) => (
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
        <section className="section home">
          <h1>RAMZI ZIRIAT</h1>

          <p className="subtitle">
            MULTI-DOMAIN EXPLORATION SYSTEM — ASTROPHYSICS · COSMOLOGY · AEROSPACE · PHILOSOPHY
          </p>

          <div className="cards">
            <div className="card">
              <h3>ACTIVE PROGRAM</h3>
              <p>M2 Astrophysics + M2 Cosmology + Philosophy</p>
            </div>

            <div className="card">
              <h3>FLIGHT READINESS</h3>
              <p>PPL Training + Aerospace Engineering (IPSA)</p>
            </div>

            <div className="card">
              <h3>RESEARCH OUTPUT</h3>
              <p>Quasars · Pulsars · Neutron irradiation</p>
            </div>
          </div>
        </section>

        {/* ---------------- SPONSORS ---------------- */}
        <section className="section">
          <h2>MISSION PARTNERS</h2>

          <div className="cards">
            <div className="card">Astrophysics research programs</div>
            <div className="card">Aerospace engineering & propulsion</div>
            <div className="card">Scientific communication & documentaries</div>
          </div>

          <button className="cta">CONTACT MISSION CONTROL</button>
        </section>

        {/* ---------------- CURRENT MISSION ---------------- */}
        <section className="section mission">

          <div className="missionLeft">
            <h2>CURRENT MISSION</h2>

            <p>
              Multi-disciplinary scientific program combining astrophysics,
              cosmology and philosophy of science with aerospace training.
            </p>

            <p>
              Focus areas:
              pulsars, gravitational lensing, quantum cosmology,
              flight systems engineering.
            </p>

            <button className="cta">SEE PROJECTS</button>
          </div>

          <div className="missionRight" />
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
                    <h3>{m.year}</h3>

                    <div className="carousel">
                      {m.events.map((e, idx) => (
                        <div key={idx} className="eventCard">
                          <h4>{e.title}</h4>
                          <p>{e.desc}</p>
                        </div>
                      ))}
                    </div>
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
            <div className="panel">Aerodynamics</div>
            <div className="panel">Propulsion systems</div>
            <div className="panel">Orbital mechanics</div>
            <div className="panel">Mission simulation</div>
          </div>
        </section>

        {/* ---------------- MAP ---------------- */}
        <section className="section">
          <h2>EXPLORATION MAP</h2>
          <iframe className="map" src="https://www.openstreetmap.org/export/embed.html" />
        </section>

      </div>
    </main>
  );
}