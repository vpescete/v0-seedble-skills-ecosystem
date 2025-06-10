import type React from "react"
import "./globals.css"
import { Inter } from "next/font/google"
import { AuthProvider } from "@/contexts/auth-context"
import { Providers } from "./providers"
import { NextUIProvider } from "@nextui-org/react"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Seedble Skills Ecosystem",
  description: "Integrated Platform for Corporate Skills Management and Development",
    generator: 'v0.dev'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <NextUIProvider>
          <Providers>
            <AuthProvider>{children}</AuthProvider>
          </Providers>
        </NextUIProvider>
      </body>
    </html>
  )
}
