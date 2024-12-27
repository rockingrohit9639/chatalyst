'use client'

import { CableIcon, HomeIcon, type LucideIcon } from 'lucide-react'
import { SidebarGroup, SidebarGroupContent, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '../ui/sidebar'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

type NavItem = {
  name: string
  url: string
  icon: LucideIcon
}

const NAV_ITEMS: NavItem[] = [
  {
    name: 'Home',
    url: '/',
    icon: HomeIcon,
  },
  {
    name: 'Integrations',
    url: '/integrations',
    icon: CableIcon,
  },
]

export default function Nav(props: React.ComponentPropsWithoutRef<typeof SidebarGroup>) {
  const pathname = usePathname()

  return (
    <SidebarGroup {...props}>
      <SidebarGroupContent>
        <SidebarMenu>
          {NAV_ITEMS.map((item) => (
            <SidebarMenuItem key={item.name}>
              <SidebarMenuButton isActive={pathname === item.url} asChild size="sm">
                <Link href={item.url}>
                  <item.icon />
                  <span>{item.name}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
