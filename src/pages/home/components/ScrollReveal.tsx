import { motion, useReducedMotion } from "framer-motion";
import { ReactNode } from "react";

type ScrollRevealProps = {
  children: ReactNode;
  delay?: number;
};

const ScrollReveal = ({ children, delay = 0 }: ScrollRevealProps) => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.section
      initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 72 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.18 }}
      transition={{ duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.section>
  );
};

export default ScrollReveal;
