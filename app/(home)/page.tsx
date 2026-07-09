import Navbar from '@/components/sections/Navbar'
import HeroSection from '@/components/sections/HeroSection'
import FeaturesSection from '@/components/sections/FeaturesSection'
import ExtrasSection from '@/components/sections/ExtrasSection'
import TestimonialsSection from '@/components/sections/TestimonialsSection'
import Footer from '@/components/sections/Footer'
import ImpersonatorWarning from '@/components/ImpersonatorWarning'

export default function Home() {
  return (
    <>
      <ImpersonatorWarning />
      <Navbar />
      <HeroSection />
      <div className="relative">
        <FeaturesSection />
        <ExtrasSection />
        <TestimonialsSection />
        <Footer />
      </div>
    </>
  )
}
