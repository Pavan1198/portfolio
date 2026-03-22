import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Html, Line, OrbitControls, Stars } from "@react-three/drei";
import * as THREE from "three";
import {
  CheckCircle2,
  Circle,
  LoaderCircle,
  Play,
  RotateCcw,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

type StageId = "github" | "ci" | "docker" | "kubernetes" | "production";
type StageKind = "diamond" | "cube" | "cylinder" | "hexsphere" | "sphere";
type StageStatus = "idle" | "running" | "done";

type Stage = {
  id: StageId;
  label: string;
  subtitle: string;
  description: string;
  accent: string;
  glow: string;
  kind: StageKind;
  position: [number, number, number];
  stats: [string, string][];
  runtimeLogs: string[];
  command: string;
};

type LogEntry = {
  id: string;
  stageId: StageId;
  tone: "muted" | "info" | "success";
  text: string;
};

type Project = {
  title: string;
  accent: string;
  links: {
    github: string;
    live: string | null;
  };
};

interface Props {
  open: boolean;
  project: Project | null;
  onClose: () => void;
}

const STAGE_STEP_MS = 2200;

const STAGES: Stage[] = [
  {
    id: "github",
    label: "GitHub",
    subtitle: "Source Control",
    description:
      "A merge to main fires the workflow, signs the payload, and hands the release request into the automation lane.",
    accent: "#e2e8f0",
    glow: "#f8fafc",
    kind: "diamond",
    position: [-8.4, -0.08, 0.15],
    stats: [
      ["Branch", "main"],
      ["PR", "#148"],
      ["Commit", "a91c2d8"],
      ["Trigger", "push"],
    ],
    runtimeLogs: [
      "origin/main updated from feature/deploy-polish",
      "release payload signed and queued",
      "workflow dispatch acknowledged",
    ],
    command: "git push origin main",
  },
  {
    id: "ci",
    label: "CI Runner",
    subtitle: "Test & Build",
    description:
      "The CI runner fans out test jobs, checks dependencies, and emits a signed build artifact ready for packaging.",
    accent: "#4ade80",
    glow: "#86efac",
    kind: "cube",
    position: [-4.2, -0.08, 0.15],
    stats: [
      ["Tests", "428"],
      ["Coverage", "97.4%"],
      ["Lint", "0 issues"],
      ["Build", "2m 14s"],
    ],
    runtimeLogs: [
      "test matrix passed on linux + windows",
      "bundle checksum verified",
      "artifact stored in release bucket",
    ],
    command: "gh workflow run deploy.yml",
  },
  {
    id: "docker",
    label: "Docker",
    subtitle: "Containerize",
    description:
      "A production image is assembled, tagged, and pushed with provenance and SBOM data attached to the digest.",
    accent: "#60a5fa",
    glow: "#93c5fd",
    kind: "cylinder",
    position: [0, -0.08, 0.15],
    stats: [
      ["Image", "ghcr.io/paverse/toolkit"],
      ["Tag", "2026.03.22"],
      ["Size", "248 MB"],
      ["Layers", "18"],
    ],
    runtimeLogs: [
      "docker build completed with cache hit ratio 91%",
      "sbom attached to manifest list",
      "image promoted to release registry",
    ],
    command: "docker buildx bake release",
  },
  {
    id: "kubernetes",
    label: "Kubernetes",
    subtitle: "Orchestrate",
    description:
      "The cluster performs a health-aware rollout, monitors the canary, and promotes the new replica set after readiness stays green.",
    accent: "#8b5cf6",
    glow: "#c4b5fd",
    kind: "hexsphere",
    position: [4.2, -0.08, 0.15],
    stats: [
      ["Cluster", "prod-ap-south1"],
      ["Replicas", "6 / 6"],
      ["Canary", "10%"],
      ["Helm", "v3.18.1"],
    ],
    runtimeLogs: [
      "helm upgrade applied to production namespace",
      "readiness gates healthy across all pods",
      "canary promoted to full rollout",
    ],
    command: "helm upgrade paverse-toolkit",
  },
  {
    id: "production",
    label: "Production",
    subtitle: "Live +",
    description:
      "Traffic flips cleanly, the edge cache warms across regions, and the release becomes the live workload serving customers.",
    accent: "#10b981",
    glow: "#6ee7b7",
    kind: "sphere",
    position: [8.4, -0.08, 0.15],
    stats: [
      ["Regions", "6"],
      ["Latency", "83 ms"],
      ["Errors", "0.02%"],
      ["Cache Warm", "94%"],
    ],
    runtimeLogs: [
      "traffic shifted to green deployment",
      "synthetics passed in all edge regions",
      "production healthy and serving live traffic",
    ],
    command: "edge promote release-2026-03-22",
  },
];

const CONNECTIONS: Array<[StageId, StageId]> = [
  ["github", "ci"],
  ["ci", "docker"],
  ["docker", "kubernetes"],
  ["kubernetes", "production"],
];

function createStageStatuses() {
  return STAGES.reduce(
    (accumulator, stage) => {
      accumulator[stage.id] = "idle";
      return accumulator;
    },
    {} as Record<StageId, StageStatus>,
  );
}

function createCompletedStageStatuses() {
  return STAGES.reduce(
    (accumulator, stage) => {
      accumulator[stage.id] = "done";
      return accumulator;
    },
    {} as Record<StageId, StageStatus>,
  );
}

function createCompletedLogs(): LogEntry[] {
  return [
    {
      id: "complete-0",
      stageId: "docker",
      tone: "muted",
      text: "-> COPY . .",
    },
    {
      id: "complete-1",
      stageId: "docker",
      tone: "info",
      text: "Building image paverse/app:a3f8c2d",
    },
    {
      id: "complete-2",
      stageId: "docker",
      tone: "info",
      text: "-> Pushing to registry.paverse.in",
    },
    {
      id: "complete-3",
      stageId: "docker",
      tone: "success",
      text: "OK Image pushed - 187MB compressed",
    },
    {
      id: "complete-4",
      stageId: "kubernetes",
      tone: "muted",
      text: "-> kubectl apply -f k8s/deployment.yaml",
    },
    {
      id: "complete-5",
      stageId: "kubernetes",
      tone: "info",
      text: "-> Deployment \"app\" scaled to 3 replicas",
    },
    {
      id: "complete-6",
      stageId: "kubernetes",
      tone: "info",
      text: "-> Rolling update: 0/3 -> 1/3 -> 2/3 -> 3/3",
    },
    {
      id: "complete-7",
      stageId: "kubernetes",
      tone: "info",
      text: "-> Health checks passing on all pods",
    },
    {
      id: "complete-8",
      stageId: "production",
      tone: "info",
      text: "-> Ingress configured - TLS terminated",
    },
    {
      id: "complete-9",
      stageId: "production",
      tone: "success",
      text: "OK Deployment complete - all 3 pods healthy",
    },
    {
      id: "complete-10",
      stageId: "production",
      tone: "info",
      text: "-> Health endpoint: GET /api/health -> 200 OK",
    },
    {
      id: "complete-11",
      stageId: "production",
      tone: "info",
      text: "-> Smoke tests passing",
    },
    {
      id: "complete-12",
      stageId: "production",
      tone: "info",
      text: "-> CDN cache warmed",
    },
    {
      id: "complete-13",
      stageId: "production",
      tone: "info",
      text: "-> Monitoring alerts cleared",
    },
    {
      id: "complete-14",
      stageId: "production",
      tone: "success",
      text: "OK Deployment successful!",
    },
    {
      id: "complete-15",
      stageId: "production",
      tone: "success",
      text: "OK https://paverse.in - LIVE",
    },
  ];
}

function getStage(stageId: StageId) {
  return STAGES.find((stage) => stage.id === stageId) ?? STAGES[0];
}

function getStageIndex(stageId: StageId) {
  return STAGES.findIndex((stage) => stage.id === stageId);
}

function formatStageLog(_stageId: StageId, text: string) {
  return text;
}

function StatusIcon({ status }: { status: StageStatus }) {
  if (status === "running") {
    return <LoaderCircle size={15} className="animate-spin text-amber-300" />;
  }

  if (status === "done") {
    return <CheckCircle2 size={15} className="text-emerald-300" />;
  }

  return <Circle size={13} className="text-white/28" />;
}

function FlowParticles({
  start,
  end,
  color,
  active,
}: {
  start: [number, number, number];
  end: [number, number, number];
  color: string;
  active: boolean;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const startVector = new THREE.Vector3(...start);
  const endVector = new THREE.Vector3(...end);
  const phases = [0, 0.17, 0.34, 0.51, 0.68, 0.85];

  useFrame(({ clock }) => {
    if (!groupRef.current) {
      return;
    }

    const elapsed = clock.getElapsedTime();

    groupRef.current.children.forEach((child, index) => {
      const phase = phases[index] ?? 0;
      const t = (elapsed * (active ? 0.28 : 0.14) + phase) % 1;
      child.position.lerpVectors(startVector, endVector, t);
      const pulse = active ? 0.11 + Math.sin((elapsed + phase) * 7) * 0.025 : 0.06;
      child.scale.setScalar(pulse);
      child.visible = active || index < 2;
    });
  });

  return (
    <group ref={groupRef}>
      {phases.map((phase) => (
        <mesh key={phase}>
          <sphereGeometry args={[0.08, 12, 12]} />
          <meshBasicMaterial color={color} transparent opacity={active ? 0.95 : 0.2} />
        </mesh>
      ))}
    </group>
  );
}

function ActiveOrbitRing({ color }: { color: string }) {
  const ringRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!ringRef.current) {
      return;
    }

    const elapsed = clock.getElapsedTime();
    const scale = 1 + Math.sin(elapsed * 4) * 0.08;
    ringRef.current.rotation.z = elapsed * 0.9;
    ringRef.current.scale.setScalar(scale);
  });

  return (
    <group ref={ringRef}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.18, 0.045, 18, 128]} />
        <meshBasicMaterial color={color} transparent opacity={0.7} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, Math.PI / 3]}>
        <torusGeometry args={[1.45, 0.016, 14, 96]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.3} />
      </mesh>
    </group>
  );
}

function StageMesh({
  stage,
  status,
  focused,
  active,
}: {
  stage: Stage;
  status: StageStatus;
  focused: boolean;
  active: boolean;
}) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(({ clock }, delta) => {
    if (!groupRef.current) {
      return;
    }

    const elapsed = clock.getElapsedTime();
    const targetScale = focused ? 1 : status === "running" ? 0.96 : 0.88;
    const nextScale = THREE.MathUtils.lerp(groupRef.current.scale.x, targetScale, 1 - Math.exp(-delta * 5));

    groupRef.current.scale.setScalar(nextScale);
    groupRef.current.position.y = stage.position[1] + Math.sin(elapsed * 0.7 + getStageIndex(stage.id)) * 0.12;
    groupRef.current.rotation.y += delta * (active ? 0.9 : 0.28);
    groupRef.current.rotation.x = Math.sin(elapsed * 0.45 + getStageIndex(stage.id)) * 0.08;
  });

  const emissiveIntensity = status === "running" ? 1.15 : status === "done" ? 0.5 : focused ? 0.32 : 0.18;

  return (
    <group ref={groupRef}>
      {stage.kind === "diamond" && (
        <group rotation={[0.18, Math.PI / 4, Math.PI / 4]} scale={[0.82, 1, 0.82]}>
          <mesh castShadow>
            <octahedronGeometry args={[0.9, 0]} />
            <meshPhysicalMaterial
              color={stage.accent}
              emissive={stage.glow}
              emissiveIntensity={emissiveIntensity}
              metalness={0.96}
              roughness={0.14}
              clearcoat={1}
              clearcoatRoughness={0.05}
              flatShading
            />
          </mesh>
        </group>
      )}

      {stage.kind === "cube" && (
        <group>
          <mesh castShadow>
            <boxGeometry args={[1.28, 1.28, 1.28]} />
            <meshPhysicalMaterial
              color={stage.accent}
              emissive={stage.glow}
              emissiveIntensity={emissiveIntensity}
              metalness={0.28}
              roughness={0.22}
              clearcoat={0.55}
            />
          </mesh>
          <mesh scale={1.04}>
            <boxGeometry args={[1.28, 1.28, 1.28]} />
            <meshBasicMaterial color="#d1fae5" wireframe transparent opacity={0.22} />
          </mesh>
        </group>
      )}

      {stage.kind === "cylinder" && (
        <group>
          <mesh castShadow>
            <cylinderGeometry args={[0.78, 0.78, 1.58, 48, 1, false]} />
            <meshPhysicalMaterial
              color={stage.accent}
              emissive={stage.glow}
              emissiveIntensity={emissiveIntensity}
              metalness={0.45}
              roughness={0.2}
              clearcoat={0.9}
            />
          </mesh>
          <mesh position={[0, 0.82, 0]}>
            <circleGeometry args={[0.78, 48]} />
            <meshBasicMaterial color="#dbeafe" transparent opacity={0.35} />
          </mesh>
        </group>
      )}

      {stage.kind === "hexsphere" && (
        <group rotation={[0.22, 0.55, 0]}>
          <mesh castShadow>
            <icosahedronGeometry args={[0.9, 1]} />
            <meshPhysicalMaterial
              color={stage.accent}
              emissive={stage.glow}
              emissiveIntensity={emissiveIntensity}
              metalness={0.35}
              roughness={0.18}
              clearcoat={0.82}
              flatShading
            />
          </mesh>
          <mesh scale={1.02}>
            <icosahedronGeometry args={[0.9, 1]} />
            <meshBasicMaterial color="#ede9fe" wireframe transparent opacity={0.12} />
          </mesh>
        </group>
      )}

      {stage.kind === "sphere" && (
        <mesh castShadow>
          <sphereGeometry args={[0.86, 48, 48]} />
          <meshPhysicalMaterial
            color={stage.accent}
            emissive={stage.glow}
            emissiveIntensity={emissiveIntensity}
            metalness={0.2}
            roughness={0.08}
            transmission={0.05}
            thickness={0.8}
            clearcoat={1}
            clearcoatRoughness={0.05}
          />
        </mesh>
      )}
    </group>
  );
}

function StageNode({
  stage,
  activeStageId,
  focusedStageId,
  statuses,
  onHover,
  onSelect,
}: {
  stage: Stage;
  activeStageId: StageId;
  focusedStageId: StageId;
  statuses: Record<StageId, StageStatus>;
  onHover: (stageId: StageId | null) => void;
  onSelect: (stageId: StageId) => void;
}) {
  const status = statuses[stage.id];
  const focused = focusedStageId === stage.id;
  const active = activeStageId === stage.id;

  return (
    <group position={stage.position}>
      <StageMesh stage={stage} status={status} focused={focused} active={active} />

      {(active || status === "running") && <ActiveOrbitRing color={stage.glow} />}

      {(status === "running" || status === "done") && (
        <pointLight color={stage.accent} intensity={status === "running" ? 2.1 : 1} distance={6.4} decay={2} />
      )}

      <Html
        position={[0, -1.52, 0]}
        center
        transform
        sprite
        distanceFactor={12.8}
        style={{ pointerEvents: "none" }}
      >
        <div className="text-center">
          <div className="font-mono text-[9px] font-semibold uppercase tracking-[0.24em] text-white/78">
            {stage.label}
          </div>
          <div className="mt-0.5 font-mono text-[7px] uppercase tracking-[0.2em] text-white/32">
            {stage.subtitle}
          </div>
        </div>
      </Html>

      <mesh
        onPointerOver={(event) => {
          event.stopPropagation();
          onHover(stage.id);
        }}
        onPointerOut={(event) => {
          event.stopPropagation();
          onHover(null);
        }}
        onClick={(event) => {
          event.stopPropagation();
          onSelect(stage.id);
        }}
      >
        <sphereGeometry args={[1.5, 20, 20]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>
    </group>
  );
}

function Starfield() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (!groupRef.current) {
      return;
    }

    groupRef.current.rotation.y += delta * 0.025;
    groupRef.current.rotation.x += delta * 0.008;
  });

  return (
    <group ref={groupRef}>
      <Stars radius={65} depth={42} count={2500} factor={4.2} saturation={0} fade speed={0.75} />
    </group>
  );
}

function SceneCameraRig({
  controlsRef,
  orbitIdle,
}: {
  controlsRef: React.MutableRefObject<any>;
  orbitIdle: boolean;
}) {
  const { camera } = useThree();

  useFrame((_, delta) => {
    if (!orbitIdle) {
      return;
    }

    const targetCameraPosition = new THREE.Vector3(0, 5.6, 21.4);
    const targetLookAt = new THREE.Vector3(0, -0.34, 0.2);

    camera.position.lerp(targetCameraPosition, 1 - Math.exp(-delta * 1.8));

    if (controlsRef.current) {
      controlsRef.current.target.lerp(targetLookAt, 1 - Math.exp(-delta * 2.4));
      controlsRef.current.update();
    } else {
      camera.lookAt(targetLookAt);
    }
  });

  return null;
}

function GridFloor() {
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.45, 0.2]}>
        <planeGeometry args={[66, 44, 32, 22]} />
        <meshBasicMaterial color="#16233f" wireframe transparent opacity={0.28} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.43, 0.2]}>
        <planeGeometry args={[66, 44]} />
        <meshBasicMaterial color="#030712" transparent opacity={0.25} />
      </mesh>
    </group>
  );
}

function PipelineScene({
  activeStageId,
  focusStageId,
  statuses,
  orbitIdle,
  onHover,
  onSelect,
  onOrbitStart,
  onOrbitEnd,
}: {
  activeStageId: StageId;
  focusStageId: StageId;
  statuses: Record<StageId, StageStatus>;
  orbitIdle: boolean;
  onHover: (stageId: StageId | null) => void;
  onSelect: (stageId: StageId) => void;
  onOrbitStart: () => void;
  onOrbitEnd: () => void;
}) {
  const controlsRef = useRef<any>(null);

  return (
    <Canvas camera={{ position: [0, 5.6, 21.4], fov: 28 }} dpr={[1, 1.5]}>
      <fog attach="fog" args={["#030712", 16, 42]} />
      <color attach="background" args={["#030712"]} />
      <ambientLight intensity={0.76} />
      <hemisphereLight intensity={0.58} groundColor="#020617" color="#94a3b8" />
      <directionalLight position={[12, 10, 8]} intensity={0.98} color="#dbeafe" />
      <pointLight position={[-12, 8, -10]} intensity={0.58} color="#38bdf8" />
      <pointLight position={[10, -6, 8]} intensity={0.42} color="#8b5cf6" />

      <Starfield />
      <GridFloor />

      {CONNECTIONS.map(([startId, endId]) => {
        const start = getStage(startId).position;
        const end = getStage(endId).position;
        const lit = statuses[startId] !== "idle" || statuses[endId] !== "idle";
        const complete = statuses[endId] === "done";

        return (
          <group key={`${startId}-${endId}`}>
            <Line
              points={[start, end]}
              color={lit ? "#93c5fd" : "#334155"}
              transparent
              opacity={lit ? 0.5 : 0.18}
              lineWidth={lit ? 2.4 : 1.4}
            />
            {lit && (
              <Line
                points={[start, end]}
                color={complete ? "#34d399" : "#f59e0b"}
                transparent
                opacity={0.22}
                lineWidth={7.5}
              />
            )}
            <FlowParticles start={start} end={end} color={complete ? "#34d399" : "#60a5fa"} active={lit} />
          </group>
        );
      })}

      {STAGES.map((stage) => (
        <StageNode
          key={stage.id}
          stage={stage}
          activeStageId={activeStageId}
          focusedStageId={focusStageId}
          statuses={statuses}
          onHover={onHover}
          onSelect={onSelect}
        />
      ))}

      <SceneCameraRig controlsRef={controlsRef} orbitIdle={orbitIdle} />

      <OrbitControls
        ref={controlsRef}
        enablePan={false}
        enableZoom
        autoRotate={orbitIdle}
        autoRotateSpeed={0.12}
        minDistance={15}
        maxDistance={26}
        enableDamping
        dampingFactor={0.08}
        rotateSpeed={0.8}
        maxPolarAngle={Math.PI / 2.2}
        minPolarAngle={Math.PI / 3.4}
        onStart={onOrbitStart}
        onEnd={onOrbitEnd}
      />
    </Canvas>
  );
}

export default function DevOpsPipelineModal({ open, project, onClose }: Props) {
  const [hoveredStageId, setHoveredStageId] = useState<StageId | null>(null);
  const [selectedStageId, setSelectedStageId] = useState<StageId | null>("github");
  const [activeStageId, setActiveStageId] = useState<StageId>("github");
  const [orbitIdle, setOrbitIdle] = useState(true);
  const [running, setRunning] = useState(false);
  const [statuses, setStatuses] = useState<Record<StageId, StageStatus>>(createStageStatuses());
  const [logs, setLogs] = useState<LogEntry[]>([]);

  const timeoutRefs = useRef<number[]>([]);
  const orbitTimeoutRef = useRef<number | null>(null);
  const logViewportRef = useRef<HTMLDivElement | null>(null);

  const clearTimers = () => {
    timeoutRefs.current.forEach((timeoutId) => window.clearTimeout(timeoutId));
    timeoutRefs.current = [];
  };

  const appendLog = (stageId: StageId, text: string, tone: LogEntry["tone"]) => {
    setLogs((current) => {
      const nextEntry: LogEntry = {
        id: `${stageId}-${current.length}-${Date.now()}`,
        stageId,
        tone,
        text: formatStageLog(stageId, text),
      };

      return [...current.slice(-15), nextEntry];
    });
  };

  const resetPipeline = () => {
    clearTimers();
    setRunning(false);
    setHoveredStageId(null);
    setSelectedStageId("github");
    setActiveStageId("github");
    setStatuses(createStageStatuses());
    setLogs([
      {
        id: "boot-0",
        stageId: "github",
        tone: "muted",
        text: "Visualizer armed. Click Run Pipeline to replay the full CI/CD flow.",
      },
    ]);
  };

  const loadCompletedPipeline = () => {
    clearTimers();
    setRunning(false);
    setHoveredStageId(null);
    setSelectedStageId("production");
    setActiveStageId("production");
    setStatuses(createCompletedStageStatuses());
    setLogs(createCompletedLogs());
  };

  const schedule = (delay: number, callback: () => void) => {
    const timeoutId = window.setTimeout(callback, delay);
    timeoutRefs.current.push(timeoutId);
  };

  const runPipeline = () => {
    clearTimers();
    setRunning(true);
    setHoveredStageId(null);
    setSelectedStageId(null);
    setActiveStageId("github");
    setStatuses(createStageStatuses());
    setLogs([
      {
        id: "boot-1",
        stageId: "github",
        tone: "muted",
        text: "Pipeline boot sequence started. Streaming runtime output...",
      },
    ]);

    STAGES.forEach((stage, index) => {
      const baseDelay = index * STAGE_STEP_MS;

      schedule(baseDelay, () => {
        setActiveStageId(stage.id);
        setSelectedStageId(stage.id);
        setStatuses((current) => ({ ...current, [stage.id]: "running" }));
        appendLog(stage.id, stage.command, "muted");
      });

      schedule(baseDelay + 550, () => appendLog(stage.id, stage.runtimeLogs[0], "info"));
      schedule(baseDelay + 1180, () => appendLog(stage.id, stage.runtimeLogs[1], "info"));
      schedule(baseDelay + 1760, () => appendLog(stage.id, stage.runtimeLogs[2], "success"));

      schedule(baseDelay + STAGE_STEP_MS - 120, () => {
        setStatuses((current) => ({ ...current, [stage.id]: "done" }));
      });
    });

    schedule(STAGES.length * STAGE_STEP_MS, () => {
      setRunning(false);
      setSelectedStageId("production");
      appendLog("production", "Pipeline complete. Production is healthy across all 6 regions.", "success");
    });
  };

  useEffect(() => {
    if (!open) {
      clearTimers();

      if (orbitTimeoutRef.current !== null) {
        window.clearTimeout(orbitTimeoutRef.current);
        orbitTimeoutRef.current = null;
      }

      return;
    }

    loadCompletedPipeline();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      clearTimers();
      window.removeEventListener("keydown", onKeyDown);

      if (orbitTimeoutRef.current !== null) {
        window.clearTimeout(orbitTimeoutRef.current);
        orbitTimeoutRef.current = null;
      }
    };
  }, [open, onClose]);

  useEffect(() => {
    if (!logViewportRef.current) {
      return;
    }

    logViewportRef.current.scrollTop = logViewportRef.current.scrollHeight;
  }, [logs]);

  if (!project) {
    return null;
  }

  const focusStageId = running ? activeStageId : hoveredStageId ?? selectedStageId ?? activeStageId;
  const currentStage = getStage(focusStageId);
  const completedStages = STAGES.filter((stage) => statuses[stage.id] === "done").length;
  const sceneBadge =
    completedStages === STAGES.length
      ? {
          label: "Deployment Successful",
          className:
            "border-emerald-400/24 bg-emerald-400/12 text-emerald-200 shadow-[0_0_32px_rgba(16,185,129,0.16)]",
        }
      : running
        ? {
            label: "Pipeline Running",
            className:
              "border-amber-300/24 bg-amber-400/12 text-amber-100 shadow-[0_0_32px_rgba(245,158,11,0.14)]",
          }
        : {
            label: "Awaiting Trigger",
            className: "border-white/12 bg-white/[0.05] text-white/60",
          };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/82 backdrop-blur-md"
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.985 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-50 p-3 md:p-5"
          >
            <div className="mx-auto flex h-full max-w-[1620px] items-center justify-center">
              <div
                className="relative flex h-full w-full flex-col overflow-hidden rounded-[26px] border border-white/10 bg-[linear-gradient(180deg,rgba(5,10,20,0.96),rgba(2,6,14,0.94))] text-white shadow-[0_40px_140px_rgba(0,0,0,0.7)]"
                onClick={(event) => event.stopPropagation()}
              >
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/8 bg-white/[0.03] px-4 py-3 md:px-5">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
                      <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
                      <span className="h-3 w-3 rounded-full bg-[#28c840]" />
                    </div>

                    <div>
                      <div className="font-mono text-[10px] uppercase tracking-[0.28em] text-white/38">
                        3D DevOps CI/CD Pipeline Visualizer
                      </div>
                      <div className="mt-1 text-base font-black uppercase tracking-[-0.03em] md:text-xl">
                        {project.title}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={resetPipeline}
                      className="inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.22em] text-white/42 transition-colors hover:text-white"
                    >
                      <RotateCcw size={12} />
                      Reset
                    </button>
                    <button
                      type="button"
                      onClick={runPipeline}
                      className="inline-flex items-center gap-2 rounded-full border border-emerald-400/18 bg-emerald-400/10 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.22em] text-emerald-100 transition-colors hover:border-emerald-300/30 hover:text-white"
                    >
                      <Play size={13} />
                      Run Pipeline
                    </button>
                    <button
                      type="button"
                      onClick={onClose}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-full text-white/42 transition-colors hover:text-white"
                      aria-label="Close DevOps pipeline modal"
                    >
                      <X size={18} />
                    </button>
                  </div>
                </div>

                <div className="flex min-h-0 flex-1 flex-col">
                  <div className="grid min-h-0 flex-1 grid-cols-1 lg:grid-cols-[200px_minmax(0,1fr)_280px]">
                    <aside className="flex min-h-0 flex-col border-b border-white/8 bg-[#050a14]/75 lg:border-b-0 lg:border-r">
                      <div className="px-4 py-4">
                        <div className="mb-5 font-mono text-[10px] uppercase tracking-[0.32em] text-white/26">
                          Stages
                        </div>

                        <div className="space-y-2.5">
                          {STAGES.map((stage) => {
                            const status = statuses[stage.id];
                            const active = focusStageId === stage.id;
                            const accent = stage.accent;

                            return (
                              <button
                                key={stage.id}
                                type="button"
                                onMouseEnter={() => setHoveredStageId(stage.id)}
                                onMouseLeave={() => setHoveredStageId(null)}
                                onClick={() => setSelectedStageId(stage.id)}
                                className={cn(
                                  "relative flex w-full items-center gap-3 rounded-r-2xl border border-white/6 px-3 py-2.5 text-left transition-colors",
                                  active ? "bg-white/[0.06]" : "bg-transparent hover:bg-white/[0.04]",
                                )}
                                style={{
                                  borderLeftColor: accent,
                                  borderLeftWidth: active || status !== "idle" ? 2 : 1,
                                }}
                              >
                                <div
                                  className={cn(
                                    "flex h-6 w-6 items-center justify-center rounded-full border",
                                    status === "done" && "border-emerald-400/28 bg-emerald-400/10 text-emerald-200",
                                    status === "running" && "border-amber-300/30 bg-amber-400/10 text-amber-100",
                                    status === "idle" && "border-white/12 bg-white/[0.03] text-white/38",
                                  )}
                                >
                                  <StatusIcon status={status} />
                                </div>

                                <div className="min-w-0">
                                  <div
                                    className="truncate text-[13px] font-semibold"
                                    style={{ color: active || status !== "idle" ? accent : "rgba(255,255,255,0.86)" }}
                                  >
                                    {stage.label}
                                  </div>
                                  <div className="mt-0.5 text-[10px] text-white/28">{stage.subtitle}</div>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <div className="mt-auto border-t border-white/8 px-4 py-4">
                        <div className="font-mono text-[10px] uppercase tracking-[0.32em] text-white/22">
                          Est. Duration
                        </div>
                        <div className="mt-2.5 font-mono text-xs text-white/68">~11s</div>
                      </div>
                    </aside>

                    <div className="relative min-h-[430px] border-b border-white/8 bg-[#020712] lg:min-h-0 lg:border-b-0 lg:border-r">
                      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.03),transparent_18%),radial-gradient(circle_at_center,rgba(79,70,229,0.08),transparent_38%)]" />

                      <div
                        className={cn(
                          "pointer-events-none absolute left-1/2 top-5 z-10 inline-flex -translate-x-1/2 items-center gap-2 rounded-full border px-4 py-1.5 font-mono text-[10px] uppercase tracking-[0.22em]",
                          sceneBadge.className,
                        )}
                      >
                        {completedStages === STAGES.length ? (
                          <CheckCircle2 size={14} />
                        ) : running ? (
                          <LoaderCircle size={14} className="animate-spin" />
                        ) : (
                          <Circle size={12} />
                        )}
                        {sceneBadge.label}
                      </div>

                      <div className="pointer-events-none absolute bottom-4 right-4 z-10 hidden w-[220px] rounded-2xl border border-white/8 bg-[#050b16]/78 p-3 backdrop-blur-md md:block">
                        <div className="font-mono text-[10px] uppercase tracking-[0.28em] text-white/24">
                          Focus Node
                        </div>
                        <div className="mt-2 flex items-center justify-between gap-3">
                          <div>
                            <div className="text-[13px] font-semibold text-white">{currentStage.label}</div>
                            <div className="mt-1 text-[11px] text-white/38">{currentStage.subtitle}</div>
                          </div>
                          <div
                            className="h-2.5 w-2.5 rounded-full shadow-[0_0_18px_currentColor]"
                            style={{ color: currentStage.accent, backgroundColor: currentStage.accent }}
                          />
                        </div>
                        <div className="mt-3 space-y-1 font-mono text-[9px] uppercase tracking-[0.16em] text-white/40">
                          {currentStage.stats.slice(0, 3).map(([label, value]) => (
                            <div key={label}>
                              {label}: <span className="text-white/72">{value}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="relative h-full">
                        <PipelineScene
                          activeStageId={activeStageId}
                          focusStageId={focusStageId}
                          statuses={statuses}
                          orbitIdle={orbitIdle}
                          onHover={setHoveredStageId}
                          onSelect={setSelectedStageId}
                          onOrbitStart={() => {
                            setOrbitIdle(false);

                            if (orbitTimeoutRef.current !== null) {
                              window.clearTimeout(orbitTimeoutRef.current);
                              orbitTimeoutRef.current = null;
                            }
                          }}
                          onOrbitEnd={() => {
                            if (orbitTimeoutRef.current !== null) {
                              window.clearTimeout(orbitTimeoutRef.current);
                            }

                            orbitTimeoutRef.current = window.setTimeout(() => {
                              setOrbitIdle(true);
                            }, 1200);
                          }}
                        />
                      </div>
                    </div>

                    <aside className="flex min-h-0 flex-col bg-[#050a14]/82">
                      <div className="flex items-center gap-2 border-b border-white/8 px-4 py-4">
                        <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.8)]" />
                        <span className="font-mono text-[10px] uppercase tracking-[0.32em] text-white/34">
                          Pipeline Logs
                        </span>
                      </div>

                      <div ref={logViewportRef} className="min-h-0 flex-1 space-y-2 overflow-auto px-4 py-4">
                        {logs.map((entry) => {
                          const stageAccent = getStage(entry.stageId).accent;

                          return (
                            <motion.div
                              key={entry.id}
                              initial={{ opacity: 0, y: 8 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="rounded-xl border border-transparent border-l-white/10 pl-3 font-mono text-[10px] leading-6 tracking-[0.03em]"
                              style={{ borderLeftColor: stageAccent }}
                            >
                              <span
                                className={cn(
                                  entry.tone === "success" && "text-emerald-300",
                                  entry.tone === "info" && "text-slate-300",
                                  entry.tone === "muted" && "text-slate-400",
                                )}
                              >
                                {entry.text}
                              </span>
                            </motion.div>
                          );
                        })}
                      </div>
                    </aside>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/8 bg-[#030814] px-4 py-2.5">
                    <div className="flex flex-wrap items-center gap-4">
                      {STAGES.map((stage) => (
                        <div key={stage.id} className="inline-flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.18em] text-white/55">
                          <span
                            className="h-2 w-2 rounded-full shadow-[0_0_10px_currentColor]"
                            style={{ color: stage.accent, backgroundColor: stage.accent }}
                          />
                          {stage.label}
                        </div>
                      ))}
                    </div>

                    <div className="font-mono text-[9px] uppercase tracking-[0.18em] text-white/24">
                      drag to orbit / scroll to zoom
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
