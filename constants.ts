import { Template, TextLayer } from './types';

// NOTE: Replace these with your local image paths for production.
// Example: "/assets/images/building-blue-bg.jpg"
const BG_BASE = "https://picsum.photos/1080/1920?random=";

// --- LAYOUT CONFIGURATION ---

const LAYOUT_CONFIG = {
  region: { x: 12, y: 35.8, fontSize: 60, align: 'left' as const },
  line1:  { x: 13.5, y: 41.8, fontSize: 38, align: 'left' as const }, // Sales
  line2:  { x: 13.5, y: 47.2, fontSize: 38, align: 'left' as const }, // Service
  label:  { x: 12, y: 53.0, fontSize: 50, align: 'left' as const }, // 营收/合同 Title
  amount: { x: 50, y: 60.0, fontSize: 180, align: 'center' as const },
  unit:   { x: 80, y: 64.5, fontSize: 45, align: 'left' as const },
};

// Theme colors matching the provided images
const COLORS = {
  blueText: '#0047AB',    
  purpleText: '#5B2C6F',  
  greenText: '#006400',   
  white: '#FFFFFF',
};

const createLayers = (
  themeColor: string, 
  typeLabel: string, 
  regionDefault: string,
  amountDefault: string
): TextLayer[] => [
  { 
    id: 'region', 
    label: '区域名称', 
    defaultValue: regionDefault, 
    x: LAYOUT_CONFIG.region.x, 
    y: LAYOUT_CONFIG.region.y, 
    fontSize: LAYOUT_CONFIG.region.fontSize, 
    color: COLORS.white, 
    fontFamily: 'font-sans', 
    align: LAYOUT_CONFIG.region.align, 
    fontWeight: 'bold',
    editable: true
  },
  { 
    id: 'sales_names', 
    label: '销售人员', 
    prefix: '销售：',
    defaultValue: '游阿龙  蒋梅莹', 
    x: LAYOUT_CONFIG.line1.x, 
    y: LAYOUT_CONFIG.line1.y, 
    fontSize: LAYOUT_CONFIG.line1.fontSize, 
    color: themeColor, 
    fontFamily: 'font-sans', 
    align: LAYOUT_CONFIG.line1.align, 
    fontWeight: 'bold',
    editable: true
  },
  { 
    id: 'service_names', 
    label: '服务人员', 
    prefix: '服务：',
    defaultValue: '邢立波', 
    x: LAYOUT_CONFIG.line2.x, 
    y: LAYOUT_CONFIG.line2.y, 
    fontSize: LAYOUT_CONFIG.line2.fontSize, 
    color: themeColor, 
    fontFamily: 'font-sans', 
    align: LAYOUT_CONFIG.line2.align, 
    fontWeight: 'bold',
    editable: true
  },
  { 
    id: 'typeLabel', 
    label: '类型', 
    defaultValue: typeLabel, 
    x: LAYOUT_CONFIG.label.x, 
    y: LAYOUT_CONFIG.label.y, 
    fontSize: LAYOUT_CONFIG.label.fontSize, 
    color: COLORS.white, 
    fontFamily: 'font-sans', 
    align: LAYOUT_CONFIG.label.align, 
    fontWeight: 'bold', 
    fontStyle: 'italic',
    editable: false 
  },
  { 
    id: 'amount', 
    label: '金额数值', 
    defaultValue: amountDefault, 
    x: LAYOUT_CONFIG.amount.x, 
    y: LAYOUT_CONFIG.amount.y, 
    fontSize: LAYOUT_CONFIG.amount.fontSize, 
    color: COLORS.white, 
    fontFamily: 'font-display', 
    align: LAYOUT_CONFIG.amount.align, 
    fontWeight: 'bold', 
    letterSpacing: 2,
    editable: true
  },
  { 
    id: 'unit', 
    label: '单位', 
    defaultValue: '元', 
    x: LAYOUT_CONFIG.unit.x, 
    y: LAYOUT_CONFIG.unit.y, 
    fontSize: LAYOUT_CONFIG.unit.fontSize, 
    color: COLORS.white, 
    fontFamily: 'font-sans', 
    align: LAYOUT_CONFIG.unit.align,
    editable: false
  },
];

export const TEMPLATES: Template[] = [
  // --- 房建版 (Building) ---
  {
    id: 'build-blue-revenue',
    category: 'building',
    name: '房建 - 营收 (蓝)',
    description: '蓝色主题',
    backgroundImage: `${BG_BASE}blue`, 
    width: 1080,
    height: 1920,
    layers: createLayers(COLORS.blueText, '营收', '湖北区域', '580,920')
  },
  {
    id: 'build-purple-contract',
    category: 'building',
    name: '房建 - 合同 (紫)',
    description: '紫色主题',
    backgroundImage: `${BG_BASE}purple`, 
    width: 1080,
    height: 1920,
    layers: createLayers(COLORS.purpleText, '合同', '山西区域', '100,000')
  },
  {
    id: 'build-green-actual',
    category: 'building',
    name: '房建 - 实收 (绿)',
    description: '绿色主题',
    backgroundImage: `${BG_BASE}green`, 
    width: 1080,
    height: 1920,
    layers: createLayers(COLORS.greenText, '实收', '湖北区域', '95,808')
  },

  // --- 基建版 (Infrastructure) ---
  {
    id: 'infra-blue-revenue',
    category: 'infrastructure',
    name: '基建 - 营收 (蓝)',
    description: '蓝色主题',
    backgroundImage: `${BG_BASE}infra-blue`, 
    width: 1080,
    height: 1920,
    layers: createLayers(COLORS.blueText, '营收', '湖北区域', '580,920')
  },
  {
    id: 'infra-purple-contract',
    category: 'infrastructure',
    name: '基建 - 合同 (紫)',
    description: '紫色主题',
    backgroundImage: `${BG_BASE}infra-purple`, 
    width: 1080,
    height: 1920,
    layers: createLayers(COLORS.purpleText, '合同', '川渝地区', '100,000')
  },
  {
    id: 'infra-green-actual',
    category: 'infrastructure',
    name: '基建 - 实收 (绿)',
    description: '绿色主题',
    backgroundImage: `${BG_BASE}infra-green`, 
    width: 1080,
    height: 1920,
    layers: createLayers(COLORS.greenText, '实收', '湖北区域', '95,808')
  },
];