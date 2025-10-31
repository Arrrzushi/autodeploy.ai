import { motion } from 'framer-motion';
import { iconVariants } from '../motion/variants';

interface LogoProps {
  className?: string;
  variant?: 'light' | 'dark';
}

export default function Logo({ className = '', variant = 'dark' }: LogoProps) {
  const fillColor = variant === 'dark' ? '#00E0FF' : '#05050A';
  const textColor = variant === 'dark' ? '#FFFFFF' : '#05050A';

  return (
    <motion.div
      className={`flex items-center gap-3 ${className}`}
      initial="initial"
      animate="animate"
    >
      <motion.svg
        width="40"
        height="40"
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        variants={iconVariants}
      >
        {/* Hexagon/Circuit board motif */}
        <path
          d="M20 5L30 10V20L20 35L10 20V10L20 5Z"
          stroke={fillColor}
          strokeWidth="2"
          fill="none"
          className="animate-pulse-neon"
        />
        {/* Inner orbit ring */}
        <circle
          cx="20"
          cy="20"
          r="8"
          stroke={fillColor}
          strokeWidth="1.5"
          fill="none"
          strokeDasharray="2 2"
          className="animate-spin"
          style={{ animationDuration: '10s' }}
        />
        {/* Center AI dot */}
        <circle cx="20" cy="20" r="3" fill={fillColor} />
        {/* Connection lines */}
        <line x1="20" y1="12" x2="20" y2="20" stroke={fillColor} strokeWidth="1" />
        <line x1="20" y1="20" x2="28" y2="20" stroke={fillColor} strokeWidth="1" />
        <line x1="20" y1="20" x2="12" y2="20" stroke={fillColor} strokeWidth="1" />
      </motion.svg>
      <motion.span
        className="text-2xl font-heading font-bold gradient-text"
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
        style={{ color: textColor }}
      >
        AutoDeploy<span className="text-electricCyan">.AI</span>
      </motion.span>
    </motion.div>
  );
}

