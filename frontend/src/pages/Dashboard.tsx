import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Globe,
  Cpu,
  HardDrive,
  Clock,
  MapPin,
  Copy,
  Check,
  RefreshCw,
  FileCode,
} from 'lucide-react';
import MetricCard from '../components/MetricCard';
import LogViewer from '../components/LogViewer';
import CodeBlock from '../components/CodeBlock';
import { usePolling } from '../hooks/usePolling';
import { api } from '../api/client';
import { copyToClipboard, formatUptime } from '../utils/validation';

export default function Dashboard() {
  const { deploymentId } = useParams<{ deploymentId: string }>();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const [showDockerfile, setShowDockerfile] = useState(false);
  const [deployment, setDeployment] = useState<any>(null);

  // Fetch deployment details
  useEffect(() => {
    if (!deploymentId) {
      navigate('/');
      return;
    }

    api.getDeployment(deploymentId)
      .then(response => setDeployment(response.data))
      .catch(err => {
        console.error('Failed to fetch deployment:', err);
        navigate('/');
      });
  }, [deploymentId]);

  // Poll logs and metrics
  const { data: logsData } = usePolling(
    async () => {
      const response = await api.getLogs(deploymentId!);
      return response.data;
    },
    { interval: 5000, enabled: !!deploymentId }
  );

  const { data: metricsData } = usePolling(
    async () => {
      const response = await api.getHealth(deploymentId!);
      return response.data;
    },
    { interval: 3000, enabled: !!deploymentId }
  );

  const handleCopy = async () => {
    if (deployment?.containerUrl) {
      const success = await copyToClipboard(deployment.containerUrl);
      if (success) {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    }
  };

  const handleRedeploy = () => {
    // Navigate back to analysis with the same project
    navigate('/');
  };

  if (!deployment || !metricsData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <RefreshCw className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-gray-400">Loading deployment details...</p>
        </div>
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
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">
            Deployment <span className="gradient-text">Dashboard</span>
          </h1>
          <p className="text-gray-400">Real-time monitoring and logs</p>
        </div>

        {/* Deployment URL Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card mb-8"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 flex-1 min-w-0">
              <div className="p-3 bg-gradient-primary rounded-lg">
                <Globe className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-400 mb-1">Deployment URL</p>
                <a
                  href={deployment.containerUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-lg font-mono text-primary hover:text-primary-dark transition-colors truncate block"
                >
                  {deployment.containerUrl}
                </a>
              </div>
            </div>
            <div className="flex items-center space-x-3 ml-4">
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  deployment.status === 'running'
                    ? 'bg-green-900/30 text-green-400 border border-green-800'
                    : 'bg-gray-800 text-gray-400 border border-gray-700'
                }`}
              >
                {deployment.status}
              </span>
              <button
                onClick={handleCopy}
                className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                title="Copy URL"
              >
                {copied ? (
                  <Check className="w-5 h-5 text-green-400" />
                ) : (
                  <Copy className="w-5 h-5 text-gray-400" />
                )}
              </button>
            </div>
          </div>
        </motion.div>

        {/* Metrics Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <MetricCard
            icon={Clock}
            label="Uptime"
            value={formatUptime(metricsData.uptime || 0)}
            gradient
          />
          <MetricCard icon={Cpu} label="CPU Usage" value={metricsData.cpu || '0%'} />
          <MetricCard
            icon={HardDrive}
            label="Memory"
            value={metricsData.memory || '0MB'}
          />
          <MetricCard
            icon={MapPin}
            label="Node Location"
            value={metricsData.nodeLocation?.split(' ')[0] || 'Unknown'}
          />
        </motion.div>

        {/* Logs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <LogViewer logs={logsData?.logs || []} />
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-wrap gap-4"
        >
          <button onClick={handleRedeploy} className="btn-secondary flex items-center space-x-2">
            <RefreshCw className="w-5 h-5" />
            <span>Redeploy</span>
          </button>
          <button
            onClick={() => setShowDockerfile(!showDockerfile)}
            className="btn-secondary flex items-center space-x-2"
          >
            <FileCode className="w-5 h-5" />
            <span>{showDockerfile ? 'Hide' : 'View'} Dockerfile</span>
          </button>
        </motion.div>

        {/* Dockerfile Modal/Section */}
        {showDockerfile && deployment.project?.dockerfile && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8"
          >
            <CodeBlock
              code={deployment.project.dockerfile}
              language="dockerfile"
              title="Deployed Dockerfile"
            />
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}



