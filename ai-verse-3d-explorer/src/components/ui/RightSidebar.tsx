import { useState } from 'react';
import { ConceptData, ViewportSettings, NodeDetail } from '../../types';
import { MathRenderer } from './MathRenderer';
import {
  BookOpen,
  Cpu,
  Layers,
  Calculator,
  Sliders,
  Download,
  Info,
  ChevronRight,
  Zap
} from 'lucide-react';

interface RightSidebarProps {
  concept: ConceptData;
  settings: ViewportSettings;
  selectedNode: NodeDetail | null;
  selectedLayerIdx: number | null;
  onUpdateSettings: (updater: (prev: ViewportSettings) => ViewportSettings) => void;
  onUpdateConceptParam: (paramKey: string, newValue: number) => void;
  onDownloadPDF: () => void;
}

export function RightSidebar({
  concept,
  settings,
  selectedNode,
  selectedLayerIdx,
  onUpdateSettings,
  onUpdateConceptParam,
  onDownloadPDF
}: RightSidebarProps) {
  const [activeTab, setActiveTab] = useState<'summary' | 'architecture' | 'math' | 'params'>('summary');

  return (
    <aside className="w-full h-full bg-slate-900/95 border-l border-slate-800/80 flex flex-col justify-between overflow-hidden shadow-2xl backdrop-blur-xl select-none">
      {/* Sidebar Header & Tab Navigation */}
      <div className="p-4 border-b border-slate-800/80">
        <div className="flex items-center space-x-2.5 mb-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
            <Cpu className="w-4 h-4" />
          </div>
          <div>
            <h2 className="font-bold text-sm text-slate-100 tracking-wide line-clamp-1">
              {concept.title}
            </h2>
            <span className="text-[10px] font-mono text-cyan-400">
              Technical Inspector
            </span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="grid grid-cols-4 gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-medium">
          <button
            onClick={() => setActiveTab('summary')}
            className={`py-1.5 rounded-lg flex items-center justify-center space-x-1 transition-all cursor-pointer ${
              activeTab === 'summary' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
            title="Executive Summary"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span className="hidden xl:inline text-[11px]">Overview</span>
          </button>

          <button
            onClick={() => setActiveTab('architecture')}
            className={`py-1.5 rounded-lg flex items-center justify-center space-x-1 transition-all cursor-pointer ${
              activeTab === 'architecture' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
            title="Layer Architecture"
          >
            <Layers className="w-3.5 h-3.5" />
            <span className="hidden xl:inline text-[11px]">Layers</span>
          </button>

          <button
            onClick={() => setActiveTab('math')}
            className={`py-1.5 rounded-lg flex items-center justify-center space-x-1 transition-all cursor-pointer ${
              activeTab === 'math' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
            title="Mathematical Formulas"
          >
            <Calculator className="w-3.5 h-3.5" />
            <span className="hidden xl:inline text-[11px]">Math</span>
          </button>

          <button
            onClick={() => setActiveTab('params')}
            className={`py-1.5 rounded-lg flex items-center justify-center space-x-1 transition-all cursor-pointer ${
              activeTab === 'params' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
            title="Interactive Hyperparameters"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span className="hidden xl:inline text-[11px]">Params</span>
          </button>
        </div>
      </div>

      {/* Main Tab Content Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
        {/* Dynamic Node / Layer Live Inspector Notification Card if selected */}
        {selectedNode && (
          <div className="p-3 rounded-xl bg-indigo-950/80 border border-indigo-500/50 text-indigo-100 shadow-xl space-y-1.5 animate-fadeIn">
            <div className="flex items-center justify-between">
              <span className="font-bold text-cyan-300 text-xs flex items-center space-x-1">
                <Zap className="w-3.5 h-3.5 text-cyan-400" />
                <span>Active 3D Focused Node</span>
              </span>
              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-indigo-900 border border-indigo-700">
                {selectedNode.type}
              </span>
            </div>
            <div className="font-bold text-sm text-white">{selectedNode.name}</div>
            <div className="text-[11px] text-indigo-200">
              <MathRenderer text={selectedNode.description} />
            </div>
            {selectedNode.activation && (
              <div className="text-[11px] font-mono text-cyan-300 bg-slate-900/80 p-1.5 rounded border border-indigo-800">
                Activation State: <MathRenderer text={selectedNode.activation} />
              </div>
            )}
          </div>
        )}

        {/* TAB 1: CONCEPT SUMMARY */}
        {activeTab === 'summary' && (
          <div className="space-y-4">
            <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-2">
              <div className="flex items-center space-x-1.5 text-indigo-400 font-bold text-xs uppercase tracking-wider">
                <Info className="w-3.5 h-3.5" />
                <span>Core Concept Overview</span>
              </div>
              <div className="text-slate-300 leading-relaxed text-xs">
                <MathRenderer text={concept.summary} />
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-slate-400 font-semibold text-xs tracking-wider uppercase">
                Key Architectural Pillars
              </span>
              <div className="space-y-2">
                {concept.keyHighlights.map((highlight, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-lg bg-slate-950/50 border border-slate-800/60 text-slate-300 flex items-start space-x-2.5"
                  >
                    <ChevronRight className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                    <span className="text-xs leading-normal">
                      <MathRenderer text={highlight} />
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: ARCHITECTURE BREAKDOWN (DETAILED LAYER SPECIFICATIONS) */}
        {activeTab === 'architecture' && (
          <div className="space-y-3">
            <span className="text-slate-400 font-semibold text-xs tracking-wider uppercase">
              Step-by-Step Layer Pipeline
            </span>

            {concept.architectureBreakdown.map((layer, idx) => {
              const isSelected = selectedLayerIdx === idx;
              return (
                <div
                  key={layer.id}
                  className={`p-3.5 rounded-xl border transition-all ${
                    isSelected
                      ? 'bg-indigo-950/90 border-indigo-500 shadow-xl ring-1 ring-indigo-500'
                      : 'bg-slate-950/70 border-slate-800/80 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-bold text-slate-100 text-xs">
                      {idx + 1}. {layer.name}
                    </span>
                    {layer.activationFunction && (
                      <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-slate-900 text-cyan-400 border border-slate-800">
                        <MathRenderer text={layer.activationFunction} />
                      </span>
                    )}
                  </div>

                  <div className="text-[11px] text-indigo-300 font-medium mb-1.5 flex items-center space-x-2 flex-wrap">
                    <span>Role: {layer.role}</span>
                    <span>&bull;</span>
                    <span>Dim: {layer.dimensions || 'N/A'}</span>
                    <span>&bull;</span>
                    <span>Units: {layer.nodesCount}</span>
                  </div>

                  <div className="text-slate-300 text-xs leading-relaxed mb-2">
                    <MathRenderer text={layer.description} />
                  </div>

                  {layer.details && (
                    <ul className="space-y-1.5 text-[11px] text-slate-400 border-t border-slate-800/60 pt-2">
                      {layer.details.map((detail, dIdx) => (
                        <li key={dIdx} className="flex items-start space-x-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0 mt-1" />
                          <span>
                            <MathRenderer text={detail} />
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* TAB 3: MATHEMATICAL INTUITION (KATEX FORMULAS) */}
        {activeTab === 'math' && (
          <div className="space-y-3">
            <span className="text-slate-400 font-semibold text-xs tracking-wider uppercase">
              Mathematical Operations &amp; Formulas
            </span>

            {concept.mathFormulas.map((formula, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2 shadow-lg"
              >
                <div className="font-bold text-indigo-300 text-xs">
                  {formula.title}
                </div>
                
                {/* Properly Rendered KaTeX Block Equation */}
                <div className="p-3 rounded-lg bg-slate-900/90 border border-indigo-900/60 shadow-inner flex justify-center">
                  <MathRenderer math={formula.expression} inline={false} />
                </div>

                <div className="text-slate-400 text-[11px] leading-relaxed">
                  <MathRenderer text={formula.description} />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 4: INTERACTIVE HYPERPARAMETERS & VIEW CONTROLS */}
        {activeTab === 'params' && (
          <div className="space-y-4">
            <span className="text-slate-400 font-semibold text-xs tracking-wider uppercase">
              Interactive Architectural Controls
            </span>

            {/* Concept Specific Sliders */}
            {concept.parameters.map((param) => (
              <div key={param.key} className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-2">
                <div className="flex items-center justify-between font-medium text-xs">
                  <span className="text-slate-200">{param.label}</span>
                  <span className="text-cyan-400 font-mono font-bold">
                    {param.value} {param.unit || ''}
                  </span>
                </div>
                <input
                  type="range"
                  min={param.min}
                  max={param.max}
                  step={param.step}
                  value={param.value}
                  onChange={(e) => onUpdateConceptParam(param.key, parseFloat(e.target.value))}
                  className="w-full accent-indigo-500 bg-slate-800 h-1.5 rounded-lg cursor-pointer"
                />
              </div>
            ))}

            {/* CNN Layer Explode Slider if CNN */}
            {concept.category === 'cnn' && (
              <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-2">
                <div className="flex items-center justify-between font-medium text-xs">
                  <span className="text-slate-200">Layer Explode Separation</span>
                  <span className="text-cyan-400 font-mono font-bold">
                    {settings.explodeDistance.toFixed(1)}x
                  </span>
                </div>
                <input
                  type="range"
                  min={0.5}
                  max={4.5}
                  step={0.1}
                  value={settings.explodeDistance}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    onUpdateSettings(s => ({ ...s, explodeDistance: val }));
                  }}
                  className="w-full accent-cyan-500 bg-slate-800 h-1.5 rounded-lg cursor-pointer"
                />
              </div>
            )}

            {/* Flow Speed Slider */}
            <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-2">
              <div className="flex items-center justify-between font-medium text-xs">
                <span className="text-slate-200">3D Signal Animation Speed</span>
                <span className="text-indigo-400 font-mono font-bold">
                  {settings.animationSpeed.toFixed(1)}x
                </span>
              </div>
              <input
                type="range"
                min={0.2}
                max={3.0}
                step={0.1}
                value={settings.animationSpeed}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  onUpdateSettings(s => ({ ...s, animationSpeed: val }));
                }}
                className="w-full accent-indigo-500 bg-slate-800 h-1.5 rounded-lg cursor-pointer"
              />
            </div>
          </div>
        )}
      </div>

      {/* Action Footer: Prominent PDF Download Button */}
      <div className="p-4 border-t border-slate-800/80 bg-slate-950/90 space-y-2">
        <button
          onClick={onDownloadPDF}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500 text-white font-bold text-xs flex items-center justify-center space-x-2 shadow-xl shadow-indigo-500/20 hover:brightness-110 active:scale-[0.98] transition-all cursor-pointer"
        >
          <Download className="w-4 h-4" />
          <span>Download 4-Page PDF Architecture Report</span>
        </button>
        <div className="text-[10px] text-center text-slate-500">
          Captures 3D canvas snapshot &amp; exports mathematical specifications
        </div>
      </div>
    </aside>
  );
}

