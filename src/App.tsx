import { useEffect, useState } from 'react'
import { motion, useScroll, useSpring } from 'motion/react'
import Header from './components/Header'
import Hero from './components/Hero'
import About from './components/About'
import Stacks from './components/Stacks'
import Projects from './components/Projects'
import Education from './components/Education'
import Certificates from './components/Certificates'
import Contact from './components/Contact'
import Footer from './components/Footer'
import { sections } from './data/content'

export default function App() {
  const { scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.3 })
  const [current, setCurrent] = useState<{ index: string; label: string } | null>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const match = sections.find((s) => s.id === entry.target.id)
            if (match) setCurrent({ index: match.index, label: match.label })
          }
        }
      },
      { rootMargin: '-45% 0px -50% 0px' },
    )
    sections.forEach((s) => {
      const el = document.getElementById(s.id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [])

  return (
    <div className="relative min-h-screen">
      <Header />

      <main className="relative">
        <Hero />
        <About />
        <Stacks />
        <Projects />
        <Education />
        <Certificates />
        <Contact />
      </main>

      <Footer />

      {/* scroll progress rail */}
      <motion.div
        aria-hidden="true"
        style={{ scaleX: progress }}
        className="fixed inset-x-0 top-16 z-30 h-px origin-left bg-linear-to-r from-moss-bright to-moss-mid"
      />

      {/* live section indicator */}
      <motion.div
        aria-hidden="true"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: current ? 1 : 0, x: current ? 0 : -20 }}
        className="fixed bottom-6 left-5 z-30 hidden items-center gap-3 border hairline bg-void/80 px-4 py-2.5 font-mono text-[10px] tracking-[0.16em] uppercase backdrop-blur-sm lg:flex"
      >
        <span className="text-moss-bright">{current?.index}</span>
        <span className="h-3 w-px bg-line" />
        <span className="text-ash">{current?.label}</span>
      </motion.div>
    </div>
  )
}
