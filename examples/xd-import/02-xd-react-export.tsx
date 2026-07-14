/**
 * SAMPLE: What an Adobe XD "Export to React" plugin typically produces.
 *
 * Characteristics of real XD exports:
 * - Lots of nested <div> with inline styles or CSS modules
 * - Absolute/fixed positioning copied from artboard coordinates
 * - Generic class names (.Rectangle_1, .Group_3)
 * - Sometimes data-xd-* attributes if the plugin supports them
 *
 * Our importer parses THIS file — not the raw .xd binary.
 */

import "./AcmeLanding.css";
import heroBg from "./assets/hero-bg.jpg";

export default function AcmeLanding() {
  return (
    <div className="artboard" data-xd-artboard="Homepage - Desktop" style={{ width: 1440 }}>
      {/* Navigation — XD group "Navigation" */}
      <header
        className="Group_Navigation"
        data-xd-name="Navigation"
        data-xd-type="group"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "24px 80px",
          position: "sticky",
          top: 0,
          background: "#FFFFFF",
        }}
      >
        <span
          className="Text_Logo"
          data-xd-type="text"
          style={{ fontFamily: "Inter", fontWeight: 700, fontSize: 24, color: "#0F172A" }}
        >
          Acme
        </span>
        <nav style={{ display: "flex", gap: 32 }}>
          {["Features", "Pricing", "About"].map((label) => (
            <a
              key={label}
              href="#"
              data-xd-type="text"
              style={{ fontFamily: "Inter", fontSize: 16, color: "#0F172A", textDecoration: "none" }}
            >
              {label}
            </a>
          ))}
        </nav>
        <a
          href="#"
          data-xd-type="button"
          data-xd-name="Get Started"
          style={{
            fontFamily: "Inter",
            fontWeight: 600,
            fontSize: 14,
            background: "#2563EB",
            color: "#FFFFFF",
            padding: "12px 20px",
            borderRadius: 8,
            textDecoration: "none",
          }}
        >
          Get Started
        </a>
      </header>

      {/* Hero — XD group "Hero" */}
      <section
        className="Group_Hero"
        data-xd-name="Hero"
        data-xd-type="group"
        style={{
          position: "relative",
          minHeight: 560,
          padding: "120px 80px",
          backgroundImage: `linear-gradient(rgba(15,23,42,0.55), rgba(15,23,42,0.55)), url(${heroBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <h1
          data-xd-type="text"
          style={{ fontFamily: "Inter", fontWeight: 700, fontSize: 56, color: "#FFFFFF", margin: 0 }}
        >
          Ship faster with Acme
        </h1>
        <p
          data-xd-type="text"
          style={{
            fontFamily: "Inter",
            fontSize: 20,
            color: "#E2E8F0",
            maxWidth: 640,
            marginTop: 16,
          }}
        >
          The all-in-one platform for modern teams to plan, build, and launch.
        </p>
        <div style={{ display: "flex", gap: 16, marginTop: 32 }}>
          <a
            href="#"
            data-xd-type="button"
            style={{
              background: "#FFFFFF",
              color: "#0F172A",
              padding: "14px 24px",
              borderRadius: 8,
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            Start free trial
          </a>
          <a
            href="#"
            data-xd-type="button"
            data-xd-variant="outline"
            style={{
              border: "1px solid #FFFFFF",
              color: "#FFFFFF",
              padding: "14px 24px",
              borderRadius: 8,
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            Book a demo
          </a>
        </div>
      </section>

      {/* Features heading */}
      <h2
        data-xd-type="text"
        style={{
          fontFamily: "Inter",
          fontWeight: 700,
          fontSize: 40,
          textAlign: "center",
          margin: "80px 0 40px",
          color: "#0F172A",
        }}
      >
        Everything you need to grow
      </h2>

      {/* Feature cards — 3-column group */}
      <div
        data-xd-name="Features"
        data-xd-type="group"
        data-xd-layout="horizontal-3-col"
        style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24, padding: "0 80px 80px" }}
      >
        {[
          { title: "Analytics", body: "Real-time dashboards for every team." },
          { title: "Automation", body: "Workflows that save hours every week." },
          { title: "Integrations", body: "Connect Slack, GitHub, and 50+ tools." },
        ].map((item) => (
          <div
            key={item.title}
            data-xd-type="card"
            style={{ background: "#F8FAFC", borderRadius: 12, padding: 24 }}
          >
            <h3 style={{ fontFamily: "Inter", fontWeight: 600, fontSize: 20, color: "#0F172A" }}>
              {item.title}
            </h3>
            <p style={{ fontFamily: "Inter", fontSize: 16, color: "#64748B", marginTop: 8 }}>{item.body}</p>
          </div>
        ))}
      </div>

      {/* Contact CTA */}
      <section
        data-xd-name="Contact CTA"
        data-xd-type="group"
        style={{ background: "#F8FAFC", padding: "80px", textAlign: "center" }}
      >
        <h2 style={{ fontFamily: "Inter", fontWeight: 700, fontSize: 32, color: "#0F172A" }}>
          Ready to get started?
        </h2>
        <p style={{ fontFamily: "DM Sans", fontWeight: 500, fontSize: 18, color: "#64748B", marginTop: 8 }}>
          Talk to our team
        </p>
        <a
          href="#"
          data-xd-type="button"
          style={{
            display: "inline-block",
            marginTop: 24,
            background: "#2563EB",
            color: "#FFFFFF",
            padding: "14px 28px",
            borderRadius: 8,
            fontWeight: 600,
            textDecoration: "none",
          }}
        >
          Contact sales
        </a>
      </section>
    </div>
  );
}
