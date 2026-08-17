import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, TorusKnot, Float, Stars } from '@react-three/drei';
import * as THREE from 'three';

const AnimatedShape = () => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.getElapsedTime() * 0.15;
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.2;
    }
  });

  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={2}>
      <TorusKnot ref={meshRef} args={[2, 0.4, 256, 64]} scale={1.2}>
        <meshStandardMaterial
          color="#3b82f6"
          emissive="#1d4ed8"
          emissiveIntensity={0.8}
          roughness={0.2}
          metalness={0.9}
          wireframe={true}
        />
      </TorusKnot>
    </Float>
  );
};

const Hero3D = () => {
  return (
    <div className="absolute inset-0 w-full h-full -z-10 bg-[#03050a]">
      <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
        <fog attach="fog" args={['#03050a', 5, 20]} />
        <ambientLight intensity={0.2} />
        <directionalLight position={[10, 10, 10]} intensity={1.5} color="#60a5fa" />
        <directionalLight position={[-10, -10, -10]} intensity={2} color="#93c5fd" />
        <pointLight position={[0, 0, 0]} intensity={1} color="#2563eb" />
        
        <Stars radius={100} depth={50} count={3000} factor={4} saturation={1} fade speed={1} />
        <AnimatedShape />
        
        <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.8} />
      </Canvas>
      {/* Gradient overlay so text remains readable */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#03050a]/60 to-[#03050a]" />
    </div>
  );
};

export default Hero3D;
