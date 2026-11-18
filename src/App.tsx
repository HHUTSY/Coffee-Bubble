import { useEffect } from 'react'
import { LangProvider } from './content/i18n'
import { ScrollTrigger } from './lib/gsap'
import { useIsoLayoutEffect } from './lib/motion'
import { initSmoothScroll } from './lib/smooth'
import { ThemeBackdrop } from './components/ThemeBackdrop'
import { Cursor } from './components/Cursor'
import { Nav } from './components/Nav'
import { DayDial } from './components/DayDial'
import { Preloader } from './sections/Preloader'
import { Hero } from './sections/Hero'
import { Manifesto } from './sections/Manifesto'
import { Process } from './sections/Process'
import { Pastry } from './sections/Pastry'
import { Oven } from './sections/Oven'
import { Menu } from './sections/Menu'
import { Atmosphere } from './sections/Atmosphere'
import { Reviews } from './sections/Reviews'
import { Visit } from './sections/Visit'
import { Footer } from './sections/Footer'

function Page() {
  useIsoLayoutEffect(() => initSmoothScroll(), [])

  // Children create their ScrollTriggers first; order them by position, then measure once fonts and images settle.
  useIsoLayoutEffect(() => {
    ScrollTrigger.sort()
    ScrollTrigger.refresh()
  }, [])
  useEffect(() => {
    const refresh = () => ScrollTrigger.refresh()
    document.fonts.ready.then(refresh)
    window.addEventListener('load', refresh)
    return () => window.removeEventListener('load', refresh)
  }, [])

  return (
    <>
      <ThemeBackdrop />
      <Preloader />
      <Nav />
      <main id="main">
        <Hero />
        <Manifesto />
        <Process />
        <Pastry />
        <Oven />
        <Menu />
        <Atmosphere />
        <Reviews />
        <Visit />
      </main>
      <Footer />
      <DayDial />
      <Cursor />
      <div className="grain" aria-hidden />
    </>
  )
}

export default function App() {
  return (
    <LangProvider>
      <Page />
    </LangProvider>
  )
}
