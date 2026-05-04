import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { Moon, Sun, MonitorSmartphone } from 'lucide-react';

export default function Navbar() {
  const { isDarkMode, toggleDarkMode } = useStore();
  const navigate = useNavigate();

  return (
    <nav className="sticky top-0 z-50 w-full backdrop-blur-md bg-white/80 dark:bg-darker/80 border-b border-gray-200 dark:border-gray-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center space-x-2 cursor-pointer" onClick={() => navigate('/')}>
            <MonitorSmartphone className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600">
              WebForgeX
            </span>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Toggle dark mode"
            >
              {isDarkMode ? <Sun className="h-5 w-5 text-yellow-500" /> : <Moon className="h-5 w-5 text-slate-700" />}
            </button>

            <Link
              to="/dashboard"
              className="bg-primary hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-all shadow-md hover:shadow-lg active:scale-95"
            >
              Ir al Dashboard
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
