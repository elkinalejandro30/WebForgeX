interface TextElementProps {
  tag: 'h1' | 'h2' | 'h3' | 'p' | 'div' | 'span';
  field: string;
  value: string;
  className?: string;
  placeholder?: string;
  isEditMode?: boolean;
  onUpdate?: (data: Partial<any>) => void;
}

export default function TextElement({ tag: Tag, field, value, className = '', placeholder = '', isEditMode, onUpdate }: TextElementProps) {
  if (isEditMode) {
    return (
      <Tag
        contentEditable
        suppressContentEditableWarning
        onBlur={(e) => {
          if (onUpdate) {
            onUpdate({ [field]: e.currentTarget.innerText });
          }
        }}
        className={`${className} outline-none hover:ring-2 hover:ring-primary/50 hover:bg-black/5 rounded-md px-1 transition-all cursor-text relative group/text empty:before:content-[attr(data-placeholder)] empty:before:text-gray-400`}
        data-placeholder={placeholder}
      >
        {value}
        <span className="absolute -right-2 -top-2 bg-primary text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full opacity-0 group-hover/text:opacity-100 transition-opacity pointer-events-none uppercase tracking-tighter shadow-sm z-10">
          Editar
        </span>
      </Tag>
    );
  }
  return <Tag className={className}>{value}</Tag>;
}