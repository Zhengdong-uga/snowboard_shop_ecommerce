import * as THREE from "three";
import React, { useMemo } from "react";
import { useGLTF, useTexture } from "@react-three/drei";
import { GLTF } from "three-stdlib";

type SnowboardProps = {
  bindingLTextureURLs: string[];
  bindingLTextureURL: string;
  bindingRTextureURLs: string[];
  bindingRTextureURL: string;
  boardTextureURLs: string[];
  boardTextureURL: string;
  bindingColor: string;
  constantWheelSpin?: boolean;
};

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

export function Snowboard1({
  bindingLTextureURLs,
  bindingLTextureURL,
  bindingRTextureURLs,
  bindingRTextureURL,
  boardTextureURLs,
  boardTextureURL,
  bindingColor,
}: SnowboardProps) {
  const { nodes } = useGLTF("/result.gltf") as GLTFResult;
  const frontDiffuse = useTexture("/snowboard/Board_Variant_A.png");
  const frontDiffuse2 = useTexture("/snowboard/greg-gossel.jpg");
  frontDiffuse.flipY = false;
  // const frontRoughness = useTexture("/skateboard/griptape-roughness.webp");

  //render left binding textures
  const bindingLTextures = useTexture(bindingLTextureURLs);
  bindingLTextures.forEach((texture) => {
    texture.flipY = false;
    texture.colorSpace = THREE.SRGBColorSpace;
  });
  const bindingLTextureIndex = bindingLTextureURLs.findIndex(
    (url) => url === bindingLTextureURL
  );
  const bindingLTexture = bindingLTextures[bindingLTextureIndex];

  //render right binding textures
  const bindingRTextures = useTexture(bindingRTextureURLs);
  bindingRTextures.forEach((texture) => {
    texture.flipY = false;
    texture.colorSpace = THREE.SRGBColorSpace;
  });
  const bindingRTextureIndex = bindingRTextureURLs.findIndex(
    (url) => url === bindingRTextureURL
  );
  const bindingRTexture = bindingRTextures[bindingRTextureIndex];

  //render boardTexture
  const boardTextures = useTexture(boardTextureURLs);
  boardTextures.forEach((texture) => {
    texture.flipY = false;
    texture.colorSpace = THREE.SRGBColorSpace;
  });
  const boardTextureIndex = boardTextureURLs.findIndex(
    (url) => url === boardTextureURL
  );
  const boardTexture = boardTextures[boardTextureIndex];

  //materials
  const boardMaterial = useMemo(() => {
    const material = new THREE.MeshStandardMaterial({
      map: boardTexture,
      // bumpMap: frontRoughness,
      // roughnessMap: frontRoughness,
      bumpScale: 0,
      roughness: 0,
    });
    return material;
  }, [boardTexture]);

  // const bindingLTexture = useTexture("snowboard/BindingTextures/Onyx.jpg");
  // bindingLTexture.flipY = false;
  // // const bindingRTexture = useTexture(
  // //   "snowboard/BindingTextures/MetalPlates006.jpg"
  // // );
  // bindingRTexture.flipY = false;

  const bindingMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        map: bindingLTexture,
        roughness: 0.3,
        color: bindingColor,
      }),
    [bindingLTexture, bindingColor]
  );

  const binding2Material = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        map: bindingRTexture,
        roughness: 0.3,
        color: bindingColor,
      }),
    [bindingRTexture, bindingColor]
  );

  return (
    <group dispose={null}>
      <group>
        <group name="Scene">
          <group name="Sbowboard_Variant_A" rotation={[0.11, -1.75, 0.19]}>
            {/* {[0.11, -1.75, 0.19]}> version1 */}
            {/* {[1, -2.9, 0.6]} version2*/}
            <mesh
              name="Binding_l"
              castShadow
              receiveShadow
              geometry={nodes.Binding_l.geometry}
              material={binding2Material}
              position={[-0.7, 0.11, -0.33]}
              scale={0.015}
            />
            <mesh
              name="Binding_r"
              castShadow
              receiveShadow
              geometry={nodes.Binding_r.geometry}
              material={bindingMaterial}
              position={[0.02, 0.11, -0.33]}
              scale={0.015}
            />
            <mesh
              name="board"
              castShadow
              receiveShadow
              geometry={nodes.board.geometry}
              material={boardMaterial}
              position={[-0.3, 0.1, -0.3]}
              // version 1 position={[-0.3, 0.1, -0.3]}
              // version 2 position={[-0.3, 0.1, -0.05]}
              scale={0.015}
              // scale={0.012}
            />
          </group>
        </group>
      </group>
    </group>
  );
}

useGLTF.preload("/result.gltf");
