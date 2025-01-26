import { useSidebar } from "@/components/ui/sidebar";
import { Cable, MapPin, Package, Settings2, SquareKanban, Users } from "lucide-react";
import { useNavigate } from "react-router";
import { injectable } from "tsyringe";
import { AppSidebarProps } from "./components/sidebar.view";


@injectable()
export class LayoutController {

  pages: AppSidebarProps['pages'] = [
    { title: "Dashboard", url: "/", icon: SquareKanban, isActive: true },
    { title: "Técnicos", url: "/dash", icon: Users },
    { title: "Produtos", url: "#", icon: Package },
    { title: "Equipamentos", url: "#", icon: Cable },
    { title: "Restreamento", url: "#", icon: MapPin },
    { title: "Configurações", url: "#", icon: Settings2 },
  ]

  useUserData() {
    const user: AppSidebarProps['user'] = {
      name: "Leandro Santino",
      username: "leandro123",
      avatar: "https://github.com/leandrosantino.png",
    }
    return { user }
  }

  usePages() {
    const { open: sideBarIsOpen } = useSidebar()
    const navigate = useNavigate()

    const pages = this.pages

    function handleNavigate(url: string) {
      navigate(url)
    }

    return { sideBarIsOpen, pages, handleNavigate }
  }


}