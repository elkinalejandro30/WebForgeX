import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { useAuthStore } from '../store/useAuthStore';
import { Plus, Globe, ShoppingBag, BookOpen, LayoutTemplate, Copy, Eye, MousePointerClick, TrendingUp, CheckCircle, XCircle, Edit2, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Dashboard() {
  const { sites, fetchSites, duplicateSite, togglePublishSite, deleteSite } = useStore();
  const user = useAuthStore(state => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      fetchSites();
    }
  }, [user]);

  const userPlan = user?.plan || 'free';
  const maxSites = userPlan === 'free' ? 1 : userPlan === 'pro' ? 5 : 20;
  const maxPublished = userPlan === 'free' ? 1 : userPlan === 'pro' ? 5 : 20;

  const getIconForType = (type: string) => {
    switch (type) {
      case 'store': return <ShoppingBag className="h-6 w-6" />;
      case 'blog': return <BookOpen className="h-6 w-6" />;
      case 'landing': return <LayoutTemplate className="h-6 w-6" />;
      default: return <Globe className="h-6 w-6" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'store': return 'Tienda Online';
      case 'blog': return 'Blog';
      case 'landing': return 'Landing Page';
      case 'portfolio': return 'Portafolio';
      case 'restaurant': return 'Restaurante';
      case 'agency': return 'Agencia';
      default: return 'Sitio Web';
    }
  };

  const handleDuplicate = (id: string, name: string) => {
    if (sites.length >= maxSites) {
      toast.error(`Límite alcanzado: máximo ${maxSites} sitio(s) en tu plan actual.`);
      return;
    }
    duplicateSite(id);
    toast.success(`Sitio "${name}" duplicado con éxito`);
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`¿Estás seguro de eliminar "${name}" de forma permanente?`)) {
      deleteSite(id);
      toast.success(`Sitio "${name}" eliminado`);
    }
  };

  const handleTogglePublish = (id: string, isPublished: boolean) => {
    if (!isPublished) {
      const currentPublished = sites.filter(s => s.published).length;
      if (currentPublished >= maxPublished) {
        toast.error(`Límite alcanzado: solo puedes tener ${maxPublished} sitio(s) publicado(s) en tu plan actual.`);
        return;
      }
    }

    togglePublishSite(id);
    if (isPublished) {
      toast('Sitio despublicado', { icon: '🚫' });
    } else {
      toast.success('¡Sitio publicado con éxito!');
    }
  };

  return (
    <div className="flex-1 bg-gray-50 dark:bg-darker py-8 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              ¡Hola, {user?.name || user?.email?.split('@')[0] || 'creador'}! 👋
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              Gestiona tus sitios o crea uno nuevo.
            </p>
          </div>
          <button
            onClick={() => navigate('/templates')}
            className="flex items-center justify-center space-x-2 bg-primary hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-medium transition-all shadow-md hover:shadow-primary/30"
          >
            <Plus className="h-5 w-5" />
            <span>Crear nuevo sitio</span>
          </button>
        </div>

        {sites.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 p-12 text-center animate-fade-in">
            <div className="w-20 h-20 bg-indigo-50 dark:bg-indigo-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <Globe className="h-10 w-10 text-primary" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No tienes ningún sitio aún</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md mx-auto">
              Comienza a construir tu presencia en línea creando tu primer sitio web. Es fácil y rápido.
            </p>
            <button
              onClick={() => navigate('/templates')}
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-primary hover:bg-indigo-700 transition-colors shadow-md"
            >
              <Plus className="h-5 w-5 mr-2" />
              Crear mi primer sitio
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 animate-fade-in">
            {sites.map((site) => (
              <div key={site.id} className="group bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden hover:shadow-md transition-all flex flex-col">
                <div className="p-6 flex-1 flex flex-col">
                  
                  {/* Header */}
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/30 text-primary rounded-xl flex items-center justify-center flex-shrink-0">
                        {getIconForType(site.type)}
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white line-clamp-1" title={site.name}>
                          {site.name}
                        </h3>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300">
                            {getTypeLabel(site.type)}
                          </span>
                          {site.published ? (
                            <span className="inline-flex items-center text-xs font-medium text-emerald-600 dark:text-emerald-400">
                              <CheckCircle className="w-3 h-3 mr-1" /> Publicado
                            </span>
                          ) : (
                            <span className="inline-flex items-center text-xs font-medium text-amber-600 dark:text-amber-400">
                              <XCircle className="w-3 h-3 mr-1" /> Borrador
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Stats (Mock) */}
                  <div className="grid grid-cols-3 gap-4 mb-6 py-4 border-y border-gray-100 dark:border-gray-800 flex-1">
                    <div className="text-center">
                      <div className="flex items-center justify-center text-gray-400 mb-1">
                        <Eye className="w-4 h-4 mr-1" />
                        <span className="text-xs uppercase font-semibold">Visitas</span>
                      </div>
                      <span className="text-lg font-bold text-gray-900 dark:text-white">
                        {site.published ? site.stats?.views?.toLocaleString() || 0 : '-'}
                      </span>
                    </div>
                    <div className="text-center border-l border-r border-gray-100 dark:border-gray-800">
                      <div className="flex items-center justify-center text-gray-400 mb-1">
                        <MousePointerClick className="w-4 h-4 mr-1" />
                        <span className="text-xs uppercase font-semibold">Clics</span>
                      </div>
                      <span className="text-lg font-bold text-gray-900 dark:text-white">
                        {site.published ? site.stats?.clicks?.toLocaleString() || 0 : '-'}
                      </span>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center text-gray-400 mb-1">
                        <TrendingUp className="w-4 h-4 mr-1" />
                        <span className="text-xs uppercase font-semibold">Conv.</span>
                      </div>
                      <span className="text-lg font-bold text-gray-900 dark:text-white">
                        {site.published ? `${site.stats?.conversions || 0}%` : '-'}
                      </span>
                    </div>
                  </div>
                  
                  {/* Actions */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      Modificado {new Date(site.createdAt).toLocaleDateString()}
                    </span>
                    
                    <div className="flex space-x-1 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => handleTogglePublish(site.id, site.published)}
                        className={`p-2 rounded-lg transition-colors ${
                          site.published 
                            ? 'text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/30' 
                            : 'text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/30'
                        }`}
                        title={site.published ? "Despublicar sitio" : "Publicar sitio"}
                      >
                        {site.published ? <XCircle className="h-5 w-5" /> : <CheckCircle className="h-5 w-5" />}
                      </button>
                      <button 
                        onClick={() => handleDuplicate(site.id, site.name)}
                        className="p-2 text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                        title="Duplicar sitio"
                      >
                        <Copy className="h-5 w-5" />
                      </button>
                      <button 
                        onClick={() => navigate(`/editor/${site.id}`)}
                        className="p-2 text-primary hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-lg transition-colors"
                        title="Editar diseño"
                      >
                        <Edit2 className="h-5 w-5" />
                      </button>
                      <button 
                        onClick={() => handleDelete(site.id, site.name)}
                        className="p-2 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                        title="Eliminar permanentemente"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                  
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
