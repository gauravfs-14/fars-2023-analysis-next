"use client";

import { useState } from "react";
import {
  useFarsData,
  getTopItems,
  getMonthOrder,
  getDayOfWeekOrder,
  getHourOrder,
} from "@/hooks/use-fars-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import ScrollReveal from "@/components/scroll-reveal";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  Area,
  AreaChart,
} from "recharts";

export default function CrashInsights() {
  const data = useFarsData();
  const [activeTab, setActiveTab] = useState("temporal");

  if (data.loading) {
    return (
      <section id="crash-insights" className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="section-title">Crash Insights</h2>
          <Skeleton className="h-[400px] w-full rounded-lg" />
        </div>
      </section>
    );
  }

  // Prepare data for temporal distribution
  const yearData = Object.entries(data.crashesByYear)
    .map(([year, count]) => ({
      year: Number.parseInt(year),
      crashes: count,
    }))
    .sort((a, b) => a.year - b.year);

  const monthData = Object.entries(data.crashesByMonth)
    .map(([month, count]) => ({
      month,
      crashes: count,
      order: getMonthOrder(month),
    }))
    .sort((a, b) => a.order - b.order)
    .map(({ month, crashes }) => ({ month, crashes }));

  const dayOfWeekData = Object.entries(data.crashesByDayOfWeek)
    .map(([day, count]) => ({
      day,
      crashes: count,
      order: getDayOfWeekOrder(day),
    }))
    .sort((a, b) => a.order - b.order)
    .map(({ day, crashes }) => ({ day, crashes }));

  const hourData = Object.entries(data.crashesByHour)
    .map(([hour, count]) => ({
      hour,
      crashes: count,
      order: getHourOrder(hour),
    }))
    .sort((a, b) => a.order - b.order)
    .map(({ hour, crashes }) => ({ hour, crashes }));

  // Prepare data for demographic distribution
  const genderData = Object.entries(data.crashesByGender)
    .filter(([gender]) => gender !== "Unknown" && gender !== "Not Reported")
    .map(([gender, count]) => ({
      gender,
      crashes: count,
    }));

  const ageData = Object.entries(data.crashesByAge)
    .filter(([age]) => age !== "Unknown")
    .map(([age, count]) => ({
      age,
      crashes: count,
    }));

  // Prepare data for environmental factors
  const weatherData = getTopItems(data.crashesByWeather, 8).map(
    ([weather, count]) => ({
      weather,
      crashes: count,
    })
  );

  const lightConditionData = getTopItems(data.crashesByLightCondition, 8).map(
    ([condition, count]) => ({
      condition,
      crashes: count,
    })
  );

  const roadTypeData = getTopItems(data.crashesByRoadType, 8).map(
    ([type, count]) => ({
      type,
      crashes: count,
    })
  );

  // Calculate year-over-year change
  const yearOverYearChange =
    yearData.length > 1
      ? (
          ((yearData[yearData.length - 1].crashes - yearData[0].crashes) /
            yearData[0].crashes) *
          100
        ).toFixed(1)
      : 0;

  // Find peak month
  const peakMonth = monthData.reduce(
    (max, current) => (current.crashes > max.crashes ? current : max),
    monthData[0]
  );

  // Find peak day
  const peakDay = dayOfWeekData.reduce(
    (max, current) => (current.crashes > max.crashes ? current : max),
    dayOfWeekData[0]
  );

  // Find peak hour
  const peakHour = hourData.reduce(
    (max, current) => (current.crashes > max.crashes ? current : max),
    hourData[0]
  );

  return (
    <section id="crash-insights" className="py-20 bg-gray-50">
      <div className="container mx-auto px-6">
        <ScrollReveal>
          <h2 className="section-title">Crash Insights</h2>
          <p className="section-description">
            Analyzing crash patterns across time, demographics, and
            environmental factors
          </p>
        </ScrollReveal>

        <Tabs
          defaultValue="temporal"
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="grid w-full max-w-3xl mx-auto grid-cols-3 mb-10 bg-white shadow-md rounded-lg overflow-hidden">
            <TabsTrigger
              value="temporal"
              className="relative py-3 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 data-[state=active]:font-medium data-[state=active]:after:content-[''] data-[state=active]:after:absolute data-[state=active]:after:bottom-0 data-[state=active]:after:left-0 data-[state=active]:after:right-0 data-[state=active]:after:h-1 data-[state=active]:after:bg-blue-600"
            >
              Temporal Distribution
            </TabsTrigger>
            <TabsTrigger
              value="demographic"
              className="relative py-3 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 data-[state=active]:font-medium data-[state=active]:after:content-[''] data-[state=active]:after:absolute data-[state=active]:after:bottom-0 data-[state=active]:after:left-0 data-[state=active]:after:right-0 data-[state=active]:after:h-1 data-[state=active]:after:bg-blue-600"
            >
              Demographic Analysis
            </TabsTrigger>
            <TabsTrigger
              value="environmental"
              className="relative py-3 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 data-[state=active]:font-medium data-[state=active]:after:content-[''] data-[state=active]:after:absolute data-[state=active]:after:bottom-0 data-[state=active]:after:left-0 data-[state=active]:after:right-0 data-[state=active]:after:h-1 data-[state=active]:after:bg-blue-600"
            >
              Environmental Factors
            </TabsTrigger>
          </TabsList>

          <TabsContent value="temporal" className="space-y-8">
            <ScrollReveal>
              <Card className="chart-container">
                <CardHeader>
                  <CardTitle className="text-xl text-gray-800">
                    Crashes by Year (2016-2023)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={yearData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis dataKey="year" stroke="#6b7280" />
                        <YAxis stroke="#6b7280" />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "white",
                            borderRadius: "0.5rem",
                            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                          }}
                          itemStyle={{ color: "#1e40af" }}
                        />
                        <Line
                          type="monotone"
                          dataKey="crashes"
                          name="Crashes"
                          stroke="#3b82f6"
                          strokeWidth={3}
                          dot={{
                            r: 6,
                            fill: "#3b82f6",
                            strokeWidth: 2,
                            stroke: "white",
                          }}
                          activeDot={{ r: 8, fill: "#1e40af" }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-semibold text-blue-800 mb-2">
                      Trend Analysis
                    </h4>
                    <p className="text-gray-700">
                      {Number(yearOverYearChange) > 0
                        ? `There has been a ${yearOverYearChange}% increase in crashes from ${
                            yearData[0].year
                          } to ${yearData[yearData.length - 1].year}.`
                        : `There has been a ${Math.abs(
                            Number(yearOverYearChange)
                          )}% decrease in crashes from ${yearData[0].year} to ${
                            yearData[yearData.length - 1].year
                          }.`}{" "}
                      The data shows{" "}
                      {yearData.length > 2 &&
                      yearData[1].crashes > yearData[0].crashes &&
                      yearData[2].crashes > yearData[1].crashes
                        ? "a consistent upward trend"
                        : "fluctuations"}{" "}
                      over the years, which may correlate with changes in
                      traffic volume, safety regulations, or reporting
                      practices.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </ScrollReveal>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ScrollReveal delay={200}>
                <Card className="chart-container">
                  <CardHeader>
                    <CardTitle className="text-xl text-gray-800">
                      Crashes by Month
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={monthData}
                          margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
                        >
                          <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="#e5e7eb"
                          />
                          <XAxis
                            dataKey="month"
                            angle={-45}
                            textAnchor="end"
                            height={60}
                            stroke="#6b7280"
                          />
                          <YAxis stroke="#6b7280" />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "white",
                              borderRadius: "0.5rem",
                              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                            }}
                            itemStyle={{ color: "#1e40af" }}
                          />
                          <Bar
                            dataKey="crashes"
                            name="Crashes"
                            fill="#3b82f6"
                            radius={[4, 4, 0, 0]}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>

                    <div className="mt-4 text-sm text-gray-600">
                      <p>
                        Peak month:{" "}
                        <span className="font-semibold text-blue-700">
                          {peakMonth.month}
                        </span>{" "}
                        with {peakMonth.crashes.toLocaleString()} crashes
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </ScrollReveal>

              <ScrollReveal delay={300}>
                <Card className="chart-container">
                  <CardHeader>
                    <CardTitle className="text-xl text-gray-800">
                      Crashes by Day of Week
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={dayOfWeekData}
                          margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                        >
                          <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="#e5e7eb"
                          />
                          <XAxis dataKey="day" stroke="#6b7280" />
                          <YAxis stroke="#6b7280" />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "white",
                              borderRadius: "0.5rem",
                              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                            }}
                            itemStyle={{ color: "#1e40af" }}
                          />
                          <Bar
                            dataKey="crashes"
                            name="Crashes"
                            fill="#3b82f6"
                            radius={[4, 4, 0, 0]}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>

                    <div className="mt-4 text-sm text-gray-600">
                      <p>
                        Peak day:{" "}
                        <span className="font-semibold text-blue-700">
                          {peakDay.day}
                        </span>{" "}
                        with {peakDay.crashes.toLocaleString()} crashes
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </ScrollReveal>
            </div>

            <ScrollReveal delay={400}>
              <Card className="chart-container">
                <CardHeader>
                  <CardTitle className="text-xl text-gray-800">
                    Crashes by Time of Day
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={hourData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis
                          dataKey="hour"
                          angle={-45}
                          textAnchor="end"
                          height={60}
                          stroke="#6b7280"
                        />
                        <YAxis stroke="#6b7280" />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "white",
                            borderRadius: "0.5rem",
                            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                          }}
                          itemStyle={{ color: "#1e40af" }}
                        />
                        <Area
                          type="monotone"
                          dataKey="crashes"
                          name="Crashes"
                          stroke="#3b82f6"
                          fill="url(#colorCrashes)"
                          strokeWidth={2}
                        />
                        <defs>
                          <linearGradient
                            id="colorCrashes"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop
                              offset="5%"
                              stopColor="#3b82f6"
                              stopOpacity={0.8}
                            />
                            <stop
                              offset="95%"
                              stopColor="#3b82f6"
                              stopOpacity={0.1}
                            />
                          </linearGradient>
                        </defs>
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-semibold text-blue-800 mb-2">
                      Time of Day Analysis
                    </h4>
                    <p className="text-gray-700">
                      The data shows a clear peak during {peakHour.hour}, which
                      coincides with evening rush hour traffic. This pattern
                      suggests that increased traffic volume, driver fatigue
                      after work, and reduced visibility during evening hours
                      may contribute to higher crash rates during this time
                      period.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </ScrollReveal>
          </TabsContent>

          <TabsContent value="demographic" className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ScrollReveal>
                <Card className="chart-container">
                  <CardHeader>
                    <CardTitle className="text-xl text-gray-800">
                      Crashes by Gender
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={genderData}
                          layout="vertical"
                          margin={{ top: 20, right: 30, left: 60, bottom: 20 }}
                        >
                          <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="#e5e7eb"
                          />
                          <XAxis type="number" stroke="#6b7280" />
                          <YAxis
                            dataKey="gender"
                            type="category"
                            stroke="#6b7280"
                          />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "white",
                              borderRadius: "0.5rem",
                              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                            }}
                            itemStyle={{ color: "#1e40af" }}
                          />
                          <Bar
                            dataKey="crashes"
                            name="Crashes"
                            fill="#3b82f6"
                            radius={[0, 4, 4, 0]}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>

                    <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                      <h4 className="font-semibold text-blue-800 mb-2">
                        Gender Distribution
                      </h4>
                      <p className="text-gray-700">
                        {genderData[0]?.gender} individuals are involved in
                        significantly more crashes, accounting for approximately{" "}
                        {(
                          (genderData[0]?.crashes /
                            (genderData[0]?.crashes + genderData[1]?.crashes)) *
                          100
                        ).toFixed(1)}
                        % of all recorded incidents. This disparity may be
                        influenced by factors such as differences in driving
                        exposure, risk-taking behavior, or occupation-related
                        travel patterns.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </ScrollReveal>

              <ScrollReveal delay={200}>
                <Card className="chart-container">
                  <CardHeader>
                    <CardTitle className="text-xl text-gray-800">
                      Crashes by Age Group
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={ageData}
                          margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                        >
                          <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="#e5e7eb"
                          />
                          <XAxis dataKey="age" stroke="#6b7280" />
                          <YAxis stroke="#6b7280" />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "white",
                              borderRadius: "0.5rem",
                              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                            }}
                            itemStyle={{ color: "#1e40af" }}
                          />
                          <Bar
                            dataKey="crashes"
                            name="Crashes"
                            fill="#3b82f6"
                            radius={[4, 4, 0, 0]}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>

                    <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                      <h4 className="font-semibold text-blue-800 mb-2">
                        Age Group Analysis
                      </h4>
                      <p className="text-gray-700">
                        The{" "}
                        {
                          ageData.reduce(
                            (max, current) =>
                              current.crashes > max.crashes ? current : max,
                            ageData[0]
                          ).age
                        }
                        age group shows the highest crash involvement. Young
                        adults (16-24) and older adults (65+) often represent
                        higher risk groups due to inexperience and age-related
                        factors respectively.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </ScrollReveal>
            </div>

            <ScrollReveal delay={300}>
              <Card className="chart-container">
                <CardHeader>
                  <CardTitle className="text-xl text-gray-800">
                    Crashes by Person Type
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={Object.entries(data.crashesByPersonType).map(
                          ([type, count]) => ({
                            type,
                            crashes: count,
                          })
                        )}
                        margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis
                          dataKey="type"
                          angle={-45}
                          textAnchor="end"
                          height={60}
                          stroke="#6b7280"
                        />
                        <YAxis stroke="#6b7280" />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "white",
                            borderRadius: "0.5rem",
                            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                          }}
                          itemStyle={{ color: "#1e40af" }}
                        />
                        <Bar
                          dataKey="crashes"
                          name="Crashes"
                          fill="#3b82f6"
                          radius={[4, 4, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-semibold text-blue-800 mb-2">
                      Vulnerable Road Users
                    </h4>
                    <p className="text-gray-700">
                      The data highlights the vulnerability of non-motorized
                      road users, particularly pedestrians and cyclists. These
                      groups face disproportionate risks in traffic crashes due
                      to their lack of physical protection compared to vehicle
                      occupants. This underscores the importance of
                      infrastructure improvements and awareness campaigns
                      focused on protecting these vulnerable road users.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </ScrollReveal>
          </TabsContent>

          <TabsContent value="environmental" className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ScrollReveal>
                <Card className="chart-container">
                  <CardHeader>
                    <CardTitle className="text-xl text-gray-800">
                      Crashes by Weather Condition
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={weatherData}
                          layout="vertical"
                          margin={{ top: 20, right: 30, left: 100, bottom: 20 }}
                        >
                          <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="#e5e7eb"
                          />
                          <XAxis type="number" stroke="#6b7280" />
                          <YAxis
                            dataKey="weather"
                            type="category"
                            stroke="#6b7280"
                          />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "white",
                              borderRadius: "0.5rem",
                              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                            }}
                            itemStyle={{ color: "#1e40af" }}
                          />
                          <Bar
                            dataKey="crashes"
                            name="Crashes"
                            fill="#3b82f6"
                            radius={[0, 4, 4, 0]}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>

                    <div className="mt-4 text-sm text-gray-600">
                      <p>
                        Most common:{" "}
                        <span className="font-semibold text-blue-700">
                          {weatherData[0]?.weather}
                        </span>{" "}
                        with {weatherData[0]?.crashes.toLocaleString()} crashes
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </ScrollReveal>

              <ScrollReveal delay={200}>
                <Card className="chart-container">
                  <CardHeader>
                    <CardTitle className="text-xl text-gray-800">
                      Crashes by Light Condition
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={lightConditionData}
                          layout="vertical"
                          margin={{ top: 20, right: 30, left: 100, bottom: 20 }}
                        >
                          <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="#e5e7eb"
                          />
                          <XAxis type="number" stroke="#6b7280" />
                          <YAxis
                            dataKey="condition"
                            type="category"
                            stroke="#6b7280"
                          />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "white",
                              borderRadius: "0.5rem",
                              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                            }}
                            itemStyle={{ color: "#1e40af" }}
                          />
                          <Bar
                            dataKey="crashes"
                            name="Crashes"
                            fill="#3b82f6"
                            radius={[0, 4, 4, 0]}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>

                    <div className="mt-4 text-sm text-gray-600">
                      <p>
                        Most common:{" "}
                        <span className="font-semibold text-blue-700">
                          {lightConditionData[0]?.condition}
                        </span>{" "}
                        with {lightConditionData[0]?.crashes.toLocaleString()}{" "}
                        crashes
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </ScrollReveal>
            </div>

            <ScrollReveal delay={300}>
              <Card className="chart-container">
                <CardHeader>
                  <CardTitle className="text-xl text-gray-800">
                    Crashes by Road Type
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={roadTypeData}
                        layout="vertical"
                        margin={{ top: 20, right: 30, left: 150, bottom: 20 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis type="number" stroke="#6b7280" />
                        <YAxis
                          dataKey="type"
                          type="category"
                          stroke="#6b7280"
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "white",
                            borderRadius: "0.5rem",
                            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                          }}
                          itemStyle={{ color: "#1e40af" }}
                        />
                        <Bar
                          dataKey="crashes"
                          name="Crashes"
                          fill="#3b82f6"
                          radius={[0, 4, 4, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-semibold text-blue-800 mb-2">
                      Road Type Impact
                    </h4>
                    <p className="text-gray-700">
                      {roadTypeData[0]?.type} roads account for the highest
                      number of crashes, suggesting that these road types may
                      benefit from targeted safety improvements. Factors such as
                      speed limits, traffic volume, road design, and access
                      points likely contribute to the varying crash rates across
                      different road types.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </ScrollReveal>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}
