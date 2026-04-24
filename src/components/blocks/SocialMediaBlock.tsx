import { 
  FaFacebook, 
  FaInstagram, 
  FaWhatsapp, 
  FaTiktok, 
  FaLinkedin, 
  FaTwitter,
  FaYoutube,
  FaGithub,
  FaGlobe
} from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import { SocialData } from '../../store/useStore';

const iconMap: Record<string, any> = {
  facebook: FaFacebook,
  instagram: FaInstagram,
  whatsapp: FaWhatsapp,
  tiktok: FaTiktok,
  linkedin: FaLinkedin,
  twitter: FaTwitter,
  x: FaXTwitter,
  youtube: FaYoutube,
  github: FaGithub,
  other: FaGlobe
};

interface SocialMediaBlockProps {
  id: string;
  data: SocialData;
  isEditMode?: boolean;
  padding?: string;
  alignment?: string;
  bgClass?: string;
}

export default function SocialMediaBlock({ id, data, isEditMode, padding, alignment, bgClass }: SocialMediaBlockProps) {
  const { title, layout = 'horizontal', iconSize = 24, items = [] } = data;
  const activeItems = items.filter(item => item.active);

  const containerClasses = {
    horizontal: `flex flex-wrap ${alignment === 'text-left' ? 'justify-start' : alignment === 'text-right' ? 'justify-end' : 'justify-center'} gap-6`,
    vertical: `flex flex-col ${alignment === 'text-left' ? 'items-start' : alignment === 'text-right' ? 'items-end' : 'items-center'} gap-4`,
    grid: 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 justify-items-center'
  };

  return (
    <div id={id} className={`${padding} ${bgClass} transition-all duration-500`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {title && (
          <h2 className={`text-3xl md:text-4xl font-black text-gray-900 dark:text-white mb-12 ${alignment} uppercase tracking-tight`}>
            {title}
          </h2>
        )}
        
        <div className={containerClasses[layout]}>
          {activeItems.map((item, idx) => {
            const Icon = iconMap[item.platform.toLowerCase()] || iconMap.other;
            
            return (
              <a
                key={`${item.platform}-${idx}`}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`
                  group flex items-center justify-center p-4 rounded-full
                  bg-white dark:bg-slate-800 shadow-sm border border-gray-100 dark:border-gray-700
                  hover:shadow-2xl hover:-translate-y-2 hover:bg-primary hover:border-primary transition-all duration-300 ease-out
                  ${isEditMode ? 'pointer-events-none' : ''}
                `}
                title={item.platform}
              >
                <Icon 
                  size={iconSize} 
                  className="text-gray-600 dark:text-gray-400 group-hover:text-white transition-colors" 
                />
                {layout === 'vertical' && (
                  <span className="ml-3 font-bold text-gray-700 dark:text-gray-200 group-hover:text-white capitalize">
                    {item.platform}
                  </span>
                )}
              </a>
            );
          })}
          
          {activeItems.length === 0 && isEditMode && (
            <div className="text-gray-400 italic text-sm p-12 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-3xl w-full text-center">
              Configura tus redes sociales en el panel lateral para que aparezcan aquí.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
