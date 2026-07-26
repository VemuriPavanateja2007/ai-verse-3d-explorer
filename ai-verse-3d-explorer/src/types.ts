export type ConceptCategory = 'dnn' | 'cnn' | 'transformer' | 'llm' | 'custom';

export interface MathFormula {
  title: string;
  expression: string;
  description: string;
}

export interface NodeDetail {
  id: string;
  name: string;
  type: string;
  layerIndex: number;
  activation?: string;
  value?: number;
  weight?: number;
  bias?: number;
  gradient?: number;
  description: string;
}

export interface LayerSpec {
  id: string;
  name: string;
  role: string;
  nodesCount: number;
  dimensions?: string;
  activationFunction?: string;
  description: string;
  details?: string[];
}

export interface TokenAttentionNode {
  id: string;
  token: string;
  position: number;
  attentionScore: number;
  connections: { targetTokenId: string; weight: number; head: number }[];
}

export interface ConceptData {
  id: string;
  title: string;
  subtitle: string;
  category: ConceptCategory;
  summary: string;
  badge: string;
  architectureBreakdown: LayerSpec[];
  mathFormulas: MathFormula[];
  keyHighlights: string[];
  parameters: {
    label: string;
    key: string;
    value: number;
    min: number;
    max: number;
    step: number;
    unit?: string;
  }[];
  tokens?: string[];
  attentionMatrix?: number[][][]; // [head][i][j]
}

export interface ViewportSettings {
  showWireframe: boolean;
  animating: boolean;
  animationSpeed: number;
  explodeDistance: number;
  selectedHead: number; // for Transformers (0 = all)
  backpropActive: boolean;
  activeLayerIndex: number | null;
  selectedNodeId: string | null;
  cameraPreset: 'perspective' | 'top' | 'front' | 'side';
}

export type AppStage = 'landing' | 'prompt' | 'workspace';
