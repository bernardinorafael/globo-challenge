import { PageLoader } from "@/src/components/page-loader"
import { SiteHeader } from "@/src/components/site-header"
import { TokenKeys } from "@/src/enums"
import type { User } from "@/src/types"
import { cn } from "@/src/util/cn"
import { getCookie } from "@/src/util/cookies"
import { request } from "@/src/util/http/request"
import { useQuery } from "@tanstack/react-query"
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router"

function RouteComponent() {
	const {
		data: user,
		isLoading: isUserLoading,
		isFetched: isUserFetched,
	} = useQuery({
		queryKey: ["me"],
		queryFn: () => {
			return request<User>({
				path: "api/v1/users/me",
				method: "GET",
			})
		},
	})

	if (isUserLoading && !isUserFetched) {
		return <PageLoader />
	}

	return (
		<>
			{/* At this point, we will always have a user */}
			<SiteHeader user={user!} />

			<div
				className={cn(
					"mx-auto mt-8 w-[calc(100%-theme(spacing.10))] max-w-6xl gap-12 pb-6"
				)}
			>
				<main className="mt-8 flex-1">
					<Outlet />
				</main>
			</div>
		</>
	)
}

export const Route = createFileRoute("/_dashboard")({
	component: RouteComponent,
	beforeLoad: () => {
		const token = getCookie(TokenKeys.AccessToken)

		if (!token) {
			throw redirect({
				to: "/login",
				search: {
					redirect: location.href,
				},
			})
		}
	},
})
