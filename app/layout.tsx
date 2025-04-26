import type React from "react"
import "@/app/globals.css"

export const metadata = {
  title: "FARS Data Dashboard",
  description: "A comprehensive dashboard for analyzing FARS (Fatality Analysis Reporting System) data from 2016-2023",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
