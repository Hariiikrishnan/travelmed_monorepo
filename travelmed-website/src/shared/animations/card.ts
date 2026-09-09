import { Variants } from 'framer-motion';

export const cardReveal: Variants = {
  hidden: { opacity: 0, scale: 0.96, y: 15 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] }
  }
};
export const cardHover = {
  hover: {
    y: -8,
    scale: 1.01,
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.05)',
    borderColor: 'rgba(11, 79, 140, 0.2)',
    transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] }
  }
};
