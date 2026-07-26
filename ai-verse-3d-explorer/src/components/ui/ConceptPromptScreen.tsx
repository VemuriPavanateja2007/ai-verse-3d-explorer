import { useState } from 'react';
import { motion } from 'motion/react';
import { Canvas } from '@react-three/fiber';
import { AmbientParticleBackground } from '../3d/AmbientParticleBackground';
import { Sparkles, Search, Cpu, Layers, Network, Bot, ArrowRight, Loader2 } from 'lucide-react';
import { ConceptCategory } from '../../types';

interface ConceptPromptScreenProps {
  onSelectPreset: (categoryKey: ConceptCategory) => void;
  onGenerateCustom: (prompt: string) => Promise<void>;
  isLoading: boolean;
}

export function ConceptPromptScreen({
  onSelectPreset,
  onGenerateCustom,
  isLoading
}: ConceptPromptScreenProps) {
  const [customPrompt, setCustomPrompt] = useState('');

  const presets = [
    {
      key: 'dnn' as ConceptCategory,
      title: 'Deep Neural Network (DNN)',
      subtitle: 'Multilayer Perceptron & Backprop Gradients',
      icon: Cpu,
      color: 'from-sky-500 to-indigo-600',
      badge: 'Neural Core',
      tags: ['Forward Signal', 'Reverse Gradient Pulse', 'Activation Functions']
    },
    {
      key: 'cnn' as ConceptCategory,
      title: 'Computer Vision (CNN)',
      subtitle: 'Spatial Feature Hierarchy Decomposition',
      icon: Layers,
      color: 'from-indigo-600 to-purple-600',
      badge: 'Computer Vision',
      tags: ['Exploded Layers', '3D Filter Cursor', 'Edge & Texture Maps']
    },
    {
      key: 'transformer' as ConceptCategory,
      title: 'Transformers & NLP',
      subtitle: 'Self-Attention City & Token Connections',
      icon: Network,
      color: 'from-purple-600 to-pink-600',
      badge: 'Attention Mechanism',
      tags: ['Topological Heightmap', 'Bezier Connections', 'Multi-Head Switcher']
    },
    {
      key: 'llm' as ConceptCategory,
      title: 'Large Language Models (LLMs)',
      subtitle: 'Helix Embeddings & Context Window Box',
      icon: Bot,
      color: 'from-cyan-500 to-emerald-500',
      badge: 'Generative AI',
      tags: ['Double Helix Matrix', '3D Context Box', 'Temperature & Top-P']
    }
  ];

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customPrompt.trim()) {
      onGenerateCustom(customPrompt.trim());
    }
  };

  return (
    <div className="relative w-full h-screen bg-slate-950 text-white flex flex-col justify-between overflow-hidden select-none">
      {/* 3D Ambient Canvas Background */}
      <div className="absolute inset-0 z-0 opacity-60">
        <Canvas camera={{ position: [0, 0, 15], fov: 60 }}>
          <AmbientParticleBackground />
        </Canvas>
      </div>

      {/* Header */}
      <header className="relative z-10 px-8 py-5 flex items-center justify-between border-b border-slate-800/40 bg-slate-950/50 backdrop-blur-md">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-lg bg-indigo-600/30 border border-indigo-400/40 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-cyan-400" />
          </div>
          <span className="font-bold text-base tracking-wider text-slate-100">
            AI-VERSE 3D EXPLORER
          </span>
        </div>
        <div className="text-xs text-slate-400 font-mono">
          Stage 2: Select or Type Concept
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 max-w-5xl mx-auto w-full py-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full text-center"
        >
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-3">
            Choose an Architecture to Explore
          </h2>
          <p className="text-slate-400 text-sm sm:text-base max-w-xl mx-auto mb-8">
            Select a preset AI model architecture or enter any custom AI concept to construct a tailored 3D interactive workspace.
          </p>

          {/* High-Contrast Prompt Input Tab */}
          <form onSubmit={handleCustomSubmit} className="mb-10 max-w-2xl mx-auto">
            <div className="relative flex items-center">
              <Search className="absolute left-4 w-5 h-5 text-indigo-400" />
              <input
                type="text"
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                placeholder="Type any custom concept (e.g. Multi-Head Attention, Mixture of Experts, FlashAttention)..."
                disabled={isLoading}
                className="w-full bg-slate-900/90 text-slate-100 placeholder-slate-500 text-sm pl-12 pr-40 py-4 rounded-xl border border-indigo-500/40 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 shadow-2xl transition-all"
              />
              <button
                type="submit"
                disabled={isLoading || !customPrompt.trim()}
                className="absolute right-2 px-5 py-2.5 rounded-lg bg-gradient-to-r from-indigo-600 to-cyan-500 text-white font-medium text-xs flex items-center space-x-1.5 shadow-lg hover:brightness-110 disabled:opacity-50 transition-all cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <>
                    <span>Generate Workspace</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Preset Category Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-left">
            {presets.map((preset) => {
              const IconComp = preset.icon;
              return (
                <button
                  key={preset.key}
                  onClick={() => onSelectPreset(preset.key)}
                  className="group relative p-5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-indigo-500/60 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-indigo-500/20 text-left flex flex-col justify-between cursor-pointer"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className={`p-2.5 rounded-lg bg-gradient-to-tr ${preset.color} text-white shadow-md`}>
                        <IconComp className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                        {preset.badge}
                      </span>
                    </div>

                    <h3 className="font-bold text-slate-100 text-base mb-1 group-hover:text-cyan-300 transition-colors">
                      {preset.title}
                    </h3>
                    <p className="text-slate-400 text-xs mb-4 leading-snug">
                      {preset.subtitle}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-1 mt-2">
                    {preset.tags.map((tag, idx) => (
                      <span key={idx} className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-950 text-slate-400 border border-slate-800">
                        {tag}
                      </span>
                    ))}
                  </div>
                </button>
              );
            })}
          </div>
        </motion.div>
      </main>

      <footer className="relative z-10 py-4 text-center text-slate-500 text-xs border-t border-slate-900 bg-slate-950/80">
        AI-Verse 3D Explorer &bull; WebGL & Three.js Neural Architecture Visualization
      </footer>
    </div>
  );
}
