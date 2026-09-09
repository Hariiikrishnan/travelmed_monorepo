import { TargetAndTransition } from 'framer-motion';

export const hoverScale: TargetAndTransition = {
  scale: 1.02,
  transition: { duration: 0.2, ease: [0.16, 1, 0.3, 1] }
};

export const hoverLift: TargetAndTransition = {
  y: -8,
  transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] }
};

export const hoverGlow: TargetAndTransition = {
  boxShadow: '0 0 25px rgba(11, 79, 140, 0.15)',
  borderColor: '#0B4F8C',
  transition: { duration: 0.2 }
};
