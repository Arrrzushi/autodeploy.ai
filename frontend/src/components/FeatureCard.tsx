import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { cardVariants, iconVariants } from '../motion/variants';

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  delay?: number;
}

export default function FeatureCard({
  icon: Icon,
  title,
  description,
  delay = 0,
}: FeatureCardProps) {
  return (
    <motion.div
      className="glass-card p-8 text-center group"
      variants={cardVariants}
      initial="initial"
      animate="animate"
      whileHover="hover"
      transition={{ delay }}
    >
      <motion.div
        className="flex justify-center mb-4"
        variants={iconVariants}
        whileHover="hover"
      >
        <div className="p-4 rounded-2xl bg-gradient-to-br from-electricCyan/20 to-neonPurple/20 border border-electricCyan/30">
          <Icon className="w-8 h-8 text-electricCyan" />
        </div>
      </motion.div>
      <h3 className="text-xl font-heading font-bold text-white mb-3">
        {title}
      </h3>
      <p className="text-textGrey leading-relaxed">
        {description}
      </p>
    </motion.div>
  );
}

