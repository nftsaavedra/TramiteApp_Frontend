// En: src/features/dashboard/components/ResumenMensual.tsx
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from 'recharts'
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
          // Formateador sin el signo de dólar
          tickFormatter={(value) => `${value}`}
        />
        <Bar
          dataKey='total'
          fill='currentColor'
          radius={[4, 4, 0, 0]}
          className='fill-primary'
        />
      </BarChart>
    </ResponsiveContainer>
  )
}
