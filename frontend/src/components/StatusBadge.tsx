import { motion } from 'framer-motion';
import { pulseVariants } from '../motion/variants';

interface StatusBadgeProps {
  label: string;
  variant?: 'neon' | 'live' | 'beta' | 'mvp';
  className?: string;
}

export default function StatusBadge({
  label,
  variant = 'neon',
  className = '',
}: StatusBadgeProps) {
  const variantClasses = {
    neon: 'badge-neon',
    live: 'badge-live',
    beta: 'badge-neon',
    mvp: 'badge-neon',
  };

  return (
    <motion.span
      className={`${variantClasses[variant]} ${className}`}
      variants={pulseVariants}
      animate="animate"
    >
      {label}
    </motion.span>
  );
}

