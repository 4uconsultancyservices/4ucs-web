'use client';

import { useRef, useMemo, useCallback } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Points, PointMaterial, Float, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

function ParticleField({ count = 2500 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3]     = (Math.random() - 0.5) * 20;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 20;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 20;
    }
    return arr;
  }, [count]);

  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.x = state.clock.elapsedTime * 0.025;
    ref.current.rotation.y = state.clock.elapsedTime * 0.04;
  });

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial transparent color="#0066ff" size={0.014} sizeAttenuation depthWrite={false} opacity={0.45} />
    </Points>
  );
}

function FloatingOrb({ position, color, scale = 1 }: { position: [number, number, number]; color: string; scale?: number }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (!ref.current) return;
    ref.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.6 + position[0]) * 0.3;
    ref.current.rotation.x = state.clock.elapsedTime * 0.08;
    ref.current.rotation.z = state.clock.elapsedTime * 0.06;
  });
  return (
    <mesh ref={ref} position={position} scale={scale}>
      <sphereGeometry args={[0.8, 32, 32]} />
      <MeshDistortMaterial color={color} transparent opacity={0.13} distort={0.4} speed={2} roughness={0} metalness={0.8} />
    </mesh>
  );
}

function AnimatedGrid() {
  const ref = useRef<THREE.GridHelper>(null);
  useFrame((state) => {
    if (!ref.current) return;
    ref.current.position.z = (state.clock.elapsedTime * 0.5) % 2;
  });
  return <gridHelper ref={ref} args={[30, 30, '#0066ff', '#0a1628']} position={[0, -3, 0]} />;
}

function MouseCamera() {
  const { camera } = useThree();
  const target = useRef({ x: 0, y: 0 });

  useFrame(() => {
    camera.position.x += (target.current.x * 1.5 - camera.position.x) * 0.05;
    camera.position.y += (target.current.y * 0.8  - camera.position.y) * 0.05;
    camera.lookAt(0, 0, 0);
  });

  return null;
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.2} />
      <pointLight position={[5, 5, 5]}   intensity={1}   color="#0066ff" />
      <pointLight position={[-5, -3, -5]} intensity={0.8} color="#7c3aed" />
      <pointLight position={[0, 5, -3]}  intensity={0.6} color="#22d3ee" />

      <ParticleField count={2200} />
      <AnimatedGrid />

      <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.5}>
        <FloatingOrb position={[-3, 1, -2]}    color="#0066ff" scale={1.2} />
      </Float>
      <Float speed={1.2} rotationIntensity={0.4} floatIntensity={0.7}>
        <FloatingOrb position={[3.5, -0.5, -3]} color="#7c3aed" scale={1.5} />
      </Float>
      <Float speed={2} rotationIntensity={0.2} floatIntensity={0.4}>
        <FloatingOrb position={[0, 2.5, -4]}   color="#22d3ee" scale={0.8} />
      </Float>

      <MouseCamera />
    </>
  );
}

export default function HeroScene() {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 60 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        dpr={[1, 1.5]}
      >
        <Scene />
      </Canvas>
    </div>
  );
}
