import React, { useRef } from 'react';
import { useGLTF } from '@react-three/drei';
import { useDrag } from '@use-gesture/react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';

export default function DraggableComponent({ url, position, onDragStart, onDragEnd }) {
  const { scene } = useGLTF(url); // Load the GLTF model
  const meshRef = useRef();
  const { camera, size, viewport } = useThree();
  
  // Plane for raycasting (Y=0 is the floor)
  const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();

  const bind = useDrag(({ active, first, last, xy: [x, y] }) => {
    if (first) onDragStart();
    if (last) onDragEnd();

    if (active) {
      // Convert 2D screen coordinates to 3D space
      mouse.x = (x / size.width) * 2 - 1;
      mouse.y = -(y / size.height) * 2 + 1;
      
      raycaster.setFromCamera(mouse, camera);
      
      const intersection = new THREE.Vector3();
      raycaster.ray.intersectPlane(plane, intersection);
      
      if (intersection && meshRef.current) {
        // Update the position on the X and Z axes (keep Y at 0)
        meshRef.current.position.x = intersection.x;
        meshRef.current.position.z = intersection.z;
      }
    }
  });

  return (
    <primitive 
      ref={meshRef} 
      object={scene} 
      position={position} 
      castShadow 
      receiveShadow
      {...bind()} 
      onClick={(e) => {
        e.stopPropagation(); // Prevents clicking the background
        console.log('Component Selected!');
        // Here you would open your Properties Panel
      }}
    />
  );
}