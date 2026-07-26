import { useRef, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { ConceptData, NodeDetail } from '../../types';

interface DNNModelProps {
  concept: ConceptData;
  animating: boolean;
  animationSpeed: number;
  backpropActive: boolean;
  selectedNodeId: string | null;
  onSelectNode: (node: NodeDetail | null, layerIdx: number) => void;
}

export function DNNModel({
  concept,
  animating,
  animationSpeed,
  backpropActive,
  selectedNodeId,
  onSelectNode
}: DNNModelProps) {
  const groupRef = useRef<THREE.Group>(null!);
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);

  // Define 3D layer layout positions
  const layersConfig = [
    {
      count: Math.min(concept.architectureBreakdown?.[0]?.nodesCount || 5, 8),
      color: '#38bdf8',
      name: concept.architectureBreakdown?.[0]?.name || 'Input Layer',
      x: -6
    },
    {
      count: Math.min(concept.architectureBreakdown?.[1]?.nodesCount || 6, 8),
      color: '#818cf8',
      name: concept.architectureBreakdown?.[1]?.name || 'Hidden Layer 1',
      x: -2
    },
    {
      count: Math.min(concept.architectureBreakdown?.[2]?.nodesCount || 5, 8),
      color: '#c084fc',
      name: concept.architectureBreakdown?.[2]?.name || 'Hidden Layer 2',
      x: 2
    },
    {
      count: Math.min(concept.architectureBreakdown?.[3]?.nodesCount || 3, 6),
      color: '#f43f5e',
      name: concept.architectureBreakdown?.[3]?.name || 'Output Layer',
      x: 6
    }
  ];

  // Generate node positions and synaptic connection lines
  const { nodes, connections } = useMemo(() => {
    const nodeList: {
      id: string;
      layerIdx: number;
      nodeIdx: number;
      pos: [number, number, number];
      color: string;
      activation: number;
      bias: number;
      weight: number;
    }[] = [];

    const connectionList: {
      id: string;
      start: [number, number, number];
      end: [number, number, number];
      layerFrom: number;
    }[] = [];

    layersConfig.forEach((layer, layerIdx) => {
      const ySpacing = 1.4;
      const yOffset = -((layer.count - 1) * ySpacing) / 2;

      for (let i = 0; i < layer.count; i++) {
        const nodeId = `l${layerIdx}-n${i}`;
        const pos: [number, number, number] = [
          layer.x,
          yOffset + i * ySpacing,
          (Math.sin(i * 0.8) - 0.5) * 0.5
        ];

        nodeList.push({
          id: nodeId,
          layerIdx,
          nodeIdx: i,
          pos,
          color: layer.color,
          activation: +(0.2 + Math.random() * 0.75).toFixed(2),
          bias: +(-0.5 + Math.random()).toFixed(2),
          weight: +(0.1 + Math.random() * 0.9).toFixed(2)
        });
      }
    });

    // Create connections between adjacent layers
    nodeList.forEach((n1) => {
      nodeList.forEach((n2) => {
        if (n2.layerIdx === n1.layerIdx + 1) {
          connectionList.push({
            id: `c-${n1.id}-${n2.id}`,
            start: n1.pos,
            end: n2.pos,
            layerFrom: n1.layerIdx
          });
        }
      });
    });

    return { nodes: nodeList, connections: connectionList };
  }, []);

  // Signal flow animation progress
  const flowProgressRef = useRef(0);
  const backpropProgressRef = useRef(1);
  const signalSpheresRef = useRef<THREE.Group>(null!);

  useFrame((_, delta) => {
    if (animating) {
      flowProgressRef.current = (flowProgressRef.current + delta * 0.5 * animationSpeed) % 1;
      backpropProgressRef.current = (backpropProgressRef.current - delta * 0.5 * animationSpeed) % 1;
      if (backpropProgressRef.current < 0) backpropProgressRef.current = 1;
    }

    if (signalSpheresRef.current) {
      signalSpheresRef.current.children.forEach((child, i) => {
        const conn = connections[i % connections.length];
        if (conn) {
          const t = backpropActive ? (backpropProgressRef.current + i * 0.05) % 1 : (flowProgressRef.current + i * 0.05) % 1;
          child.position.x = THREE.MathUtils.lerp(conn.start[0], conn.end[0], t);
          child.position.y = THREE.MathUtils.lerp(conn.start[1], conn.end[1], t);
          child.position.z = THREE.MathUtils.lerp(conn.start[2], conn.end[2], t);
        }
      });
    }
  });

  return (
    <group ref={groupRef}>
      {/* Connection Rods */}
      {connections.map((conn) => {
        const points = [new THREE.Vector3(...conn.start), new THREE.Vector3(...conn.end)];
        const lineGeo = new THREE.BufferGeometry().setFromPoints(points);

        const isBackprop = backpropActive;
        const lineColor = isBackprop ? '#f43f5e' : conn.layerFrom === 0 ? '#38bdf8' : conn.layerFrom === 1 ? '#818cf8' : '#c084fc';

        return (
          <primitive
            key={conn.id}
            object={new THREE.Line(
              lineGeo,
              new THREE.LineBasicMaterial({ color: lineColor, transparent: true, opacity: 0.25 })
            )}
          />
        );
      })}

      {/* Signal Flow Pulse Particles */}
      <group ref={signalSpheresRef}>
        {connections.slice(0, 30).map((conn, idx) => (
          <mesh key={`pulse-${idx}`}>
            <sphereGeometry args={[0.08, 12, 12]} />
            <meshBasicMaterial
              color={backpropActive ? '#fb7185' : '#38bdf8'}
              transparent
              opacity={0.85}
            />
          </mesh>
        ))}
      </group>

      {/* Nodes */}
      {nodes.map((node) => {
        const isSelected = selectedNodeId === node.id;
        const isHovered = hoveredNodeId === node.id;
        const scale = isSelected ? 0.38 : isHovered ? 0.32 : 0.25;

        return (
          <group key={node.id} position={node.pos}>
            <mesh
              scale={scale}
              onPointerOver={(e) => {
                e.stopPropagation();
                setHoveredNodeId(node.id);
              }}
              onPointerOut={() => setHoveredNodeId(null)}
              onClick={(e) => {
                e.stopPropagation();
                const nodeDetail: NodeDetail = {
                  id: node.id,
                  name: `Neuron ${node.id} (L${node.layerIdx + 1})`,
                  type: layersConfig[node.layerIdx].name,
                  layerIndex: node.layerIdx,
                  activation: `a = ${(node.activation).toFixed(2)}`,
                  value: node.activation,
                  weight: node.weight,
                  bias: node.bias,
                  gradient: backpropActive ? +(-0.05 + Math.random() * 0.1).toFixed(4) : undefined,
                  description: `Neuron receiving inputs from Layer ${node.layerIdx}. Computes weighted sum z = Wx + b.`
                };
                onSelectNode(nodeDetail, node.layerIdx);
              }}
            >
              <sphereGeometry args={[1, 32, 32]} />
              <meshStandardMaterial
                color={isSelected ? '#38bdf8' : isHovered ? '#a855f7' : node.color}
                emissive={isSelected || isHovered ? node.color : '#000000'}
                emissiveIntensity={isSelected ? 1.5 : isHovered ? 0.8 : 0.2}
                roughness={0.2}
                metalness={0.8}
              />
            </mesh>

            {/* Glowing Ring Outer Shell */}
            {(isSelected || isHovered) && (
              <mesh scale={scale * 1.5}>
                <sphereGeometry args={[1, 16, 16]} />
                <meshBasicMaterial
                  color={node.color}
                  transparent
                  opacity={0.3}
                  wireframe
                />
              </mesh>
            )}

            {/* 3D Tooltip Label on Hover/Select */}
            {(isHovered || isSelected) && (
              <Html distanceFactor={15} position={[0, 0.5, 0]} center>
                <div className="bg-slate-900/90 backdrop-blur-md text-white text-[10px] px-2.5 py-1.5 rounded-lg border border-indigo-500/50 shadow-xl whitespace-nowrap pointer-events-none">
                  <div className="font-bold text-indigo-300">Neuron {node.id}</div>
                  <div className="text-slate-300">Act: {node.activation} | Bias: {node.bias}</div>
                  {backpropActive && <div className="text-rose-400 font-mono">∇L/∇w: -0.024</div>}
                </div>
              </Html>
            )}
          </group>
        );
      })}

      {/* Layer Titles below structure */}
      {layersConfig.map((layer, idx) => (
        <group key={`layer-title-${idx}`} position={[layer.x, -4.8, 0]}>
          <Html center distanceFactor={16}>
            <div className="text-center pointer-events-none">
              <span className="text-[11px] font-semibold tracking-wider text-slate-300 uppercase bg-slate-900/80 px-2.5 py-1 rounded border border-slate-700/60 shadow-lg">
                {layer.name}
              </span>
            </div>
          </Html>
        </group>
      ))}
    </group>
  );
}
