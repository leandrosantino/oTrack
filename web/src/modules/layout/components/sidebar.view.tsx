import { Logo } from "@/components/logo";
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarRail } from "@/components/ui/sidebar";
import { LucideIcon } from "lucide-react";
import * as React from "react";
import { NavUser, UserMenuProps } from "./user-menu.view";

export type AppSidebarProps = {
  user: UserMenuProps['user'],
  pages: Array<{
    title: string
    url: string
    icon: LucideIcon
    isActive?: boolean
  }>,
  sideBarIsOpen: boolean
  onNavigate(url: string): void
} & React.ComponentProps<typeof Sidebar>

export function AppSidebar({ pages, user, sideBarIsOpen, onNavigate, ...props }: AppSidebarProps) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <Logo {...{minimize: !sideBarIsOpen}} />        
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
        <SidebarGroupLabel>Resources</SidebarGroupLabel>
        <SidebarMenu>
          {pages.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton tooltip={item.title} isActive={item.isActive} onClick={() => onNavigate(item.url)} >
                {item.icon && <item.icon />}
                <span>{item.title}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
