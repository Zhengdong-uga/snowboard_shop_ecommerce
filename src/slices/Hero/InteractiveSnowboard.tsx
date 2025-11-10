"use client";

import * as THREE from "three";
import { Snowboard1 } from "@/app/components/Snowboard1";
import { ContactShadows, Environment, OrbitControls } from "@react-three/drei";
import { Canvas, ThreeEvent } from "@react-three/fiber";
import React, { Suspense, useRef } from "react";
import gsap from "gsap";

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
  const containerRef = useRef<THREE.Group>(null);

  function onClick(event: ThreeEvent<MouseEvent>) {
    event.stopPropagation();

    const board = containerRef.current;

    if (!board) return;

    const { name } = event.object;

    //Ollie jump
    gsap
      .timeline()
      .to(board.position, {
        y: 0.8,
        duration: 0.51,
        ease: "power2.out",
        delay: 0.26,
      })
      .to(board.position, {
        y: 0,
        duration: 0.43,
        rease: "power2.in",
      });

    gsap
      .timeline()
      .to(board.rotation, { x: -0.6, duration: 0.26, ease: "none" })
      .to(board.rotation, { x: 0.4, duration: 0.82, ease: "power2.in" })
      .to(board.rotation, { x: 0, duration: 0.12, ease: "none" });
  }

  return (
    <group>
      {/* <pointLight position={[1, 1, 1]} intensity={5} />
      <pointLight position={[-2, 1, 1]} intensity={5} /> */}
      <OrbitControls />
      <Environment files={"/hdr/warehouse-256.hdr"} />
      <group ref={containerRef}>
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

        <mesh position={[0, 0.1, 0]} name="middle" onClick={onClick}>
          <boxGeometry args={[0.6, 0.1, 2]} />
          <meshStandardMaterial visible={false} />
        </mesh>
      </group>
      <ContactShadows opacity={0.6} position={[0, -0.08, 0]} />
    </group>
  );
}
