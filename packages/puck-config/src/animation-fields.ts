export const animationFields = {
  animation: {
    type: "select",
    label: "Scroll animation",
    options: [
      { label: "None", value: "none" },
      { label: "Fade up", value: "fade-up" },
      { label: "Fade in", value: "fade-in" },
      { label: "Slide left", value: "slide-left" },
      { label: "Slide right", value: "slide-right" },
    ],
  },
  animationDelay: { type: "number", label: "Animation delay (ms)" },
  animationDuration: { type: "number", label: "Animation duration (ms)" },
} as const;
