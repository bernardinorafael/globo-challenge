import React from "react"

import { cn } from "@/src/util/cn"

type PageLayoutProps = {
	title: React.ReactNode
	description: React.ReactNode
	titleBadge?: React.ReactNode
	actions?: React.ReactNode
	children?: React.ReactNode
}

export function PageLayout(props: PageLayoutProps) {
	return (
		<article className="group h-full space-y-4">
			<header className="relative flex w-full flex-col gap-4 pb-6">
				<div className="flex w-full items-end justify-between gap-4">
					<div className="flex flex-col gap-1">
						<section className="flex items-center gap-2">
							<h2 className="truncate text-2xl font-semibold tracking-tight [&+*]:shrink-0">
								{props.title}
							</h2>

							<span className={cn(!props.titleBadge && "hidden")}>
								{props.titleBadge}
							</span>
						</section>

						<p className="text-base text-text-secondary">{props.description}</p>
					</div>

					{props.actions && (
						<div className="flex shrink-0 items-center gap-3 justify-self-end">
							{props.actions}
						</div>
					)}
				</div>
			</header>

			{props.children}
		</article>
	)
}
