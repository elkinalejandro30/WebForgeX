import TextElement from './TextElement';

export default function FAQBlock({ id, data, isEditMode, padding, alignment, bgClass, onUpdate }: any) {
  return (
    <div id={id} className={`${padding} px-8 ${bgClass}`}>
      <TextElement tag="h2" field="title" value={data.title} className={`text-3xl font-bold mb-12 ${alignment}`} placeholder="Preguntas Frecuentes" isEditMode={isEditMode} onUpdate={onUpdate} />
      <div className="max-w-3xl mx-auto space-y-4">
        {data.items?.map((item: any, i: number) => (
          <div key={i} className="border border-black/10 dark:border-white/10 rounded-xl p-6 bg-black/5 dark:bg-white/5">
            {isEditMode ? (
              <>
                <h4 
                  contentEditable suppressContentEditableWarning 
                  onBlur={e => { const newItems = data.items.map((it: any, idx: number) => i === idx ? { ...it, q: e.currentTarget.innerText } : it); onUpdate && onUpdate({ items: newItems }); }}
                  className="font-bold text-lg mb-2 outline-none hover:bg-black/5 rounded px-1"
                >{item.q}</h4>
                <p 
                  contentEditable suppressContentEditableWarning 
                  onBlur={e => { const newItems = data.items.map((it: any, idx: number) => i === idx ? { ...it, a: e.currentTarget.innerText } : it); onUpdate && onUpdate({ items: newItems }); }}
                  className="text-gray-600 dark:text-gray-400 outline-none hover:bg-black/5 rounded px-1"
                >{item.a}</p>
              </>
            ) : (
              <>
                <h4 className="font-bold text-lg mb-2">{item.q}</h4>
                <p className="text-gray-600 dark:text-gray-400">{item.a}</p>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}