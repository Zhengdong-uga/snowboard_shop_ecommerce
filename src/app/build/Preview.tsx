"use client";

import {
  CameraControls,
  Environment,
  Preload,
  useTexture,
} from "@react-three/drei";
import * as THREE from "three";
import { Canvas } from "@react-three/fiber";
import { Suspense, useRef } from "react";
import { useCustomizerControls } from "./context";
import { asImageSrc } from "@prismicio/client";
import { Snowboard1 } from "../components/Snowboard1";

const DEFAULT_BOARD_TEXTURE = "/snowboard/Board_Variant_A.png";
const DEFAULT_BINDINGL_TEXTURE = "/snowboard/BindingTextures/MetalPlates.jpg";
const DEFAULT_BINDINGR_TEXTURE = "/snowboard/BindingTextures/MetalPlates.jpg";

const ENVIRONMENT_COLOR = "#3B3A3A";

type Props = {
  boardTextureURLs: string[];
  bindinglTextureURLs: string[];
  bindingrTextureURLs: string[];
};

export default function Preview({
  boardTextureURLs,
  bindinglTextureURLs,
  bindingrTextureURLs,
}: Props) {
  const cameraControls = useRef<CameraControls>(null);
  const { selectedBoard, selectedBindingL, selectedBindingR } =
    useCustomizerControls();

  const boardTextureURL =
    asImageSrc(selectedBoard?.texture) ?? DEFAULT_BOARD_TEXTURE;
  const bindinglTextureURL =
    asImageSrc(selectedBindingL?.texture) ?? DEFAULT_BINDINGL_TEXTURE;
  const bindingrTextureURL =
    asImageSrc(selectedBindingR?.texture) ?? DEFAULT_BINDINGR_TEXTURE;

  return (
    <Canvas shadows>
      <Suspense fallback={null}>
        <Environment
          files={"/hdr/warehouse-512.hdr"}
          environmentIntensity={0.6}
        />
        <directionalLight
          castShadow
          lookAt={[0, 0, 0]}
          position={[1, 1, -1]}
          intensity={1.6}
        />
        <StageFloor />
        <Snowboard1
          bindingLTextureURLs={bindinglTextureURLs}
          bindingLTextureURL={bindinglTextureURL}
          bindingRTextureURLs={bindingrTextureURLs}
          bindingRTextureURL={bindingrTextureURL}
          boardTextureURLs={boardTextureURLs}
          boardTextureURL={boardTextureURL}
          pose="side"
        />
        <CameraControls
          ref={cameraControls}
          minDistance={0.2}
          maxDistance={4}
        />
      </Suspense>
      <Preload all />
    </Canvas>
  );
}

function StageFloor() {
  const normalMap = useTexture("/concrete-normal.avif");
  normalMap.wrapS = THREE.RepeatWrapping;
  normalMap.wrapT = THREE.RepeatWrapping;
  normalMap.repeat.set(30, 30);
  normalMap.anisotropy = 8;

  const material = new THREE.MeshStandardMaterial({
    roughness: 0.75,
    color: ENVIRONMENT_COLOR,
    normalMap: normalMap,
  });
  return (
    <mesh
      castShadow
      receiveShadow
      position={[0, -0.18, 0]}
      rotation={[-Math.PI / 2, 0, 0]}
      material={material}
    >
      <circleGeometry args={[20, 32]} />
    </mesh>
  );
}
