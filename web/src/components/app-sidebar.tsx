import logo from '@/assets/logo.png';
import {
  Cable,
  MapPin,
  Package,
  Settings2,
  SquareKanban,
  Users
} from "lucide-react";
import * as React from "react";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  useSidebar
} from "@/components/ui/sidebar";

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
        <div className='flex' >
          <img src={logo} alt="Logo" width="30" />
          {open&&(
            <h1 className="font-extrabold text-2xl text-lime-500" >
            Portal
            <span className="text-blue-400" >Facility</span>
          </h1>
          )}
        </div>
        
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
