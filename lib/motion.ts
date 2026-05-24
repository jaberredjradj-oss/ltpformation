export const easePremium = [0.22, 1, 0.36, 1] as const;
export const easeCinematic = [0.16, 1, 0.3, 1] as const;

export const fadeUp = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.85, ease: easeCinematic },
};

export const fadeUpView = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-48px" as const },
  transition: { duration: 0.8, ease: easeCinematic },
};

export const cinematicReveal = {
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-56px" as const },
  transition: { duration: 0.95, ease: easeCinematic },
};

export const staggerContainer = {
  initial: {},
  animate: { transition: { staggerChildren: 0.1, delayChildren: 0.12 } },
};

export const staggerItem = {
  initial: { opacity: 0, y: 22 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.75, ease: easeCinematic } },
};

export const staggerViewContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.08 } },
};

export const staggerViewItem = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: easeCinematic } },
};

export function staggerDelay(index: number, step = 0.08) {
  return { duration: 0.85, delay: index * step, ease: easeCinematic };
}

export function revealStagger(delay: number) {
  return {
    initial: { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-48px" as const },
    transition: { duration: 0.95, delay, ease: easeCinematic },
  };
}
