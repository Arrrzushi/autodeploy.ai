import { Link } from 'react-router-dom';
import { Rocket } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="p-2 bg-gradient-primary rounded-lg group-hover:shadow-lg group-hover:shadow-primary/50 transition-all duration-300">
              <Rocket className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold gradient-text">
              AutoDeploy.AI
            </span>
          </Link>

          <div className="flex items-center space-x-6">
            <Link
              to="/"
              className="text-gray-300 hover:text-white transition-colors duration-200"
            >
              Home
            </Link>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-300 hover:text-white transition-colors duration-200"
            >
              GitHub
            </a>
            <a
              href="https://nodeops.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-300 hover:text-white transition-colors duration-200"
            >
              NodeOps
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}



