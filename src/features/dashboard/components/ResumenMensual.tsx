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
import { Skeleton } from '@/components/ui/skeleton'
import { type VolumeStat } from '../services/dashboard.service'

interface VolumenChartProps {
  data?: VolumeStat[]
  isLoading?: boolean
}

export function VolumenChart({ data = [], isLoading = false }: VolumenChartProps) {
  if (isLoading) {
    return (
      <div className='space-y-4'>
        {/* Skeleton para ejes y barras */}
        <div className='flex h-[300px] items-end justify-between gap-2 px-4'>
          {Array.from({ length: 7 }).map((_, i) => (
            <Skeleton
              key={i}
              className='w-full'
              style={{ height: `${Math.random() * 60 + 20}%` }}
            />
          ))}
        </div>
        {/* Skeleton para labels del eje X */}
        <div className='flex justify-between px-4'>
          {Array.from({ length: 7 }).map((_, i) => (
            <Skeleton key={i} className='h-3 w-12' />
          ))}
        </div>
      </div>
    )
  }

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
