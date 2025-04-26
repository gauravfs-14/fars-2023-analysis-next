"use client"

import { useState, useEffect } from "react"

export interface FarsFeature {
  type: string
  geometry: {
    type: string
    coordinates: [number, number]
  }
  properties: {
    STATE: number
    STATENAME: string
    ST_CASE: number
    YEAR: number
    CRASH_NUM1: string
    VEH_NO: number
    PER_NO: number
    PBPTYPENAME: string
    PBAGE: number
    PBAGENAME: string
    PBSEXNAME: string
    PBCWALKNAME: string
    PBSWALKNAME: string
    PBSZONENAME: string
    PEDCTYPENAME: string
    BIKECTYPENAME: string
    PEDLOCNAME: string
    BIKELOCNAME: string
    PEDPOSNAME: string
    BIKEPOSNAME: string
    PEDDIRNAME: string
    BIKEDIRNAME: string
    MOTDIRNAME: string
    MOTMANNAME: string
    PEDLEGNAME: string
    PEDSNRNAME: string
    PEDCGPNAME: string
    BIKECGPNAME: string
    COUNTYNAME: string
    CITYNAME: string
    DAY: number
    MONTHNAME: string
    DAY_WEEKNAME: string
    HOUR: number
    HOURNAME: string
    RUR_URBNAME: string
    FUNC_SYSNAME: string
    LATITUDENAME: number
    LONGITUDNAME: number
    HARM_EVNAME: string
    MAN_COLLNAME: string
    LGT_CONDNAME: string
    WEATHERNAME: string
    SCH_BUSNAME: string
    CLUSTERNUM?: number
  }
}

export interface FarsData {
  type: string
  features: FarsFeature[]
}

export interface CrashData {
  uniqueCrashes: Set<string>
  crashesByYear: Record<number, number>
  crashesByState: Record<string, number>
  crashesByMonth: Record<string, number>
  crashesByDayOfWeek: Record<string, number>
  crashesByHour: Record<string, number>
  crashesByGender: Record<string, number>
  crashesByAge: Record<string, number>
  crashesByWeather: Record<string, number>
  crashesByLightCondition: Record<string, number>
  crashesByRoadType: Record<string, number>
  crashesByCity: Record<string, number>
  crashesByCounty: Record<string, number>
  crashesByRuralUrban: Record<string, number>
  crashesByPersonType: Record<string, number>
  crashesWeatherByMonth: Record<string, Record<string, number>>
  crashesByYearAndMonth: Record<number, Record<string, number>>
  crashesByStateAndYear: Record<string, Record<number, number>>
  crashesByCityAndYear: Record<string, Record<number, number>>
  totalVictims: number
  loading: boolean
  error: string | null
}

export function useFarsData(): CrashData {
  const [data, setData] = useState<CrashData>({
    uniqueCrashes: new Set<string>(),
    crashesByYear: {},
    crashesByState: {},
    crashesByMonth: {},
    crashesByDayOfWeek: {},
    crashesByHour: {},
    crashesByGender: {},
    crashesByAge: {},
    crashesByWeather: {},
    crashesByLightCondition: {},
    crashesByRoadType: {},
    crashesByCity: {},
    crashesByCounty: {},
    crashesByRuralUrban: {},
    crashesByPersonType: {},
    crashesWeatherByMonth: {},
    crashesByYearAndMonth: {},
    crashesByStateAndYear: {},
    crashesByCityAndYear: {},
    totalVictims: 0,
    loading: true,
    error: null,
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://zlyp6b2wyu34rqw4.public.blob.vercel-storage.com/geoData-xrAxBoCKwlqQ2qcThRClJjEUgC5LR3.json",
        )
        const jsonData: FarsData = await response.json()

        const uniqueCrashes = new Set<string>()
        const crashesByYear: Record<number, number> = {}
        const crashesByState: Record<string, number> = {}
        const crashesByMonth: Record<string, number> = {}
        const crashesByDayOfWeek: Record<string, number> = {}
        const crashesByHour: Record<string, number> = {}
        const crashesByGender: Record<string, number> = {}
        const crashesByAge: Record<string, number> = {}
        const crashesByWeather: Record<string, number> = {}
        const crashesByLightCondition: Record<string, number> = {}
        const crashesByRoadType: Record<string, number> = {}
        const crashesByCity: Record<string, number> = {}
        const crashesByCounty: Record<string, number> = {}
        const crashesByRuralUrban: Record<string, number> = {}
        const crashesByPersonType: Record<string, number> = {}
        const crashesWeatherByMonth: Record<string, Record<string, number>> = {}
        const crashesByYearAndMonth: Record<number, Record<string, number>> = {}
        const crashesByStateAndYear: Record<string, Record<number, number>> = {}
        const crashesByCityAndYear: Record<string, Record<number, number>> = {}

        let totalVictims = 0

        // Process each feature in the GeoJSON
        jsonData.features.forEach((feature) => {
          const {
            CRASH_NUM1,
            YEAR,
            STATENAME,
            MONTHNAME,
            DAY_WEEKNAME,
            HOURNAME,
            PBSEXNAME,
            PBAGE,
            WEATHERNAME,
            LGT_CONDNAME,
            FUNC_SYSNAME,
            CITYNAME,
            COUNTYNAME,
            RUR_URBNAME,
            PBPTYPENAME,
          } = feature.properties

          // Count unique crashes
          uniqueCrashes.add(CRASH_NUM1)

          // Count by year
          crashesByYear[YEAR] = (crashesByYear[YEAR] || 0) + 1

          // Count by state
          crashesByState[STATENAME] = (crashesByState[STATENAME] || 0) + 1

          // Count by month
          crashesByMonth[MONTHNAME] = (crashesByMonth[MONTHNAME] || 0) + 1

          // Count by day of week
          crashesByDayOfWeek[DAY_WEEKNAME] = (crashesByDayOfWeek[DAY_WEEKNAME] || 0) + 1

          // Count by hour
          crashesByHour[HOURNAME] = (crashesByHour[HOURNAME] || 0) + 1

          // Count by gender
          crashesByGender[PBSEXNAME] = (crashesByGender[PBSEXNAME] || 0) + 1

          // Group ages into ranges
          let ageGroup = "Unknown"
          if (PBAGE !== null && PBAGE !== undefined) {
            if (PBAGE < 16) ageGroup = "Under 16"
            else if (PBAGE < 25) ageGroup = "16-24"
            else if (PBAGE < 35) ageGroup = "25-34"
            else if (PBAGE < 45) ageGroup = "35-44"
            else if (PBAGE < 55) ageGroup = "45-54"
            else if (PBAGE < 65) ageGroup = "55-64"
            else if (PBAGE < 75) ageGroup = "65-74"
            else ageGroup = "75+"
          }
          crashesByAge[ageGroup] = (crashesByAge[ageGroup] || 0) + 1

          // Count by weather
          crashesByWeather[WEATHERNAME] = (crashesByWeather[WEATHERNAME] || 0) + 1

          // Count by light condition
          crashesByLightCondition[LGT_CONDNAME] = (crashesByLightCondition[LGT_CONDNAME] || 0) + 1

          // Count by road type
          crashesByRoadType[FUNC_SYSNAME] = (crashesByRoadType[FUNC_SYSNAME] || 0) + 1

          // Count by city (filter out "NOT APPLICABLE" or similar)
          if (CITYNAME && !CITYNAME.includes("NOT APPLICABLE")) {
            crashesByCity[CITYNAME] = (crashesByCity[CITYNAME] || 0) + 1
          }

          // Count by county
          if (COUNTYNAME) {
            const countyName = COUNTYNAME.split(" (")[0] // Remove county code if present
            crashesByCounty[countyName] = (crashesByCounty[countyName] || 0) + 1
          }

          // Count by rural/urban
          crashesByRuralUrban[RUR_URBNAME] = (crashesByRuralUrban[RUR_URBNAME] || 0) + 1

          // Count by person type
          crashesByPersonType[PBPTYPENAME] = (crashesByPersonType[PBPTYPENAME] || 0) + 1

          // Weather by month correlation
          if (!crashesWeatherByMonth[MONTHNAME]) {
            crashesWeatherByMonth[MONTHNAME] = {}
          }
          crashesWeatherByMonth[MONTHNAME][WEATHERNAME] = (crashesWeatherByMonth[MONTHNAME][WEATHERNAME] || 0) + 1

          // Year and month correlation
          if (!crashesByYearAndMonth[YEAR]) {
            crashesByYearAndMonth[YEAR] = {}
          }
          crashesByYearAndMonth[YEAR][MONTHNAME] = (crashesByYearAndMonth[YEAR][MONTHNAME] || 0) + 1

          // State and year correlation
          if (!crashesByStateAndYear[STATENAME]) {
            crashesByStateAndYear[STATENAME] = {}
          }
          crashesByStateAndYear[STATENAME][YEAR] = (crashesByStateAndYear[STATENAME][YEAR] || 0) + 1

          // City and year correlation (for timeline)
          if (CITYNAME && !CITYNAME.includes("NOT APPLICABLE")) {
            if (!crashesByCityAndYear[CITYNAME]) {
              crashesByCityAndYear[CITYNAME] = {}
            }
            crashesByCityAndYear[CITYNAME][YEAR] = (crashesByCityAndYear[CITYNAME][YEAR] || 0) + 1
          }

          // Count total victims
          totalVictims++
        })

        setData({
          uniqueCrashes,
          crashesByYear,
          crashesByState,
          crashesByMonth,
          crashesByDayOfWeek,
          crashesByHour,
          crashesByGender,
          crashesByAge,
          crashesByWeather,
          crashesByLightCondition,
          crashesByRoadType,
          crashesByCity,
          crashesByCounty,
          crashesByRuralUrban,
          crashesByPersonType,
          crashesWeatherByMonth,
          crashesByYearAndMonth,
          crashesByStateAndYear,
          crashesByCityAndYear,
          totalVictims,
          loading: false,
          error: null,
        })
      } catch (error) {
        console.error("Error fetching FARS data:", error)
        setData((prev) => ({
          ...prev,
          loading: false,
          error: "Failed to load data. Please try again later.",
        }))
      }
    }

    fetchData()
  }, [])

  return data
}

// Helper function to sort object by values
export function sortObjectByValues(obj: Record<string, number>, ascending = false): [string, number][] {
  return Object.entries(obj).sort((a, b) => {
    return ascending ? a[1] - b[1] : b[1] - a[1]
  })
}

// Helper function to get top N items from an object
export function getTopItems(obj: Record<string, number>, count: number): [string, number][] {
  return sortObjectByValues(obj).slice(0, count)
}

// Helper function to format large numbers
export function formatNumber(num: number): string {
  return num.toLocaleString()
}

// Helper function to calculate percentage
export function calculatePercentage(value: number, total: number): string {
  return ((value / total) * 100).toFixed(1) + "%"
}

// Helper function to get month order for consistent sorting
export function getMonthOrder(month: string): number {
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
  return months.indexOf(month)
}

// Helper function to get day of week order for consistent sorting
export function getDayOfWeekOrder(day: string): number {
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
  return days.indexOf(day)
}

// Helper function to get hour order for consistent sorting
export function getHourOrder(hour: string): number {
  // Extract the hour from strings like "4:00pm-4:59pm"
  const match = hour.match(/(\d+):00(am|pm)/)
  if (!match) return -1

  let hourNum = Number.parseInt(match[1])
  const period = match[2]

  if (period === "pm" && hourNum !== 12) hourNum += 12
  if (period === "am" && hourNum === 12) hourNum = 0

  return hourNum
}
