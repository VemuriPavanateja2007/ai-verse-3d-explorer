import { useRef, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { ConceptData } from '../../types';

interface TransformerModelProps {
  concept: ConceptData;
  animating: boolean;
  animationSpeed: number;
  selectedHead: number; // 0 = Head 1, 1 = Head 2, etc.
  selectedNodeId: string | null;
  onSelectToken: (token: string, idx: number) => void;
}

export function TransformerModel({
  concept,
  animating,
  animationSpeed,
  selectedHead,
  selectedNodeId,
  onSelectToken
}: TransformerModelProps) {
  const groupRef = useRef<THREE.Group>(null!);
  const [hoveredTokenIdx, setHoveredTokenIdx] = useState<number | null>(7); // Default hover "it" (idx 7)

  const tokens = concept.tokens || ['The', 'animal', 'didn\'t', 'cross', 'the', 'street', 'because', 'it', 'was', 'too', 'tired'];
  const matrixHead = concept.attentionMatrix?.[selectedHead % (concept.attentionMatrix.length || 1)] || [];

  const gridSize = tokens.length;
  const spacing = 1.1;

  // Build 3D Height Mesh geometry for "Attention City"
  const gridGeometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(
      gridSize * spacing,
      gridSize * spacing,
      gridSize - 1,
      gridSize - 1
    );
    geo.rotateX(-Math.PI / 2);

    const pos = geo.attributes.position;
    for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize; j++) {
        const vertexIndex = i * gridSize + j;
        const score = matrixHead[i]?.[j] || 0.05;
        // Elevate vertex proportional to attention weight
        pos.setY(vertexIndex, score * 2.8);
      }
    }
    geo.computeVertexNormals();
    return geo;
  }, [gridSize, matrixHead, selectedHead]);

  // Compute 3D Bezier attention curves for active hovered or selected token
  const activeTokenIdx = hoveredTokenIdx !== null ? hoveredTokenIdx : 7; // default token "it"

  const bezierCurves = useMemo(() => {
    if (activeTokenIdx === null || !matrixHead[activeTokenIdx]) return [];

    const activeTokenPos = new THREE.Vector3(
      (activeTokenIdx - gridSize / 2) * spacing,
      0.8,
      (gridSize / 2) * spacing
    );

    const curves: {
      targetIdx: number;
      targetToken: string;
      weight: number;
      curve: THREE.CatmullRomCurve3;
    }[] = [];

    matrixHead[activeTokenIdx].forEach((weight, targetIdx) => {
      if (weight > 0.08) {
        const targetPos = new THREE.Vector3(
          (targetIdx - gridSize / 2) * spacing,
          0.8,
          (gridSize / 2) * spacing
        );

        // Control point curving upwards in Y
        const midPoint = new THREE.Vector3()
          .addVectors(activeTokenPos, targetPos)
          .multiplyScalar(0.5);
        midPoint.y += Math.max(1.8, weight * 4.5);

        const curve = new THREE.CatmullRomCurve3([activeTokenPos, midPoint, targetPos]);
        curves.push({
          targetIdx,
          targetToken: tokens[targetIdx],
          weight,
          curve
        });
      }
    });

    return curves;
  }, [activeTokenIdx, matrixHead, gridSize, tokens]);

  // Wave elevation animation
  useFrame((_, delta) => {
    if (animating && groupRef.current) {
      groupRef.current.rotation.y += delta * 0.08 * animationSpeed;
    }
  });

  return (
    <group ref={groupRef} position={[0, -0.5, 0]}>
      {/* 3D Topological Attention Landscape Grid */}
      <mesh geometry={gridGeometry}>
        <meshStandardMaterial
          color="#38bdf8"
          emissive="#4338ca"
          emissiveIntensity={0.6}
          roughness={0.2}
          metalness={0.8}
          wireframe
        />
      </mesh>

      {/* Surface Solid Accent Mesh */}
      <mesh geometry={gridGeometry} position={[0, -0.05, 0]}>
        <meshStandardMaterial
          color="#0f172a"
          transparent
          opacity={0.8}
          roughness={0.5}
        />
      </mesh>

      {/* Token Nodes Row along X axis */}
      {tokens.map((tok, idx) => {
        const xPos = (idx - gridSize / 2) * spacing;
        const zPos = (gridSize / 2) * spacing;
        const isHovered = hoveredTokenIdx === idx;
        const isActive = activeTokenIdx === idx;

        const selfAttentionScore = matrixHead[activeTokenIdx]?.[idx] || 0;

        return (
          <group
            key={`tok-${idx}`}
            position={[xPos, 0, zPos]}
            onPointerOver={(e) => {
              e.stopPropagation();
              setHoveredTokenIdx(idx);
            }}
            onClick={(e) => {
              e.stopPropagation();
              onSelectToken(tok, idx);
            }}
          >
            {/* Token Base Cylinder */}
            <mesh position={[0, 0.4, 0]}>
              <cylinderGeometry args={[0.3, 0.35, 0.8, 16]} />
              <meshStandardMaterial
                color={isActive ? '#38bdf8' : selfAttentionScore > 0.4 ? '#a855f7' : '#1e293b'}
                emissive={isActive ? '#38bdf8' : selfAttentionScore > 0.4 ? '#a855f7' : '#000000'}
                emissiveIntensity={isActive ? 1.2 : selfAttentionScore > 0.4 ? 0.8 : 0.1}
                roughness={0.3}
              />
            </mesh>

            {/* Token String Label */}
            <Html distanceFactor={14} position={[0, 1.1, 0]} center>
              <div
                className={`text-[10px] font-bold px-2 py-0.5 rounded cursor-pointer transition-all whitespace-nowrap shadow-md ${
                  isActive
                    ? 'bg-cyan-500 text-slate-950 scale-110 border border-cyan-300'
                    : selfAttentionScore > 0.3
                    ? 'bg-purple-600/90 text-white border border-purple-400'
                    : 'bg-slate-900/80 text-slate-300 border border-slate-700/60'
                }`}
              >
                {tok}
              </div>
            </Html>
          </group>
        );
      })}

      {/* 3D Glowing Bezier Attention Curves connecting active token to targets */}
      {bezierCurves.map((c, i) => {
        const points = c.curve.getPoints(30);
        const lineGeo = new THREE.BufferGeometry().setFromPoints(points);
        const isStrong = c.weight > 0.5;

        return (
          <group key={`curve-${i}`}>
            <primitive
              object={new THREE.Line(
                lineGeo,
                new THREE.LineBasicMaterial({
                  color: isStrong ? '#38bdf8' : '#c084fc',
                  transparent: true,
                  opacity: Math.min(1.0, c.weight * 1.5)
                })
              )}
            />

            {/* Floating weight tag over curve apex */}
            <Html distanceFactor={15} position={c.curve.getPoint(0.5)} center>
              <div className="bg-slate-900/90 text-cyan-300 text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border border-cyan-500/50 shadow-md pointer-events-none">
                {(c.weight * 100).toFixed(0)}%
              </div>
            </Html>
          </group>
        );
      })}

      {/* Axis Guide Titles */}
      <Html distanceFactor={18} position={[0, -0.8, (gridSize / 2) * spacing + 1.2]} center>
        <div className="text-[11px] font-mono text-cyan-400 bg-slate-950/80 px-3 py-1 rounded border border-cyan-800/60 shadow-lg pointer-events-none whitespace-nowrap">
          Sequence Query Tokens (Hover or Click to Inspect Attention Weights)
        </div>
      </Html>
    </group>
  );
}
