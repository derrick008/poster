import React, { forwardRef } from 'react';
import { Template } from '../types';

interface Props {
  template: Template;
  values: Record<string, string>;
  scale?: number;
}

export const PosterCanvas = forwardRef<HTMLDivElement, Props>(
  ({ template, values, scale = 1 }, ref) => {
    
    // We render at the defined width/height, then scale down using CSS transform
    const style: React.CSSProperties = {
      width: `${template.width}px`,
      height: `${template.height}px`,
      transform: `scale(${scale})`,
      transformOrigin: 'top center',
      position: 'relative',
      overflow: 'hidden',
      backgroundColor: '#000',
    };

    return (
      <div 
        ref={ref} 
        style={style} 
        className="shadow-2xl shadow-black/50 mx-auto bg-slate-900"
        id="poster-canvas"
      >
        {/* Background Layer */}
        <img
          src={template.backgroundImage}
          alt="background"
          className="absolute inset-0 w-full h-full object-cover"
          crossOrigin="anonymous"
        />
        
        {/* Text Layers */}
        {template.layers.map((layer) => {
          const rawValue = values[layer.id] ?? layer.defaultValue;
          // Combine prefix with value (e.g. "销售：" + "张三")
          const text = (layer.prefix || '') + rawValue;
          
          const layerStyle: React.CSSProperties = {
            position: 'absolute',
            left: `${layer.x}%`,
            top: `${layer.y}%`,
            transform: layer.align === 'center' ? 'translateX(-50%)' : layer.align === 'right' ? 'translateX(-100%)' : 'none',
            fontSize: `${layer.fontSize}px`,
            color: layer.color,
            textAlign: layer.align,
            whiteSpace: 'pre-wrap',
            maxWidth: layer.maxWidth ? `${layer.maxWidth}%` : '90%',
            lineHeight: 1.2,
            letterSpacing: layer.letterSpacing ? `${layer.letterSpacing}px` : '0px',
            fontStyle: layer.fontStyle || 'normal',
            zIndex: 10,
            textShadow: '0px 2px 4px rgba(0,0,0,0.1)' // Subtle shadow
          };

          return (
            <div 
              key={layer.id} 
              style={layerStyle}
              className={`${layer.fontFamily} ${layer.fontWeight === 'bold' ? 'font-bold' : 'font-normal'} ${layer.uppercase ? 'uppercase' : ''}`}
            >
              {text}
            </div>
          );
        })}
      </div>
    );
  }
);

PosterCanvas.displayName = 'PosterCanvas';