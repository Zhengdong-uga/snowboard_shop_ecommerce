"use client";

import { Snowboard } from "@/app/components/Snowboard";
import { ContactShadows, Environment, OrbitControls } from "@react-three/drei";
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
          <Scene />
        </Suspense>
      </Canvas>
    </div>
  );
}

function Scene() {
  return (
    <group>
      {/* <pointLight position={[1, 1, 1]} intensity={5} />
      <pointLight position={[-2, 1, 1]} intensity={5} /> */}
      <OrbitControls />
      <Environment files={"/hdr/warehouse-256.hdr"} />
      <Snowboard />
      <ContactShadows opacity={0.6} position={[0, -0.08, 0]} />
    </group>
  );
}
