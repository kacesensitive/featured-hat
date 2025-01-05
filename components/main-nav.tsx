import * as React from "react"
import Link from "next/link"

import { NavItem } from "@/types/nav"
import { siteConfig } from "@/config/site"
import Image from "next/image"

interface MainNavProps {
  items?: NavItem[]
}

export function MainNav({ items }: MainNavProps) {
  return (
    <div className="flex gap-6 md:gap-10">
      <Link href="/" className="flex items-center space-x-2">
        <Image src="/featuredhat.svg" alt={""} width={80} height={80} />
        <span className="inline-block font-bold font-mono text-2xl hover:rainbow-text">{siteConfig.name}</span>      </Link>
    </div>
  )
}
