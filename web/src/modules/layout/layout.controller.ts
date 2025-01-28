import { useSidebar } from "@/components/ui/sidebar";
import { useAuth } from "@/contexts/authContext";
import type { IAuthService } from "@/domain/services/auth-service/IAuthService";
import { Cable, LucideIcon, MapPin, PackageCheck, ScanBarcode, Settings2, SquareKanban, UserRoundCog } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { inject, injectable } from "tsyringe";
import { UserMenuProps } from "./components/user-menu.view";

type PagesData = Array<{
  title: string
  url: string
  icon: LucideIcon
  requiredRoles: string[]
  isActive?: boolean
}>

@injectable()
export class LayoutController {

  constructor(
    @inject('AuthService') private readonly authService: IAuthService
  ) { }

  pages: PagesData = [
    { title: "Dashboard", url: "/", icon: SquareKanban, requiredRoles: ['ADMIN'] },
    { title: "Produtos", url: "/dash", icon: ScanBarcode, requiredRoles: ['ADMIN'] },
    { title: "Equipamentos", url: "#", icon: Cable, requiredRoles: ['ADMIN'] },
    { title: "Entregas", url: "#", icon: PackageCheck, requiredRoles: ['ADMIN'] },
    { title: "Restreamento", url: "#", icon: MapPin, requiredRoles: ['ADMIN'] },
    { title: "Usuários", url: "#", icon: UserRoundCog, requiredRoles: ['ADMIN'] },
    { title: "Configurações", url: "#", icon: Settings2, requiredRoles: ['ADMIN'] },
  ]

  use() {
    const { user, setUser } = useAuth()
    const { pathname } = useLocation()
    const { isMobile, toggleSidebar, open: sideBarIsOpen } = useSidebar()
    const [logoIsMinimize, setLogoIsMinimize] = useState(false)
    const navigate = useNavigate()

    const [pages, setPages] = useState<PagesData>(this.pages)

    useEffect(() => {
      if (isMobile) {
        setLogoIsMinimize(false)
        return
      }
      if (sideBarIsOpen) {
        setLogoIsMinimize(false)
        return
      }
      setLogoIsMinimize(true)
    }, [sideBarIsOpen])

    useEffect(() => {
      const updatedPages: PagesData = []
      pages.forEach(page => {
        page.isActive = false
        if (!page.requiredRoles.includes(user?.roule ?? '')) return
        if (page.url === pathname) page.isActive = true
        updatedPages.push(page)
      })
      setPages(updatedPages)
    }, [pathname])


    const userData: UserMenuProps['user'] = {
      name: user?.displayName ?? '',
      username: user?.username ?? '',
      avatar: "https://github.com/leandrosantino.png",
    }

    const handleLogout = async () => {
      await this.authService.logout()
      setUser(null)
    }

    const handleNavigate = (url: string) => {
      if (isMobile) {
        toggleSidebar()
      }
      navigate(url)
    }

    return { logoIsMinimize, pages, handleNavigate, user: userData, handleLogout, isMobile }
  }


}