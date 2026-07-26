import { useState, useRef } from 'react';
import { PRESET_CONCEPTS } from './data/presets';
import { ConceptData, ViewportSettings, AppStage, ConceptCategory, NodeDetail, LayerSpec } from './types';
import { generateConceptPDF } from './utils/pdfGenerator';
import { LandingScreen } from './components/ui/LandingScreen';
import { ConceptPromptScreen } from './components/ui/ConceptPromptScreen';
import { TopNav } from './components/ui/TopNav';
import { RightSidebar } from './components/ui/RightSidebar';
import { GestureGuideModal } from './components/ui/GestureGuideModal';
import { CanvasWrapper } from './components/3d/CanvasWrapper';

export default function App() {
  const [stage, setStage] = useState<AppStage>('landing');
  const [activeConcept, setActiveConcept] = useState<ConceptData>(PRESET_CONCEPTS.dnn);
  const [isLoadingCustom, setIsLoadingCustom] = useState(false);
  const [isGestureGuideOpen, setIsGestureGuideOpen] = useState(false);

  const [selectedNode, setSelectedNode] = useState<NodeDetail | null>(null);
  const [selectedLayerIdx, setSelectedLayerIdx] = useState<number | null>(null);

  const [settings, setSettings] = useState<ViewportSettings>({
    showWireframe: false,
    animating: true,
    animationSpeed: 1.0,
    explodeDistance: 2.2,
    selectedHead: 0,
    backpropActive: false,
    activeLayerIndex: null,
    selectedNodeId: null,
    cameraPreset: 'perspective'
  });

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Handle Preset Category Selection
  const handleSelectPreset = (categoryKey: ConceptCategory) => {
    const preset = PRESET_CONCEPTS[categoryKey] || PRESET_CONCEPTS.dnn;
    setActiveConcept(preset);
    setSelectedNode(null);
    setSelectedLayerIdx(null);
    setSettings(prev => ({
      ...prev,
      selectedNodeId: null,
      activeLayerIndex: null,
      backpropActive: false,
      selectedHead: 0
    }));
    setStage('workspace');
  };

  // Handle Custom AI Concept Submission via Express API endpoint /api/explain
  const handleGenerateCustom = async (prompt: string) => {
    setIsLoadingCustom(true);
    try {
      const response = await fetch('/api/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      });

      if (!response.ok) {
        throw new Error('API server returned error');
      }

      const customConcept: ConceptData = await response.json();
      setActiveConcept(customConcept);
      setSelectedNode(null);
      setSelectedLayerIdx(null);
      setSettings(prev => ({
        ...prev,
        selectedNodeId: null,
        activeLayerIndex: null
      }));
      setStage('workspace');
    } catch (err) {
      console.warn('Fallback to local custom generator:', err);
      // Fallback local custom concept
      const fallbackConcept: ConceptData = {
        id: 'custom-' + Date.now(),
        title: prompt,
        subtitle: 'Custom Neural Architecture',
        category: prompt.toLowerCase().includes('vision') || prompt.toLowerCase().includes('cnn') ? 'cnn' :
                  prompt.toLowerCase().includes('attention') || prompt.toLowerCase().includes('transformer') ? 'transformer' :
                  prompt.toLowerCase().includes('llm') || prompt.toLowerCase().includes('gpt') ? 'llm' : 'dnn',
        badge: 'Custom Architecture',
        summary: `3D tactile exploration of ${prompt}. Inspect tensor transformations, node parameters, and non-linear layer activations.`,
        architectureBreakdown: [
          {
            id: 'l-0',
            name: `${prompt} Input Ingestion`,
            role: 'Data Vector Ingestion',
            nodesCount: 12,
            dimensions: '12 x 1',
            description: 'Receives normalized numerical features or token embeddings.'
          },
          {
            id: 'l-1',
            name: 'Core Transformation Layer',
            role: 'Non-Linear Representation',
            nodesCount: 16,
            dimensions: '16 x 16 Matrix',
            activationFunction: 'GELU / SwiGLU',
            description: 'Applies weighted matrix transformations and non-linear activation functions.'
          },
          {
            id: 'l-2',
            name: 'Output Decision Head',
            role: 'Classification & Logits',
            nodesCount: 6,
            dimensions: '6 x 1 Logits',
            activationFunction: 'Softmax',
            description: 'Produces final normalized probability scores across target classes.'
          }
        ],
        mathFormulas: [
          {
            title: 'Primary State Matrix Transformation',
            expression: 'h = \\sigma(W x + b)',
            description: 'Affine transformation combining learnable weight matrix $W$ and bias $b$.'
          }
        ],
        keyHighlights: [
          'Interactive 3D visualization custom-generated for prompt query',
          'Synchronized real-time sidebar layer inspection'
        ],
        parameters: [
          { label: 'Layer Depth Scale', key: 'depthScale', value: 1.5, min: 0.5, max: 3.0, step: 0.1 },
          { label: 'Signal Flow Speed', key: 'flowSpeed', value: 1.0, min: 0.2, max: 2.5, step: 0.1 }
        ]
      };
      setActiveConcept(fallbackConcept);
      setStage('workspace');
    } finally {
      setIsLoadingCustom(false);
    }
  };

  // Handle PDF Download
  const handleDownloadPDF = () => {
    generateConceptPDF(activeConcept, canvasRef.current);
  };

  // Update Concept Parameter Sliders
  const handleUpdateConceptParam = (paramKey: string, newValue: number) => {
    setActiveConcept(prev => ({
      ...prev,
      parameters: prev.parameters.map(p => p.key === paramKey ? { ...p, value: newValue } : p)
    }));
  };

  return (
    <div className="w-screen h-screen bg-slate-950 font-sans overflow-hidden">
      {/* Stage 1: Landing Screen */}
      {stage === 'landing' && (
        <LandingScreen onStartExploring={() => setStage('prompt')} />
      )}

      {/* Stage 2: Concept Prompt Screen */}
      {stage === 'prompt' && (
        <ConceptPromptScreen
          onSelectPreset={handleSelectPreset}
          onGenerateCustom={handleGenerateCustom}
          isLoading={isLoadingCustom}
        />
      )}

      {/* Stage 3: Split-Screen Interactive Workspace */}
      {stage === 'workspace' && (
        <div className="w-full h-full flex flex-col">
          {/* Top Toolbar */}
          <TopNav
            concept={activeConcept}
            settings={settings}
            onUpdateSettings={setSettings}
            onDownloadPDF={handleDownloadPDF}
            onOpenGestureGuide={() => setIsGestureGuideOpen(true)}
            onReturnHome={() => setStage('prompt')}
          />

          {/* Split-Screen Main Container */}
          <div className="flex-1 flex w-full h-[calc(100vh-3.5rem)] overflow-hidden">
            {/* Left 3D Canvas Viewport (70-75% width) */}
            <div className="w-full lg:w-[72%] h-full relative">
              <CanvasWrapper
                concept={activeConcept}
                settings={settings}
                onSelectNode={(node, layerIdx) => {
                  setSelectedNode(node);
                  setSelectedLayerIdx(layerIdx);
                  setSettings(s => ({
                    ...s,
                    selectedNodeId: node ? node.id : null,
                    activeLayerIndex: layerIdx
                  }));
                }}
                onSelectLayer={(layerSpec, idx) => {
                  setSelectedLayerIdx(idx);
                  setSettings(s => ({ ...s, activeLayerIndex: idx }));
                }}
                onCanvasReady={(canvas) => {
                  canvasRef.current = canvas;
                }}
              />

              {/* Viewport Micro Overlay Badge */}
              <div className="absolute bottom-4 left-4 z-10 pointer-events-none">
                <div className="bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-800 text-[10px] text-slate-300 font-mono shadow-xl flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                  <span>3D OrbitControls Active &bull; Left Drag: Rotate | Right Drag: Pan | Scroll: Zoom</span>
                </div>
              </div>
            </div>

            {/* Right Technical Explanation Sidebar (28-30% width) */}
            <div className="hidden lg:block w-[28%] h-full">
              <RightSidebar
                concept={activeConcept}
                settings={settings}
                selectedNode={selectedNode}
                selectedLayerIdx={selectedLayerIdx}
                onUpdateSettings={setSettings}
                onUpdateConceptParam={handleUpdateConceptParam}
                onDownloadPDF={handleDownloadPDF}
              />
            </div>
          </div>
        </div>
      )}

      {/* 3D Navigation & Gesture Guide Modal */}
      <GestureGuideModal
        isOpen={isGestureGuideOpen}
        onClose={() => setIsGestureGuideOpen(false)}
      />
    </div>
  );
}
