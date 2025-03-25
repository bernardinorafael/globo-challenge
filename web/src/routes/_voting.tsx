import { Button } from "@/src/components/button"
import { LogoIcon } from "@/src/components/logo-icon"
import { TokenKeys } from "@/src/enums"
import { cn } from "@/src/util/cn"
import { getCookie } from "@/src/util/cookies"
import { createFileRoute, Link, Outlet, useNavigate } from "@tanstack/react-router"
import { ChartNoAxesCombined, LogIn } from "lucide-react"

export const Route = createFileRoute("/_voting")({
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = useNavigate({ from: "/voting" })

  const isAuthenticated = getCookie(TokenKeys.AccessToken)

  return (
    <>
      <header className="z-10 flex flex-col bg-accent px-5 shadow-xs">
        <div className="flex h-16 items-center justify-between gap-3 overflow-x-auto">
          <Link to="/voting" className="active:scale-95">
            <LogoIcon className="fill-white" />
          </Link>

          <div className="mr-1 flex items-center gap-2">
            <Button
              size="sm"
              variant="secondary"
              onClick={() => navigate({ to: "/login" })}
            >
              <div className="flex items-center gap-1.5">
                {isAuthenticated ? (
                  <ChartNoAxesCombined size={15} className="text-zinc-500" />
                ) : (
                  <LogIn size={15} className="text-zinc-500" />
                )}
                {isAuthenticated ? "Ir para o Dashboard" : "Entrar"}
              </div>
            </Button>
          </div>
        </div>
      </header>
      <div
        className={cn(
          "mx-auto mt-8 w-[calc(100%-theme(spacing.10))] max-w-xl gap-12 pb-6"
        )}
      >
        <main className="mt-8 flex-1">
          <Outlet />
        </main>
      </div>
    </>
  )
}
