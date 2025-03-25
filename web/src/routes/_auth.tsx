import { createFileRoute, Outlet } from "@tanstack/react-router"

function RouteComponent() {
	return (
		<div className="grid h-screen w-screen grid-cols-2">
			<div className="bg-accent" />

			<main className="flex items-center justify-center p-4">
				<div className="w-full max-w-lg">
					<Outlet />
				</div>
			</main>
		</div>
	)
}

export const Route = createFileRoute("/_auth")({
	component: RouteComponent,
})
