import React from 'react';
import { TEMPLATES } from '../constants';
import { Template } from '../types';
import { CheckCircle } from 'lucide-react';

interface Props {
  selectedId: string;
  onSelect: (t: Template) => void;
}

export const TemplateSelector: React.FC<Props> = ({ selectedId, onSelect }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
      {TEMPLATES.map((template) => {
        const isSelected = selectedId === template.id;
        return (
          <button
            key={template.id}
            onClick={() => onSelect(template)}
            className={`group relative aspect-[9/16] rounded-lg overflow-hidden border-2 transition-all duration-300 focus:outline-none ${
              isSelected ? 'border-primary ring-2 ring-primary/50 ring-offset-2 ring-offset-slate-900' : 'border-transparent hover:border-slate-500'
            }`}
          >
            <img 
              src={template.backgroundImage} 
              alt={template.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              crossOrigin="anonymous"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-60" />
            
            <div className="absolute bottom-0 left-0 right-0 p-3 text-left">
              <p className="text-white text-xs font-bold truncate">{template.name}</p>
              <p className="text-slate-300 text-[10px] truncate">{template.layers.length} Fields</p>
            </div>

            {isSelected && (
              <div className="absolute top-2 right-2 text-primary bg-white rounded-full">
                <CheckCircle size={20} fill="currentColor" className="text-primary bg-white rounded-full" />
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
};
