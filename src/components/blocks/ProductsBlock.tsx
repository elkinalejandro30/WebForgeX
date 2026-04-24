import TextElement from './TextElement';

export default function ProductsBlock({ id, data, isEditMode, padding, alignment, bgClass, onUpdate }: any) {
  return (
    <div id={id} className={`${padding} px-8 ${bgClass}`}>
      <TextElement tag="h2" field="title" value={data.title} className={`text-3xl md:text-4xl font-extrabold mb-12 ${alignment} text-pageText`} placeholder="Nuestros Productos" isEditMode={isEditMode} onUpdate={onUpdate} />
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
        {data.items && data.items.length > 0 ? data.items.map((item: any, i: number) => (
          <div key={i} className="group bg-white dark:bg-slate-800 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 dark:border-gray-800">
            <div className="aspect-[4/3] overflow-hidden bg-gray-100 dark:bg-slate-900">
              <img src={item.image || 'https://via.placeholder.com/400x300?text=Producto'} loading="lazy" alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            </div>
            <div className="p-6">
              {isEditMode ? (
                <>
                  <h3 contentEditable suppressContentEditableWarning onBlur={e => { const newItems = data.items.map((it: any, idx: number) => i === idx ? { ...it, name: e.currentTarget.innerText } : it); onUpdate && onUpdate({ items: newItems }); }} className="text-xl font-bold mb-2 outline-none hover:bg-black/5 rounded px-1 text-pageText">{item.name}</h3>
                  <p contentEditable suppressContentEditableWarning onBlur={e => { const newItems = data.items.map((it: any, idx: number) => i === idx ? { ...it, price: e.currentTarget.innerText } : it); onUpdate && onUpdate({ items: newItems }); }} className="text-lg text-primary font-medium mb-4 outline-none hover:bg-black/5 rounded px-1">{item.price}</p>
                </>
              ) : (
                <>
                  <h3 className="text-xl font-bold mb-2 text-pageText">{item.name}</h3>
                  <p className="text-lg text-primary font-medium mb-4">{item.price}</p>
                </>
              )}
              <button className="w-full py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl font-bold hover:bg-primary dark:hover:bg-primary dark:hover:text-white transition-colors shadow-md">
                Comprar ahora
              </button>
            </div>
          </div>
        )) : isEditMode && (
          <div className="col-span-full py-20 text-center border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-3xl">
            <p className="text-gray-400 font-medium italic">Agrega productos desde el panel lateral</p>
          </div>
        )}
      </div>
    </div>
  );
}