import * as Card from "@/src/components/card"
import { cn } from "@/src/util/cn"
import { motion } from "motion/react"

export function CardSkeleton({
	children,
	description,
	spacing = "cozy",
	footer,
	title,
}: {
	title?: string
	children: React.ReactNode
	description?: string
	spacing?: Card.CardVariantsProps["spacing"]
	footer?: React.ReactNode
}) {
	return (
		<div
			aria-hidden
			ref={(node) => node && node.setAttribute("inert", "")}
			aria-label="Loading skeleton table data"
			className={cn(
				"pointer-events-none relative -z-10 w-full",
				"before:absolute before:inset-0 before:z-40 before:-m-6 before:backdrop-blur-sm"
			)}
		>
			<motion.div
				aria-hidden
				className="absolute inset-0 z-50 -m-8 bg-white"
				animate={{
					opacity: [0, 0.5],
				}}
				transition={{
					duration: 0.5,
					repeat: Infinity,
					repeatType: "mirror",
				}}
			/>
			<Card.Root spacing={spacing}>
				{title && (
					<Card.Header>
						<Card.Title>{title}</Card.Title>
						{description && <Card.Description>{description}</Card.Description>}
					</Card.Header>
				)}
				<Card.Body>{children}</Card.Body>
				{footer && <Card.Footer>{footer}</Card.Footer>}
			</Card.Root>
		</div>
	)
}
