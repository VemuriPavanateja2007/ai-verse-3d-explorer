import { useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import * as THREE from 'three';
import { ConceptData, ViewportSettings, NodeDetail, LayerSpec } from '../../types';
import { DNNModel } from './DNNModel';
import { CNNModel } from './CNNModel';
import { TransformerModel } from './TransformerModel';
import { LLMModel } from './LLMModel';

interface CanvasWrapperProps {
  concept: ConceptData;
  settings: ViewportSettings;
  onSelectNode: (node: NodeDetail | null, layerIdx: number) => void;
  onSelectLayer: (layerSpec: LayerSpec, idx: number) => void;
  onCanvasReady?: (canvas: HTMLCanvasElement) => void;
}

export function CanvasWrapper({
  concept,
  settings,
  onSelectNode,
  onSelectLayer,
  onCanvasReady
}: CanvasWrapperProps) {
  const controlsRef = useRef<any>(null!);

  // Handle Camera Preset Switch
  useEffect(() => {
    if (!controlsRef.current) return;
    const ctrl = controlsRef.current;

    switch (settings.cameraPreset) {
      case 'top':
        ctrl.object.position.set(0, 15, 0.1);
        ctrl.target.set(0, 0, 0);
        break;
      case 'front':
        ctrl.object.position.set(0, 0, 12);
        ctrl.target.set(0, 0, 0);
        break;
      case 'side':
        ctrl.object.position.set(15, 0, 0);
        ctrl.target.set(0, 0, 0);
        break;
      case 'perspective':
      default:
        ctrl.object.position.set(0, 3, 14);
        ctrl.target.set(0, 0, 0);
        break;
    }
    ctrl.update();
  }, [settings.cameraPreset]);

  return (
    <div className="w-full h-full relative bg-slate-950 overflow-hidden select-none">
      <Canvas
        gl={{ preserveDrawingBuffer: true, antialias: true, alpha: true }}
        camera={{ position: [0, 3, 14], fov: 45 }}
        onCreated={({ gl }) => {
          if (onCanvasReady) {
            onCanvasReady(gl.domElement);
          }
        }}
      >
        {/* Lighting Setup */}
        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 15, 10]} intensity={1.2} />
        <directionalLight position={[-10, -10, -10]} intensity={0.4} color="#6366f1" />
        <pointLight position={[0, 0, 5]} intensity={0.8} color="#0ea5e9" />

        {/* Ambient Stars / Cosmic Grid Background */}
        <Stars radius={100} depth={50} count={2500} factor={4} saturation={0} fade speed={1} />
        <gridHelper args={[40, 40, '#1e293b', '#0f172a']} position={[0, -5, 0]} />

        {/* Dynamic Model Routing based on concept category */}
        {concept.category === 'dnn' && (
          <DNNModel
            concept={concept}
            animating={settings.animating}
            animationSpeed={settings.animationSpeed}
            backpropActive={settings.backpropActive}
            selectedNodeId={settings.selectedNodeId}
            onSelectNode={onSelectNode}
          />
        )}

        {concept.category === 'cnn' && (
          <CNNModel
            concept={concept}
            animating={settings.animating}
            animationSpeed={settings.animationSpeed}
            explodeDistance={settings.explodeDistance}
            selectedLayerIdx={settings.activeLayerIndex}
            onSelectLayer={onSelectLayer}
          />
        )}

        {concept.category === 'transformer' && (
          <TransformerModel
            concept={concept}
            animating={settings.animating}
            animationSpeed={settings.animationSpeed}
            selectedHead={settings.selectedHead}
            selectedNodeId={settings.selectedNodeId}
            onSelectToken={(tok, idx) => {
              onSelectNode({
                id: `token-${idx}`,
                name: `Token "${tok}"`,
                type: 'Transformer Query Token',
                layerIndex: 2,
                value: 1.0,
                description: `Token string "${tok}" evaluated at position index ${idx} within self-attention layer.`
              }, 2);
            }}
          />
        )}

        {concept.category === 'llm' && (
          <LLMModel
            concept={concept}
            animating={settings.animating}
            animationSpeed={settings.animationSpeed}
            temperature={concept.parameters.find(p => p.key === 'temperature')?.value || 0.7}
            topP={concept.parameters.find(p => p.key === 'topP')?.value || 0.9}
            contextLength={concept.parameters.find(p => p.key === 'contextLength')?.value || 8}
          />
        )}

        {/* Interactive Orbit Controls for Touch and Mouse Navigation */}
        <OrbitControls
          ref={controlsRef}
          enableDamping
          dampingFactor={0.05}
          maxDistance={30}
          minDistance={3}
          makeDefault
        />
      </Canvas>
    </div>
  );
}
