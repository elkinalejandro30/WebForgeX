import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useStore } from './store/useStore';
import { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';

// Layouts & Components
import Navbar from './components/Navbar';

// Pages
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import Templates from './pages/Templates';
import Editor from './pages/Editor';
import Preview from './pages/Preview';
import PublicSite from './pages/PublicSite';

function App() {
  const isDarkMode = useStore((state) => state.isDarkMode);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  return (
    <BrowserRouter basename={import.meta.env.DEV ? '/' : '/WebForgeX'}>
      <div className="min-h-screen flex flex-col font-sans">
        <Toaster position="bottom-right" toastOptions={{
          className: 'dark:bg-slate-800 dark:text-white border border-gray-100 dark:border-gray-700',
        }} />
        <Navbar />
        <main className="flex-1 flex flex-col">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Navigate to="/dashboard" replace />} />
            <Route path="/register" element={<Navigate to="/dashboard" replace />} />
            
            {/* Protected Routes (No longer restricted in prototype mode) */}
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/templates" element={<Templates />} />
            <Route path="/editor/:id" element={<Editor />} />
            <Route path="/preview/:id" element={<Preview />} />

            {/* Public Route */}
            <Route path="/site/:projectId" element={<PublicSite />} />
            
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
