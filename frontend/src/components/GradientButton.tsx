import { motion } from 'framer-motion';
import { buttonVariants } from '../motion/variants';
import { Rocket } from 'lucide-react';

interface GradientButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: 'primary' | 'secondary';
  icon?: React.ReactNode;
  className?: string;
}

export default function GradientButton({
  children,
  onClick,
  disabled = false,
  loading = false,
  variant = 'primary',
  icon,
  className = '',
}: GradientButtonProps) {
  const baseClasses = variant === 'primary' 
    ? 'btn-gradient' 
    : 'btn-outline';

  return (
    <motion.button
      className={`${baseClasses} ${className} flex items-center justify-center gap-2`}
      onClick={onClick}
      disabled={disabled || loading}
      variants={buttonVariants}
      initial="initial"
      whileHover="hover"
      whileTap="tap"
    >
      {loading ? (
        <>
          <motion.div
            className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          />
          <span>Loading...</span>
        </>
      ) : (
        <>
          {icon || (variant === 'primary' && <Rocket className="w-5 h-5" />)}
          <span>{children}</span>
        </>
      )}
    </motion.button>
  );
}

