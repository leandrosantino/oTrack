import { useSidebar } from "@/components/ui/sidebar";
import { useAuth } from "@/contexts/authContext";
import type { IAuthService } from "@/domain/services/auth-service/IAuthService";
import { useStateObject } from "@/lib/useStateObject";
import { Cable, ChartColumnBig, ListChecks, LucideIcon, MapPin, PackageCheck, ScanBarcode, Settings2, UserRoundCog } from "lucide-react";
import { useEffect } from "react";
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

  pages: PagesData = [
    { title: "Dashboard", url: "/dash", icon: ChartColumnBig, requiredRoles: ['ADMIN'] },
    { title: "Ordens de Serviço", url: "/service-orders", icon: ListChecks, requiredRoles: ['ADMIN'] },
    { title: "Produtos", url: "/", icon: ScanBarcode, requiredRoles: ['ADMIN'] },
    { title: "Equipamentos", url: "#", icon: Cable, requiredRoles: ['ADMIN'] },
    { title: "Entregas", url: "#", icon: PackageCheck, requiredRoles: ['ADMIN'] },
    { title: "Restreamento", url: "#", icon: MapPin, requiredRoles: ['ADMIN'] },
    { title: "Usuários", url: "#", icon: UserRoundCog, requiredRoles: ['ADMIN'] },
    { title: "Configurações", url: "#", icon: Settings2, requiredRoles: ['ADMIN'] },
  ]

  pagesState = useStateObject<PagesData>(this.pages)
  logoIsMinimize = useStateObject(false)
  pageTitle = useStateObject('')

  private location = useLocation()
  private auth = useAuth()
  private sideBar = useSidebar()
  private navigate = useNavigate()


  constructor(
    @inject('AuthService') private readonly authService: IAuthService
  ) {
    useEffect(() => { this.changePageButtonFocus() }, [this.location.pathname])
    useEffect(() => { this.switchLogoSize() }, [this.sideBar.open])
    useEffect(() => { this.changePageTitle() }, [this.location.pathname])
    useEffect(() => { this.handleNavigate('/service-orders') }, [])
  }

  useIsMobile() {
    return this.sideBar.isMobile
  }

  changePageTitle() {
    const selectedPage = this.pages.find(page => page.url === this.location.pathname)
    this.pageTitle.set(selectedPage?.title ?? '')
  }

  useUser() {
    const user = this.auth.user
    const userData: UserMenuProps['user'] = {
      name: user?.displayName ?? '',
      username: user?.username ?? '',
      avatar: "https://github.com/leandrosantino.png",
    }
    return userData
  }

  handleLogout = async () => {
    await this.authService.logout()
    this.auth.setUser(null)
  }

  handleNavigate = (url: string) => {
    if (this.sideBar.isMobile) {
      this.sideBar.toggleSidebar()
    }
    this.navigate(url)
  }

  private switchLogoSize() {
    if (this.sideBar.isMobile) {
      this.logoIsMinimize.set(false)
      return
    }
    if (this.sideBar.open) {
      this.logoIsMinimize.set(false)
      return
    }
    this.logoIsMinimize.set(true)
  }

  private changePageButtonFocus() {
    const updatedPages: PagesData = []
    this.pagesState.value.forEach(page => {
      page.isActive = false
      if (!page.requiredRoles.includes(this.auth.user?.roule ?? '')) return
      if (page.url === this.location.pathname) page.isActive = true
      updatedPages.push(page)
    })
    this.pagesState.set(updatedPages)
  }


}