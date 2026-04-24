import TextElement from './TextElement';

export default function MenuBlock({ id, data, isEditMode, padding, alignment, bgClass, onUpdate }: any) {
  return (
    <div id={id} className={`${padding} px-8 ${bgClass}`}>
      <TextElement tag="h2" field="title" value={data.title} className={`text-3xl md:text-5xl font-extrabold mb-16 ${alignment} text-pageText`} placeholder="Nuestro Menú" isEditMode={isEditMode} onUpdate={onUpdate} />
      <div className="max-w-4xl mx-auto space-y-16">
        {data.categories && data.categories.length > 0 ? data.categories.map((cat: any, cIndex: number) => (
          <div key={cIndex}>
            {isEditMode ? (
              <h3 contentEditable suppressContentEditableWarning onBlur={e => { const newCats = data.categories.map((c: any, idx: number) => cIndex === idx ? { ...c, name: e.currentTarget.innerText } : c); onUpdate && onUpdate({ categories: newCats }); }} className="text-2xl font-bold mb-8 text-primary border-b-2 border-primary/20 pb-4 inline-block outline-none hover:bg-black/5 rounded px-1">{cat.name}</h3>
            ) : (
              <h3 className="text-2xl font-bold mb-8 text-primary border-b-2 border-primary/20 pb-4 inline-block">{cat.name}</h3>
            )}
            <div className="grid md:grid-cols-2 gap-8">
              {cat.items?.map((item: any, iIndex: number) => (
                <div key={iIndex} className="flex justify-between items-start group">
                  <div className="flex-1 pr-4">
                    {isEditMode ? (
                      <>
                        <h4 contentEditable suppressContentEditableWarning onBlur={e => { 
                          const newCats = data.categories.map((c: any, cIdx: number) => cIndex === cIdx ? { ...c, items: c.items.map((it: any, iIdx: number) => iIndex === iIdx ? { ...it, name: e.currentTarget.innerText } : it) } : c); 
                          onUpdate && onUpdate({ categories: newCats }); 
                        }} className="text-xl font-bold text-pageText mb-1 outline-none hover:bg-black/5 rounded px-1">{item.name}</h4>
                        <p contentEditable suppressContentEditableWarning onBlur={e => { 
                          const newCats = data.categories.map((c: any, cIdx: number) => cIndex === cIdx ? { ...c, items: c.items.map((it: any, iIdx: number) => iIndex === iIdx ? { ...it, desc: e.currentTarget.innerText } : it) } : c); 
                          onUpdate && onUpdate({ categories: newCats }); 
                        }} className="text-sm text-pageText/70 outline-none hover:bg-black/5 rounded px-1">{item.desc}</p>
                      </>
                    ) : (
                      <>
                        <h4 className="text-xl font-bold text-pageText mb-1">{item.name}</h4>
                        <p className="text-sm text-pageText/70">{item.desc}</p>
                      </>
                    )}
                  </div>
                  {isEditMode ? (
                    <div contentEditable suppressContentEditableWarning onBlur={e => { 
                      const newCats = data.categories.map((c: any, cIdx: number) => cIndex === cIdx ? { ...c, items: c.items.map((it: any, iIdx: number) => iIndex === iIdx ? { ...it, price: e.currentTarget.innerText } : it) } : c); 
                      onUpdate && onUpdate({ categories: newCats }); 
                    }} className="text-lg font-bold text-primary outline-none hover:bg-black/5 rounded px-1">{item.price}</div>
                  ) : (
                    <div className="text-lg font-bold text-primary">{item.price}</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )) : isEditMode && (
          <div className="py-20 text-center border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-3xl">
            <p className="text-gray-400 font-medium italic">Agrega categorías y platos desde el panel lateral</p>
          </div>
        )}
      </div>
    </div>
  );
}