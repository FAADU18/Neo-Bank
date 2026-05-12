import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { useRef } from 'react';
import * as THREE from 'three';

function Building({ position, scale, color }) {
  const ref = useRef();

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3 + position[0]) * 0.03;
      ref.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 1.4 + position[0]) * 0.1;
    }
  });

  return (
    <mesh ref={ref} position={position} scale={scale} castShadow receiveShadow>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.35} metalness={0.45} roughness={0.3} />
    </mesh>
  );
}

function FlowLine({ start, end, hue }) {
  const lineRef = useRef();
  const orbRef = useRef();
  const curve = new THREE.QuadraticBezierCurve3(
    new THREE.Vector3(...start),
    new THREE.Vector3((start[0] + end[0]) / 2, 4, (start[2] + end[2]) / 2),
    new THREE.Vector3(...end),
  );
  const points = curve.getPoints(48);

  useFrame((state) => {
    if (lineRef.current) {
      lineRef.current.material.opacity = 0.55 + Math.sin(state.clock.elapsedTime * 2) * 0.18;
    }

    if (orbRef.current) {
      const t = (state.clock.elapsedTime * 0.12) % 1;
      orbRef.current.position.copy(curve.getPoint(t));
    }
  });

  return (
    <>
      <line ref={lineRef}>
        <bufferGeometry attach="geometry">
          <bufferAttribute attach="attributes-position" count={points.length} array={new Float32Array(points.flatMap((point) => [point.x, point.y, point.z]))} itemSize={3} />
        </bufferGeometry>
        <lineBasicMaterial color={hue} transparent opacity={0.7} />
      </line>
      <mesh ref={orbRef}>
        <sphereGeometry args={[0.14, 16, 16]} />
        <meshBasicMaterial color={hue} />
      </mesh>
    </>
  );
}

function CityGrid() {
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.9, 0]} receiveShadow>
        <planeGeometry args={[24, 24]} />
        <meshStandardMaterial color="#09111d" metalness={0.25} roughness={0.95} />
      </mesh>
      <gridHelper args={[24, 24, '#135d84', '#0b2237']} position={[0, -0.89, 0]} />
    </group>
  );
}

export default function FinancialCityVisualization() {
  return (
    <div className="glass-panel rounded-3xl p-4 sm:p-6">
      <div className="mb-4 flex items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-slate-400">Financial City Visualization</p>
          <h3 className="mt-2 font-display text-2xl text-white">NeoBankX Cyber District</h3>
        </div>
        <span className="neo-chip">Live transaction flow</span>
      </div>
      <div className="h-[360px] overflow-hidden rounded-3xl border border-cyan-400/10 bg-night-900">
        <Canvas camera={{ position: [6, 7, 10], fov: 45 }}>
          <ambientLight intensity={0.55} />
          <directionalLight position={[7, 10, 7]} intensity={1.5} color="#8de7ff" />
          <pointLight position={[-6, 6, -4]} intensity={2.1} color="#0075ff" />
          <CityGrid />
          <group>
            <Building position={[-4, 0.1, -2]} scale={[1.2, 4.5, 1.2]} color="#0ea5e9" />
            <Building position={[-1.5, 0.2, 1.5]} scale={[1, 3.2, 1]} color="#14b8a6" />
            <Building position={[1.7, 0.3, -1]} scale={[1.3, 5.2, 1.3]} color="#38bdf8" />
            <Building position={[4.2, 0.15, 2.2]} scale={[1.1, 4.1, 1.1]} color="#60a5fa" />
            <FlowLine start={[-4, 2.2, -2]} end={[1.7, 2.8, -1]} hue="#00d4ff" />
            <FlowLine start={[-1.5, 1.7, 1.5]} end={[4.2, 2.1, 2.2]} hue="#7dd3fc" />
            <FlowLine start={[4.2, 2.1, 2.2]} end={[-4, 2.2, -2]} hue="#22d3ee" />
          </group>
          <OrbitControls enablePan={false} enableZoom={false} autoRotate autoRotateSpeed={0.7} />
        </Canvas>
      </div>
    </div>
  );
}
