import { ConceptData, ViewportSettings } from '../../types';
import {
  Sparkles,
  RotateCcw,
  Camera,
  Play,
  Pause,
  Sliders,
  Download,
  HelpCircle,
  Home,
  Layers
} from 'lucide-react';

interface TopNavProps {
  concept: ConceptData;
  settings: ViewportSettings;
  onUpdateSettings: (updater: (prev: ViewportSettings) => ViewportSettings) => void;
  onDownloadPDF: () => void;
  onOpenGestureGuide: () => void;
  onReturnHome: () => void;
}

export function TopNav({
  concept,
  settings,
  onUpdateSettings,
  onDownloadPDF,
  onOpenGestureGuide,
  onReturnHome
}: TopNavProps) {
  return (
    <header className="h-14 bg-slate-900/90 border-b border-slate-800/80 px-4 flex items-center justify-between z-20 backdrop-blur-md select-none">
      {/* Left Brand & Breadcrumbs */}
      <div className="flex items-center space-x-3">
        <button
          onClick={onReturnHome}
          className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-medium border border-slate-700/60 transition-all cursor-pointer"
          title="Return to Concept Selection"
        >
          <Home className="w-3.5 h-3.5 text-cyan-400" />
          <span className="hidden sm:inline">Concepts</span>
        </button>

        <span className="text-slate-600 font-mono">/</span>

        <div className="flex items-center space-x-2">
          <span className="font-bold text-sm text-slate-100 tracking-wide">
            {concept.title}
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-950/80 text-indigo-300 border border-indigo-500/40">
            {concept.badge}
          </span>
        </div>
      </div>

      {/* Middle Interactive Viewport Controls */}
      <div className="hidden md:flex items-center space-x-2 bg-slate-950/80 p-1 rounded-xl border border-slate-800">
        {/* Play/Pause Animation */}
        <button
          onClick={() => onUpdateSettings(s => ({ ...s, animating: !s.animating }))}
          className={`px-2.5 py-1 rounded-lg text-xs font-medium flex items-center space-x-1 transition-all cursor-pointer ${
            settings.animating ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
          }`}
          title="Toggle 3D Signal Flow Animations"
        >
          {settings.animating ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          <span className="text-[11px]">{settings.animating ? 'Pause' : 'Flow'}</span>
        </button>

        {/* Backprop Mode toggle for DNN */}
        {concept.category === 'dnn' && (
          <button
            onClick={() => onUpdateSettings(s => ({ ...s, backpropActive: !s.backpropActive }))}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium flex items-center space-x-1 transition-all cursor-pointer ${
              settings.backpropActive ? 'bg-rose-600 text-white shadow-md animate-pulse' : 'text-slate-400 hover:text-white'
            }`}
            title="Toggle Reverse Error Signal Backpropagation"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="text-[11px]">Backprop</span>
          </button>
        )}

        {/* Transformer Multi-Head Switcher */}
        {concept.category === 'transformer' && (
          <div className="flex items-center space-x-1 pl-1 border-l border-slate-800 text-xs">
            <span className="text-[10px] text-slate-400 font-mono px-1">Head:</span>
            {[0, 1].map((headIdx) => (
              <button
                key={headIdx}
                onClick={() => onUpdateSettings(s => ({ ...s, selectedHead: headIdx }))}
                className={`px-2 py-0.5 rounded text-[11px] font-mono transition-all cursor-pointer ${
                  settings.selectedHead === headIdx ? 'bg-purple-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                H{headIdx + 1}
              </button>
            ))}
          </div>
        )}

        {/* Camera Perspective Presets */}
        <div className="flex items-center space-x-1 pl-1 border-l border-slate-800">
          {(['perspective', 'top', 'front', 'side'] as const).map((preset) => (
            <button
              key={preset}
              onClick={() => onUpdateSettings(s => ({ ...s, cameraPreset: preset }))}
              className={`px-2 py-0.5 rounded text-[10px] uppercase font-mono transition-all cursor-pointer ${
                settings.cameraPreset === preset ? 'bg-cyan-600/80 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {preset.slice(0, 3)}
            </button>
          ))}
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center space-x-2">
        <button
          onClick={onOpenGestureGuide}
          className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white text-xs border border-slate-700/60 transition-all cursor-pointer"
          title="View 3D Gesture Controls Guide"
        >
          <HelpCircle className="w-4 h-4 text-indigo-400" />
        </button>

        <button
          onClick={onDownloadPDF}
          className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-indigo-600 to-cyan-500 text-white text-xs font-semibold flex items-center space-x-1.5 shadow-lg shadow-indigo-500/20 hover:brightness-110 transition-all cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Download PDF</span>
        </button>
      </div>
    </header>
  );
}
