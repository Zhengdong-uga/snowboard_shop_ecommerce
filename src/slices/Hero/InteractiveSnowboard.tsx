"use client";

import { Canvas } from "@react-three/fiber";
import React, { Suspense } from "react";

type Props = {};

export function InteractiveSnowboard({}: Props) {
  return (
    <div className="absolute inset-0 z-10 flex items-center justify-center">
      <Canvas
        className="min-h-[60rem] w-full"
        camera={{ position: [1.5, 1, 1.4], fov: 55 }}
      >
        <Suspense>
          <scene />
        </Suspense>
      </Canvas>
    </div>
  );
}

function Scene() {
  return (
    <group>
      <pointLight position={[1, 1, 1]} />
      <mesh>
        <meshStandardMaterial />
        <boxGeometry />
      </mesh>
    </group>
  );
}
