import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Site, Section } from '../store/useStore';
import BlockRenderer from '../components/BlockRenderer';
import { Loader2, AlertCircle, Globe } from 'lucide-react';
import { API_URL } from '../config/api';

export default function PublicSite() {
  const { projectId } = useParams();
  const [site, setSite] = useState<Site | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSite = async () => {
      if (!projectId) return;
      
      try {
        setLoading(true);
        // En modo prototipo, buscamos el sitio en el localStorage a través del store
        const sites = JSON.parse(localStorage.getItem('webforgex-storage') || '{}')?.state?.sites || [];
        const foundSite = sites.find((s: Site) => s.id === projectId);
        
        if (foundSite) {
          if (foundSite.published) {
            setSite(foundSite);
          } else {
            setError('Este sitio aún no ha sido publicado.');
          }
        } else {
          setError('El sitio solicitado no existe en este navegador.');
        }
      } catch (err) {
        setError('Error al cargar el sitio local.');
      } finally {
        setLoading(false);
      }
    };

    fetchSite();
  }, [projectId]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-slate-900">
        <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
        <p className="text-gray-500 font-medium animate-pulse">Cargando sitio...</p>
      </div>
    );
  }

  if (error || !site) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-slate-900 px-4 text-center">
        <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 text-red-600 rounded-full flex items-center justify-center mb-6">
          <AlertCircle className="w-10 h-10" />
        </div>
        <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-2 uppercase tracking-tighter">Ups... algo salió mal</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md">{error || 'El sitio no está disponible.'}</p>
        <Link 
          to="/" 
          className="px-8 py-3 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/20 hover:-translate-y-1 transition-all active:scale-95"
        >
          Ir al inicio
        </Link>
      </div>
    );
  }

  const sections = site.sections || [];
  const theme = site.theme || { primaryColor: '#2563eb', secondaryColor: '#1e40af', backgroundColor: '#f8fafc', textColor: '#0f172a', fontFamily: 'inter' };
  
  const fontMap: Record<string, string> = {
    'inter': 'font-inter',
    'roboto': 'font-roboto',
    'playfair': 'font-playfair',
    'montserrat': 'font-montserrat',
    'poppins': 'font-poppins'
  };
  const fontClass = fontMap[theme.fontFamily] || 'font-inter';

  const scrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div 
      className={`min-h-screen w-full flex flex-col bg-pageBg text-pageText ${fontClass}`}
      style={{
        '--color-primary': theme.primaryColor,
        '--color-secondary': theme.secondaryColor,
        '--color-bg': theme.backgroundColor,
        '--color-text': theme.textColor
      } as React.CSSProperties}
    >
      {/* Public Navbar */}
      <nav className="h-16 md:h-20 border-b border-gray-100/10 px-6 sm:px-8 flex items-center justify-between sticky top-0 bg-pageBg/90 backdrop-blur-md z-50 shadow-sm">
        <div 
          className="font-bold text-xl md:text-2xl tracking-tight text-primary cursor-pointer truncate"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          {site.name}
        </div>
        
        <div className="hidden sm:flex space-x-6 md:space-x-8 text-sm font-medium">
          {sections.filter((s: Section) => s.type !== 'footer').map((sec: Section) => (
            <button 
              key={`nav-${sec.id}`}
              onClick={() => scrollToSection(sec.id)}
              className="text-pageText opacity-70 hover:opacity-100 hover:text-primary transition-all capitalize"
            >
              {((sec.data as any).title) || sec.type}
            </button>
          ))}
        </div>

        {/* Mobile menu button simplified */}
        <div className="sm:hidden p-2 opacity-70">
          <Globe className="w-6 h-6 text-primary" />
        </div>
      </nav>

      <main className="flex-1 flex flex-col bg-transparent">
        {sections.map((sec: Section) => (
          <BlockRenderer 
            key={sec.id}
            section={sec} 
            isEditMode={false} 
          />
        ))}
      </main>

      {/* Brand Watermark */}
      <div className="bg-gray-50 dark:bg-slate-900 py-8 border-t border-gray-100 dark:border-gray-800 text-center">
        <a 
          href="https://elkinalejandro30.github.io/WebForgeX" 
          target="_blank" 
          rel="noreferrer"
          className="inline-flex items-center space-x-2 text-gray-400 hover:text-primary transition-colors text-sm font-bold uppercase tracking-widest"
        >
          <span>Creado con WebForgeX</span>
        </a>
      </div>
    </div>
  );
}
