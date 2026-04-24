import TextElement from './TextElement';

export default function FooterBlock({ id, data, isEditMode, padding, onUpdate }: any) {
  return (
    <footer id={id} className={`${padding} px-8 bg-gray-900 text-gray-400 text-center text-sm mt-auto`}>
      <div className="max-w-4xl mx-auto">
        {data.links && data.links.length > 0 && (
          <div className="flex flex-wrap justify-center gap-6 mb-8">
            {data.links.map((link: any, i: number) => (
              <a key={i} href={isEditMode ? '#' : link.url} className="hover:text-white transition-colors">{link.label}</a>
            ))}
          </div>
        )}
        <TextElement tag="div" field="text" value={data.text} className="opacity-50" placeholder="© 2024 Mi Empresa" isEditMode={isEditMode} onUpdate={onUpdate} />
      </div>
    </footer>
  );
}