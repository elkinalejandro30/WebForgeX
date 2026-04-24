import TextElement from './TextElement';

export default function ArticlesBlock({ id, data, isEditMode, padding, alignment, bgClass, onUpdate }: any) {
  return (
    <div id={id} className={`${padding} px-8 ${bgClass}`}>
      <TextElement tag="h2" field="title" value={data.title} className={`text-3xl md:text-4xl font-extrabold mb-12 ${alignment} text-pageText`} placeholder="Últimos Artículos" isEditMode={isEditMode} onUpdate={onUpdate} />
      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {data.items && data.items.length > 0 ? data.items.map((item: any, i: number) => (
          <div key={i} className="group flex flex-col bg-white dark:bg-slate-800 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 dark:border-gray-800">
            <div className="aspect-video overflow-hidden bg-gray-100 dark:bg-slate-900">
              <img src={item.image || 'https://via.placeholder.com/600x400?text=Blog'} loading="lazy" alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            </div>
            <div className="p-8 flex-1 flex flex-col">
              {isEditMode ? (
                <>
                  <h3 contentEditable suppressContentEditableWarning onBlur={e => { const newItems = data.items.map((it: any, idx: number) => i === idx ? { ...it, title: e.currentTarget.innerText } : it); onUpdate && onUpdate({ items: newItems }); }} className="text-2xl font-bold mb-3 outline-none hover:bg-black/5 rounded px-1 text-pageText leading-tight">{item.title}</h3>
                  <p contentEditable suppressContentEditableWarning onBlur={e => { const newItems = data.items.map((it: any, idx: number) => i === idx ? { ...it, excerpt: e.currentTarget.innerText } : it); onUpdate && onUpdate({ items: newItems }); }} className="text-pageText/70 mb-6 flex-1 outline-none hover:bg-black/5 rounded px-1 leading-relaxed">{item.excerpt}</p>
                </>
              ) : (
                <>
                  <h3 className="text-2xl font-bold mb-3 text-pageText leading-tight">{item.title}</h3>
                  <p className="text-pageText/70 mb-6 flex-1 leading-relaxed">{item.excerpt}</p>
                </>
              )}
              <button className="text-primary font-bold hover:text-indigo-700 self-start">Leer más →</button>
            </div>
          </div>
        )) : isEditMode && (
          <div className="col-span-full py-20 text-center border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-3xl">
            <p className="text-gray-400 font-medium italic">Agrega artículos desde el panel lateral</p>
          </div>
        )}
      </div>
    </div>
  );
}