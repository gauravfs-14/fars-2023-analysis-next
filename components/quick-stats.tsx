"use client"

import { useFarsData, formatNumber } from "@/hooks/use-fars-data"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { AlertTriangle, Calendar, MapPin, Users, Cloud, Clock, Car, RouteIcon as Road } from "lucide-react"
import ScrollReveal from "@/components/scroll-reveal"

export default function QuickStats() {
  const data = useFarsData()

  if (data.loading) {
    return (
      <section id="quick-stats" className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="section-title">Quick Statistics</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <Skeleton className="h-4 w-24" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-10 w-32 mb-2" />
                  <Skeleton className="h-4 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    )
  }

  // Calculate total crashes
  const totalCrashes = data.uniqueCrashes.size

  // Get top state
  const topState = Object.entries(data.crashesByState).sort((a, b) => b[1] - a[1])[0]

  // Get top weather condition
  const topWeather = Object.entries(data.crashesByWeather).sort((a, b) => b[1] - a[1])[0]

  // Get most dangerous time
  const topHour = Object.entries(data.crashesByHour).sort((a, b) => b[1] - a[1])[0]

  // Get most dangerous day
  const topDay = Object.entries(data.crashesByDayOfWeek).sort((a, b) => b[1] - a[1])[0]

  // Get most affected person type
  const topPersonType = Object.entries(data.crashesByPersonType).sort((a, b) => b[1] - a[1])[0]

  // Get most dangerous road type
  const topRoadType = Object.entries(data.crashesByRoadType).sort((a, b) => b[1] - a[1])[0]

  // Get rural vs urban comparison
  const ruralUrban = Object.entries(data.crashesByRuralUrban).sort((a, b) => b[1] - a[1])
  const ruralUrbanRatio =
    ruralUrban.length > 1
      ? `${Math.round((ruralUrban[0][1] / (ruralUrban[0][1] + ruralUrban[1][1])) * 100)}% ${ruralUrban[0][0]}`
      : "N/A"

  const stats = [
    {
      title: "Total Crashes",
      value: formatNumber(totalCrashes),
      description: `Across ${Object.keys(data.crashesByYear).length} years of data`,
      icon: <AlertTriangle className="h-5 w-5 text-blue-600" />,
      color: "from-blue-50 to-indigo-50",
      borderColor: "border-blue-200",
    },
    {
      title: "Total Victims",
      value: formatNumber(data.totalVictims),
      description: "Individuals involved in crashes",
      icon: <Users className="h-5 w-5 text-blue-600" />,
      color: "from-blue-50 to-indigo-50",
      borderColor: "border-blue-200",
    },
    {
      title: "Most Affected State",
      value: topState[0],
      description: `${formatNumber(topState[1])} crashes recorded`,
      icon: <MapPin className="h-5 w-5 text-blue-600" />,
      color: "from-blue-50 to-indigo-50",
      borderColor: "border-blue-200",
    },
    {
      title: "Most Common Weather",
      value: topWeather[0],
      description: `Present in ${formatNumber(topWeather[1])} crashes`,
      icon: <Cloud className="h-5 w-5 text-blue-600" />,
      color: "from-blue-50 to-indigo-50",
      borderColor: "border-blue-200",
    },
    {
      title: "Most Dangerous Time",
      value: topHour[0],
      description: `${formatNumber(topHour[1])} crashes occurred`,
      icon: <Clock className="h-5 w-5 text-blue-600" />,
      color: "from-blue-50 to-indigo-50",
      borderColor: "border-blue-200",
    },
    {
      title: "Most Dangerous Day",
      value: topDay[0],
      description: `${formatNumber(topDay[1])} crashes recorded`,
      icon: <Calendar className="h-5 w-5 text-blue-600" />,
      color: "from-blue-50 to-indigo-50",
      borderColor: "border-blue-200",
    },
    {
      title: "Most Common Road Type",
      value: topRoadType[0],
      description: `${formatNumber(topRoadType[1])} crashes recorded`,
      icon: <Road className="h-5 w-5 text-blue-600" />,
      color: "from-blue-50 to-indigo-50",
      borderColor: "border-blue-200",
    },
    {
      title: "Rural vs Urban",
      value: ruralUrbanRatio,
      description: "Distribution of crash locations",
      icon: <Car className="h-5 w-5 text-blue-600" />,
      color: "from-blue-50 to-indigo-50",
      borderColor: "border-blue-200",
    },
  ]

  return (
    <section id="quick-stats" className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <ScrollReveal>
          <h2 className="section-title">Quick Statistics</h2>
          <p className="section-description">An overview of key metrics from the FARS data (2016-2023)</p>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 staggered-animation">
          {stats.map((stat, index) => (
            <Card key={index} className={`stat-card border-l-4 ${stat.borderColor} h-full`}>
              <CardHeader className={`stat-card-header bg-gradient-to-r ${stat.color}`}>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-gray-700">{stat.title}</CardTitle>
                  {stat.icon}
                </div>
              </CardHeader>
              <CardContent className="bg-white pt-4">
                <div className="text-2xl font-bold mb-2">{stat.value}</div>
                <p className="text-sm text-gray-500">{stat.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <ScrollReveal delay={300}>
          <div className="mt-16 p-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl shadow-md">
            <h3 className="text-2xl font-semibold mb-6 text-center text-gray-800">Key Insights</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h4 className="font-medium text-blue-700 mb-3 flex items-center text-lg">
                  <Clock className="h-5 w-5 mr-2" />
                  Temporal Patterns
                </h4>
                <p className="text-gray-600">
                  Crashes are most common during {topHour[0].toLowerCase()} and on {topDay[0]}s, suggesting that rush
                  hour traffic and weekend activities contribute significantly to accident rates.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h4 className="font-medium text-blue-700 mb-3 flex items-center text-lg">
                  <MapPin className="h-5 w-5 mr-2" />
                  Geographic Distribution
                </h4>
                <p className="text-gray-600">
                  {topState[0]} has the highest number of crashes, with a significant {ruralUrbanRatio.split("%")[0]}%
                  occurring in {ruralUrban[0][0].toLowerCase()} areas, highlighting the need for targeted safety
                  measures in these regions.
                </p>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
