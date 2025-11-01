import * as THREE from "three";
import React from "react";
import { useGLTF } from "@react-three/drei";
import { GLTF } from "three-stdlib";

type SnowboardProps = {};

type GLTFResult = GLTF & {
  nodes: {
    snowboard_low: THREE.Mesh;
  };
  materials: {
    snowboard_low: THREE.MeshStandardMaterial;
  };
};

export function Snowboard(props: SnowboardProps) {
  const { nodes, materials } = useGLTF("/result.gltf") as GLTFResult;
  return (
    <group {...props} dispose={null}>
      <group>
        <group name="RootNode">
          <mesh
            name="snowboard_low"
            castShadow
            receiveShadow
            geometry={nodes.snowboard_low.geometry}
            material={materials.snowboard_low}
            position={[0.2, 0.1, 0]}
            rotation={[-Math.PI, -3, 0]}
            scale={1}
          />
        </group>
      </group>
    </group>
  );
}

useGLTF.preload("/result.gltf");
