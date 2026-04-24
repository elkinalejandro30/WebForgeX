import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import debounce from 'lodash.debounce';
import { useStore } from '../store/useStore';
import { useAuthStore } from '../store/useAuthStore';
import EditorSidebar from '../components/EditorSidebar';
import BlockRenderer from '../components/BlockRenderer';
import { saveProject } from '../firebase/firestore';
import { 
  DndContext, 
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ArrowLeft, Monitor, Smartphone, Eye, Layout, CheckCircle2, Loader2, Settings, GripVertical, Save, AlertCircle, Rocket } from 'lucide-react';

// Sortable Wrapper Component for Sections
const SortableSection = ({ section, activeSectionId, editorMode, siteId, setActiveSectionId, updateSection }: any) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: section.id });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 0,
    position: 'relative' as 'relative',
  };

  const isActive = activeSectionId === section.id;

  return (
    <div 
      ref={setNodeRef} 
      style={style}
      className={`
        relative group/section transition-all duration-300
        ${isActive ? 'ring-2 ring-primary ring-inset z-20 shadow-2xl scale-[1.01]' : 'hover:ring-1 hover:ring-primary/30'} 
        ${editorMode === 'edit' ? 'cursor-default' : ''}
        ${isDragging ? 'opacity-40 ring-4 ring-primary shadow-2xl' : ''}
      `}
      onClick={(e) => {
        if (editorMode === 'edit') {
          e.stopPropagation();
          setActiveSectionId(section.id);
        }
      }}
    >
      {editorMode === 'edit' && (
        <>
          {/* Drag Handle */}
          <div 
            {...attributes} 
            {...listeners}
            className={`
              absolute -left-12 top-1/2 -translate-y-1/2 opacity-0 group-hover/section:opacity-100 transition-all duration-200
              bg-white dark:bg-slate-800 p-2 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 
              cursor-grab active:cursor-grabbing z-30 hover:scale-110 active:scale-95
              hidden lg:flex
            `}
            title="Arrastrar para reordenar"
          >
            <GripVertical className="w-5 h-5 text-primary" />
          </div>

          {/* Inline Selection Indicator */}
          {isActive && (
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest z-30 shadow-lg shadow-primary/20">
              Sección: {section.type}
            </div>
          )}

          {/* Overlay for selection when not active but hovered */}
          {!isActive && (
            <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover/section:opacity-100 pointer-events-none transition-opacity z-10" />
          )}
        </>
      )}
      
      <BlockRenderer 
        section={section} 
        isEditMode={editorMode === 'edit'}
        onUpdate={(data) => updateSection(siteId, section.id, data)}
      />
    </div>
  );
};

export default function Editor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { 
    sites, updateSiteTheme, addSection, removeSection, updateSection, 
    updateSectionStyle, updateSite, duplicateSection, reorderSections,
    savingStatus, setSavingStatus, hasUnsavedChanges, setHasUnsavedChanges, lastSaved,
    togglePublishSite
  } = useStore();
  const user = useAuthStore(state => state.user);
  const site = sites.find(s => s.id === id);
  const [activeTab, setActiveTab] = useState<'content' | 'design' | 'config'>('content');
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null);
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [editorMode, setEditorMode] = useState<'edit' | 'preview'>('edit');
  const [showGuide, setShowGuide] = useState(true);
  const [isPublishing, setIsPublishing] = useState(false);
  const [showPublishModal, setShowPublishModal] = useState(false);

  // Drag and Drop Sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (site && over && active.id !== over.id) {
      const oldIndex = site.sections.findIndex(s => s.id === active.id);
      const newIndex = site.sections.findIndex(s => s.id === over.id);
      reorderSections(site.id, oldIndex, newIndex);
    }
  };

  // Refs for change detection
  const lastSavedDataRef = useRef<string>('');

  // Initial data snapshot
  useEffect(() => {
    if (site && !lastSavedDataRef.current) {
      lastSavedDataRef.current = JSON.stringify({
        sections: site.sections,
        theme: site.theme,
        name: site.name
      });
    }
  }, [site]);

  const handleSave = async (isManual = false) => {
    if (!site || !user?.uid) return;
    
    // Si no es manual, verificar si hay cambios reales
    const currentData = JSON.stringify({
      sections: site.sections,
      theme: site.theme,
      name: site.name
    });

    if (!isManual && currentData === lastSavedDataRef.current) {
      return;
    }

    setSavingStatus('saving');
    try {
      // Guardado ligero (solo metadatos) en Firestore
      await saveProject(site, user.uid, false);
      
      lastSavedDataRef.current = currentData;
      setSavingStatus('saved');
      setHasUnsavedChanges(false);
      if (isManual) toast.success('Progreso guardado (Cloud Sync)');
      setTimeout(() => setSavingStatus('idle'), 3000);
    } catch (error) {
      setSavingStatus('error');
      console.error("Save failed:", error);
      toast.error('Error al sincronizar con la nube');
    }
  };

  const handlePublish = async () => {
    if (!site || !user?.uid) return;
    
    setIsPublishing(true);
    const toastId = toast.loading('Publicando sitio...');
    
    try {
      // Guardado completo en Firestore
      await saveProject(site, user.uid, true);
      togglePublishSite(site.id);
      
      toast.success('¡Sitio publicado con éxito!', { id: toastId });
      setHasUnsavedChanges(false);
      setShowPublishModal(true);
    } catch (error) {
      console.error("Publish failed:", error);
      toast.error('Error al publicar el sitio', { id: toastId });
    } finally {
      setIsPublishing(false);
    }
  };

  // Debounced save (Solo ligero)
  const debouncedSave = useCallback(
    debounce(() => handleSave(false), 5000), // Más tiempo para auto-save para ahorrar Firebase
    [site, user?.uid]
  );

  useEffect(() => {
    if (!site) navigate('/dashboard');
  }, [site, navigate]);

  // Detect changes and trigger auto-save (Local is instant via Zustand persist)
  useEffect(() => {
    if (!site || !user?.uid) return;
    
    const currentData = JSON.stringify({
      sections: site.sections,
      theme: site.theme,
      name: site.name
    });

    if (currentData !== lastSavedDataRef.current) {
      setHasUnsavedChanges(true);
      debouncedSave();
    }

    return () => debouncedSave.cancel();
  }, [site, debouncedSave, setHasUnsavedChanges]);

  // Prevent accidental exit
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges]);

  if (!site) return null;

  const sections = site.sections || [];
  const theme = site.theme || { primaryColor: '#2563eb', secondaryColor: '#1e40af', backgroundColor: '#f8fafc', textColor: '#0f172a', fontFamily: 'inter' };
  
  // Theme helpers for preview
  const fontMap: Record<string, string> = {
    'inter': 'font-inter',
    'roboto': 'font-roboto',
    'playfair': 'font-playfair',
    'montserrat': 'font-montserrat',
    'poppins': 'font-poppins'
  };
  const fontClass = fontMap[theme.fontFamily] || 'font-inter';

  return (
    <div className={`flex-1 flex flex-col md:flex-row bg-gray-50 dark:bg-darker transition-colors duration-200 overflow-hidden h-[calc(100vh-4rem)] ${fontClass}`}>
      
      {/* Sidebar Editor */}
      {editorMode === 'edit' && (
      <div className="w-full md:w-80 lg:w-96 bg-white dark:bg-slate-900 border-r border-gray-200 dark:border-gray-800 flex flex-col shadow-xl z-20 flex-shrink-0 h-full transition-all duration-300">
        <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between bg-white dark:bg-slate-900 sticky top-0 z-10">
          <div className="flex items-center space-x-3 flex-1 min-w-0">
            <button onClick={() => navigate('/dashboard')} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors text-gray-500 flex-shrink-0">
              <ArrowLeft className="h-5 w-5" />
            </button>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white truncate" title={site.name}>{site.name}</h2>
          </div>

          <div className="flex items-center justify-center flex-shrink-0 ml-2">
            <div className="flex items-center mr-4 text-[10px] font-bold">
              {savingStatus === 'saving' ? (
                <div className="flex items-center text-amber-500 animate-pulse">
                  <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" />
                  <span>GUARDANDO...</span>
                </div>
              ) : savingStatus === 'saved' ? (
                <div className="flex items-center text-emerald-500">
                  <CheckCircle2 className="h-3.5 w-3.5 mr-1.5" />
                  <span>GUARDADO {lastSaved && `HACE ${Math.floor((new Date().getTime() - lastSaved.getTime()) / 1000)}s`}</span>
                </div>
              ) : hasUnsavedChanges ? (
                <div className="flex items-center text-rose-500">
                  <AlertCircle className="h-3.5 w-3.5 mr-1.5" />
                  <span>CAMBIOS SIN GUARDAR</span>
                </div>
              ) : null}
            </div>

            <button 
              onClick={() => handleSave(true)}
              disabled={savingStatus === 'saving' || !hasUnsavedChanges}
              className={`p-2.5 rounded-xl border transition-all mr-2 ${hasUnsavedChanges ? 'bg-primary/10 border-primary/20 text-primary hover:bg-primary hover:text-white shadow-lg shadow-primary/10' : 'bg-gray-50 dark:bg-slate-800 border-gray-200 dark:border-gray-700 text-gray-400 cursor-not-allowed'}`}
              title="Guardar ahora (Manual)"
            >
              <Save className="h-4 w-4" />
            </button>

            <button 
              onClick={handlePublish}
              disabled={isPublishing}
              className="flex items-center space-x-2 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 px-4 py-2.5 rounded-xl shadow-lg shadow-emerald-600/20 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPublishing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Rocket className="h-4 w-4" />}
              <span className="hidden sm:block">{site.published ? 'Actualizar' : 'Publicar'}</span>
            </button>
          </div>
        </div>

        <div className="flex border-b border-gray-200 dark:border-gray-800">
          <button className={`flex-1 py-3 text-sm font-medium flex items-center justify-center space-x-2 ${activeTab === 'content' ? 'text-primary border-b-2 border-primary' : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'}`} onClick={() => setActiveTab('content')}>
            <Layout className="h-4 w-4" /><span>Bloques</span>
          </button>
          <button className={`flex-1 py-3 text-sm font-medium flex items-center justify-center space-x-2 ${activeTab === 'design' ? 'text-primary border-b-2 border-primary' : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'}`} onClick={() => setActiveTab('design')}>
            <span className="w-4 h-4 rounded-full bg-gradient-to-tr from-primary to-purple-500" /><span>Diseño</span>
          </button>
          <button className={`flex-1 py-3 text-sm font-medium flex items-center justify-center space-x-2 ${activeTab === 'config' ? 'text-primary border-b-2 border-primary' : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'}`} onClick={() => setActiveTab('config')}>
            <Settings className="h-4 w-4" /><span>Config</span>
          </button>
        </div>

        <EditorSidebar 
          site={site}
          activeTab={activeTab}
          activeSectionId={activeSectionId}
          setActiveSectionId={setActiveSectionId}
          onAddSection={(type) => addSection(site.id, { type, data: {} } as any)} // Default data is injected by the component
          onUpdateSection={(sectionId, data) => updateSection(site.id, sectionId, data)}
          onUpdateSectionStyle={(sectionId, style) => updateSectionStyle(site.id, sectionId, style)}
          onRemoveSection={(sectionId) => removeSection(site.id, sectionId)}
          onDuplicateSection={(sectionId) => duplicateSection(site.id, sectionId)}
          onReorderSections={(start, end) => reorderSections(site.id, start, end)}
          onUpdateTheme={(theme) => updateSiteTheme(site.id, theme)}
          onUpdateSite={(updates) => updateSite(site.id, updates)}
        />
      </div>
      )}

      {/* Preview Area */}
      <div className={`flex-1 bg-gray-200 dark:bg-black p-4 sm:p-8 overflow-y-auto relative flex flex-col items-center transition-all duration-300`}>
        
        {/* Guía de Usuario Flotante */}
        {showGuide && editorMode === 'edit' && sections.length > 0 && (
          <div className="absolute bottom-8 right-8 bg-white dark:bg-slate-800 p-4 rounded-xl shadow-2xl border border-primary/20 z-50 max-w-sm animate-fade-in">
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-bold text-primary flex items-center"><CheckCircle2 className="w-4 h-4 mr-1" /> Guía Rápida</h4>
              <button onClick={() => setShowGuide(false)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>
            <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-2 mt-3">
              <li>👉 <strong>Edita el texto</strong> haciendo clic directamente sobre él en la vista previa.</li>
              <li>👉 <strong>Cambia imágenes y botones</strong> desde el panel lateral izquierdo.</li>
              <li>👉 Usa el <strong>Modo Vista Previa</strong> arriba para probar los botones y enlaces.</li>
            </ul>
            <button onClick={() => setShowGuide(false)} className="mt-4 w-full py-2 bg-primary/10 text-primary font-bold rounded-lg hover:bg-primary/20 transition-colors">
              ¡Entendido!
            </button>
          </div>
        )}

        {/* Top Bar: Viewport Toggles & Preview Button */}
        <div className="w-full max-w-5xl flex justify-between items-center mb-8 sticky top-0 z-30 px-4 py-2 bg-gray-50/50 dark:bg-black/50 backdrop-blur-xl rounded-2xl border border-white/10 shadow-sm">
          <div className="flex bg-white dark:bg-slate-900 rounded-xl shadow-inner border border-gray-200 dark:border-gray-800 p-1">
            <button 
              onClick={() => setPreviewMode('desktop')}
              className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-all duration-300 ${previewMode === 'desktop' ? 'bg-primary text-white shadow-lg shadow-primary/30 scale-[1.05]' : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'}`}
            >
              <Monitor className="w-4 h-4" /> <span className="text-xs font-black uppercase tracking-widest hidden sm:block">Desktop</span>
            </button>
            <button 
              onClick={() => setPreviewMode('mobile')}
              className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-all duration-300 ${previewMode === 'mobile' ? 'bg-primary text-white shadow-lg shadow-primary/30 scale-[1.05]' : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'}`}
            >
              <Smartphone className="w-4 h-4" /> <span className="text-xs font-black uppercase tracking-widest hidden sm:block">Mobile</span>
            </button>
          </div>
          
          <div className="flex items-center space-x-3">
            <button 
              onClick={() => {
                setEditorMode(editorMode === 'edit' ? 'preview' : 'edit');
                setActiveSectionId(null);
              }}
              className={`group flex items-center space-x-2 text-[10px] font-black uppercase tracking-[0.2em] px-6 py-3 rounded-xl shadow-sm border transition-all duration-300 ${editorMode === 'preview' ? 'bg-emerald-500 text-white border-emerald-400 hover:bg-emerald-600' : 'text-gray-700 dark:text-gray-200 bg-white dark:bg-slate-900 hover:border-primary border-gray-200 dark:border-gray-800'}`}
            >
              {editorMode === 'edit' ? <Eye className="h-3.5 w-3.5 group-hover:animate-pulse" /> : <Settings className="h-3.5 w-3.5 animate-spin-slow" />}
              <span>{editorMode === 'edit' ? 'Vista Previa' : 'Editor'}</span>
            </button>
            <button 
              onClick={() => window.open(`/preview/${site.id}`, '_blank')}
              className="p-3 text-gray-700 dark:text-gray-200 bg-white dark:bg-slate-900 hover:border-primary border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm transition-all hover:scale-110 active:scale-90"
              title="Abrir en nueva pestaña"
            >
              <Layout className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Live Site Mockup Canvas */}
        <div 
          className={`transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] relative ${previewMode === 'desktop' ? 'w-full max-w-6xl' : 'w-full max-w-[420px] pt-12 pb-12'}`}
          style={{
            '--color-primary': theme.primaryColor,
            '--color-secondary': theme.secondaryColor,
            '--color-bg': theme.backgroundColor,
            '--color-text': theme.textColor
          } as React.CSSProperties}
        >
          {/* Mobile Frame Decoration */}
          {previewMode === 'mobile' && (
            <div className="absolute inset-0 bg-slate-900 rounded-[3.5rem] shadow-[0_0_0_12px_#1e293b,0_20px_50px_rgba(0,0,0,0.5)] pointer-events-none z-0">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-slate-900 rounded-b-3xl z-10 flex items-center justify-center space-x-2">
                <div className="w-8 h-1 bg-slate-800 rounded-full"></div>
                <div className="w-2 h-2 bg-slate-800 rounded-full"></div>
              </div>
            </div>
          )}

          {/* Browser Top Bar (Desktop Only) */}
          {previewMode === 'desktop' && (
            <div className="bg-white dark:bg-slate-900 rounded-t-2xl border-t border-l border-r border-gray-300 dark:border-gray-800 flex items-center px-6 py-3 space-x-3 shadow-sm relative z-10">
              <div className="flex space-x-1.5">
                <div className="w-3 h-3 rounded-full bg-[#FF5F56] shadow-inner"></div>
                <div className="w-3 h-3 rounded-full bg-[#FFBD2E] shadow-inner"></div>
                <div className="w-3 h-3 rounded-full bg-[#27C93F] shadow-inner"></div>
              </div>
              <div className="flex-1 max-w-md mx-auto bg-gray-100 dark:bg-slate-800 rounded-lg text-center text-[10px] font-bold py-1.5 text-gray-400 truncate px-4 font-mono border border-gray-200 dark:border-gray-700/50 uppercase tracking-widest">
                {site.name.toLowerCase().replace(/\s+/g, '-')}.webforgex.com
              </div>
            </div>
          )}

          <div className={`
            bg-pageBg text-pageText shadow-2xl overflow-y-auto overflow-x-hidden border-x border-b border-gray-300 dark:border-gray-800 flex flex-col transition-all duration-700 relative z-10
            ${previewMode === 'mobile' ? 'w-[375px] mx-auto h-[750px] rounded-[2.5rem] scrollbar-hide' : 'w-full min-h-[700px] rounded-b-2xl'}
          `}>
            
            {/* Mock Navbar */}
            <div className="h-16 border-b border-gray-100 px-6 sm:px-8 flex items-center justify-between bg-pageBg text-pageText z-10 relative">
              <div 
                className={`font-bold text-xl tracking-tight text-primary truncate ${editorMode === 'preview' ? 'cursor-pointer' : ''}`}
                onClick={() => editorMode === 'preview' && document.querySelector('.bg-pageBg')?.scrollTo({ top: 0, behavior: 'smooth' })}
              >
                {site.name}
              </div>
              <div className={`${previewMode === 'mobile' ? 'hidden' : 'hidden sm:flex'} space-x-6 text-sm font-medium text-gray-500`}>
                {sections.filter(s => s.type !== 'footer').map(sec => (
                  <span 
                    key={`nav-${sec.id}`}
                    className={`hover:text-gray-900 capitalize ${editorMode === 'preview' ? 'cursor-pointer' : ''}`}
                    onClick={() => {
                      if (editorMode === 'preview') {
                        document.getElementById(sec.id)?.scrollIntoView({ behavior: 'smooth' });
                      }
                    }}
                  >
                    {((sec.data as any).title) || sec.type}
                  </span>
                ))}
              </div>
              {previewMode === 'mobile' && (
                <div className="space-y-1.5 cursor-pointer p-2">
                  <div className="w-6 h-0.5 bg-gray-600"></div>
                  <div className="w-6 h-0.5 bg-gray-600"></div>
                  <div className="w-6 h-0.5 bg-gray-600"></div>
                </div>
              )}
            </div>

            {/* Dynamic Sections */}
            <div className="flex-1 bg-white">
              {sections.length === 0 ? (
                <div className="flex items-center justify-center h-full min-h-[400px] text-gray-400 flex-col px-4 text-center">
                  <Layout className="w-16 h-16 mb-4 opacity-30" />
                  <p>El sitio está vacío.</p>
                </div>
              ) : (
                <div className="bg-pageBg min-h-full">
                  <DndContext 
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                  >
                    <SortableContext items={sections.map(s => s.id)} strategy={verticalListSortingStrategy}>
                      {sections.map((section) => (
                        <SortableSection 
                          key={section.id} 
                          section={section} 
                          activeSectionId={activeSectionId}
                          editorMode={editorMode}
                          siteId={site.id}
                          setActiveSectionId={setActiveSectionId}
                          updateSection={updateSection}
                        />
                      ))}
                    </SortableContext>
                  </DndContext>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Publicación */}
      {showPublishModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] w-full max-w-lg p-8 md:p-10 shadow-2xl border border-gray-100 dark:border-gray-800 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-400 to-primary"></div>
            
            <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Rocket className="w-10 h-10" />
            </div>

            <h3 className="text-3xl font-black text-gray-900 dark:text-white mb-2 uppercase tracking-tighter">¡Sitio Publicado!</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-8 font-medium">Tu sitio ya está disponible para todo el mundo en la siguiente dirección:</p>

            <div className="bg-gray-50 dark:bg-slate-800 p-4 rounded-2xl border border-gray-200 dark:border-gray-700 mb-8 flex items-center justify-between group">
              <span className="text-sm font-mono text-gray-600 dark:text-gray-300 truncate mr-4">
                {`${window.location.origin}/WebForgeX/site/${site.id}`}
              </span>
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(`${window.location.origin}/WebForgeX/site/${site.id}`);
                  toast.success('¡Enlace copiado!');
                }}
                className="p-2 hover:bg-white dark:hover:bg-slate-700 rounded-lg transition-colors text-primary"
                title="Copiar enlace"
              >
                <Layout className="w-5 h-5" />
              </button>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={() => window.open(`/WebForgeX/site/${site.id}`, '_blank')}
                className="flex-1 py-4 bg-primary text-white font-black rounded-2xl shadow-xl shadow-primary/20 hover:-translate-y-1 transition-all active:scale-95 uppercase tracking-widest text-xs"
              >
                Abrir sitio
              </button>
              <button 
                onClick={() => setShowPublishModal(false)}
                className="flex-1 py-4 bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-300 font-black rounded-2xl hover:bg-gray-200 dark:hover:bg-slate-700 transition-all active:scale-95 uppercase tracking-widest text-xs"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
