import React from 'react';
import { Template } from '../types';
import { Download, RotateCcw } from 'lucide-react';

interface Props {
  template: Template;
  values: Record<string, string>;
  onChange: (id: string, val: string) => void;
  onDownload: () => void;
  onReset: () => void;
}

export const EditorPanel: React.FC<Props> = ({ 
  template, 
  values, 
  onChange, 
  onDownload,
  onReset,
}) => {
  return (
    <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 h-full flex flex-col shadow-xl">
      <div className="flex items-center justify-between mb-6 border-b border-slate-700 pb-4">
        <div>
          <h2 className="text-xl font-bold text-white">{template.name}</h2>
          <p className="text-slate-400 text-sm">编辑下方捷报内容</p>
        </div>
        <button 
          onClick={onReset}
          className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-full transition-colors"
          title="重置内容"
        >
          <RotateCcw size={18} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 space-y-6 custom-scrollbar">
        {template.layers.map((layer) => {
          // Skip non-editable layers
          if (layer.editable === false) return null;

          return (
            <div key={layer.id} className="space-y-2">
              <label className="block text-sm font-semibold text-slate-300">
                {layer.label}
              </label>
              {layer.id === 'amount' ? (
                <div className="relative">
                  <input
                    type="text"
                    value={values[layer.id] ?? layer.defaultValue}
                    onChange={(e) => onChange(layer.id, e.target.value)}
                    className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-3 text-2xl font-display text-yellow-400 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder-slate-600"
                    placeholder="请输入金额"
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 font-sans">
                    元
                  </div>
                </div>
              ) : (
                <input
                  type="text"
                  value={values[layer.id] ?? layer.defaultValue}
                  onChange={(e) => onChange(layer.id, e.target.value)}
                  className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                  placeholder={layer.defaultValue}
                />
              )}
            </div>
          );
        })}
      </div>

      <div className="pt-6 mt-6 border-t border-slate-700 space-y-3">
        <button
          onClick={onDownload}
          className="w-full flex items-center justify-center gap-2 py-4 px-4 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg transition-all shadow-lg shadow-blue-900/20 text-lg"
        >
          <Download size={22} />
          下载捷报海报
        </button>
      </div>
    </div>
  );
};