export type PlanId = 'free' | 'pro' | 'business';

export interface PlanFeature {
  text: string;
  included: boolean;
}

export interface PricingOption {
  label: string;
  price: string;
  note?: string;
  billingPeriod: string;
}

export interface Plan {
  id: PlanId;
  name: string;
  price: string;
  period: string;
  badge?: string;
  description: string;
  pricingOptions?: PricingOption[];
  features: PlanFeature[];
  cta: string;
}

export const PLANS: Plan[] = [
  {
    id: 'free',
    name: 'Básico',
    price: 'Gratis',
    period: 'para siempre',
    description: 'Ideal para empezar y probar la plataforma.',
    features: [
      { text: '1 sitio publicado', included: true },
      { text: 'Hasta 6 bloques por sitio', included: true },
      { text: 'Subdominio gratuito (.webforgex.com)', included: true },
      { text: 'Soporte Estándar (Email/WhatsApp)', included: true },
      { text: 'Marca de agua obligatoria', included: false },
      { text: 'Bloques Premium restringidos', included: false },
    ],
    cta: 'Comenzar Gratis'
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '$24.500',
    period: 'al mes',
    badge: 'Más popular',
    description: 'Para profesionales y pequeños negocios.',
    pricingOptions: [
      { label: 'Mensual', price: '$24.500', billingPeriod: '/mes', note: '1er mes a $15.000' },
      { label: 'Trimestral', price: '$55.000', billingPeriod: '/3 meses', note: 'Ahorras 25%' },
      { label: 'Anual', price: '$120.000', billingPeriod: '/año', note: 'Ahorras 59%' }
    ],
    features: [
      { text: 'Hasta 5 sitios publicados', included: true },
      { text: 'Bloques ilimitados', included: true },
      { text: 'Dominio personalizado propio', included: true },
      { text: 'Sin marca de agua', included: true },
      { text: 'Bloques Premium (Galerías HD, FAQs)', included: true },
      { text: 'Base de Datos Firebase integrada', included: true },
      { text: 'Acceso a funciones Beta', included: true },
      { text: 'Apoyo del equipo de desarrollo', included: true },
      { text: 'Soporte Prioritario WhatsApp/Email', included: true }
    ],
    cta: '3 Días Gratis - Probar ahora'
  },
  {
    id: 'business',
    name: 'Business',
    price: 'Personalizado',
    period: 'a medida',
    description: 'Soluciones completas para tiendas y agencias.',
    features: [
      { text: 'Hasta 20 sitios publicados', included: true },
      { text: 'E-commerce (Tienda) y Restaurante (Menú)', included: true },
      { text: 'Webs desarrolladas por nuestro equipo', included: true },
      { text: 'Base de datos dedicada y seguridad aumentada', included: true },
      { text: 'Pasarelas de pago integradas', included: true },
      { text: 'Colaboradores (invitar a otros editores)', included: true },
      { text: 'Soporte Ultra Prioritario 24/7', included: true }
    ],
    cta: 'Contactar a Ventas'
  }
];
