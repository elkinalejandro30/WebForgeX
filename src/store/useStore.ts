import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useAuthStore } from './useAuthStore';

export type SiteType = 'website' | 'store' | 'blog' | 'landing' | 'portfolio' | 'restaurant' | 'agency' | 'startup';

export type SectionType = 'hero' | 'services' | 'about' | 'gallery' | 'testimonials' | 'cta' | 'contact' | 'faq' | 'footer' | 'products' | 'articles' | 'menu' | 'projects' | 'social';

export interface SectionStyle {
  padding: string;
  alignment: string;
  backgroundColor: string;
}

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
  userId?: number;
}

interface AppState {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  
  sites: Site[];
  fetchSites: () => Promise<void>;
  addSite: (site: Site) => Promise<void>;
  updateSite: (id: string, updates: Partial<Site>) => Promise<void>;
  deleteSite: (id: string) => Promise<void>;
  duplicateSite: (id: string) => void;
  togglePublishSite: (id: string) => Promise<void>;
  
  updateSiteTheme: (id: string, theme: Partial<SiteTheme>) => void;
  addSection: (siteId: string, section: Omit<Section, 'id'>) => void;
  removeSection: (siteId: string, sectionId: string) => void;
  updateSection: (siteId: string, sectionId: string, data: any) => void;
  updateSectionStyle: (siteId: string, sectionId: string, style: Partial<SectionStyle>) => void;
  duplicateSection: (siteId: string, sectionId: string) => void;
  reorderSections: (siteId: string, startIndex: number, endIndex: number) => void;

  savingStatus: 'idle' | 'saving' | 'saved' | 'error';
  hasUnsavedChanges: boolean;
  lastSaved: number | null;
  setSavingStatus: (status: 'idle' | 'saving' | 'saved' | 'error') => void;
  setHasUnsavedChanges: (hasChanges: boolean) => void;
}

import { API_URL as BASE_API_URL } from '../config/api';

const API_URL = `${BASE_API_URL}/api`;

const getHeaders = () => {
  const token = useAuthStore.getState().token;
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
};

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      isDarkMode: false,
      toggleDarkMode: () => set((state) => {
        const newMode = !state.isDarkMode;
        document.documentElement.classList.toggle('dark', newMode);
        return { isDarkMode: newMode };
      }),
      
      sites: [],
      fetchSites: async () => {
        // En modo prototipo funcional, no hacemos nada ya que persist se encarga de cargar del localStorage
      },
      addSite: async (site) => {
        set((state) => ({ sites: [...state.sites, site] }));
      },
      updateSite: async (id, updates) => {
        set((state) => ({
          sites: state.sites.map(s => s.id === id ? { ...s, ...updates } : s),
          lastSaved: Date.now()
        }));
      },
      deleteSite: async (id) => {
        set((state) => ({ sites: state.sites.filter(s => s.id !== id) }));
      },
      duplicateSite: (id) => {
        const siteToDuplicate = get().sites.find(s => s.id === id);
        if (!siteToDuplicate) return;
        const newSite: Site = {
          ...siteToDuplicate,
          id: `site-${Date.now()}`,
          name: `${siteToDuplicate.name} (Copia)`,
          createdAt: new Date().toISOString(),
          published: false,
          stats: { views: 0, clicks: 0, conversions: 0 },
          sections: siteToDuplicate.sections.map(sec => ({ ...sec, id: `sec-${Date.now()}-${Math.random()}` }))
        };
        get().addSite(newSite);
      },
      togglePublishSite: async (id) => {
        const site = get().sites.find(s => s.id === id);
        if (site) {
          await get().updateSite(id, { published: !site.published });
        }
      },
      
      updateSiteTheme: (id, theme) => set((state) => ({
        sites: state.sites.map(site => site.id === id ? { ...site, theme: { ...site.theme, ...theme } } : site)
      })),
      addSection: (siteId, section) => set((state) => ({
        sites: state.sites.map(site => {
          if (site.id !== siteId) return site;
          const newSection: Section = { ...section, id: `sec-${Date.now()}`, style: { padding: 'py-16', alignment: 'text-center', backgroundColor: 'bg-transparent' } } as Section;
          return { ...site, sections: [...site.sections, newSection] };
        })
      })),
      removeSection: (siteId, sectionId) => set((state) => ({
        sites: state.sites.map(site => site.id === siteId ? { ...site, sections: site.sections.filter(s => s.id !== sectionId) } : site)
      })),
      updateSection: (siteId, sectionId, data) => set((state) => ({
        sites: state.sites.map(site => site.id === siteId ? {
          ...site,
          sections: site.sections.map(s => s.id === sectionId ? { ...s, data: { ...s.data, ...data } } : s)
        } : site)
      })),
      updateSectionStyle: (siteId, sectionId, styleUpdates) => set((state) => ({
        sites: state.sites.map(site => site.id === siteId ? {
          ...site,
          sections: site.sections.map(s => s.id === sectionId ? { ...s, style: { ...s.style, ...styleUpdates } as SectionStyle } : s)
        } : site)
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
            data: JSON.parse(JSON.stringify(sectionToCopy.data)),
            style: sectionToCopy.style ? { ...sectionToCopy.style } : undefined
          } as Section;
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

      savingStatus: 'idle',
      hasUnsavedChanges: false,
      lastSaved: null,
      setSavingStatus: (status) => set({ savingStatus: status }),
      setHasUnsavedChanges: (hasChanges) => set({ hasUnsavedChanges: hasChanges }),
    }),
    { name: 'webforgex-storage' }
  )
);
