"use client";

import * as THREE from "three";
import { Snowboard1 } from "@/app/components/Snowboard1";
import { ContactShadows, Environment, OrbitControls } from "@react-three/drei";
import { Canvas, ThreeEvent } from "@react-three/fiber";
import React, { Suspense, useRef, useState } from "react";
import gsap from "gsap";
import { Hotspot } from "./Hotspot";

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

  const [animating, setAnimating] = useState(false);
  const [showHotspot, setShowHotspot] = useState({
    back: true,
    side: true,
    front: true,
  });

  function onClick(event: ThreeEvent<MouseEvent>) {
    event.stopPropagation();

    const board = containerRef.current;
    if (!board || animating) return;

    const { name } = event.object;

    setShowHotspot((current) => ({ ...current, [name]: false }));

    if (name === "back") {
      ollie(board);
    } else if (name === "front") {
      switchEdgeCycle(board); // 换刃
    } else if (name === "side") {
      powerslideBackside(board); // 后刃 powerslide
    }
  }

  function jumpBoard(board: THREE.Group) {
    // Ollie jump
    setAnimating(true);
    gsap
      .timeline({ onComplete: () => setAnimating(false) })
      .to(board.position, {
        y: 0.8,
        duration: 0.51,
        ease: "power2.out",
        delay: 0.26,
      })
      .to(board.position, {
        y: 0,
        duration: 0.43,
        ease: "power2.in",
      });
  }

  function ollie(board: THREE.Group) {
    jumpBoard(board);

    gsap
      .timeline({ onComplete: () => setAnimating(false) })
      .to(board.rotation, { x: -0.6, duration: 0.26, ease: "none" })
      .to(board.rotation, { x: 0.4, duration: 0.82, ease: "power2.in" })
      .to(board.rotation, { x: 0, duration: 0.12, ease: "none" });
  }

  // 刻滑（仅旋转；右 → 左 → 中），用四元数组合避免初始旋转耦合
  function switchEdgeCycle(board: THREE.Group) {
    setAnimating(true);
    // 初始姿态（四元数）
    const q0 = board.quaternion.clone();

    // 动画参数（单位：弧度）
    const params = { yaw: 0, pitch: 0, roll: 0 };

    // 应用函数：q = q0 * Ry(yaw) * Rx(pitch) * Rz(roll)
    const setQ = () => {
      const qYaw = new THREE.Quaternion().setFromAxisAngle(
        new THREE.Vector3(0, 1, 0),
        params.yaw
      );
      const qPitch = new THREE.Quaternion().setFromAxisAngle(
        new THREE.Vector3(1, 0, 0),
        params.pitch
      );
      const qRoll = new THREE.Quaternion().setFromAxisAngle(
        new THREE.Vector3(0, 0, 1),
        params.roll
      );
      const q = q0.clone().multiply(qYaw).multiply(qPitch).multiply(qRoll);
      board.quaternion.copy(q);
    };

    // 停止旧动画
    gsap.killTweensOf(params);

    // 动作幅度（左右对称）
    const EDGE = 0.6; // 吃刃（roll：右为 +、左为 -）
    const YAW = 0.14; // 顺势转向
    const PITCH = 0.06; // 轻压板头（适度，避免“翘尾”）
    const SPEED = 4; // 越大越慢（你喜欢的节奏）

    const tl = gsap.timeline({ onComplete: () => setAnimating(false) });

    // 0) 预加载（轻微反压到左，准备入右刻）
    tl.to(params, {
      roll: -0.05,
      duration: 0.1 * SPEED,
      ease: "power2.in",
      onUpdate: setQ,
    });

    // ===== 1) 右刻（Yaw 先，后 Roll + Pitch；随后轻微“反挠”降一点 Pitch）=====
    tl.to(
      params,
      {
        yaw: -YAW * 0.7,
        duration: 0.12 * SPEED,
        ease: "power2.out",
        onUpdate: setQ,
      },
      ">-0.03"
    );

    tl.to(
      params,
      {
        roll: EDGE * 0.9,
        duration: 0.18 * SPEED,
        ease: "power3.out",
        onUpdate: setQ,
      },
      "<"
    );

    tl.to(
      params,
      {
        pitch: PITCH,
        duration: 0.18 * SPEED,
        ease: "power3.out",
        onUpdate: setQ,
      },
      "<"
    );

    tl.to(params, {
      yaw: -YAW,
      roll: EDGE,
      duration: 0.12 * SPEED,
      ease: "sine.inOut",
      onUpdate: setQ,
    });

    // 右侧防“翘尾”：姿态成形后，稍微回一点 pitch
    tl.to(params, {
      pitch: PITCH * 0.75,
      duration: 0.08 * SPEED,
      ease: "sine.out",
      onUpdate: setQ,
    });

    // 2) 卸重过刃（右 → 中）
    tl.to(params, {
      roll: EDGE * 0.25,
      yaw: -YAW * 0.4,
      duration: 0.14 * SPEED,
      ease: "power1.in",
      onUpdate: setQ,
    });

    tl.to(params, {
      roll: 0,
      yaw: 0,
      pitch: 0.01, // 轻微回弹
      duration: 0.14 * SPEED,
      ease: "power1.out",
      onUpdate: setQ,
    });

    // ===== 3) 左刻（完全镜像）=====
    tl.to(
      params,
      {
        yaw: YAW * 0.7,
        duration: 0.12 * SPEED,
        ease: "power2.out",
        onUpdate: setQ,
      },
      ">-0.03"
    );

    tl.to(
      params,
      {
        roll: -EDGE * 0.9,
        duration: 0.2 * SPEED,
        ease: "power3.out",
        onUpdate: setQ,
      },
      "<"
    );

    tl.to(
      params,
      {
        pitch: PITCH,
        duration: 0.2 * SPEED,
        ease: "power3.out",
        onUpdate: setQ,
      },
      "<"
    );

    tl.to(params, {
      yaw: YAW,
      roll: -EDGE,
      duration: 0.16 * SPEED,
      ease: "sine.inOut",
      onUpdate: setQ,
    });

    // 4) 回中性（更慢更顺）
    tl.to(params, {
      roll: -EDGE * 0.25,
      yaw: YAW * 0.4,
      duration: 0.16 * SPEED,
      ease: "power1.in",
      onUpdate: setQ,
    });

    tl.to(params, {
      roll: 0,
      yaw: 0,
      pitch: 0,
      duration: 0.2 * SPEED,
      ease: "power2.out",
      onUpdate: setQ,
    });
  }

  // backside（后刃）powerslide（仅旋转；更稳定的后刃偏置）
  function powerslideBackside(board: THREE.Group) {
    gsap.killTweensOf(board.rotation);

    const startX = board.rotation.x;
    const startY = board.rotation.y;
    const startZ = board.rotation.z;

    // 刃向/方向
    const HEEL_SIGN = -1; // 强制后刃
    const SPIN_DIR = 1; // 顺/逆时针不对就改 -1

    // 幅度
    const YAW_SPIN = 1.35; // 主旋角
    const PRE_YAW = 0.16;
    const PRE_ROLL = 0.16;
    const UNLOAD_Z = 0.02;
    const DRIFT_ROLL = 0.06;
    const HEEL_BIAS = 0.1; // ★后刃偏置，保证漂移期一直偏向后刃
    const NOSE_PITCH = 0.08;

    // 时长
    const T_PRELOAD = 0.28;
    const T_UNLOAD = 0.18;
    const T_SPIN = 0.42;
    const T_OVERSHOOT = 0.1;
    const T_DRIFT_1 = 0.12;
    const T_DRIFT_2 = 0.22;
    const T_BITE = 0.46;
    const T_NEUTRAL_1 = 0.24;
    const T_NEUTRAL_2 = 0.36;

    const tl = gsap.timeline({ onComplete: () => setAnimating(false) });

    // 0) 预加载（反向上刃）
    tl.to(board.rotation, {
      y: startY - SPIN_DIR * PRE_YAW,
      z: startZ - HEEL_SIGN * PRE_ROLL,
      x: startX + 0.02,
      duration: T_PRELOAD,
      ease: "power2.in",
    });

    // 1) 松刃
    tl.to(board.rotation, {
      z: startZ + HEEL_SIGN * UNLOAD_Z,
      x: startX + 0.01,
      duration: T_UNLOAD,
      ease: "power1.out",
    });

    // 2) 甩尾主旋转
    tl.to(board.rotation, {
      y: startY + SPIN_DIR * (YAW_SPIN * 0.85),
      x: startX + NOSE_PITCH,
      duration: T_SPIN,
      ease: "power3.out",
    });

    // 2.1) 超调 + 立刻给后刃偏置
    tl.to(board.rotation, {
      y: startY + SPIN_DIR * YAW_SPIN,
      z: startZ + HEEL_SIGN * (-DRIFT_ROLL * 0.6) + HEEL_SIGN * HEEL_BIAS, // ★加偏置
      duration: T_OVERSHOOT,
      ease: "power1.inOut",
    });

    // 3) 漂移期小抖（围绕“后刃偏置”上下抖动）
    tl.to(board.rotation, {
      z: startZ + HEEL_SIGN * (HEEL_BIAS + DRIFT_ROLL * 0.5), // ★中心仍在后刃
      x: startX + NOSE_PITCH * 0.85,
      duration: T_DRIFT_1,
      ease: "sine.inOut",
    });
    tl.to(board.rotation, {
      z: startZ + HEEL_SIGN * (HEEL_BIAS - DRIFT_ROLL * 0.35),
      x: startX + NOSE_PITCH * 0.7,
      duration: T_DRIFT_2,
      ease: "sine.inOut",
    });

    // 4) 咬住后刃（更明显的 heel）
    tl.to(board.rotation, {
      y: startY + SPIN_DIR * (YAW_SPIN * 0.6),
      z: startZ + HEEL_SIGN * (0.22 + HEEL_BIAS * 0.6), // ★保持后刃
      x: startX + NOSE_PITCH * 0.6,
      duration: T_BITE,
      ease: "sine.inOut",
    });

    // 5) 慢速回中性
    tl.to(board.rotation, {
      z: startZ + HEEL_SIGN * (HEEL_BIAS * 0.25), // 缓慢抬回，先收偏置
      y: startY,
      x: startX + 0.01,
      duration: T_NEUTRAL_1,
      ease: "sine.inOut",
    });
    tl.to(board.rotation, {
      x: startX,
      y: startY,
      z: startZ,
      duration: T_NEUTRAL_2,
      ease: "power2.out",
    });
  }

  return (
    <group>
      {/* <pointLight position={[1, 1, 1]} intensity={5} />
      <pointLight position={[-2, 1, 1]} intensity={5} /> */}
      <Environment files={"/hdr/warehouse-256.hdr"} />
      <group ref={containerRef} position={[-0.25, 0, -0.635]}>
        <group position={[0, -0.086, 0.635]}>
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

          {/* back */}
          <Hotspot
            position={[0.55, 0.1, -1.25]}
            isVisible={!animating && showHotspot.back}
            color="#B8FC39"
          />

          <mesh
            rotation={[0, -0.2, 0]}
            position={[0.55, 0.1, -1.25]}
            // rotation={[0, -0.2, 0]}
            // position={[0.55, 0.1, -1.25]}
            name="back"
            onClick={onClick}
          >
            <boxGeometry args={[0.25, 0.02, 0.4]} />
            <meshStandardMaterial visible={false} />
          </mesh>

          {/* side */}
          <Hotspot
            position={[0.4, 0.13, -0.28]}
            isVisible={!animating && showHotspot.side}
            color="#FF7A51"
          />

          <mesh
            rotation={[-0.1, -0.15, 0]}
            position={[0.4, 0.11, -0.28]}
            // rotation={[-0.1, -0.15, 0]}
            // position={[0.4, 0.11, -0.28]}
            name="side"
            onClick={onClick}
          >
            <boxGeometry args={[0.2, 0.01, 0.8]} />
            <meshStandardMaterial visible={false} />
          </mesh>

          {/* front */}
          <Hotspot
            position={[0.2, 0.21, 0.75]}
            isVisible={!animating && showHotspot.front}
            color="#46ACFA"
          />

          <mesh
            rotation={[0, -0.15, 0]}
            position={[0.3, 0.2, 0.6]}
            // rotation={[0, -0.15, 0]}
            // position={[0.3, 0.2, 0.6]}
            name="front"
            onClick={onClick}
          >
            <boxGeometry args={[0.2, 0.03, 0.5]} />
            <meshStandardMaterial visible={false} />
          </mesh>
        </group>
      </group>
      <ContactShadows opacity={0.6} position={[0, -0.08, 0]} />
    </group>
  );
}
