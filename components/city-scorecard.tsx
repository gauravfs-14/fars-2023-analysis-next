"use client"

import { useState, useMemo } from "react"
import { useFarsData, formatNumber } from "@/hooks/use-fars-data"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { Search, MapPin, AlertTriangle, TrendingDown, TrendingUp } from "lucide-react"
import ScrollReveal from "@/components/scroll-reveal"
import { motion } from "framer-motion"

export default function CityScorecard() {
  const data = useFarsData()
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("safest")

  // Move all useMemo hooks before any conditional returns
  // Filter out cities with very few crashes (likely data errors or very small towns)
  const filteredCities = useMemo(() => {
    if (data.loading || !data.crashesByCity) return []

    return Object.entries(data.crashesByCity)
      .filter(([city, count]) => count >= 5) // Only include cities with at least 5 crashes
      .sort((a, b) => a[1] - b[1]) // Sort by crash count (ascending for safest)
  }, [data.crashesByCity, data.loading])

  const safestCities = useMemo(() => {
    return filteredCities.slice(0, 50) // Top 50 safest cities
  }, [filteredCities])

  const riskyestCities = useMemo(() => {
    return [...filteredCities].reverse().slice(0, 50) // Top 50 riskiest cities
  }, [filteredCities])

  // Filter cities based on search term
  const filteredSearchCities = useMemo(() => {
    if (data.loading || !data.crashesByCity || !searchTerm) {
      return []
    }

    return Object.entries(data.crashesByCity)
      .filter(([city]) => city.toLowerCase().includes(searchTerm.toLowerCase()))
      .sort((a, b) => a[1] - b[1])
  }, [data.crashesByCity, searchTerm, data.loading])

  // Render city card - this is not a hook, so it can be defined after conditionals
  const renderCityCard = (city: string, crashes: number, index: number, isSafest: boolean) => {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: index * 0.05 }}
      >
        <Card key={city} className={`overflow-hidden border-0 shadow-md rounded-xl card-hover h-full`}>
          <CardHeader
            className={`pb-2 ${
              isSafest ? "bg-gradient-to-r from-green-50 to-blue-50" : "bg-gradient-to-r from-red-50 to-orange-50"
            }`}
          >
            <div className="flex items-center justify-between">
              <Badge
                variant={isSafest ? "outline" : "destructive"}
                className={`mb-1 ${isSafest ? "border-green-500 text-green-700" : "bg-red-500"}`}
              >
                Rank #{index + 1}
              </Badge>
              {isSafest ? (
                <TrendingDown className="h-5 w-5 text-green-500" />
              ) : (
                <TrendingUp className="h-5 w-5 text-red-500" />
              )}
            </div>
            <CardTitle className="text-lg flex items-center">
              <MapPin className="h-4 w-4 mr-1" />
              {city}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4 bg-white">
            <div className="flex items-center">
              <AlertTriangle className={`h-5 w-5 mr-2 ${isSafest ? "text-green-500" : "text-red-500"}`} />
              <div>
                <div className="text-2xl font-bold">{formatNumber(crashes)}</div>
                <p className="text-sm text-gray-500">Recorded crashes</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    )
  }

  // Now we can have conditional rendering for loading state
  if (data.loading) {
    return (
      <section id="city-scorecard" className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="section-title">City Scorecard</h2>
          <Skeleton className="h-[500px] w-full rounded-lg" />
        </div>
      </section>
    )
  }

  return (
    <section id="city-scorecard" className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <ScrollReveal>
          <h2 className="section-title">City Scorecard</h2>
          <p className="section-description">Explore the safest and riskiest cities based on crash data</p>
        </ScrollReveal>

        <ScrollReveal delay={200}>
          <div className="mb-8">
            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                type="text"
                placeholder="Search for a city..."
                className="pl-10 border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </ScrollReveal>

        {searchTerm ? (
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">Search Results</h3>
            {filteredSearchCities.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredSearchCities
                  .slice(0, 12)
                  .map(([city, crashes], index) => renderCityCard(city, crashes, index, true))}
              </div>
            ) : (
              <Card className="border-0 shadow-md">
                <CardContent className="pt-6">
                  <p className="text-center text-gray-500">No cities found matching "{searchTerm}"</p>
                </CardContent>
              </Card>
            )}
          </div>
        ) : (
          <Tabs defaultValue="safest" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8 bg-white shadow-md rounded-lg">
              <TabsTrigger
                value="safest"
                className="data-[state=active]:bg-green-50 data-[state=active]:text-green-700"
              >
                Safest Cities
              </TabsTrigger>
              <TabsTrigger value="riskiest" className="data-[state=active]:bg-red-50 data-[state=active]:text-red-700">
                Riskiest Cities
              </TabsTrigger>
            </TabsList>

            <TabsContent value="safest">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {safestCities.slice(0, 12).map(([city, crashes], index) => renderCityCard(city, crashes, index, true))}
              </div>

              <ScrollReveal delay={400}>
                <div className="mt-8 p-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl shadow-md">
                  <h3 className="text-xl font-semibold mb-4 text-center text-gray-800">
                    What Makes These Cities Safer?
                  </h3>
                  <p className="text-gray-700 mb-4">
                    Cities with lower crash rates often share several common characteristics that contribute to their
                    road safety:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                      <h4 className="font-medium text-green-700 mb-2">Infrastructure Design</h4>
                      <p className="text-gray-600 text-sm">
                        Well-designed road networks with proper signage, traffic calming measures, and dedicated lanes
                        for vulnerable road users.
                      </p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                      <h4 className="font-medium text-green-700 mb-2">Enforcement & Education</h4>
                      <p className="text-gray-600 text-sm">
                        Consistent traffic law enforcement combined with public education campaigns about road safety.
                      </p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                      <h4 className="font-medium text-green-700 mb-2">Population Factors</h4>
                      <p className="text-gray-600 text-sm">
                        Lower population density, less traffic congestion, and shorter average commute distances.
                      </p>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            </TabsContent>

            <TabsContent value="riskiest">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {riskyestCities
                  .slice(0, 12)
                  .map(([city, crashes], index) => renderCityCard(city, crashes, index, false))}
              </div>

              <ScrollReveal delay={400}>
                <div className="mt-8 p-6 bg-gradient-to-r from-red-50 to-orange-50 rounded-xl shadow-md">
                  <h3 className="text-xl font-semibold mb-4 text-center text-gray-800">
                    Risk Factors in High-Crash Cities
                  </h3>
                  <p className="text-gray-700 mb-4">
                    Cities with higher crash rates often face multiple challenges that contribute to increased road
                    safety risks:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                      <h4 className="font-medium text-red-700 mb-2">Urban Density</h4>
                      <p className="text-gray-600 text-sm">
                        Higher population density, more vehicles, and complex traffic patterns increase the likelihood
                        of crashes.
                      </p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                      <h4 className="font-medium text-red-700 mb-2">Infrastructure Challenges</h4>
                      <p className="text-gray-600 text-sm">
                        Aging infrastructure, inadequate pedestrian facilities, and poor road maintenance contribute to
                        safety issues.
                      </p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                      <h4 className="font-medium text-red-700 mb-2">Socioeconomic Factors</h4>
                      <p className="text-gray-600 text-sm">
                        Limited resources for enforcement, education, and infrastructure improvements can impact overall
                        road safety.
                      </p>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </section>
  )
}
