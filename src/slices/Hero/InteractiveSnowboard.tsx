"use client";

import { Snowboard1 } from "@/app/components/Snowboard1";
import { ContactShadows, Environment, OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import React, { Suspense } from "react";

type Props = {
  boardTextureURL: string;
  bindingLTextureURL: string;
  bindingRTextureURL: string;
  bindingColor: string;
};

export function InteractiveSnowboard({
  boardTextureURL,
  bindingLTextureURL,
  bindingRTextureURL,
  bindingColor,
}: Props) {
  return (
    <div className="absolute inset-0 z-10 flex items-center justify-center">
      <Canvas
        className="min-h-[60rem] w-full"
        camera={{ position: [1.5, 1, 1.4], fov: 55 }}
      >
        <Suspense>
          <Scene
            boardTextureURL={boardTextureURL}
            bindingLTextureURL={bindingLTextureURL}
            bindingRTextureURL={bindingRTextureURL}
            bindingColor={bindingColor}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}

function Scene({
  boardTextureURL,
  bindingLTextureURL,
  bindingRTextureURL,
  bindingColor,
}: Props) {
  return (
    <group>
      {/* <pointLight position={[1, 1, 1]} intensity={5} />
      <pointLight position={[-2, 1, 1]} intensity={5} /> */}
      <OrbitControls />
      <Environment files={"/hdr/warehouse-256.hdr"} />
      <Snowboard1
        bindingLTextureURLs={[bindingLTextureURL]}
        bindingLTextureURL={bindingLTextureURL}
        bindingRTextureURLs={[bindingRTextureURL]}
        bindingRTextureURL={bindingRTextureURL}
        boardTextureURLs={[boardTextureURL]}
        boardTextureURL={boardTextureURL}
        bindingColor={bindingColor}
        constantWheelSpin
      />
      <ContactShadows opacity={0.6} position={[0, -0.08, 0]} />
    </group>
  );
}
