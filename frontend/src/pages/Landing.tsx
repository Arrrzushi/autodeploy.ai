import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Github, Rocket, Zap, Shield, Gauge } from 'lucide-react';
import { validateGitHubUrl } from '../utils/validation';
import { api } from '../api/client';

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

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 1,
          }}
        />
      </div>

      <div className="max-w-4xl w-full relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-block mb-6"
          >
            <div className="p-4 bg-gradient-primary rounded-2xl shadow-lg shadow-primary/50">
              <Rocket className="w-16 h-16 text-white" />
            </div>
          </motion.div>

          <h1 className="text-6xl font-bold mb-6">
            <span className="gradient-text">AutoDeploy.AI</span>
          </h1>

          <p className="text-xl text-gray-400 mb-4">
            AI-Powered Autonomous DevOps System
          </p>

          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            Automatically analyze any GitHub repository, generate optimized Dockerfiles,
            and deploy to NodeOps with one click. Powered by GPT-4.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="card max-w-2xl mx-auto"
        >
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              GitHub Repository URL
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Github className="h-5 w-5 text-gray-500" />
              </div>
              <input
                type="text"
                value={repoUrl}
                onChange={(e) => setRepoUrl(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="https://github.com/username/repository"
                className="input pl-12"
                disabled={loading}
              />
            </div>
            {error && (
              <p className="mt-2 text-sm text-red-400">{error}</p>
            )}
          </div>

          <button
            onClick={handleAnalyze}
            disabled={loading}
            className="btn-primary w-full"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Analyzing Repository...
              </span>
            ) : (
              'Analyze Repository'
            )}
          </button>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16"
        >
          <div className="card text-center">
            <div className="inline-flex p-3 bg-gradient-primary rounded-lg mb-4">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold mb-2">AI-Powered</h3>
            <p className="text-gray-400 text-sm">
              GPT-4 analyzes your code and generates production-ready Dockerfiles
            </p>
          </div>

          <div className="card text-center">
            <div className="inline-flex p-3 bg-gradient-primary rounded-lg mb-4">
              <Gauge className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold mb-2">One-Click Deploy</h3>
            <p className="text-gray-400 text-sm">
              Deploy to NodeOps infrastructure with a single click
            </p>
          </div>

          <div className="card text-center">
            <div className="inline-flex p-3 bg-gradient-primary rounded-lg mb-4">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Optimized</h3>
            <p className="text-gray-400 text-sm">
              Multi-stage builds and best practices for security and performance
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}



