'use client'

import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { PreviewSceneContent } from './ModelScene'

type Props = {
  url: string
  className?: string
  autoRotate?: boolean
}

export function ModelPreviewCanvas({
  url,
  className = '',
  autoRotate = true,
}: Props) {
  return (
    <div className={`relative h-full w-full overflow-hidden ${className}`}>
      <div
        className="pointer-events-none absolute inset-0 z-0 bg-gradient-to-b from-indigo-950/40 via-zinc-950 to-zinc-950"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 z-[1] opacity-60"
        style={{
          background:
            'radial-gradient(ellipse 70% 50% at 50% 35%, rgba(99,102,241,0.18) 0%, transparent 70%)',
        }}
        aria-hidden
      />

      <Canvas
        className="relative z-[2]"
        shadows
        dpr={[1, 2]}
        camera={{ position: [2.8, 1.8, 3.2], fov: 42, near: 0.1, far: 100 }}
        gl={{ antialias: true, alpha: true }}
      >
        <color attach="background" args={['#0a0a0f']} />
        <PreviewSceneContent url={url} />
        <OrbitControls
          autoRotate={autoRotate}
          autoRotateSpeed={1.2}
          enableZoom={false}
          enablePan={false}
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={Math.PI / 2.1}
          dampingFactor={0.06}
          enableDamping
        />
      </Canvas>

      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[3] h-16 bg-gradient-to-t from-zinc-900 to-transparent"
        aria-hidden
      />
      <div className="pointer-events-none absolute left-3 top-3 z-[3]">
        <span className="rounded-full border border-white/10 bg-zinc-950/60 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-widest text-zinc-400 backdrop-blur-sm">
          Vista 3D
        </span>
      </div>
    </div>
  )
}
