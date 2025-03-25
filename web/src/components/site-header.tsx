import { Button } from "@/src/components/button"
import { LogoIcon } from "@/src/components/logo-icon"
import { TokenKeys } from "@/src/enums"
import type { User } from "@/src/types"
import { cn } from "@/src/util/cn"
import { deleteCookie } from "@/src/util/cookies"
import { capitalize, truncate } from "@/src/util/string"
import { Link, useNavigate, useRouterState } from "@tanstack/react-router"
import { TrendingUp } from "lucide-react"

export function SiteHeader(props: { user: User }) {
  const router = useRouterState()
  const pathname = router.location.pathname

  const navigate = useNavigate({ from: "/" })

  function handleLogout() {
    deleteCookie(TokenKeys.AccessToken)
    navigate({ to: "/login" })
  }

  const isEliminationsActiveLink = pathname.includes("eliminations")
  const isParticipantsActiveLink = pathname.includes("participants")
  const isDashboardActiveLink = pathname === "/"

  return (
    <header className="relative z-10 flex flex-col bg-muted px-5 shadow-xs">
      <div className="flex h-16 items-center justify-between gap-3 overflow-x-auto">
        <div className="flex items-center gap-2">
          <Link to="/" className="active:scale-95">
            <LogoIcon />
          </Link>

          <svg
            width="16"
            height="24"
            viewBox="0 0 16 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M14 2L2 30"
              className="stroke-zinc-300"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
            />
          </svg>

          <Button size="sm" variant="primary" onClick={() => navigate({ to: "/voting" })}>
            <div className="flex items-center gap-1.5">
              <TrendingUp size={15} />
              Ver votações
            </div>
          </Button>
        </div>

        <nav>
          <ul className="flex items-center gap-1">
            <li>
              <Button
                variant="ghost"
                className={cn(isDashboardActiveLink && "bg-zinc-200/70")}
                onClick={() => navigate({ to: "/" })}
              >
                Dashboard
              </Button>
            </li>
            <li>
              <Button
                variant="ghost"
                className={cn(isEliminationsActiveLink && "bg-zinc-200/70")}
                onClick={() => navigate({ to: "/eliminations" })}
              >
                Paredões
              </Button>
            </li>
            <li>
              <Button
                variant="ghost"
                className={cn(isParticipantsActiveLink && "bg-zinc-200/70")}
                onClick={() => navigate({ to: "/participants" })}
              >
                Participantes
              </Button>
            </li>
          </ul>
        </nav>

        <div className="mr-1 flex items-center gap-2">
          <p className="text-lg font-semibold">
            {capitalize(truncate(props.user.name, 20), true)}
          </p>
          <Button variant="danger" size="xs" onClick={handleLogout}>
            Sair
          </Button>
        </div>
      </div>
    </header>
  )
}
