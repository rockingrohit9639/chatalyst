import { CableIcon, LayoutDashboardIcon, type LucideIcon } from 'lucide-react'
import { SidebarGroup, SidebarGroupContent, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '../ui/sidebar'
import Link from 'next/link'

type NavItem = {
  name: string
  url: string
  icon: LucideIcon
}

const NAV_ITEMS: NavItem[] = [
  {
    name: 'Dashboard',
    url: '/',
    icon: LayoutDashboardIcon,
  },
  {
    name: 'Integrations',
    url: '/integrations',
    icon: CableIcon,
  },
]

export default function Nav(props: React.ComponentPropsWithoutRef<typeof SidebarGroup>) {
  return (
    <SidebarGroup {...props}>
      <SidebarGroupContent>
        <SidebarMenu>
          {NAV_ITEMS.map((item) => (
            <SidebarMenuItem key={item.name}>
              <SidebarMenuButton asChild size="sm">
                <Link href={item.url} className="">
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
