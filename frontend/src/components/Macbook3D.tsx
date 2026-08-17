import { useRef, useEffect, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { ContactShadows, RoundedBox, Html } from '@react-three/drei';
import * as THREE from 'three';
import { FaApple } from 'react-icons/fa';

export default function Macbook3D() {
  const group = useRef<THREE.Group>(null);
  const lid = useRef<THREE.Group>(null);
  const { viewport } = useThree();
  const [scrollProgress, setScrollProgress] = useState(0);
  
  // Responsive scale based on viewport width
  const isMobile = viewport.width < 6;
  const responsiveScale = isMobile ? viewport.width / 7 : 1;
  const responsiveY = isMobile ? -0.2 : -0.5;

  // Track scroll for UI updates in HTML
  useEffect(() => {
    const handleScroll = () => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const progress = maxScroll > 0 ? Math.min(window.scrollY / maxScroll, 1) : 0;
      setScrollProgress(progress);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    // Initial call
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  useFrame((_, delta) => {
    if (group.current && lid.current) {
      const scrollY = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const progress = maxScroll > 0 ? Math.min(scrollY / maxScroll, 1) : 0;
      
      // Hinge logic: Start closed, open during the first 15% of the page
      const r1 = Math.min(progress / 0.15, 1);
      const closedAngle = Math.PI / 2;
      const openAngle = 0.1;
      lid.current.rotation.x = THREE.MathUtils.damp(lid.current.rotation.x, closedAngle - (r1 * (closedAngle - openAngle)), 4, delta);
      
      // Calculate target position and rotation based on sections
      let targetX = 0;
      let targetRotY = 0;
      let targetY = responsiveY;

      if (progress < 0.15) {
        // Hero Section (0-15%): Center, straight
        targetX = 0;
        targetRotY = 0;
      } else if (progress >= 0.15 && progress < 0.45) {
        // Evolution Section (15-45%): Move left, face right. HTML text is on the right.
        targetX = isMobile ? 0 : -2.5;
        targetRotY = isMobile ? 0 : 0.3;
        targetY = responsiveY + 0.5;
      } else if (progress >= 0.45 && progress < 0.8) {
        // Weapons Section (45-80%): Move right, face left. HTML text is on the left.
        targetX = isMobile ? 0 : 2.5;
        targetRotY = isMobile ? 0 : -0.3;
        targetY = responsiveY + 0.5;
      } else {
        // CTA Section (80-100%): Back to center, maybe move down slightly
        targetX = 0;
        targetRotY = 0;
        targetY = responsiveY;
      }

      // Smoothly animate to targets
      group.current.position.x = THREE.MathUtils.damp(group.current.position.x, targetX, 3, delta);
      group.current.position.y = THREE.MathUtils.damp(group.current.position.y, targetY, 3, delta);
      group.current.rotation.y = THREE.MathUtils.damp(group.current.rotation.y, targetRotY, 3, delta);
    }
  });

  // Determine what the screen should explain based on scroll progress
  let screenTitle = "LOCAL2BRAND";
  let screenSubtitle = "Initializing digital footprint...";
  let screenColor = "text-cyan-400";
  let gradient = "from-pink-500 to-violet-500";

  if (scrollProgress > 0.8) {
    screenTitle = "SYSTEM READY";
    screenSubtitle = "Awaiting command: Audit My Business.";
    screenColor = "text-orange-400";
    gradient = "from-orange-400 to-pink-500";
  } else if (scrollProgress > 0.45) {
    screenTitle = "WEAPONS ONLINE";
    screenSubtitle = "Deploying Web Engineering & SEO Dominance.";
    screenColor = "text-emerald-400";
    gradient = "from-emerald-400 to-cyan-400";
  } else if (scrollProgress > 0.15) {
    screenTitle = "EVOLUTION PROTOCOL";
    screenSubtitle = "Executing Phase 1: Strategic Market Audit.";
    screenColor = "text-pink-400";
    gradient = "from-pink-500 to-violet-400";
  }

  // Premium Aluminum Material
  const aluminumMaterial = new THREE.MeshStandardMaterial({
    color: '#e4e4e7', // zinc-200
    roughness: 0.3,
    metalness: 0.8,
  });

  const darkAluminumMaterial = new THREE.MeshStandardMaterial({
    color: '#71717a', // zinc-500
    roughness: 0.5,
    metalness: 0.9,
  });

  const keyboardMaterial = new THREE.MeshStandardMaterial({
    color: '#18181b', // zinc-900
    roughness: 0.8,
  });

  return (
    <group ref={group} position={[0, responsiveY, 0]} scale={[responsiveScale, responsiveScale, responsiveScale]} dispose={null}>
      
      {/* Laptop Base */}
      <group position={[0, 0, 0]}>
        <RoundedBox args={[4, 0.1, 3]} radius={0.05} smoothness={4} material={aluminumMaterial} />
        {/* Trackpad */}
        <RoundedBox args={[1.5, 0.11, 1]} position={[0, 0, 0.8]} radius={0.02} material={darkAluminumMaterial} />
        {/* Keyboard area */}
        <RoundedBox args={[3.6, 0.11, 1.4]} position={[0, 0, -0.6]} radius={0.02} material={keyboardMaterial} />
      </group>

      {/* Laptop Lid (Hinged at the back of the base) */}
      <group position={[0, 0.05, -1.4]} ref={lid} rotation={[Math.PI / 2, 0, 0]}>
        <group position={[0, 1.25, 0]}>
          {/* Lid Casing */}
          <RoundedBox args={[4, 2.5, 0.1]} radius={0.05} smoothness={4} material={aluminumMaterial} />
          
          {/* Apple Logo on the back of the lid */}
          <Html
            position={[0, 0, -0.051]}
            rotation={[0, Math.PI, 0]}
            transform
          >
            <div className="flex items-center justify-center w-[50px] h-[50px] text-zinc-400/80 drop-shadow-md">
              <FaApple className="w-16 h-16" />
            </div>
          </Html>

          {/* Screen Bezel (Black) */}
          <mesh position={[0, 0, 0.051]}>
            <planeGeometry args={[3.9, 2.4]} />
            <meshBasicMaterial color="#000000" />
          </mesh>
          
          {/* Active Screen Area */}
          <mesh position={[0, 0, 0.052]}>
            <planeGeometry args={[3.7, 2.2]} />
            <meshBasicMaterial color="#03050a" />
            
            {/* HTML Screen Overlay - Removed occlude to fix flickering, exactly matches plane size */}
            <Html
              className="w-[370px] h-[220px] bg-[#03050a] flex flex-col p-6 overflow-hidden text-white border-[4px] border-[#03050a]"
              position={[0, 0, 0]}
              transform
            >
              <div className="w-full h-full flex flex-col pointer-events-none">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                </div>
                <div className={`${screenColor} text-sm font-mono mb-2 transition-colors duration-500`}>~ /local2brand/core</div>
                <div className="text-sm font-mono text-green-400 mb-1">$ {screenSubtitle}</div>
                <div className="text-sm font-mono text-blue-300 mb-6">[INFO] Processing layout data...</div>
                
                <h1 className={`text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r ${gradient} mt-auto transition-all duration-700`}>
                  {screenTitle}
                </h1>
              </div>
            </Html>
          </mesh>
        </group>
      </group>
      
      {/* Cool shadow below laptop */}
      <ContactShadows position={[0, -0.05, 0]} opacity={0.7} scale={20} blur={2} far={4.5} />
    </group>
  );
}
