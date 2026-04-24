import TextElement from './TextElement';

export default function TestimonialsBlock({ id, data, isEditMode, padding, alignment, bgClass, onUpdate }: any) {
  return (
    <div id={id} className={`${padding} px-8 ${bgClass}`}>
      <TextElement tag="h2" field="title" value={data.title} className={`text-3xl md:text-4xl font-extrabold mb-16 ${alignment} text-pageText`} placeholder="Testimonios" isEditMode={isEditMode} onUpdate={onUpdate} />
      <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {data.items?.map((item: any, i: number) => (
          <div key={i} className={`p-10 rounded-3xl shadow-md hover:shadow-xl transition-all duration-300 bg-white/80 dark:bg-black/30 backdrop-blur-sm border border-black/5 dark:border-white/5 ${alignment}`}>
            {isEditMode ? (
              <>
                <p 
                  contentEditable suppressContentEditableWarning 
                  onBlur={e => { const newItems = data.items.map((it: any, idx: number) => i === idx ? { ...it, text: e.currentTarget.innerText } : it); onUpdate && onUpdate({ items: newItems }); }}
                  className="italic text-pageText/80 text-lg leading-relaxed mb-8 outline-none hover:bg-black/5 rounded px-1"
                >"{item.text}"</p>
                <div 
                  contentEditable suppressContentEditableWarning 
                  onBlur={e => { const newItems = data.items.map((it: any, idx: number) => i === idx ? { ...it, name: e.currentTarget.innerText } : it); onUpdate && onUpdate({ items: newItems }); }}
                  className="font-bold text-pageText text-xl outline-none hover:bg-black/5 rounded px-1 inline-block"
                >{item.name}</div>
                {item.role !== undefined && (
                  <div 
                    contentEditable suppressContentEditableWarning 
                    onBlur={e => { const newItems = data.items.map((it: any, idx: number) => i === idx ? { ...it, role: e.currentTarget.innerText } : it); onUpdate && onUpdate({ items: newItems }); }}
                    className="text-sm font-medium text-primary mt-1 outline-none hover:bg-black/5 rounded px-1"
                  >{item.role}</div>
                )}
              </>
            ) : (
              <>
                <p className="italic text-pageText/80 text-lg leading-relaxed mb-8">"{item.text}"</p>
                <div className="font-bold text-pageText text-xl">{item.name}</div>
                {item.role && <div className="text-sm font-medium text-primary mt-1">{item.role}</div>}
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}