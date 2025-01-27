import { useSidebar } from "@/components/ui/sidebar";
import { useAuth } from "@/contexts/authContext";
import type { IAuthService } from "@/domain/services/auth-service/IAuthService";
import { Cable, MapPin, Package, Settings2, SquareKanban, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { inject, injectable } from "tsyringe";
import { AppSidebarProps } from "./components/sidebar.view";


@injectable()
export class LayoutController {

  constructor(
    @inject('AuthService') private readonly authService: IAuthService
  ) { }

  pages: AppSidebarProps['pages'] = [
    { title: "Dashboard", url: "/", icon: SquareKanban },
    { title: "Técnicos", url: "/dash", icon: Users },
    { title: "Produtos", url: "#", icon: Package },
    { title: "Equipamentos", url: "#", icon: Cable },
    { title: "Restreamento", url: "#", icon: MapPin },
    { title: "Configurações", url: "#", icon: Settings2 },
  ]

  use() {
    const { user, setUser } = useAuth()
    const { pathname } = useLocation()

    const [pages, setPages] = useState<AppSidebarProps['pages']>(this.pages)

    useEffect(() => {
      const updatedPages: AppSidebarProps['pages'] = pages.map(page => {
        page.isActive = false
        if (page.url === pathname) {
          page.isActive = true
        }
        return page
      })
      setPages(updatedPages)
    }, [pathname])


    const userData: AppSidebarProps['user'] = {
      name: user?.name ?? '',
      username: user?.username ?? '',
      avatar: "https://github.com/leandrosantino.png",
    }

    const { open: sideBarIsOpen } = useSidebar()
    const navigate = useNavigate()

    const handleLogout = () => {
      this.authService.logout()
      setUser(null)
    }

    const handleNavigate = (url: string) => {
      navigate(url)
    }

    return { sideBarIsOpen, pages, handleNavigate, user: userData, handleLogout }
  }


}