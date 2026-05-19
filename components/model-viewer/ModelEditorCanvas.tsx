'use client'

import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { EditorSceneContent, type Vec3 } from './ModelScene'

type Props = {
  url: string
  position: Vec3
  spaceName: string
}

export function ModelEditorCanvas({ url, position, spaceName }: Props) {
  const [px, py, pz] = position

  return (
    <div className="relative h-full w-full min-h-[320px] overflow-hidden rounded-2xl">
      <div
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(99,102,241,0.12) 0%, transparent 55%), linear-gradient(180deg, #0c0c12 0%, #09090b 100%)',
        }}
        aria-hidden
      />

      <Canvas
        className="relative z-[1]"
        shadows
        dpr={[1, 2]}
        camera={{ position: [6, 5, 6], fov: 48, near: 0.1, far: 200 }}
        gl={{ antialias: true }}
      >
        <color attach="background" args={['#09090b']} />
        <EditorSceneContent url={url} position={position} />
        <OrbitControls
          makeDefault
          target={[px, py, pz]}
          minDistance={2}
          maxDistance={25}
          dampingFactor={0.08}
          enableDamping
        />
      </Canvas>

      {/* HUD superior */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-[2] flex justify-between gap-3 p-4">
        <div className="max-w-[50%] truncate rounded-xl border border-white/10 bg-zinc-950/75 px-3 py-2 text-sm font-semibold text-zinc-100 backdrop-blur-md">
          {spaceName}
        </div>
        <div className="rounded-xl border border-indigo-500/25 bg-indigo-500/10 px-3 py-2 font-mono text-xs text-indigo-200 backdrop-blur-md">
          X {px.toFixed(1)} · Y {py.toFixed(1)} · Z {pz.toFixed(1)}
        </div>
      </div>

      <div className="pointer-events-none absolute bottom-4 left-1/2 z-[2] -translate-x-1/2">
        <p className="rounded-full border border-zinc-700/50 bg-zinc-950/70 px-4 py-1.5 text-[11px] text-zinc-500 backdrop-blur-sm">
          Arrastra para rotar · rueda para zoom
        </p>
      </div>
    </div>
  )
}
