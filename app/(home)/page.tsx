import Navbar from '@/components/sections/Navbar'
import HeroSection from '@/components/sections/HeroSection'
import FeaturesSection from '@/components/sections/FeaturesSection'
import ExtrasSection from '@/components/sections/ExtrasSection'
import TestimonialsSection from '@/components/sections/TestimonialsSection'
import Footer from '@/components/sections/Footer'
import ImpersonatorWarning from '@/components/ImpersonatorWarning'
import SmoothScroll from '@/components/SmoothScroll'

export default function Home() {
  return (
    <SmoothScroll>
      <ImpersonatorWarning />
      <Navbar />
      <HeroSection />
      <div className="relative bg-bg">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(55%_600px_at_50%_0%,rgba(95,130,141,0.06),transparent_70%),radial-gradient(45%_700px_at_80%_45%,rgba(95,130,141,0.04),transparent_70%),radial-gradient(50%_600px_at_15%_85%,rgba(95,130,141,0.04),transparent_70%)]"
        />
        <FeaturesSection />
        <ExtrasSection />
        <TestimonialsSection />
        <Footer />
      </div>
    </SmoothScroll>
  )
}
