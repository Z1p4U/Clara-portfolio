"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import * as THREE from "three";

/**
 * A genuine Three.js carousel, not an animated image or a rotating plane.
 * Transparent background; designed for an existing Next.js hero section.
 * npm install three @react-three/fiber
 */

const GOLD = "#ffca66";
const LIGHT = "#ffe6a4";
const PURPLE = "#3f145f";
const ROOF = "#501976";
const DARK_PURPLE = "#2b0d4d";

const clockWarningFilterState = globalThis as typeof globalThis & {
  __hsweleThreeClockWarningFilterInstalled?: boolean;
};

// React Three Fiber 9 creates THREE.Clock internally. Filter only its known
// deprecation notice while allowing every other Three.js message through.
if (!clockWarningFilterState.__hsweleThreeClockWarningFilterInstalled) {
  const previousConsoleHandler = THREE.getConsoleFunction();

  THREE.setConsoleFunction((type, message, ...params) => {
    if (type === "warn" && message === "THREE.Clock: This module has been deprecated. Please use THREE.Timer instead.") {
      return;
    }

    if (previousConsoleHandler) {
      previousConsoleHandler(type, message, ...params);
      return;
    }

    if (type === "warn") {
      const stackTrace = params[0] as { isStackTrace?: boolean; getError?: (message: string) => Error } | undefined;
      if (stackTrace?.isStackTrace && stackTrace.getError) {
        console.warn(stackTrace.getError(message));
      } else {
        console.warn(message, ...params);
      }
    } else if (type === "error") {
      console.error(message, ...params);
    } else {
      console.log(message, ...params);
    }
  });

  clockWarningFilterState.__hsweleThreeClockWarningFilterInstalled = true;
}

const TWO_PI = Math.PI * 2;
const CHAIR_COUNT = 12;
const BULBS_ON_RIM = 52;
const BULBS_ON_BASE = 36;

type Point3 = [number, number, number];

function GoldRod({
  start,
  end,
  radius = 0.009,
  color = GOLD,
}: {
  start: Point3;
  end: Point3;
  radius?: number;
  color?: string;
}) {
  const { mid, quat, length } = useMemo(() => {
    const a = new THREE.Vector3(...start);
    const b = new THREE.Vector3(...end);
    const direction = b.clone().sub(a);
    return {
      mid: a.clone().add(b).multiplyScalar(0.5),
      quat: new THREE.Quaternion().setFromUnitVectors(
        new THREE.Vector3(0, 1, 0),
        direction.clone().normalize()
      ),
      length: direction.length(),
    };
  }, [start[0], start[1], start[2], end[0], end[1], end[2]]);

  return (
    <mesh position={mid} quaternion={quat}>
      <cylinderGeometry args={[radius, radius, length, 7]} />
      <meshBasicMaterial color={color} toneMapped={false} />
    </mesh>
  );
}

function GoldRing({
  radius,
  y,
  tube = 0.012,
}: {
  radius: number;
  y: number;
  tube?: number;
}) {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, y, 0]}>
      <torusGeometry args={[radius, tube, 7, 96]} />
      <meshBasicMaterial color={GOLD} toneMapped={false} />
    </mesh>
  );
}

function Bulb({ position, size = 0.035 }: { position: Point3; size?: number }) {
  return (
    <group position={position}>
      {/* A tiny glowing halo. No expensive point lights per bulb. */}
      <mesh>
        <sphereGeometry args={[size * 2.15, 9, 7]} />
        <meshBasicMaterial
          color="#ffb14e"
          transparent
          opacity={0.13}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      <mesh>
        <sphereGeometry args={[size, 10, 8]} />
        <meshBasicMaterial color={LIGHT} toneMapped={false} />
      </mesh>
    </group>
  );
}

function StarShape({ size = 0.1 }: { size?: number }) {
  const shape = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(0, size);
    s.lineTo(size * 0.22, size * 0.22);
    s.lineTo(size, 0);
    s.lineTo(size * 0.22, -size * 0.22);
    s.lineTo(0, -size);
    s.lineTo(-size * 0.22, -size * 0.22);
    s.lineTo(-size, 0);
    s.lineTo(-size * 0.22, size * 0.22);
    s.closePath();
    return s;
  }, [size]);
  return (
    <mesh>
      <shapeGeometry args={[shape]} />
      <meshBasicMaterial color={GOLD} side={THREE.DoubleSide} toneMapped={false} />
    </mesh>
  );
}

/** Gold crescent formed by two offset flat discs sitting just above the canopy face. */
function Crescent() {
  return (
    <group>
      <mesh position={[0, 0, 0]}>
        <circleGeometry args={[0.1, 32]} />
        <meshBasicMaterial color={GOLD} side={THREE.DoubleSide} toneMapped={false} />
      </mesh>
      <mesh position={[0.046, 0.026, 0.001]}>
        <circleGeometry args={[0.084, 32]} />
        <meshBasicMaterial color={PURPLE} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

function Canopy() {
  const ribs = useMemo(() => Array.from({ length: 16 }, (_, i) => (i / 16) * TWO_PI), []);
  const bulbs = useMemo(() => Array.from({ length: BULBS_ON_RIM }, (_, i) => (i / BULBS_ON_RIM) * TWO_PI), []);

  return (
    <group>
      {/* Conical fabric roof */}
      <mesh position={[0, 4.1, 0]}>
        <coneGeometry args={[2.23, 1.12, 64, 1]} />
        <meshStandardMaterial
          color={ROOF}
          emissive="#542174"
          emissiveIntensity={0.22}
          roughness={0.66}
          metalness={0.05}
        />
      </mesh>
      {/* Lower decorative carousel band */}
      <mesh position={[0, 3.42, 0]}>
        <cylinderGeometry args={[2.23, 2.23, 0.26, 64, 1, true]} />
        <meshStandardMaterial
          color={PURPLE}
          emissive="#2b0b53"
          emissiveIntensity={0.28}
          side={THREE.DoubleSide}
        />
      </mesh>
      <GoldRing radius={2.235} y={3.56} tube={0.017} />
      <GoldRing radius={2.235} y={3.29} tube={0.017} />
      <GoldRing radius={1.19} y={4.35} tube={0.008} />

      {/* Roof panel seams, in genuine 3D radial positions */}
      {ribs.map((a, i) => (
        <GoldRod
          key={`rib-${i}`}
          start={[0, 4.68, 0]}
          end={[2.235 * Math.sin(a), 3.55, 2.235 * Math.cos(a)]}
          radius={0.009}
        />
      ))}

      {/* Moon and diamond ornaments on the band, facing outward */}
      {Array.from({ length: 12 }, (_, i) => {
        const a = (i / 12) * TWO_PI;
        return (
          <group key={`ornament-${i}`} rotation={[0, a, 0]}>
            <group position={[0, 3.42, 2.241]}>
              {i % 3 === 0 ? <Crescent /> : <StarShape size={0.095} />}
            </group>
          </group>
        );
      })}

      {/* Edge lighting */}
      {bulbs.map((a, i) => (
        <Bulb
          key={`roof-bulb-${i}`}
          position={[2.235 * Math.sin(a), 3.275, 2.235 * Math.cos(a)]}
          size={0.027}
        />
      ))}
      {Array.from({ length: 16 }, (_, i) => {
        const a = (i / 16) * TWO_PI;
        return <Bulb key={`upper-bulb-${i}`} position={[1.19 * Math.sin(a), 4.345, 1.19 * Math.cos(a)]} size={0.022} />;
      })}

      {/* Gold finial / glowing crown */}
      <mesh position={[0, 4.725, 0]}>
        <sphereGeometry args={[0.075, 18, 12]} />
        <meshBasicMaterial color={GOLD} toneMapped={false} />
      </mesh>
      <GoldRod start={[0, 4.73, 0]} end={[0, 4.91, 0]} radius={0.021} />
      <Bulb position={[0, 4.93, 0]} size={0.075} />
    </group>
  );
}

function Seat() {
  return (
    <group>
      {/* Deep violet shell, gold rails and star detail */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[0.38, 0.07, 0.31]} />
        <meshStandardMaterial color="#552186" roughness={0.42} metalness={0.12} />
      </mesh>
      <mesh position={[0, 0.15, -0.135]}>
        <boxGeometry args={[0.38, 0.30, 0.048]} />
        <meshStandardMaterial color={DARK_PURPLE} emissive="#39085c" emissiveIntensity={0.28} />
      </mesh>
      <mesh position={[0, 0.15, -0.105]}>
        <StarShape size={0.07} />
      </mesh>
      {/* Seat rim and back-rest outline */}
      <GoldRod start={[-0.195, 0.038, 0.15]} end={[0.195, 0.038, 0.15]} radius={0.012} />
      <GoldRod start={[-0.195, 0.038, -0.15]} end={[0.195, 0.038, -0.15]} radius={0.010} />
      <GoldRod start={[-0.19, 0.01, -0.15]} end={[-0.19, 0.305, -0.15]} radius={0.012} />
      <GoldRod start={[0.19, 0.01, -0.15]} end={[0.19, 0.305, -0.15]} radius={0.012} />
      <GoldRod start={[-0.19, 0.305, -0.15]} end={[0.19, 0.305, -0.15]} radius={0.012} />
      <GoldRod start={[-0.19, 0.038, -0.15]} end={[-0.19, 0.038, 0.15]} radius={0.012} />
      <GoldRod start={[0.19, 0.038, -0.15]} end={[0.19, 0.038, 0.15]} radius={0.012} />
      <Bulb position={[0, 0.01, 0.17]} size={0.023} />
    </group>
  );
}

function Swing({ index, reducedMotion }: { index: number; reducedMotion: boolean }) {
  const pivot = useRef<THREE.Group>(null);
  const angle = (index / CHAIR_COUNT) * TWO_PI;

  useFrame((state) => {
    if (!pivot.current) return;
    // With the radius-oriented parent, negative X tilts the chair away from the ride.
    // Pauses in reduced-motion mode while keeping the outward carousel silhouette.
    pivot.current.rotation.x = reducedMotion
      ? -0.18
      : -0.25 - Math.sin(state.clock.elapsedTime * 1.85 + index * 0.7) * 0.045;
  });

  return (
    <group rotation={[0, angle, 0]}>
      <group position={[0, 3.25, 2.15]}>
        <group ref={pivot} rotation={[-0.25, Math.PI / 2, 0]}>
          <GoldRod start={[-0.15, 0, 0]} end={[-0.15, -1.46, 0]} radius={0.007} />
          <GoldRod start={[0.15, 0, 0]} end={[0.15, -1.46, 0]} radius={0.007} />
          <group position={[0, -1.46, 0.0]}>
            <Seat />
          </group>
        </group>
      </group>
    </group>
  );
}

function BaseAndColumn() {
  const baseLights = useMemo(() => Array.from({ length: BULBS_ON_BASE }, (_, i) => (i / BULBS_ON_BASE) * TWO_PI), []);
  return (
    <group>
      {/* Circular podium */}
      <mesh position={[0, 0.13, 0]}>
        <cylinderGeometry args={[1.78, 1.78, 0.16, 64]} />
        <meshStandardMaterial color={PURPLE} emissive="#250737" emissiveIntensity={0.2} metalness={0.15} roughness={0.48} />
      </mesh>
      <GoldRing radius={1.785} y={0.22} tube={0.023} />
      <GoldRing radius={1.5} y={0.219} tube={0.01} />
      <GoldRing radius={0.82} y={0.223} tube={0.021} />
      <GoldRing radius={1.785} y={0.045} tube={0.013} />
      {baseLights.map((a, i) => (
        <Bulb key={`base-light-${i}`} position={[1.788 * Math.sin(a), 0.10, 1.788 * Math.cos(a)]} size={0.025} />
      ))}

      {/* Tapered central column; same regal purple and golden bands */}
      <mesh position={[0, 1.72, 0]}>
        <cylinderGeometry args={[0.21, 0.36, 3.03, 24]} />
        <meshStandardMaterial color="#51167c" metalness={0.24} roughness={0.45} emissive="#68228e" emissiveIntensity={0.18} />
      </mesh>
      {[0.61, 1.52, 2.56, 3.20].map((y, i) => (
        <GoldRing key={`column-ring-${i}`} y={y} radius={0.36 - ((y - 0.20) / 3.03) * 0.15} tube={0.012} />
      ))}
      {Array.from({ length: 8 }, (_, i) => {
        const a = (i / 8) * TWO_PI;
        return (
          <GoldRod
            key={`column-line-${i}`}
            start={[0.35 * Math.sin(a), 0.24, 0.35 * Math.cos(a)]}
            end={[0.215 * Math.sin(a), 3.24, 0.215 * Math.cos(a)]}
            radius={0.007}
          />
        );
      })}
    </group>
  );
}

type CarouselInteraction = {
  pointerActive: boolean;
  pointerHeld: boolean;
  keyboardHeld: boolean;
  rotationDelta: number;
  velocity: number;
  lastX: number;
  lastTime: number;
};

function CarouselModel({
  speed,
  reducedMotion,
  interaction,
}: {
  speed: number;
  reducedMotion: boolean;
  interaction: { current: CarouselInteraction };
}) {
  const rotor = useRef<THREE.Group>(null);
  useFrame((_state, delta) => {
    if (!rotor.current) return;

    const controls = interaction.current;
    rotor.current.rotation.y += controls.rotationDelta;
    controls.rotationDelta = 0;

    if (reducedMotion) {
      controls.velocity = 0;
      return;
    }
    if (controls.pointerHeld || controls.keyboardHeld) return;

    const frameDelta = Math.min(delta, 0.05);
    rotor.current.rotation.y += frameDelta * (speed + controls.velocity);
    controls.velocity *= Math.exp(-2.8 * frameDelta);
    if (Math.abs(controls.velocity) < 0.02) controls.velocity = 0;
  });

  const modelScale = 1.28;

  return (
    <group position={[0, -2.45 * modelScale, 0]} scale={modelScale}>
      <BaseAndColumn />
      <group ref={rotor}>
        <Canopy />
        {Array.from({ length: CHAIR_COUNT }, (_, i) => (
          <Swing key={`swing-${i}`} index={i} reducedMotion={reducedMotion} />
        ))}
      </group>
    </group>
  );
}

function TransparentScene() {
  const { gl } = useThree();
  useEffect(() => {
    gl.setClearColor(0x000000, 0);
  }, [gl]);
  return null;
}

export type NeonCarousel3DProps = {
  /** CSS class for the wrapping element. */
  className?: string;
  /** Rotation speed in radians/second; defaults to 0.35. */
  speed?: number;
  /** Explicitly stop movement (also honors prefers-reduced-motion). */
  paused?: boolean;
  /** Canvas container height, default "100%". Parent must have height. */
  height?: number | string;
};

export default function NeonCarousel3D({
  className,
  speed = 0.35,
  paused = false,
  height = "100%",
}: NeonCarousel3DProps) {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setPrefersReducedMotion(query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);
  const reducedMotion = paused || prefersReducedMotion;
  const interaction = useRef<CarouselInteraction>({
    pointerActive: false,
    pointerHeld: false,
    keyboardHeld: false,
    rotationDelta: 0,
    velocity: 0,
    lastX: 0,
    lastTime: 0,
  });
  const [isDragging, setIsDragging] = useState(false);

  function handlePointerDown(event: PointerEvent<HTMLDivElement>) {
    if (!event.isPrimary || event.button !== 0) return;
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    const controls = interaction.current;
    controls.pointerActive = true;
    controls.pointerHeld = true;
    controls.velocity = 0;
    controls.lastX = event.clientX;
    controls.lastTime = event.timeStamp;
    setIsDragging(true);
  }

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    const controls = interaction.current;
    if (!controls.pointerActive) return;

    const deltaX = event.clientX - controls.lastX;
    const elapsed = Math.max(event.timeStamp - controls.lastTime, 16);
    controls.rotationDelta += deltaX * 0.008;
    controls.velocity = THREE.MathUtils.clamp((deltaX / elapsed) * 2.5, -2.5, 2.5);
    controls.lastX = event.clientX;
    controls.lastTime = event.timeStamp;
  }

  function handlePointerEnd() {
    const controls = interaction.current;
    if (!controls.pointerActive) return;
    controls.pointerActive = false;
    controls.pointerHeld = false;
    setIsDragging(false);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const controls = interaction.current;
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      event.preventDefault();
      controls.rotationDelta += event.key === "ArrowLeft" ? 0.14 : -0.14;
      controls.velocity = 0;
    } else if (event.code === "Space") {
      event.preventDefault();
      controls.keyboardHeld = true;
    }
  }

  function handleKeyUp(event: KeyboardEvent<HTMLDivElement>) {
    if (event.code === "Space") interaction.current.keyboardHeld = false;
  }

  return (
    <div
      className={`${className ?? ""}${isDragging ? " is-dragging" : ""}`.trim()}
      aria-label="Interactive 3D carousel. Drag horizontally to spin faster, hold to pause, or use the arrow keys to turn it."
      role="group"
      tabIndex={0}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerEnd}
      onPointerCancel={handlePointerEnd}
      onLostPointerCapture={handlePointerEnd}
      onKeyDown={handleKeyDown}
      onKeyUp={handleKeyUp}
      onBlur={() => { interaction.current.keyboardHeld = false; }}
      style={{ width: "100%", height, background: "transparent", touchAction: "pan-y" }}
    >
      <Canvas
        dpr={[1, 1.35]}
        camera={{ position: [6.1, 3.3, 9.5], fov: 38, near: 0.1, far: 60 }}
        gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
        style={{ width: "100%", height: "100%", background: "transparent" }}
      >
        <TransparentScene />
        <ambientLight intensity={0.85} />
        <directionalLight position={[3, 8, 6]} intensity={2.3} color="#ffe0a9" />
        <directionalLight position={[-7, 2, -3]} intensity={1.1} color="#993bff" />
        <CarouselModel speed={speed} reducedMotion={reducedMotion} interaction={interaction} />
      </Canvas>
    </div>
  );
}
