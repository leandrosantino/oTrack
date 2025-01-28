import { Logo } from "@/components/logo"
import { Separator } from "@/components/ui/separator"
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupLabel, SidebarHeader, SidebarInset, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarRail, SidebarTrigger } from "@/components/ui/sidebar"
import { Outlet } from "react-router"
import { NavUser } from "./components/user-menu.view"
import { LayoutController } from "./layout.controller"

type props = {
  controller: LayoutController
}

export function LayoutView({controller }: props) {

  const {pages, logoIsMinimize, handleNavigate, user, handleLogout, isMobile} = controller.use()

  return (<>
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <Logo { ...{minimize: logoIsMinimize} } />        
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Resources</SidebarGroupLabel>
          <SidebarMenu>
            {pages.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton tooltip={item.title} isActive={item.isActive} onClick={() => handleNavigate(item.url)} >
                  {item.icon && <item.icon />}
                  <span>{item.title}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <NavUser { ...{handleLogout, user, isMobile} }/>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
    <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          Dashboard
        </div>
      </header>
      <main className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <Outlet />
      </main>
    </SidebarInset>
  </>)
}