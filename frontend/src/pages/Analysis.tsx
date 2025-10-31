import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FileCode, Package, Cpu, ArrowRight, Loader2 } from 'lucide-react';
import CodeBlock from '../components/CodeBlock';
import { api } from '../api/client';
import { extractRepoName } from '../utils/validation';

export default function Analysis() {
  const location = useLocation();
  const navigate = useNavigate();
  const [data, setData] = useState<any>(null);
  const [dockerfile, setDockerfile] = useState<string>('');
  const [projectId, setProjectId] = useState<string>('');
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!location.state?.data) {
      navigate('/');
      return;
    }

    setData(location.state.data);
    generateDockerfile(location.state.data);
  }, [location.state]);

  const generateDockerfile = async (analysisData: any) => {
    setGenerating(true);
    setError('');

    try {
      const response = await api.generateDockerfile({
        analysis: analysisData.analysis,
        structure: analysisData.structure,
        repoUrl: analysisData.repoUrl,
      });

      setDockerfile(response.data.dockerfile);
      setProjectId(response.data.projectId);
    } catch (err: any) {
      console.error('Dockerfile generation error:', err);
      setError(err.response?.data?.error || 'Failed to generate Dockerfile');
    } finally {
      setGenerating(false);
    }
  };

  const handleDeploy = () => {
    if (!dockerfile || !projectId) {
      setError('Dockerfile not ready for deployment');
      return;
    }

    const projectName = extractRepoName(data.repoUrl);
    navigate('/deploy', {
      state: {
        projectId,
        dockerfile,
        projectName,
        analysis: data.analysis,
      },
    });
  };

  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">
            Repository <span className="gradient-text">Analysis</span>
          </h1>
          <p className="text-gray-400">{data.repoUrl}</p>
        </div>

        {/* Analysis Results */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="card"
          >
            <div className="flex items-center space-x-3 mb-3">
              <div className="p-2 bg-gradient-primary rounded-lg">
                <FileCode className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-semibold text-lg">Language</h3>
            </div>
            <p className="text-2xl font-bold text-gray-100">
              {data.analysis.language || data.structure.language || 'Unknown'}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="card"
          >
            <div className="flex items-center space-x-3 mb-3">
              <div className="p-2 bg-gradient-primary rounded-lg">
                <Package className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-semibold text-lg">Framework</h3>
            </div>
            <p className="text-2xl font-bold text-gray-100">
              {data.analysis.framework || data.structure.framework || 'Detected'}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="card"
          >
            <div className="flex items-center space-x-3 mb-3">
              <div className="p-2 bg-gradient-primary rounded-lg">
                <Cpu className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-semibold text-lg">Files</h3>
            </div>
            <p className="text-2xl font-bold text-gray-100">
              {data.structure.fileCount || 0}
            </p>
          </motion.div>
        </div>

        {/* Dependencies */}
        {data.analysis.dependencies && data.analysis.dependencies.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="card mb-8"
          >
            <h3 className="text-lg font-semibold mb-4">Dependencies Detected</h3>
            <div className="flex flex-wrap gap-2">
              {data.analysis.dependencies.map((dep: string, index: number) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-gray-800 border border-gray-700 rounded-full text-sm text-gray-300"
                >
                  {dep}
                </span>
              ))}
            </div>
          </motion.div>
        )}

        {/* Deployment Strategy */}
        {data.analysis.deploymentStrategy && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="card mb-8"
          >
            <h3 className="text-lg font-semibold mb-4">Deployment Strategy</h3>
            <p className="text-gray-300 whitespace-pre-wrap">
              {typeof data.analysis.deploymentStrategy === 'string'
                ? data.analysis.deploymentStrategy
                : JSON.stringify(data.analysis.deploymentStrategy, null, 2)}
            </p>
          </motion.div>
        )}

        {/* Generated Dockerfile */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          {generating ? (
            <div className="card text-center py-12">
              <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
              <p className="text-lg text-gray-400">
                Generating optimized Dockerfile with AI...
              </p>
            </div>
          ) : dockerfile ? (
            <CodeBlock code={dockerfile} language="dockerfile" title="Generated Dockerfile" />
          ) : error ? (
            <div className="card bg-red-900/20 border-red-800">
              <p className="text-red-400">{error}</p>
            </div>
          ) : null}
        </motion.div>

        {/* Deploy Button */}
        {dockerfile && !generating && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-8 flex justify-end"
          >
            <button onClick={handleDeploy} className="btn-primary flex items-center space-x-2">
              <span>Deploy to NodeOps</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}



