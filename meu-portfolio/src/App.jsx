import { useEffect, useState } from "react";
import * as Tone from "tone";
import {
  ArrowDownRight,
  ArrowUpRight,
  Mail,
  Menu,
  X,
  Music2,
  Trophy,
  Radio,
  Sun,
  Moon,
  Play,
  RotateCcw,
  Globe,
} from "lucide-react";
import "./App.css";

const experiences = [
  {
    company: "Blip · FanDuel",
    role: "Frontend Developer Intern",
    period: "16 JUN 2025 — 15 MAR 2026",
    description:
      "Worked on frontend features for FanDuel applications using React and TypeScript. Contributed to bug fixing and continuous UX improvements, used Git for version control, and worked within Agile practices.",
    descriptionPt:
      "Desenvolvimento de funcionalidades frontend para aplicações FanDuel utilizando React e TypeScript. Contributo para correção de bugs e melhorias contínuas de UX, utilização de Git para controlo de versões e integração em práticas Agile.",
    tags: ["React", "TypeScript", "HTML", "CSS", "Git", "Agile"],
  },
  {
    company: "GT3 CarSolutions",
    role: "Freelance Web Developer",
    period: "01 JAN — 01 MAR 2025",
    description:
      "Maintained the company website and implemented frontend updates using HTML, CSS and JavaScript.",
    descriptionPt:
      "Manutenção do website da empresa e implementação de atualizações de frontend utilizando HTML, CSS e JavaScript.",
    tags: ["HTML", "CSS", "JavaScript"],
  },
  {
    company: "RSW Motowear",
    role: "Freelance Web Developer",
    period: "21 JAN — 26 FEB 2024",
    description:
      "Fixed small website issues and adjusted product presentation and styling with CSS.",
    descriptionPt:
      "Resolução de pequenos problemas no website e ajuste da apresentação de produtos e estilização com CSS.",
    tags: ["CSS", "Website maintenance"],
  },
  {
    company: "Sportban",
    role: "Freelance Web Developer",
    period: "27 OCT — 22 NOV 2023",
    description:
      "Made website design changes using WordPress, PHP, HTML and CSS.",
    descriptionPt:
      "Alterações de design de website utilizando WordPress, PHP, HTML e CSS.",
    tags: ["WordPress", "PHP", "HTML", "CSS"],
  },
  {
    company: "i9project · Formação e eLearning",
    role: "Web Developer Intern",
    period: "01 JUL — 01 AUG 2023",
    description:
      "Helped maintain the company website and contributed to the development of a new corporate website using WordPress and PHP, with HTML, CSS, JavaScript and SQL.",
    descriptionPt:
      "Apoio na manutenção do website da empresa e contributo para o desenvolvimento de um novo website corporativo utilizando WordPress e PHP, com HTML, CSS, JavaScript e SQL.",
    tags: ["WordPress", "PHP", "JavaScript", "SQL"],
  },
];

const interests = [
  {
    title: "Music",
    titlePt: "Música",
    subtitle: "Drums & electric guitar",
    subtitlePt: "Bateria & guitarra elétrica",
    description:
      "I play drums and electric guitar. I enjoy the combination of timing, listening and practice — learning a part, finding the groove and getting the details right.",
    descriptionPt:
      "Toco bateria e guitarra elétrica. Gosto da combinação entre timing, escuta e prática — aprender uma parte, encontrar o groove e acertar nos detalhes.",
  },
  {
    title: "Sports",
    titlePt: "Desporto",
    subtitle: "NBA & NFL",
    subtitlePt: "NBA & NFL",
    description:
      "I like the tactical side of basketball and American football: spacing, matchups, play selection and how small decisions change the outcome.",
    descriptionPt:
      "Gosto do lado tático do basquetebol e do futebol americano: espaçamento, duelos, seleção de jogadas e como pequenas decisões mudam o desfecho.",
  },
  {
    title: "Live production",
    titlePt: "Produção Ao Vivo",
    subtitle: "Sound & lighting",
    subtitlePt: "Som & iluminação",
    description:
      "I'm learning more about live sound and lighting. This little playground lets you experiment with stage lights, their colour, angle and intensity.",
    descriptionPt:
      "Estou a aprender mais sobre som e iluminação ao vivo. Este pequeno laboratório permite experimentar luzes de palco, cor, ângulo e intensidade.",
  },
];

const drumPresets = {
  Rock: {
    kick: [0, 8], snare: [4, 12],
    hat: [0, 2, 4, 6, 8, 10, 12, 14],
  },
  "Hip-Hop": {
    kick: [0, 6, 10], snare: [4, 12],
    hat: [0, 2, 3, 6, 8, 10, 11, 14],
  },
  Funk: {
    kick: [0, 5, 8, 11], snare: [4, 12],
    hat: [0, 2, 4, 6, 8, 10, 12, 14],
  },
};

const makeEmptyPattern = () => ({
  kick: Array(16).fill(false),
  snare: Array(16).fill(false),
  hat: Array(16).fill(false),
});

const presetToPattern = (preset) => {
  const pattern = makeEmptyPattern();
  Object.entries(drumPresets[preset]).forEach(([instrument, steps]) => {
    steps.forEach((step) => { pattern[instrument][step] = true; });
  });
  return pattern;
};

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [lang, setLang] = useState("en"); // 'en' ou 'pt'
  const [activeInterest, setActiveInterest] = useState(0);

  const [lightColor, setLightColor] = useState("#c7f36b");
  const [lightIntensity, setLightIntensity] = useState(72);
  const [lightAngle, setLightAngle] = useState(42);
  const [lightPosition, setLightPosition] = useState(50);
  const [lightPreset, setLightPreset] = useState("Spot");

  const [patternName, setPatternName] = useState("Rock");
  const [drumPattern, setDrumPattern] = useState(() => presetToPattern("Rock"));
  const [playing, setPlaying] = useState(false);
  const [activeBeat, setActiveBeat] = useState(-1);
  const [bpm, setBpm] = useState(100);
  const [drumVolume, setDrumVolume] = useState(75);
  const [swing, setSwing] = useState(0);
  const [homeScore, setHomeScore] = useState(21);
  const [awayScore, setAwayScore] = useState(17);
  const [sport, setSport] = useState("NBA");
  const [playCall, setPlayCall] = useState(
    lang === "pt" ? "Escolhe uma jogada para ver a ideia." : "Pick a play to see the idea."
  );

  useEffect(() => {
    const elements = document.querySelectorAll("[data-reveal]");
    if (!("IntersectionObserver" in window)) {
      elements.forEach((element) => element.classList.add("is-visible"));
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!playing) {
      setActiveBeat(-1);
      return;
    }

    let kick, snare, hat;
    let sequence;

    const setup = () => {
      Tone.Transport.stop();
      Tone.Transport.cancel();
      Tone.Transport.bpm.value = bpm;
      Tone.Transport.swing = swing / 100;

      const master = new Tone.Gain(drumVolume / 100).toDestination();
      kick = new Tone.MembraneSynth({
        pitchDecay: 0.04,
        octaves: 6,
        oscillator: { type: "sine" },
        envelope: { attack: 0.001, decay: 0.22, sustain: 0.01, release: 0.18 },
      }).connect(master);
      snare = new Tone.NoiseSynth({
        noise: { type: "white" },
        envelope: { attack: 0.001, decay: 0.16, sustain: 0 },
      }).connect(master);
      hat = new Tone.MetalSynth({
        frequency: 250,
        envelope: { attack: 0.001, decay: 0.045, release: 0.01 },
        harmonicity: 5.1,
        modulationIndex: 32,
        resonance: 4000,
        octaves: 1.5,
      }).connect(master);

      sequence = new Tone.Sequence((time, index) => {
        setActiveBeat(index);
        if (drumPattern.kick[index]) kick.triggerAttackRelease("C1", "8n", time, 0.95);
        if (drumPattern.snare[index]) snare.triggerAttackRelease("16n", time, 0.75);
        if (drumPattern.hat[index]) hat.triggerAttackRelease("32n", time, 0.35);
      }, Array.from({ length: 16 }, (_, index) => index), "16n");
      sequence.start(0);
      Tone.Transport.start();
    };

    setup();
    return () => {
      Tone.Transport.stop();
      Tone.Transport.cancel();
      sequence?.dispose();
      kick?.dispose();
      snare?.dispose();
      hat?.dispose();
    };
  }, [playing, drumPattern, bpm, drumVolume, swing]);

  async function startDrumMachine() {
    try {
      await Tone.start();
      setPlaying(true);
    } catch (error) {
      console.error("Could not start audio:", error);
    }
  }

  function closeMenu() {
    setMenuOpen(false);
  }

  function playCallFor(play) {
    const descriptionsEn = {
      "Quick pass": sport === "NFL"
        ? "A short, fast throw can beat pressure before the defence resets."
        : "In basketball terms: move the ball quickly and take the open look.",
      "Run / drive": sport === "NFL"
        ? "A run attacks the gaps and forces the defence to commit."
        : "A drive collapses the defence and can create a pass or a finish at the rim.",
      "Deep shot": sport === "NFL"
        ? "A deep route stretches the field, but needs timing and protection."
        : "A three-pointer changes the spacing and can swing momentum quickly.",
    };
    const descriptionsPt = {
      "Quick pass": sport === "NFL"
        ? "Um passe curto e rápido pode bater a pressão antes da defesa reorganizar-se."
        : "Em termos de basquetebol: move a bola rapidamente e aproveita o lançamento livre.",
      "Run / drive": sport === "NFL"
        ? "Uma jogada de corrida ataca os espaços e obriga a defesa a comprometer-se."
        : "Uma penetração colapsa a defesa e pode criar um passe ou finalização junto ao cesto.",
      "Deep shot": sport === "NFL"
        ? "Uma rota profunda estica o campo, mas precisa de timing e proteção."
        : "Um lançamento de três pontos altera o espaçamento e pode virar o momento do jogo.",
    };
    const descriptions = lang === "pt" ? descriptionsPt : descriptionsEn;
    setPlayCall(descriptions[play]);
  }

  return (
    <main className={`portfolio ${darkMode ? "dark-mode" : ""}`} id="top">
      <header className="site-header">
        <a className="logo" href="#top" onClick={closeMenu}>JS<span>.</span></a>
        <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle navigation">
          {menuOpen ? <X /> : <Menu />}
        </button>
        <nav className={menuOpen ? "navigation open" : "navigation"}>
          <a href="#experience" onClick={closeMenu}>{lang === "pt" ? "Experiência" : "Experience"}</a>
          <a href="#about" onClick={closeMenu}>{lang === "pt" ? "Além do ecrã" : "Beyond the screen"}</a>
          <a href="#toolkit" onClick={closeMenu}>{lang === "pt" ? "Competências" : "Toolkit"}</a>
          <a className="contact-button" href="#contact" onClick={closeMenu}>{lang === "pt" ? "Vamos falar" : "Let's talk"} <ArrowUpRight size={16} /></a>
        </nav>
        
        {/* GRUPO DE CONTROLOS (IDIOMA + TEMA) */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          {/* BOTÃO DE IDIOMA PT / EN */}
          <button 
            onClick={() => {
              const newLang = lang === "en" ? "pt" : "en";
              setLang(newLang);
              setPlayCall(newLang === "pt" ? "Escolhe uma jogada para ver a ideia." : "Pick a play to see the idea.");
            }} 
            className="theme-toggle"
            aria-label="Change language"
            title="Mudar idioma / Change language"
          >
            <Globe size={17} />
            <span>{lang.toUpperCase()}</span>
          </button>
          {/* BOTÃO DE TEMA */}
          <button className="theme-toggle" onClick={() => setDarkMode(!darkMode)} aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"} title={darkMode ? "Light mode" : "Dark mode"}>
            {darkMode ? <Sun size={17} /> : <Moon size={17} />}
            <span>{darkMode ? (lang === "pt" ? "Claro" : "Light") : (lang === "pt" ? "Escuro" : "Dark")}</span>
          </button>
        </div>
      </header>

      <section className="hero page-width">
        <div className="hero-label" data-reveal>
          <span className="status-dot" /> SOFTWARE DEVELOPER <span className="hero-label-line" /> PORTUGAL
        </div>
        <div className="hero-layout">
          <div className="hero-main" data-reveal>
            <h1>João Francisco<br /><em>Sousa.</em></h1>
            <div className="hero-intro">
              <p>
                {lang === "pt"
                  ? "Desenvolvedor de software com formação em Engenharia Informática no ISEP. Gosto de construir para a web, aprender fazendo e trabalhar em equipa."
                  : "Software developer with a background in Computer Engineering at ISEP. I enjoy building for the web, learning by doing and working with people."}
              </p>
              <a className="round-button" href="#experience" aria-label="Explore experience"><ArrowDownRight /></a>
            </div>
          </div>
          <aside className="hero-aside" data-reveal>
            <span className="eyebrow">{lang === "pt" ? "UM POUCO SOBRE MIM" : "A LITTLE ABOUT ME"}</span>
            <p>
              {lang === "pt"
                ? "Trabalhei em funcionalidades frontend e projetos web, desde React e TypeScript até sites baseados em WordPress. Fora do código, encontro-me habitualmente ligado à música, a ver NBA ou NFL, ou a aprender sobre som e iluminação ao vivo."
                : "I've worked on frontend features and website projects, from React and TypeScript to WordPress-based sites. Outside code, you'll usually find me with music, watching the NBA or NFL, or learning about live sound and lighting."}
            </p>
            <div className="aside-details">
              <span>{lang === "pt" ? "Com base em Portugal" : "Based in Portugal"}</span>
              <span>{lang === "pt" ? "Disponível para novos projetos ↗" : "Open to new opportunities ↗"}</span>
            </div>
          </aside>
        </div>
        <div className="marquee">
          <div className="marquee-track">
            {Array.from({ length: 4 }).map((_, index) => (
              <span key={index}>FRONTEND DEVELOPMENT <b>✳</b> MUSIC & RHYTHM <b>✳</b> LIVE PRODUCTION <b>✳</b> NBA / NFL <b>✳</b></span>
            ))}
          </div>
        </div>
      </section>

      <section className="section page-width experience-section" id="experience">
        <div className="section-heading" data-reveal>
          <div><span className="eyebrow">01 / EXPERIENCE</span><h2>{lang === "pt" ? "Onde tenho " : "Where I've "}<em>{lang === "pt" ? "estado." : "been."}</em></h2></div>
          <p>{lang === "pt" ? "Experiência real, desde estágio em frontend a trabalho web freelance." : "Real experience, from a frontend internship to freelance website work."}</p>
        </div>
        <div className="experience-list">
          {experiences.map((experience, index) => (
            <article className="experience-row" key={experience.company} data-reveal>
              <span className="experience-number">{String(index + 1).padStart(2, "0")}</span>
              <div className="experience-content">
                <div className="experience-title"><h3>{experience.company}</h3><span>{experience.period}</span></div>
                <strong className="experience-role">{experience.role}</strong>
                <p>{lang === "pt" ? experience.descriptionPt : experience.description}</p>
                <div className="skill-tags">{experience.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
              </div>
              <ArrowUpRight className="row-arrow" size={20} />
            </article>
          ))}
        </div>
        <p className="cv-note">{lang === "pt" ? "Datas e descrições baseadas no meu CV." : "Dates and descriptions based on my CV."}</p>
      </section>

      <section className="about-section" id="about">
        <div className="page-width about-inner">
          <div className="about-heading" data-reveal>
            <span className="eyebrow">02 / BEYOND THE SCREEN</span>
            <h2>{lang === "pt" ? "Outras coisas que me " : "Other things that make me "}<em>{lang === "pt" ? "definem." : "me."}</em></h2>
            <p>{lang === "pt" ? "Não apenas uma lista de hobbies. Escolhe um interesse e experimenta uma versão interativa." : "Not just a list of hobbies. Pick an interest and play around with a small interactive version of it."}</p>
          </div>

          <div className="interest-layout" data-reveal>
            <div className="interest-tabs" role="tablist" aria-label="My interests">
              {interests.map((interest, index) => {
                const Icon = [Music2, Trophy, Radio][index];
                return (
                  <button key={interest.title} className={activeInterest === index ? "interest-tab active" : "interest-tab"} onClick={() => setActiveInterest(index)} role="tab" aria-selected={activeInterest === index}>
                    <span>0{index + 1}</span><Icon size={19} /><strong>{lang === "pt" ? interest.titlePt : interest.title}</strong><ArrowUpRight className="tab-arrow" size={17} />
                  </button>
                );
              })}
            </div>

            <div className="interest-detail" role="tabpanel">
              <div className="interest-detail-label"><span>0{activeInterest + 1} / 03</span><span><i /> {lang === "pt" ? "LABORATÓRIO INTERATIVO" : "INTERACTIVE PLAYGROUND"}</span></div>

              {activeInterest === 0 && (
                <div className="playground music-playground">
                  <div className="music-topline"><span>DRUM MACHINE / 16 STEPS</span><span className={playing ? "audio-status playing" : "audio-status"}>{playing ? (lang === "pt" ? "● A REPRODUZIR" : "● PLAYING") : (lang === "pt" ? "○ PRONTO" : "○ READY")}</span></div>
                  <div className="drum-presets">
                    {Object.keys(drumPresets).map((preset) => (
                      <button key={preset} className={patternName === preset ? "selected" : ""} onClick={() => { setPatternName(preset); setDrumPattern(presetToPattern(preset)); }}>{preset}</button>
                    ))}
                  </div>
                  <div className="beat-grid">
                    {Array.from({ length: 16 }).map((_, beat) => (
                      <div className={`beat-column ${activeBeat === beat ? "beat-current" : ""} ${beat % 4 === 0 ? "beat-bar-start" : ""}`} key={beat}>
                        <span className="beat-number">{beat + 1}</span>
                        {["kick", "snare", "hat"].map((instrument) => (
                          <button
                            key={instrument}
                            className={`beat-pad ${instrument} ${drumPattern[instrument][beat] ? "on" : ""}`}
                            aria-label={`${instrument} step ${beat + 1}`}
                            aria-pressed={drumPattern[instrument][beat]}
                            onClick={() => setDrumPattern((current) => ({ ...current, [instrument]: current[instrument].map((value, index) => index === beat ? !value : value) }))}
                            title={`${instrument} · step ${beat + 1}`}
                          >{instrument === "kick" ? "K" : instrument === "snare" ? "S" : "H"}</button>
                        ))}
                      </div>
                    ))}
                  </div>
                  <div className="drum-settings">
                    <label>BPM <strong>{bpm}</strong><input aria-label="Tempo in beats per minute" type="range" min="60" max="180" value={bpm} onChange={(event) => setBpm(Number(event.target.value))} /></label>
                    <label>{lang === "pt" ? "Volume" : "Volume"} <strong>{drumVolume}%</strong><input aria-label="Drum volume" type="range" min="5" max="100" value={drumVolume} onChange={(event) => setDrumVolume(Number(event.target.value))} /></label>
                    <label>Swing <strong>{swing}%</strong><input aria-label="Rhythm swing" type="range" min="0" max="60" value={swing} onChange={(event) => setSwing(Number(event.target.value))} /></label>
                  </div>
                  <div className="music-controls">
                    <button className="control-primary" onClick={() => playing ? setPlaying(false) : startDrumMachine()}>{playing ? <><span className="stop-square" /> {lang === "pt" ? "Parar ritmo" : "Stop rhythm"}</> : <><Play size={14} /> {lang === "pt" ? "Tocar ritmo" : "Play rhythm"}</>}</button>
                    <button className="control-secondary" onClick={() => { setPlaying(false); setPatternName("Rock"); setDrumPattern(presetToPattern("Rock")); setBpm(100); setDrumVolume(75); setSwing(0); }}><RotateCcw size={14} /> {lang === "pt" ? "Repor" : "Reset"}</button>
                    <span>{patternName} · 4/4</span>
                  </div>
                  <p className="playground-hint">{lang === "pt" ? "Clica nos pads para criar o teu ritmo. O som começa após pressionar Tocar; usa auscultadores para melhor experiência." : "Click the pads to build your beat. Sound starts after you press Play; use headphones for the best experience."}</p>
                </div>
              )}

              {activeInterest === 1 && (
                <div className="playground sports-playground">
                  <div className="sports-scoreboard">
                    <div className="score-topline"><span>{lang === "pt" ? "SIMULADOR DE JOGO" : "GAME SIMULATOR"}</span><span>Q4 · 02:14</span></div>
                    <div className="score-teams"><div><span>{sport === "NBA" ? (lang === "pt" ? "CASA" : "HOME COURT") : (lang === "pt" ? "EQUIPA DA CASA" : "HOME TEAM")}</span><strong>{homeScore}</strong></div><b>—</b><div><span>{sport === "NBA" ? (lang === "pt" ? "FORA" : "AWAY COURT") : (lang === "pt" ? "EQUIPA VISITANTE" : "AWAY TEAM")}</span><strong>{awayScore}</strong></div></div>
                    <div className="score-sport-toggle">
                      {["NBA", "NFL"].map((name) => <button key={name} className={sport === name ? "selected" : ""} onClick={() => { setSport(name); setPlayCall(lang === "pt" ? "Escolhe uma jogada para ver a ideia." : "Pick a play to see the idea."); }}>{name}</button>)}
                    </div>
                  </div>
                  <div className="play-call-buttons">
                    {[
                      { en: "Quick pass", pt: lang === "pt" ? "Passe rápido" : "Quick pass" },
                      { en: "Run / drive", pt: lang === "pt" ? "Corrida / penetração" : "Run / drive" },
                      { en: "Deep shot", pt: lang === "pt" ? "Lançamento longo" : "Deep shot" }
                    ].map((play) => <button key={play.en} onClick={() => playCallFor(play.en)}>{play.pt}<ArrowUpRight size={14} /></button>)}
                  </div>
                  <p className="play-description">{playCall}</p>
                  <div className="score-controls"><span>{lang === "pt" ? "Ajustar pontuação" : "Adjust score"}</span><div><button onClick={() => setHomeScore(Math.max(0, homeScore - 1))}>−</button><button onClick={() => setHomeScore(homeScore + 1)}>HOME +</button><button onClick={() => setAwayScore(Math.max(0, awayScore - 1))}>−</button><button onClick={() => setAwayScore(awayScore + 1)}>AWAY +</button></div></div>
                  <p className="playground-hint">{lang === "pt" ? "Placar fictício e simulação de jogadas — sem dados desportivos reais." : "A fictional scoreboard and play-call interaction — not live sports data."}</p>
                </div>
              )}

              {activeInterest === 2 && (
                <div className="playground lighting-playground">
                  <div className="stage-preview" style={{ "--beam-color": lightColor, "--beam-opacity": lightIntensity / 100, "--beam-angle": `${lightAngle - 45}deg`, "--beam-position": `${lightPosition}%` }}>
                    <div className={`stage-beam ${lightPreset.toLowerCase().replace(" ", "-")}`} />
                    <div className="stage-beam stage-beam-secondary" />
                    <div className="stage-haze" />
                    <div className="stage-backline"><span /><span /><span /></div>
                    <div className="stage-floor" />
                    <span className="stage-preview-label">{lang === "pt" ? "PRÉ-VISUALIZAÇÃO AO VIVO / PALCO" : "LIVE / STAGE PREVIEW"}</span>
                  </div>
                  <div className="light-controls-panel">
                    <div className="light-control-row"><label htmlFor="light-color">{lang === "pt" ? "Cor" : "Colour"}</label><div className="color-swatches">{["#c7f36b", "#70b7ff", "#ff7d9c", "#c69bff", "#ffb45e", "#f4f3ee"].map((color) => <button key={color} aria-label={`Set light colour ${color}`} className={lightColor === color ? "swatch selected" : "swatch"} style={{ background: color }} onClick={() => setLightColor(color)} />)}</div></div>
                    <div className="light-control-row"><label htmlFor="light-intensity">{lang === "pt" ? "Intensidade" : "Intensity"} <span>{lightIntensity}%</span></label><input id="light-intensity" type="range" min="10" max="100" value={lightIntensity} onChange={(event) => setLightIntensity(Number(event.target.value))} /></div>
                    <div className="light-control-row"><label htmlFor="light-angle">{lang === "pt" ? "Ângulo" : "Angle"} <span>{lightAngle}°</span></label><input id="light-angle" type="range" min="0" max="90" value={lightAngle} onChange={(event) => setLightAngle(Number(event.target.value))} /></div>
                    <div className="light-control-row"><label htmlFor="light-position">{lang === "pt" ? "Posição" : "Position"} <span>{lightPosition}%</span></label><input id="light-position" type="range" min="5" max="95" value={lightPosition} onChange={(event) => setLightPosition(Number(event.target.value))} /></div>
                    <div className="light-control-row"><label>{lang === "pt" ? "Tipo" : "Fixture"}</label><div className="fixture-options">{["Spot", "Wash", "Wide beam"].map((preset) => <button key={preset} className={lightPreset === preset ? "selected" : ""} onClick={() => setLightPreset(preset)}>{preset}</button>)}</div></div>
                  </div>
                  <p className="playground-hint">{lang === "pt" ? "Experimenta com uma luz de palco simulada. Os controlos alteram apenas a pré-visualização visual." : "Experiment with a simulated stage light. The controls change the visual preview only."}</p>
                </div>
              )}

              <div className="interest-copy">
                <span>{lang === "pt" ? interests[activeInterest].subtitlePt : interests[activeInterest].subtitle}</span>
                <h3>{lang === "pt" ? interests[activeInterest].titlePt : interests[activeInterest].title}<em>.</em></h3>
                <p>{lang === "pt" ? interests[activeInterest].descriptionPt : interests[activeInterest].description}</p>
              </div>
            </div>
          </div>
          <div className="about-footnote"><span className="footnote-dot" /> {lang === "pt" ? "Algumas coisas de que gosto fora do ecrã." : "A few things I enjoy away from the screen."}</div>
        </div>
      </section>

      <section className="section page-width toolkit-section" id="toolkit">
        <div className="section-heading" data-reveal>
          <div><span className="eyebrow">03 / TOOLKIT</span><h2>{lang === "pt" ? "Ferramentas do " : "Tools of the "}<em>{lang === "pt" ? "ofício." : "trade."}</em></h2></div>
          <span className="toolkit-mark">{"</>"}</span>
        </div>
        <div className="toolkit-grid" data-reveal>
          <article><span>01</span><h3>Frontend</h3><p>React · TypeScript · JavaScript · HTML · CSS</p></article>
          <article><span>02</span><h3>Web & CMS</h3><p>WordPress · PHP · SQL</p></article>
          <article><span>03</span><h3>{lang === "pt" ? "Desenvolvimento" : "Development"}</h3><p>{lang === "pt" ? "Git · Métodos Agile · Debugging · Melhorias de UX" : "Git · Agile methods · Debugging · UX improvements"}</p></article>
          <article><span>04</span><h3>{lang === "pt" ? "Também a aprender" : "Also learning"}</h3><p>{lang === "pt" ? "Som ao vivo · Iluminação · Produção de palco" : "Live sound · Lighting · Stage production"}</p></article>
        </div>
        <p className="cv-note">{lang === "pt" ? "Outros detalhes do CV incluem certificados em Java, AWS Cloud Computing e Python." : "Other CV details include Java, AWS Cloud Computing and Python certificates."}</p>
      </section>

      <footer className="contact-section page-width" id="contact">
        <div className="contact-top" data-reveal><span className="eyebrow">04 / CONTACT</span><span className="availability"><i /> {lang === "pt" ? "DISPONÍVEL PARA OPORTUNIDADES" : "OPEN TO OPPORTUNITIES"}</span></div>
        <h2 data-reveal>{lang === "pt" ? "Tens alguma ideia " : "Have something "}<em>{lang === "pt" ? "interessante?" : "good in mind?"}</em></h2>
        <div className="contact-content" data-reveal>
          <a className="email-button" href="mailto:xicosouza2003@gmail.com"><Mail size={18} /> xicosouza2003@gmail.com <ArrowUpRight size={19} /></a>
          <p>{lang === "pt" ? "Terei todo o gosto em conversar sobre funções de frontend, colaboração ou um novo desafio." : "I'd be happy to talk about frontend roles, collaboration or a new challenge."}</p>
        </div>
        <div className="footer-bottom">
          <a className="logo" href="#top">JS<span>.</span></a>
          <span>© 2026 João Francisco Sousa</span>
          <div className="social-links">
            <a href="https://www.linkedin.com/in/jo%C3%A3o-francisco-sousa-a86057264/" target="_blank" rel="noreferrer" aria-label="LinkedIn" className="linkedin-text">in</a>
            <a href="https://github.com/FranciscoSousa0112" target="_blank" rel="noreferrer" aria-label="GitHub" className="github-text">GH</a>
          </div>
          <a href="#top">{lang === "pt" ? "VOLTAR AO TOPO ↑" : "BACK TO TOP ↑"}</a>
        </div>
      </footer>
    </main>
  );
}