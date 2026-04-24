import TextElement from './TextElement';

export default function CTABlock({ id, data, isEditMode, padding, bgClass, onUpdate, handleButtonClick }: any) {
  return (
    <div id={id} className={`${padding} px-8 ${bgClass} text-white relative overflow-hidden`} style={{ backgroundColor: bgClass === 'bg-transparent' ? 'var(--color-primary)' : undefined }}>
      <div className="absolute inset-0 bg-black/10"></div>
      <div className="max-w-4xl mx-auto text-center relative z-10">
        <TextElement tag="h2" field="title" value={data.title} className="text-4xl md:text-6xl font-extrabold mb-8 drop-shadow-sm" placeholder="Llamado a la acción" isEditMode={isEditMode} onUpdate={onUpdate} />
        <TextElement tag="p" field="description" value={data.description} className="text-xl md:text-2xl font-light opacity-90 mb-12 max-w-2xl mx-auto leading-relaxed" placeholder="Descripción motivadora" isEditMode={isEditMode} onUpdate={onUpdate} />
        <button 
          onClick={() => handleButtonClick(data.buttonAction, data.buttonTarget)}
          className={`px-10 py-5 rounded-full font-bold text-primary bg-white transition-all duration-300 shadow-2xl hover:shadow-white/20 hover:scale-105 hover:-translate-y-1 text-lg ${!isEditMode && data.buttonAction ? 'cursor-pointer' : 'cursor-default'}`}
        >
          {data.buttonText || 'Comenzar'}
        </button>
      </div>
    </div>
  );
}