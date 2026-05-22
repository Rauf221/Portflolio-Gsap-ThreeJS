"use client";

import { type RefObject } from "react";
import { contact } from "../content/site";
import { CONTACT_SOCIAL_KEYS } from "../data";

type Props = { contactRef: RefObject<HTMLElement | null> };

const INFO_KEYS = ["email", "location", "availability"] as const;

export function ContactSection({ contactRef }: Props) {
  const headlineWords = contact.headline.split("|");

  return (
    <section
      id="contact"
      ref={contactRef}
      style={{
        position: "relative",
        paddingTop: "12rem",
        paddingBottom: "8rem",
        overflow: "hidden",
        zIndex: 1,
        paddingLeft: "var(--pad-x)",
        paddingRight: "var(--pad-x)",
      }}
    >
      <div
        className="section-bg"
        style={{
          position: "absolute",
          inset: "-20%",
          background: "radial-gradient(ellipse 80% 60% at 50% 100%, rgba(155,148,255,0.1) 0%, transparent 70%)",
          zIndex: 0,
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(rgba(155,148,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(155,148,255,0.03) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
          zIndex: 0,
        }}
      />
      <div style={{ maxWidth: 900, margin: "0 auto", position: "relative", zIndex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "3rem" }}>
          <div style={{ width: 32, height: 1, background: "var(--sphere)" }} />
          <span className="font-mono" style={{ fontSize: "0.75rem", letterSpacing: "0.2em", color: "var(--sphere)", textTransform: "uppercase" }}>
            {contact.label}
          </span>
        </div>
        <div className="perspective" style={{ marginBottom: "3rem" }}>
          {headlineWords.map((w, i) => (
            <span key={i} className="overflow-clip" style={{ display: "inline-block", marginRight: "0.3em" }}>
              <span
                className={`contact-headline font-display ${i >= 2 ? "grad-indigo" : ""}`}
                style={{
                  display: "inline-block",
                  fontSize: "clamp(2.5rem, 5.5vw, 5rem)",
                  fontWeight: 800,
                  letterSpacing: "-0.04em",
                  lineHeight: 1.1,
                }}
              >
                {w}
              </span>
            </span>
          ))}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "3rem", alignItems: "start" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div className="contact-field">
              <input className="contact-input" placeholder={contact.namePlaceholder} type="text" />
            </div>
            <div className="contact-field">
              <input className="contact-input" placeholder={contact.emailPlaceholder} type="email" />
            </div>
            <div className="contact-field">
              <textarea className="contact-input" placeholder={contact.messagePlaceholder} />
            </div>
            <div className="contact-field">
              <button className="btn-primary" type="button" style={{ width: "100%", justifyContent: "center" }}>
                {contact.send}
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z" />
                </svg>
              </button>
            </div>
          </div>
          <div>
            <p style={{ color: "var(--muted)", lineHeight: 1.8, marginBottom: "2.5rem", fontSize: "1.05rem" }}>{contact.blurb}</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginBottom: "2.5rem" }}>
              {INFO_KEYS.map((key) => (
                <div key={key} className="contact-info-row" style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
                  <span className="font-mono" style={{ fontSize: "0.7rem", color: "var(--sphere)", letterSpacing: "0.12em", minWidth: 90 }}>
                    {contact.info[key].toUpperCase()}
                  </span>
                  <span style={{ color: "var(--text)", fontSize: "0.95rem" }}>{contact.infoValues[key]}</span>
                </div>
              ))}
            </div>
            <div className="contact-socials" style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
              {CONTACT_SOCIAL_KEYS.map((key) => (
                <a
                  key={key}
                  className="contact-social glass"
                  href="#"
                  style={{
                    padding: "0.6rem 1rem",
                    borderRadius: 100,
                    fontSize: "0.75rem",
                    color: "var(--muted)",
                    textDecoration: "none",
                    fontFamily: "'Exo 2', sans-serif",
                    letterSpacing: "0.08em",
                    transition: "color 0.3s, border-color 0.3s",
                    cursor: "none",
                  }}
                  onMouseEnter={(e) => {
                    (e.target as HTMLElement).style.color = "var(--sphere)";
                  }}
                  onMouseLeave={(e) => {
                    (e.target as HTMLElement).style.color = "var(--muted)";
                  }}
                >
                  {contact.socials[key]}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
