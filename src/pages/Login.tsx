import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { MonitorSmartphone, Lock, Mail, Loader2 } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import toast from 'react-hot-toast';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const setAuth = useAuthStore((state) => state.setAuth);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulación de login para prototipo
    setTimeout(() => {
      const mockUser = {
        id: 1,
        email: email,
        name: email.split('@')[0],
        plan: 'free' as const
      };
      const mockToken = 'mock-jwt-token-' + Date.now();
      
      setAuth(mockUser, mockToken);
      toast.success('¡Bienvenido (Modo Prototipo)!');
      setLoading(false);
      navigate('/dashboard');
    }, 1000);
  };

  const handleResetPassword = async () => {
    if (!email) {
      toast.error('Ingresa tu email primero');
      return;
    }
    
    // Simulación de recuperación para prototipo
    toast.success('Se ha enviado un enlace de recuperación (Simulado)');
  };

  return (
    <div className="flex-1 flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 dark:bg-darker transition-colors duration-200">
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-slate-900 p-10 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-800">
        <div>
          <MonitorSmartphone className="mx-auto h-12 w-12 text-primary" />
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            Inicia sesión
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            Gestiona tus sitios y lleva tu negocio al siguiente nivel
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4 rounded-md shadow-sm">
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-xl relative block w-full px-12 py-3 border border-gray-300 dark:border-gray-700 placeholder-gray-500 text-gray-900 dark:text-white bg-gray-50 dark:bg-slate-800 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm transition-colors"
                placeholder="Correo electrónico"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-xl relative block w-full px-12 py-3 border border-gray-300 dark:border-gray-700 placeholder-gray-500 text-gray-900 dark:text-white bg-gray-50 dark:bg-slate-800 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm transition-colors"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center justify-end">
            <button
              type="button"
              onClick={handleResetPassword}
              className="text-sm font-medium text-primary hover:text-indigo-500 transition-colors"
            >
              ¿Olvidaste tu contraseña?
            </button>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-xl text-white bg-primary hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md"
            >
              {loading ? (
                <Loader2 className="animate-spin h-5 w-5 text-white" />
              ) : 'Ingresar'}
            </button>
          </div>
          <div className="text-center text-sm">
            <span className="text-gray-600 dark:text-gray-400">¿No tienes cuenta? </span>
            <Link to="/register" className="font-medium text-primary hover:text-indigo-500 transition-colors">
              Regístrate aquí
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
