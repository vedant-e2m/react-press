import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { createBuilderElement, EMPTY_BUILDER_DOCUMENT } from "./document";
import { BuilderRenderer } from "./renderer";
import { getBuilderWidget } from "./widgets";
import type { BuilderElement } from "./types";

function renderAlert(element: BuilderElement, extras: BuilderElement[] = []) {
  const document = {
    ...EMPTY_BUILDER_DOCUMENT,
    content: [element, ...extras],
  };
  return renderToStaticMarkup(<BuilderRenderer document={document} />);
}

function renderAlertWidget(element: BuilderElement): string {
  const widget = getBuilderWidget("alert")!;
  return renderToStaticMarkup(widget.render({ element, children: null }));
}

function styleBlockFor(html: string, id: string): string {
  const match = html.match(new RegExp(`\\[data-npb-id="${id}"\\]\\{([^}]*)\\}`));
  return match?.[1] ?? "";
}

function hoverBlockFor(html: string, id: string): string {
  const match = html.match(new RegExp(`\\[data-npb-id="${id}"\\]:hover\\{([^}]*)\\}`));
  return match?.[1] ?? "";
}

function alertBlock(html: string): string {
  const withButton = html.match(/<div class="npb-alert[^"]*"[\s\S]*?<\/button>\s*<\/div>/);
  if (withButton) {
    return withButton[0];
  }
  const match = html.match(/<div class="npb-alert[^"]*"[\s\S]*?<\/div>\s*<\/div>/);
  return match?.[0] ?? "";
}

function alertRootStyle(html: string): string {
  return alertBlock(html).match(/^<div[^>]*style="([^"]*)"/)?.[1] ?? "";
}

function titleStyle(html: string): string {
  return alertBlock(html).match(/<strong style="([^"]*)"/)?.[1] ?? "";
}

function descriptionStyle(html: string): string {
  return alertBlock(html).match(/<p style="([^"]*)"/)?.[1] ?? "";
}

function dismissButtonStyle(html: string): string {
  return alertBlock(html).match(/<button[^>]*style="([^"]*)"/)?.[1] ?? "";
}

describe("alert widget settings", () => {
  describe("widget registration", () => {
    it("should expose content and style controls with defaults", () => {
      const widget = getBuilderWidget("alert");
      const contentSection = widget?.controls.find(
        (section) => section.label === "Alert" && section.tab === "content",
      );
      const alertStyleSection = widget?.controls.find(
        (section) => section.label === "Alert" && section.tab === "style",
      );
      const titleSection = widget?.controls.find((section) => section.label === "Title");
      const descriptionSection = widget?.controls.find((section) => section.label === "Description");
      const dismissSection = widget?.controls.find((section) => section.label === "Dismiss Icon");

      expect(widget?.defaultProps).toEqual({
        alertType: "info",
        title: "This is an Alert",
        description: "I am a description. Click the dismiss button to remove this alert from view.",
        showDismiss: true,
        icon: "!",
      });

      expect(contentSection?.controls.map((control) => control.key)).toEqual([
        "alertType",
        "title",
        "description",
        "showDismiss",
        "icon",
      ]);

      expect(alertStyleSection?.controls.map((control) => control.key)).toEqual([
        "backgroundColor",
        "borderColor",
        "borderWidth",
      ]);

      expect(titleSection?.controls.map((control) => control.key)).toEqual([
        "titleColor",
        "titleFontSize",
        "titleFontWeight",
      ]);

      expect(descriptionSection?.controls.map((control) => control.key)).toEqual([
        "descriptionColor",
        "descriptionFontSize",
      ]);

      expect(dismissSection?.controls.map((control) => control.key)).toEqual([
        "dismissSize",
        "dismissColor",
      ]);
    });
  });

  describe("content props", () => {
    it("should render title, description, icon, and dismiss button with default props", () => {
      const alert = createBuilderElement("alert");

      const html = renderAlert(alert);
      const block = alertBlock(html);

      expect(html).toContain(`data-npb-id="${alert.id}"`);
      expect(block).toContain('class="npb-alert npb-alert-info"');
      expect(block).toContain("This is an Alert");
      expect(block).toContain("I am a description. Click the dismiss button to remove this alert from view.");
      expect(block).toContain('aria-hidden="true"');
      expect(block).toContain("!");
      expect(block).toContain('aria-label="Dismiss"');
      expect(block).toContain("×");
    });

    it("should fall back to default title, description, and icon when props are empty", () => {
      const alert = createBuilderElement("alert");
      alert.props = {};

      const html = renderAlertWidget(alert);

      expect(html).toContain("This is an Alert");
      expect(html).toContain("I am a description. Click the dismiss button to remove this alert from view.");
      expect(html).toContain("!");
    });

    it("should render custom title, description, and icon", () => {
      const alert = createBuilderElement("alert");
      alert.props = {
        title: "Maintenance Notice",
        description: "Scheduled downtime tonight.",
        icon: "⚠",
      };

      const html = renderAlert(alert);

      expect(html).toContain("Maintenance Notice");
      expect(html).toContain("Scheduled downtime tonight.");
      expect(html).toContain("⚠");
    });

    it("should hide the dismiss button when showDismiss is false", () => {
      const alert = createBuilderElement("alert");
      alert.props = { showDismiss: false };

      const html = renderAlert(alert);

      expect(html).not.toContain('aria-label="Dismiss"');
      expect(html).not.toContain("<button");
    });

    it("should show the dismiss button by default and when showDismiss is true", () => {
      const defaultAlert = createBuilderElement("alert");
      const explicitAlert = createBuilderElement("alert");
      explicitAlert.props = { showDismiss: true };

      expect(renderAlert(defaultAlert)).toContain('aria-label="Dismiss"');
      expect(renderAlert(explicitAlert)).toContain('aria-label="Dismiss"');
    });

    it("should apply css id from advanced settings onto the host wrapper", () => {
      const alert = createBuilderElement("alert");
      alert.advanced = { cssId: "status-alert" };

      const html = renderAlert(alert);

      expect(html).toContain('id="status-alert"');
      expect(html).toContain(`data-npb-id="${alert.id}"`);
    });
  });

  describe("alert type props", () => {
    it.each([
      ["info", "#e8f4fd", "#5bc0de"],
      ["success", "#e9f7ef", "#5cb85c"],
      ["warning", "#fcf8e3", "#f0ad4e"],
      ["danger", "#f8e8e8", "#d9534f"],
    ] as const)("should apply %s type palette when custom colors are unset", (alertType, bg, border) => {
      const alert = createBuilderElement("alert");
      alert.props = { alertType };

      const html = renderAlertWidget(alert);
      const style = alertRootStyle(html);

      expect(html).toContain(`npb-alert-${alertType}`);
      expect(style).toContain(`background:${bg}`);
      expect(style).toContain(`border-left:5px solid ${border}`);
    });

    it("should fall back to info palette for unknown alert types", () => {
      const alert = createBuilderElement("alert");
      alert.props = { alertType: "unknown" };

      const style = alertRootStyle(renderAlertWidget(alert));

      expect(style).toContain("background:#e8f4fd");
      expect(style).toContain("border-left:5px solid #5bc0de");
    });
  });

  describe("alert style props", () => {
    it("should apply custom background, border color, and border width", () => {
      const alert = createBuilderElement("alert");
      alert.props = {
        backgroundColor: "#fef3c7",
        borderColor: "#d97706",
        borderWidth: 8,
      };

      const style = alertRootStyle(renderAlert(alert));

      expect(style).toContain("background:#fef3c7");
      expect(style).toContain("border-left:8px solid #d97706");
    });

    it("should prefer custom colors over alert type palette", () => {
      const alert = createBuilderElement("alert");
      alert.props = {
        alertType: "danger",
        backgroundColor: "#111827",
        borderColor: "#f87171",
      };

      const style = alertRootStyle(renderAlertWidget(alert));

      expect(style).toContain("background:#111827");
      expect(style).toContain("border-left:5px solid #f87171");
      expect(style).not.toContain("#f8e8e8");
      expect(style).not.toContain("#d9534f");
    });
  });

  describe("title style props", () => {
    it("should apply title color, font size, and font weight", () => {
      const alert = createBuilderElement("alert");
      alert.props = {
        title: "Heads up",
        titleColor: "#1e3a8a",
        titleFontSize: 20,
        titleFontWeight: 600,
      };

      const style = titleStyle(renderAlert(alert));

      expect(style).toContain("color:#1e3a8a");
      expect(style).toContain("font-size:20");
      expect(style).toContain("font-weight:600");
    });
  });

  describe("description style props", () => {
    it("should apply description color and font size", () => {
      const alert = createBuilderElement("alert");
      alert.props = {
        description: "Details here.",
        descriptionColor: "#374151",
        descriptionFontSize: 13,
      };

      const style = descriptionStyle(renderAlert(alert));

      expect(style).toContain("color:#374151");
      expect(style).toContain("font-size:13");
    });
  });

  describe("dismiss style props", () => {
    it("should apply dismiss icon size and color", () => {
      const alert = createBuilderElement("alert");
      alert.props = {
        dismissSize: 22,
        dismissColor: "#991b1b",
      };

      const style = dismissButtonStyle(renderAlert(alert));

      expect(style).toContain("font-size:22");
      expect(style).toContain("color:#991b1b");
    });
  });

  describe("serialized prop coercion", () => {
    it("should coerce string numeric props from serialized documents", () => {
      const alert = createBuilderElement("alert");
      alert.props = {
        borderWidth: "10",
        titleFontSize: "18",
        titleFontWeight: "500",
        descriptionFontSize: "12",
        dismissSize: "20",
      };

      const html = renderAlertWidget(alert);

      expect(alertRootStyle(html)).toContain("border-left:10px solid");
      expect(titleStyle(html)).toContain("font-size:18");
      expect(titleStyle(html)).toContain("font-weight:500");
      expect(descriptionStyle(html)).toContain("font-size:12");
      expect(dismissButtonStyle(html)).toContain("font-size:20");
    });
  });

  describe("shared style panel", () => {
    it("should apply margin on the host wrapper", () => {
      const alert = createBuilderElement("alert");
      alert.styles = {
        desktop: {
          normal: {
            marginTop: "12px",
            marginBottom: "24px",
          },
        },
      };

      const css = styleBlockFor(renderAlert(alert), alert.id);

      expect(css).toContain("margin-top:12px");
      expect(css).toContain("margin-bottom:24px");
    });

    it("should emit hover styles on the host wrapper", () => {
      const alert = createBuilderElement("alert");
      alert.styles = {
        desktop: {
          normal: { opacity: 1 },
          hover: { opacity: 0.6 },
        },
      };

      const html = renderAlert(alert);

      expect(styleBlockFor(html, alert.id)).toContain("opacity:1");
      expect(hoverBlockFor(html, alert.id)).toContain("opacity:0.6");
    });
  });

  describe("responsive and interaction styles", () => {
    it("should hide the alert on selected breakpoints", () => {
      const alert = createBuilderElement("alert");
      alert.advanced = { hideOnMobile: true };

      const html = renderAlert(alert);

      expect(html).toContain(
        `@media(max-width:767px){[data-npb-id="${alert.id}"]{display:none!important}}`,
      );
    });

    it("should apply entrance animation classes and delay on the host wrapper", () => {
      const alert = createBuilderElement("alert");
      alert.advanced = {
        entranceAnimation: "fadeInUp",
        animationDuration: "fast",
        animationDelay: 250,
      };

      const html = renderAlert(alert);

      expect(html).toContain("npb-animate");
      expect(html).toContain("npb-animate-fadeInUp");
      expect(html).toContain("npb-animate-fast");
      expect(html).toContain("animation-delay:250ms");
    });
  });
});
