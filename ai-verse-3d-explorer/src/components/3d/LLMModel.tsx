import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { ConceptData } from '../../types';

interface LLMModelProps {
  concept: ConceptData;
  animating: boolean;
  animationSpeed: number;
  temperature: number;
  topP: number;
  contextLength: number;
  onSelectToken?: (token: string) => void;
}

export function LLMModel({
  concept,
  animating,
  animationSpeed,
  temperature,
  topP,
  contextLength
}: LLMModelProps) {
  const helixRef = useRef<THREE.Group>(null!);
  const [activeTokenIndex, setActiveTokenIndex] = useState(0);

  // Generate 3D Helix points
  const helixPoints = 40;
  const helixRadius = 2.2;
  const helixHeight = 8;

  const helixNodes = Array.from({ length: helixPoints }, (_, i) => {
    const angle = (i / helixPoints) * Math.PI * 6;
    const y = (i / helixPoints) * helixHeight - helixHeight / 2;
    const x1 = Math.cos(angle) * helixRadius;
    const z1 = Math.sin(angle) * helixRadius;

    const x2 = Math.cos(angle + Math.PI) * helixRadius;
    const z2 = Math.sin(angle + Math.PI) * helixRadius;

    return { id: i, pos1: [x1, y, z1] as [number, number, number], pos2: [x2, y, z2] as [number, number, number] };
  });

  // Generated Token Candidates with Probabilities affected by Temperature T & Top-P
  const rawTokens = [
    { text: 'intelligence', baseProb: 0.42 },
    { text: 'neural', baseProb: 0.28 },
    { text: 'learning', baseProb: 0.15 },
    { text: 'system', baseProb: 0.08 },
    { text: 'architecture', baseProb: 0.05 },
    { text: 'matrix', baseProb: 0.02 }
  ];

  // Adjust candidate probabilities using Temperature T softmax scaling
  const candidateProbabilities = rawTokens.map((item) => {
    const scaledLogit = Math.log(item.baseProb + 0.001) / Math.max(0.1, temperature);
    return { ...item, prob: Math.exp(scaledLogit) };
  });

  const totalProbSum = candidateProbabilities.reduce((acc, curr) => acc + curr.prob, 0);
  const normalizedCandidates = candidateProbabilities.map((item) => ({
    ...item,
    normProb: item.prob / totalProbSum
  }));

  useFrame((_, delta) => {
    if (animating && helixRef.current) {
      helixRef.current.rotation.y += delta * 0.2 * animationSpeed;
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* Holographic 3D Double-Helix Matrix */}
      <group ref={helixRef} position={[-2.5, 0, 0]}>
        {helixNodes.map((node) => (
          <group key={`helix-${node.id}`}>
            {/* Strand 1 Node */}
            <mesh position={node.pos1} scale={0.15}>
              <sphereGeometry args={[1, 16, 16]} />
              <meshStandardMaterial
                color="#38bdf8"
                emissive="#0284c7"
                emissiveIntensity={0.8}
                roughness={0.2}
              />
            </mesh>

            {/* Strand 2 Node */}
            <mesh position={node.pos2} scale={0.15}>
              <sphereGeometry args={[1, 16, 16]} />
              <meshStandardMaterial
                color="#c084fc"
                emissive="#7e22ce"
                emissiveIntensity={0.8}
                roughness={0.2}
              />
            </mesh>

            {/* Connecting Base Pair Rod */}
            <primitive
              object={new THREE.Line(
                new THREE.BufferGeometry().setFromPoints([
                  new THREE.Vector3(...node.pos1),
                  new THREE.Vector3(...node.pos2)
                ]),
                new THREE.LineBasicMaterial({ color: '#38bdf8', transparent: true, opacity: 0.25 })
              )}
            />
          </group>
        ))}

        <Html distanceFactor={16} position={[0, helixHeight / 2 + 0.8, 0]} center>
          <div className="bg-slate-900/90 text-cyan-300 text-[10px] font-mono font-bold px-2.5 py-1 rounded border border-cyan-500/50 shadow-lg whitespace-nowrap">
            3D Transformer Embedding Latent Helix
          </div>
        </Html>
      </group>

      {/* 3D Context Window Bounding Box */}
      <group position={[2.8, 0, 0]}>
        {/* Wireframe Context Window Box */}
        <mesh>
          <boxGeometry args={[3.2, helixHeight * 0.75, 2.5]} />
          <meshBasicMaterial color="#6366f1" wireframe transparent opacity={0.6} />
        </mesh>

        {/* Translucent Solid Box Fill */}
        <mesh>
          <boxGeometry args={[3.2, helixHeight * 0.75, 2.5]} />
          <meshStandardMaterial color="#1e1b4b" transparent opacity={0.2} />
        </mesh>

        <Html distanceFactor={15} position={[0, (helixHeight * 0.75) / 2 + 0.6, 0]} center>
          <div className="bg-indigo-950/90 text-indigo-200 text-[10px] font-mono font-bold px-2.5 py-1 rounded border border-indigo-400/60 shadow-lg whitespace-nowrap">
            Context Window Box (Length = {contextLength})
          </div>
        </Html>

        {/* 3D Next-Token Probability Bar Chart Columns */}
        <group position={[0, -2, 0]}>
          {normalizedCandidates.map((cand, idx) => {
            const barHeight = Math.max(0.3, cand.normProb * 4);
            const xOffset = (idx - normalizedCandidates.length / 2) * 0.48;
            const isTopPPassed = cand.normProb >= (1 - topP) * 0.2;

            return (
              <group key={`cand-${idx}`} position={[xOffset, barHeight / 2, 0]}>
                <mesh>
                  <boxGeometry args={[0.38, barHeight, 0.38]} />
                  <meshStandardMaterial
                    color={isTopPPassed ? '#38bdf8' : '#475569'}
                    emissive={isTopPPassed ? '#0284c7' : '#000000'}
                    emissiveIntensity={isTopPPassed ? 0.9 : 0}
                    roughness={0.2}
                  />
                </mesh>

                {/* Probability Percentage Label */}
                <Html distanceFactor={14} position={[0, barHeight / 2 + 0.3, 0]} center>
                  <div className="text-[8px] font-mono text-cyan-200 bg-slate-900/90 px-1 rounded shadow pointer-events-none">
                    {(cand.normProb * 100).toFixed(0)}%
                  </div>
                </Html>
              </group>
            );
          })}
        </group>
      </group>
    </group>
  );
}
