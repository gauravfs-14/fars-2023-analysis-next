"use client";

import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  ArrowDown,
  Users,
  Calendar,
  MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useInView } from "framer-motion";

export default function Hero() {
  const [count, setCount] = useState(0);
  const [victims, setVictims] = useState(0);
  const [years, setYears] = useState(0);
  const [states, setStates] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://zlyp6b2wyu34rqw4.public.blob.vercel-storage.com/geoData-xrAxBoCKwlqQ2qcThRClJjEUgC5LR3.json"
        );
        const data = await response.json();

        // Get unique crashes
        const uniqueCrashes = new Set();
        const uniqueYears = new Set();
        const uniqueStates = new Set();

        data.features.forEach((feature: any) => {
          uniqueCrashes.add(feature.properties.CRASH_NUM1);
          uniqueYears.add(feature.properties.YEAR);
          uniqueStates.add(feature.properties.STATENAME);
        });

        setCount(uniqueCrashes.size);
        setVictims(data.features.length);
        setYears(uniqueYears.size);
        setStates(uniqueStates.size);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  // Animated counter hook
  const AnimatedCounter = ({
    value,
    duration = 2000,
  }: {
    value: number;
    duration?: number;
  }) => {
    const [displayValue, setDisplayValue] = useState(0);
    const counterRef = useRef<number | null>(null);

    useEffect(() => {
      if (!isInView) return;

      let startTime: number | null = null;
      interface AnimationProps {
        timestamp: number;
      }

      const animate = (timestamp: number): void => {
        if (!startTime) startTime = timestamp;
        const progress: number = Math.min(
          (timestamp - startTime) / duration,
          1
        );
        const currentValue: number = Math.floor(progress * value);
        setDisplayValue(currentValue);

        if (progress < 1) {
          counterRef.current = requestAnimationFrame(animate);
        }
      };

      counterRef.current = requestAnimationFrame(animate);

      return () => {
        if (counterRef.current) {
          cancelAnimationFrame(counterRef.current);
        }
      };
    }, [value, duration, isInView]);

    return <>{displayValue.toLocaleString()}</>;
  };

  return (
    <section
      id="hero"
      ref={ref}
      className="relative min-h-[90vh] flex items-center justify-center overflow-hidden text-white"
    >
      {/* Background with overlay */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/90 via-blue-800/80 to-indigo-900/90"></div>
        <img
          src="/hero-background.png"
          alt="Background"
          className="w-full h-full object-cover object-center"
        />
      </div>

      <div className="container mx-auto px-4 z-10 py-16 md:py-24">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="max-w-4xl mx-auto text-center"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="inline-flex items-center justify-center px-4 py-2 mb-8 rounded-full bg-white/10 backdrop-blur-sm border border-white/20"
          >
            <AlertTriangle className="h-4 w-4 mr-2 text-blue-300" />
            <span className="text-sm font-medium text-blue-100">
              FARS Data Analysis 2016-2023
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="text-5xl md:text-6xl font-bold mb-8 leading-tight"
          >
            Understanding Road Safety Through{" "}
            <span className="bg-gradient-to-r from-blue-300 to-indigo-300 bg-clip-text text-transparent">
              Data Analysis
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.6 }}
            className="text-xl md:text-2xl text-blue-100 mb-16 max-w-3xl mx-auto leading-relaxed"
          >
            Explore comprehensive crash records from the Fatality Analysis
            Reporting System (FARS) to identify patterns, trends, and insights
            that can help improve road safety.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.8 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16"
          >
            <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl shadow-xl">
              <div className="flex items-center justify-center mb-3">
                <AlertTriangle className="h-6 w-6 text-blue-300 mr-2" />
                <h3 className="text-lg font-semibold">Crashes</h3>
              </div>
              <div className="text-3xl md:text-4xl font-bold">
                {isInView ? <AnimatedCounter value={count} /> : 0}
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl shadow-xl">
              <div className="flex items-center justify-center mb-3">
                <Users className="h-6 w-6 text-blue-300 mr-2" />
                <h3 className="text-lg font-semibold">Victims</h3>
              </div>
              <div className="text-3xl md:text-4xl font-bold">
                {isInView ? <AnimatedCounter value={victims} /> : 0}
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl shadow-xl">
              <div className="flex items-center justify-center mb-3">
                <Calendar className="h-6 w-6 text-blue-300 mr-2" />
                <h3 className="text-lg font-semibold">Years</h3>
              </div>
              <div className="text-3xl md:text-4xl font-bold">
                {isInView ? (
                  <AnimatedCounter value={years} duration={1000} />
                ) : (
                  0
                )}
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl shadow-xl">
              <div className="flex items-center justify-center mb-3">
                <MapPin className="h-6 w-6 text-blue-300 mr-2" />
                <h3 className="text-lg font-semibold">States</h3>
              </div>
              <div className="text-3xl md:text-4xl font-bold">
                {isInView ? (
                  <AnimatedCounter value={states} duration={1000} />
                ) : (
                  0
                )}
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 1 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6"
          >
            <Button
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-10 py-6 text-lg shadow-lg shadow-blue-900/30 hover:shadow-blue-900/50 transition-all"
              asChild
            >
              <a href="#quick-stats">Explore Data</a>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-white/30 text-black hover:text-white hover:bg-white/10 rounded-full px-10 py-6 text-lg font-medium shadow-md"
              asChild
            >
              <a href="#data-explorer">View Raw Data</a>
            </Button>
          </motion.div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-12 left-1/2 transform -translate-x-1/2 animate-bounce"
      >
        <a
          href="#quick-stats"
          aria-label="Scroll down"
          className="bg-white/10 backdrop-blur-sm p-3 rounded-full border border-white/20 flex items-center justify-center"
        >
          <ArrowDown className="h-6 w-6 text-white" />
        </a>
      </motion.div>
    </section>
  );
}
