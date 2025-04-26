"use client"

import Link from "next/link"
import { AlertTriangle, Github, Twitter, Mail } from "lucide-react"
import { motion } from "framer-motion"

export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-blue-900 to-indigo-900 text-white py-20">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="md:col-span-2"
          >
            <div className="flex items-center mb-6">
              <AlertTriangle className="h-8 w-8 text-blue-300 mr-3" />
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-300 to-indigo-300 bg-clip-text text-transparent">
                FARS Dashboard
              </span>
            </div>
            <p className="text-blue-200 mb-6 max-w-md text-lg leading-relaxed">
              A comprehensive dashboard for analyzing FARS (Fatality Analysis Reporting System) data from 2016-2023,
              providing insights into road safety patterns and trends.
            </p>
            <div className="flex space-x-5">
              <Link href="#" className="text-blue-300 hover:text-white transition-colors">
                <Github className="h-6 w-6" />
                <span className="sr-only">GitHub</span>
              </Link>
              <Link href="#" className="text-blue-300 hover:text-white transition-colors">
                <Twitter className="h-6 w-6" />
                <span className="sr-only">Twitter</span>
              </Link>
              <Link href="#" className="text-blue-300 hover:text-white transition-colors">
                <Mail className="h-6 w-6" />
                <span className="sr-only">Email</span>
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h3 className="text-xl font-semibold mb-6 text-white">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link href="#hero" className="text-blue-200 hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="#quick-stats" className="text-blue-200 hover:text-white transition-colors">
                  Quick Stats
                </Link>
              </li>
              <li>
                <Link href="#crash-insights" className="text-blue-200 hover:text-white transition-colors">
                  Crash Insights
                </Link>
              </li>
              <li>
                <Link href="#city-scorecard" className="text-blue-200 hover:text-white transition-colors">
                  City Scorecard
                </Link>
              </li>
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <h3 className="text-xl font-semibold mb-6 text-white">More Sections</h3>
            <ul className="space-y-3">
              <li>
                <Link href="#weather-correlation" className="text-blue-200 hover:text-white transition-colors">
                  Weather Correlation
                </Link>
              </li>
              <li>
                <Link href="#crash-timeline" className="text-blue-200 hover:text-white transition-colors">
                  Crash Timeline
                </Link>
              </li>
              <li>
                <Link href="#data-explorer" className="text-blue-200 hover:text-white transition-colors">
                  Data Explorer
                </Link>
              </li>
              <li>
                <Link href="#" className="text-blue-200 hover:text-white transition-colors">
                  About FARS
                </Link>
              </li>
            </ul>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          viewport={{ once: true }}
          className="border-t border-blue-800 mt-12 pt-10 text-center text-blue-300 text-sm"
        >
          <p>
            Data source: Fatality Analysis Reporting System (FARS) 2016-2023. This dashboard is for educational purposes
            only.
          </p>
          <p className="mt-3">&copy; {new Date().getFullYear()} FARS Dashboard. All rights reserved.</p>
          <p className="mt-3">
            Developed by{" "}
            <a
              href="https://gaurabchhetri.com.np"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-200 hover:text-white underline"
            >
              Gaurab Chhetri
            </a>
            , Supported by{" "}
            <a
              href="https://ait-lab.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-200 hover:text-white underline"
            >
              AIT Lab
            </a>
          </p>
        </motion.div>
      </div>
    </footer>
  )
}
