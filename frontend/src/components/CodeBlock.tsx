import { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { copyToClipboard } from '../utils/validation';

interface CodeBlockProps {
  code: string;
  language?: string;
  title?: string;
}

export default function CodeBlock({ code, language = 'dockerfile', title }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const success = await copyToClipboard(code);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          {title && <h3 className="text-lg font-semibold text-gray-100">{title}</h3>}
          <span className="text-xs text-gray-500 uppercase">{language}</span>
        </div>
        <button
          onClick={handleCopy}
          className="p-2 hover:bg-gray-800 rounded-lg transition-colors duration-200"
          title="Copy to clipboard"
        >
          {copied ? (
            <Check className="w-5 h-5 text-green-400" />
          ) : (
            <Copy className="w-5 h-5 text-gray-400" />
          )}
        </button>
      </div>
      <div className="code-block">
        <pre className="text-gray-300 whitespace-pre-wrap">
          <code>{code}</code>
        </pre>
      </div>
    </div>
  );
}



