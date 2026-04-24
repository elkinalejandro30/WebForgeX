import { useState, useRef } from 'react';
import { Section, SectionType, SectionStyle, SocialData, ServicesData, HeroData, AboutData } from '../store/useStore';
import { useAuthStore } from '../store/useAuthStore';
import toast from 'react-hot-toast';
import { Layout, Grid, Plus, ArrowUp, ArrowDown, Trash2, Copy, AlignLeft, AlignCenter, AlignRight, Link, Share2, Upload, Loader2, Globe, Search, Lock as LockIcon } from 'lucide-react';

import { uploadImage } from '../firebase/storage';

// Reusable Image Uploader Component with Optimization
const ImageInput = ({ url, onChange, label = "Imagen" }: { url: string, onChange: (url: string) => void, label?: string }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const user = useAuthStore(state => state.user);

  const optimizeImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (e) => {
        const img = new Image();
        img.src = e.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          // Max dimensions
          const MAX_WIDTH = 1200;
          const MAX_HEIGHT = 1200;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);

          // Convert to WEBP with 0.8 quality
          const optimizedDataUrl = canvas.toDataURL('image/webp', 0.8);
          resolve(optimizedDataUrl);
        };
        img.onerror = reject;
      };
      reader.onerror = reject;
    });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement> | React.DragEvent) => {
    let file: File | undefined;
    
    if ('files' in e.target && e.target.files?.[0]) {
      file = e.target.files[0];
    } else if ('dataTransfer' in e && e.dataTransfer.files?.[0]) {
      file = e.dataTransfer.files[0];
    }

    if (!file) return;
    if (!user?.uid) {
      toast.error('Debes iniciar sesión para subir imágenes');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('La imagen no debe superar los 5MB para mantener el rendimiento');
      return;
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Formato no soportado. Usa JPG, PNG o WEBP');
      return;
    }

    setIsUploading(true);
    try {
      const optimizedDataUrl = await optimizeImage(file);
      // Sube directamente a Firebase Storage
      const storageUrl = await uploadImage(optimizedDataUrl, user.uid);
      onChange(storageUrl);
      toast.success('Imagen optimizada y subida a la nube');
    } catch (error) {
      toast.error('Error al procesar o subir la imagen');
    } finally {
      setIsUploading(false);
      setDragActive(false);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-[11px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.1em]">{label}</label>
        {url && (
          <button 
            onClick={() => onChange('')}
            className="text-[10px] font-bold text-red-500 hover:text-red-600 transition-colors uppercase"
          >
            Eliminar
          </button>
        )}
      </div>

      <div className="space-y-3">
        {/* Preview & Change Button */}
        {url ? (
          <div className="relative group rounded-2xl overflow-hidden aspect-video border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-slate-900 shadow-sm">
            <img src={url} alt="Preview" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col items-center justify-center space-y-2 backdrop-blur-[2px]">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 bg-white text-gray-900 text-xs font-bold rounded-full hover:bg-primary hover:text-white transition-all shadow-xl transform translate-y-2 group-hover:translate-y-0"
              >
                Cambiar Imagen
              </button>
            </div>
            {isUploading && (
              <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center">
                <Loader2 className="w-6 h-6 text-white animate-spin" />
              </div>
            )}
          </div>
        ) : (
          <div 
            onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
            onDragLeave={() => setDragActive(false)}
            onDrop={(e) => { e.preventDefault(); handleFileUpload(e); }}
            className={`
              relative flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-2xl transition-all duration-300
              ${dragActive ? 'border-primary bg-primary/5 scale-[1.02]' : 'border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-slate-900 hover:border-gray-300 dark:hover:border-gray-700'}
            `}
          >
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileUpload} 
              accept="image/png, image/jpeg, image/webp" 
              className="hidden" 
            />
            
            {isUploading ? (
              <div className="flex flex-col items-center space-y-2">
                <Loader2 className="w-6 h-6 text-primary animate-spin" />
                <span className="text-[10px] font-bold text-primary uppercase">Optimizando...</span>
              </div>
            ) : (
              <>
                <div className="w-10 h-10 rounded-full bg-white dark:bg-slate-800 shadow-sm flex items-center justify-center mb-3 text-gray-400">
                  <Upload className="w-5 h-5" />
                </div>
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="text-xs font-bold text-gray-900 dark:text-white hover:text-primary transition-colors"
                >
                  Subir archivo
                </button>
                <p className="text-[10px] text-gray-400 mt-1 uppercase font-medium">o arrastra y suelta</p>
              </>
            )}
          </div>
        )}

        {/* URL Input Alternative */}
        <div className="relative group">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <Link className="h-3.5 w-3.5 text-gray-400 group-focus-within:text-primary transition-colors" />
          </div>
          <input 
            type="url" 
            value={url?.startsWith('data:') ? '' : url || ''} 
            onChange={(e) => onChange(e.target.value)} 
            placeholder="Pegar URL de imagen..." 
            className="w-full pl-9 pr-4 py-2.5 text-xs font-medium border border-gray-200 dark:border-gray-800 rounded-xl dark:bg-slate-900 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all placeholder:text-gray-400" 
          />
        </div>
      </div>
    </div>
  );
};

export const sectionTypesList: { type: SectionType; label: string; icon: any; defaultData: any }[] = [
  { type: 'hero', label: 'Hero / Cabecera', icon: Layout, defaultData: { title: 'Nuevo Título', description: 'Nueva descripción', imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1920&q=80', buttonText: 'Click aquí' } },
  { type: 'about', label: 'Sobre Nosotros', icon: Grid, defaultData: { title: 'Sobre Nosotros', description: 'Somos una empresa dedicada a brindar las mejores soluciones.' } },
  { type: 'services', label: 'Servicios', icon: Grid, defaultData: { title: 'Nuestros Servicios', items: [{ title: 'Servicio 1', desc: 'Descripción del servicio' }] } },
  { type: 'social', label: 'Redes Sociales', icon: Share2, defaultData: { title: 'Síguenos', layout: 'horizontal', iconSize: 24, items: [
    { platform: 'facebook', url: 'https://facebook.com', active: true },
    { platform: 'instagram', url: 'https://instagram.com', active: true },
    { platform: 'twitter', url: 'https://twitter.com', active: true }
  ] } },
  { type: 'products', label: 'Productos', icon: Grid, defaultData: { title: 'Nuestros Productos', items: [] } },
  { type: 'articles', label: 'Artículos', icon: Grid, defaultData: { title: 'Últimas Noticias', items: [] } },
  { type: 'menu', icon: Grid, label: 'Menú', defaultData: { title: 'Nuestro Menú', categories: [] } },
  { type: 'projects', icon: Grid, label: 'Proyectos', defaultData: { title: 'Mi Trabajo', items: [] } },
  { type: 'gallery', icon: Grid, label: 'Galería', defaultData: { title: 'Galería', images: [] } },
  { type: 'testimonials', icon: Grid, label: 'Testimonios', defaultData: { title: 'Clientes', items: [] } },
  { type: 'cta', icon: Grid, label: 'CTA', defaultData: { title: '¿Listo?', description: '...', buttonText: 'Click' } },
  { type: 'faq', icon: Grid, label: 'FAQ', defaultData: { title: 'Preguntas', items: [] } },
  { type: 'contact', icon: Grid, label: 'Contacto', defaultData: { title: 'Contacto', email: '' } },
  { type: 'footer', icon: Grid, label: 'Footer', defaultData: { text: '© 2024' } },
];

export const predefinedPalettes = [
  { id: 'corporativo', label: 'Corporativo', primaryColor: '#2563eb', secondaryColor: '#1e40af', backgroundColor: '#f8fafc', textColor: '#1e293b' },
  { id: 'creativo', label: 'Creativo', primaryColor: '#9333ea', secondaryColor: '#7e22ce', backgroundColor: '#ffffff', textColor: '#1e293b' },
  { id: 'minimalista', label: 'Minimalista', primaryColor: '#000000', secondaryColor: '#333333', backgroundColor: '#ffffff', textColor: '#000000' },
  { id: 'ecommerce', label: 'Ecommerce', primaryColor: '#10b981', secondaryColor: '#047857', backgroundColor: '#ffffff', textColor: '#1e293b' },
  { id: 'warm', label: 'Cálido', primaryColor: '#ef4444', secondaryColor: '#b91c1c', backgroundColor: '#ffffff', textColor: '#1e293b' },
];

export const fonts = [
  { id: 'inter', label: 'Inter (Moderno)' },
  { id: 'poppins', label: 'Poppins (Startup)' },
  { id: 'roboto', label: 'Roboto (Neutral)' },
  { id: 'playfair', label: 'Playfair Display (Elegante)' },
  { id: 'montserrat', label: 'Montserrat (Corporativo)' },
];

interface EditorSidebarProps {
  site: any;
  activeTab: 'content' | 'design' | 'config';
  activeSectionId: string | null;
  setActiveSectionId: (id: string | null) => void;
  onAddSection: (type: SectionType) => void;
  onUpdateSection: (sectionId: string, data: any) => void;
  onUpdateSectionStyle: (sectionId: string, style: Partial<SectionStyle>) => void;
  onRemoveSection: (sectionId: string) => void;
  onDuplicateSection: (sectionId: string) => void;
  onReorderSections: (startIndex: number, endIndex: number) => void;
  onUpdateTheme: (theme: any) => void;
  onUpdateSite?: (updates: any) => void;
}

export default function EditorSidebar({
  site, activeTab, activeSectionId, setActiveSectionId,
  onAddSection, onUpdateSection, onUpdateSectionStyle, onRemoveSection, onDuplicateSection, onReorderSections, onUpdateTheme, onUpdateSite
}: EditorSidebarProps) {
  const [showAddSection, setShowAddSection] = useState(false);
  const userPlan = useAuthStore(state => state.user?.plan || 'free');
  const sections = site.sections || [];
  const theme = site.theme || { primaryColor: '#4f46e5', secondaryColor: '#4338ca', backgroundColor: '#ffffff', textColor: '#0f172a', fontFamily: 'inter' };

  // Reorder sections handler for UI arrows (still useful as fallback)
  const premiumBlocks = ['products', 'menu', 'gallery', 'faq'];
  const maxBlocks = userPlan === 'free' ? 6 : 999;

  if (activeTab === 'config') {
    return (
      <div className="p-6 space-y-8 animate-fade-in overflow-y-auto h-full">
        <div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center">
            <Globe className="w-5 h-5 mr-2 text-primary" /> Configuración del Sitio
          </h3>
          
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300">Nombre del Proyecto</label>
              <input 
                type="text" 
                value={site.name} 
                onChange={(e) => onUpdateSite?.({ name: e.target.value })}
                className="w-full p-3 text-sm border border-gray-200 dark:border-gray-700 rounded-xl dark:bg-slate-800 outline-none focus:ring-2 focus:ring-primary/20" 
              />
            </div>

            <div className="space-y-4 pt-4 border-t border-gray-100 dark:border-gray-800">
              <h4 className="text-sm font-bold text-gray-900 dark:text-white flex items-center">
                <Search className="w-4 h-4 mr-2" /> SEO y Metadatos
              </h4>
              <div className="space-y-2">
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">Título SEO</label>
                <input 
                  type="text" 
                  placeholder="Título que aparece en Google"
                  className="w-full p-3 text-sm border border-gray-200 dark:border-gray-700 rounded-xl dark:bg-slate-800 outline-none focus:ring-2 focus:ring-primary/20" 
                />
              </div>
              <div className="space-y-2">
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">Descripción SEO</label>
                <textarea 
                  rows={3}
                  placeholder="Breve descripción de tu sitio..."
                  className="w-full p-3 text-sm border border-gray-200 dark:border-gray-700 rounded-xl dark:bg-slate-800 outline-none focus:ring-2 focus:ring-primary/20 resize-none" 
                ></textarea>
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-gray-100 dark:border-gray-800">
              <h4 className="text-sm font-bold text-gray-900 dark:text-white flex items-center">
                <Share2 className="w-4 h-4 mr-2" /> Redes Sociales
              </h4>
              <div className="p-4 bg-gray-50 dark:bg-slate-800/50 rounded-2xl border border-dashed border-gray-200 dark:border-gray-700">
                <p className="text-xs text-gray-500 text-center">Aquí podrás ver una vista previa de cómo se verá tu sitio al compartirlo en WhatsApp, Facebook y X.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (activeTab === 'design') {
    return (
      <div className="p-6 space-y-8 animate-fade-in overflow-y-auto h-full">
        
        {/* Tipografía */}
        <div>
          <label className="block text-sm font-bold mb-3 text-gray-900 dark:text-white">Tipografía Global</label>
          <div className="space-y-2">
            {fonts.map(f => (
              <button
                key={f.id}
                onClick={() => onUpdateTheme({ fontFamily: f.id })}
                className={`w-full p-3 text-left rounded-xl border transition-all ${theme.fontFamily === f.id ? 'border-primary bg-indigo-50 dark:bg-indigo-900/20 text-primary' : 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-gray-300'}`}
              >
                <span className={`font-${f.id} text-base`}>{f.label}</span>
              </button>
            ))}
          </div>
        </div>

        <hr className="border-gray-200 dark:border-gray-800" />

        {/* Paletas Predefinidas */}
        <div>
          <label className="block text-sm font-bold mb-3 text-gray-900 dark:text-white">Paletas Predefinidas</label>
          <div className="grid grid-cols-2 gap-3">
            {predefinedPalettes.map(palette => (
              <button
                key={palette.id}
                onClick={() => onUpdateTheme({ 
                  primaryColor: palette.primaryColor,
                  secondaryColor: palette.secondaryColor,
                  backgroundColor: palette.backgroundColor,
                  textColor: palette.textColor
                })}
                className="p-2 border border-gray-200 dark:border-gray-700 rounded-xl hover:border-primary transition-colors text-left"
              >
                <span className="text-xs font-medium block mb-2">{palette.label}</span>
                <div className="flex space-x-1 h-6 rounded overflow-hidden">
                  <div className="flex-1" style={{ backgroundColor: palette.primaryColor }}></div>
                  <div className="flex-1" style={{ backgroundColor: palette.secondaryColor }}></div>
                  <div className="flex-1" style={{ backgroundColor: palette.backgroundColor, border: '1px solid #e5e7eb' }}></div>
                  <div className="flex-1" style={{ backgroundColor: palette.textColor }}></div>
                </div>
              </button>
            ))}
          </div>
        </div>

        <hr className="border-gray-200 dark:border-gray-800" />

        {/* Colores Personalizados */}
        <div>
          <label className="block text-sm font-bold mb-3 text-gray-900 dark:text-white">Colores Personalizados</label>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Color Primario</span>
              <div className="flex items-center space-x-2">
                <input type="text" value={theme.primaryColor} onChange={e => onUpdateTheme({ primaryColor: e.target.value })} className="w-20 text-xs border rounded p-1 dark:bg-slate-800 dark:border-gray-700" />
                <input type="color" value={theme.primaryColor} onChange={e => onUpdateTheme({ primaryColor: e.target.value })} className="w-8 h-8 rounded cursor-pointer" />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Color Secundario</span>
              <div className="flex items-center space-x-2">
                <input type="text" value={theme.secondaryColor} onChange={e => onUpdateTheme({ secondaryColor: e.target.value })} className="w-20 text-xs border rounded p-1 dark:bg-slate-800 dark:border-gray-700" />
                <input type="color" value={theme.secondaryColor} onChange={e => onUpdateTheme({ secondaryColor: e.target.value })} className="w-8 h-8 rounded cursor-pointer" />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Fondo</span>
              <div className="flex items-center space-x-2">
                <input type="text" value={theme.backgroundColor} onChange={e => onUpdateTheme({ backgroundColor: e.target.value })} className="w-20 text-xs border rounded p-1 dark:bg-slate-800 dark:border-gray-700" />
                <input type="color" value={theme.backgroundColor} onChange={e => onUpdateTheme({ backgroundColor: e.target.value })} className="w-8 h-8 rounded cursor-pointer" />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Texto</span>
              <div className="flex items-center space-x-2">
                <input type="text" value={theme.textColor} onChange={e => onUpdateTheme({ textColor: e.target.value })} className="w-20 text-xs border rounded p-1 dark:bg-slate-800 dark:border-gray-700" />
                <input type="color" value={theme.textColor} onChange={e => onUpdateTheme({ textColor: e.target.value })} className="w-8 h-8 rounded cursor-pointer" />
              </div>
            </div>
          </div>
        </div>

      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {sections.length === 0 && (
        <div className="text-center py-8 text-gray-500">No hay secciones. Añade una para empezar.</div>
      )}
      
      {sections.map((sec: Section, index: number) => {
        const isExpanded = activeSectionId === sec.id;
        const SecIcon = sectionTypesList.find(t => t.type === sec.type)?.icon || Layout;
        const style = sec.style || { padding: 'py-16', alignment: 'text-center', backgroundColor: 'bg-white' };
        const data = sec.data as any;

        return (
          <div key={sec.id} className={`border rounded-xl overflow-hidden transition-all ${isExpanded ? 'border-primary shadow-md' : 'border-gray-200 dark:border-gray-700'}`}>
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-800 cursor-pointer" onClick={() => setActiveSectionId(isExpanded ? null : sec.id)}>
              <div className="flex items-center space-x-3">
                <SecIcon className="w-5 h-5 text-gray-500" />
                <span className="font-medium text-sm text-gray-900 dark:text-white capitalize">{sec.type}</span>
              </div>
              <div className="flex items-center space-x-1" onClick={e => e.stopPropagation()}>
                <button disabled={index === 0} onClick={() => onReorderSections(index, index - 1)} className="p-1 text-gray-400 hover:text-gray-900 disabled:opacity-30" title="Subir"><ArrowUp className="w-4 h-4"/></button>
                <button disabled={index === sections.length - 1} onClick={() => onReorderSections(index, index + 1)} className="p-1 text-gray-400 hover:text-gray-900 disabled:opacity-30" title="Bajar"><ArrowDown className="w-4 h-4"/></button>
                <button onClick={() => onDuplicateSection(sec.id)} className="p-1 text-blue-400 hover:text-blue-600" title="Duplicar"><Copy className="w-4 h-4"/></button>
                <button onClick={() => onRemoveSection(sec.id)} className="p-1 text-red-400 hover:text-red-600" title="Eliminar"><Trash2 className="w-4 h-4"/></button>
              </div>
            </div>
            
            {isExpanded && (
              <div className="p-4 bg-white dark:bg-slate-900 border-t dark:border-gray-700 space-y-6">
                
                {/* Social Media Specific Controls */}
                {sec.type === 'social' && (() => {
                  const sData = sec.data as SocialData;
                  return (
                  <div className="space-y-6">
                    <div className="p-4 bg-primary/5 rounded-2xl border border-primary/10">
                      <p className="text-[11px] font-bold text-primary uppercase tracking-wider mb-2">Consejo PRO</p>
                      <p className="text-[10px] text-gray-600 dark:text-gray-400 leading-relaxed">Activa las redes que quieres mostrar y pega la URL de tu perfil. El diseño se ajustará automáticamente.</p>
                    </div>

                    <div className="space-y-3">
                      <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Layout del Bloque</label>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { id: 'horizontal', label: 'Horizontal', icon: AlignLeft },
                          { id: 'vertical', label: 'Vertical', icon: AlignCenter },
                          { id: 'grid', label: 'Cuadrícula', icon: Grid }
                        ].map((l) => (
                          <button
                            key={l.id}
                            onClick={() => onUpdateSection(sec.id, { ...sData, layout: l.id })}
                            className={`flex flex-col items-center justify-center py-3 px-1 rounded-xl border transition-all ${sData.layout === l.id ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20 scale-[1.05]' : 'bg-white dark:bg-slate-800 border-gray-100 dark:border-gray-800 text-gray-500 hover:border-gray-200'}`}
                          >
                            <l.icon className="w-4 h-4 mb-1" />
                            <span className="text-[10px] font-bold uppercase">{l.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Redes Configuradas</label>
                        <span className="text-[10px] font-bold text-gray-400">{(sData.items || []).filter((i: any) => i.active).length} Activas</span>
                      </div>
                      <div className="space-y-2">
                        {(sData.items || []).map((item: any, idx: number) => (
                          <div key={idx} className={`p-3 rounded-2xl border transition-all ${item.active ? 'bg-white dark:bg-slate-800 border-gray-200 dark:border-gray-700 shadow-sm' : 'bg-gray-50 dark:bg-slate-900 border-transparent opacity-60 hover:opacity-100'}`}>
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center space-x-3">
                                <select 
                                  value={item.platform}
                                  onChange={(e) => {
                                    const newItems = [...sData.items];
                                    newItems[idx] = { ...item, platform: e.target.value };
                                    onUpdateSection(sec.id, { ...sData, items: newItems });
                                  }}
                                  className="bg-transparent text-xs font-bold capitalize outline-none focus:text-primary transition-colors cursor-pointer"
                                >
                                  {['facebook', 'instagram', 'whatsapp', 'tiktok', 'linkedin', 'twitter', 'x', 'youtube', 'github', 'other'].map(p => (
                                    <option key={p} value={p}>{p}</option>
                                  ))}
                                </select>
                              </div>
                              <div className="flex items-center space-x-2">
                                <button
                                  onClick={() => {
                                    const newItems = sData.items.filter((_: any, i: number) => i !== idx);
                                    onUpdateSection(sec.id, { ...sData, items: newItems });
                                  }}
                                  className="p-1.5 text-red-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-all"
                                  title="Eliminar red"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => {
                                    const newItems = [...sData.items];
                                    newItems[idx] = { ...item, active: !item.active };
                                    onUpdateSection(sec.id, { ...sData, items: newItems });
                                  }}
                                  className={`w-11 h-6 rounded-full transition-all relative ${item.active ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-600'}`}
                                >
                                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all shadow-sm ${item.active ? 'left-6' : 'left-1'}`} />
                                </button>
                              </div>
                            </div>
                            {item.active && (
                              <div className="relative mt-3 animate-fade-in">
                                <Link className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                                <input
                                  type="url"
                                  value={item.url}
                                  onChange={(e) => {
                                    const newItems = [...sData.items];
                                    newItems[idx] = { ...item, url: e.target.value };
                                    onUpdateSection(sec.id, { ...sData, items: newItems });
                                  }}
                                  placeholder={`URL de tu ${item.platform}...`}
                                  className="w-full pl-9 pr-4 py-2 text-xs bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                />
                              </div>
                            )}
                          </div>
                        ))}

                        <button 
                          onClick={() => {
                            const newItems = [...(sData.items || []), { platform: 'other', url: '', active: true }];
                            onUpdateSection(sec.id, { ...sData, items: newItems });
                          }}
                          className="w-full py-3 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-2xl text-[10px] font-black uppercase tracking-widest text-gray-400 hover:border-primary hover:text-primary hover:bg-primary/5 transition-all flex items-center justify-center space-x-2"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Añadir Red Social</span>
                        </button>
                      </div>
                    </div>

                    <div className="space-y-3 pt-4 border-t border-gray-100 dark:border-gray-800">
                      <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Tamaño de Iconos</label>
                      <div className="flex items-center space-x-4">
                        <input 
                          type="range" 
                          min="16" 
                          max="48" 
                          value={sData.iconSize || 24} 
                          onChange={(e) => onUpdateSection(sec.id, { ...sData, iconSize: parseInt(e.target.value) })}
                          className="flex-1 accent-primary"
                        />
                        <span className="text-xs font-bold text-gray-600 dark:text-gray-400 w-8">{sData.iconSize || 24}px</span>
                      </div>
                    </div>
                  </div>
                )})()}

                {/* Services Specific Controls */}
                {sec.type === 'services' && (() => {
                  const sData = sec.data as ServicesData;
                  return (
                  <div className="space-y-6">
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Contenido de Servicios</label>
                    <div className="space-y-4">
                      {(sData.items || []).map((item: any, idx: number) => (
                        <div key={idx} className="p-4 bg-gray-50 dark:bg-slate-800/50 rounded-2xl border border-gray-100 dark:border-gray-700 space-y-4">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Servicio #{idx + 1}</span>
                            <button 
                              onClick={() => {
                                const newItems = sData.items.filter((_: any, i: number) => i !== idx);
                                onUpdateSection(sec.id, { ...sData, items: newItems });
                              }}
                              className="text-red-400 hover:text-red-500 p-1"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                          <ImageInput 
                            label="Icono/Imagen del Servicio"
                            url={item.image} 
                            onChange={(url) => {
                              const newItems = [...sData.items];
                              newItems[idx] = { ...item, image: url };
                              onUpdateSection(sec.id, { ...sData, items: newItems });
                            }} 
                          />
                        </div>
                      ))}
                      <button 
                        onClick={() => {
                          const newItems = [...(sData.items || []), { title: 'Nuevo Servicio', desc: 'Descripción' }];
                          onUpdateSection(sec.id, { ...sData, items: newItems });
                        }}
                        className="w-full py-3 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl text-xs font-bold text-gray-400 hover:border-primary hover:text-primary transition-all flex items-center justify-center space-x-2"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Añadir Nuevo Item</span>
                      </button>
                    </div>
                  </div>
                )})()}
                <div className="bg-gray-50 dark:bg-slate-800 p-3 rounded-lg space-y-4">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500">Estilos generales del bloque</h4>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Alineación</span>
                    <div className="flex bg-white dark:bg-slate-900 rounded-md border border-gray-200 dark:border-gray-700 overflow-hidden">
                      <button onClick={() => onUpdateSectionStyle(sec.id, { alignment: 'text-left' })} className={`p-1.5 ${style.alignment === 'text-left' ? 'bg-primary text-white' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-slate-800'}`}><AlignLeft className="w-4 h-4"/></button>
                      <button onClick={() => onUpdateSectionStyle(sec.id, { alignment: 'text-center' })} className={`p-1.5 ${style.alignment === 'text-center' ? 'bg-primary text-white' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-slate-800'}`}><AlignCenter className="w-4 h-4"/></button>
                      <button onClick={() => onUpdateSectionStyle(sec.id, { alignment: 'text-right' })} className={`p-1.5 ${style.alignment === 'text-right' ? 'bg-primary text-white' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-slate-800'}`}><AlignRight className="w-4 h-4"/></button>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Espaciado (Padding)</span>
                    <select 
                      value={style.padding} 
                      onChange={(e) => onUpdateSectionStyle(sec.id, { padding: e.target.value })}
                      className="text-sm border border-gray-200 dark:border-gray-700 rounded-md p-1 bg-white dark:bg-slate-900"
                    >
                      <option value="py-8">Pequeño</option>
                      <option value="py-16">Medio</option>
                      <option value="py-24">Grande</option>
                      <option value="py-32">Extra Grande</option>
                    </select>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Fondo</span>
                    <select 
                      value={style.backgroundColor || 'bg-transparent'} 
                      onChange={(e) => onUpdateSectionStyle(sec.id, { backgroundColor: e.target.value })}
                      className="text-sm border border-gray-200 dark:border-gray-700 rounded-md p-1 bg-white dark:bg-slate-900"
                    >
                      <option value="bg-transparent">Transparente</option>
                      <option value="bg-white">Blanco puro</option>
                      <option value="bg-gray-50">Gris Claro</option>
                      <option value="bg-gray-100">Gris Medio</option>
                      <option value="bg-gray-900">Oscuro</option>
                    </select>
                  </div>
                </div>

                {/* Content Settings */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">Contenido del bloque</h4>
                  
                  {sec.type === 'hero' && (() => {
                    const hData = sec.data as HeroData;
                    return (
                    <div className="space-y-6">
                      <div className="space-y-3">
                        <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Diseño Hero</label>
                        <div className="grid grid-cols-2 gap-2">
                          {[
                            { id: 'centered', label: 'Centrado' },
                            { id: 'split', label: 'Dividido' }
                          ].map((l) => (
                            <button
                              key={l.id}
                              onClick={() => onUpdateSection(sec.id, { ...hData, layout: l.id })}
                              className={`py-2 px-1 text-[10px] font-bold rounded-xl border transition-all uppercase ${hData.layout === l.id || (!hData.layout && l.id === 'centered') ? 'bg-primary text-white border-primary' : 'bg-white dark:bg-slate-800 border-gray-100 dark:border-gray-800 text-gray-500'}`}
                            >
                              {l.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                        <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Textos Principales</label>
                        <div>
                          <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Título</label>
                          <input type="text" value={hData.title || ''} onChange={e => onUpdateSection(sec.id, { title: e.target.value })} className="w-full p-2.5 text-xs font-medium border border-gray-100 dark:border-gray-800 rounded-xl dark:bg-slate-900 outline-none focus:ring-2 focus:ring-primary/20" />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Subtítulo</label>
                          <textarea value={hData.description || ''} onChange={e => onUpdateSection(sec.id, { description: e.target.value })} className="w-full p-2.5 text-xs font-medium border border-gray-100 dark:border-gray-800 rounded-xl dark:bg-slate-900 outline-none focus:ring-2 focus:ring-primary/20 resize-none" rows={3} />
                        </div>
                        <ImageInput 
                          url={hData.imageUrl || ''} 
                          onChange={url => onUpdateSection(sec.id, { imageUrl: url })}
                          label="Imagen Destacada" 
                        />
                      </div>

                      <div className="space-y-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                        <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Botón Principal</label>
                        <div>
                          <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Texto</label>
                          <input type="text" value={hData.buttonText || ''} onChange={e => onUpdateSection(sec.id, { buttonText: e.target.value })} className="w-full p-2.5 text-xs font-medium border border-gray-100 dark:border-gray-800 rounded-xl dark:bg-slate-900 outline-none focus:ring-2 focus:ring-primary/20" />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Acción</label>
                          <select 
                            value={hData.buttonAction || ''} 
                            onChange={e => onUpdateSection(sec.id, { buttonAction: e.target.value })}
                            className="w-full p-2.5 text-xs font-medium border border-gray-100 dark:border-gray-800 rounded-xl dark:bg-slate-900 outline-none focus:ring-2 focus:ring-primary/20 mb-2"
                          >
                            <option value="">Ninguna</option>
                            <option value="scroll">Ir a sección</option>
                            <option value="url">Abrir Enlace</option>
                            <option value="whatsapp">WhatsApp</option>
                            <option value="email">Email</option>
                          </select>
                          {hData.buttonAction && (
                            <input type="text" value={hData.buttonTarget || ''} placeholder="ID de sección o URL..." onChange={e => onUpdateSection(sec.id, { buttonTarget: e.target.value })} className="w-full p-2.5 text-xs font-medium border border-gray-100 dark:border-gray-800 rounded-xl dark:bg-slate-900 outline-none focus:ring-2 focus:ring-primary/20" />
                          )}
                        </div>
                      </div>

                      <div className="space-y-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                        <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Botón Secundario (Opcional)</label>
                        <div>
                          <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Texto</label>
                          <input type="text" value={hData.secondaryButtonText || ''} onChange={e => onUpdateSection(sec.id, { secondaryButtonText: e.target.value })} className="w-full p-2.5 text-xs font-medium border border-gray-100 dark:border-gray-800 rounded-xl dark:bg-slate-900 outline-none focus:ring-2 focus:ring-primary/20" />
                        </div>
                        {hData.secondaryButtonText && (
                          <div>
                            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Acción</label>
                            <select 
                              value={hData.secondaryButtonAction || ''} 
                              onChange={e => onUpdateSection(sec.id, { secondaryButtonAction: e.target.value })}
                              className="w-full p-2.5 text-xs font-medium border border-gray-100 dark:border-gray-800 rounded-xl dark:bg-slate-900 outline-none focus:ring-2 focus:ring-primary/20 mb-2"
                            >
                              <option value="">Ninguna</option>
                              <option value="scroll">Ir a sección</option>
                              <option value="url">Abrir Enlace</option>
                            </select>
                            <input type="text" value={hData.secondaryButtonTarget || ''} placeholder="ID de sección o URL..." onChange={e => onUpdateSection(sec.id, { secondaryButtonTarget: e.target.value })} className="w-full p-2.5 text-xs font-medium border border-gray-100 dark:border-gray-800 rounded-xl dark:bg-slate-900 outline-none focus:ring-2 focus:ring-primary/20" />
                          </div>
                        )}
                      </div>
                    </div>
                  )})()}

                  {sec.type === 'about' && (() => {
                    const aData = sec.data as AboutData;
                    return (
                    <div className="space-y-6">
                      <div className="space-y-3">
                        <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Diseño Sección</label>
                        <div className="grid grid-cols-3 gap-2">
                          {[
                            { id: 'image-right', label: 'Img Derecha' },
                            { id: 'image-left', label: 'Img Izquierda' },
                            { id: 'text-only', label: 'Solo Texto' }
                          ].map((l) => (
                            <button
                              key={l.id}
                              onClick={() => onUpdateSection(sec.id, { ...aData, layout: l.id })}
                              className={`py-2 px-1 text-[9px] font-bold rounded-xl border transition-all uppercase ${aData.layout === l.id || (!aData.layout && l.id === 'image-right') ? 'bg-primary text-white border-primary' : 'bg-white dark:bg-slate-800 border-gray-100 dark:border-gray-800 text-gray-500'}`}
                            >
                              {l.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                        <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Contenido</label>
                        <div>
                          <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Título</label>
                          <input type="text" value={aData.title || ''} onChange={e => onUpdateSection(sec.id, { title: e.target.value })} className="w-full p-2.5 text-xs font-medium border border-gray-100 dark:border-gray-800 rounded-xl dark:bg-slate-900 outline-none focus:ring-2 focus:ring-primary/20" />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Descripción</label>
                          <textarea value={aData.description || ''} onChange={e => onUpdateSection(sec.id, { description: e.target.value })} className="w-full p-2.5 text-xs font-medium border border-gray-100 dark:border-gray-800 rounded-xl dark:bg-slate-900 outline-none focus:ring-2 focus:ring-primary/20 resize-none" rows={4} />
                        </div>
                        {aData.layout !== 'text-only' && (
                          <ImageInput 
                            url={aData.imageUrl || ''} 
                            onChange={url => onUpdateSection(sec.id, { imageUrl: url })}
                            label="Imagen de Sección" 
                          />
                        )}
                      </div>

                      <div className="space-y-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                        <div className="flex items-center justify-between">
                          <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Puntos Clave</label>
                          <button 
                            onClick={() => {
                              const newPoints = [...(aData.points || ['Calidad Garantizada', 'Soporte 24/7', 'Innovación Constante']), 'Nuevo Punto'];
                              onUpdateSection(sec.id, { ...aData, points: newPoints });
                            }}
                            className="text-[10px] font-bold text-primary hover:underline"
                          >
                            + Añadir
                          </button>
                        </div>
                        <div className="space-y-2">
                          {(aData.points || ['Calidad Garantizada', 'Soporte 24/7', 'Innovación Constante']).map((point: string, i: number) => (
                            <div key={i} className="flex items-center space-x-2 group">
                              <input 
                                type="text" 
                                value={point} 
                                onChange={e => {
                                  const newPoints = [...(aData.points || ['Calidad Garantizada', 'Soporte 24/7', 'Innovación Constante'])];
                                  newPoints[i] = e.target.value;
                                  onUpdateSection(sec.id, { ...aData, points: newPoints });
                                }}
                                className="flex-1 p-2 text-xs font-medium border border-gray-100 dark:border-gray-800 rounded-lg dark:bg-slate-900 outline-none focus:ring-2 focus:ring-primary/20"
                              />
                              <button 
                                onClick={() => {
                                  const newPoints = (aData.points || ['Calidad Garantizada', 'Soporte 24/7', 'Innovación Constante']).filter((_: any, idx: number) => idx !== i);
                                  onUpdateSection(sec.id, { ...aData, points: newPoints });
                                }}
                                className="text-red-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )})()}

                  {sec.type === 'services' && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Título de la sección</label>
                        <input type="text" value={data.title || ''} onChange={e => onUpdateSection(sec.id, { title: e.target.value })} className="w-full p-2 text-sm border rounded-lg dark:bg-slate-800 dark:border-gray-700" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2">Lista de Servicios</label>
                        <div className="space-y-3">
                          {data.items?.map((item: any, i: number) => (
                            <div key={i} className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg space-y-2 relative group bg-gray-50 dark:bg-slate-800/50">
                              <button onClick={() => { const newItems = [...data.items]; newItems.splice(i, 1); onUpdateSection(sec.id, { items: newItems }); }} className="absolute top-2 right-2 text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 className="w-4 h-4"/></button>
                              <input type="text" value={item.title} placeholder="Título del servicio" onChange={e => { const newItems = [...data.items]; newItems[i].title = e.target.value; onUpdateSection(sec.id, { items: newItems }); }} className="w-full p-1.5 text-sm font-medium border-b bg-transparent focus:outline-none focus:border-primary dark:border-gray-600" />
                              <textarea value={item.desc} placeholder="Descripción" onChange={e => { const newItems = [...data.items]; newItems[i].desc = e.target.value; onUpdateSection(sec.id, { items: newItems }); }} className="w-full p-1.5 text-xs text-gray-600 dark:text-gray-400 bg-transparent resize-none focus:outline-none focus:border-primary border-b border-transparent" rows={2} />
                            </div>
                          ))}
                        </div>
                        <button onClick={() => onUpdateSection(sec.id, { items: [...(data.items||[]), { title: 'Nuevo Servicio', desc: 'Descripción' }] })} className="mt-3 w-full py-2 border border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-primary hover:border-primary transition-colors flex items-center justify-center"><Plus className="w-4 h-4 mr-1"/> Añadir servicio</button>
                      </div>
                    </div>
                  )}

                  {sec.type === 'testimonials' && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Título de la sección</label>
                        <input type="text" value={data.title || ''} onChange={e => onUpdateSection(sec.id, { title: e.target.value })} className="w-full p-2 text-sm border rounded-lg dark:bg-slate-800 dark:border-gray-700" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2">Testimonios</label>
                        <div className="space-y-3">
                          {data.items?.map((item: any, i: number) => (
                            <div key={i} className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg space-y-2 relative group bg-gray-50 dark:bg-slate-800/50">
                              <button onClick={() => { const newItems = [...data.items]; newItems.splice(i, 1); onUpdateSection(sec.id, { items: newItems }); }} className="absolute top-2 right-2 text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 className="w-4 h-4"/></button>
                              <input type="text" value={item.name} placeholder="Nombre del cliente" onChange={e => { const newItems = [...data.items]; newItems[i].name = e.target.value; onUpdateSection(sec.id, { items: newItems }); }} className="w-full p-1.5 text-sm font-bold border-b bg-transparent focus:outline-none focus:border-primary dark:border-gray-600" />
                              <input type="text" value={item.role || ''} placeholder="Cargo / Empresa (Opcional)" onChange={e => { const newItems = [...data.items]; newItems[i].role = e.target.value; onUpdateSection(sec.id, { items: newItems }); }} className="w-full p-1.5 text-xs text-gray-500 border-b bg-transparent focus:outline-none focus:border-primary dark:border-gray-600" />
                              <textarea value={item.text} placeholder="Comentario" onChange={e => { const newItems = [...data.items]; newItems[i].text = e.target.value; onUpdateSection(sec.id, { items: newItems }); }} className="w-full p-1.5 text-xs italic text-gray-600 dark:text-gray-400 bg-transparent resize-none focus:outline-none focus:border-primary border-b border-transparent" rows={3} />
                            </div>
                          ))}
                        </div>
                        <button onClick={() => onUpdateSection(sec.id, { items: [...(data.items||[]), { name: 'Nombre', text: 'Comentario genial' }] })} className="mt-3 w-full py-2 border border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-primary hover:border-primary transition-colors flex items-center justify-center"><Plus className="w-4 h-4 mr-1"/> Añadir testimonio</button>
                      </div>
                    </div>
                  )}

                  {sec.type === 'cta' && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Título</label>
                        <input type="text" value={data.title || ''} onChange={e => onUpdateSection(sec.id, { title: e.target.value })} className="w-full p-2 text-sm border rounded-lg dark:bg-slate-800 dark:border-gray-700" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Descripción</label>
                        <textarea value={data.description || ''} onChange={e => onUpdateSection(sec.id, { description: e.target.value })} className="w-full p-2 text-sm border rounded-lg dark:bg-slate-800 dark:border-gray-700 resize-none" rows={2} />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Texto del botón</label>
                        <input type="text" value={data.buttonText || ''} onChange={e => onUpdateSection(sec.id, { buttonText: e.target.value })} className="w-full p-2 text-sm border rounded-lg dark:bg-slate-800 dark:border-gray-700" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Acción del botón</label>
                        <select 
                          value={data.buttonAction || ''} 
                          onChange={e => onUpdateSection(sec.id, { buttonAction: e.target.value })}
                          className="w-full p-2 text-sm border rounded-lg dark:bg-slate-800 dark:border-gray-700 mb-2"
                        >
                          <option value="">Sin acción</option>
                          <option value="scroll">Scroll a sección</option>
                          <option value="url">Abrir enlace (URL)</option>
                          <option value="whatsapp">Abrir WhatsApp</option>
                          <option value="email">Enviar Email</option>
                        </select>
                        {data.buttonAction && (
                          <input 
                            type="text" 
                            placeholder={
                              data.buttonAction === 'scroll' ? 'ID de sección (ej: contact)' :
                              data.buttonAction === 'whatsapp' ? 'Número con código de país (ej: +34123456789)' :
                              data.buttonAction === 'email' ? 'correo@ejemplo.com' :
                              'https://...'
                            }
                            value={data.buttonTarget || ''} 
                            onChange={e => onUpdateSection(sec.id, { buttonTarget: e.target.value })} 
                            className="w-full p-2 text-sm border rounded-lg dark:bg-slate-800 dark:border-gray-700" 
                          />
                        )}
                      </div>
                    </div>
                  )}

                  {sec.type === 'faq' && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Título de la sección</label>
                        <input type="text" value={data.title || ''} onChange={e => onUpdateSection(sec.id, { title: e.target.value })} className="w-full p-2 text-sm border rounded-lg dark:bg-slate-800 dark:border-gray-700" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2">Preguntas y Respuestas</label>
                        <div className="space-y-3">
                          {data.items?.map((item: any, i: number) => (
                            <div key={i} className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg space-y-2 relative group bg-gray-50 dark:bg-slate-800/50">
                              <button onClick={() => { const newItems = [...data.items]; newItems.splice(i, 1); onUpdateSection(sec.id, { items: newItems }); }} className="absolute top-2 right-2 text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 className="w-4 h-4"/></button>
                              <input type="text" value={item.q} placeholder="Pregunta" onChange={e => { const newItems = [...data.items]; newItems[i].q = e.target.value; onUpdateSection(sec.id, { items: newItems }); }} className="w-full p-1.5 text-sm font-medium border-b bg-transparent focus:outline-none focus:border-primary dark:border-gray-600" />
                              <textarea value={item.a} placeholder="Respuesta" onChange={e => { const newItems = [...data.items]; newItems[i].a = e.target.value; onUpdateSection(sec.id, { items: newItems }); }} className="w-full p-1.5 text-xs text-gray-600 dark:text-gray-400 bg-transparent resize-none focus:outline-none focus:border-primary border-b border-transparent" rows={3} />
                            </div>
                          ))}
                        </div>
                        <button onClick={() => onUpdateSection(sec.id, { items: [...(data.items||[]), { q: 'Nueva Pregunta', a: 'Respuesta' }] })} className="mt-3 w-full py-2 border border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-primary hover:border-primary transition-colors flex items-center justify-center"><Plus className="w-4 h-4 mr-1"/> Añadir FAQ</button>
                      </div>
                    </div>
                  )}

                  {sec.type === 'footer' && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Texto Principal</label>
                        <input type="text" value={data.text || ''} onChange={e => onUpdateSection(sec.id, { text: e.target.value })} className="w-full p-2 text-sm border rounded-lg dark:bg-slate-800 dark:border-gray-700" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2">Enlaces</label>
                        <div className="space-y-3">
                          {data.links?.map((link: any, i: number) => (
                            <div key={i} className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg space-y-2 relative group bg-gray-50 dark:bg-slate-800/50">
                              <button onClick={() => { const newLinks = [...data.links]; newLinks.splice(i, 1); onUpdateSection(sec.id, { links: newLinks }); }} className="absolute top-2 right-2 text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 className="w-4 h-4"/></button>
                              <input type="text" value={link.label} placeholder="Texto del enlace" onChange={e => { const newLinks = [...data.links]; newLinks[i].label = e.target.value; onUpdateSection(sec.id, { links: newLinks }); }} className="w-full p-1.5 text-sm font-medium border-b bg-transparent focus:outline-none focus:border-primary dark:border-gray-600" />
                              <input type="text" value={link.url} placeholder="URL (# para interno)" onChange={e => { const newLinks = [...data.links]; newLinks[i].url = e.target.value; onUpdateSection(sec.id, { links: newLinks }); }} className="w-full p-1.5 text-xs text-gray-600 dark:text-gray-400 border-b bg-transparent focus:outline-none focus:border-primary dark:border-gray-600" />
                            </div>
                          ))}
                        </div>
                        <button onClick={() => onUpdateSection(sec.id, { links: [...(data.links||[]), { label: 'Nuevo Enlace', url: '#' }] })} className="mt-3 w-full py-2 border border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-primary hover:border-primary transition-colors flex items-center justify-center"><Plus className="w-4 h-4 mr-1"/> Añadir Enlace</button>
                      </div>
                    </div>
                  )}

                  {sec.type === 'contact' && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Título de la sección</label>
                        <input type="text" value={data.title || ''} onChange={e => onUpdateSection(sec.id, { title: e.target.value })} className="w-full p-2 text-sm border rounded-lg dark:bg-slate-800 dark:border-gray-700" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Email de contacto</label>
                        <input type="email" value={data.email || ''} onChange={e => onUpdateSection(sec.id, { email: e.target.value })} className="w-full p-2 text-sm border rounded-lg dark:bg-slate-800 dark:border-gray-700" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Teléfono (Opcional)</label>
                        <input type="tel" value={data.phone || ''} onChange={e => onUpdateSection(sec.id, { phone: e.target.value })} className="w-full p-2 text-sm border rounded-lg dark:bg-slate-800 dark:border-gray-700" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Dirección (Opcional)</label>
                        <input type="text" value={data.address || ''} onChange={e => onUpdateSection(sec.id, { address: e.target.value })} className="w-full p-2 text-sm border rounded-lg dark:bg-slate-800 dark:border-gray-700" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Horario (Opcional)</label>
                        <input type="text" value={data.hours || ''} placeholder="Ej: Lun-Vie 9:00 - 18:00" onChange={e => onUpdateSection(sec.id, { hours: e.target.value })} className="w-full p-2 text-sm border rounded-lg dark:bg-slate-800 dark:border-gray-700" />
                      </div>
                    </div>
                  )}
                  
                  {sec.type === 'gallery' && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Título de la sección</label>
                        <input type="text" value={data.title || ''} onChange={e => onUpdateSection(sec.id, { title: e.target.value })} className="w-full p-2 text-sm border rounded-lg dark:bg-slate-800 dark:border-gray-700" />
                      </div>
                      <div className="space-y-4">
                        <label className="block text-xs font-bold text-gray-700 dark:text-gray-300">Imágenes</label>
                        {data.images?.map((url: string, i: number) => (
                          <div key={i} className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg space-y-2 relative group bg-gray-50 dark:bg-slate-800/50">
                            <button onClick={() => { const newImgs = [...data.images]; newImgs.splice(i, 1); onUpdateSection(sec.id, { images: newImgs }); }} className="absolute top-2 right-2 text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity z-10"><Trash2 className="w-4 h-4"/></button>
                            <ImageInput 
                              url={url} 
                              onChange={newUrl => { const newImgs = [...data.images]; newImgs[i] = newUrl; onUpdateSection(sec.id, { images: newImgs }); }}
                              label={`Imagen ${i + 1}`} 
                            />
                          </div>
                        ))}
                        <button onClick={() => onUpdateSection(sec.id, { images: [...(data.images||[]), ''] })} className="mt-2 w-full py-2 border border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-primary hover:border-primary transition-colors flex items-center justify-center"><Plus className="w-4 h-4 mr-1"/> Añadir imagen</button>
                      </div>
                    </div>
                  )}

                  {sec.type === 'products' && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Título de la sección</label>
                        <input type="text" value={data.title || ''} onChange={e => onUpdateSection(sec.id, { title: e.target.value })} className="w-full p-2 text-sm border rounded-lg dark:bg-slate-800 dark:border-gray-700" />
                      </div>
                      <div className="space-y-4">
                        <label className="block text-xs font-bold text-gray-700 dark:text-gray-300">Lista de Productos</label>
                        {data.items?.map((item: any, i: number) => (
                          <div key={i} className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg space-y-2 relative group bg-gray-50 dark:bg-slate-800/50">
                            <button onClick={() => { const newItems = [...data.items]; newItems.splice(i, 1); onUpdateSection(sec.id, { items: newItems }); }} className="absolute top-2 right-2 text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity z-10"><Trash2 className="w-4 h-4"/></button>
                            <input type="text" value={item.name} placeholder="Nombre del producto" onChange={e => { const newItems = [...data.items]; newItems[i].name = e.target.value; onUpdateSection(sec.id, { items: newItems }); }} className="w-full p-1.5 text-sm font-bold border-b bg-transparent focus:outline-none focus:border-primary dark:border-gray-600" />
                            <input type="text" value={item.price} placeholder="Precio" onChange={e => { const newItems = [...data.items]; newItems[i].price = e.target.value; onUpdateSection(sec.id, { items: newItems }); }} className="w-full p-1.5 text-xs text-primary font-bold border-b bg-transparent focus:outline-none focus:border-primary dark:border-gray-600" />
                            <ImageInput 
                              url={item.image || ''} 
                              onChange={url => { const newItems = [...data.items]; newItems[i].image = url; onUpdateSection(sec.id, { items: newItems }); }}
                              label="Imagen del producto" 
                            />
                          </div>
                        ))}
                        <button onClick={() => onUpdateSection(sec.id, { items: [...(data.items||[]), { name: 'Nuevo Producto', price: '$0.00', image: '' }] })} className="mt-2 w-full py-2 border border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-primary hover:border-primary transition-colors flex items-center justify-center"><Plus className="w-4 h-4 mr-1"/> Añadir producto</button>
                      </div>
                    </div>
                  )}

                  {sec.type === 'articles' && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Título de la sección</label>
                        <input type="text" value={data.title || ''} onChange={e => onUpdateSection(sec.id, { title: e.target.value })} className="w-full p-2 text-sm border rounded-lg dark:bg-slate-800 dark:border-gray-700" />
                      </div>
                      <div className="space-y-4">
                        <label className="block text-xs font-bold text-gray-700 dark:text-gray-300">Artículos del Blog</label>
                        {data.items?.map((item: any, i: number) => (
                          <div key={i} className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg space-y-2 relative group bg-gray-50 dark:bg-slate-800/50">
                            <button onClick={() => { const newItems = [...data.items]; newItems.splice(i, 1); onUpdateSection(sec.id, { items: newItems }); }} className="absolute top-2 right-2 text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity z-10"><Trash2 className="w-4 h-4"/></button>
                            <input type="text" value={item.title} placeholder="Título del artículo" onChange={e => { const newItems = [...data.items]; newItems[i].title = e.target.value; onUpdateSection(sec.id, { items: newItems }); }} className="w-full p-1.5 text-sm font-bold border-b bg-transparent focus:outline-none focus:border-primary dark:border-gray-600" />
                            <textarea value={item.excerpt} placeholder="Resumen del artículo" onChange={e => { const newItems = [...data.items]; newItems[i].excerpt = e.target.value; onUpdateSection(sec.id, { items: newItems }); }} className="w-full p-1.5 text-xs text-gray-600 dark:text-gray-400 bg-transparent resize-none focus:outline-none focus:border-primary border-b border-transparent" rows={2} />
                            <ImageInput 
                              url={item.image || ''} 
                              onChange={url => { const newItems = [...data.items]; newItems[i].image = url; onUpdateSection(sec.id, { items: newItems }); }}
                              label="Imagen del artículo" 
                            />
                          </div>
                        ))}
                        <button onClick={() => onUpdateSection(sec.id, { items: [...(data.items||[]), { title: 'Nuevo Artículo', excerpt: 'Resumen...', image: '' }] })} className="mt-2 w-full py-2 border border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-primary hover:border-primary transition-colors flex items-center justify-center"><Plus className="w-4 h-4 mr-1"/> Añadir artículo</button>
                      </div>
                    </div>
                  )}

                  {sec.type === 'projects' && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Título de la sección</label>
                        <input type="text" value={data.title || ''} onChange={e => onUpdateSection(sec.id, { title: e.target.value })} className="w-full p-2 text-sm border rounded-lg dark:bg-slate-800 dark:border-gray-700" />
                      </div>
                      <div className="space-y-4">
                        <label className="block text-xs font-bold text-gray-700 dark:text-gray-300">Proyectos</label>
                        {data.items?.map((item: any, i: number) => (
                          <div key={i} className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg space-y-2 relative group bg-gray-50 dark:bg-slate-800/50">
                            <button onClick={() => { const newItems = [...data.items]; newItems.splice(i, 1); onUpdateSection(sec.id, { items: newItems }); }} className="absolute top-2 right-2 text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity z-10"><Trash2 className="w-4 h-4"/></button>
                            <input type="text" value={item.title} placeholder="Título del proyecto" onChange={e => { const newItems = [...data.items]; newItems[i].title = e.target.value; onUpdateSection(sec.id, { items: newItems }); }} className="w-full p-1.5 text-sm font-bold border-b bg-transparent focus:outline-none focus:border-primary dark:border-gray-600" />
                            <input type="text" value={item.category} placeholder="Categoría (ej: Web Design)" onChange={e => { const newItems = [...data.items]; newItems[i].category = e.target.value; onUpdateSection(sec.id, { items: newItems }); }} className="w-full p-1.5 text-xs text-primary font-bold border-b bg-transparent focus:outline-none focus:border-primary dark:border-gray-700" />
                            <ImageInput 
                              url={item.image || ''} 
                              onChange={url => { const newItems = [...data.items]; newItems[i].image = url; onUpdateSection(sec.id, { items: newItems }); }}
                              label="Imagen del proyecto" 
                            />
                          </div>
                        ))}
                        <button onClick={() => onUpdateSection(sec.id, { items: [...(data.items||[]), { title: 'Nuevo Proyecto', category: 'Categoría', image: '' }] })} className="mt-2 w-full py-2 border border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-primary hover:border-primary transition-colors flex items-center justify-center"><Plus className="w-4 h-4 mr-1"/> Añadir proyecto</button>
                      </div>
                    </div>
                  )}

                  {sec.type === 'menu' && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Título de la sección</label>
                        <input type="text" value={data.title || ''} onChange={e => onUpdateSection(sec.id, { title: e.target.value })} className="w-full p-2 text-sm border rounded-lg dark:bg-slate-800 dark:border-gray-700" />
                      </div>
                      <div className="space-y-6">
                        <label className="block text-xs font-bold text-gray-700 dark:text-gray-300">Categorías del Menú</label>
                        {data.categories?.map((cat: any, cIdx: number) => (
                          <div key={cIdx} className="p-4 border-2 border-gray-100 dark:border-gray-800 rounded-2xl space-y-4 relative group bg-white dark:bg-slate-900 shadow-sm">
                            <button onClick={() => { const newCats = [...data.categories]; newCats.splice(cIdx, 1); onUpdateSection(sec.id, { categories: newCats }); }} className="absolute top-3 right-3 text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity z-10"><Trash2 className="w-4 h-4"/></button>
                            <input type="text" value={cat.name} placeholder="Nombre de la categoría (ej: Entrantes)" onChange={e => { const newCats = [...data.categories]; newCats[cIdx].name = e.target.value; onUpdateSection(sec.id, { categories: newCats }); }} className="w-full p-1.5 text-sm font-black border-b bg-transparent focus:outline-none focus:border-primary dark:border-gray-600 uppercase tracking-widest text-primary" />
                            
                            <div className="space-y-3 pl-4 border-l-2 border-gray-50 dark:border-gray-800">
                              {cat.items?.map((item: any, iIdx: number) => (
                                <div key={iIdx} className="p-3 bg-gray-50 dark:bg-slate-800/50 rounded-xl space-y-2 relative group/item">
                                  <button onClick={() => { const newCats = [...data.categories]; newCats[cIdx].items.splice(iIdx, 1); onUpdateSection(sec.id, { categories: newCats }); }} className="absolute top-2 right-2 text-red-300 hover:text-red-500 opacity-0 group-hover/item:opacity-100 transition-opacity"><Trash2 className="w-3.5 h-3.5"/></button>
                                  <div className="flex gap-2">
                                    <input type="text" value={item.name} placeholder="Nombre del plato" onChange={e => { const newCats = [...data.categories]; newCats[cIdx].items[iIdx].name = e.target.value; onUpdateSection(sec.id, { categories: newCats }); }} className="flex-1 p-1 text-xs font-bold border-b bg-transparent focus:outline-none focus:border-primary dark:border-gray-700" />
                                    <input type="text" value={item.price} placeholder="Precio" onChange={e => { const newCats = [...data.categories]; newCats[cIdx].items[iIdx].price = e.target.value; onUpdateSection(sec.id, { categories: newCats }); }} className="w-16 p-1 text-xs font-bold text-primary text-right border-b bg-transparent focus:outline-none focus:border-primary dark:border-gray-700" />
                                  </div>
                                  <textarea value={item.desc} placeholder="Descripción del plato..." onChange={e => { const newCats = [...data.categories]; newCats[cIdx].items[iIdx].desc = e.target.value; onUpdateSection(sec.id, { categories: newCats }); }} className="w-full p-1 text-[10px] text-gray-500 bg-transparent resize-none focus:outline-none focus:border-primary border-b border-transparent" rows={1} />
                                </div>
                              ))}
                              <button onClick={() => { const newCats = [...data.categories]; newCats[cIdx].items = [...(newCats[cIdx].items || []), { name: 'Nuevo Plato', desc: 'Descripción...', price: '$0.00' }]; onUpdateSection(sec.id, { categories: newCats }); }} className="w-full py-1.5 border border-dashed border-gray-200 dark:border-gray-700 rounded-lg text-[10px] font-bold text-gray-400 hover:text-primary hover:border-primary transition-colors flex items-center justify-center uppercase tracking-widest"><Plus className="w-3 h-3 mr-1"/> Añadir plato</button>
                            </div>
                          </div>
                        ))}
                        <button onClick={() => onUpdateSection(sec.id, { categories: [...(data.categories||[]), { name: 'Nueva Categoría', items: [] }] })} className="mt-2 w-full py-3 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-2xl text-xs font-black text-gray-400 hover:text-primary hover:border-primary transition-colors flex items-center justify-center uppercase tracking-widest"><Plus className="w-5 h-5 mr-2"/> Añadir categoría</button>
                      </div>
                    </div>
                  )}

                  <p className="mt-4 text-xs text-gray-500 italic bg-gray-100 dark:bg-slate-800 p-2 rounded">
                    💡 Los cambios se aplican y guardan automáticamente en tiempo real.
                  </p>
                </div>

              </div>
            )}
          </div>
        );
      })}

      {!showAddSection ? (
        <div className="pt-4">
          <button 
            onClick={() => {
              if (sections.length >= maxBlocks) {
                toast.error(`Límite alcanzado: ${maxBlocks} bloques en el plan Básico.`);
                return;
              }
              setShowAddSection(true);
            }} 
            disabled={sections.length >= maxBlocks}
            className={`w-full py-4 border-2 border-dashed rounded-xl font-bold flex items-center justify-center transition-all shadow-sm
              ${sections.length >= maxBlocks 
                ? 'border-gray-300 bg-gray-50 text-gray-400 cursor-not-allowed' 
                : 'border-primary/50 bg-primary/5 text-primary hover:border-primary hover:bg-primary/10 group'
              }`}
          >
            {sections.length >= maxBlocks ? (
              <><LockIcon className="w-5 h-5 mr-2" /> Límite de Bloques Alcanzado</>
            ) : (
              <><Plus className="w-5 h-5 mr-2 group-hover:scale-125 transition-transform" /> Añadir Sección</>
            )}
          </button>
          {sections.length >= maxBlocks && (
             <p className="text-xs text-center text-gray-500 mt-2">
               Mejora tu plan a Pro para añadir bloques ilimitados.
             </p>
          )}
        </div>
      ) : (
        <div className="p-4 border border-primary/30 rounded-xl bg-white dark:bg-slate-800 shadow-lg animate-fade-in">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-sm font-bold text-gray-900 dark:text-white">Elegir bloque</h4>
            <button onClick={() => setShowAddSection(false)} className="text-gray-400 hover:text-gray-600">✕</button>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {sectionTypesList.map(type => {
              const isPremium = premiumBlocks.includes(type.type);
              const isLocked = isPremium && userPlan === 'free';
              return (
                <button 
                  key={type.type} 
                  onClick={() => {
                    if (isLocked) {
                      toast.error('Este bloque es Premium. Mejora tu plan para usarlo.');
                      return;
                    }
                    onAddSection(type.type); 
                    setShowAddSection(false); 
                  }} 
                  className={`relative flex flex-col items-center justify-center p-3 border rounded-xl text-xs text-center transition-all
                    ${isLocked 
                      ? 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-slate-900/50 opacity-60 cursor-not-allowed' 
                      : 'border-gray-100 dark:border-gray-700 hover:border-primary hover:bg-primary/5'
                    }`}
                >
                  {isLocked && <LockIcon className="absolute top-2 right-2 w-3 h-3 text-amber-500" />}
                  <type.icon className={`w-6 h-6 mb-2 ${isLocked ? 'text-gray-400' : 'text-primary'}`} /> 
                  <span className="font-medium text-gray-700 dark:text-gray-300">{type.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
