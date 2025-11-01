import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Github, Menu, X, ExternalLink } from 'lucide-react';
import Logo from './Logo';
import StatusBadge from './StatusBadge';

export default function Navbar() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/analysis', label: 'Features' },
    { path: '/tools', label: 'Tools' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-white/10"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <Logo />
            <StatusBadge label="MVP" variant="mvp" />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="relative text-textGrey hover:text-white transition-colors duration-300 font-medium"
              >
                {item.label}
                {isActive(item.path) && (
                  <motion.div
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-electricCyan to-neonPurple"
                    layoutId="navbar-indicator"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            ))}
            <a
              href="https://github.com/Arrrzushi/autodeploy.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-textGrey hover:text-white transition-colors duration-300"
            >
              <Github className="w-5 h-5" />
              <span>GitHub</span>
              <ExternalLink className="w-4 h-4" />
            </a>
            <a
              href="https://nodeops.network"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-textGrey hover:text-electricCyan transition-colors duration-300"
            >
              NodeOps
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-textGrey hover:text-white transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <motion.div
            className="md:hidden py-4 border-t border-white/10"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex flex-col gap-4">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`text-textGrey hover:text-white transition-colors ${
                    isActive(item.path) ? 'text-electricCyan' : ''
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              <a
                href="https://github.com/Arrrzushi/autodeploy.ai"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-textGrey hover:text-white transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Github className="w-5 h-5" />
                <span>GitHub</span>
              </a>
              <a
                href="https://nodeops.network"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-textGrey hover:text-electricCyan transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                NodeOps
              </a>
            </div>
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
}
