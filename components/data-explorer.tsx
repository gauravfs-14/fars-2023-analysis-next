"use client"

import { useState, useEffect, useMemo } from "react"
import { useFarsData, type FarsFeature } from "@/hooks/use-fars-data"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Search, Download, Filter } from "lucide-react"
import ScrollReveal from "@/components/scroll-reveal"
import { motion } from "framer-motion"

export default function DataExplorer() {
  const { loading, error } = useFarsData()
  const [rawData, setRawData] = useState<FarsFeature[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [yearFilter, setYearFilter] = useState<string>("all")
  const [stateFilter, setStateFilter] = useState<string>("all")
  const [weatherFilter, setWeatherFilter] = useState<string>("all")
  const itemsPerPage = 10

  // Fetch raw data
  useEffect(() => {
    const fetchRawData = async () => {
      try {
        const response = await fetch(
          "https://zlyp6b2wyu34rqw4.public.blob.vercel-storage.com/geoData-xrAxBoCKwlqQ2qcThRClJjEUgC5LR3.json",
        )
        const data = await response.json()
        setRawData(data.features)
      } catch (error) {
        console.error("Error fetching raw data:", error)
      }
    }

    fetchRawData()
  }, [])

  // Get unique values for filters
  const uniqueYears = useMemo(() => {
    if (!rawData.length) return []
    return [...new Set(rawData.map((item) => item.properties.YEAR))].sort()
  }, [rawData])

  const uniqueStates = useMemo(() => {
    if (!rawData.length) return []
    return [...new Set(rawData.map((item) => item.properties.STATENAME))].sort()
  }, [rawData])

  const uniqueWeather = useMemo(() => {
    if (!rawData.length) return []
    return [...new Set(rawData.map((item) => item.properties.WEATHERNAME))].sort()
  }, [rawData])

  // Filter and search data
  const filteredData = useMemo(() => {
    if (!rawData.length) return []

    return rawData.filter((item) => {
      const { YEAR, STATENAME, WEATHERNAME, CITYNAME, COUNTYNAME, PBSEXNAME, PBPTYPENAME } = item.properties

      // Apply filters
      if (yearFilter !== "all" && YEAR.toString() !== yearFilter) return false
      if (stateFilter !== "all" && STATENAME !== stateFilter) return false
      if (weatherFilter !== "all" && WEATHERNAME !== weatherFilter) return false

      // Apply search
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase()
        return (
          STATENAME.toLowerCase().includes(searchLower) ||
          (CITYNAME && CITYNAME.toLowerCase().includes(searchLower)) ||
          (COUNTYNAME && COUNTYNAME.toLowerCase().includes(searchLower)) ||
          PBSEXNAME.toLowerCase().includes(searchLower) ||
          PBPTYPENAME.toLowerCase().includes(searchLower) ||
          WEATHERNAME.toLowerCase().includes(searchLower)
        )
      }

      return true
    })
  }, [rawData, searchTerm, yearFilter, stateFilter, weatherFilter])

  // Pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage)
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    return filteredData.slice(startIndex, startIndex + itemsPerPage)
  }, [filteredData, currentPage])

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, yearFilter, stateFilter, weatherFilter])

  // Export data as CSV
  const exportCSV = () => {
    if (!filteredData.length) return

    // Get headers from first item
    const headers = Object.keys(filteredData[0].properties)

    // Create CSV content
    const csvContent = [
      headers.join(","),
      ...filteredData.map((item) =>
        headers
          .map((header) => {
            const value = item.properties[header as keyof typeof item.properties]
            // Handle values with commas by wrapping in quotes
            return typeof value === "string" && value.includes(",") ? `"${value}"` : value
          })
          .join(","),
      ),
    ].join("\n")

    // Create and download file
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", "fars_data_export.csv")
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  if (loading || !rawData.length) {
    return (
      <section id="data-explorer" className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="section-title">Data Explorer</h2>
          <Skeleton className="h-[600px] w-full rounded-lg" />
        </div>
      </section>
    )
  }

  return (
    <section id="data-explorer" className="py-20 bg-gray-50">
      <div className="container mx-auto px-6">
        <ScrollReveal>
          <h2 className="section-title">Data Explorer</h2>
          <p className="section-description">Explore and filter the raw FARS data</p>
        </ScrollReveal>

        <ScrollReveal delay={200}>
          <Card className="mb-10 border-0 shadow-md">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100">
              <CardTitle className="flex items-center justify-between text-xl text-gray-800">
                <div className="flex items-center">
                  <Filter className="h-5 w-5 mr-2 text-blue-600" />
                  <span>Search and Filter</span>
                </div>
                <Button
                  variant="outline"
                  onClick={exportCSV}
                  className="flex items-center gap-2 border-blue-200 text-blue-700 hover:bg-blue-50"
                >
                  <Download className="h-4 w-4" />
                  Export CSV
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="bg-white p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Search..."
                    className="pl-10 border-blue-200 focus:border-blue-500 focus:ring-blue-500 h-12"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                <div>
                  <Select value={yearFilter} onValueChange={setYearFilter}>
                    <SelectTrigger className="border-blue-200 focus:border-blue-500 focus:ring-blue-500 h-12">
                      <SelectValue placeholder="Filter by Year" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Years</SelectItem>
                      {uniqueYears.map((year) => (
                        <SelectItem key={year} value={year.toString()}>
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Select value={stateFilter} onValueChange={setStateFilter}>
                    <SelectTrigger className="border-blue-200 focus:border-blue-500 focus:ring-blue-500 h-12">
                      <SelectValue placeholder="Filter by State" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All States</SelectItem>
                      {uniqueStates.map((state) => (
                        <SelectItem key={state} value={state}>
                          {state}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Select value={weatherFilter} onValueChange={setWeatherFilter}>
                    <SelectTrigger className="border-blue-200 focus:border-blue-500 focus:ring-blue-500 h-12">
                      <SelectValue placeholder="Filter by Weather" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Weather</SelectItem>
                      {uniqueWeather.map((weather) => (
                        <SelectItem key={weather} value={weather}>
                          {weather}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="text-sm text-gray-500 mb-2">
                Showing {filteredData.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} to{" "}
                {Math.min(currentPage * itemsPerPage, filteredData.length)} of {filteredData.length} results
              </div>
            </CardContent>
          </Card>
        </ScrollReveal>

        <ScrollReveal delay={300}>
          <Card className="border-0 shadow-md overflow-hidden">
            <CardContent className="p-0 overflow-auto bg-white">
              <Table>
                <TableHeader className="bg-blue-50 sticky top-0">
                  <TableRow>
                    <TableHead className="text-gray-700 py-4">Year</TableHead>
                    <TableHead className="text-gray-700 py-4">State</TableHead>
                    <TableHead className="text-gray-700 py-4">City</TableHead>
                    <TableHead className="text-gray-700 py-4">County</TableHead>
                    <TableHead className="text-gray-700 py-4">Person Type</TableHead>
                    <TableHead className="text-gray-700 py-4">Age</TableHead>
                    <TableHead className="text-gray-700 py-4">Gender</TableHead>
                    <TableHead className="text-gray-700 py-4">Weather</TableHead>
                    <TableHead className="text-gray-700 py-4">Light Condition</TableHead>
                    <TableHead className="text-gray-700 py-4">Road Type</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedData.length > 0 ? (
                    paginatedData.map((item, index) => (
                      <motion.tr
                        key={index}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                      >
                        <TableCell className="py-3">{item.properties.YEAR}</TableCell>
                        <TableCell className="py-3">{item.properties.STATENAME}</TableCell>
                        <TableCell className="py-3">{item.properties.CITYNAME}</TableCell>
                        <TableCell className="py-3">{item.properties.COUNTYNAME?.split(" (")[0]}</TableCell>
                        <TableCell className="py-3">{item.properties.PBPTYPENAME}</TableCell>
                        <TableCell className="py-3">{item.properties.PBAGE}</TableCell>
                        <TableCell className="py-3">{item.properties.PBSEXNAME}</TableCell>
                        <TableCell className="py-3">{item.properties.WEATHERNAME}</TableCell>
                        <TableCell className="py-3">{item.properties.LGT_CONDNAME}</TableCell>
                        <TableCell className="py-3">{item.properties.FUNC_SYSNAME}</TableCell>
                      </motion.tr>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={10} className="text-center py-8 text-gray-500">
                        No results found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </ScrollReveal>

        {totalPages > 1 && (
          <ScrollReveal delay={400}>
            <div className="mt-8 flex justify-center">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                      className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>

                  {[...Array(Math.min(5, totalPages))].map((_, i) => {
                    let pageNum

                    if (totalPages <= 5) {
                      pageNum = i + 1
                    } else if (currentPage <= 3) {
                      pageNum = i + 1
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i
                    } else {
                      pageNum = currentPage - 2 + i
                    }

                    return (
                      <PaginationItem key={i}>
                        <PaginationLink
                          onClick={() => setCurrentPage(pageNum)}
                          isActive={currentPage === pageNum}
                          className={currentPage === pageNum ? "bg-blue-100 text-blue-700 border-blue-200" : ""}
                        >
                          {pageNum}
                        </PaginationLink>
                      </PaginationItem>
                    )
                  })}

                  <PaginationItem>
                    <PaginationNext
                      onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                      className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          </ScrollReveal>
        )}
      </div>
    </section>
  )
}
