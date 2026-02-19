// En: src/features/dashboard/components/ResumenMensual.tsx
import React from 'react'
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  LabelList,
} from 'recharts'
import { type VolumeStat } from '../services/dashboard.service'

interface VolumenChartProps {
  data?: VolumeStat[]
}

export function VolumenChart({ data = [] }: VolumenChartProps) {
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
            formatter={(val: React.ReactNode) =>
              typeof val === 'number' && val > 0 ? val : ''
            }
          />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
