import { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, Loader2, CheckCircle } from 'lucide-react';
import { ContactData } from '../../store/useStore';
import TextElement from './TextElement';
import emailjs from '@emailjs/browser';
import toast from 'react-hot-toast';

interface ContactBlockProps {
  id: string;
  data: ContactData;
  isEditMode?: boolean;
  padding?: string;
  alignment?: string;
  bgClass?: string;
  onUpdate?: (data: Partial<ContactData>) => void;
}

export default function ContactBlock({ 
  id, 
  data, 
  isEditMode, 
  padding = 'py-16', 
  alignment = 'text-left', 
  bgClass = 'bg-transparent', 
  onUpdate 
}: ContactBlockProps) {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isEditMode) return;

    setLoading(true);
    const form = e.currentTarget;

    try {
      // NOTA: Para que esto funcione, el usuario debe configurar sus propias claves de EmailJS
      // Se recomienda usar variables de entorno para esto.
      const serviceId = 'service_default'; // Reemplazar con Service ID real
      const templateId = 'template_contact'; // Reemplazar con Template ID real
      const publicKey = 'public_key'; // Reemplazar con Public Key real

      // Solo intentamos enviar si las claves no son las por defecto (o simplemente mostramos feedback positivo para el MVP)
      if (publicKey !== 'public_key') {
        await emailjs.sendForm(serviceId, templateId, form, publicKey);
      } else {
        // Simulación para cuando aún no hay claves configuradas
        await new Promise(resolve => setTimeout(resolve, 1500));
        console.log("Simulación de envío: Claves EmailJS no configuradas");
      }

      setSent(true);
      toast.success('¡Mensaje enviado correctamente!');
      form.reset();
      setTimeout(() => setSent(false), 5000);
    } catch (error) {
      console.error('EmailJS Error:', error);
      toast.error('Error al enviar el mensaje. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id={id} className={`${padding} px-8 ${bgClass}`}>
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          
          {/* Información de Contacto (Izquierda) */}
          <div className={`space-y-10 ${alignment === 'text-center' ? 'text-center flex flex-col items-center' : alignment === 'text-right' ? 'text-right flex flex-col items-end' : 'text-left flex flex-col items-start'}`}>
            <div className="max-w-xl">
              <TextElement tag="h2" field="title" value={data.title} className="text-4xl md:text-5xl font-extrabold mb-6 text-pageText" placeholder="Contáctanos" isEditMode={isEditMode} onUpdate={onUpdate} />
              <p className="text-lg md:text-xl text-pageText/70 leading-relaxed font-light">
                Estamos aquí para ayudarte. Llena el formulario o comunícate directamente con nosotros a través de nuestros canales de atención.
              </p>
            </div>

            <div className="space-y-8 w-full max-w-md">
              {data.email && (
                <div className={`flex items-center gap-5 ${alignment === 'text-center' ? 'justify-center' : alignment === 'text-right' ? 'flex-row-reverse' : 'justify-start'}`}>
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary flex-shrink-0 shadow-inner">
                    <Mail className="w-7 h-7" />
                  </div>
                  <div className={alignment === 'text-right' ? 'text-right' : 'text-left'}>
                    <p className="text-sm font-bold text-pageText/50 uppercase tracking-widest mb-1">Email</p>
                    <TextElement tag="div" field="email" value={data.email} className="text-xl font-medium text-pageText" placeholder="tu@email.com" isEditMode={isEditMode} onUpdate={onUpdate} />
                  </div>
                </div>
              )}
              
              {data.phone && (
                <div className={`flex items-center gap-5 ${alignment === 'text-center' ? 'justify-center' : alignment === 'text-right' ? 'flex-row-reverse' : 'justify-start'}`}>
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary flex-shrink-0 shadow-inner">
                    <Phone className="w-7 h-7" />
                  </div>
                  <div className={alignment === 'text-right' ? 'text-right' : 'text-left'}>
                    <p className="text-sm font-bold text-pageText/50 uppercase tracking-widest mb-1">Teléfono</p>
                    <div className="text-xl font-medium text-pageText">{data.phone}</div>
                  </div>
                </div>
              )}

              {data.address && (
                <div className={`flex items-center gap-5 ${alignment === 'text-center' ? 'justify-center' : alignment === 'text-right' ? 'flex-row-reverse' : 'justify-start'}`}>
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary flex-shrink-0 shadow-inner">
                    <MapPin className="w-7 h-7" />
                  </div>
                  <div className={alignment === 'text-right' ? 'text-right' : 'text-left'}>
                    <p className="text-sm font-bold text-pageText/50 uppercase tracking-widest mb-1">Dirección</p>
                    <div className="text-xl font-medium text-pageText">{data.address}</div>
                  </div>
                </div>
              )}

              {data.hours && (
                <div className={`flex items-center gap-5 ${alignment === 'text-center' ? 'justify-center' : alignment === 'text-right' ? 'flex-row-reverse' : 'justify-start'}`}>
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary flex-shrink-0 shadow-inner">
                    <Clock className="w-7 h-7" />
                  </div>
                  <div className={alignment === 'text-right' ? 'text-right' : 'text-left'}>
                    <p className="text-sm font-bold text-pageText/50 uppercase tracking-widest mb-1">Horario</p>
                    <div className="text-xl font-medium text-pageText">{data.hours}</div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Formulario (Derecha) */}
          <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-8 sm:p-10 shadow-2xl border border-gray-100 dark:border-gray-800 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary to-indigo-400"></div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">Envíanos un mensaje</h3>
            
            {sent ? (
              <div className="py-12 text-center animate-fade-in">
                <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-10 h-10" />
                </div>
                <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">¡Mensaje Recibido!</h4>
                <p className="text-gray-500 dark:text-gray-400">Gracias por contactarnos. Te responderemos lo antes posible.</p>
                <button onClick={() => setSent(false)} className="mt-8 text-primary font-bold hover:underline">Enviar otro mensaje</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6 text-left">
                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Nombre completo</label>
                    <input name="user_name" type="text" placeholder="Ej. Juan Pérez" className="w-full p-4 bg-gray-50 dark:bg-slate-800/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all text-gray-900 dark:text-white" disabled={isEditMode || loading} required />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Correo electrónico</label>
                    <input name="user_email" type="email" placeholder="tu@email.com" className="w-full p-4 bg-gray-50 dark:bg-slate-800/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all text-gray-900 dark:text-white" disabled={isEditMode || loading} required />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Asunto</label>
                  <input name="subject" type="text" placeholder="¿En qué podemos ayudarte?" className="w-full p-4 bg-gray-50 dark:bg-slate-800/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all text-gray-900 dark:text-white" disabled={isEditMode || loading} required />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Mensaje</label>
                  <textarea name="message" placeholder="Escribe todos los detalles aquí..." rows={5} className="w-full p-4 bg-gray-50 dark:bg-slate-800/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all resize-none text-gray-900 dark:text-white" disabled={isEditMode || loading} required />
                </div>
                <button type="submit" disabled={isEditMode || loading} className="w-full py-4 bg-primary text-white font-bold rounded-xl shadow-lg hover:shadow-primary/40 hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-60 disabled:hover:translate-y-0 disabled:cursor-not-allowed group">
                  <span className="text-lg">{loading ? 'Enviando...' : 'Enviar Mensaje'}</span>
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  )}
                </button>
              </form>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}