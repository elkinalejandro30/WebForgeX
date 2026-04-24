import TextElement from './TextElement';

export default function ProjectsBlock({ id, data, isEditMode, padding, alignment, bgClass, onUpdate }: any) {
  return (
    <div id={id} className={`${padding} px-8 ${bgClass}`}>
      <TextElement tag="h2" field="title" value={data.title} className={`text-3xl md:text-5xl font-extrabold mb-12 ${alignment} text-pageText`} placeholder="Proyectos" isEditMode={isEditMode} onUpdate={onUpdate} />
      <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
        {data.items && data.items.length > 0 ? data.items.map((item: any, i: number) => (
          <div key={i} className="group relative rounded-3xl overflow-hidden shadow-lg aspect-[4/3]">
            <img src={item.image || 'https://via.placeholder.com/800x600?text=Proyecto'} loading="lazy" alt={item.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="absolute bottom-0 left-0 p-8 w-full translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
              {isEditMode ? (
                <>
                  <div contentEditable suppressContentEditableWarning onBlur={e => { const newItems = data.items.map((it: any, idx: number) => i === idx ? { ...it, category: e.currentTarget.innerText } : it); onUpdate && onUpdate({ items: newItems }); }} className="text-primary font-bold text-sm tracking-widest uppercase mb-2 outline-none hover:bg-white/10 rounded px-1 inline-block">{item.category}</div>
                  <h3 contentEditable suppressContentEditableWarning onBlur={e => { const newItems = data.items.map((it: any, idx: number) => i === idx ? { ...it, title: e.currentTarget.innerText } : it); onUpdate && onUpdate({ items: newItems }); }} className="text-3xl font-bold text-white outline-none hover:bg-white/10 rounded px-1">{item.title}</h3>
                </>
              ) : (
                <>
                  <div className="text-primary font-bold text-sm tracking-widest uppercase mb-2">{item.category}</div>
                  <h3 className="text-3xl font-bold text-white">{item.title}</h3>
                </>
              )}
            </div>
          </div>
        )) : isEditMode && (
          <div className="col-span-full py-20 text-center border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-3xl">
            <p className="text-gray-400 font-medium italic">Agrega proyectos desde el panel lateral</p>
          </div>
        )}
      </div>
    </div>
  );
}