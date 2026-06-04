import React, { useEffect, useState } from 'react'
import GovernmentHeroMobile from './GovernmentHeroMobile'
import IndiaJobsHero from './GovernmentHero'

const Hero = () => {
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === 'undefined') return false
    return window.innerWidth < 768
  })

  useEffect(() => {
    const updateViewport = () => setIsMobile(window.innerWidth < 768)
    updateViewport()
    window.addEventListener('resize', updateViewport)
    return () => window.removeEventListener('resize', updateViewport)
  }, [])

  return (
    <div>
      {isMobile ? <GovernmentHeroMobile /> : <IndiaJobsHero />}
    </div>
  )
}

export default Hero