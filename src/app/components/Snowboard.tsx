import * as THREE from "three";
import React, { useMemo } from "react";
import { useGLTF, useTexture } from "@react-three/drei";
import { GLTF } from "three-stdlib";

type SnowboardProps = {};

type GLTFResult = GLTF & {
  nodes: {
    frontDiffuse: THREE.Mesh;
    frontRoughness: THREE.Mesh;
    snowboard_low: THREE.Mesh;
  };
  materials: {
    snowboard_low: THREE.MeshStandardMaterial;
  };
};

export function Snowboard(props: SnowboardProps) {
  const { nodes, materials } = useGLTF("/result.gltf") as GLTFResult;

  const frontDiffuse = useTexture("/snowboard/qizi2.webp");
  // const frontRoughness = useTexture("/skateboard/griptape-roughness.webp");

  const gripTapeMaterial = useMemo(() => {
    const material = new THREE.MeshStandardMaterial({
      map: frontDiffuse,
      // bumpMap: frontRoughness,
      // roughnessMap: frontRoughness,
      bumpScale: 3.5,
      roughness: 0,
      color: "#555555",
    });

    return material;
  }, [frontDiffuse]);

  const boltColor = "#555555";

  const boltMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: boltColor,
        metalness: 0.5,
        roughness: 0.3,
      }),
    [boltColor]
  );

  return (
    <group {...props} dispose={null}>
      <group>
        <group name="Scene">
          <mesh
            name="snowboard_low"
            castShadow
            receiveShadow
            geometry={nodes.snowboard_low.geometry}
            material={gripTapeMaterial}
            position={[0.2, 0.1, 0]}
            rotation={[-Math.PI, -3, 0]}
            scale={1.1}
          />
        </group>
      </group>
    </group>
  );
}

useGLTF.preload("/result.gltf");
