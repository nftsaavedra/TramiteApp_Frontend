// En: src/features/dashboard/components/ResumenMensual.tsx
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from 'recharts'

// Datos de ejemplo para trámites por mes
const data = [
  { name: 'Ene', total: Math.floor(Math.random() * 200) + 50 },
  { name: 'Feb', total: Math.floor(Math.random() * 200) + 50 },
  { name: 'Mar', total: Math.floor(Math.random() * 200) + 50 },
  { name: 'Abr', total: Math.floor(Math.random() * 200) + 50 },
  { name: 'May', total: Math.floor(Math.random() * 200) + 50 },
  { name: 'Jun', total: Math.floor(Math.random() * 200) + 50 },
  { name: 'Jul', total: Math.floor(Math.random() * 200) + 50 },
  { name: 'Ago', total: Math.floor(Math.random() * 200) + 50 },
  { name: 'Sep', total: Math.floor(Math.random() * 200) + 50 },
  { name: 'Oct', total: Math.floor(Math.random() * 200) + 50 },
  { name: 'Nov', total: Math.floor(Math.random() * 200) + 50 },
  { name: 'Dic', total: Math.floor(Math.random() * 200) + 50 },
]

export function ResumenMensual() {
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
