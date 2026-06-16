import Navbar from '@/components/sections/Navbar'
import HeroSection from '@/components/sections/HeroSection'
import FeaturesSection from '@/components/sections/FeaturesSection'
import ExtrasSection from '@/components/sections/ExtrasSection'
import TestimonialsSection from '@/components/sections/TestimonialsSection'
import Footer from '@/components/sections/Footer'

export default function Home() {
  return (
    <>
      <Navbar />
      <HeroSection />
      <div className="bg-bg">
        <FeaturesSection />
        <ExtrasSection />
        <TestimonialsSection />
        <Footer />
      </div>
    </>
  )
}
