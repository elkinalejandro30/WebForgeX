import { Plus, Trash2, Sparkles } from 'lucide-react';
import TextElement from './TextElement';

export default function ServicesBlock({ id, data, isEditMode, padding, alignment, bgClass, onUpdate }: any) {
  const items = data.items || [];

  const handleAddItem = () => {
    onUpdate?.({ items: [...items, { title: 'Nuevo Servicio', desc: 'Descripción del servicio' }] });
  };

  const handleRemoveItem = (idx: number) => {
    onUpdate?.({ items: items.filter((_: any, i: number) => i !== idx) });
  };

  const handleUpdateItem = (idx: number, updates: any) => {
    onUpdate?.({ items: items.map((item: any, i: number) => i === idx ? { ...item, ...updates } : item) });
  };

  return (
    <div id={id} className={`${padding} px-4 sm:px-8 ${bgClass} relative group/block transition-all duration-500`}>
      <div className="max-w-7xl mx-auto">
        <div className="mb-16">
          <TextElement 
            tag="h2" 
            field="title" 
            value={data.title} 
            className={`text-4xl md:text-6xl font-black ${alignment} text-pageText uppercase tracking-tighter mb-4`} 
            placeholder="Nuestros Servicios" 
            isEditMode={isEditMode} 
            onUpdate={onUpdate} 
          />
          <div className={`h-1.5 w-24 bg-primary rounded-full ${alignment === 'text-center' ? 'mx-auto' : alignment === 'text-right' ? 'ml-auto' : ''}`}></div>
        </div>
        
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.map((item: any, i: number) => (
            <div 
              key={i} 
              className={`
                group p-8 md:p-10 rounded-[2.5rem] transition-all duration-500 
                bg-white dark:bg-slate-900/40 border border-gray-100 dark:border-white/5
                hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:hover:shadow-[0_20px_50px_rgba(0,0,0,0.3)]
                hover:-translate-y-3 relative overflow-hidden
                ${alignment}
              `}
            >
              {/* Decorative background element */}
              <div className="absolute -right-4 -top-4 w-24 h-24 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors" />
              
              {isEditMode && (
                <button 
                  onClick={(e) => { e.stopPropagation(); handleRemoveItem(i); }}
                  className="absolute top-6 right-6 p-2 bg-red-50 text-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500 hover:text-white z-20"
                  title="Eliminar item"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}

              <div className={`
                w-20 h-20 rounded-3xl mb-10 text-white bg-primary shadow-2xl shadow-primary/20 
                transition-all duration-700 group-hover:scale-110 group-hover:rotate-6
                flex items-center justify-center relative z-10
                ${alignment === 'text-center' ? 'mx-auto' : alignment === 'text-right' ? 'ml-auto' : ''}
              `}>
                {item.image ? (
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover rounded-3xl" loading="lazy" />
                ) : (
                  <Sparkles className="w-10 h-10"/>
                )}
              </div>

              <div className="relative z-10 space-y-4">
                <TextElement 
                  tag="h3" 
                  field="title" 
                  value={item.title} 
                  className="text-2xl md:text-3xl font-black text-pageText tracking-tight leading-tight" 
                  placeholder="Título del servicio" 
                  isEditMode={isEditMode} 
                  onUpdate={(updates) => handleUpdateItem(i, updates)} 
                />
                
                <TextElement 
                  tag="p" 
                  field="desc" 
                  value={item.desc} 
                  className="text-pageText/60 leading-relaxed text-lg font-medium" 
                  placeholder="Describe brevemente lo que ofreces en este servicio." 
                  isEditMode={isEditMode} 
                  onUpdate={(updates) => handleUpdateItem(i, updates)} 
                />
              </div>

              {/* Hover highlight */}
              <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
            </div>
          ))}

          {isEditMode && (
            <button 
              onClick={handleAddItem}
              className="p-10 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-[2.5rem] flex flex-col items-center justify-center space-y-4 text-gray-400 hover:border-primary hover:text-primary hover:bg-primary/5 transition-all group min-h-[350px]"
            >
              <div className="w-16 h-16 rounded-full bg-gray-50 dark:bg-gray-900 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all shadow-sm">
                <Plus className="w-8 h-8" />
              </div>
              <div className="text-center">
                <span className="font-black text-xs uppercase tracking-widest block mb-1">Añadir Servicio</span>
                <span className="text-[10px] opacity-60">Haz clic para expandir tu oferta</span>
              </div>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}