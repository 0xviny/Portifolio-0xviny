import { useEffect } from 'react'
import { useScroll, useSpring } from 'motion/react'
import Header from './components/Header'
import Hero from './components/Hero'
import About from './components/About'
import Stacks from './components/Stacks'
import Projects from './components/Projects'
import Statement from './components/Statement'
import Education from './components/Education'
import Certificates from './components/Certificates'
import Contact from './components/Contact'
import Footer from './components/Footer'

export default function App() {
  const { scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.3 })

  // rolagem suave nos âncoras (sem scroll-behavior no CSS, para o Tab
  // levar o foco ao controle na hora, sem a página ainda estar em movimento)
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement | null)?.closest?.(
        'a[href^="#"]',
      ) as HTMLAnchorElement | null
      const id = anchor?.getAttribute("href")?.slice(1)
      if (!id) return
      const el = document.getElementById(id)
      if (!el) return
      e.preventDefault()
      history.replaceState(null, "", `#${id}`)
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
      el.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" })
    }
    document.addEventListener("click", onClick)
    return () => document.removeEventListener("click", onClick)
  }, [])

  return (
    <>
      <Header progress={progress} />

      <main className="relative">
        <Hero />
        <About />
        <Stacks />
        <Projects />
        <Statement />
        <Education />
        <Certificates />
        <Contact />
      </main>

      <Footer />
    </>
  )
}
