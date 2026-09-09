import { TargetAndTransition } from 'framer-motion';

export const buttonPress: TargetAndTransition = {
  scale: 0.96,
  transition: { duration: 0.1, ease: 'easeOut' }
};

export const buttonHover: TargetAndTransition = {
  scale: 1.02,
  y: -1,
  transition: { duration: 0.2, ease: [0.16, 1, 0.3, 1] }
};
