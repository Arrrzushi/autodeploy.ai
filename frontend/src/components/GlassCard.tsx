import { motion } from 'framer-motion';
import { cardVariants } from '../motion/variants';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export default function GlassCard({
  children,
  className = '',
  hover = true,
}: GlassCardProps) {
  return (
    <motion.div
      className={`glass-card p-6 ${className}`}
      variants={hover ? cardVariants : undefined}
      initial="initial"
      animate="animate"
      whileHover={hover ? 'hover' : undefined}
    >
      {children}
    </motion.div>
  );
}

