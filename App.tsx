import React, { useState, useRef, useMemo } from 'react';
import html2canvas from 'html2canvas';
import { TEMPLATES } from './constants';
import { Template, TemplateCategory } from './types';
import { TemplateSelector } from './components/TemplateSelector';
import { PosterCanvas } from './components/PosterCanvas';
import { EditorPanel } from './components/EditorPanel';
import { Layout, Building2, HardHat } from 'lucide-react';

const App: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<TemplateCategory>('building');
  
  // Filter templates based on category
  const categoryTemplates = useMemo(() => 
    TEMPLATES.filter(t => t.category === activeCategory), 
  [activeCategory]);

  const [selectedTemplate, setSelectedTemplate] = useState<Template>(categoryTemplates[0]);
  const [customValues, setCustomValues] = useState<Record<string, string>>({});
  
  const posterRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // When tab changes, reset selection to first of that category
  const handleCategoryChange = (cat: TemplateCategory) => {
    setActiveCategory(cat);
    const firstInCat = TEMPLATES.find(t => t.category === cat);
    if (firstInCat) {
      setSelectedTemplate(firstInCat);
      setCustomValues({});
    }
  };

  const handleTemplateSelect = (template: Template) => {
    setSelectedTemplate(template);
    setCustomValues({});
  };

  const handleValueChange = (id: string, val: string) => {
    setCustomValues(prev => ({ ...prev, [id]: val }));
  };

  const handleReset = () => {
    setCustomValues({});
  };

  const handleDownload = async () => {
    if (!posterRef.current) return;

    try {
      await document.fonts.ready;

      const canvas = await html2canvas(posterRef.current, {
        useCORS: true,
        scale: 1, 
        backgroundColor: null, 
        logging: false,
      });

      const image = canvas.toDataURL("image/png", 1.0);
      const link = document.createElement("a");
      link.href = image;
      link.download = `PMSmart-${selectedTemplate.name}-${Date.now()}.png`;
      link.click();
    } catch (err) {
      console.error("Download failed:", err);
      alert("下载失败，请确保本地图片加载正常。");
    }
  };

  const PREVIEW_SCALE = 0.35; 

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-primary/30">
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-tr from-blue-600 to-cyan-500 p-2 rounded-lg shadow-lg shadow-blue-900/20">
              <Layout size={24} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white">PMSmart <span className="text-blue-400 font-light">捷报助手</span></h1>
          </div>
          <div className="text-xs text-slate-500 font-mono">v2.1 Local</div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        
        {/* Category Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-slate-900 p-1 rounded-xl border border-slate-800 inline-flex shadow-inner">
            <button
              onClick={() => handleCategoryChange('building')}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-medium transition-all ${
                activeCategory === 'building' 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/30' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Building2 size={18} />
              房建版
            </button>
            <button
              onClick={() => handleCategoryChange('infrastructure')}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-medium transition-all ${
                activeCategory === 'infrastructure' 
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/30' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <HardHat size={18} />
              基建版
            </button>
          </div>
        </div>

        {/* Template Gallery */}
        <section className="mb-8">
          <h2 className="text-sm font-semibold text-slate-400 mb-4 px-2 uppercase tracking-wider">选择版式 ({categoryTemplates.length})</h2>
          <TemplateSelector 
            selectedId={selectedTemplate.id}
            onSelect={handleTemplateSelect}
          />
        </section>

        {/* Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-[850px]">
          
          {/* Left: Editor Controls */}
          <div className="lg:col-span-4 h-full">
            <EditorPanel 
              template={selectedTemplate}
              values={customValues}
              onChange={handleValueChange}
              onDownload={handleDownload}
              onReset={handleReset}
            />
          </div>

          {/* Right: Live Preview */}
          <div 
            ref={containerRef}
            className="lg:col-span-8 bg-slate-900/50 rounded-xl border-2 border-dashed border-slate-800 flex items-center justify-center overflow-hidden relative group"
          >
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-800/10 via-slate-950/0 to-slate-950/0 pointer-events-none" />
            
            {/* The Canvas itself */}
            <div className="relative z-10 transition-transform duration-300 shadow-2xl">
               <PosterCanvas 
                 ref={posterRef}
                 template={selectedTemplate}
                 values={customValues}
                 scale={PREVIEW_SCALE}
               />
            </div>
            
            <div className="absolute bottom-4 left-0 right-0 text-center text-slate-500 text-xs pointer-events-none opacity-60">
               预览模式 ({(PREVIEW_SCALE * 100).toFixed(0)}%)
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default App;