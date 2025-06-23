"use client";
import React, { useRef, useEffect, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF, useTexture } from "@react-three/drei";
import * as THREE from "three";

function HumanModel() {
  const { scene } = useGLTF("../human_body.glb");
  const texture = useTexture("/textures/human_texture.jpg");
  const modelRef = useRef<THREE.Group>(null);
  
  // Highlight logic
  useEffect(() => {
    scene.traverse((child) => {
      if (child.isMesh) {
        // Apply both texture and base color
        child.material.map = texture;
        child.material.color = new THREE.Color('#f8d1b3');
        child.material.needsUpdate = true;
      }
    });
  }, [scene, texture]);

  // Slow rotation
  useFrame(() => {
    if (modelRef.current) {
      modelRef.current.rotation.y += 0.003; // slow rotation
    }
  });

  return (
    <primitive
      ref={modelRef}
      object={scene}
      scale={[1.7, 1.7, 1.7]}
      position={[0, -3.5, 0]}
    />
  );
}

export default function HumanScene() {
  return (
    <div className="flex items-center justify-center h-[80vh] w-full">
      <Canvas
        camera={{ position: [0, 2, 15], fov: 35 }}
        style={{ height: 650, width: 500 }}
      >
        <ambientLight intensity={0.8} />
        <directionalLight position={[5, 5, 5]} />
        <directionalLight position={[-5, -5, -5]} />
        <Suspense fallback={null}>
          <HumanModel />
        </Suspense>
        <OrbitControls
          enablePan={false}
          enableZoom={false} // Disable zooming
          minPolarAngle={Math.PI / 3}
          maxPolarAngle={(2 * Math.PI) / 3}
        />
      </Canvas>
    </div>
  );
}