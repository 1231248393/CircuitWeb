import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrthographicCamera, OrbitControls, Grid, Environment } from '@react-three/drei';
import DraggableComponent from './DraggableComponent';

export default function Scene3D() {
  const [isDragging, setIsDragging] = useState(false);

  return (
    <div style={{ width: '100%', height: '100vh', background: '#f0f0f0' }}>
      <Canvas shadows dpr={[1, 2]}>
        {/* Soft lighting for realistic shadows */}
        <ambientLight intensity={0.5} />
        <directionalLight 
          castShadow 
          position={[50, 50, 50]} 
          intensity={1.5} 
          shadow-mapSize-width={2048} 
          shadow-mapSize-height={2048} 
        />
        
        {/* Environment for realistic reflections on metallic pins */}
        <Environment preset="city" />

        {/* The ground plane for shadows */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[100, 100]} />
          <meshStandardMaterial color="#e0e0e0" />
        </mesh>

        {/* 3D Grid */}
        <Grid infiniteGrid cellSize={1} sectionSize={5} fadeDistance={50} />

        {/* Tinkercad Style Camera */}
        <OrthographicCamera makeDefault zoom={50} position={[100, 100, 100]} />
        <OrbitControls 
          makeDefault 
          enabled={!isDragging} 
          minZoom={20} 
          maxZoom={100} 
          maxPolarAngle={Math.PI / 2.1} // Prevent going below the floor
        />

        {/* Your 3D Components */}
        <DraggableComponent 
          url="/models/arduino.glb" 
          position={[0, 0, 0]} 
          onDragStart={() => setIsDragging(true)}
          onDragEnd={() => setIsDragging(false)}
        />
      </Canvas>
    </div>
  );
}