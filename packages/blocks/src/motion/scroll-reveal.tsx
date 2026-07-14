"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

import type { ScrollAnimation } from "../layout";

export type { ScrollAnimation };

export type ScrollRevealProps = {
  children: ReactNode;
  animation?: ScrollAnimation;
  delay?: number;
  duration?: number;
  className?: string;
};

/**
 * Scroll-triggered entrance animation wrapper. Respects prefers-reduced-motion.
 */
export function ScrollReveal({
  children,
  animation = "none",
  delay = 0,
  duration = 600,
  className,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(animation === "none");

  useEffect(() => {
    if (animation === "none") {
      setVisible(true);
      return;
    }

    const el = ref.current;
    if (!el) return;

    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [animation]);

  if (animation === "none") {
    return <div className={className}>{children}</div>;
  }

  return (
    <div
      ref={ref}
      className={className}
      data-scroll-reveal={animation}
      data-visible={visible ? "true" : "false"}
      style={{
        ["--reveal-delay" as string]: `${delay}ms`,
        ["--reveal-duration" as string]: `${duration}ms`,
      }}
    >
      {children}
    </div>
  );
}
