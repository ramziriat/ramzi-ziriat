"use client";

import { useEffect, useMemo, useState } from "react";

/* ---------------- DATA ---------------- */
const missions = [
  { year: 2001, title: "System initialization", desc: "Birth of trajectory", status: "DONE" },

  { year: 2023, title: "BIA aviation certification", desc: "First aeronautical validation", status: "DONE" },

  { year: 2024, title: "Physics fundamentals", desc: "USTHB + Montpellier physics", status: "DONE" },

  { year: 2025, title: "M1 Physics Paris Cité", desc: "Microlensing quasars / Fe Kα", status: "DONE" },

  { year: 2025, title: "Neutron irradiation L2C", desc: "Material interaction studies", status: "DONE" },

  {
    year: 2026,
    title: "Pulsar spectroscopy",
    desc: "LPC2E Orléans - NenuFAR low frequency",
    status: "ACTIVE"
  },

  {
    year: 2026,
    title: "M2 Astrophysics",
    desc: "University of Montpellier",
    status: "ACTIVE"
  },

  {
    year: 2026,
    title: "M2 Cosmology + Philosophy",
    desc: "Sorbonne / Panthéon epistemology & GR",
    status: "PLANNED"
  },

  {
    year: 2026,
    title: "Aerospace engineering IPSA",
    desc: "Propulsion systems + alternance",
    status: "PLANNED"
  },

  {
    year: 2027,
    title: "Private Pilot License",
    desc: "Flight missions + exploration",
    status: "PLANNED"
  },

  {
    year: 2031,
    title: "Doctorates",
    desc: "Cosmology + Philosophy of science",
    status: "FUTURE"
  },

  {
    year: 2035,
    title: "Exploration synthesis",
    desc: "Space + aviation integration",
    status: "FUTURE"
  }
];

/* ---------------- UTIL: smooth easing toward target ---------------- */
function approach(current: number, target: number, speed: number) {
  return current + (target - current) * speed;
}

export default function Home() {
  const [page, setPage] = useState(0);
  const [boot, setBoot] = useState(true);
  const [utc, setUtc] = useState("");

  const [flightHours, setFlightHours] = useState(0);
  const [experience, setExperience] = useState(0);

  const targetFlightHours = 42;
  const targetExperience = 8;

  const [timelineOpen, setTimelineOpen] = useState<number | null>(null);
  const [timelineIndex, setTimelineIndex] = useState(0);

  /* ---------------- BOOT ---------------- */
  useEffect(() => {
    const t = setTimeout(() => setBoot(false), 2200);
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

      if (e.deltaY > 0) setPage((p) => Math.min(4, p + 1));
      else setPage((p) => Math.max(0, p - 1));
    };

    window.addEventListener("wheel", onWheel, { passive: true });
    return () => window.removeEventListener("wheel", onWheel);
  }, [boot]);

  /* ---------------- PROGRESSIVE ANIMATION ---------------- */
  useEffect(() => {
    if (boot) return;

    let frame: number;

    const tick = () => {
      setFlightHours((v) => approach(v, targetFlightHours, 0.04));
      setExperience((v) => approach(v, targetExperience, 0.02));

      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [boot]);

  /* ---------------- GROUP TIMELINE BY YEAR ---------------- */
  const groupedTimeline = useMemo(() => {
    const map = new Map<number, typeof missions>();

    missions.forEach((m) => {
      if (!map.has(m.year)) map.set(m.year, []);
      map.get(m.year)!.push(m);
    });

    return Array.from(map.entries());
  }, []);

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

      {/* ---------------- HUD ---------------- */}
      <header className="hud">
        <div>STATUS: ONLINE</div>
        <div>RAMZI ZIRIAT // EXPLORATION SYSTEM</div>
        <div>{utc}</div>
        <div className="hudStats">{flightHours.toFixed(1)}h FLIGHT</div>
      </header>

      {/* ---------------- SIDEBAR ---------------- */}
      <aside className="sidebar">
        {["HOME", "MISSION", "TIMELINE", "LAB", "MAP"].map((s, i) => (
          <div
            key={s}
            className={`dot ${page === i ? "active" : ""}`}
            onClick={() => setPage(i)}
          />
        ))}
      </aside>

      {/* ---------------- VIEWPORT ---------------- */}
      <div className="viewport" style={{ transform: `translateY(-${page * 100}vh)` }}>

        {/* ---------------- HOME ---------------- */}
        <section className="section">
          <h1 className="bigTitle">{flightHours.toFixed(1)}h</h1>

          <p className="subtitle">
            Astrophysics · Cosmology · Philosophy · Aerospace Exploration
          </p>

          <div className="cards">
            <div className="card">
              <h3>FLIGHT HOURS</h3>
              <p className="big">{flightHours.toFixed(1)}h</p>
            </div>

            <div className="card">
              <h3>ACADEMIC TRACK</h3>
              <p>M2 Astro + M2 Cosmo + Philosophy</p>
            </div>

            <div className="card">
              <h3>EXPERIENCE</h3>
              <p>{experience.toFixed(1)} YEARS ACTIVE</p>
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
                Multi-domain research combining astrophysics,
                cosmology, philosophy of science and aerospace engineering.
              </p>

              <p>
                Axes: AERO · COSMO · ASTRO · EXPLORATION
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

            {groupedTimeline.map(([year, events], i) => (
              <div
                key={year}
                className="node"
                style={{ left: `${(i / (groupedTimeline.length - 1)) * 100}%` }}
                onClick={() => {
                  setTimelineOpen(i);
                  setTimelineIndex(0);
                }}
              >
                <div className="dotNode" />
                <span className="year">{year}</span>

                {timelineOpen === i && (
                  <div className="popup">

                    <h3>{events[timelineIndex].title}</h3>
                    <p>{events[timelineIndex].desc}</p>

                    {/* SLIDER DOTS */}
                    <div className="dots">
                      {events.map((_, idx) => (
                        <div
                          key={idx}
                          className={`miniDot ${idx === timelineIndex ? "active" : ""}`}
                          onClick={() => setTimelineIndex(idx)}
                        />
                      ))}
                    </div>

                  </div>
                )}
              </div>
            ))}

          </div>
        </section>

        {/* ---------------- LAB ---------------- */}
        <section className="section">
          <h2>AEROSPACE SYSTEMS</h2>

          <div className="lab">

            <div className="panel clickable">
              <h3>ONERA</h3>
              <p>Aerodynamics & propulsion research</p>
            </div>

            <div className="panel clickable">
              <h3>CNES</h3>
              <p>Space missions & orbital systems</p>
            </div>

            <div className="panel clickable">
              <h3>IPSA PROPULSION</h3>
              <p>Engineering & flight systems</p>
            </div>

            <div className="panel clickable">
              <h3>RESEARCH LABS</h3>
              <p>LPC2E / APC / L2C collaborations</p>
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