import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Layout, Zap, CheckCircle2, MonitorSmartphone, Mail, Send, MousePointer2, PlusCircle, Rocket, Star, ShieldCheck, ChevronDown, MessageSquare } from 'lucide-react';
import toast from 'react-hot-toast';
import { PLANS } from '../config/plans';

const FeatureCard = ({ icon: Icon, title, desc, color }: { icon: any, title: string, desc: string, color: string }) => (
  <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group">
    <div className={`h-14 w-14 rounded-2xl flex items-center justify-center mb-6 transition-colors duration-300 ${color}`}>
      <Icon className="h-7 w-7 transition-transform duration-300 group-hover:scale-110" />
    </div>
    <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">{title}</h3>
    <p className="text-gray-500 dark:text-gray-400 leading-relaxed">
      {desc}
    </p>
  </div>
);

const StepCard = ({ number, title, desc, icon: Icon }: { number: string, title: string, desc: string, icon: any }) => (
  <div className="relative flex flex-col items-center text-center group">
    <div className="w-20 h-20 bg-primary/10 dark:bg-primary/20 rounded-2xl flex items-center justify-center mb-6 relative transition-transform duration-300 group-hover:rotate-6">
      <span className="absolute -top-3 -right-3 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold text-sm shadow-lg">
        {number}
      </span>
      <Icon className="w-10 h-10 text-primary" />
    </div>
    <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">{title}</h3>
    <p className="text-gray-500 dark:text-gray-400 max-w-xs">{desc}</p>
  </div>
);

const FAQItem = ({ question, answer }: { question: string, answer: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-gray-100 dark:border-gray-800 last:border-0">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-6 flex items-center justify-between text-left focus:outline-none group"
      >
        <span className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-primary transition-colors">{question}</span>
        <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-40 pb-6' : 'max-h-0'}`}>
        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{answer}</p>
      </div>
    </div>
  );
};

export default function Landing() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  const handleContact = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('¡Gracias! Nos pondremos en contacto pronto.');
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-darker transition-colors duration-200 overflow-x-hidden font-inter">
      <style>{`
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
          100% { transform: translateY(0px); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .glass-card {
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.05);
        }
      `}</style>
      
      {/* Hero Section */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 lg:pt-32 lg:pb-24">
        {/* Animated Orbs */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-primary/10 blur-[100px] animate-pulse"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-[500px] h-[500px] rounded-full bg-purple-500/10 blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>
        
        <div className="relative z-10 flex flex-col items-center text-center max-w-5xl mx-auto">
          <div className="inline-flex items-center space-x-2 bg-primary/10 dark:bg-primary/20 text-primary px-5 py-2.5 rounded-full mb-10 font-bold text-sm border border-primary/20 animate-fade-in shadow-sm">
            <span className="flex h-2.5 w-2.5 rounded-full bg-primary animate-ping"></span>
            <span className="tracking-wide uppercase">Constructor Visual Inteligente</span>
          </div>
          
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-gray-900 dark:text-white mb-8 leading-[1.1] animate-fade-in-up">
            Tu sitio web, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-indigo-500 to-purple-600 drop-shadow-sm">forjado a la perfección.</span>
          </h1>
          
          <p className="mt-4 text-xl md:text-2xl text-gray-500 dark:text-gray-400 mb-12 leading-relaxed max-w-3xl animate-fade-in-up font-medium" style={{ animationDelay: '0.2s' }}>
            La herramienta definitiva para crear sitios web profesionales en segundos. <span className="text-gray-900 dark:text-white font-bold">Sin código, sin límites</span>, solo pura creatividad.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 mb-20 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            <Link
              to="/register"
              className="inline-flex items-center justify-center px-10 py-5 text-xl font-bold rounded-2xl text-white bg-primary hover:bg-indigo-700 transition-all shadow-2xl hover:shadow-primary/40 transform hover:-translate-y-1 active:scale-95 group"
            >
              Comienza gratis hoy
              <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-2 transition-transform" />
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center justify-center px-10 py-5 text-xl font-bold rounded-2xl text-gray-700 dark:text-gray-200 bg-white dark:bg-slate-900 border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-slate-800 transition-all shadow-xl hover:shadow-gray-200 dark:hover:shadow-black transform hover:-translate-y-1 active:scale-95"
            >
              Ver demostración
            </Link>
          </div>

          {/* Product Preview Mockup */}
          <div className="relative w-full max-w-6xl mx-auto animate-fade-in-up animate-float" style={{ animationDelay: '0.6s' }}>
            <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-darker via-transparent to-transparent z-20 pointer-events-none h-32 bottom-0 top-auto"></div>
            <div className="bg-slate-900 rounded-[2.5rem] p-3 shadow-[0_0_100px_rgba(79,70,229,0.2)] border border-white/10 relative overflow-hidden group">
              <div className="bg-slate-800 rounded-[1.8rem] overflow-hidden border border-white/5">
                <div className="h-10 bg-slate-800 flex items-center px-6 space-x-2 border-b border-white/5">
                  <div className="w-3 h-3 rounded-full bg-red-500/40"></div>
                  <div className="w-3 h-3 rounded-full bg-amber-500/40"></div>
                  <div className="w-3 h-3 rounded-full bg-emerald-500/40"></div>
                  <div className="flex-1 text-center">
                    <div className="bg-slate-700/30 h-5 w-64 rounded-lg mx-auto border border-white/5"></div>
                  </div>
                </div>
                <img 
                  src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80" 
                  alt="Editor Preview" 
                  className="w-full h-auto opacity-90 group-hover:opacity-100 transition-all duration-1000 grayscale-[30%] group-hover:grayscale-0 scale-100 group-hover:scale-[1.02]"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-12 bg-white dark:bg-darker border-y border-gray-100 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl font-black text-primary mb-1">Premium</div>
              <div className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">Alta Calidad</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-black text-primary mb-1">99.9%</div>
              <div className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">Uptime</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-black text-primary mb-1">24/7</div>
              <div className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">Soporte</div>
            </div>
          </div>
        </div>
      </div>

      {/* How it Works Section */}
      <div className="py-32 bg-gray-50 dark:bg-slate-900/50 transition-colors relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-6">
              Tu sitio web en 3 pasos
            </h2>
            <p className="text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto font-medium">
              Hemos simplificado el proceso al máximo para que puedas enfocarte en lo que realmente importa: tu negocio.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-16 md:gap-8 relative">
            {/* Connection Line */}
            <div className="hidden md:block absolute top-10 left-1/4 right-1/4 h-0.5 border-t-2 border-dashed border-primary/20"></div>
            
            <StepCard 
              number="01"
              title="Elige tu Tipo"
              desc="Selecciona entre restaurante, tienda, blog o portafolio. Nuestra IA preparará la estructura ideal."
              icon={PlusCircle}
            />
            <StepCard 
              number="02"
              title="Personaliza al Gusto"
              desc="Cambia textos, imágenes y colores con nuestro editor visual. Arrastra y suelta bloques sin esfuerzo."
              icon={MousePointer2}
            />
            <StepCard 
              number="03"
              title="Publica al Mundo"
              desc="Con un solo clic, tu sitio estará online con SSL gratis y optimizado para todos los dispositivos."
              icon={Rocket}
            />
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="py-32 bg-white dark:bg-darker transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-6">
              ¿Por qué elegir WebForgeX?
            </h2>
            <p className="text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto font-medium">
              Potencia pura envuelta en una interfaz minimalista.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            <FeatureCard 
              icon={Layout}
              title="Plantillas Maestras"
              desc="Diseños creados por expertos en UX para garantizar que tu sitio convierta visitantes en clientes reales."
              color="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
            />
            <FeatureCard 
              icon={Zap}
              title="Velocidad Extrema"
              desc="Sitios optimizados para cargar en milisegundos. Mejora tu SEO y mantén a tus usuarios felices."
              color="bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400"
            />
            <FeatureCard 
              icon={ShieldCheck}
              title="Seguridad Total"
              desc="Certificados SSL incluidos, protección DDoS y copias de seguridad automáticas para tu tranquilidad."
              color="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400"
            />
          </div>
        </div>
      </div>

      {/* Pricing Preview Section */}
      <div id="pricing" className="py-32 bg-gray-50 dark:bg-slate-900/50 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-6">
              Planes que crecen contigo
            </h2>
            <p className="text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto font-medium mb-12">
              Sin costos ocultos. Comienza gratis y escala cuando lo necesites.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {PLANS.map((plan) => (
              <div key={plan.id} className={`bg-white dark:bg-slate-800 rounded-[2.5rem] p-8 border-2 transition-all duration-500 hover:scale-[1.02] ${plan.id === 'pro' ? 'border-primary ring-8 ring-primary/5 shadow-2xl relative' : 'border-gray-100 dark:border-gray-800 shadow-xl'} flex flex-col`}>
                {plan.badge && (
                  <span className="absolute -top-5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-primary to-purple-600 text-white px-6 py-1.5 rounded-full text-xs font-black uppercase tracking-widest shadow-xl">
                    {plan.badge}
                  </span>
                )}
                <div className="mb-8">
                  <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-4">{plan.name}</h3>
                  <div className="flex flex-col mb-4">
                    <span className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-gray-900 to-gray-600 dark:from-white dark:to-gray-400">{plan.price}</span>
                    <span className="text-gray-500 text-sm font-bold mt-1 uppercase tracking-tighter">{plan.period}</span>
                  </div>
                  {plan.pricingOptions && (
                    <div className="space-y-2 mt-6 p-4 bg-primary/5 dark:bg-primary/10 rounded-2xl border border-primary/10">
                      {plan.pricingOptions.map((opt, i) => (
                        <div key={i} className="flex justify-between items-center text-sm">
                          <span className="text-gray-600 dark:text-gray-400 font-medium">{opt.label}</span>
                          <div className="text-right">
                            <span className="font-black text-gray-900 dark:text-white">{opt.price}</span>
                            {opt.note && <p className="text-[10px] text-primary font-bold">{opt.note}</p>}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <ul className="space-y-4 mb-10 flex-1">
                  {plan.features.map((feat, i) => (
                    <li key={i} className="flex items-start text-sm">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 flex-shrink-0 ${feat.included ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600' : 'bg-gray-100 dark:bg-gray-800 text-gray-400'}`}>
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                      <span className={feat.included ? 'text-gray-700 dark:text-gray-200 font-medium' : 'text-gray-400 dark:text-gray-500 line-through'}>{feat.text}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  to={plan.id === 'business' ? '#' : '/register'}
                  onClick={(e) => plan.id === 'business' && (e.preventDefault(), toast('Función próximamente', { icon: '🚀' }))}
                  className={`w-full py-5 rounded-2xl font-black text-lg text-center transition-all duration-300 transform active:scale-95 ${plan.id === 'pro' ? 'bg-primary text-white hover:bg-indigo-700 shadow-xl shadow-primary/30 hover:shadow-primary/50' : 'bg-gray-100 dark:bg-slate-700 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-slate-600'}`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div id="testimonials" className="py-32 bg-white dark:bg-darker transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <div className="inline-flex items-center space-x-2 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 px-4 py-2 rounded-full mb-4 font-bold text-sm">
              <Star className="w-4 h-4 fill-current" />
              <span>Confiado por miles</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-6">Lo que dicen nuestros forjadores</h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: "Carlos Ruiz", role: "CEO de TechStart", text: "WebForgeX redujo nuestro tiempo de desarrollo web en un 80%. La IA realmente entiende lo que necesitas.", image: "https://i.pravatar.cc/150?u=carlos" },
              { name: "Elena Gómez", role: "Diseñadora Freelance", text: "Como diseñadora, me encanta la flexibilidad de los bloques. Es la primera herramienta no-code que no se siente limitada.", image: "https://i.pravatar.cc/150?u=elena" },
              { name: "Marc Serra", role: "Dueño de Restaurante", text: "Increíble. Tuve mi sitio de reservas listo en una tarde. Mis clientes aman el diseño móvil.", image: "https://i.pravatar.cc/150?u=marc" }
            ].map((t, i) => (
              <div key={i} className="bg-gray-50 dark:bg-slate-900/50 p-8 rounded-[2rem] shadow-sm border border-gray-100 dark:border-gray-800 relative hover:shadow-xl transition-all duration-300 group">
                <div className="flex items-center space-x-4 mb-6">
                  <img src={t.image} alt={t.name} className="w-14 h-14 rounded-full border-2 border-primary/20 group-hover:border-primary transition-colors" />
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white">{t.name}</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{t.role}</p>
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-300 italic leading-relaxed">"{t.text}"</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div id="faq" className="py-32 bg-white dark:bg-darker transition-colors">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-6">
              Preguntas Frecuentes
            </h2>
          </div>
          <div className="divide-y divide-gray-100 dark:divide-gray-800 border-t border-gray-100 dark:border-gray-800">
            <FAQItem 
              question="¿Realmente es gratis para siempre?" 
              answer="Sí, nuestro plan Básico es gratis para siempre. Incluye todas las herramientas esenciales para lanzar tu primer sitio web sin costo alguno." 
            />
            <FAQItem 
              question="¿Puedo usar mi propio dominio?" 
              answer="¡Claro! En los planes Pro y Business puedes conectar tu propio dominio (ej. www.tunegocio.com) fácilmente." 
            />
            <FAQItem 
              question="¿Necesito saber programar?" 
              answer="Absolutamente no. WebForgeX está diseñado para que cualquier persona pueda crear un sitio profesional simplemente eligiendo bloques y editando textos." 
            />
            <FAQItem 
              question="¿Puedo cambiar de plan en cualquier momento?" 
              answer="Sí, puedes subir o bajar de plan cuando lo desees desde tu panel de control. Los cambios se aplican al instante." 
            />
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div id="contact" className="py-32 bg-gray-50 dark:bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-6">¿Tienes dudas? Hablemos.</h2>
              <p className="text-xl text-gray-500 dark:text-gray-400 mb-10 leading-relaxed">
                Nuestro equipo de expertos está listo para ayudarte a llevar tu visión al siguiente nivel. Respondemos en menos de 24 horas.
              </p>
              
              <div className="space-y-6">
                {[
                  { icon: Mail, label: "Email", value: "hola@webforgex.com" },
                  { icon: MessageSquare, label: "Soporte", value: "Chat en vivo 24/7" },
                  { icon: Rocket, label: "Ventas", value: "ventas@webforgex.com" }
                ].map((item, i) => (
                  <div key={i} className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                      <item.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">{item.label}</p>
                      <p className="text-lg font-bold text-gray-900 dark:text-white">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-white dark:bg-slate-800 p-8 sm:p-10 rounded-[2.5rem] shadow-2xl border border-gray-100 dark:border-gray-700">
              <form onSubmit={handleContact} className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Nombre</label>
                    <input 
                      type="text" 
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder="Tu nombre" 
                      className="w-full px-5 py-4 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-gray-700 rounded-2xl focus:ring-2 focus:ring-primary/20 outline-none transition-all dark:text-white" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Email</label>
                    <input 
                      type="email" 
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      placeholder="tu@email.com" 
                      className="w-full px-5 py-4 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-gray-700 rounded-2xl focus:ring-2 focus:ring-primary/20 outline-none transition-all dark:text-white" 
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Mensaje</label>
                  <textarea 
                    required
                    rows={4} 
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    placeholder="¿En qué podemos ayudarte?" 
                    className="w-full px-5 py-4 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-gray-700 rounded-2xl focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none dark:text-white"
                  ></textarea>
                </div>
                <button 
                  type="submit" 
                  className="w-full py-5 bg-primary text-white font-black rounded-2xl shadow-xl shadow-primary/30 hover:bg-indigo-700 transition-all transform hover:-translate-y-1 active:scale-95 flex items-center justify-center space-x-2 group"
                >
                  <span>Enviar Mensaje</span>
                  <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Final CTA Section */}
      <div className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-[3rem] overflow-hidden bg-primary px-8 py-20 md:px-16 md:py-24 shadow-2xl shadow-primary/20 text-center">
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-white/10 blur-[100px]"></div>
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 rounded-full bg-indigo-900/20 blur-[100px]"></div>
          
          <div className="relative z-10 max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-6xl font-black text-white mb-8 leading-tight">
              ¿Listo para forjar <br />tu futuro digital?
            </h2>
            <p className="text-xl text-indigo-100 mb-12 font-medium">
              Únete a miles de emprendedores que ya están construyendo sus sueños con WebForgeX. Sin tarjetas, sin compromiso.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                to="/register"
                className="bg-white text-primary hover:bg-gray-100 px-10 py-5 rounded-2xl font-black text-xl transition-all shadow-xl hover:shadow-2xl active:scale-95"
              >
                Empezar gratis ahora
              </Link>
              <a
                href="#pricing"
                className="bg-primary/20 text-white border-2 border-white/30 hover:bg-white/10 px-10 py-5 rounded-2xl font-black text-xl transition-all active:scale-95"
              >
                Ver precios
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white dark:bg-darker border-t border-gray-100 dark:border-gray-800 pt-24 pb-12 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
                  <MonitorSmartphone className="h-6 w-6 text-white" />
                </div>
                <span className="text-2xl font-black text-gray-900 dark:text-white tracking-tighter">
                  WebForgeX
                </span>
              </div>
              <p className="text-gray-500 dark:text-gray-400 max-w-sm text-lg leading-relaxed">
                La plataforma de construcción web más intuitiva y potente para la nueva generación de negocios digitales.
              </p>
            </div>
            <div>
              <h4 className="font-black text-gray-900 dark:text-white uppercase tracking-widest text-sm mb-6">Producto</h4>
              <ul className="space-y-4 text-gray-500 dark:text-gray-400 font-medium">
                <li><Link to="/templates" className="hover:text-primary transition-colors">Plantillas</Link></li>
                <li><a href="#pricing" className="hover:text-primary transition-colors">Precios</a></li>
                <li><a href="#features" className="hover:text-primary transition-colors">Características</a></li>
                <li><a href="#testimonials" className="hover:text-primary transition-colors">Reseñas</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-black text-gray-900 dark:text-white uppercase tracking-widest text-sm mb-6">Soporte</h4>
              <ul className="space-y-4 text-gray-500 dark:text-gray-400 font-medium">
                <li><a href="#faq" className="hover:text-primary transition-colors">Centro de Ayuda</a></li>
                <li><a href="#contact" className="hover:text-primary transition-colors">Contacto</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Estado del Servicio</a></li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-gray-100 dark:border-gray-800 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-gray-500 dark:text-gray-400 text-sm font-medium">
              © {new Date().getFullYear()} WebForgeX. Todos los derechos reservados.
            </div>
            <div className="flex items-center space-x-6">
              <a href="#" className="text-gray-400 hover:text-primary transition-colors">Twitter</a>
              <a href="#" className="text-gray-400 hover:text-primary transition-colors">Instagram</a>
            </div>
            <div className="text-gray-500 dark:text-gray-400 text-sm font-medium flex items-center">
              Desarrollado con ❤️ por <span className="font-bold text-gray-900 dark:text-white ml-1.5">Ing. Alejandro</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
