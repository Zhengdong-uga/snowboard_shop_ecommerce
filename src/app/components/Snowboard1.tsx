import * as THREE from "three";
import React, { useMemo } from "react";
import { useGLTF, useTexture } from "@react-three/drei";
import { GLTF } from "three-stdlib";

type SnowboardProps = {};

type GLTFResult = GLTF & {
  nodes: {
    Binding_l: THREE.Mesh;
    Binding_r: THREE.Mesh;
    board: THREE.Mesh;
  };
  materials: {
    Binding: THREE.MeshStandardMaterial;
    Board_Variant_A: THREE.MeshStandardMaterial;
  };
};

export function Snowboard1(props: SnowboardProps) {
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
          <group name="Sbowboard_Variant_A" rotation={[0.2, -1.7, 0.11]}>
            <mesh
              name="Binding_l"
              castShadow
              receiveShadow
              geometry={nodes.Binding_l.geometry}
              material={materials.Binding}
              position={[-0.25, 0.01, 0]}
              scale={0.01}
            />
            <mesh
              name="Binding_r"
              castShadow
              receiveShadow
              geometry={nodes.Binding_r.geometry}
              material={materials.Binding}
              position={[0.2, 0.01, 0]}
              scale={0.01}
            />
            <mesh
              name="board"
              castShadow
              receiveShadow
              geometry={nodes.board.geometry}
              material={materials.Board_Variant_A}
              position={[0, 0, 0]}
              scale={0.01}
            />
          </group>
        </group>
      </group>
    </group>
  );
}

useGLTF.preload("/result.gltf");
