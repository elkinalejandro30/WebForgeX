import TextElement from './TextElement';
import { CheckCircle2 } from 'lucide-react';

export default function AboutBlock({ id, data, isEditMode, padding, bgClass, onUpdate }: any) {
  const typedData = data as { title: string, description: string, imageUrl?: string, points?: string[], layout?: 'text-only' | 'image-left' | 'image-right' };
  const layout = typedData.layout || 'image-right';
  const points = typedData.points || ['Calidad Garantizada', 'Soporte 24/7', 'Innovación Constante'];

  if (layout === 'text-only') {
    return (
      <div id={id} className={`${padding} px-8 ${bgClass} transition-all duration-500`}>
        <div className="max-w-4xl mx-auto text-center space-y-8 animate-fade-in">
          <TextElement 
            tag="h2" 
            field="title" 
            value={typedData.title} 
            className="text-4xl md:text-6xl font-black text-pageText uppercase tracking-tighter" 
            placeholder="Sobre Nosotros" 
            isEditMode={isEditMode} 
            onUpdate={onUpdate} 
          />
          <div className="h-1.5 w-24 bg-primary mx-auto rounded-full"></div>
          <TextElement 
            tag="p" 
            field="description" 
            value={typedData.description} 
            className="text-xl md:text-2xl text-pageText/70 leading-relaxed font-medium" 
            placeholder="Escribe algo sobre ti o tu empresa..." 
            isEditMode={isEditMode} 
            onUpdate={onUpdate} 
          />
        </div>
      </div>
    );
  }

  return (
    <div id={id} className={`${padding} px-4 sm:px-8 ${bgClass} transition-all duration-500 overflow-hidden group/about`}>
      <div className="max-w-7xl mx-auto">
        <div className={`grid lg:grid-cols-2 gap-16 items-center ${layout === 'image-left' ? 'lg:flex-row-reverse' : ''}`}>
          
          <div className={`space-y-10 animate-slide-up ${layout === 'image-left' ? 'lg:order-2' : ''}`}>
            <div className="space-y-4">
              <TextElement 
                tag="h2" 
                field="title" 
                value={typedData.title} 
                className="text-4xl md:text-5xl font-black text-pageText uppercase tracking-tighter leading-tight" 
                placeholder="Nuestra Historia" 
                isEditMode={isEditMode} 
                onUpdate={onUpdate} 
              />
              <div className="h-1.5 w-20 bg-primary rounded-full"></div>
            </div>

            <TextElement 
              tag="p" 
              field="description" 
              value={typedData.description} 
              className="text-lg md:text-xl text-pageText/70 leading-relaxed font-medium" 
              placeholder="Comparte tu visión y valores con tus clientes." 
              isEditMode={isEditMode} 
              onUpdate={onUpdate} 
            />

            <div className="grid sm:grid-cols-2 gap-4">
              {points.map((point, idx) => (
                <div key={idx} className="flex items-center space-x-3 p-4 rounded-2xl bg-white dark:bg-slate-900/50 border border-gray-100 dark:border-white/5 shadow-sm hover:shadow-md transition-all">
                  <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 size={16} />
                  </div>
                  <span className="text-sm font-bold text-pageText/80">{point}</span>
                </div>
              ))}
            </div>
          </div>

          <div className={`relative ${layout === 'image-left' ? 'lg:order-1' : ''}`}>
            <div className="relative aspect-[4/5] rounded-[3rem] overflow-hidden shadow-2xl transition-transform duration-700 group-hover/about:scale-[1.02]">
              <img 
                src={typedData.imageUrl || 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200&q=80'} 
                alt="About Us" 
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent pointer-events-none" />
            </div>
            {/* Decorative shapes */}
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-primary/10 rounded-full blur-3xl -z-10" />
            <div className="absolute -top-6 -left-6 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl -z-10" />
          </div>

        </div>
      </div>
    </div>
  );
}