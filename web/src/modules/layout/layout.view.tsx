import { Separator } from "@/components/ui/separator"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Outlet } from "react-router"
import { AppSidebar } from "./components/sidebar.view"
import { LayoutController } from "./layout.controller"


type props = {
  controller: LayoutController
}

export function LayoutView({controller }: props) {

  const {pages, sideBarIsOpen, handleNavigate, user, handleLogout} = controller.use()

  return (<>
    <AppSidebar {...{user, pages, sideBarIsOpen, handleLogout} } onNavigate={handleNavigate} />
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