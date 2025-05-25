import { LoginLayout } from "@/components/login-layout"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { Frown } from "lucide-react"
import { ResetPasswordController } from "./reset-password.controller"

type props = {
  controller: ResetPasswordController
}

export function ResetPasswordView({ controller }: props) {

  // if(false){
  if(!controller.ticketIsValid.value){
    return (
      <LoginLayout isLoading={controller.isLoadingSession.value} >
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-3xl font-bold">Recuperar Senha</h1>
          <h2 className="text-xl" >Link inválido</h2>
          <span className="h-52 flex justify-center items-center text-destructive" > 
            <Frown size={130}/>
          </span>
          <p className="text-sm text-muted-foreground">
            O link fornecido é inválido ou expirou. Por favor, solicite um novo link de recuperação.
          </p>
        </div>
      </LoginLayout>
    )
  }

  return (
    <LoginLayout isLoading={controller.isLoadingSession.value} >
      <form onSubmit={e => e.preventDefault()} className={cn("flex flex-col gap-6")}>
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-bold">Atualizar senha</h1>
          <p className="text-sm text-muted-foreground">
            Crie uma nova senha para sua conta.
          </p>
        </div>
        <div className="grid">
          <div className="grid gap-1 mb-2">
            <div className="flex items-center">
              <Label htmlFor="password">Nova Senha:</Label>
            </div>
            <Input
              required
              id="password" placeholder="Digite sua senha"
              className={controller.passwordError.value != '' ? 'border-destructive' : ''}
              type={controller.showPassword.value ? "text" : "password"}
              value={controller.password.value}
              onChange={(e) => controller.password.set(e.target.value)}
            />
            <span className="text-destructive text-xs h-5 w-fit" >{controller.passwordError.value}</span>
          </div>
          <div className="grid gap-1 mb-2">
            <div className="flex items-center">
              <Label htmlFor="password">Confirmar Senha:</Label>
            </div>
            <Input
              required
              id="password" placeholder="Digite sua senha"
              className={controller.passwordError.value != '' ? 'border-destructive' : ''}
              type={controller.showPassword.value ? "text" : "password"}
              value={controller.password.value}
              onChange={(e) => controller.password.set(e.target.value)}
            />
            <span className="text-destructive text-xs h-5 w-fit" >{controller.passwordError.value}</span>
          </div>
          <div className="flex items-center gap-2 pl-1 my-1 mb-4">
            <Checkbox
              id="show-password"
              onCheckedChange={() => controller.showPassword.set((prev) => !prev)}
              className="cursor-pointer"
              />
            <Label htmlFor="show-password" className="text-sm font-normal">
              Exibir senha
            </Label>
          </div>
          <Button type="submit" className="w-full mb-6" onClick={() => controller.handleRqeust()} >
            Salvar
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
