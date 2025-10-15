// En: src/features/dashboard/index.tsx
// Componente renombrado
import { FileCheck, FileClock, FilePlus, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Main } from '@/components/layout/main'
// Componente renombrado
import { ActividadReciente } from './components/ActividadReciente'
import { ResumenMensual } from './components/ResumenMensual'
import { StatCard } from './components/StatCard'

export function Dashboard() {
  const stats = [
    {
      title: 'Trámites Pendientes',
      value: '72',
      icon: FileClock,
      description: 'Esperando acción',
    },
    {
      title: 'Finalizados Hoy',
      value: '14',
      icon: FileCheck,
      description: '+5% que ayer',
    },
    {
      title: 'Nuevos en la Semana',
      value: '128',
      icon: FilePlus,
      description: 'Ingresados esta semana',
    },
    {
      title: 'Usuarios Activos',
      value: '42',
      icon: Users,
      description: 'Conectados hoy',
    },
  ]

  return (
    <Main>
      <div className='mb-4 flex items-center justify-between space-y-2'>
        <h1 className='text-3xl font-bold tracking-tight'>Inicio</h1>
        <div className='flex items-center space-x-2'>
          <Button>Nuevo Trámite</Button>
        </div>
      </div>

      {/* Fila de Tarjetas de Estadísticas */}
      <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
        {stats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>

      {/* Fila de Gráficas y Actividad */}
      <div className='mt-8 grid grid-cols-1 gap-4 lg:grid-cols-7'>
        <Card className='col-span-1 lg:col-span-4'>
          <CardHeader>
            <CardTitle>Volumen de Trámites por Mes</CardTitle>
          </CardHeader>
          <CardContent className='ps-2'>
            <ResumenMensual />
          </CardContent>
        </Card>
        <Card className='col-span-1 lg:col-span-3'>
          <CardHeader>
            <CardTitle>Actividad Reciente</CardTitle>
            <CardDescription>
              Últimos 5 movimientos en el sistema.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ActividadReciente />
          </CardContent>
        </Card>
      </div>
    </Main>
  )
}
