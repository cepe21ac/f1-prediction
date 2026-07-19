import React, { useState, useEffect } from 'react';

const DRIVERS = ["Piastri", "Norris", "Hamilton", "Leclerc", "Russell", "Antonelli", "Verstappen", "Lindblad", "Alonso", "Stroll", "Gasly", "Colapinto", "Albon", "Sainz", "Ocon", "Bearman", "Hulkenberg", "Bortoleto", "Bottas", "Lawson", "Hadjar", "Perez"];
const SESSIONS = ["Q1", "Q2", "Q3"];
const CIRCUITS = ["Australia", "China", "Monaco", "Bahrain", "Jeddah", "Miami", "Imola", "Barcelona", "Silverstone", "Monza", "Madrid", "Canada", "Austria", "Japan", "Singapore", "Spa", "Hungary", "Netherlands", "Baku", "Austin", "Mexico", "Brazil", "Las Vegas", "Qatar", "Abu Dhabi", "Turkey"];
const CONDITIONS = ["Dry", "Wet"];
const COMPOUNDS = ["Soft", "Medium", "Hard", "Inter", "Wet"];
const TYRE_STATUSES = ["New", "Used"];

const COMPOUND_COLORS = {
  Soft: "#FF3333",
  Medium: "#FFD700",
  Hard: "#F5F5F5",
  Inter: "#00B140",
  Wet: "#0090FF"
};

const EXAMPLES = [
  { label: "Verstappen dry Q3 pole lap", driver: "Verstappen", session: "Q3", circuit: "Spa", condition: "Dry", compound: "Soft", tyreStatus: "New", firstStint: "1:41.200" },
  { label: "Leclerc Monaco magic", driver: "Leclerc", session: "Q3", circuit: "Monaco", condition: "Dry", compound: "Soft", tyreStatus: "Used", firstStint: "1:11.400" },
  { label: "Hamilton wet Silverstone Q2", driver: "Hamilton", session: "Q2", circuit: "Silverstone", condition: "Wet", compound: "Inter", tyreStatus: "New", firstStint: "1:32.800" },
  { label: "Norris Monza slipstream lap", driver: "Norris", session: "Q3", circuit: "Monza", condition: "Dry", compound: "Soft", tyreStatus: "New", firstStint: "1:19.600" },
];

function computeEffect(condition, session, compound, tyreStatus, circuit) {
  let e;
  if (condition === "Dry" && session === "Q1" && compound === "Hard") e = 0.20;
  else if (condition === "Dry" && session === "Q1" && compound === "Medium") e = 0.35;
  else if (condition === "Dry" && session === "Q1" && compound === "Soft") e = 0.40;
  else if (condition === "Dry" && session === "Q2" && compound === "Hard") e = 0.15;
  else if (condition === "Dry" && session === "Q2" && compound === "Medium") e = 0.20;
  else if (condition === "Dry" && session === "Q2" && compound === "Soft") e = 0.30;
  else if (condition === "Dry" && session === "Q3" && compound === "Hard") e = 0.05;
  else if (condition === "Dry" && session === "Q3" && compound === "Medium") e = 0.10;
  else if (condition === "Dry" && session === "Q3" && compound === "Soft") e = 0.15;
  else if (condition === "Wet" && compound === "Inter") e = 0.25;
  else if (condition === "Wet" && compound === "Wet") e = 0.15;
  else e = 0.20;
  if (tyreStatus === "Used") e += 0.15;
  return e;
}

function parseTime(str) {
  const s = String(str).trim();
  if (!s) return NaN;
  if (s.includes(":")) {
    const parts = s.split(":");
    return parseInt(parts[0], 10) * 60 + parseFloat(parts[1]);
  }
  return parseFloat(s);
}

function formatTime(sec) {
  if (isNaN(sec) || sec < 0) return "--:--.---";
  const m = Math.floor(sec / 60);
  const s = sec - m * 60;
  return `${m}:${s.toFixed(3).padStart(6, "0")}`;
}

const SANS = { fontFamily: "'Titillium Web', system-ui, -apple-system, sans-serif" };
const MONO = { fontFamily: "'JetBrains Mono', ui-monospace, 'Courier New', monospace" };

function Nav({ active, onNav }) {
  const items = [
    { id: "home", label: "Home" },
    { id: "predictor", label: "Predictor" },
    { id: "examples", label: "Examples" },
    { id: "methodology", label: "Methodology" },
    { id: "about", label: "About" }
  ];
  return (
    <nav className="sticky top-0 z-50 bg-black border-b border-neutral-900 backdrop-blur">
      <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
        <button onClick={() => onNav("home")} className="flex items-center gap-2 cursor-pointer">
          <div className="w-1 h-6 bg-red-600" />
          <span className="font-black text-sm uppercase tracking-widest">Apex Predict</span>
        </button>
        <div className="flex gap-1">
          {items.map(item => (
            <button
              key={item.id}
              onClick={() => onNav(item.id)}
              className={`px-3 py-1.5 text-xs uppercase tracking-widest font-semibold transition ${active === item.id ? "text-white bg-red-600" : "text-neutral-500 hover:text-white"}`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}

function Hero({ onStart }) {
  return (
    <section className="relative overflow-hidden border-b border-neutral-900">
      <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "repeating-linear-gradient(90deg, transparent 0 40px, #1a1a1a 40px 41px), repeating-linear-gradient(0deg, transparent 0 40px, #1a1a1a 40px 41px)" }} />
      <div className="absolute top-0 left-0 w-full h-1 bg-red-600" />
      <div className="relative max-w-6xl mx-auto px-6 py-24 md:py-32">
        <div className="inline-flex items-center gap-2 px-3 py-1 border border-red-600 text-red-500 text-xs uppercase tracking-widest font-bold mb-6">
          <span className="w-1.5 h-1.5 bg-red-600 rounded-full animate-pulse" />
          Qualifying Model · Live
        </div>
        <h1 className="text-5xl md:text-7xl font-black uppercase leading-none tracking-tight mb-6">
          Predict the<br />
          <span className="text-red-600">second stint.</span>
        </h1>
        <p className="text-neutral-400 text-lg md:text-xl max-w-2xl mb-10 leading-relaxed">
          Punch in the driver, the circuit, the conditions, the tyre, and a first flying-lap time. Get a predicted improvement for the second stint. Built for fans who want to game out the last three minutes of qualifying before it airs.
        </p>
        <div className="flex flex-wrap gap-3">
          <button onClick={onStart} className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 text-sm uppercase tracking-widest font-bold transition">
            Try the Predictor →
          </button>
          <a href="https://github.com/cepe21ac/f1-qualifying-predictor" target="_blank" rel="noopener noreferrer" className="border border-neutral-700 hover:border-white text-white px-6 py-3 text-sm uppercase tracking-widest font-bold transition">
            View Source
          </a>
        </div>
        <div className="mt-16 grid grid-cols-3 gap-4 max-w-2xl">
          <Stat number="22" label="Drivers" />
          <Stat number="26" label="Circuits" />
          <Stat number="5" label="Compounds" />
        </div>
      </div>
    </section>
  );
}

function Stat({ number, label }) {
  return (
    <div className="border-l-2 border-red-600 pl-3">
      <div className="text-3xl font-black" style={MONO}>{number}</div>
      <div className="text-xs uppercase tracking-widest text-neutral-500 mt-1">{label}</div>
    </div>
  );
}

function Predictor({ preset }) {
  const [driver, setDriver] = useState("Norris");
  const [session, setSession] = useState("Q3");
  const [circuit, setCircuit] = useState("Monaco");
  const [condition, setCondition] = useState("Dry");
  const [compound, setCompound] = useState("Soft");
  const [tyreStatus, setTyreStatus] = useState("New");
  const [firstStint, setFirstStint] = useState("1:12.500");

  useEffect(() => {
    if (preset) {
      setDriver(preset.driver);
      setSession(preset.session);
      setCircuit(preset.circuit);
      setCondition(preset.condition);
      setCompound(preset.compound);
      setTyreStatus(preset.tyreStatus);
      setFirstStint(preset.firstStint);
    }
  }, [preset]);

  const firstStintSec = parseTime(firstStint);
  const effect = computeEffect(condition, session, compound, tyreStatus, circuit);
  const predicted = firstStintSec - effect;
  const valid = !isNaN(firstStintSec) && firstStintSec > 0;

  const selectClass = "w-full bg-neutral-900 border border-neutral-700 text-white px-3 py-2 text-sm uppercase tracking-wider focus:border-red-600 focus:outline-none cursor-pointer";
  const labelClass = "block text-neutral-400 text-xs uppercase tracking-widest mb-1.5 font-semibold";

  return (
    <section id="predictor" className="border-b border-neutral-900 py-20">
      <div className="max-w-6xl mx-auto px-6">
        <SectionHeader eyebrow="01 / Tool" title="The Predictor" subtitle="Set the scenario, hit predict. Model runs client-side, no lag." />

        <div className="grid md:grid-cols-2 gap-8 mt-10">
          <div className="space-y-4">
            <div>
              <label className={labelClass}>Driver</label>
              <select className={selectClass} value={driver} onChange={e => setDriver(e.target.value)}>
                {DRIVERS.map(d => <option key={d} value={d}>{d.toUpperCase()}</option>)}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Session</label>
                <select className={selectClass} value={session} onChange={e => setSession(e.target.value)}>
                  {SESSIONS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className={labelClass}>Condition</label>
                <select className={selectClass} value={condition} onChange={e => setCondition(e.target.value)}>
                  {CONDITIONS.map(c => <option key={c} value={c}>{c.toUpperCase()}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className={labelClass}>Circuit</label>
              <select className={selectClass} value={circuit} onChange={e => setCircuit(e.target.value)}>
                {CIRCUITS.map(c => <option key={c} value={c}>{c.toUpperCase()}</option>)}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Tyre Compound</label>
                <select
                  className={selectClass}
                  value={compound}
                  onChange={e => setCompound(e.target.value)}
                  style={{ borderLeftWidth: 4, borderLeftColor: COMPOUND_COLORS[compound] }}
                >
                  {COMPOUNDS.map(c => <option key={c} value={c}>{c.toUpperCase()}</option>)}
                </select>
              </div>
              <div>
                <label className={labelClass}>Tyre Status</label>
                <select className={selectClass} value={tyreStatus} onChange={e => setTyreStatus(e.target.value)}>
                  {TYRE_STATUSES.map(t => <option key={t} value={t}>{t.toUpperCase()}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className={labelClass}>First Stint Time</label>
              <input
                type="text"
                value={firstStint}
                onChange={e => setFirstStint(e.target.value)}
                placeholder="1:31.500 or 91.500"
                className="w-full bg-neutral-900 border border-neutral-700 text-white px-3 py-2 text-lg tracking-wider focus:border-red-600 focus:outline-none"
                style={MONO}
              />
              <p className="text-neutral-600 text-xs mt-1">Format: M:SS.mmm or seconds</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-neutral-950 border border-neutral-800 p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <div className="text-xs uppercase tracking-widest text-neutral-500">Driver</div>
                  <div className="text-2xl font-black uppercase">{driver}</div>
                </div>
                <div className="text-right">
                  <div className="text-xs uppercase tracking-widest text-neutral-500">Session</div>
                  <div className="text-2xl font-black">{session}</div>
                </div>
              </div>

              <div className="text-center py-6 border-y border-neutral-800">
                <div className="text-xs uppercase tracking-widest text-neutral-500 mb-2">Predicted 2nd Stint</div>
                <div className="text-5xl md:text-6xl font-bold text-white tabular-nums" style={MONO}>
                  {valid ? formatTime(predicted) : "--:--.---"}
                </div>
                {valid && (
                  <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 bg-purple-950 border border-purple-700 text-purple-300 text-sm font-bold" style={MONO}>
                    <span>▼</span>
                    <span>−{effect.toFixed(3)}s</span>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4 mt-6 text-sm">
                <div>
                  <div className="text-xs uppercase tracking-widest text-neutral-500">1st Stint</div>
                  <div className="text-lg" style={MONO}>{valid ? formatTime(firstStintSec) : "--:--.---"}</div>
                </div>
                <div>
                  <div className="text-xs uppercase tracking-widest text-neutral-500">Compound</div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <div className="w-3 h-3 rounded-full" style={{ background: COMPOUND_COLORS[compound] }} />
                    <span className="text-lg uppercase font-semibold">{compound}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Delta bar visualization */}
            {valid && (
              <div className="bg-neutral-950 border border-neutral-800 p-4">
                <div className="text-xs uppercase tracking-widest text-neutral-500 mb-3">Stint Comparison</div>
                <div className="space-y-2">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-neutral-400">1st Stint</span>
                      <span style={MONO}>{formatTime(firstStintSec)}</span>
                    </div>
                    <div className="w-full bg-neutral-900 h-2">
                      <div className="h-2 bg-neutral-600" style={{ width: "100%" }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-purple-400">2nd Stint (predicted)</span>
                      <span style={MONO}>{formatTime(predicted)}</span>
                    </div>
                    <div className="w-full bg-neutral-900 h-2">
                      <div className="h-2 bg-purple-500" style={{ width: `${Math.max(50, (predicted / firstStintSec) * 100)}%` }} />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function SectionHeader({ eyebrow, title, subtitle }) {
  return (
    <div>
      <div className="text-red-500 text-xs uppercase tracking-widest font-bold mb-2">{eyebrow}</div>
      <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tight mb-3">{title}</h2>
      {subtitle && <p className="text-neutral-500 max-w-2xl">{subtitle}</p>}
    </div>
  );
}

function Examples({ onLoad }) {
  return (
    <section id="examples" className="border-b border-neutral-900 py-20 bg-neutral-950">
      <div className="max-w-6xl mx-auto px-6">
        <SectionHeader eyebrow="02 / Scenarios" title="Preset Runs" subtitle="Click any card to load into the predictor above." />
        <div className="grid md:grid-cols-2 gap-4 mt-10">
          {EXAMPLES.map((ex, i) => {
            const eff = computeEffect(ex.condition, ex.session, ex.compound, ex.tyreStatus, ex.circuit);
            const first = parseTime(ex.firstStint);
            const pred = first - eff;
            return (
              <button
                key={i}
                onClick={() => onLoad(ex)}
                className="text-left bg-black border border-neutral-800 hover:border-red-600 p-5 transition group cursor-pointer"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs uppercase tracking-widest text-neutral-500 font-bold">Scenario 0{i + 1}</span>
                  <span className="text-xs text-red-500 opacity-0 group-hover:opacity-100 transition">Load →</span>
                </div>
                <div className="text-lg font-bold mb-3">{ex.label}</div>
                <div className="flex items-center gap-4 text-xs text-neutral-400 mb-3">
                  <span>{ex.circuit.toUpperCase()}</span>
                  <span>·</span>
                  <span>{ex.session}</span>
                  <span>·</span>
                  <span>{ex.condition.toUpperCase()}</span>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full" style={{ background: COMPOUND_COLORS[ex.compound] }} />
                    <span>{ex.compound.toUpperCase()} {ex.tyreStatus.toUpperCase()}</span>
                  </div>
                </div>
                <div className="flex items-end justify-between pt-3 border-t border-neutral-900">
                  <div>
                    <div className="text-xs uppercase tracking-widest text-neutral-600">Predicted</div>
                    <div className="text-2xl font-bold" style={MONO}>{formatTime(pred)}</div>
                  </div>
                  <div className="text-purple-400 text-sm font-bold" style={MONO}>−{eff.toFixed(3)}s</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Methodology() {
  return (
    <section id="methodology" className="border-b border-neutral-900 py-20">
      <div className="max-w-6xl mx-auto px-6">
        <SectionHeader eyebrow="03 / Under the hood" title="How it works" subtitle="Full transparency on the model — no black box." />

        <div className="grid md:grid-cols-3 gap-6 mt-10">
          <Card
            step="Step 01"
            title="Base gap"
            body="Every scenario has a baseline improvement (session × compound × condition). Softs in Q1 dry: −0.40s. Hards in Q3 dry: −0.05s. Wet inters: −0.25s."
          />
          <Card
            step="Step 02"
            title="Tyre penalty"
            body="Starting the second stint from used tyres adds +0.15s to the improvement (you had more grip in the bag). New tyres, no adjustment."
          />
          <Card
            step="Step 03"
            title="Circuit — not modelled"
            body="No circuit-specific coefficients yet. Every track is treated as average. Real circuit effects (Monaco vs Monza vs Spa) will land when the model is rebuilt on FastF1 telemetry."
          />
        </div>

        <div className="mt-10 bg-neutral-950 border border-neutral-800 p-6">
          <div className="text-xs uppercase tracking-widest text-neutral-500 font-bold mb-3">The formula</div>
          <div className="text-lg" style={MONO}>
            <span className="text-purple-400">predicted</span> = <span className="text-white">first_stint</span> − (<span className="text-red-400">base_gap</span> + <span className="text-yellow-400">tyre_penalty</span>)
          </div>
          <p className="text-neutral-500 text-sm mt-4 leading-relaxed">
            Model built by Cesare Pesci as an R script. Ported to JavaScript for this website — predictions are identical to the source model. This is a v1 for fun; a proper version would train a gradient-boosted model on real FastF1 telemetry with driver-specific coefficients.
          </p>
        </div>
      </div>
    </section>
  );
}

function Card({ step, title, body }) {
  return (
    <div className="border border-neutral-800 p-6 hover:border-red-600 transition">
      <div className="text-red-500 text-xs uppercase tracking-widest font-bold mb-3">{step}</div>
      <div className="text-xl font-bold mb-3">{title}</div>
      <p className="text-neutral-400 text-sm leading-relaxed">{body}</p>
    </div>
  );
}

function About() {
  return (
    <section id="about" className="border-b border-neutral-900 py-20 bg-neutral-950">
      <div className="max-w-6xl mx-auto px-6">
        <SectionHeader eyebrow="04 / Builder" title="About" subtitle={null} />
        <div className="mt-10 max-w-3xl">
          <p className="text-neutral-300 text-lg leading-relaxed mb-6">
            Apex Predict is a hobby project by <span className="text-white font-bold">Cesare Pesci</span> — a fan-side tool for gaming out F1 qualifying second stints before they happen.
          </p>
          <p className="text-neutral-400 leading-relaxed mb-4">
            The underlying model is a rule-based lap-time predictor written in R. It doesn't (yet) train on real F1 data — it encodes the intuition of what a second stint typically looks like across compounds, sessions, and conditions. Think of it less as a forecast and more as a sandbox: change one variable, see how the model thinks it should shift.
          </p>
          <p className="text-neutral-400 leading-relaxed mb-8">
            A future version will pull real historical laps from FastF1 and train a proper machine learning model with driver-specific effects. If that ships, it lives here.
          </p>
          <div className="flex flex-wrap gap-3">
            <a href="https://github.com/cepe21ac/f1-qualifying-predictor" target="_blank" rel="noopener noreferrer" className="border border-neutral-700 hover:border-white px-5 py-2 text-sm uppercase tracking-widest font-bold transition">
              GitHub Repo →
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="py-8 border-t border-neutral-900">
      <div className="max-w-6xl mx-auto px-6 flex flex-wrap items-center justify-between gap-4 text-xs text-neutral-600">
        <div className="flex items-center gap-3">
          <div className="w-1 h-4 bg-red-600" />
          <span>Apex Predict · Not affiliated with Formula 1, FIA, or any F1 team</span>
        </div>
        <span style={MONO}>v1.0 · Built by Cesare Pesci</span>
      </div>
    </footer>
  );
}

export default function Website() {
  const [active, setActive] = useState("home");
  const [preset, setPreset] = useState(null);

  const scrollTo = (id) => {
    setActive(id);
    if (id === "home") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const loadExample = (ex) => {
    setPreset({ ...ex, _key: Date.now() });
    setTimeout(() => scrollTo("predictor"), 50);
  };

  return (
    <div className="min-h-screen bg-black text-white" style={SANS}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Titillium+Web:wght@400;600;700;900&family=JetBrains+Mono:wght@400;700&display=swap');
        select { -webkit-appearance: none; appearance: none; background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'><path fill='%23888' d='M6 8L2 4h8z'/></svg>"); background-repeat: no-repeat; background-position: right 12px center; padding-right: 32px; }
        select option { background: #171717; color: white; }
        html { scroll-behavior: smooth; }
      `}</style>
      <Nav active={active} onNav={scrollTo} />
      <Hero onStart={() => scrollTo("predictor")} />
      <Predictor preset={preset} />
      <Examples onLoad={loadExample} />
      <Methodology />
      <About />
      <Footer />
    </div>
  );
}
