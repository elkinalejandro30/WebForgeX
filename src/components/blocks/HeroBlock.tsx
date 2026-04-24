import { HeroData } from '../../store/useStore';
import TextElement from './TextElement';
import { Sparkles } from 'lucide-react';

export default function HeroBlock({ id, data, isEditMode, padding, alignment, onUpdate, handleButtonClick }: any) {
  const typedData = data as HeroData & { layout?: 'centered' | 'split', secondaryButtonText?: string, secondaryButtonAction?: string, secondaryButtonTarget?: string };
  const layout = typedData.layout || 'centered';

  if (layout === 'split') {
    return (
      <div id={id} className={`${padding} relative overflow-hidden bg-pageBg group/hero min-h-[600px] flex items-center`}>
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
          <div className={`space-y-8 animate-slide-up ${alignment}`}>
            <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest ${alignment === 'text-center' ? 'mx-auto' : alignment === 'text-right' ? 'ml-auto' : ''}`}>
              <Sparkles size={12} />
              <span>Bienvenido</span>
            </div>
            
            <TextElement 
              tag="h1" 
              field="title" 
              value={typedData.title} 
              className="text-5xl sm:text-7xl font-black leading-[1.05] text-pageText tracking-tighter" 
              placeholder="Título Impactante" 
              isEditMode={isEditMode} 
              onUpdate={onUpdate} 
            />

            <TextElement 
              tag="p" 
              field="description" 
              value={typedData.description} 
              className="text-xl text-pageText/70 leading-relaxed max-w-xl font-medium" 
              placeholder="Tu propuesta de valor clara y directa." 
              isEditMode={isEditMode} 
              onUpdate={onUpdate} 
            />

            <div className={`flex flex-wrap gap-4 ${alignment === 'text-center' ? 'justify-center' : alignment === 'text-right' ? 'justify-end' : ''}`}>
              <button 
                onClick={() => handleButtonClick(typedData.buttonAction, typedData.buttonTarget)}
                className="px-8 py-4 rounded-2xl font-black text-white bg-primary hover:bg-primary/90 transition-all shadow-xl shadow-primary/20 hover:-translate-y-1 active:scale-95"
              >
                {typedData.buttonText || 'Comenzar'}
              </button>
              {typedData.secondaryButtonText && (
                <button 
                  onClick={() => handleButtonClick(typedData.secondaryButtonAction, typedData.secondaryButtonTarget)}
                  className="px-8 py-4 rounded-2xl font-black text-pageText bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-slate-700 transition-all hover:-translate-y-1 active:scale-95"
                >
                  {typedData.secondaryButtonText}
                </button>
              )}
            </div>
          </div>

          <div className="relative aspect-square sm:aspect-video lg:aspect-square rounded-[3rem] overflow-hidden shadow-2xl group-hover/hero:scale-[1.02] transition-transform duration-700">
            <img 
              src={typedData.imageUrl || 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=1600'} 
              alt="Hero" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent pointer-events-none" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div id={id} className={`relative flex flex-col items-center justify-center ${padding} ${alignment} min-h-[500px] sm:min-h-[750px] overflow-hidden group/hero`}>
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover/hero:scale-105" style={{ backgroundImage: `url(${typedData.imageUrl || 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=1600'})` }}>
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-black/80"></div>
      </div>
      
      <div className="relative z-10 max-w-5xl text-white px-6 animate-slide-up">
        <div className={`space-y-8 ${alignment === 'text-center' ? 'mx-auto' : alignment === 'text-right' ? 'ml-auto' : ''}`}>
          <div className={`inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-widest border border-white/10 ${alignment === 'text-center' ? 'mx-auto' : alignment === 'text-right' ? 'ml-auto' : ''}`}>
            <Sparkles size={12} className="text-primary" />
            <span>Premium Experience</span>
          </div>

          <TextElement 
            tag="h1" 
            field="title" 
            value={typedData.title} 
            className="text-6xl sm:text-8xl font-black mb-6 leading-[1] drop-shadow-2xl uppercase tracking-tighter" 
            placeholder="Título Principal" 
            isEditMode={isEditMode} 
            onUpdate={onUpdate} 
          />
          
          <div className={`h-2 w-32 bg-primary rounded-full mb-8 ${alignment === 'text-center' ? 'mx-auto' : alignment === 'text-right' ? 'ml-auto' : ''}`}></div>

          <TextElement 
            tag="p" 
            field="description" 
            value={typedData.description} 
            className="text-xl sm:text-2xl mb-12 text-gray-100/90 leading-relaxed max-w-3xl font-medium drop-shadow-lg" 
            placeholder="Describe tu propuesta de valor de forma impactante." 
            isEditMode={isEditMode} 
            onUpdate={onUpdate} 
          />
          
          <div className={`flex flex-wrap gap-4 ${alignment === 'text-center' ? 'justify-center' : alignment === 'text-right' ? 'justify-end' : ''}`}>
            <button 
              onClick={() => handleButtonClick(typedData.buttonAction, typedData.buttonTarget)}
              className="px-12 py-5 rounded-2xl font-black text-lg text-white bg-primary hover:bg-primary/90 transition-all shadow-2xl shadow-primary/40 hover:-translate-y-1 active:scale-95"
            >
              {typedData.buttonText || 'Comenzar Ahora'}
            </button>
            {typedData.secondaryButtonText && (
              <button 
                onClick={() => handleButtonClick(typedData.secondaryButtonAction, typedData.secondaryButtonTarget)}
                className="px-12 py-5 rounded-2xl font-black text-lg text-white bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition-all hover:-translate-y-1 active:scale-95"
              >
                {typedData.secondaryButtonText}
              </button>
            )}
          </div>
        </div>
      </div>
      
      {/* Decorative bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-pageBg to-transparent pointer-events-none opacity-50"></div>
    </div>
  );
}