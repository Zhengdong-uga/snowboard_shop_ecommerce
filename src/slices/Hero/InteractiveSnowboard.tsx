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
        ease: "power2.in",
      });
  }

  function ollie(board: THREE.Group) {
    jumpBoard(board);

    gsap
      .timeline()
      .to(board.rotation, { x: -0.6, duration: 0.26, ease: "none" })
      .to(board.rotation, { x: 0.4, duration: 0.82, ease: "power2.in" })
      .to(board.rotation, { x: 0, duration: 0.12, ease: "none" });
  }

  // 刻滑（仅旋转；右 → 左 → 中），用四元数组合避免初始旋转耦合
  function switchEdgeCycle(board: THREE.Group) {
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

    const tl = gsap.timeline();

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

  // backside（后刃）powerslide（仅旋转；回收&回中性放慢）
  function powerslideBackside(board: THREE.Group) {
    gsap.killTweensOf(board.rotation);

    const startX = board.rotation.x;
    const startY = board.rotation.y;
    const startZ = board.rotation.z;

    // 方向与幅度
    const HEEL_SIGN = 1; // 看起来像前刃就改成 -1
    const SPIN_DIR = 1; // 顺/逆时针反了就改 -1
    const YAW_SPIN = 1.35; // 主旋转角（≈77°）
    const PRE_YAW = 0.16; // 预加载反向 yaw
    const PRE_ROLL = 0.16; // 预加载反向 roll
    const UNLOAD_Z = 0.02; // 松刃时极浅刃角
    const DRIFT_ROLL = 0.06; // 漂移期 roll 抖动
    const NOSE_PITCH = 0.08; // 漂移时轻微压板头

    // 时长（前半快速、后半回收放慢）
    const T_PRELOAD = 0.28;
    const T_UNLOAD = 0.18;
    const T_SPIN = 0.42;
    const T_OVERSHOOT = 0.1;
    const T_DRIFT_1 = 0.12;
    const T_DRIFT_2 = 0.22;
    const T_BITE = 0.46; // 放慢
    const T_NEUTRAL_1 = 0.24; // 放慢
    const T_NEUTRAL_2 = 0.36; // 放慢

    const tl = gsap.timeline();

    // 0) 预加载
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

    // 2.1) 超调
    tl.to(board.rotation, {
      y: startY + SPIN_DIR * YAW_SPIN,
      z: startZ + HEEL_SIGN * (-DRIFT_ROLL * 0.6),
      duration: T_OVERSHOOT,
      ease: "power1.inOut",
    });

    // 3) 漂移期小抖
    tl.to(board.rotation, {
      z: startZ + HEEL_SIGN * (DRIFT_ROLL * 0.5),
      x: startX + NOSE_PITCH * 0.85,
      duration: T_DRIFT_1,
      ease: "sine.inOut",
    });
    tl.to(board.rotation, {
      z: startZ + HEEL_SIGN * (-DRIFT_ROLL * 0.35),
      x: startX + NOSE_PITCH * 0.7,
      duration: T_DRIFT_2,
      ease: "sine.inOut",
    });

    // 4) 接后刃（咬住）——放慢 & 平顺
    tl.to(board.rotation, {
      y: startY + SPIN_DIR * (YAW_SPIN * 0.6),
      z: startZ + HEEL_SIGN * 0.22,
      x: startX + NOSE_PITCH * 0.6,
      duration: T_BITE,
      ease: "sine.inOut",
    });

    // 5) 慢速回中性（两段）
    tl.to(board.rotation, {
      z: startZ,
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
      <OrbitControls />
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
          <mesh
            rotation={[0, -0.2, 0]}
            position={[0.55, 0.1, -1.25]}
            name="back"
            onClick={onClick}
          >
            <boxGeometry args={[0.25, 0.02, 0.4]} />
            <meshStandardMaterial visible={true} />
          </mesh>

          {/* side */}
          <mesh
            rotation={[-0.1, -0.15, 0]}
            position={[0.5, 0.11, -0.28]}
            name="side"
            onClick={onClick}
          >
            <boxGeometry args={[0.2, 0.01, 0.8]} />
            <meshStandardMaterial visible={true} />
          </mesh>

          {/* front */}
          <mesh
            rotation={[0, -0.15, 0]}
            position={[0.1, 0.19, 0.7]}
            name="front"
            onClick={onClick}
          >
            <boxGeometry args={[0.2, 0.03, 0.5]} />
            <meshStandardMaterial visible={true} />
          </mesh>
        </group>
      </group>
      <ContactShadows opacity={0.6} position={[0, -0.08, 0]} />
    </group>
  );
}
