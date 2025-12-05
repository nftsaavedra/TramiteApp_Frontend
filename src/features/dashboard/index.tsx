// En: src/features/dashboard/index.tsx
import { useEffect, useState } from 'react'
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
import { ActividadReciente } from './components/ActividadReciente'
import { ResumenMensual } from './components/ResumenMensual'
import { StatCard } from './components/StatCard'
import {
  dashboardService,
  DashboardStats,
  MonthlyVolume,
  RecentActivity,
} from './services/dashboard.service'

export function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [monthlyVolume, setMonthlyVolume] = useState<MonthlyVolume[]>([])
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [statsData, volumeData, activityData] = await Promise.all([
          dashboardService.getStats(),
          dashboardService.getMonthlyVolume(),
          dashboardService.getRecentActivity(),
        ])
        setStats(statsData)
        setMonthlyVolume(volumeData)
        setRecentActivity(activityData)
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const statCards = [
    {
      title: 'Trámites Pendientes',
      value: stats?.tramitesPendientes.toString() || '0',
      icon: FileClock,
      description: 'Esperando acción',
    },
    {
      title: 'Finalizados Hoy',
      value: stats?.finalizadosHoy.toString() || '0',
      icon: FileCheck,
      description: 'Gestionados hoy',
    },
    {
      title: 'Nuevos en la Semana',
      value: stats?.nuevosSemana.toString() || '0',
      icon: FilePlus,
      description: 'Ingresados esta semana',
    },
    {
      title: 'Usuarios Activos',
      value: stats?.usuariosActivos.toString() || '0',
      icon: Users,
      description: 'Conectados hoy',
    },
  ]

  if (loading) {
    return (
      <Main>
        <div className='flex h-[50vh] w-full items-center justify-center'>
          <div className='bg-primary h-8 w-8 animate-spin rounded-full border-4 border-solid border-t-transparent'></div>
        </div>
      </Main>
    )
  }

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
        {statCards.map((stat) => (
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
            <ResumenMensual data={monthlyVolume} />
          </CardContent>
        </Card>
        <Card className='col-span-1 lg:col-span-3'>
          <CardHeader>
            <CardTitle>Actividad Reciente</CardTitle>
            <CardDescription>
              Últimos movimientos en el sistema.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ActividadReciente data={recentActivity} />
          </CardContent>
        </Card>
      </div>
    </Main>
  )
}
