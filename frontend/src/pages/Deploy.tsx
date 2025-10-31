import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Loader2, CheckCircle, Rocket } from 'lucide-react';
import { api } from '../api/client';

const DEPLOYMENT_STAGES = [
  { id: 1, label: 'Building Docker image', duration: 3000 },
  { id: 2, label: 'Pushing to registry', duration: 2000 },
  { id: 3, label: 'Allocating resources', duration: 2000 },
  { id: 4, label: 'Starting container', duration: 3000 },
  { id: 5, label: 'Verifying deployment', duration: 2000 },
];

export default function Deploy() {
  const location = useLocation();
  const navigate = useNavigate();
  const [currentStage, setCurrentStage] = useState(0);
  const [_deploymentId, setDeploymentId] = useState<string>('');
  const [error, setError] = useState('');
  const [deploying, setDeploying] = useState(true);

  useEffect(() => {
    if (!location.state?.projectId || !location.state?.dockerfile) {
      navigate('/');
      return;
    }

    startDeployment();
  }, [location.state]);

  const startDeployment = async () => {
    try {
      // Simulate progressive stages
      for (let i = 0; i < DEPLOYMENT_STAGES.length; i++) {
        setCurrentStage(i);
        await new Promise(resolve => setTimeout(resolve, DEPLOYMENT_STAGES[i].duration));
      }

      // Actually trigger deployment
      const response = await api.deploy({
        projectId: location.state.projectId,
        dockerfile: location.state.dockerfile,
        projectName: location.state.projectName || 'app',
      });

      setDeploymentId(response.data.deploymentId);
      setCurrentStage(DEPLOYMENT_STAGES.length);
      setDeploying(false);

      // Redirect to dashboard after a moment
      setTimeout(() => {
        navigate(`/dashboard/${response.data.deploymentId}`);
      }, 2000);
    } catch (err: any) {
      console.error('Deployment error:', err);
      setError(err.response?.data?.error || 'Deployment failed');
      setDeploying(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-2xl w-full"
      >
        <div className="card text-center">
          {error ? (
            <>
              <div className="p-4 bg-red-900/20 rounded-full inline-block mb-6">
                <svg
                  className="w-16 h-16 text-red-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-red-400 mb-4">Deployment Failed</h2>
              <p className="text-gray-400 mb-6">{error}</p>
              <button onClick={() => navigate('/')} className="btn-secondary">
                Return Home
              </button>
            </>
          ) : deploying ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                className="inline-block mb-6"
              >
                <Rocket className="w-16 h-16 text-primary" />
              </motion.div>

              <h2 className="text-2xl font-bold mb-2">Deploying to NodeOps</h2>
              <p className="text-gray-400 mb-8">
                {location.state?.projectName || 'Your application'} is being deployed...
              </p>

              {/* Progress stages */}
              <div className="space-y-4 mb-8">
                {DEPLOYMENT_STAGES.map((stage, index) => (
                  <motion.div
                    key={stage.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center space-x-4"
                  >
                    {index < currentStage ? (
                      <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0" />
                    ) : index === currentStage ? (
                      <Loader2 className="w-6 h-6 text-primary animate-spin flex-shrink-0" />
                    ) : (
                      <div className="w-6 h-6 border-2 border-gray-700 rounded-full flex-shrink-0" />
                    )}
                    <span
                      className={`text-left ${
                        index <= currentStage ? 'text-gray-300' : 'text-gray-600'
                      }`}
                    >
                      {stage.label}
                    </span>
                  </motion.div>
                ))}
              </div>

              {/* Progress bar */}
              <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-primary"
                  initial={{ width: '0%' }}
                  animate={{
                    width: `${((currentStage + 1) / DEPLOYMENT_STAGES.length) * 100}%`,
                  }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </>
          ) : (
            <>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200 }}
                className="inline-block mb-6"
              >
                <div className="p-4 bg-green-900/20 rounded-full">
                  <CheckCircle className="w-16 h-16 text-green-400" />
                </div>
              </motion.div>

              <h2 className="text-2xl font-bold text-green-400 mb-4">
                Deployment Successful!
              </h2>
              <p className="text-gray-400 mb-6">
                Your application is now running on NodeOps infrastructure.
              </p>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <p className="text-sm text-gray-500">Redirecting to dashboard...</p>
              </motion.div>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}


