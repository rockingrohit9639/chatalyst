'use client'

import { MessageCircleIcon } from 'lucide-react'

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from '~/components/ui/sidebar'
import Link from 'next/link'
import { UserButton } from '@clerk/nextjs'
import Nav from './nav'
import { ModeToggle } from './mode-toggle'
import { dark } from '@clerk/themes'
import { useTheme } from 'next-themes'

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { theme } = useTheme()

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <MessageCircleIcon className="size-4" />
                </div>
                <p className="grid flex-1 truncate text-left text-sm font-semibold leading-tight">Chatalyst</p>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <Nav />
      </SidebarContent>
      <SidebarFooter className="flex items-center justify-between p-4 border-t">
        <div className="flex justify-between w-full">
          <UserButton
            appearance={{
              baseTheme: theme === 'dark' ? dark : undefined,
            }}
            showName 
          />
          <ModeToggle />
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
