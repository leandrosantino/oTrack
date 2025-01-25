import { Logo } from "@/components/logo";
import { ReactNode } from "react";

export function LoginLayout({children}: {children: ReactNode}) {
  return (
    <div className="grid min-h-svh lg:grid-cols-1 w-full">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="#" className="flex items-center gap-2 font-medium">
            <Logo />
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}