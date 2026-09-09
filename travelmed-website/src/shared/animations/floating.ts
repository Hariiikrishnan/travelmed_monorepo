import { Variants } from 'framer-motion';

export const floatingSlow: Variants = {
  animate: {
    y: [0, -12, 0],
    transition: {
      duration: 5,
      repeat: Infinity,
      repeatType: 'reverse',
      ease: 'easeInOut',
    }
  }
};

export const floatingMedium: Variants = {
  animate: {
    y: [0, -8, 0],
    rotate: [0, 1, 0, -1, 0],
    transition: {
      duration: 4,
      repeat: Infinity,
      repeatType: 'reverse',
      ease: 'easeInOut',
    }
  }
};

export const floatingFast: Variants = {
  animate: {
    y: [0, -5, 0],
    transition: {
      duration: 2.5,
      repeat: Infinity,
      repeatType: 'reverse',
      ease: 'easeInOut',
    }
  }
};
