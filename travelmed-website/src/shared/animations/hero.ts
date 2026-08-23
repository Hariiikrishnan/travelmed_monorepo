import { Variants } from 'framer-motion';

export const heroText: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.16, 1, 0.3, 1],
    }
  }
};

export const heroSubtitle: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.2,
      duration: 0.8,
      ease: [0.16, 1, 0.3, 1],
    }
  }
};

export const heroActions: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.35,
      duration: 0.8,
      ease: [0.16, 1, 0.3, 1],
    }
  }
};
export const heroVisual: Variants = {
  hidden: { opacity: 0, scale: 0.95, y: 30 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      delay: 0.45,
      duration: 1.0,
      ease: [0.16, 1, 0.3, 1],
    }
  }
};
