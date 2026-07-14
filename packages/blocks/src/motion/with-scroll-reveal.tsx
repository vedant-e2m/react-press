import type { ReactNode } from "react";
import type { ScrollAnimation } from "../layout";
import { ScrollReveal } from "./scroll-reveal";

type WithScrollRevealProps = {
  children: ReactNode;
  animation?: ScrollAnimation;
  animationDelay?: number;
  animationDuration?: number;
  className?: string;
};

/** Wraps children in ScrollReveal when animation is set. */
export function WithScrollReveal({
  children,
  animation = "none",
  animationDelay = 0,
  animationDuration = 600,
  className,
}: WithScrollRevealProps) {
  if (!animation || animation === "none") {
    return <div className={className}>{children}</div>;
  }

  return (
    <ScrollReveal
      animation={animation}
      delay={animationDelay}
      duration={animationDuration}
      className={className}
    >
      {children}
    </ScrollReveal>
  );
}
