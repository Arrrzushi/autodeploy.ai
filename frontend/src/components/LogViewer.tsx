import { useEffect, useRef } from 'react';
import { Terminal } from 'lucide-react';

interface Log {
  timestamp: Date | string;
  level: string;
  message: string;
}

interface LogViewerProps {
  logs: Log[];
  title?: string;
}

export default function LogViewer({ logs, title = 'Container Logs' }: LogViewerProps) {
  const logsEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Auto-scroll to bottom when new logs arrive
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const getLevelColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'error':
        return 'text-red-400';
      case 'warning':
        return 'text-yellow-400';
      case 'success':
        return 'text-green-400';
      default:
        return 'text-gray-400';
    }
  };

  return (
    <div className="card">
      <div className="flex items-center space-x-2 mb-4">
        <Terminal className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-semibold text-gray-100">{title}</h3>
        <span className="text-xs text-gray-500 ml-auto">{logs.length} entries</span>
      </div>
      
      <div className="bg-gray-950 border border-gray-800 rounded-lg p-4 h-96 overflow-y-auto font-mono text-sm">
        {logs.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-500">
            No logs available
          </div>
        ) : (
          <div className="space-y-1">
            {logs.map((log, index) => (
              <div key={index} className="flex space-x-3">
                <span className="text-gray-600 flex-shrink-0">
                  {new Date(log.timestamp).toLocaleTimeString()}
                </span>
                <span className={`${getLevelColor(log.level)} flex-shrink-0 w-20`}>
                  [{log.level.toUpperCase()}]
                </span>
                <span className="text-gray-300 flex-1">{log.message}</span>
              </div>
            ))}
            <div ref={logsEndRef} />
          </div>
        )}
      </div>
    </div>
  );
}



