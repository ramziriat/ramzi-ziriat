"use client";

import { useEffect, useState } from "react";

/* ---------------- DATA ---------------- */
const missions = [
  {
    year: 2001,
    events: [{ title: "Birth", desc: "System initialization" }]
  },
  {
    year: 2015,
    events: [{ title: "Scientific curiosity", desc: "First structured thinking phase" }]
  },
  {
    year: 2023,
    events: [{ title: "Aviation exploration", desc: "Trajectory toward flight systems" }]
  },
  {
    year: 2026,
    events: [
      { title: "Pulsar research", desc: "LPC2E Orléans mission" },
      { title: "Microlensing quasars", desc: "APC Paris research" },
      { title: "Neutron irradiation", desc: "L2C Montpellier" }
    ]
  },
  {
    year: 2028,
    events: [{ title: "M2 Astrophysics", desc: "Advanced theoretical physics training" }]
  },
  {
    year: 2035,
    events: [{ title: "Exploration synthesis", desc: "Aviation + space + philosophy integration" }]
  }
];

export default function Home() {
  const [page, setPage] = useState(0);
  const [boot, setBoot] = useState(true);
  const [utc, setUtc] = useState("");

  /* ---------------- FLIGHT HOURS ANIMATION ---------------- */
  const [flightHours, setFlightHours] = useState(0);

  useEffect(() => {
    let start = 0;
    const target = 42;

    const animate = () => {
      start += (target - start) * 0.04; // easing smooth

      if (Math.abs(target - start) < 0.1) {
        setFlightHours(target);
        return;
      }

      setFlightHours(Math.floor(start));
      requestAnimationFrame(animate);
    };

    animate();
  }, []);

  /* ---------------- BOOT ---------------- */
  useEffect(() => {
    const t = setTimeout(() => setBoot(false), 2000);
    return () => clearTimeout(t);
  }, []);

  /* ---------------- CLOCK ---------------- */
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

  if (boot) {
    return (
      <div className="boot">
        <div className="bootText">INITIALIZING EXPLORATION SYSTEM...</div>
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
        <div className="flight">FLIGHT HOURS: {flightHours}h</div>
      </header>

      {/* NAV */}
      <aside className="sidebar">
        {["HOME", "SPONSORS", "MISSION", "VISION", "LAB", "MAP"].map((s, i) => (
          <div
            key={s}
            className={`dot ${page === i ? "active" : ""}`}
            onClick={() => setPage(i)}
          />
        ))}
      </aside>

      {/* VIEW */}
      <div className="viewport" style={{ transform: `translateY(-${page * 100}vh)` }}>

        {/* ---------------- HOME ---------------- */}
        <section className="section home">
          <h1>RAMZI ZIRIAT</h1>

          <div className="bigMetric">
            {flightHours}h FLIGHT TIME
          </div>

          <p>ASTROPHYSICS · COSMOLOGY · PHILOSOPHY · AEROSPACE</p>
        </section>

        {/* ---------------- SPONSORS ---------------- */}
        <section className="section split">
          <div className="left">
            <h2>MISSION PARTNERS</h2>
            <p>Scientific exploration program seeking institutional collaboration.</p>

            <button className="cta">CONTACT MISSION CONTROL</button>
          </div>

          <div className="right visualBox" />
        </section>

        {/* ---------------- CURRENT MISSION ---------------- */}
        <section className="section split">
          <div className="left">
            <h2>CURRENT MISSION</h2>

            <p>
              Multi-domain research in astrophysics, cosmology and aerospace engineering.
            </p>

            <button className="cta">SEE PROJECTS</button>
          </div>

          <div className="right visualBox" />
        </section>

        {/* ---------------- TIMELINE ---------------- */}
        <section className="section">
          <h2>VISION TIMELINE</h2>

          <div className="timeline">
            <div className="line" />

            {missions.map((m, i) => (
              <div key={i} className="node" style={{ left: `${(i / (missions.length - 1)) * 100}%` }}>
                <div className="dotNode" />
                <span>{m.year}</span>

                <div className="tooltip">
                  {m.events.map((e, idx) => (
                    <div key={idx} className="eventCard">
                      <h4>{e.title}</h4>
                      <p>{e.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ---------------- LAB ---------------- */}
        <section className="section">
          <h2>FLIGHT LAB</h2>

          <div className="gridCards">
            <div className="module">Propulsion</div>
            <div className="module">Orbital Mechanics</div>
            <div className="module">Navigation</div>
            <div className="module">Simulation</div>
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