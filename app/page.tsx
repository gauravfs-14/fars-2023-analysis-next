"use client"

import { useEffect } from "react"
import Hero from "@/components/hero"
import Navbar from "@/components/navbar"
import QuickStats from "@/components/quick-stats"
import CrashInsights from "@/components/crash-insights"
import CityScorecard from "@/components/city-scorecard"
import WeatherCorrelation from "@/components/weather-correlation"
import CrashTimeline from "@/components/crash-timeline"
import DataExplorer from "@/components/data-explorer"
import Footer from "@/components/footer"

export default function Home() {
  // Add scroll reveal functionality
  useEffect(() => {
    const handleScroll = () => {
      const reveals = document.querySelectorAll(".scroll-reveal")

      for (let i = 0; i < reveals.length; i++) {
        const windowHeight = window.innerHeight
        const elementTop = reveals[i].getBoundingClientRect().top
        const elementVisible = 150

        if (elementTop < windowHeight - elementVisible) {
          reveals[i].classList.add("revealed")
        }
      }
    }

    window.addEventListener("scroll", handleScroll)
    handleScroll() // Check on initial load

    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      <QuickStats />
      <CrashInsights />
      <CityScorecard />
      <WeatherCorrelation />
      <CrashTimeline />
      <DataExplorer />
      <Footer />
    </main>
  )
}
