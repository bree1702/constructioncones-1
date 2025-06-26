import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Box, Cone, Sphere } from '@react-three/drei';
import { Eye, Maximize, Minimize, RotateCcw, Layers } from 'lucide-react';
import * as THREE from 'three';

interface ARVisualizationProps {
  cones: any[];
  lines: any[];
  isVisible: boolean;
  onToggle: () => void;
}

function AnimatedCone({ position, color, type }: { position: [number, number, number], color: string, type: string }) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime) * 0.1;
      meshRef.current.position.y = 0.5 + Math.sin(state.clock.elapsedTime * 2) * 0.1;
    }
  });

  return (
    <group position={position}>
      <Cone ref={meshRef} args={[0.3, 1, 8]} position={[0, 0.5, 0]}>
        <meshStandardMaterial color={color} />
      </Cone>
      <Text
        position={[0, 1.5, 0]}
        fontSize={0.2}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        {type.toUpperCase()}
      </Text>
      <Sphere args={[0.05]} position={[0, 0, 0]}>
        <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.5} />
      </Sphere>
    </group>
  );
}

function TrafficFlow() {
  const particlesRef = useRef<THREE.Points>(null);
  
  useFrame((state) => {
    if (particlesRef.current) {
      const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < positions.length; i += 3) {
        positions[i] += 0.02; // Move along X axis
        if (positions[i] > 10) positions[i] = -10; // Reset position
      }
      particlesRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  const particleCount = 100;
  const positions = new Float32Array(particleCount * 3);
  
  for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 20;
    positions[i * 3 + 1] = Math.random() * 2;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
  }

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.1} color="#60a5fa" />
    </points>
  );
}

function Scene({ cones, lines }: { cones: any[], lines: any[] }) {
  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <pointLight position={[-10, -10, -5]} intensity={0.5} />
      
      {/* Ground plane */}
      <Box args={[20, 0.1, 15]} position={[0, -0.05, 0]}>
        <meshStandardMaterial color="#374151" />
      </Box>
      
      {/* Road markings */}
      <Box args={[20, 0.01, 0.2]} position={[0, 0.01, 0]}>
        <meshStandardMaterial color="#fbbf24" />
      </Box>
      
      {/* Render cones */}
      {cones.map((cone, index) => (
        <AnimatedCone
          key={cone.id}
          position={[index * 2 - cones.length, 0, 0]}
          color={cone.type === 'warning' ? '#f97316' : cone.type === 'closure' ? '#dc2626' : '#2563eb'}
          type={cone.type}
        />
      ))}
      
      {/* Traffic flow visualization */}
      <TrafficFlow />
      
      {/* Safety zone visualization */}
      <Sphere args={[8]} position={[0, 0, 0]}>
        <meshStandardMaterial color="#10b981" transparent opacity={0.1} />
      </Sphere>
      
      <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
    </>
  );
}

export function ARVisualization({ cones, lines, isVisible, onToggle }: ARVisualizationProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showTraffic, setShowTraffic] = useState(true);
  const [viewMode, setViewMode] = useState<'3d' | 'ar' | 'simulation'>('3d');

  return (
    <>
      {/* AR Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={onToggle}
        className={`fixed top-6 right-20 z-40 w-12 h-12 rounded-xl shadow-lg flex items-center justify-center transition-all duration-200 ${
          isVisible
            ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
            : 'bg-white text-gray-600 hover:text-purple-600'
        }`}
      >
        <Eye className="w-6 h-6" />
      </motion.button>

      {/* AR Visualization Panel */}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className={`fixed z-30 bg-white rounded-xl shadow-2xl border border-gray-200 ${
              isFullscreen 
                ? 'inset-4' 
                : 'top-20 right-6 w-96 h-80'
            }`}
          >
            {/* Header */}
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <Eye className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">AR Visualization</h3>
                  <p className="text-xs text-gray-500">3D Construction Zone</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                {/* View Mode Selector */}
                <select
                  value={viewMode}
                  onChange={(e) => setViewMode(e.target.value as any)}
                  className="text-xs border border-gray-300 rounded px-2 py-1"
                >
                  <option value="3d">3D View</option>
                  <option value="ar">AR Mode</option>
                  <option value="simulation">Simulation</option>
                </select>
                
                <button
                  onClick={() => setShowTraffic(!showTraffic)}
                  className={`p-1 rounded ${showTraffic ? 'text-blue-600' : 'text-gray-400'}`}
                >
                  <Layers className="w-4 h-4" />
                </button>
                
                <button
                  onClick={() => setIsFullscreen(!isFullscreen)}
                  className="p-1 text-gray-600 hover:text-gray-900"
                >
                  {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
                </button>
                
                <button
                  onClick={onToggle}
                  className="p-1 text-gray-600 hover:text-gray-900"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* 3D Canvas */}
            <div className="flex-1 relative">
              <Canvas
                camera={{ position: [10, 10, 10], fov: 60 }}
                style={{ width: '100%', height: isFullscreen ? 'calc(100vh - 200px)' : '300px' }}
              >
                <Scene cones={cones} lines={lines} />
              </Canvas>
              
              {/* Overlay Info */}
              <div className="absolute top-4 left-4 bg-black bg-opacity-50 text-white p-3 rounded-lg backdrop-blur-sm">
                <div className="text-sm space-y-1">
                  <div>🚧 Cones: {cones.length}</div>
                  <div>📏 Lines: {lines.length}</div>
                  <div>👁️ Mode: {viewMode.toUpperCase()}</div>
                  <div>🚗 Traffic: {showTraffic ? 'ON' : 'OFF'}</div>
                </div>
              </div>

              {/* Performance Metrics */}
              <div className="absolute bottom-4 right-4 bg-white bg-opacity-90 p-3 rounded-lg backdrop-blur-sm">
                <div className="text-xs space-y-1">
                  <div className="flex justify-between">
                    <span>Safety Score:</span>
                    <span className="font-bold text-green-600">94%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Traffic Flow:</span>
                    <span className="font-bold text-blue-600">Good</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Efficiency:</span>
                    <span className="font-bold text-purple-600">87%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="p-4 border-t border-gray-200 bg-gray-50">
              <div className="grid grid-cols-3 gap-2 text-xs">
                <button className="p-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors">
                  Reset View
                </button>
                <button className="p-2 bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors">
                  Auto Rotate
                </button>
                <button className="p-2 bg-purple-100 text-purple-700 rounded hover:bg-purple-200 transition-colors">
                  Export 3D
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}