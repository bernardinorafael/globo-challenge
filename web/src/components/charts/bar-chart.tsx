import {
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from "@/src/components/charts/ui"
import type { ChartConfig } from "@/src/components/charts/ui"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"

const chartConfig = {
	votes: {
		label: "Votos",
		color: "var(--accent)",
	},
} satisfies ChartConfig

export function BarChartComponent(props: {
	shouldAnimate?: boolean
	data: {
		hour: number
		votes: number
	}[]
}) {
	const { shouldAnimate = true, data } = props

	return (
		<ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
			<BarChart
				accessibilityLayer
				data={data}
				barSize={34}
				margin={{
					left: 0,
					right: 0,
				}}
			>
				<CartesianGrid vertical={false} />
				<XAxis
					dataKey="hour"
					tickLine={false}
					tickMargin={12}
					axisLine={false}
					tickFormatter={(value) => `${value}h`}
				/>
				<ChartTooltip
					content={<ChartTooltipContent nameKey="votes" className="w-[90px]" />}
				/>
				<Bar
					dataKey="votes"
					fill="var(--accent)"
					isAnimationActive={shouldAnimate}
					radius={[4, 4, 0, 0]}
				/>
			</BarChart>
		</ChartContainer>
	)
}
