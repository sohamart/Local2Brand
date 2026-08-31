import React from 'react';
import { motion } from 'framer-motion';

export const FadeIn = ({ children, delay = 0, duration = 0.5, direction = 'up', className = '', ...props }) => {
  const directions = {
    up: { y: 30, x: 0 },
    down: { y: -30, x: 0 },
    left: { x: 30, y: 0 },
    right: { x: -30, y: 0 },
    none: { x: 0, y: 0 }
  };

  const initialOffset = directions[direction] || directions.up;

  return (
    <motion.div
      initial={{ opacity: 0, ...initialOffset }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export const FadeInStagger = ({ children, stagger = 0.1, className = '', ...props }) => {
  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-40px' }}
      variants={{
        hidden: {},
        show: {
          transition: {
            staggerChildren: stagger
          }
        }
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export const FadeInStaggerItem = ({ children, className = '', ...props }) => {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 25 },
        show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.21, 0.47, 0.32, 0.98] } }
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export const ScaleIn = ({ children, delay = 0, duration = 0.4, className = '', ...props }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.94 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
};
