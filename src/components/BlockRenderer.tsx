import { Section, SectionType } from '../store/useStore';
import { ShoppingBag, BookOpen, LayoutTemplate, Plus } from 'lucide-react';

// Import all block components dynamically
import HeroBlock from './blocks/HeroBlock';
import ServicesBlock from './blocks/ServicesBlock';
import AboutBlock from './blocks/AboutBlock';
import GalleryBlock from './blocks/GalleryBlock';
import ProductsBlock from './blocks/ProductsBlock';
import ArticlesBlock from './blocks/ArticlesBlock';
import MenuBlock from './blocks/MenuBlock';
import ProjectsBlock from './blocks/ProjectsBlock';
import TestimonialsBlock from './blocks/TestimonialsBlock';
import ContactBlock from './blocks/ContactBlock';
import CTABlock from './blocks/CTABlock';
import FAQBlock from './blocks/FAQBlock';
import FooterBlock from './blocks/FooterBlock';
import SocialMediaBlock from './blocks/SocialMediaBlock';

interface BlockComponentProps {
  id: string;
  data: any;
  isEditMode?: boolean;
  padding: string;
  alignment: string;
  bgClass: string;
  onUpdate?: (data: any) => void;
  handleButtonClick?: (action?: string, target?: string) => void;
}

const blockComponents: Record<SectionType, React.ComponentType<BlockComponentProps>> = {
  hero: HeroBlock as any,
  services: ServicesBlock as any,
  about: AboutBlock as any,
  gallery: GalleryBlock as any,
  products: ProductsBlock as any,
  articles: ArticlesBlock as any,
  menu: MenuBlock as any,
  projects: ProjectsBlock as any,
  testimonials: TestimonialsBlock as any,
  contact: ContactBlock as any,
  cta: CTABlock as any,
  faq: FAQBlock as any,
  footer: FooterBlock as any,
  social: SocialMediaBlock as any,
};

interface BlockRendererProps {
  section: Section;
  isEditMode?: boolean;
  onUpdate?: (data: any) => void;
}

export default function BlockRenderer({ section, isEditMode, onUpdate }: BlockRendererProps) {
  const { type, data, style } = section;
  const padding = style?.padding || 'py-16';
  const alignment = style?.alignment || 'text-center';
  const bgClass = style?.backgroundColor || 'bg-transparent';
  
  const handleButtonClick = (action?: string, target?: string) => {
    if (isEditMode) return; 

    if (action === 'scroll' && target) {
      const el = document.getElementById(target);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else if (action === 'url' && target) {
      window.open(target, '_blank');
    } else if (action === 'whatsapp' && target) {
      window.open(`https://wa.me/${target.replace(/\D/g, '')}`, '_blank');
    } else if (action === 'email' && target) {
      window.location.href = `mailto:${target}`;
    }
  };

  const BlockComponent = blockComponents[type];

  if (!BlockComponent) {
    return (
      <div className="p-8 text-center bg-red-50 text-red-500 rounded-xl border border-red-100">
        Bloque "{type}" no encontrado
      </div>
    );
  }

  // Fallback visual for empty items in complex blocks
  const isEmpty = (
    (type === 'products' && (!(data as any).items || (data as any).items.length === 0)) ||
    (type === 'articles' && (!(data as any).items || (data as any).items.length === 0)) ||
    (type === 'projects' && (!(data as any).items || (data as any).items.length === 0)) ||
    (type === 'menu' && (!(data as any).categories || (data as any).categories.length === 0)) ||
    (type === 'gallery' && (!(data as any).images || (data as any).images.length === 0))
  );

  if (isEmpty && isEditMode) {
    return (
      <div className={`p-16 text-center ${bgClass} border-2 border-dashed border-primary/20 rounded-[2.5rem] m-4`}>
        <div className="max-w-md mx-auto space-y-4">
          <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto">
            {type === 'products' ? <ShoppingBag className="w-8 h-8" /> : 
             type === 'articles' ? <BookOpen className="w-8 h-8" /> : 
             type === 'projects' ? <LayoutTemplate className="w-8 h-8" /> : 
             <Plus className="w-8 h-8" />}
          </div>
          <h3 className="text-xl font-bold text-pageText uppercase tracking-tighter">Bloque de {type} vacío</h3>
          <p className="text-pageText/60 font-medium">Agrega items desde el panel lateral para empezar a diseñar esta sección.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative group/block-wrapper">
      <BlockComponent 
        id={section.id} 
        data={data} 
        isEditMode={isEditMode} 
        padding={padding} 
        alignment={alignment} 
        bgClass={bgClass} 
        onUpdate={onUpdate} 
        handleButtonClick={handleButtonClick} 
      />
      
      {isEditMode && (
        <div className="absolute inset-0 border-2 border-primary/0 group-hover/block-wrapper:border-primary/20 pointer-events-none transition-all duration-300" />
      )}
    </div>
  );
}