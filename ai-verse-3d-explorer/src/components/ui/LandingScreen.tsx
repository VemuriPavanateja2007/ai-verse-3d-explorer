import { motion } from 'motion/react';
import { Canvas } from '@react-three/fiber';
import { AmbientParticleBackground } from '../3d/AmbientParticleBackground';
import { Sparkles, Cpu, Layers, Network, ArrowRight } from 'lucide-react';

interface LandingScreenProps {
  onStartExploring: () => void;
}

export function LandingScreen({ onStartExploring }: LandingScreenProps) {
  return (
    <div className="relative w-full h-screen bg-slate-950 text-white flex flex-col justify-between overflow-hidden select-none">
      {/* 3D Ambient Particle Background */}
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 15], fov: 60 }}>
          <AmbientParticleBackground />
        </Canvas>
      </div>

      {/* Top Brand Bar */}
      <header className="relative z-10 px-8 py-6 flex items-center justify-between border-b border-slate-800/40 bg-slate-950/40 backdrop-blur-md">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-400 p-0.5 shadow-lg shadow-indigo-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-cyan-400" />
            </div>
          </div>
          <div>
            <span className="font-bold text-lg tracking-wider bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
              AI-VERSE 3D EXPLORER
            </span>
            <span className="block text-[10px] text-cyan-400 font-mono tracking-widest uppercase">
              Tactile Neural Architecture Platform
            </span>
          </div>
        </div>

        <div className="hidden sm:flex items-center space-x-6 text-xs text-slate-400">
          <span className="flex items-center space-x-1.5"><Cpu className="w-4 h-4 text-indigo-400" /> <span>Deep Neural Nets</span></span>
          <span className="flex items-center space-x-1.5"><Layers className="w-4 h-4 text-cyan-400" /> <span>Computer Vision</span></span>
          <span className="flex items-center space-x-1.5"><Network className="w-4 h-4 text-purple-400" /> <span>Transformers & LLMs</span></span>
        </div>
      </header>

      {/* Hero Body */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-6 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-indigo-950/80 border border-indigo-500/30 text-indigo-300 text-xs font-mono mb-6 shadow-xl backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span>Interactive 3D Deep Learning Mechanics</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white mb-6 leading-tight">
            Touch, Rotate, and Explore <br />
            <span className="bg-gradient-to-r from-cyan-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
              The Architecture of Artificial Intelligence
            </span>
          </h1>

          <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto mb-10 leading-relaxed font-normal">
            Step inside a high-fidelity 3D workspace. Inspect gradient backpropagation, explode CNN feature maps, visualize Transformer Attention Cities, and inspect LLM sliding context windows.
          </p>

          <button
            onClick={onStartExploring}
            className="group relative inline-flex items-center space-x-3 px-8 py-4 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500 text-white font-semibold text-base shadow-2xl shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:scale-105 transition-all duration-300 cursor-pointer"
          >
            <span>Start Exploring Workspace</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </motion.div>
      </main>

      {/* Bottom Feature Pill Grid */}
      <footer className="relative z-10 px-8 py-6 border-t border-slate-800/40 bg-slate-950/40 backdrop-blur-md">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 text-left">
          <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800/60">
            <div className="text-cyan-400 font-bold text-sm mb-1">01. DNN & Backprop</div>
            <div className="text-slate-400 text-xs">Translucent 3D nodes with reverse error signal gradient pulses.</div>
          </div>
          <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800/60">
            <div className="text-indigo-400 font-bold text-sm mb-1">02. CNN Feature Maps</div>
            <div className="text-slate-400 text-xs">Explodable layer sandwich with 3D sliding filter scanning cursor.</div>
          </div>
          <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800/60">
            <div className="text-purple-400 font-bold text-sm mb-1">03. Attention City</div>
            <div className="text-slate-400 text-xs">Topological 3D attention score heightmap with token Bezier curves.</div>
          </div>
          <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800/60">
            <div className="text-emerald-400 font-bold text-sm mb-1">04. LLM Helix & PDF</div>
            <div className="text-slate-400 text-xs">Sliding context window box & instant high-res camera PDF report export.</div>
          </div>
        </div>
      </footer>
    </div>
  );
}
