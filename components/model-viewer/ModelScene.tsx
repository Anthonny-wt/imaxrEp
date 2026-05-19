'use client'

import { Suspense, useMemo, useLayoutEffect } from 'react'
import {
  useGLTF,
  Center,
  ContactShadows,
  Environment,
  Bounds,
  Html,
  Grid,
  GizmoHelper,
  GizmoViewport,
} from '@react-three/drei'
import * as THREE from 'three'
import { Loader2, Box } from 'lucide-react'

export type Vec3 = [number, number, number]

function enableShadows(object: THREE.Object3D) {
  object.traverse((child) => {
    if ((child as THREE.Mesh).isMesh) {
      const mesh = child as THREE.Mesh
      mesh.castShadow = true
      mesh.receiveShadow = true
      if (mesh.material) {
        const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material]
        mats.forEach((mat) => {
          if ('envMapIntensity' in mat) {
            ;(mat as THREE.MeshStandardMaterial).envMapIntensity = 1.2
          }
        })
      }
    }
  })
}

export function LoadedModel({
  url,
  position = [0, 0, 0],
}: {
  url: string
  position?: Vec3
}) {
  const { scene } = useGLTF(url)
  const cloned = useMemo(() => scene.clone(), [scene])

  useLayoutEffect(() => {
    enableShadows(cloned)
  }, [cloned])

  return (
    <group position={position}>
      <Center>
        <primitive object={cloned} />
      </Center>
    </group>
  )
}

export function SceneLoader({
  compact = false,
  label = 'Cargando modelo…',
}: {
  compact?: boolean
  label?: string
}) {
  return (
    <Html center>
      <div
        className={`flex flex-col items-center justify-center gap-3 rounded-2xl border border-indigo-500/20 bg-zinc-950/90 backdrop-blur-md shadow-[0_0_40px_-8px_rgba(99,102,241,0.45)] ${
          compact ? 'px-5 py-4' : 'px-8 py-6'
        }`}
      >
        <div className="relative">
            <Loader2
            className={`animate-spin text-indigo-400 ${
              compact ? 'h-8 w-8' : 'h-10 w-10'
            }`}
          />
          <Box
            className={`absolute inset-0 m-auto text-indigo-500/80 ${
              compact ? 'h-3.5 w-3.5' : 'h-4 w-4'
            }`}
          />
        </div>
        <span
          className={`font-medium text-zinc-300 ${compact ? 'text-xs' : 'text-sm'}`}
        >
          {label}
        </span>
      </div>
    </Html>
  )
}

/** Iluminación tipo estudio para previews y editor */
export function StudioLights() {
  return (
    <>
      <ambientLight intensity={0.25} />
      <hemisphereLight
        args={['#e0e7ff', '#18181b', 0.45]}
        position={[0, 20, 0]}
      />
      <directionalLight
        position={[6, 10, 6]}
        intensity={1.35}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-far={30}
        shadow-camera-left={-8}
        shadow-camera-right={8}
        shadow-camera-top={8}
        shadow-camera-bottom={-8}
      />
      <directionalLight position={[-6, 4, -4]} intensity={0.35} color="#a5b4fc" />
      <pointLight position={[0, 3, -6]} intensity={0.25} color="#c4b5fd" />
    </>
  )
}

/** Escena compacta para tarjetas del dashboard */
export function PreviewSceneContent({ url }: { url: string }) {
  return (
    <>
      <fog attach="fog" args={['#0a0a0f', 6, 18]} />
      <StudioLights />
      <Suspense fallback={<SceneLoader compact />}>
        <Bounds fit clip observe margin={1.35}>
          <LoadedModel url={url} />
        </Bounds>
        <ContactShadows
          position={[0, -0.02, 0]}
          opacity={0.55}
          scale={14}
          blur={2.8}
          far={5}
          color="#000000"
        />
        <Environment preset="studio" environmentIntensity={0.85} />
      </Suspense>
    </>
  )
}

/** Escena completa para el editor espacial */
export function EditorSceneContent({
  url,
  position,
}: {
  url: string
  position: Vec3
}) {
  return (
    <>
      <fog attach="fog" args={['#09090b', 12, 35]} />
      <StudioLights />
      <Suspense fallback={<SceneLoader label="Preparando visor 3D…" />}>
        <LoadedModel url={url} position={position} />
        <ContactShadows
          position={[0, -0.02, 0]}
          opacity={0.65}
          scale={20}
          blur={3}
          far={6}
        />
        <Environment preset="warehouse" environmentIntensity={0.9} />
      </Suspense>
      <Grid
        infiniteGrid
        fadeDistance={40}
        fadeStrength={1.2}
        sectionSize={1}
        sectionThickness={1}
        sectionColor="#6366f1"
        cellColor="#27272a"
        cellThickness={0.6}
        position={[0, 0, 0]}
      />
      {/* Marcador en el origen del mundo */}
      <mesh position={[0, 0.02, 0]}>
        <ringGeometry args={[0.15, 0.22, 32]} />
        <meshBasicMaterial color="#6366f1" transparent opacity={0.85} />
      </mesh>
      <GizmoHelper alignment="bottom-right" margin={[72, 72]}>
        <GizmoViewport
          axisColors={['#f87171', '#4ade80', '#60a5fa']}
          labelColor="white"
        />
      </GizmoHelper>
    </>
  )
}
