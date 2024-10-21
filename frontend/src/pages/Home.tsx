import React from 'react'

import { Hero } from '../components/Hero'
import { SubHero } from '../components/SubHero'
import { Testimonials } from '../components/Testimonials'
import { Pricing } from '../components/Pricing'
import { CTA } from '../components/CTA'


const Home = () => {
  return (
    <div className="flex flex-col">
      <Hero />
      <SubHero />
      <Testimonials />
      <Pricing />
      <CTA />
      
    </div>
  )
}

export default Home