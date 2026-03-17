export type TextAlignment = 'left' | 'center' | 'right';
export type FontFamily = 'font-sans' | 'font-serif' | 'font-display' | 'font-mono';
export type TemplateCategory = 'building' | 'infrastructure';

export interface TextLayer {
  id: string;
  label: string; // The label shown in the editor
  defaultValue: string;
  prefix?: string; // Automatically prepended text (e.g. "销售：")
  x: number; // Percentage 0-100
  y: number; // Percentage 0-100
  fontSize: number; // px based on a base width (e.g. 1080px)
  color: string;
  fontFamily: FontFamily;
  align: TextAlignment;
  fontWeight?: 'normal' | 'bold';
  fontStyle?: 'normal' | 'italic';
  uppercase?: boolean;
  maxWidth?: number; // Percentage
  letterSpacing?: number; // px
  editable?: boolean; // If false, hidden from editor
}

export interface Template {
  id: string;
  category: TemplateCategory;
  name: string;
  description: string;
  backgroundImage: string; // URL
  width: number; // Intended export width
  height: number; // Intended export height
  layers: TextLayer[];
}

export interface GeneratedContent {
  [key: string]: string;
}