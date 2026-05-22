"use client";

import { aboutPage } from "@/content/site";
import Link from "next/link";
import "../../globals";
import { useEffect, useRef } from "react";
import { useStringTune } from "@/hooks/useStringTune";

export default function AboutPage() {
  const mainRef = useRef<HTMLElement>(null);

  useStringTune({ scrollMode: "default", fps: 60 });

  const paragraphs = aboutPage.intro.paragraphs;
  const stats = [
    { num: aboutPage.stats.stack.num, label: aboutPage.stats.stack.label },
    { num: aboutPage.stats.focus.num, label: aboutPage.stats.focus.label },
    { num: aboutPage.stats.langs.num, label: aboutPage.stats.langs.label },
  ];
  const focusItems = aboutPage.focus.items;
  const projects = aboutPage.projects.items;
  const techGroups = [
    { title: aboutPage.tech.frontend.title, items: aboutPage.tech.frontend.items },
    { title: aboutPage.tech.backend.title, items: aboutPage.tech.backend.items },
    { title: aboutPage.tech.tools.title, items: aboutPage.tech.tools.items },
  ];

  useEffect(() => {
    let killed = false;
    const cleanups: (() => void)[] = [];

    const init = async () => {
      const { gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      if (killed) return;
      gsap.registerPlugin(ScrollTrigger);

      document.querySelectorAll(".mystic-particle").forEach((p) => {
        gsap.to(p, {
          x: "random(-80vw, 80vw)", y: "random(-80vh, 80vh)",
          rotation: "random(-360, 360)", opacity: "random(0.05, 0.6)",
          scale: "random(0.5, 2)", duration: "random(10, 25)",
          ease: "none", repeat: -1, yoyo: true,
        });
      });

      gsap.to(".mystic-orb", {
        scale: "random(0.8, 1.3)", filter: "blur(random(40px, 100px))",
        duration: "random(3, 6)", ease: "sine.inOut", repeat: -1, yoyo: true, stagger: 0.5,
      });

      const heroTl = gsap.timeline({ delay: 0.1 });
      heroTl
        .set(".mystic-hero-wrap", { visibility: "visible" })
        .from(".hero-fade-in", {
          opacity: 0, filter: "blur(15px)", y: 40, scale: 0.9,
          duration: 1.8, stagger: 0.15, ease: "back.out(1.2)",
        })
        .to(".scroll-dot", { y: 15, opacity: 0, duration: 1, ease: "power2.in", repeat: -1 }, "-=1");

      gsap.utils.toArray<Element>(".sec-line").forEach((line) => {
        gsap.to(line, { backgroundPosition: "200% 0", duration: 3, ease: "none", repeat: -1 });
      });

      ScrollTrigger.create({
        trigger: ".mystic-stats-container",
        start: "top 80%", once: true,
        onEnter: () => {
          gsap.from(".mystic-stat", {
            opacity: 0, scale: 0.3, rotationY: 90, filter: "blur(15px)",
            duration: 1.8, stagger: 0.15, ease: "back.out(1.5)",
          });
          document.querySelectorAll(".mystic-stat").forEach((stat) => {
            gsap.to(stat, {
              y: "random(-8, 8)", rotationX: "random(-4, 4)", rotationY: "random(-4, 4)",
              duration: "random(2, 4)", repeat: -1, yoyo: true, ease: "sine.inOut",
            });
          });
        },
      });

      document.querySelectorAll(".project-card").forEach((card) => {
        const onMove = (e: Event) => {
          const me = e as MouseEvent;
          const rect = (card as HTMLElement).getBoundingClientRect();
          const x = (me.clientX - rect.left) / rect.width - 0.5;
          const y = (me.clientY - rect.top) / rect.height - 0.5;
          gsap.to(card, { rotationY: x * 12, rotationX: -y * 8, duration: 0.35, ease: "power2.out", overwrite: "auto" });
        };
        const onLeave = () => {
          gsap.to(card, { rotationY: 0, rotationX: 0, duration: 0.5, ease: "power2.out", overwrite: "auto" });
        };
        card.addEventListener("mousemove", onMove);
        card.addEventListener("mouseleave", onLeave);
        cleanups.push(() => {
          card.removeEventListener("mousemove", onMove);
          card.removeEventListener("mouseleave", onLeave);
        });
      });

      ScrollTrigger.refresh();
    };

    init().catch(console.error);
    return () => {
      killed = true;
      cleanups.forEach((fn) => fn());
      import("gsap/ScrollTrigger").then(({ ScrollTrigger }) => {
        ScrollTrigger.getAll().forEach((st) => st.kill());
      });
    };
  }, []);

  return (
    <>
      <style>{MYSTIC_STYLES}</style>
      <main ref={mainRef} className="mystic-root">

        {/* Sayfa scroll progress bar */}
        <div className="st-page-progress" data-string="progress" data-string-id="page-progress" aria-hidden="true" />

        {/* Arka plan */}
        <div className="mystic-orbs-container">
          <div className="mystic-orb orb-1" /><div className="mystic-orb orb-2" /><div className="mystic-orb orb-3" />
          {Array.from({ length: 30 }).map((_, i) => (
            <div key={i} className="mystic-particle" style={{
              width: `${Math.random() * 4 + 1}px`, height: `${Math.random() * 4 + 1}px`,
              left: `${Math.random() * 100}vw`, top: `${Math.random() * 100}vh`,
            }} />
          ))}
        </div>

        {/* HERO */}
        <section className="mystic-hero">
          <div className="mystic-hero-wrap" style={{ visibility: "hidden" }}>
            <div className="hero-top-nav hero-fade-in font-mono"
              data-string="impulse"
              data-string-strength="0.12"
              data-string-rotation-strength="0.25"
            >
              <span className="mystic-badge">[ 001 ] ETHER</span>
              <Link href="/" className="mystic-back-link">← {aboutPage.backHome}</Link>
            </div>

            <div className="hero-center-content">
              <p className="hero-eyebrow hero-fade-in font-mono">{aboutPage.orbitTag}</p>
              <h1 className="hero-title" data-string="split" data-string-split="chars">{aboutPage.orbitTitle}</h1>
              <div className="hero-line" />
              <p className="hero-subtitle hero-fade-in">{aboutPage.intro.headline}</p>
            </div>

            <div className="hero-bottom hero-fade-in font-mono">
              <div className="scroll-indicator">
                <div className="scroll-dot-container"><div className="scroll-dot" /></div>
                <span>SCROLL TO DESCEND</span>
              </div>
            </div>
          </div>
        </section>

        {/* BODY */}
        <div className="mystic-body">

          {/* 01 INTRO */}
          <section className="mystic-section">
            <div className="section-header" data-string="lerp" data-string-lerp="0.08">
              <span className="sec-num font-mono">01 //</span>
              <span className="sec-title font-mono">{aboutPage.intro.tag}</span>
              <div className="sec-line" />
            </div>
            <div className="intro-grid">
              <div>
                <h2 className="mystic-heading text-shadow-glow" data-string="parallax" data-string-parallax="0.15">
                  {aboutPage.intro.headline}
                </h2>
                <div className="mystic-stats-container">
                  {stats.map(({ num, label }) => (
                    <div key={label} className="mystic-stat"
                      data-string="magnetic spotlight"
                      data-string-radius="120"
                      data-string-strength="0.25"
                    >
                      <div className="stat-glow" />
                      <div className="stat-num">{num}</div>
                      <div className="stat-label font-mono">{label}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="intro-prose" data-string="parallax" data-string-parallax="-0.08">
                <div className="prose-glass mystic-card">
                  {paragraphs.map((p, i) => <p key={i}>{p}</p>)}
                  <blockquote className="mystic-quote">"{aboutPage.philosophy.quote}"</blockquote>
                </div>
              </div>
            </div>
          </section>

          {/* 02 TECH */}
          <section className="mystic-section">
            <div className="section-header" data-string="lerp" data-string-lerp="0.07">
              <span className="sec-num font-mono">02 //</span>
              <span className="sec-title font-mono">{aboutPage.tech.title}</span>
              <div className="sec-line" />
            </div>
            <div className="tech-matrix">
              {techGroups.map((group, i) => (
                <div key={group.title} className="mystic-card tech-card"
                  data-string="magnetic spotlight"
                  data-string-radius="180"
                  data-string-strength={i % 2 === 0 ? "0.2" : "0.3"}
                >
                  <div className="card-bg-pulse" />
                  <h3 className="tech-head font-mono">{group.title}</h3>
                  <div className="tech-pills">
                    {group.items.map((item) => (
                      <span key={item} className="mystic-pill font-mono"
                        data-string="magnetic"
                        data-string-radius="60"
                        data-string-strength="0.35"
                      >{item}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 03 FOCUS */}
          <section className="mystic-section">
            <div className="section-header" data-string="lerp" data-string-lerp="0.07">
              <span className="sec-num font-mono">03 //</span>
              <span className="sec-title font-mono">{aboutPage.focus.title}</span>
              <div className="sec-line" />
            </div>
            <div className="focus-list">
              {focusItems.map((item, i) => (
                <div key={item} className="focus-item mystic-card"
                  data-string="parallax magnetic"
                  data-string-parallax={i % 2 === 0 ? "0.05" : "-0.05"}
                  data-string-radius="200"
                  data-string-strength="0.12"
                >
                  <div className="focus-glow-line" />
                  <span className="focus-n font-mono">0{i + 1}</span>
                  <span className="focus-text">{item}</span>
                  <div className="focus-hover-light" />
                </div>
              ))}
            </div>
          </section>

          {/* 04 PROJECTS */}
          <section className="mystic-section">
            <div className="section-header" data-string="lerp" data-string-lerp="0.07">
              <span className="sec-num font-mono">04 //</span>
              <span className="sec-title font-mono">{aboutPage.projects.title}</span>
              <div className="sec-line" />
            </div>
            <div className="projects-grid">
              {projects.map((project, i) => (
                <article key={project.name} className="mystic-card project-card"
                  data-string="spotlight"
                  data-string-lerp="0.12"
                >
                  <div className="project-bg-glow" />
                  <div className="project-scanline" />
                  <div className="project-content">
                    <div className="project-idx font-mono">P—{String(i + 1).padStart(2, "0")}</div>
                    <h3 className="project-name">{project.name}</h3>
                    <p className="project-desc">{project.desc}</p>
                    {'highlights' in project && project.highlights?.length ? (
                      <div className="tech-pills mt-4">
                        {project.highlights.map((h: string) => (
                          <span key={h} className="mystic-pill small font-mono">{h}</span>
                        ))}
                      </div>
                    ) : null}
                  </div>
                </article>
              ))}
            </div>
          </section>

          {/* FOOTER */}
          <div className="mystic-footer mystic-section">
            <div className="sec-line" />
            <Link href="/" className="mystic-btn font-mono"
              data-string="magnetic impulse"
              data-string-radius="130"
              data-string-strength="0.45"
              data-string-rotation-strength="0.35"
            >
              <span className="btn-glow" />
              <span className="btn-text">RETURN TO ORIGIN</span>
              <span className="btn-border-trace" />
            </Link>
            <div className="sec-line" />
          </div>

        </div>
      </main>
    </>
  );
}

const MYSTIC_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700;900&family=Space+Grotesk:wght@300;400;600;700&family=Space+Mono:ital,wght@0,400;1,400&display=swap');

  .mystic-root {
    min-height: 100vh; background: #000; color: #e2e8f0;
    overflow-x: hidden; position: relative; z-index: 1;
    --accent: #6c5ce7; --border-mist: rgba(255,255,255,0.08);
    --fmono: 'Space Mono', monospace; --fsans: 'Space Grotesk', sans-serif; --fserif: 'Cinzel', serif;
  }
  .font-mono { font-family: var(--fmono) !important; }

  /* ── PROGRESS BAR: StringProgress --progress (0→1) → scaleX ── */
  .st-page-progress {
    position: fixed; top: 0; left: 0; height: 2px; width: 100%;
    transform-origin: left center; transform: scaleX(var(--progress, 0));
    background: linear-gradient(90deg, var(--accent), #a29bfe, #fff);
    z-index: 10000; pointer-events: none; box-shadow: 0 0 10px var(--accent);
  }

  /* ── MAGNETIC: --magnetic-x / --magnetic-y → translate ──
   * StringMagnetic her frame bu değerleri günceller.
   * transition OLMAMALI — kütüphane zaten lerp yapar. */
  [data-string*="magnetic"] {
    transform: translate(calc(var(--magnetic-x,0) * 1px), calc(var(--magnetic-y,0) * 1px));
    will-change: transform;
  }

  /* ── IMPULSE: --push-x / --push-y → 3D rotasyon ── */
  [data-string*="impulse"] {
    transform: rotateX(calc(var(--push-y,0) * -1deg)) rotateY(calc(var(--push-x,0) * 1deg));
    transform-style: preserve-3d; will-change: transform;
  }

  /* ── SPOTLIGHT: --spotlight-angle + --spotlight-distance → radial-gradient ──
   * cos()/sin() modern tarayıcılarda çalışır (Chrome 111+, Firefox 108+, Safari 16+) */
  .mystic-card[data-string*="spotlight"],
  .mystic-stat[data-string*="spotlight"] {
    --sx: calc(50% + cos(calc(var(--spotlight-angle,0) * 1deg)) * min(calc(var(--spotlight-distance,0) * 0.5px), 100px));
    --sy: calc(50% + sin(calc(var(--spotlight-angle,0) * 1deg)) * min(calc(var(--spotlight-distance,0) * 0.5px), 100px));
    background: radial-gradient(ellipse 150px 150px at var(--sx) var(--sy), rgba(108,92,231,0.18) 0%, transparent 70%), rgba(5,5,5,0.6);
  }

  /* ── PARALLAX / LERP: StringTune inline transform uygular ── */
  [data-string*="parallax"], [data-string*="lerp"] { will-change: transform; }

  /* ── SPLIT: StringSplit her char'a .st-char + --char-index verir ──
   * Her karakter sırayla charReveal animasyonu oynatır */
  .hero-title .st-char {
    display: inline-block; opacity: 0;
    transform: translateY(40px) scale(0.7);
    animation: charReveal 0.7s cubic-bezier(0.22,1,0.36,1) forwards;
    animation-delay: calc(var(--char-index,0) * 35ms + 200ms);
  }
  @keyframes charReveal { to { opacity: 1; transform: translateY(0) scale(1); } }
  .hero-title:not([data-string-inited]) { opacity: 1; }
  .hero-title[data-string-inited] { opacity: 1; }

  /* ─── ARKA PLAN ─── */
  .mystic-orbs-container { position: fixed; inset: 0; pointer-events: none; z-index: 0; overflow: hidden; background: radial-gradient(circle at 50% 50%, #08080c 0%, #000 100%); }
  .mystic-orb { position: absolute; border-radius: 50%; filter: blur(80px); opacity: 0.25; mix-blend-mode: screen; }
  .orb-1 { width: 50vw; height: 50vw; background: rgba(108,92,231,0.2); top: -20%; left: -20%; }
  .orb-2 { width: 40vw; height: 40vw; background: rgba(255,255,255,0.08); bottom: -10%; right: -10%; }
  .orb-3 { width: 30vw; height: 30vw; background: rgba(80,50,200,0.15); top: 30%; left: 35%; }
  .mystic-particle { position: absolute; background: #fff; border-radius: 50%; box-shadow: 0 0 8px #fff, 0 0 16px var(--accent); }

  /* ─── HERO ─── */
  .mystic-hero { position: relative; height: 100svh; display: flex; align-items: center; justify-content: center; z-index: 2; }
  .mystic-hero-wrap { width: 100%; height: 100%; display: flex; flex-direction: column; justify-content: space-between; padding: 2rem 4rem; }
  .hero-top-nav { display: flex; justify-content: space-between; align-items: center; font-size: 0.75rem; letter-spacing: 0.2em; color: rgba(255,255,255,0.5); }
  .mystic-badge { padding: 0.6rem 1.2rem; border: 1px solid var(--border-mist); background: rgba(255,255,255,0.02); border-radius: 2px; text-transform: uppercase; }
  .mystic-back-link { display: inline-block; transition: all 0.3s cubic-bezier(0.25,1,0.5,1); }
  .mystic-back-link:hover { color: #fff; text-shadow: 0 0 15px #fff; letter-spacing: 0.3em; }
  .hero-center-content { text-align: center; display: flex; flex-direction: column; align-items: center; }
  .hero-eyebrow { font-size: 0.8rem; letter-spacing: 0.5em; color: rgba(255,255,255,0.8); margin-bottom: 2rem; text-transform: uppercase; text-shadow: 0 0 20px #fff; }
  .hero-line { width: 1px; height: 80px; background: linear-gradient(to bottom, #fff, transparent); margin: 2rem 0; box-shadow: 0 0 20px #fff; }
  .hero-title { font-family: var(--fserif); font-size: clamp(4rem, 12vw, 10rem); font-weight: 900; line-height: 1; color: #fff; text-transform: uppercase; text-shadow: 0 0 40px rgba(255,255,255,0.4), 0 0 80px rgba(108,92,231,0.2); margin: 0; }
  .hero-subtitle { font-family: var(--fsans); font-size: 1.2rem; color: rgba(255,255,255,0.5); max-width: 600px; line-height: 1.8; font-weight: 300; }
  .hero-bottom { display: flex; justify-content: center; font-size: 0.65rem; letter-spacing: 0.4em; color: rgba(255,255,255,0.4); }
  .scroll-indicator { display: flex; flex-direction: column; align-items: center; gap: 1.5rem; }
  .scroll-dot-container { width: 1px; height: 40px; background: rgba(255,255,255,0.1); position: relative; overflow: hidden; }
  .scroll-dot { width: 3px; height: 10px; background: #fff; position: absolute; left: -1px; top: 0; box-shadow: 0 0 10px #fff; }

  /* ─── GÖVDE ─── */
  .mystic-body { position: relative; z-index: 2; padding: 0 4rem; max-width: 1400px; margin: 0 auto; }
  .mystic-section { padding: 10rem 0; }
  .section-header { display: flex; align-items: center; gap: 2rem; margin-bottom: 5rem; }
  .sec-num { font-size: 0.9rem; color: var(--accent); font-weight: 700; text-shadow: 0 0 15px var(--accent); }
  .sec-title { font-size: 0.8rem; letter-spacing: 0.4em; text-transform: uppercase; color: #fff; }
  .sec-line { flex: 1; height: 1px; background: linear-gradient(90deg, transparent, rgba(255,255,255,0.8), transparent); background-size: 200% 100%; box-shadow: 0 0 10px rgba(255,255,255,0.3); }
  .mystic-heading { font-family: var(--fserif); font-size: clamp(2.5rem, 5vw, 4.5rem); color: #fff; line-height: 1.1; margin-bottom: 3rem; }
  .text-shadow-glow { text-shadow: 0 0 30px rgba(255,255,255,0.2); }
  .intro-grid { display: grid; grid-template-columns: 1fr 1.2fr; gap: 8rem; }

  .mystic-stats-container { display: grid; grid-template-columns: repeat(3,1fr); gap: 1.5rem; margin-top: 4rem; }
  .mystic-stat { position: relative; padding: 2.5rem 1rem; background: rgba(255,255,255,0.01); border: 1px solid var(--border-mist); border-radius: 4px; text-align: center; overflow: hidden; transform-style: preserve-3d; }
  .stat-glow { position: absolute; inset: 0; background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%); opacity: 0; transition: opacity 0.3s; }
  .mystic-stat:hover .stat-glow { opacity: 1; }
  .stat-num { position: relative; font-family: var(--fserif); font-size: 3.5rem; color: #fff; z-index: 1; text-shadow: 0 0 20px rgba(255,255,255,0.4); font-weight: 700; }
  .stat-label { position: relative; font-size: 0.65rem; letter-spacing: 0.3em; color: rgba(255,255,255,0.5); margin-top: 1rem; z-index: 1; }

  .prose-glass { padding: 4rem; background: linear-gradient(135deg, rgba(255,255,255,0.03) 0%, transparent 100%); border: 1px solid rgba(255,255,255,0.05); border-radius: 2px; backdrop-filter: blur(20px); box-shadow: inset 0 0 40px rgba(255,255,255,0.02), 0 20px 40px rgba(0,0,0,0.5); }
  .prose-glass p { font-family: var(--fsans); font-size: 1.1rem; color: rgba(255,255,255,0.7); line-height: 1.9; margin-bottom: 2rem; font-weight: 300; }
  .mystic-quote { margin-top: 4rem; padding-left: 2rem; border-left: 2px solid #fff; font-family: var(--fserif); font-size: 1.4rem; font-style: italic; color: #fff; text-shadow: 0 0 20px rgba(255,255,255,0.3); }

  .tech-matrix { display: grid; grid-template-columns: repeat(3,1fr); gap: 3rem; }
  .mystic-card { background: rgba(5,5,5,0.6); border: 1px solid rgba(255,255,255,0.05); border-radius: 4px; backdrop-filter: blur(15px); transition: border-color 0.5s ease; transform-style: preserve-3d; position: relative; overflow: hidden; }
  .card-bg-pulse { position: absolute; inset: 0; background: radial-gradient(circle at 50% 50%, rgba(108,92,231,0.06) 0%, transparent 60%); opacity: 0; transition: opacity 0.5s; }
  .mystic-card:hover .card-bg-pulse { opacity: 1; }
  .tech-card { padding: 3rem; }
  .tech-head { position: relative; z-index: 2; font-size: 0.75rem; letter-spacing: 0.3em; color: #fff; margin-bottom: 2.5rem; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 1.5rem; text-transform: uppercase; }
  .tech-pills { position: relative; z-index: 2; display: flex; flex-wrap: wrap; gap: 0.8rem; }
  .mystic-pill { font-size: 0.65rem; padding: 0.5rem 1rem; background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.08); color: rgba(255,255,255,0.6); transition: background 0.3s, color 0.3s, box-shadow 0.3s; display: inline-block; will-change: transform; }
  .mystic-pill.small { font-size: 0.55rem; padding: 0.4rem 0.8rem; }
  .mystic-pill:hover { background: #fff; color: #000; box-shadow: 0 0 20px #fff; }

  .focus-list { display: flex; flex-direction: column; gap: 1.5rem; }
  .focus-item { display: flex; align-items: center; gap: 3rem; padding: 3rem 4rem; }
  .focus-hover-light { position: absolute; top: 0; left: -100%; width: 50%; height: 100%; background: linear-gradient(90deg, transparent, rgba(255,255,255,0.05), transparent); transform: skewX(-20deg); transition: left 0.7s ease; }
  .focus-item:hover .focus-hover-light { left: 200%; }
  .focus-glow-line { position: absolute; left: 0; top: 0; bottom: 0; width: 3px; background: #fff; opacity: 0; transform: scaleY(0); transition: opacity 0.3s, transform 0.3s, box-shadow 0.3s; }
  .focus-item:hover .focus-glow-line { opacity: 1; transform: scaleY(1); box-shadow: 0 0 20px #fff; }
  .focus-n { font-size: 1rem; color: rgba(255,255,255,0.2); font-weight: 700; transition: color 0.3s, text-shadow 0.3s; }
  .focus-item:hover .focus-n { color: #fff; text-shadow: 0 0 15px #fff; }
  .focus-text { font-family: var(--fsans); font-size: 1.3rem; color: #fff; font-weight: 400; }

  .projects-grid { display: grid; grid-template-columns: repeat(2,1fr); gap: 4rem; }
  .project-card {
    padding: 4rem; border-radius: 2px;
    --sx: calc(50% + cos(calc(var(--spotlight-angle,0) * 1deg)) * min(calc(var(--spotlight-distance,0) * 0.4px), 120px));
    --sy: calc(50% + sin(calc(var(--spotlight-angle,0) * 1deg)) * min(calc(var(--spotlight-distance,0) * 0.4px), 120px));
    background: radial-gradient(ellipse 200px 200px at var(--sx) var(--sy), rgba(108,92,231,0.14) 0%, transparent 70%), rgba(5,5,5,0.6);
  }
  .project-bg-glow { position: absolute; right: -20%; bottom: -20%; width: 300px; height: 300px; background: var(--accent); filter: blur(80px); opacity: 0; transition: opacity 0.8s; }
  .project-scanline { position: absolute; top: 0; left: 0; width: 100%; height: 2px; background: rgba(255,255,255,0.1); animation: scan 4s linear infinite; opacity: 0; }
  @keyframes scan { 0% { top: -10%; } 100% { top: 110%; } }
  .project-card:hover .project-bg-glow { opacity: 0.2; }
  .project-card:hover .project-scanline { opacity: 1; }
  .project-content { position: relative; z-index: 1; }
  .project-idx { font-size: 0.8rem; color: rgba(255,255,255,0.4); margin-bottom: 2rem; letter-spacing: 0.3em; }
  .project-name { font-family: var(--fserif); font-size: 2.5rem; color: #fff; margin-bottom: 1.5rem; text-shadow: 0 0 10px rgba(255,255,255,0.2); }
  .project-desc { font-family: var(--fsans); font-size: 1.05rem; color: rgba(255,255,255,0.6); line-height: 1.8; font-weight: 300; }
  .mt-4 { margin-top: 2rem; }

  .mystic-footer { display: flex; align-items: center; gap: 4rem; padding-bottom: 6rem; }
  .mystic-btn { position: relative; padding: 1.5rem 4rem; background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.2); color: #fff; text-decoration: none; display: inline-flex; justify-content: center; align-items: center; will-change: transform; }
  .btn-border-trace { position: absolute; inset: 0; border: 1px solid #fff; transform: scale(1.05); opacity: 0; transition: all 0.4s cubic-bezier(0.25,1,0.5,1); }
  .btn-glow { position: absolute; inset: 0; background: #fff; transform: scaleY(0); transform-origin: bottom; transition: transform 0.4s cubic-bezier(0.25,1,0.5,1); }
  .mystic-btn:hover .btn-glow { transform: scaleY(1); }
  .mystic-btn:hover .btn-border-trace { transform: scale(1); opacity: 1; box-shadow: 0 0 20px rgba(255,255,255,0.5); }
  .btn-text { position: relative; z-index: 1; font-size: 0.8rem; letter-spacing: 0.3em; transition: color 0.4s; }
  .mystic-btn:hover .btn-text { color: #000; font-weight: 700; }

  @media (max-width: 1024px) {
    .intro-grid { grid-template-columns: 1fr; gap: 4rem; }
    .tech-matrix { grid-template-columns: 1fr 1fr; }
    .projects-grid { grid-template-columns: 1fr; }
    .mystic-body { padding: 0 2rem; }
    .mystic-hero-wrap { padding: 2rem; }
    [data-string*="magnetic"], [data-string*="impulse"] { transform: none !important; }
  }
  @media (max-width: 768px) {
    .mystic-stats-container { grid-template-columns: 1fr; }
    .tech-matrix { grid-template-columns: 1fr; }
    .hero-title { font-size: 3.5rem; }
  }
`;