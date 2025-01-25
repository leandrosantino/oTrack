import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { LoginLayout } from "./components/login-layout"
import { LoginController } from "./login.controller"

type props = {
  controller: LoginController
}

export function LoginView({ controller }: props) {

  const {handleLogin, passwordField, usernameField, isLoadingSession} = controller.use()

  return (
    <LoginLayout isLoading={isLoadingSession} >
      <form onSubmit={e => e.preventDefault()} className={cn("flex flex-col gap-6")}>
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-bold">Bem Vindo!</h1>
          <p className="text-balance text-sm text-muted-foreground">
            Insira seu usuário e senha para acessar sua conta.
          </p>
        </div>
        <div className="grid gap-6">
          <div className="grid gap-2">
            <Label htmlFor="email">Usuário</Label>
            <Input id="email" type="text" required value={usernameField.value} onChange={e => usernameField.set(e.target.value)} />
          </div>
          <div className="grid gap-2">
            <div className="flex items-center">
              <Label htmlFor="password">Password</Label>
              <a
                href="#"
                className="ml-auto text-sm underline-offset-4 hover:underline"
              >
                Esqueceu a senha?
              </a>
            </div>
            <Input id="password" type="password" required value={passwordField.value} onChange={e => passwordField.set(e.target.value)} />
          </div>
          <Button type="submit" className="w-full" onClick={() => handleLogin()} >
            Entrar
          </Button>
          <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
            <span className="relative z-10 bg-background px-2 text-muted-foreground">
              Created by &copy;leandroSantino
            </span>
          </div>
        </div>
      </form>
    </LoginLayout>
  )
}
