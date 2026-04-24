import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { useAuthStore } from '../store/useAuthStore';
import BlockRenderer from '../components/BlockRenderer';

export default function Preview() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { sites } = useStore();
  
  const site = sites.find(s => s.id === id);

  useEffect(() => {
    if (!site) navigate('/dashboard');
  }, [site, navigate]);

  if (!site) return null;

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

  const userPlan = useAuthStore.getState().user?.plan || 'free';

  // Helper for scroll navigation
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
      {/* Live Navbar */}
      <nav className="h-16 md:h-20 border-b border-gray-100/10 px-6 sm:px-8 flex items-center justify-between sticky top-0 bg-pageBg/90 backdrop-blur-md z-50 shadow-sm">
        <div 
          className="font-bold text-xl md:text-2xl tracking-tight text-primary cursor-pointer truncate"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          {site.name}
        </div>
        
        <div className="hidden sm:flex space-x-6 md:space-x-8 text-sm font-medium">
          {sections.filter(s => s.type !== 'footer').map(sec => (
            <button 
              key={`nav-${sec.id}`}
              onClick={() => scrollToSection(sec.id)}
              className="text-pageText opacity-70 hover:opacity-100 hover:text-primary transition-all capitalize"
            >
              {((sec.data as any).title) || sec.type}
            </button>
          ))}
        </div>

        {/* Mobile menu button */}
        <div className="sm:hidden flex flex-col space-y-1.5 cursor-pointer p-2 opacity-70 hover:opacity-100">
          <div className="w-6 h-0.5 bg-pageText"></div>
          <div className="w-6 h-0.5 bg-pageText"></div>
          <div className="w-6 h-0.5 bg-pageText"></div>
        </div>
      </nav>

      {/* Dynamic Sections */}
      <main className="flex-1 flex flex-col bg-transparent">
        {sections.length === 0 ? (
          <div className="flex items-center justify-center h-[60vh] text-center px-4">
            <h2 className="text-2xl font-bold opacity-50">Este sitio aún no tiene contenido.</h2>
          </div>
        ) : (
          sections.map(sec => (
            <BlockRenderer 
              key={sec.id}
              section={sec} 
              isEditMode={false} // MODO PREVIEW: desactiva la edición y activa los botones
            />
          ))
        )}
      </main>

      {userPlan === 'free' && (
        <a 
          href="https://webforgex.com" 
          target="_blank" 
          rel="noreferrer"
          className="fixed bottom-4 right-4 bg-white dark:bg-slate-900 text-gray-800 dark:text-white px-3 py-2 rounded-full shadow-lg border border-gray-200 dark:border-gray-800 flex items-center space-x-2 text-xs font-medium opacity-70 hover:opacity-100 transition-opacity z-50"
        >
          <span>Hecho con WebForgeX</span>
        </a>
      )}
    </div>
  );
}