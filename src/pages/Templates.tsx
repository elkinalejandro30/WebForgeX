import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore, SiteType, Section, Site } from '../store/useStore';
import { useAuthStore } from '../store/useAuthStore';
import { Globe, ShoppingBag, BookOpen, LayoutTemplate, ArrowRight, Briefcase, Utensils, UserCircle, X, Zap, MessageCircle, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { createProject } from '../firebase/firestore';

interface Template {
  id: string;
  name: string;
  type: SiteType;
  image: string;
  description: string;
  defaultSections: Omit<Section, 'id'>[];
  defaultTheme: { primaryColor: string; secondaryColor: string; backgroundColor: string; textColor: string; fontFamily: string };
}

const siteTypes: { id: SiteType; title: string; desc: string; icon: any }[] = [
  { id: 'website', title: 'Sitio Web', desc: 'Para negocios o proyectos.', icon: Globe },
  { id: 'store', title: 'Tienda Online', desc: 'Vende productos y recibe pagos.', icon: ShoppingBag },
  { id: 'blog', title: 'Blog', desc: 'Publica artículos y noticias.', icon: BookOpen },
  { id: 'landing', title: 'Landing Page', desc: 'Captura leads o promociona algo.', icon: LayoutTemplate },
  { id: 'portfolio', title: 'Portafolio Personal', desc: 'Muestra tu trabajo al mundo.', icon: UserCircle },
  { id: 'restaurant', title: 'Restaurante', desc: 'Menú, reservas y ubicación.', icon: Utensils },
  { id: 'agency', title: 'Agencia', desc: 'Servicios y testimonios.', icon: Briefcase },
  { id: 'startup', title: 'Startup', desc: 'SaaS o App móvil.', icon: Zap },
];

const mockTemplates: Template[] = [
  { 
    id: 't1', 
    name: 'Agencia Creativa', 
    type: 'agency', 
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80', 
    description: 'Perfecto para agencias y empresas de servicios.',
    defaultTheme: { primaryColor: '#9333ea', secondaryColor: '#7e22ce', backgroundColor: '#ffffff', textColor: '#1e293b', fontFamily: 'inter' },
    defaultSections: [
      { type: 'hero', data: { title: 'Impulsamos tu marca', description: 'Soluciones creativas para empresas modernas.', imageUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80', buttonText: 'Conócenos' } },
      { type: 'services', data: { title: 'Nuestros Servicios', items: [{title: 'Diseño Web', desc: 'Sitios rápidos y modernos'}, {title: 'Marketing', desc: 'Llegamos a tu audiencia'}] } },
      { type: 'contact', data: { title: 'Hablemos', email: 'contacto@agencia.com' } }
    ]
  },
  { 
    id: 't2', 
    name: 'Restaurante Gourmet', 
    type: 'restaurant', 
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80', 
    description: 'Atrae clientes con fotos de tus mejores platos.',
    defaultTheme: { primaryColor: '#ef4444', secondaryColor: '#b91c1c', backgroundColor: '#ffffff', textColor: '#1e293b', fontFamily: 'playfair' },
    defaultSections: [
      { type: 'hero', data: { title: 'Sabor inolvidable', description: 'Experiencia culinaria de primer nivel.', imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80', buttonText: 'Ver Menú' } },
      { type: 'gallery', data: { title: 'Nuestros Platos', images: ['https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&w=600&q=80'] } },
    ]
  },
  { 
    id: 't3', 
    name: 'Portafolio Minimalista', 
    type: 'portfolio', 
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80', 
    description: 'Diseño limpio ideal para diseñadores y devs.',
    defaultTheme: { primaryColor: '#000000', secondaryColor: '#333333', backgroundColor: '#ffffff', textColor: '#000000', fontFamily: 'poppins' },
    defaultSections: [
      { type: 'hero', data: { title: 'Hola, soy Creativo', description: 'Desarrollador Full Stack & Diseñador UI.', imageUrl: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80', buttonText: 'Ver Proyectos' } },
      { type: 'gallery', data: { title: 'Mis Proyectos', images: [] } },
      { type: 'contact', data: { title: 'Contáctame', email: 'hola@creativo.com' } }
    ]
  },
  { 
    id: 't4', 
    name: 'Modern Store', 
    type: 'store', 
    image: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80', 
    description: 'Tienda moderna con gran impacto visual.',
    defaultTheme: { primaryColor: '#10b981', secondaryColor: '#047857', backgroundColor: '#ffffff', textColor: '#1e293b', fontFamily: 'inter' },
    defaultSections: [
      { type: 'hero', data: { title: 'Nueva Colección', description: 'Descubre los mejores productos.', imageUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80', buttonText: 'Comprar Ahora' } },
    ]
  },
  { 
    id: 't5', 
    name: 'Corporate Web', 
    type: 'website', 
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80', 
    description: 'Sitio clásico para empresas.',
    defaultTheme: { primaryColor: '#2563eb', secondaryColor: '#1e40af', backgroundColor: '#f8fafc', textColor: '#1e293b', fontFamily: 'montserrat' },
    defaultSections: [
      { type: 'hero', data: { title: 'Soluciones Corporativas', description: 'Líderes en el mercado.', imageUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80', buttonText: 'Más Información' } },
      { type: 'testimonials', data: { title: 'Lo que dicen de nosotros', items: [{name: 'CEO', text: 'Excelente servicio'}] } },
    ]
  },
  { 
    id: 't6', 
    name: 'SaaS Launch', 
    type: 'startup', 
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80', 
    description: 'Perfecto para presentar tu próxima gran idea.',
    defaultTheme: { primaryColor: '#4f46e5', secondaryColor: '#4338ca', backgroundColor: '#ffffff', textColor: '#0f172a', fontFamily: 'inter' },
    defaultSections: [
      { type: 'hero', data: { title: 'El futuro es hoy', description: 'Una herramienta que cambiará tu forma de trabajar.', imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80', buttonText: 'Empieza Gratis' } },
      { type: 'services', data: { title: 'Características Principales', items: [{title: 'Rápido', desc: 'Optimizado al máximo'}, {title: 'Seguro', desc: 'Tus datos protegidos'}] } },
    ]
  },
];

type FieldConfig = {
  id: string;
  label: string;
  type: 'text' | 'textarea' | 'select' | 'email' | 'number';
  required: boolean;
  placeholder?: string;
  options?: string[];
};

const siteFormSchemas: Record<SiteType, { tipo_sitio: string; campos: FieldConfig[] }> = {
  website: {
    tipo_sitio: "Sitio Web",
    campos: [
      { id: "siteName", label: "Nombre del proyecto", type: "text", required: true, placeholder: "Ej: Mi Empresa" },
      { id: "objective", label: "Objetivo del sitio", type: "textarea", required: true, placeholder: "¿Qué esperas lograr?" },
      { id: "sections", label: "Secciones deseadas", type: "text", required: false, placeholder: "Ej: Inicio, Servicios, Contacto" },
      { id: "contact", label: "Correo de contacto", type: "email", required: true, placeholder: "hola@empresa.com" }
    ]
  },
  store: {
    tipo_sitio: "Tienda Online",
    campos: [
      { id: "siteName", label: "Nombre de la tienda", type: "text", required: true, placeholder: "Ej: EcoStore" },
      { id: "productType", label: "Tipo de productos", type: "text", required: true, placeholder: "Ej: Ropa, Electrónica" },
      { id: "payment", label: "Métodos de pago", type: "text", required: true, placeholder: "Ej: Tarjeta, PayPal" },
      { id: "shipping", label: "¿Realizas envíos?", type: "select", required: true, options: ["Sí", "No"] },
      { id: "currency", label: "Moneda", type: "text", required: true, placeholder: "Ej: USD, EUR, MXN" },
      { id: "contact", label: "Correo de contacto", type: "email", required: true, placeholder: "hola@tienda.com" }
    ]
  },
  blog: {
    tipo_sitio: "Blog",
    campos: [
      { id: "siteName", label: "Nombre del blog", type: "text", required: true, placeholder: "Ej: TechNews" },
      { id: "theme", label: "Temática del blog", type: "text", required: true, placeholder: "Ej: Tecnología, Estilo de vida" },
      { id: "frequency", label: "Frecuencia de publicación", type: "select", required: true, options: ["Diaria", "Semanal", "Mensual"] },
      { id: "categories", label: "Categorías principales", type: "text", required: true, placeholder: "Ej: Noticias, Reviews" },
      { id: "contact", label: "Correo de contacto", type: "email", required: true, placeholder: "hola@blog.com" }
    ]
  },
  landing: {
    tipo_sitio: "Landing Page",
    campos: [
      { id: "siteName", label: "Nombre del producto/oferta", type: "text", required: true, placeholder: "Ej: Curso React Pro" },
      { id: "objective", label: "Objetivo de conversión", type: "select", required: true, options: ["Capturar Leads", "Venta directa", "Descarga de App"] },
      { id: "offer", label: "Oferta principal", type: "textarea", required: true, placeholder: "Describe brevemente tu oferta" },
      { id: "cta", label: "Llamado a la acción principal", type: "text", required: true, placeholder: "Ej: ¡Suscríbete ahora!" },
      { id: "contact", label: "Correo de contacto", type: "email", required: true, placeholder: "hola@landing.com" }
    ]
  },
  portfolio: {
    tipo_sitio: "Portafolio Personal",
    campos: [
      { id: "siteName", label: "Tu nombre", type: "text", required: true, placeholder: "Ej: Juan Pérez" },
      { id: "profession", label: "Profesión o área", type: "text", required: true, placeholder: "Ej: Diseñador UI/UX" },
      { id: "workType", label: "Tipo de trabajos", type: "text", required: true, placeholder: "Ej: Web design, Branding" },
      { id: "links", label: "Enlaces a proyectos (Opcional)", type: "text", required: false, placeholder: "Behance, GitHub, etc." },
      { id: "contact", label: "Correo de contacto", type: "email", required: true, placeholder: "hola@juanperez.com" }
    ]
  },
  restaurant: {
    tipo_sitio: "Restaurante",
    campos: [
      { id: "siteName", label: "Nombre del restaurante", type: "text", required: true, placeholder: "Ej: La Trattoria" },
      { id: "foodType", label: "Tipo de comida", type: "text", required: true, placeholder: "Ej: Italiana, Vegana" },
      { id: "hasMenu", label: "¿Incluir menú digital?", type: "select", required: true, options: ["Sí", "No"] },
      { id: "reservations", label: "¿Aceptas reservas?", type: "select", required: true, options: ["Sí", "No"] },
      { id: "hours", label: "Horarios", type: "text", required: true, placeholder: "Ej: Mar-Dom 13:00 - 23:00" },
      { id: "contact", label: "Correo de contacto", type: "email", required: true, placeholder: "hola@restaurante.com" }
    ]
  },
  agency: {
    tipo_sitio: "Agencia",
    campos: [
      { id: "siteName", label: "Nombre de la agencia", type: "text", required: true, placeholder: "Ej: Creative Media" },
      { id: "services", label: "Servicios ofrecidos", type: "textarea", required: true, placeholder: "Ej: Marketing, SEO, Desarrollo Web" },
      { id: "target", label: "Clientes objetivo", type: "text", required: true, placeholder: "Ej: Pymes, Startups" },
      { id: "testimonials", label: "¿Incluir testimonios?", type: "select", required: true, options: ["Sí", "No"] },
      { id: "contact", label: "Correo de contacto", type: "email", required: true, placeholder: "hola@agencia.com" }
    ]
  },
  startup: {
    tipo_sitio: "Startup",
    campos: [
      { id: "siteName", label: "Nombre del producto", type: "text", required: true, placeholder: "Ej: TaskFlow" },
      { id: "productType", label: "Tipo de producto", type: "select", required: true, options: ["SaaS", "App Móvil", "Hardware", "Otro"] },
      { id: "problem", label: "Problema que resuelve", type: "textarea", required: true, placeholder: "Describe el problema" },
      { id: "target", label: "Público objetivo", type: "text", required: true, placeholder: "Ej: Estudiantes, Freelancers" },
      { id: "stage", label: "Etapa del proyecto", type: "select", required: true, options: ["Idea", "MVP", "En crecimiento"] },
      { id: "contact", label: "Correo de contacto", type: "email", required: true, placeholder: "hola@startup.com" }
    ]
  }
};

export default function Templates() {
  const [step, setStep] = useState<1 | 2>(1);
  const [selectedType, setSelectedType] = useState<SiteType | null>(null);
  const [previewTemplate, setPreviewTemplate] = useState<Template | null>(null);
  
  // Creation Wizard State
  const [showWizardModal, setShowWizardModal] = useState(false);
  const [wizardParams, setWizardParams] = useState<Record<string, string>>({});
  const [isGenerating, setIsGenerating] = useState(false);

  const { addSite, sites } = useStore();
  const user = useAuthStore(state => state.user);
  const userPlan = user?.plan || 'free';
  const maxSites = userPlan === 'free' ? 1 : userPlan === 'pro' ? 5 : 20;

  const navigate = useNavigate();

  const handleTypeSelect = (type: SiteType) => {
    if (sites.length >= maxSites) {
      toast.error(`Límite alcanzado: ${maxSites} sitio(s) en tu plan actual. Mejora tu plan.`);
      return;
    }
    setSelectedType(type);
    setStep(2);
  };

  const handleStartCreation = (template: Template) => {
    setPreviewTemplate(template);
    setShowWizardModal(true);
  };

  const handleCreateSite = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Iniciando creación de proyecto...", { wizardParams, templateId: previewTemplate?.id });
    
    if (!previewTemplate) {
      toast.error('Error interno: No hay plantilla seleccionada');
      return;
    }
    
    const schema = siteFormSchemas[previewTemplate.type];
    const missingRequired = schema.campos.filter(c => c.required && !wizardParams[c.id]);
    if (missingRequired.length > 0) {
      toast.error('Por favor, completa los campos requeridos');
      return;
    }

    setIsGenerating(true);
    const toastId = toast.loading('Construyendo tu sitio web...');
    
    try {
      // Simular un tiempo de construcción para mejorar la UX
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Mapear los datos del usuario a las secciones de la plantilla
      let customSections: Section[] = [];
      const commonFooter = {
        id: `sec-${Date.now()}-footer`,
        type: 'footer' as any,
        data: {
          text: `© ${new Date().getFullYear()} ${wizardParams.siteName}. Todos los derechos reservados.`,
          links: [
            { label: 'Política de Privacidad', url: '#' },
            { label: 'Términos de Servicio', url: '#' }
          ]
        },
        style: { padding: 'py-8', alignment: 'text-center', backgroundColor: 'bg-gray-900' }
      };

      if (previewTemplate.type === 'store') {
        customSections = [
          {
            id: `sec-${Date.now()}-hero`,
            type: 'hero',
            data: {
              title: `Bienvenido a ${wizardParams.siteName}`,
              description: `Descubre nuestros productos exclusivos seleccionados especialmente para ti. Compra seguro y rápido.`,
              buttonText: 'Ver Productos',
              buttonAction: 'scroll',
              buttonTarget: `sec-${Date.now()}-products`,
              imageUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80'
            },
            style: { padding: 'py-24', alignment: 'text-center', backgroundColor: 'bg-white' }
          },
          {
            id: `sec-${Date.now()}-products`,
            type: 'products',
            data: {
              title: 'Colección Destacada',
              items: [
                { name: 'Producto Premium 1', price: '$49.99', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80' },
                { name: 'Producto Premium 2', price: '$89.99', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80' },
                { name: 'Producto Premium 3', price: '$29.99', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80' },
                { name: 'Producto Premium 4', price: '$129.99', image: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=800&q=80' }
              ]
            },
            style: { padding: 'py-20', alignment: 'text-center', backgroundColor: 'bg-gray-50' }
          },
          {
            id: `sec-${Date.now()}-testimonials`,
            type: 'testimonials',
            data: {
              title: 'Lo que dicen nuestros clientes',
              items: [
                { name: 'Ana Silva', text: 'El envío fue rapidísimo y el producto superó mis expectativas.' },
                { name: 'Pedro Martínez', text: 'Excelente calidad. Definitivamente volveré a comprar aquí.' }
              ]
            },
            style: { padding: 'py-20', alignment: 'text-center', backgroundColor: 'bg-white' }
          },
          commonFooter
        ];
      } else if (previewTemplate.type === 'blog') {
        customSections = [
          {
            id: `sec-${Date.now()}-hero`,
            type: 'hero',
            data: {
              title: `El Blog de ${wizardParams.siteName}`,
              description: `Ideas, historias y noticias sobre tecnología, diseño y estilo de vida escrito por ${wizardParams.owner}.`,
              buttonText: 'Leer Artículos',
              buttonAction: 'scroll',
              buttonTarget: `sec-${Date.now()}-articles`,
              imageUrl: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1200&q=80'
            },
            style: { padding: 'py-24', alignment: 'text-center', backgroundColor: 'bg-white' }
          },
          {
            id: `sec-${Date.now()}-articles`,
            type: 'articles',
            data: {
              title: 'Últimas Publicaciones',
              items: [
                { title: 'Cómo mejorar tu productividad', excerpt: 'Descubre los 5 hábitos que cambiarán tu forma de trabajar este año.', image: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=800&q=80' },
                { title: 'El futuro del diseño web', excerpt: 'Tendencias y tecnologías que están revolucionando la industria.', image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80' },
                { title: 'Trabajo remoto efectivo', excerpt: 'Guía completa para mantener la motivación trabajando desde casa.', image: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=800&q=80' }
              ]
            },
            style: { padding: 'py-20', alignment: 'text-center', backgroundColor: 'bg-gray-50' }
          },
          {
            id: `sec-${Date.now()}-contact`,
            type: 'contact',
            data: {
              title: 'Suscríbete al Newsletter',
              email: wizardParams.contact || 'hola@empresa.com',
            },
            style: { padding: 'py-20', alignment: 'text-center', backgroundColor: 'bg-primary' }
          },
          commonFooter
        ];
      } else if (previewTemplate.type === 'restaurant') {
        customSections = [
          {
            id: `sec-${Date.now()}-hero`,
            type: 'hero',
            data: {
              title: wizardParams.siteName,
              description: `Auténtica experiencia culinaria en el corazón de ${wizardParams.location || 'la ciudad'}.`,
              buttonText: 'Ver Menú',
              buttonAction: 'scroll',
              buttonTarget: `sec-${Date.now()}-menu`,
              imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80'
            },
            style: { padding: 'py-24', alignment: 'text-center', backgroundColor: 'bg-black' }
          },
          {
            id: `sec-${Date.now()}-menu`,
            type: 'menu',
            data: {
              title: 'Nuestro Menú',
              categories: [
                { 
                  name: 'Especialidades', 
                  items: [
                    { name: 'Plato de Autor', desc: 'Receta secreta del chef con ingredientes locales', price: '$24' },
                    { name: 'Corte Premium', desc: 'Selección especial cocinada a la perfección', price: '$32' }
                  ]
                },
                { 
                  name: 'Postres', 
                  items: [
                    { name: 'Volcán de Chocolate', desc: 'Con helado de vainilla artesanal', price: '$12' },
                    { name: 'Tiramisú', desc: 'Receta tradicional italiana', price: '$10' }
                  ]
                }
              ]
            },
            style: { padding: 'py-20', alignment: 'text-center', backgroundColor: 'bg-white' }
          },
          {
            id: `sec-${Date.now()}-gallery`,
            type: 'gallery',
            data: {
              title: 'El Ambiente',
              images: [
                'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=600&q=80',
                'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=600&q=80',
                'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=600&q=80'
              ]
            },
            style: { padding: 'py-20', alignment: 'text-center', backgroundColor: 'bg-gray-50' }
          },
          {
            id: `sec-${Date.now()}-contact`,
            type: 'contact',
            data: {
              title: 'Haz tu reserva',
              email: wizardParams.contact || 'reservas@restaurante.com',
              phone: '+1 234 567 890',
              address: wizardParams.location || 'Calle Principal 123',
              hours: 'Mar - Dom: 13:00 - 23:00'
            },
            style: { padding: 'py-20', alignment: 'text-center', backgroundColor: 'bg-primary' }
          },
          commonFooter
        ];
      } else if (previewTemplate.type === 'portfolio') {
        customSections = [
          {
            id: `sec-${Date.now()}-hero`,
            type: 'hero',
            data: {
              title: `Hola, soy ${wizardParams.owner}`,
              description: `Diseñador y desarrollador enfocado en crear experiencias digitales excepcionales. Bienvenidos a mi espacio creativo en ${wizardParams.location || 'la web'}.`,
              buttonText: 'Ver mis proyectos',
              buttonAction: 'scroll',
              buttonTarget: `sec-${Date.now()}-projects`,
              imageUrl: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80'
            },
            style: { padding: 'py-32', alignment: 'text-left', backgroundColor: 'bg-white' }
          },
          {
            id: `sec-${Date.now()}-projects`,
            type: 'projects',
            data: {
              title: 'Proyectos Destacados',
              items: [
                { title: 'App de Finanzas', category: 'UI/UX Design', image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80' },
                { title: 'E-commerce Moda', category: 'Web Development', image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80' }
              ]
            },
            style: { padding: 'py-20', alignment: 'text-center', backgroundColor: 'bg-gray-50' }
          },
          {
            id: `sec-${Date.now()}-about`,
            type: 'about',
            data: {
              title: 'Sobre mí',
              description: 'Tengo más de 5 años de experiencia trabajando con agencias y startups globales. Mi objetivo es traducir problemas complejos en soluciones simples, hermosas e intuitivas.'
            },
            style: { padding: 'py-20', alignment: 'text-center', backgroundColor: 'bg-white' }
          },
          {
            id: `sec-${Date.now()}-contact`,
            type: 'contact',
            data: {
              title: 'Trabajemos juntos',
              email: wizardParams.contact || 'hola@creativo.com',
            },
            style: { padding: 'py-20', alignment: 'text-center', backgroundColor: 'bg-primary' }
          },
          commonFooter
        ];
      } else if (previewTemplate.type === 'landing') {
        customSections = [
          {
            id: `sec-${Date.now()}-hero`,
            type: 'hero',
            data: {
              title: wizardParams.siteName,
              description: wizardParams.offer || 'La mejor oferta del mercado',
              buttonText: wizardParams.cta || 'Comprar Ahora',
              buttonAction: 'scroll',
              buttonTarget: `sec-${Date.now()}-contact`,
              imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80'
            },
            style: { padding: 'py-32', alignment: 'text-center', backgroundColor: 'bg-white' }
          },
          {
            id: `sec-${Date.now()}-services`,
            type: 'services',
            data: {
              title: 'Beneficios',
              items: [
                { title: 'Beneficio 1', desc: 'Razón principal para elegirnos.' },
                { title: 'Beneficio 2', desc: 'Segunda razón de peso.' },
                { title: 'Beneficio 3', desc: 'Tercera ventaja competitiva.' }
              ]
            },
            style: { padding: 'py-20', alignment: 'text-center', backgroundColor: 'bg-gray-50' }
          },
          {
            id: `sec-${Date.now()}-testimonials`,
            type: 'testimonials',
            data: {
              title: 'Lo que dicen de nosotros',
              items: [
                { name: 'Usuario Feliz', text: 'Increíble producto, cumplió todas mis expectativas.' }
              ]
            },
            style: { padding: 'py-20', alignment: 'text-center', backgroundColor: 'bg-white' }
          },
          {
            id: `sec-${Date.now()}-contact`,
            type: 'cta',
            data: {
              title: 'No esperes más',
              description: `Únete a nosotros y logra tus objetivos: ${wizardParams.objective}`,
              buttonText: wizardParams.cta || 'Suscribirme',
            },
            style: { padding: 'py-24', alignment: 'text-center', backgroundColor: 'bg-primary' }
          },
          commonFooter
        ];
      } else if (previewTemplate.type === 'agency') {
        customSections = [
          {
            id: `sec-${Date.now()}-hero`,
            type: 'hero',
            data: {
              title: wizardParams.siteName,
              description: `Especialistas en: ${wizardParams.services}`,
              buttonText: 'Ver Servicios',
              buttonAction: 'scroll',
              buttonTarget: `sec-${Date.now()}-services`,
              imageUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80'
            },
            style: { padding: 'py-24', alignment: 'text-center', backgroundColor: 'bg-white' }
          },
          {
            id: `sec-${Date.now()}-services`,
            type: 'services',
            data: {
              title: 'Nuestros Servicios',
              items: [
                { title: 'Estrategia', desc: 'Consultoría a medida.' },
                { title: 'Desarrollo', desc: 'Implementación técnica.' },
                { title: 'Diseño', desc: 'Creación de interfaces.' }
              ]
            },
            style: { padding: 'py-20', alignment: 'text-center', backgroundColor: 'bg-gray-50' }
          },
          {
            id: `sec-${Date.now()}-about`,
            type: 'about',
            data: {
              title: 'Por qué elegirnos',
              description: `Nos enfocamos en entregar los mejores resultados para: ${wizardParams.target}`
            },
            style: { padding: 'py-20', alignment: 'text-center', backgroundColor: 'bg-white' }
          },
          {
            id: `sec-${Date.now()}-contact`,
            type: 'contact',
            data: {
              title: 'Hablemos de tu proyecto',
              email: wizardParams.contact || 'hola@agencia.com',
            },
            style: { padding: 'py-20', alignment: 'text-center', backgroundColor: 'bg-primary' }
          },
          commonFooter
        ];
      } else if (previewTemplate.type === 'startup') {
        customSections = [
          {
            id: `sec-${Date.now()}-hero`,
            type: 'hero',
            data: {
              title: wizardParams.siteName,
              description: wizardParams.problem || 'Resolviendo problemas complejos con tecnología simple.',
              buttonText: 'Pruébalo gratis',
              buttonAction: 'scroll',
              buttonTarget: `sec-${Date.now()}-contact`,
              imageUrl: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=1200&q=80'
            },
            style: { padding: 'py-32', alignment: 'text-center', backgroundColor: 'bg-white' }
          },
          {
            id: `sec-${Date.now()}-about`,
            type: 'about',
            data: {
              title: 'Nuestra Misión',
              description: `Somos un ${wizardParams.productType} en etapa de ${wizardParams.stage}, diseñado específicamente para: ${wizardParams.target}.`
            },
            style: { padding: 'py-20', alignment: 'text-center', backgroundColor: 'bg-gray-50' }
          },
          {
            id: `sec-${Date.now()}-contact`,
            type: 'cta',
            data: {
              title: 'Únete a la revolución',
              description: 'Solicita acceso anticipado a nuestra plataforma.',
              buttonText: 'Solicitar Acceso',
            },
            style: { padding: 'py-24', alignment: 'text-center', backgroundColor: 'bg-primary' }
          },
          commonFooter
        ];
      } else {
        // Fallback for website
        customSections = [
          {
            id: `sec-${Date.now()}-hero`,
            type: 'hero',
            data: {
              title: `Impulsa tu negocio con ${wizardParams.siteName}`,
              description: wizardParams.objective || `En ${wizardParams.siteName} ayudamos a empresas a crecer en el mundo digital.`,
              buttonText: 'Conocer más',
              buttonAction: 'scroll',
              buttonTarget: `sec-${Date.now()}-about`,
              imageUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80'
            },
            style: { padding: 'py-24', alignment: 'text-center', backgroundColor: 'bg-white' }
          },
          {
            id: `sec-${Date.now()}-about`,
            type: 'about',
            data: {
              title: `Sobre ${wizardParams.siteName}`,
              description: `Nuestra misión es transformar la manera en que conectas con tu audiencia. Nos apasiona construir experiencias digitales que generen impacto real.`
            },
            style: { padding: 'py-20', alignment: 'text-center', backgroundColor: 'bg-gray-50' }
          },
          {
            id: `sec-${Date.now()}-services`,
            type: 'services',
            data: {
              title: 'Nuestros Servicios',
              items: [
                { title: 'Desarrollo a Medida', desc: 'Plataformas rápidas, seguras y escalables para tu negocio.' },
                { title: 'Estrategia Digital', desc: 'Campañas orientadas a maximizar tu retorno de inversión.' },
                { title: 'Diseño UX/UI', desc: 'Interfaces intuitivas que enamoran a tus usuarios.' }
              ]
            },
            style: { padding: 'py-20', alignment: 'text-center', backgroundColor: 'bg-white' }
          },
          {
            id: `sec-${Date.now()}-contact`,
            type: 'contact',
            data: {
              title: 'Hablemos de tu próximo proyecto',
              email: wizardParams.contact || 'hola@empresa.com',
            },
            style: { padding: 'py-20', alignment: 'text-center', backgroundColor: 'bg-primary' }
          },
          commonFooter
        ];
      }

      console.log("Secciones generadas para el nuevo sitio:", customSections);

      const siteData: Partial<Site> = {
        name: wizardParams.siteName || 'Mi nuevo sitio',
        type: previewTemplate.type,
        templateId: previewTemplate.id,
        createdAt: new Date().toISOString(),
        published: false,
        stats: { views: 0, clicks: 0, conversions: 0 },
        theme: previewTemplate.defaultTheme,
        sections: customSections,
        userId: user!.uid,
        objective: wizardParams.objective || wizardParams.productType || wizardParams.theme || '',
        contactEmail: wizardParams.contact || '',
      };

      // Guardar en Firestore primero para obtener el ID real de Firebase
      const firestoreId = await createProject(siteData, user!.uid);

      addSite({
        ...siteData,
        id: firestoreId,
      } as Site);

      toast.success('¡Sitio creado con éxito!', { id: toastId });
      
      // Limpieza de estados antes de redirigir
      setShowWizardModal(false);
      setPreviewTemplate(null);
      setWizardParams({ siteName: '', owner: '', contact: '', location: '' });
      setIsGenerating(false);
      
      console.log("Redirigiendo al editor...");
      navigate(`/editor/${firestoreId}`);

    } catch (error) {
      console.error("Error crítico creando el proyecto:", error);
      toast.error('Hubo un error inesperado al crear el sitio', { id: toastId });
      setIsGenerating(false);
    }
  };

  const filteredTemplates = mockTemplates.filter(t => t.type === selectedType);

  return (
    <div className="flex-1 bg-gray-50 dark:bg-darker py-12 transition-colors duration-200">
      
      {/* Creation Wizard Modal */}
      {showWizardModal && previewTemplate && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col md:flex-row border border-gray-200 dark:border-gray-800">
            
            {/* Left Side: Form */}
            <div className="flex-1 flex flex-col p-8 overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Configura tu sitio</h3>
                  <p className="text-gray-500 text-sm mt-1">Ingresa tus datos y prepararemos todo por ti.</p>
                </div>
                <button 
                  onClick={() => !isGenerating && setShowWizardModal(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors md:hidden"
                  disabled={isGenerating}
                >
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              </div>

              <form id="wizard-form" onSubmit={handleCreateSite} className="space-y-5 flex-1">
                {previewTemplate && siteFormSchemas[previewTemplate.type].campos.map((campo) => (
                  <div key={campo.id}>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">
                      {campo.label} {campo.required && '*'}
                    </label>
                    {campo.type === 'textarea' ? (
                      <textarea
                        required={campo.required}
                        placeholder={campo.placeholder}
                        value={wizardParams[campo.id] || ''}
                        onChange={e => setWizardParams({...wizardParams, [campo.id]: e.target.value})}
                        className="w-full p-3 border rounded-xl dark:bg-slate-800 dark:border-gray-700 focus:ring-2 focus:ring-primary outline-none transition-all resize-none"
                        rows={3}
                        disabled={isGenerating}
                      />
                    ) : campo.type === 'select' ? (
                      <select
                        required={campo.required}
                        value={wizardParams[campo.id] || ''}
                        onChange={e => setWizardParams({...wizardParams, [campo.id]: e.target.value})}
                        className="w-full p-3 border rounded-xl dark:bg-slate-800 dark:border-gray-700 focus:ring-2 focus:ring-primary outline-none transition-all"
                        disabled={isGenerating}
                      >
                        <option value="" disabled>Selecciona una opción</option>
                        {campo.options?.map(opt => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                    ) : (
                      <input 
                        type={campo.type} 
                        required={campo.required}
                        placeholder={campo.placeholder} 
                        value={wizardParams[campo.id] || ''}
                        onChange={e => setWizardParams({...wizardParams, [campo.id]: e.target.value})}
                        className="w-full p-3 border rounded-xl dark:bg-slate-800 dark:border-gray-700 focus:ring-2 focus:ring-primary outline-none transition-all"
                        disabled={isGenerating}
                      />
                    )}
                  </div>
                ))}
              </form>

              <div className="pt-6 mt-6 border-t border-gray-100 dark:border-gray-800">
                <button 
                  type="submit" 
                  form="wizard-form"
                  disabled={isGenerating}
                  className="w-full flex items-center justify-center py-4 px-4 rounded-xl text-white font-bold bg-primary hover:bg-indigo-700 transition-all shadow-md disabled:opacity-70 disabled:cursor-not-allowed text-lg"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="h-6 w-6 mr-2 animate-spin" />
                      Construyendo bloques...
                    </>
                  ) : (
                    <>
                      Crear sitio automáticamente
                      <ArrowRight className="h-5 w-5 ml-2" />
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Right Side: Preview & Close */}
            <div className="hidden md:flex w-2/5 bg-gray-50 dark:bg-black p-8 flex-col relative border-l border-gray-100 dark:border-gray-800">
              <button 
                onClick={() => !isGenerating && setShowWizardModal(false)}
                className="absolute top-6 right-6 p-2 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-full transition-colors disabled:opacity-50"
                disabled={isGenerating}
              >
                <X className="h-6 w-6 text-gray-500" />
              </button>
              
              <div className="mt-12 flex-1 flex flex-col">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Plantilla Seleccionada</span>
                <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-6">{previewTemplate.name}</h4>
                
                <div className="w-full aspect-[4/5] rounded-xl overflow-hidden shadow-lg border border-gray-200 dark:border-gray-700">
                  <img 
                    src={previewTemplate.image} 
                    alt="Preview" 
                    className="w-full h-full object-cover object-top"
                  />
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Progress Bar */}
        <div className="mb-12 flex items-center justify-center">
          <div className="flex items-center">
            <div className={`flex items-center justify-center h-10 w-10 rounded-full font-bold ${step >= 1 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500'}`}>
              1
            </div>
            <div className={`h-1 w-16 sm:w-32 mx-2 rounded ${step >= 2 ? 'bg-primary' : 'bg-gray-200 dark:bg-gray-700'}`}></div>
            <div className={`flex items-center justify-center h-10 w-10 rounded-full font-bold ${step >= 2 ? 'bg-primary text-white' : 'bg-gray-200 dark:bg-gray-800 text-gray-500'}`}>
              2
            </div>
          </div>
        </div>

        {step === 1 && (
          <div className="animate-fade-in text-center">
            <div className="flex flex-col items-center mb-10">
              <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-4">¿Qué tipo de sitio web necesitas?</h2>
              <p className="text-gray-500 dark:text-gray-400 text-lg">Selecciona una categoría para empezar a construir tu presencia online.</p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
              {siteTypes.map((type) => {
                const Icon = type.icon;
                return (
                  <button
                    key={type.id}
                    onClick={() => handleTypeSelect(type.id)}
                    className="group flex flex-col items-center p-6 bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-gray-800 hover:border-primary dark:hover:border-primary shadow-sm hover:shadow-lg transition-all duration-300 text-center"
                  >
                    <div className="h-16 w-16 bg-indigo-50 dark:bg-indigo-900/30 text-primary rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <Icon className="h-8 w-8" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">{type.title}</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 px-2 hidden sm:block">{type.desc}</p>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="animate-fade-in">
            <div className="flex justify-between items-center mb-8">
              <div>
                <button 
                  onClick={() => { setStep(1); }}
                  className="text-sm font-medium text-primary hover:text-indigo-700 mb-2 flex items-center"
                >
                  ← Volver a categorías
                </button>
                <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">Elige una plantilla</h2>
                <p className="text-gray-500 dark:text-gray-400 mt-1">
                  Selecciona el diseño inicial para tu {siteTypes.find(t => t.id === selectedType)?.title.toLowerCase()}.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredTemplates.length > 0 ? filteredTemplates.map((template) => (
                <div 
                  key={template.id}
                  className="relative group bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-md transition-all border border-gray-200 dark:border-gray-800 hover:border-primary dark:hover:border-primary"
                >
                  <div className="aspect-[4/3] relative overflow-hidden bg-gray-100 dark:bg-slate-800">
                    <img 
                      src={template.image} 
                      alt={template.name} 
                      className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 gap-3">
                      <button 
                        onClick={() => setPreviewTemplate(template)}
                        className="bg-white text-gray-900 font-bold px-6 py-2 rounded-full transform translate-y-4 group-hover:translate-y-0 transition-all shadow-lg hover:bg-gray-100 w-40 text-center"
                      >
                        Ver previa
                      </button>
                      <button 
                        onClick={() => handleStartCreation(template)}
                        className="bg-primary text-white font-bold px-6 py-2 rounded-full transform translate-y-4 group-hover:translate-y-0 transition-all shadow-lg hover:bg-indigo-600 w-40 text-center"
                      >
                        Usar diseño
                      </button>
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">{template.name}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{template.description}</p>
                  </div>
                </div>
              )) : null}

              {/* Custom Project Card */}
              <div className="relative group bg-gradient-to-br from-indigo-900 to-purple-900 rounded-2xl overflow-hidden shadow-xl transition-all border border-indigo-500/30 hover:border-indigo-400">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80')] opacity-10 bg-cover bg-center mix-blend-overlay"></div>
                <div className="relative p-8 h-full flex flex-col items-center justify-center text-center min-h-[300px]">
                  <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mb-6">
                    <Zap className="h-8 w-8 text-indigo-300" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">Proyecto a Medida</h3>
                  <p className="text-indigo-200 mb-8 max-w-xs">
                    ¿Necesitas algo único y 100% personalizado? Lo construimos para ti con código a la medida.
                  </p>
                  <a 
                    href={`https://wa.me/1234567890?text=${encodeURIComponent('Hola, quiero una página web personalizada con WebForgeX')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white text-indigo-900 font-bold px-8 py-3 rounded-full hover:bg-indigo-50 transition-colors shadow-lg flex items-center"
                  >
                    <MessageCircle className="w-5 h-5 mr-2" />
                    Hablar con un experto
                  </a>
                </div>
              </div>

              {filteredTemplates.length === 0 && (
                <div className="col-span-full text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-gray-100 dark:border-gray-800">
                  <LayoutTemplate className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Más plantillas en camino</h3>
                  <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-6">
                    Actualmente estamos diseñando plantillas específicas para esta categoría.
                  </p>
                  <button 
                    onClick={() => setStep(1)}
                    className="text-primary font-medium hover:underline"
                  >
                    Elegir otra categoría
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
