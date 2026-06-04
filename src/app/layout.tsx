import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { DM_Serif_Display, Space_Grotesk, Space_Mono } from "next/font/google"

const dmSerifDisplay = DM_Serif_Display({
  subsets: ["latin"],
  display: "swap",
  weight: ["400"],
  variable: "--font-heading",
})

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-body",
})

const spaceMono = Space_Mono({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "700"],
  variable: "--font-mono",
})

export const metadata: Metadata = {
  title: "Harsh Agarwal - Portfolio",
  description: "Personal portfolio of Harsh Agarwal, Computer Science Student & Developer",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${dmSerifDisplay.variable} ${spaceGrotesk.variable} ${spaceMono.variable}`}
    >
      <body className={spaceGrotesk.className}>{children}</body>
    </html>
  )
}
