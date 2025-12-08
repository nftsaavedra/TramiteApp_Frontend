// En: src/features/dashboard/components/ResumenMensual.tsx
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  LabelList,
} from 'recharts'
import { MonthlyVolume } from '../services/dashboard.service'

interface ResumenMensualProps {
  data?: MonthlyVolume[]
}

export function ResumenMensual({ data = [] }: ResumenMensualProps) {
  return (
    <ResponsiveContainer width='100%' height={350}>
      <BarChart data={data}>
        <XAxis
          dataKey='name'
          stroke='#888888'
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke='#888888'
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `${value}`}
        />
        <Bar
          dataKey='total'
          fill='hsl(var(--primary))'
          radius={[4, 4, 0, 0]}
          className='stroke-primary stroke-1'
        >
          <LabelList
            dataKey='total'
            position='top'
            className='fill-foreground text-xs font-bold'
            offset={10}
            formatter={(val: any) => (val > 0 ? val : '')}
          />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
