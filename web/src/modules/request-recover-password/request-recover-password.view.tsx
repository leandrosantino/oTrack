import { LoginLayout } from "@/components/login-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { MailCheck } from "lucide-react"
import { RequestRecoverPasswordController } from "./request-recover-password.controller"

type props = {
  controller: RequestRecoverPasswordController
}

export function RequestRecoverPasswordView({ controller }: props) {

  if(controller.makeRequest.value) {
    return (
      <LoginLayout isLoading={controller.isLoadingSession.value} >
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-3xl font-bold">Recuperar Senha</h1>
          <h2 className="text-xl" >Email Enviado!!</h2>
          <span className="h-52 flex justify-center items-center text-primary" > 
            <MailCheck size={130}/>
          </span>
          <p className="text-sm text-muted-foreground">
            Um e-mail foi enviado para o endereço informado. Siga as instruções para redefinir sua senha.
          </p>
        </div>
      </LoginLayout>
    )
  }

  return (
    <LoginLayout isLoading={controller.isLoadingSession.value} >
      <form onSubmit={e => e.preventDefault()} className={cn("flex flex-col gap-6")}>
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-bold">Recuperar Senha</h1>
          <p className="text-sm text-muted-foreground">
            Informe seu email e clique em "Recuperar senha". Você receberá um e-mail com instruções para redefinir sua senha.
          </p>
        </div>
        <div className="grid">
          <div className="grid gap-1 mb-2">
            <Label htmlFor="username">Email</Label>
            <Input 
              id="username" type="email" placeholder="Digite seu email"
              required value={controller.email.value} 
              onChange={e => controller.email.set(e.target.value)} 
            />
            <span className="text-destructive text-xs h-5 text-end" ></span>
          </div>
          <Button type="submit" className="w-full mb-6" onClick={() => controller.handleRqeust()} >
            Recuperar senha
          </Button>
          <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
            <span className="relative z-10 bg-background px-2 text-muted-foreground">
              &copy; oTrack inc.
            </span>
          </div>
        </div>
      </form>
    </LoginLayout>
  )
}
