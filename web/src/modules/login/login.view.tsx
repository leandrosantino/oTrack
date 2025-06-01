import { LoginLayout } from "@/components/login-layout"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { Login } from "@/modules/login/login.controller"
import { Link } from "react-router"

export function LoginView(controller: Login) {

  return (
    <LoginLayout isLoading={controller.isLoadingSession.value} >
      <form onSubmit={e => e.preventDefault()} className={cn("flex flex-col gap-6")}>
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-bold">Bem Vindo!</h1>
          <p className="text-balance text-sm text-muted-foreground">
            Insira seu usuário e senha para acessar sua conta.
          </p>
        </div>
        <div className="grid">
          <div className="grid gap-1 mb-2">
            <Label htmlFor="username">Email</Label>
            <Input  
              id="username" type="email" placeholder="Digite seu email"
              className={controller.usernameError.value != '' ? 'border-destructive' : ''}
              required value={controller.username.value} 
              onChange={e => controller.username.set(e.target.value)} 
            />
            <span className="text-destructive text-xs h-5 text-end" >{controller.usernameError.value}</span>
          </div>
          <div className="grid gap-1 mb-5">
            <div className="flex items-center">
              <Label htmlFor="password">Senha</Label>
              <Link
                to="/request-recover-password"
                className="ml-auto text-sm underline-offset-4 hover:underline"
              >
                Esqueceu a senha?
              </Link>
            </div>
            <Input
              required
              id="password" placeholder="Digite sua senha"
              className={controller.passwordError.value != '' ? 'border-destructive' : ''}
              type={controller.showPassword.value ? "text" : "password"}
              value={controller.password.value}
              onChange={(e) => controller.password.set(e.target.value)}
            />
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2 pl-1 my-1">
                <Checkbox
                  id="show-password"
                  onCheckedChange={() => controller.showPassword.set((prev) => !prev)}
                  className="cursor-pointer"
                  />
                <Label htmlFor="show-password" className="text-sm font-normal">
                  Exibir senha
                </Label>
              </div>
              <span className="text-destructive text-xs h-5 w-fit" >{controller.passwordError.value}</span>
            </div>
          </div>
          <Button type="submit" className="w-full mb-6" onClick={() => controller.handleLogin()} >
            Entrar
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
