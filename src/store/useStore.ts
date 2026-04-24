import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type SiteType = 'website' | 'store' | 'blog' | 'landing' | 'portfolio' | 'restaurant' | 'agency' | 'startup';

export type SectionType = 'hero' | 'services' | 'about' | 'gallery' | 'testimonials' | 'cta' | 'contact' | 'faq' | 'footer' | 'products' | 'articles' | 'menu' | 'projects' | 'social';

export interface SectionStyle {
  padding: string; // 'py-8', 'py-16', 'py-24'
  alignment: string; // 'text-left', 'text-center', 'text-right'
  backgroundColor: string; // 'bg-white', 'bg-gray-50', etc.
}

// Discriminator types for strong typing
export type SocialData = { 
  title: string; 
  layout: 'horizontal' | 'vertical' | 'grid';
  iconSize: number;
  items: { platform: string; url: string; active: boolean; }[] 
};
export type HeroData = { 
  title: string; 
  description: string; 
  imageUrl?: string; 
  buttonText?: string; 
  buttonAction?: string; 
  buttonTarget?: string;
  layout?: 'centered' | 'split';
  secondaryButtonText?: string;
  secondaryButtonAction?: string;
  secondaryButtonTarget?: string;
};
export type AboutData = { 
  title: string; 
  description: string; 
  imageUrl?: string;
  points?: string[];
  layout?: 'text-only' | 'image-left' | 'image-right';
};
export type ServicesData = { title: string; items: { title: string; desc: string; }[] };
export type ProductsData = { title: string; items: { name: string; price: string; image: string; }[] };
export type ArticlesData = { title: string; items: { title: string; excerpt: string; image: string; }[] };
export type MenuData = { title: string; categories: { name: string; items: { name: string; desc: string; price: string; }[] }[] };
export type ProjectsData = { title: string; items: { title: string; category: string; image: string; }[] };
export type GalleryData = { title: string; images: string[] };
export type TestimonialsData = { title: string; items: { name: string; role?: string; text: string; }[] };
export type CTAData = { title: string; description: string; buttonText?: string; buttonAction?: string; buttonTarget?: string; };
export type FAQData = { title: string; items: { q: string; a: string; }[] };
export type ContactData = { title: string; email: string; phone?: string; address?: string; hours?: string; };
export type FooterData = { text: string; links?: { label: string; url: string; }[] };

export type SectionDataMap = {
  hero: HeroData;
  about: AboutData;
  services: ServicesData;
  products: ProductsData;
  articles: ArticlesData;
  menu: MenuData;
  projects: ProjectsData;
  gallery: GalleryData;
  testimonials: TestimonialsData;
  cta: CTAData;
  faq: FAQData;
  contact: ContactData;
  footer: FooterData;
  social: SocialData;
};

export type Section<T extends SectionType = SectionType> = {
  id: string;
  type: T;
  data: SectionDataMap[T];
  style?: SectionStyle;
};

export interface SiteTheme {
  primaryColor: string; 
  secondaryColor: string;
  backgroundColor: string;
  textColor: string;
  fontFamily: string; 
}

export interface SiteStats {
  views: number;
  clicks: number;
  conversions: number;
}

export interface Site {
  id: string;
  name: string;
  type: SiteType;
  templateId: string;
  createdAt: string;
  published: boolean;
  stats: SiteStats;
  theme: SiteTheme;
  sections: Section[];
  userId?: string;
  objective?: string;
  contactEmail?: string;
}

export interface User {
  email: string;
  name: string;
}

interface AppState {
  // Theme
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  
  // Auth
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
  
  // Sites
  sites: Site[];
  setSites: (sites: Site[]) => void;
  addSite: (site: Site) => void;
  updateSite: (id: string, updates: Partial<Site>) => void;
  deleteSite: (id: string) => void;
  duplicateSite: (id: string) => void;
  togglePublishSite: (id: string) => void;
  
  // Editor Specific Actions
  updateSiteTheme: (id: string, theme: Partial<SiteTheme>) => void;
  addSection: (siteId: string, section: Omit<Section, 'id'>) => void;
  removeSection: (siteId: string, sectionId: string) => void;
  updateSection: (siteId: string, sectionId: string, data: any) => void;
  updateSectionStyle: (siteId: string, sectionId: string, style: Partial<SectionStyle>) => void;
  duplicateSection: (siteId: string, sectionId: string) => void;
  reorderSections: (siteId: string, startIndex: number, endIndex: number) => void;

  // Saving state
  savingStatus: 'idle' | 'saving' | 'saved' | 'error';
  lastSaved: Date | null;
  hasUnsavedChanges: boolean;
  setSavingStatus: (status: 'idle' | 'saving' | 'saved' | 'error') => void;
  setHasUnsavedChanges: (hasChanges: boolean) => void;
}

const generateMockStats = (): SiteStats => ({
  views: Math.floor(Math.random() * 5000) + 100,
  clicks: Math.floor(Math.random() * 800) + 20,
  conversions: Math.floor(Math.random() * 100) + 1,
});

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      // Theme
      isDarkMode: false,
      toggleDarkMode: () => set((state) => {
        const newMode = !state.isDarkMode;
        if (newMode) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
        return { isDarkMode: newMode };
      }),
      
      // Auth
      user: null,
      login: (user) => set({ user }),
      logout: () => set({ user: null }),
      
      // Sites
      sites: [],
      setSites: (sites) => set({ sites }),
      addSite: (site) => set((state) => {
        console.log("Guardando nuevo sitio en Zustand:", site);
        return { 
          sites: [...(state.sites || []), { ...site, stats: site.stats || generateMockStats(), published: site.published || false }] 
        };
      }),
      updateSite: (id, updates) => set((state) => ({
        sites: state.sites.map(site => site.id === id ? { ...site, ...updates } : site)
      })),
      deleteSite: (id) => set((state) => ({
        sites: state.sites.filter(site => site.id !== id)
      })),
      duplicateSite: (id) => set((state) => {
        const siteToDuplicate = state.sites.find(s => s.id === id);
        if (!siteToDuplicate) return state;
        
        const newSite: Site = {
          ...siteToDuplicate,
          id: `site-${Date.now()}`,
          name: `${siteToDuplicate.name} (Copia)`,
          createdAt: new Date().toISOString(),
          published: false,
          stats: { views: 0, clicks: 0, conversions: 0 },
          sections: siteToDuplicate.sections.map(sec => ({ ...sec, id: `sec-${Date.now()}-${Math.random()}` }))
        };
        
        return { sites: [...state.sites, newSite] };
      }),
      togglePublishSite: (id) => set((state) => ({
        sites: state.sites.map(site => site.id === id ? { ...site, published: !site.published } : site)
      })),
      
      // Editor Actions
      updateSiteTheme: (id, theme) => set((state) => ({
        sites: state.sites.map(site => site.id === id ? { ...site, theme: { ...site.theme, ...theme } } : site)
      })),
      addSection: (siteId, section) => set((state) => ({
        sites: state.sites.map(site => {
          if (site.id !== siteId) return site;
          const defaultStyle: SectionStyle = { padding: 'py-16', alignment: 'text-center', backgroundColor: 'bg-transparent' };
          
          // Default data for complex sections to avoid blank renders
          let defaultData = section.data;
          if (section.type === 'products' && (!(defaultData as any).items || (defaultData as any).items.length === 0)) {
            defaultData = {
              title: 'Nuestros Productos',
              items: [{ name: 'Producto Ejemplo', price: '$99.00', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80' }]
            } as any;
          } else if (section.type === 'articles' && (!(defaultData as any).items || (defaultData as any).items.length === 0)) {
            defaultData = {
              title: 'Últimos Artículos',
              items: [{ title: 'Artículo de Ejemplo', excerpt: 'Resumen del artículo...', image: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&q=80' }]
            } as any;
          } else if (section.type === 'projects' && (!(defaultData as any).items || (defaultData as any).items.length === 0)) {
            defaultData = {
              title: 'Mis Proyectos',
              items: [{ title: 'Proyecto Ejemplo', category: 'Diseño', image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80' }]
            } as any;
          } else if (section.type === 'menu' && (!(defaultData as any).categories || (defaultData as any).categories.length === 0)) {
            defaultData = {
              title: 'Nuestro Menú',
              categories: [{ name: 'Especialidades', items: [{ name: 'Plato Ejemplo', desc: 'Descripción del plato...', price: '$15.00' }] }]
            } as any;
          }

          const newSection: Section = { ...section, data: defaultData, id: `sec-${Date.now()}`, style: defaultStyle };
          return { ...site, sections: [...site.sections, newSection] };
        })
      })),
      removeSection: (siteId, sectionId) => set((state) => ({
        sites: state.sites.map(site => {
          if (site.id !== siteId) return site;
          return { ...site, sections: site.sections.filter(s => s.id !== sectionId) };
        })
      })),
      updateSection: (siteId, sectionId, data) => set((state) => ({
        sites: state.sites.map(site => {
          if (site.id !== siteId) return site;
          return {
            ...site,
            sections: site.sections.map(s => s.id === sectionId ? { ...s, data: { ...s.data, ...data } } : s)
          };
        })
      })),
      updateSectionStyle: (siteId, sectionId, styleUpdates) => set((state) => ({
        sites: state.sites.map(site => {
          if (site.id !== siteId) return site;
          return {
            ...site,
            sections: site.sections.map(s => s.id === sectionId ? { ...s, style: { ...s.style, ...styleUpdates } as SectionStyle } : s)
          };
        })
      })),
      duplicateSection: (siteId, sectionId) => set((state) => ({
        sites: state.sites.map(site => {
          if (site.id !== siteId) return site;
          const sectionIndex = site.sections.findIndex(s => s.id === sectionId);
          if (sectionIndex === -1) return site;
          
          const sectionToCopy = site.sections[sectionIndex];
          const duplicatedSection: Section = { 
            ...sectionToCopy, 
            id: `sec-${Date.now()}-${Math.random()}`,
            data: JSON.parse(JSON.stringify(sectionToCopy.data)), // Deep copy data
            style: sectionToCopy.style ? { ...sectionToCopy.style } : undefined
          };
          
          const newSections = [...site.sections];
          newSections.splice(sectionIndex + 1, 0, duplicatedSection);
          
          return { ...site, sections: newSections };
        })
      })),
      reorderSections: (siteId, startIndex, endIndex) => set((state) => ({
        sites: state.sites.map(site => {
          if (site.id !== siteId) return site;
          const result = Array.from(site.sections);
          const [removed] = result.splice(startIndex, 1);
          result.splice(endIndex, 0, removed);
          return { ...site, sections: result };
        })
      })),

      // Saving status
      savingStatus: 'idle',
      lastSaved: null,
      hasUnsavedChanges: false,
      setSavingStatus: (status) => set((state) => ({ 
        savingStatus: status,
        lastSaved: status === 'saved' ? new Date() : state.lastSaved
      })),
      setHasUnsavedChanges: (hasChanges) => set({ hasUnsavedChanges: hasChanges }),
    }),
    {
      name: 'webforgex-storage',
      onRehydrateStorage: () => (state) => {
        if (state?.isDarkMode) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }
    }
  )
);
