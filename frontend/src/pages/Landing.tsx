import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Github,
  Rocket,
  Zap,
  Shield,
  Gauge,
  Cpu,
  Box,
  Terminal,
  Activity,
  Monitor,
  Code2,
  Docker,
  CheckCircle2,
  ArrowRight,
  Heart,
  Twitter,
  MessageCircle,
} from 'lucide-react';
import { validateGitHubUrl } from '../utils/validation';
import { api } from '../api/client';
import ParticleBackground from '../components/ParticleBackground';
import GradientButton from '../components/GradientButton';
import GlassCard from '../components/GlassCard';
import FeatureCard from '../components/FeatureCard';
import {
  pageVariants,
  staggerContainer,
  fadeInUp,
  lineDraw,
  nodeGlow,
} from '../motion/variants';

export default function Landing() {
  const navigate = useNavigate();
  const [repoUrl, setRepoUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAnalyze = async () => {
    if (!repoUrl.trim()) {
      setError('Please enter a GitHub repository URL');
      return;
    }

    if (!validateGitHubUrl(repoUrl)) {
      setError('Invalid GitHub URL. Format: https://github.com/username/repo');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const response = await api.analyzeRepo(repoUrl);
      navigate('/analysis', { state: { data: response.data } });
    } catch (err: any) {
      console.error('Analysis error:', err);
      setError(err.response?.data?.error || 'Failed to analyze repository');
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAnalyze();
    }
  };

  const features = [
    {
      icon: Cpu,
      title: 'AI-Powered Analysis',
      description: 'Advanced AI models analyze your codebase and detect tech stack automatically',
    },
    {
      icon: Code2,
      title: 'Smart Dockerfile Generation',
      description: 'Creates optimized, production-ready Dockerfiles with best practices',
    },
    {
      icon: Rocket,
      title: 'One-Click Deployment',
      description: 'Deploy to NodeOps infrastructure with a single button click',
    },
    {
      icon: Activity,
      title: 'Real-Time Monitoring',
      description: 'Monitor logs, metrics, and container health in real-time',
    },
    {
      icon: Shield,
      title: 'Security-First',
      description: 'Multi-stage builds, non-root users, and security best practices',
    },
  ];

  const steps = [
    { icon: Github, label: 'Paste GitHub URL' },
    { icon: Zap, label: 'AI Analysis' },
    { icon: Docker, label: 'Dockerfile' },
    { icon: Rocket, label: 'Deploy' },
    { icon: Monitor, label: 'Monitor' },
  ];

  return (
    <motion.div
      className="min-h-screen bg-bgDark"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        <ParticleBackground />
        
        {/* Mesh gradient overlay */}
        <div className="absolute inset-0 mesh-gradient opacity-50" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-20">
          <motion.div
            className="text-center"
            variants={staggerContainer}
            initial="initial"
            animate="animate"
          >
            <motion.h1
              className="text-5xl md:text-6xl lg:text-7xl font-heading font-bold mb-6"
              variants={fadeInUp}
            >
              <span className="gradient-text">Autonomous</span>
              <br />
              <span className="text-white">AI-Powered DevOps</span>
            </motion.h1>

            <motion.p
              className="text-xl md:text-2xl text-textGrey mb-4 max-w-3xl mx-auto"
              variants={fadeInUp}
            >
              Analyze. Dockerize. Deploy. Monitor — All in One Click.
            </motion.p>

            <motion.div
              className="mt-12 mb-16 max-w-2xl mx-auto"
              variants={fadeInUp}
            >
              <GlassCard>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-textGrey mb-3">
                    GitHub Repository URL
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Github className="h-5 w-5 text-textGrey" />
                    </div>
                    <input
                      type="text"
                      value={repoUrl}
                      onChange={(e) => setRepoUrl(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="https://github.com/username/repository"
                      className="input-premium pl-12"
                      disabled={loading}
                    />
                  </div>
                  {error && (
                    <motion.p
                      className="mt-2 text-sm text-red-400"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      {error}
                    </motion.p>
                  )}
                </div>

                <GradientButton
                  onClick={handleAnalyze}
                  disabled={loading}
                  loading={loading}
                  className="w-full"
                >
                  {loading ? 'Analyzing...' : 'Deploy Now'}
                </GradientButton>
              </GlassCard>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            variants={fadeInUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-heading font-bold mb-4">
              <span className="gradient-text">Powerful Features</span>
            </h2>
            <p className="text-textGrey text-lg max-w-2xl mx-auto">
              Everything you need for modern DevOps automation
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {features.map((feature, index) => (
              <FeatureCard
                key={feature.title}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                delay={index * 0.1}
              />
            ))}
          </motion.div>
        </div>
      </section>

      {/* Architecture / How It Works */}
      <section className="py-20 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            variants={fadeInUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-heading font-bold mb-4">
              <span className="gradient-text">How It Works</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 md:gap-8 items-center relative">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                className="text-center relative"
                variants={fadeInUp}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <motion.div
                  className="inline-flex p-6 rounded-2xl bg-gradient-to-br from-electricCyan/20 to-neonPurple/20 border border-electricCyan/30 mb-4"
                  variants={nodeGlow}
                  whileHover="hover"
                >
                  <step.icon className="w-8 h-8 text-electricCyan" />
                </motion.div>
                <p className="text-textGrey font-medium">{step.label}</p>
                {index < steps.length - 1 && (
                  <motion.div
                    className="hidden md:block absolute top-12 left-full w-full h-0.5 bg-gradient-to-r from-electricCyan to-neonPurple origin-left"
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 + 0.3, duration: 0.5 }}
                  />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Dashboard Preview */}
      <section className="py-20 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            variants={fadeInUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-heading font-bold mb-4">
              <span className="gradient-text">Real-Time Dashboard</span>
            </h2>
            <p className="text-textGrey text-lg max-w-2xl mx-auto">
              Monitor your deployments with live metrics and logs
            </p>
          </motion.div>

          <motion.div
            variants={fadeInUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="relative"
          >
            <GlassCard className="p-0 overflow-hidden">
              <div className="bg-bgDark-lighter p-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div className="glass-card p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-textGrey text-sm">CPU Usage</span>
                      <span className="text-electricCyan font-bold">15.5%</span>
                    </div>
                    <div className="w-full bg-white/5 rounded-full h-2">
                      <div className="bg-gradient-to-r from-electricCyan to-neonPurple h-2 rounded-full" style={{ width: '15.5%' }} />
                    </div>
                  </div>
                  <div className="glass-card p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-textGrey text-sm">Memory</span>
                      <span className="text-electricCyan font-bold">192MB</span>
                    </div>
                    <div className="w-full bg-white/5 rounded-full h-2">
                      <div className="bg-gradient-to-r from-electricCyan to-neonPurple h-2 rounded-full" style={{ width: '25.6%' }} />
                    </div>
                  </div>
                  <div className="glass-card p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-textGrey text-sm">Status</span>
                      <span className="text-lime font-bold">● Live</span>
                    </div>
                    <div className="text-textGrey text-sm">Uptime: 2h 34m</div>
                  </div>
                </div>
                <div className="glass-card p-4">
                  <h4 className="text-white font-semibold mb-3">Recent Logs</h4>
                  <div className="font-mono text-xs text-textGrey space-y-1">
                    <div>[2024-01-01 12:34:56] Container started successfully</div>
                    <div>[2024-01-01 12:34:57] Application initializing...</div>
                    <div>[2024-01-01 12:34:58] Server listening on port 3000</div>
                  </div>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </section>

      {/* Security Section */}
      <section className="py-20 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            variants={fadeInUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            <motion.div
              className="inline-flex p-4 rounded-2xl bg-gradient-to-br from-electricCyan/20 to-neonPurple/20 border border-electricCyan/30 mb-6"
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              <Shield className="w-12 h-12 text-electricCyan" />
            </motion.div>
            <h2 className="text-4xl md:text-5xl font-heading font-bold mb-4">
              <span className="gradient-text">Security & Best Practices</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: 'Multi-Stage Builds', desc: 'Optimized image size and security' },
              { title: 'Non-Root Containers', desc: 'Enhanced security isolation' },
              { title: 'Health Monitoring', desc: 'Real-time health checks and alerts' },
            ].map((item, index) => (
              <motion.div
                key={item.title}
                variants={fadeInUp}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <GlassCard>
                  <div className="flex items-start gap-4">
                    <CheckCircle2 className="w-6 h-6 text-electricCyan flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="text-white font-semibold mb-2">{item.title}</h3>
                      <p className="text-textGrey">{item.desc}</p>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Get Started Block */}
      <section className="py-20 relative z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            variants={fadeInUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-heading font-bold mb-12">
              <span className="gradient-text">Get Started in Seconds</span>
            </h2>

            <GradientButton
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="text-lg"
            >
              Try It Now <ArrowRight className="w-5 h-5" />
            </GradientButton>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-white font-heading font-bold mb-4">AutoDeploy.AI</h3>
              <p className="text-textGrey text-sm">
                AI-powered autonomous DevOps for the modern developer
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-textGrey text-sm">
                <li><a href="#" className="hover:text-electricCyan transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-electricCyan transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-electricCyan transition-colors">Documentation</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-textGrey text-sm">
                <li><a href="https://github.com/Arrrzushi/autodeploy.ai" target="_blank" rel="noopener noreferrer" className="hover:text-electricCyan transition-colors">GitHub</a></li>
                <li><a href="https://nodeops.network" target="_blank" rel="noopener noreferrer" className="hover:text-electricCyan transition-colors">NodeOps</a></li>
                <li><a href="#" className="hover:text-electricCyan transition-colors">Blog</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Connect</h4>
              <div className="flex gap-4">
                <a href="#" className="text-textGrey hover:text-electricCyan transition-colors">
                  <Twitter className="w-5 h-5" />
                </a>
                <a href="#" className="text-textGrey hover:text-electricCyan transition-colors">
                  <MessageCircle className="w-5 h-5" />
                </a>
                <a href="https://github.com/Arrrzushi/autodeploy.ai" target="_blank" rel="noopener noreferrer" className="text-textGrey hover:text-electricCyan transition-colors">
                  <Github className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-white/10 pt-8 text-center">
            <p className="text-textGrey text-sm">
              Built with <Heart className="w-4 h-4 inline text-red-500" /> for{' '}
              <span className="gradient-text">NodeOps Hackathon</span>
            </p>
          </div>
        </div>
      </footer>
    </motion.div>
  );
}
