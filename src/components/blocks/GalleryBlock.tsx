import TextElement from './TextElement';

export default function GalleryBlock({ id, data, isEditMode, padding, alignment, bgClass, onUpdate }: any) {
  return (
    <div id={id} className={`${padding} px-8 ${bgClass}`}>
      <TextElement tag="h2" field="title" value={data.title} className={`text-3xl md:text-4xl font-extrabold mb-12 ${alignment} text-pageText`} placeholder="Galería" isEditMode={isEditMode} onUpdate={onUpdate} />
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {data.images?.map((url: string, i: number) => (
          <div key={i} className="aspect-square rounded-2xl overflow-hidden bg-gray-200 dark:bg-slate-800 shadow-md hover:shadow-xl transition-all duration-300">
            {url && <img src={url} loading="lazy" alt={`Gallery ${i}`} className="w-full h-full object-cover hover:scale-110 transition-transform duration-700"/>}
          </div>
        ))}
      </div>
    </div>
  );
}