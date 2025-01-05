import "@/styles/globals.css"
import { Metadata } from "next"

import { siteConfig } from "@/config/site"
import { fontSans } from "@/lib/fonts"
import { cn } from "@/lib/utils"
import { SiteHeader } from "@/components/site-header"
import { ThemeProvider } from "@/components/theme-provider"

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  keywords: [
    "featured.chat",
    "featuredhat",
    "featured-hat",
    "featured.hat",
    "featured hat",
    "featured.chat replacement",
    "featured.chat alternative",
    "featured",
    "hat",
    "open source",
    "twitch",
    "twitch chat",
    "twitch chat overlay",
    "twitch chat viewer",
    "twitch chat queue",
    "twitch chat display",
    "twitch chat queue display",
    "twitch chat queue viewer",
    "twitch chat queue display viewer",
    "twitch chat queue display overlay",
    "twitch chat queue display overlay viewer",
  ]
}

interface RootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {

  return (
    <>
      <html lang="en" suppressHydrationWarning>s
        <body
          className={cn(
            "min-h-screen font-sans antialiased overflow-hidden",
            fontSans.variable
          )}
        >
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <div className="relative flex min-h-screen flex-col">
              <SiteHeader />
              <div className="flex-1">{children}</div>
            </div>
          </ThemeProvider>
        </body>
      </html>
    </>
  )
}
