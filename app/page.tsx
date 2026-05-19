import Link from 'next/link'
import { Hero3D } from '@/components/landing/Hero3D'
import { Box, Code2, Database, Move3d } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50 overflow-hidden relative">
      <Hero3D />

      {/* Navbar Simple */}
      <nav className="absolute top-0 w-full p-6 z-50 flex justify-between items-center max-w-7xl mx-auto left-0 right-0">
        <div className="flex items-center gap-2">
          <Box className="w-8 h-8 text-indigo-500" />
          <span className="font-bold text-2xl tracking-tighter">IMAXR</span>
        </div>
        <div className="flex gap-4">
          <Link href="/api-docs" className="text-zinc-400 hover:text-indigo-400 font-medium px-4 py-2 transition-colors">
            API Docs
          </Link>
          <Link href="/login" className="bg-white text-zinc-950 font-semibold px-5 py-2 rounded-full hover:bg-zinc-200 transition-colors">
            Login
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 text-center">
        <div className="space-y-6 max-w-4xl mx-auto mt-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm font-medium mb-4">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
            </span>
            XR & AI Enthusiasts in Huancayo, Peru
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-200 to-zinc-500">
            We are a passionate TEAM committed to advancing XR technology
          </h1>
          
          <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            We empower learners through immersive educational experiences in XR and Artificial Intelligence. By combining cutting-edge technology with creativity, we foster curiosity and critical thinking.
          </p>

          <div className="pt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/dashboard" className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-8 py-4 rounded-xl transition-all shadow-[0_0_40px_-10px_rgba(99,102,241,0.5)] flex items-center justify-center gap-2">
              <Box className="w-5 h-5" />
              Gestor de Entornos
            </Link>
          </div>
        </div>
      </main>

      {/* Features Section */}
      <section className="relative z-10 bg-zinc-950/80 backdrop-blur-xl border-t border-zinc-900 py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Portfolio & Impact</h2>
            <p className="text-zinc-400 max-w-2xl mx-auto">We work on a variety of projects, including XR, AI, and Robotics, as well as entertaining XR applications and games.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-zinc-900/50 border border-zinc-800 p-8 rounded-3xl hover:border-indigo-500/50 transition-colors">
              <div className="bg-indigo-500/10 w-14 h-14 rounded-2xl flex items-center justify-center mb-6">
                <Database className="w-7 h-7 text-indigo-400" />
              </div>
              <h3 className="text-xl font-bold mb-3">Tech & AI</h3>
              <p className="text-zinc-400 leading-relaxed">
                Integrating the latest in Artificial Intelligence and Robotics to build smart, responsive systems that push technological boundaries.
              </p>
            </div>
            
            <div className="bg-zinc-900/50 border border-zinc-800 p-8 rounded-3xl hover:border-purple-500/50 transition-colors">
              <div className="bg-purple-500/10 w-14 h-14 rounded-2xl flex items-center justify-center mb-6">
                <Move3d className="w-7 h-7 text-purple-400" />
              </div>
              <h3 className="text-xl font-bold mb-3">Education & Environment</h3>
              <p className="text-zinc-400 leading-relaxed">
                Creating immersive XR applications focused on educational growth and environmental awareness for lasting understanding.
              </p>
            </div>

            <div className="bg-zinc-900/50 border border-zinc-800 p-8 rounded-3xl hover:border-blue-500/50 transition-colors">
              <div className="bg-blue-500/10 w-14 h-14 rounded-2xl flex items-center justify-center mb-6">
                <Code2 className="w-7 h-7 text-blue-400" />
              </div>
              <h3 className="text-xl font-bold mb-3">Health & Interactive</h3>
              <p className="text-zinc-400 leading-relaxed">
                Developing impactful health-focused solutions and entertaining XR games that engage users through cutting-edge technology.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-zinc-900 py-8 text-center text-zinc-500 text-sm">
        <p>© {new Date().getFullYear()} IMAXR. XR & AI Technologies.</p>
      </footer>
    </div>
  )
}
