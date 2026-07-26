import { X, MousePointer, Move, ZoomIn, Eye, Sparkles } from 'lucide-react';

interface GestureGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function GestureGuideModal({ isOpen, onClose }: GestureGuideModalProps) {
  if (!isOpen) return null;

  const guides = [
    {
      title: '3D Orbit Rotation',
      gesture: 'Left Click + Drag (or 1-finger Drag on Touch)',
      description: 'Rotate camera view 360 degrees around active neural architecture.',
      icon: MousePointer,
      color: 'text-indigo-400 bg-indigo-950/80 border-indigo-500/40'
    },
    {
      title: 'Panning Movement',
      gesture: 'Right Click + Drag (or 2-finger Drag on Touch)',
      description: 'Translate workspace across X/Y axis to focus on specific layer nodes.',
      icon: Move,
      color: 'text-cyan-400 bg-cyan-950/80 border-cyan-500/40'
    },
    {
      title: 'Zoom Depth',
      gesture: 'Scroll Wheel (or Pinch Zoom on Touch)',
      description: 'Magnify into internal neuron weight activations and feature map channels.',
      icon: ZoomIn,
      color: 'text-purple-400 bg-purple-950/80 border-purple-500/40'
    },
    {
      title: 'Node & Layer Inspection',
      gesture: 'Left Click on 3D Object / Hover',
      description: 'Selects neuron node or CNN plane, highlighting local parameters and syncing technical sidebar cards.',
      icon: Eye,
      color: 'text-emerald-400 bg-emerald-950/80 border-emerald-500/40'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl relative text-white">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition-all cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 rounded-xl bg-indigo-600/30 border border-indigo-500/40 text-indigo-400">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold">3D Navigation & Gesture Guide</h3>
            <p className="text-xs text-slate-400">Tactile control mechanics for mouse and touch devices</p>
          </div>
        </div>

        <div className="space-y-3.5">
          {guides.map((item, idx) => {
            const IconComponent = item.icon;
            return (
              <div key={idx} className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80 flex items-start space-x-3">
                <div className={`p-2.5 rounded-lg border ${item.color} shrink-0`}>
                  <IconComponent className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-sm text-slate-100">{item.title}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                      {item.gesture}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 pt-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg transition-all cursor-pointer"
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  );
}
