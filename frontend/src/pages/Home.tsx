import React from 'react'
import { Container } from '../components/Container'
import { Hero } from '../components/Hero'
import { SubHero } from '../components/SubHero'
import { Testimonials } from '../components/Testimonials'
import { Pricing } from '../components/Pricing'
import { CTA } from '../components/CTA'
import { Navbar } from '../components/floating-dock'

const Home = () => {
  return (
    <div className="flex flex-col">
      <Hero />
      <SubHero />
      <Testimonials />
      <Pricing />
      <CTA />
      <Navbar />
    </div>
  )
}

export default Home