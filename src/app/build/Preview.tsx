"use client";

import {
  CameraControls,
  Environment,
  Preload,
  useTexture,
} from "@react-three/drei";
import * as THREE from "three";
import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect, useRef } from "react";
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
  const floorRef = useRef<THREE.Mesh>(null);

  const { selectedBoard, selectedBindingL, selectedBindingR } =
    useCustomizerControls();

  const boardTextureURL =
    asImageSrc(selectedBoard?.texture) ?? DEFAULT_BOARD_TEXTURE;
  const bindinglTextureURL =
    asImageSrc(selectedBindingL?.texture) ?? DEFAULT_BINDINGL_TEXTURE;
  const bindingrTextureURL =
    asImageSrc(selectedBindingR?.texture) ?? DEFAULT_BINDINGR_TEXTURE;

  useEffect(() => {
    setCameraControls(
      new THREE.Vector3(0, 0.3, 0),
      new THREE.Vector3(1.5, 0.8, 0)
    );
  }, [selectedBoard]);

  useEffect(() => {
    setCameraControls(
      new THREE.Vector3(-0.12, 0.29, 0.57),
      new THREE.Vector3(0.1, 0.25, 0.9)
    );
  }, [selectedBindingL]);

  useEffect(() => {
    setCameraControls(
      new THREE.Vector3(-0.08, 0.54, 0.64),
      new THREE.Vector3(0.09, 1, 0.9)
    );
  }, [selectedBindingR]);

  function setCameraControls(target: THREE.Vector3, pos: THREE.Vector3) {
    if (!cameraControls.current) return;

    cameraControls.current.setTarget(target.x, target.y, target.z, true);
    cameraControls.current.setPosition(pos.x, pos.y, pos.z, true);
  }

  function onCameraControlStart() {
    if (
      !cameraControls.current ||
      !floorRef.current ||
      cameraControls.current.colliderMeshes.length > 0
    )
      return;

    cameraControls.current.colliderMeshes = [floorRef.current];
  }

  return (
    <Canvas camera={{ position: [0, 0, 3], fov: 50 }} shadows>
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
        <fog attach="fog" args={[ENVIRONMENT_COLOR, 3, 10]} />
        <color attach="background" args={[ENVIRONMENT_COLOR]} />
        <StageFloor />
        <mesh rotation={[-Math.PI / 2, 0, 0]} ref={floorRef}>
          <planeGeometry args={[6, 6]} />
          <meshBasicMaterial visible={false} />
        </mesh>
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
          onStart={onCameraControlStart}
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
