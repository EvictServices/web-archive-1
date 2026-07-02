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
      <div className="bg-bg">
        <FeaturesSection />
        <ExtrasSection />
        <TestimonialsSection />
        <Footer />
      </div>
    </SmoothScroll>
  )
}
