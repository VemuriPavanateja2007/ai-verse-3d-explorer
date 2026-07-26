import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { ConceptData, LayerSpec } from '../../types';

interface CNNModelProps {
  concept: ConceptData;
  animating: boolean;
  animationSpeed: number;
  explodeDistance: number;
  selectedLayerIdx: number | null;
  onSelectLayer: (layerSpec: LayerSpec, idx: number) => void;
}

export function CNNModel({
  concept,
  animating,
  animationSpeed,
  explodeDistance,
  selectedLayerIdx,
  onSelectLayer
}: CNNModelProps) {
  const scannerRef = useRef<THREE.Group>(null!);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const layers: {
    spec: LayerSpec;
    color: string;
    width: number;
    height: number;
    gridSize: number;
    accentColor: string;
  }[] = [
    {
      spec: concept.architectureBreakdown[0] || { id: '0', name: 'Input RGB Tensor', role: 'Image', nodesCount: 1, description: 'RGB 224x224' },
      color: '#0ea5e9',
      width: 4,
      height: 4,
      gridSize: 12,
      accentColor: '#38bdf8'
    },
    {
      spec: concept.architectureBreakdown[1] || { id: '1', name: 'Conv2D Layer 1', role: 'Edge Detection', nodesCount: 16, description: 'Edges' },
      color: '#6366f1',
      width: 3.5,
      height: 3.5,
      gridSize: 10,
      accentColor: '#818cf8'
    },
    {
      spec: concept.architectureBreakdown[2] || { id: '2', name: 'Conv2D Layer 2 + MaxPool', role: 'Texture Maps', nodesCount: 32, description: 'Textures' },
      color: '#8b5cf6',
      width: 2.8,
      height: 2.8,
      gridSize: 8,
      accentColor: '#a855f7'
    },
    {
      spec: concept.architectureBreakdown[3] || { id: '3', name: 'Conv2D Layer 3', role: 'Part Detector', nodesCount: 64, description: 'Object Parts' },
      color: '#ec4899',
      width: 2.2,
      height: 2.2,
      gridSize: 6,
      accentColor: '#f43f5e'
    },
    {
      spec: concept.architectureBreakdown[4] || { id: '4', name: 'Global Pool & FC', role: 'Logits', nodesCount: 10, description: 'Class Logits' },
      color: '#10b981',
      width: 1.5,
      height: 1.5,
      gridSize: 4,
      accentColor: '#34d399'
    }
  ];

  // Animate 3D Filter Box Scanning across Feature Map
  const scanPosRef = useRef({ x: 0, y: 0, time: 0 });

  useFrame((_, delta) => {
    if (animating && scannerRef.current) {
      scanPosRef.current.time += delta * 1.5 * animationSpeed;
      const t = scanPosRef.current.time;
      const targetLayer = layers[1]; // Scan across Conv Layer 1
      const maxOffset = targetLayer.width / 2 - 0.4;

      scannerRef.current.position.x = Math.sin(t * 1.2) * maxOffset;
      scannerRef.current.position.y = Math.cos(t * 1.5) * maxOffset;
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {layers.map((layer, idx) => {
        // Calculate Z depth placement according to explodeDistance slider
        const layerGap = Math.max(2.8, explodeDistance * 3.6);
        const zPos = (idx - (layers.length - 1) / 2) * layerGap;
        const isSelected = selectedLayerIdx === idx;
        const isHovered = hoveredIdx === idx;

        return (
          <group
            key={`cnn-layer-${idx}`}
            position={[0, 0, zPos]}
            onPointerOver={(e) => {
              e.stopPropagation();
              setHoveredIdx(idx);
            }}
            onPointerOut={() => setHoveredIdx(null)}
            onClick={(e) => {
              e.stopPropagation();
              onSelectLayer(layer.spec, idx);
            }}
          >
            {/* Main Feature Map Channels (spaced cleanly along Z without z-fighting) */}
            {[0, 1, 2].map((channelIdx) => {
              const channelZ = (channelIdx - 1) * 0.35; // clean 0.35 spacing between feature channels
              return (
                <group key={`channel-${channelIdx}`} position={[0, 0, channelZ]}>
                  {/* Translucent Channel Plane */}
                  <mesh>
                    <planeGeometry args={[layer.width, layer.height]} />
                    <meshStandardMaterial
                      color={isSelected ? '#a855f7' : isHovered ? layer.accentColor : layer.color}
                      transparent
                      opacity={channelIdx === 1 ? (isSelected ? 0.85 : 0.65) : 0.35}
                      side={THREE.DoubleSide}
                      roughness={0.2}
                      metalness={0.2}
                    />
                  </mesh>

                  {/* Wireframe Outline */}
                  <mesh>
                    <planeGeometry args={[layer.width, layer.height]} />
                    <meshBasicMaterial
                      color={layer.accentColor}
                      wireframe
                      transparent
                      opacity={0.6}
                    />
                  </mesh>

                  {/* Pixel Grid Overlay on front channel */}
                  {channelIdx === 1 && (
                    <gridHelper
                      args={[layer.width, layer.gridSize, layer.accentColor, layer.accentColor]}
                      rotation={[Math.PI / 2, 0, 0]}
                      position={[0, 0, 0.01]}
                    />
                  )}
                </group>
              );
            })}

            {/* Connecting Frustum Lines between adjacent layers */}
            {idx < layers.length - 1 && (
              <group>
                {[-layer.width / 2, layer.width / 2].map((x, xi) =>
                  [-layer.height / 2, layer.height / 2].map((y, yi) => {
                    const nextLayer = layers[idx + 1];
                    const nextX = xi === 0 ? -nextLayer.width / 2 : nextLayer.width / 2;
                    const nextY = yi === 0 ? -nextLayer.height / 2 : nextLayer.height / 2;
                    const nextZ = layerGap;

                    const points = [new THREE.Vector3(x, y, 0), new THREE.Vector3(nextX, nextY, nextZ)];
                    const geo = new THREE.BufferGeometry().setFromPoints(points);

                    return (
                      <primitive
                        key={`frustum-${xi}-${yi}`}
                        object={new THREE.Line(
                          geo,
                          new THREE.LineBasicMaterial({ color: layer.accentColor, transparent: true, opacity: 0.35 })
                        )}
                      />
                    );
                  })
                )}
              </group>
            )}

            {/* Scanning Filter Box on Conv Layer 1 */}
            {idx === 1 && (
              <group ref={scannerRef} position={[0, 0, 0.1]}>
                <mesh>
                  <boxGeometry args={[0.8, 0.8, 0.2]} />
                  <meshStandardMaterial
                    color="#f43f5e"
                    emissive="#f43f5e"
                    emissiveIntensity={1.2}
                    transparent
                    opacity={0.85}
                  />
                </mesh>
                <Html distanceFactor={14} position={[0, 0.6, 0]} center>
                  <div className="bg-rose-950/90 text-rose-200 text-[10px] font-mono px-2 py-1 rounded border border-rose-500/60 shadow-lg pointer-events-none whitespace-nowrap">
                    Kernel 3x3 Conv [S=1]
                  </div>
                </Html>
              </group>
            )}

            {/* Layer Label HTML */}
            <Html distanceFactor={16} position={[0, -layer.height / 2 - 0.5, 0]} center>
              <div className="text-center pointer-events-none">
                <span className={`text-[11px] font-semibold px-2.5 py-1 rounded border shadow-lg whitespace-nowrap ${
                  isSelected ? 'bg-purple-900/90 text-purple-200 border-purple-400' : 'bg-slate-900/80 text-slate-200 border-slate-700/80'
                }`}>
                  {layer.spec.name}
                </span>
              </div>
            </Html>
          </group>
        );
      })}
    </group>
  );
}
