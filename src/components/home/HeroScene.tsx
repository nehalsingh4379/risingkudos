"use client";

import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";

export const heroScroll = { progress: 0 };

function ClayForms() {
  const group = useRef<THREE.Group>(null);
  const coral = useMemo(() => new THREE.Color("#E07A5F"), []);
  const teal = useMemo(() => new THREE.Color("#3C7A6E"), []);
  const amber = useMemo(() => new THREE.Color("#E8B56A"), []);

  useFrame((_, delta) => {
    if (!group.current) return;
    const p = heroScroll.progress;
    group.current.rotation.y += delta * 0.18 + p * 0.01;
    group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, p * 0.6, 0.08);
    group.current.position.z = THREE.MathUtils.lerp(group.current.position.z, -p * 1.4, 0.08);
  });

  return (
    <group ref={group}>
      <Float speed={1.2} rotationIntensity={0.4} floatIntensity={0.8}>
        <mesh position={[-1.1, 0.2, 0]}>
          <sphereGeometry args={[0.72, 32, 32]} />
          <meshStandardMaterial color={coral} roughness={0.45} metalness={0.08} />
        </mesh>
      </Float>
      <Float speed={1.6} rotationIntensity={0.6} floatIntensity={1}>
        <mesh position={[1.15, 0.55, -0.3]} rotation={[0.4, 0.2, 0.1]}>
          <torusGeometry args={[0.55, 0.18, 24, 48]} />
          <meshStandardMaterial color={teal} roughness={0.4} metalness={0.12} />
        </mesh>
      </Float>
      <Float speed={0.9} rotationIntensity={0.3} floatIntensity={0.6}>
        <mesh position={[0.15, -0.85, 0.4]} rotation={[0.6, 0.8, 0]}>
          <icosahedronGeometry args={[0.5, 0]} />
          <meshStandardMaterial color={amber} roughness={0.35} metalness={0.1} />
        </mesh>
      </Float>
    </group>
  );
}

export default function HeroScene() {
  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 5.2], fov: 42 }}
      gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
    >
      <ambientLight intensity={0.85} />
      <directionalLight position={[3, 4, 5]} intensity={1.1} />
      <directionalLight position={[-4, -2, -3]} intensity={0.35} color="#E8B56A" />
      <ClayForms />
    </Canvas>
  );
}
