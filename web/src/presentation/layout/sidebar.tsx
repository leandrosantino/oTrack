import {
  Cable,
  MapPin,
  Package,
  Settings2,
  SquareKanban,
  Users
} from "lucide-react";
import * as React from "react";

import { Logo } from "@/components/logo";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  useSidebar
} from "@/components/ui/sidebar";
import { NavMain } from "./nav-main";
import { NavUser } from "./nav-user";

// This is sample data.
const data = {
  user: {
    name: "leandro",
    email: "leandrosantino@example.com",
    avatar: "https://github.com/leandrosantino.png",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "#",
      icon: SquareKanban,
      isActive: true
    },
    {
      title: "Técnicos",
      url: "#",
      icon: Users
    },
    {
      title: "Produtos",
      url: "#",
      icon: Package
    },
    {
      title: "Equipamentos",
      url: "#",
      icon: Cable,
    },
    {
      title: "Restreamento",
      url: "#",
      icon: MapPin,
    },
    {
      title: "Configurações",
      url: "#",
      icon: Settings2,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {

  const {open} = useSidebar()

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <Logo {...{minimize: !open}} />        
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
