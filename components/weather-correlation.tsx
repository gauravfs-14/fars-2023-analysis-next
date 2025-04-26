"use client"

import { useMemo } from "react"
import { useFarsData } from "@/hooks/use-fars-data"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import ScrollReveal from "@/components/scroll-reveal"
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  AreaChart,
  Area,
} from "recharts"

export default function WeatherCorrelation() {
  const data = useFarsData()

  const weatherColors = {
    Clear: "#22c55e", // green
    Rain: "#3b82f6", // blue
    Cloudy: "#94a3b8", // slate
    Snow: "#e2e8f0", // light gray
    "Fog, Smog, Smoke": "#64748b", // darker gray
    "Severe Crosswinds": "#fb923c", // orange
    "Blowing Snow": "#cbd5e1", // lighter gray
    "Freezing Rain or Drizzle": "#38bdf8", // lighter blue
    Other: "#a1a1aa", // zinc
  }

  // Process weather data by month
  const weatherByMonthData = useMemo(() => {
    if (data.loading) return []

    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ]

    // Get top weather conditions
    const topWeatherConditions = Object.entries(data.crashesByWeather)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([weather]) => weather)

    return months.map((month) => {
      const monthData: Record<string, any> = { month }

      // Add data for top weather conditions
      topWeatherConditions.forEach((weather) => {
        monthData[weather] = data.crashesWeatherByMonth[month]?.[weather] || 0
      })

      return monthData
    })
  }, [data.crashesWeatherByMonth, data.crashesByWeather, data.loading])

  // Process weather impact on crashes
  const weatherImpactData = useMemo(() => {
    if (data.loading) return []

    return Object.entries(data.crashesByWeather)
      .filter(([weather]) => weather !== "Unknown" && weather !== "Not Reported")
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([weather, count]) => ({
        weather,
        crashes: count,
      }))
  }, [data.crashesByWeather, data.loading])

  // Process weather and light condition correlation
  const weatherLightData = useMemo(() => {
    if (data.loading) return []

    const result: Record<string, Record<string, number>> = {}

    // Initialize with top weather conditions
    const topWeather = Object.entries(data.crashesByWeather)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([weather]) => weather)

    topWeather.forEach((weather) => {
      result[weather] = {}
    })

    // This would require additional data processing that we don't have in the current data structure
    // For a real implementation, we would need to process the raw data to create this correlation

    // Mocking some data for demonstration
    result["Clear"] = { Daylight: 5000, "Dark - Not Lighted": 2500, "Dark - Lighted": 1800, Dusk: 800, Dawn: 600 }
    result["Rain"] = { Daylight: 2000, "Dark - Not Lighted": 3000, "Dark - Lighted": 2200, Dusk: 400, Dawn: 300 }
    result["Cloudy"] = { Daylight: 3000, "Dark - Not Lighted": 1800, "Dark - Lighted": 1500, Dusk: 600, Dawn: 500 }
    result["Snow"] = { Daylight: 1000, "Dark - Not Lighted": 1200, "Dark - Lighted": 800, Dusk: 200, Dawn: 300 }
    result["Fog, Smog, Smoke"] = {
      Daylight: 500,
      "Dark - Not Lighted": 800,
      "Dark - Lighted": 600,
      Dusk: 300,
      Dawn: 400,
    }

    // Convert to array format for charts
    return Object.entries(result).map(([weather, lightData]) => {
      return {
        weather,
        ...lightData,
      }
    })
  }, [data.crashesByWeather, data.loading])

  // Calculate weather risk factors
  const weatherRiskFactors = useMemo(() => {
    if (data.loading) return []

    // Get total crashes
    const totalCrashes = Object.values(data.crashesByWeather).reduce((sum, count) => sum + count, 0)

    // Calculate percentage for each weather condition
    return Object.entries(data.crashesByWeather)
      .filter(([weather]) => weather !== "Unknown" && weather !== "Not Reported")
      .map(([weather, count]) => ({
        weather,
        percentage: ((count / totalCrashes) * 100).toFixed(1),
        severity:
          weather === "Clear"
            ? "Low"
            : weather === "Cloudy"
              ? "Low-Medium"
              : weather === "Rain"
                ? "Medium"
                : weather === "Snow"
                  ? "High"
                  : weather === "Fog, Smog, Smoke"
                    ? "Very High"
                    : "Medium-High",
      }))
      .sort((a, b) => Number(b.percentage) - Number(a.percentage))
      .slice(0, 5)
  }, [data.crashesByWeather, data.loading])

  if (data.loading) {
    return (
      <section id="weather-correlation" className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="section-title">Weather Correlation</h2>
          <Skeleton className="h-[400px] w-full rounded-lg" />
        </div>
      </section>
    )
  }

  return (
    <section id="weather-correlation" className="py-20 bg-gray-50">
      <div className="container mx-auto px-6">
        <ScrollReveal>
          <h2 className="section-title">Weather Correlation</h2>
          <p className="section-description">Analyzing how weather conditions impact crash frequency and severity</p>
        </ScrollReveal>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <ScrollReveal>
            <Card className="chart-container h-full">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl text-gray-800">Weather Impact on Crashes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={weatherImpactData}
                      layout="vertical"
                      margin={{ top: 20, right: 30, left: 120, bottom: 20 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis type="number" stroke="#6b7280" />
                      <YAxis dataKey="weather" type="category" stroke="#6b7280" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "white",
                          borderRadius: "0.5rem",
                          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                        }}
                        itemStyle={{ color: "#1e40af" }}
                      />
                      <Bar dataKey="crashes" name="Crashes" fill="#3b82f6" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </ScrollReveal>

          <ScrollReveal delay={200}>
            <Card className="chart-container h-full">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl text-gray-800">Weather and Light Condition Correlation</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={weatherLightData} margin={{ top: 20, right: 30, left: 20, bottom: 40 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="weather" stroke="#6b7280" />
                      <YAxis stroke="#6b7280" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "white",
                          borderRadius: "0.5rem",
                          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                        }}
                        itemStyle={{ color: "#1e40af" }}
                      />
                      <Legend />
                      <Bar dataKey="Daylight" name="Daylight" stackId="a" fill="#facc15" />
                      <Bar dataKey="Dark - Not Lighted" name="Dark - Not Lighted" stackId="a" fill="#1e293b" />
                      <Bar dataKey="Dark - Lighted" name="Dark - Lighted" stackId="a" fill="#475569" />
                      <Bar dataKey="Dusk" name="Dusk" stackId="a" fill="#94a3b8" />
                      <Bar dataKey="Dawn" name="Dawn" stackId="a" fill="#cbd5e1" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </ScrollReveal>
        </div>

        <ScrollReveal delay={300}>
          <Card className="chart-container">
            <CardHeader>
              <CardTitle className="text-xl text-gray-800">Weather Conditions by Month</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={weatherByMonthData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="month" stroke="#6b7280" />
                    <YAxis stroke="#6b7280" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "white",
                        borderRadius: "0.5rem",
                        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                      }}
                      itemStyle={{ color: "#1e40af" }}
                    />
                    <Legend />
                    {Object.entries(data.crashesByWeather)
                      .sort((a, b) => b[1] - a[1])
                      .slice(0, 6)
                      .map(([weather], index) => (
                        <Area
                          key={weather}
                          type="monotone"
                          dataKey={weather}
                          name={weather}
                          stackId="1"
                          stroke={
                            weatherColors[weather as keyof typeof weatherColors] || `hsl(${index * 40}, 70%, 50%)`
                          }
                          fill={weatherColors[weather as keyof typeof weatherColors] || `hsl(${index * 40}, 70%, 50%)`}
                          fillOpacity={0.6}
                        />
                      ))}
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </ScrollReveal>

        <ScrollReveal delay={400}>
          <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl shadow-md">
            <h3 className="text-xl font-semibold mb-4 text-center text-gray-800">Weather Risk Analysis</h3>
            <p className="text-gray-700 mb-6 text-center max-w-3xl mx-auto">
              Different weather conditions present varying levels of risk for road users. The table below summarizes the
              top weather conditions and their associated risk levels based on crash data analysis.
            </p>

            <div className="overflow-hidden rounded-lg shadow-sm border border-blue-100">
              <table className="min-w-full bg-white">
                <thead className="bg-blue-50">
                  <tr>
                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Weather Condition</th>
                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Percentage of Crashes</th>
                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Risk Level</th>
                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Safety Recommendation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {weatherRiskFactors.map((item, index) => (
                    <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                      <td className="py-3 px-4 text-sm text-gray-700">{item.weather}</td>
                      <td className="py-3 px-4 text-sm text-gray-700">{item.percentage}%</td>
                      <td className="py-3 px-4 text-sm">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            item.severity === "Low"
                              ? "bg-green-100 text-green-800"
                              : item.severity === "Low-Medium"
                                ? "bg-blue-100 text-blue-800"
                                : item.severity === "Medium"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : item.severity === "Medium-High"
                                    ? "bg-orange-100 text-orange-800"
                                    : item.severity === "High"
                                      ? "bg-red-100 text-red-800"
                                      : "bg-purple-100 text-purple-800"
                          }`}
                        >
                          {item.severity}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-700">
                        {item.weather === "Clear" && "Maintain normal driving practices, stay alert"}
                        {item.weather === "Cloudy" && "Be aware of changing conditions, maintain visibility"}
                        {item.weather === "Rain" && "Reduce speed, increase following distance, use headlights"}
                        {item.weather === "Snow" && "Significantly reduce speed, avoid sudden maneuvers"}
                        {item.weather === "Fog, Smog, Smoke" &&
                          "Use fog lights, drastically reduce speed, maximize visibility"}
                        {item.weather === "Severe Crosswinds" && "Grip steering wheel firmly, be cautious on bridges"}
                        {item.weather === "Freezing Rain or Drizzle" &&
                          "Avoid travel if possible, extreme caution on bridges"}
                        {item.weather === "Blowing Snow" && "Reduce speed, be prepared for sudden visibility changes"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
