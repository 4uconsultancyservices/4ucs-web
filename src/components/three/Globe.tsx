'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

function GlobeCore() {
  const globeRef  = useRef<THREE.Mesh>(null);
  const wireRef   = useRef<THREE.Mesh>(null);
  const glowRef   = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (globeRef.current)  globeRef.current.rotation.y  = t * 0.15;
    if (wireRef.current)   wireRef.current.rotation.y   = t * 0.12;
    if (glowRef.current)   glowRef.current.rotation.y   = t * 0.08;
  });

  return (
    <>
      {/* Core */}
      <mesh ref={globeRef}>
        <sphereGeometry args={[2, 64, 64]} />
        <MeshDistortMaterial color="#051530" wireframe={false} distort={0.08} speed={0.5} roughness={0.8} metalness={0.2} />
      </mesh>
      {/* Wireframe overlay */}
      <mesh ref={wireRef} scale={1.01}>
        <sphereGeometry args={[2, 24, 24]} />
        <meshBasicMaterial color="#0066ff" wireframe transparent opacity={0.07} />
      </mesh>
      {/* Atmosphere glow */}
      <mesh ref={glowRef} scale={1.18}>
        <sphereGeometry args={[2, 32, 32]} />
        <meshBasicMaterial color="#0033aa" transparent opacity={0.05} side={THREE.BackSide} />
      </mesh>
    </>
  );
}

function NetworkNodes({ count = 80 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const phi   = Math.acos(-1 + (2 * i) / count);
      const theta = Math.sqrt(count * Math.PI) * phi;
      const r = 2.06;
      pos[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);
    }
    return pos;
  }, [count]);

  useFrame((state) => {
    if (ref.current) ref.current.rotation.y = state.clock.elapsedTime * 0.15;
  });

  return (
    <Points ref={ref} positions={positions} stride={3}>
      <PointMaterial transparent color="#22d3ee" size={0.055} sizeAttenuation depthWrite={false} opacity={0.9} />
    </Points>
  );
}

function OrbitRing({ radius, tilt, speed, color }: { radius: number; tilt: number; speed: number; color: string }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (ref.current) ref.current.rotation.z = state.clock.elapsedTime * speed;
  });
  return (
    <mesh ref={ref} rotation={[tilt, 0, 0]}>
      <torusGeometry args={[radius, 0.003, 8, 120]} />
      <meshBasicMaterial color={color} transparent opacity={0.28} />
    </mesh>
  );
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.4} />
      <pointLight position={[5, 5, 5]}   intensity={2}   color="#60b0ff" />
      <pointLight position={[-5, -2, 3]} intensity={1}   color="#7c3aed" />

      <GlobeCore />
      <NetworkNodes count={80} />

      <OrbitRing radius={2.8} tilt={0.4}  speed={0.3}  color="#0066ff" />
      <OrbitRing radius={3.2} tilt={-0.6} speed={-0.2} color="#7c3aed" />
      <OrbitRing radius={3.6} tilt={1.1}  speed={0.15} color="#22d3ee" />
    </>
  );
}

export default function Globe3D({ className = '' }: { className?: string }) {
  return (
    <div className={`w-full h-full ${className}`}>
      <Canvas
        camera={{ position: [0, 0, 6], fov: 45 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        dpr={[1, 1.5]}
      >
        <Scene />
      </Canvas>
    </div>
  );
}
