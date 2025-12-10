import { useEffect, useState } from 'react'
import { Link } from '@tanstack/react-router'
import { FileCheck, FileClock, FilePlus, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Main } from '@/components/layout/main'
import { ActividadReciente } from './components/ActividadReciente'
import { VolumenChart } from './components/ResumenMensual'
import { StatCard } from './components/StatCard'
import {
  dashboardService,
  DashboardStats,
  VolumeStat,
  RecentActivity,
} from './services/dashboard.service'

type TimeUnit = 'week' | 'month' | 'year'

export function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [volumeData, setVolumeData] = useState<VolumeStat[]>([])
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([])
  const [loading, setLoading] = useState(true)

  // Estado del filtro
  const [selectedUnit, setSelectedUnit] = useState<TimeUnit>('week')
  const [selectedRange, setSelectedRange] = useState<string>('1')

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)

        // Mapear selección a params del backend
        let groupBy: 'day' | 'week' | 'month' | 'year' = 'day'
        let limit = 7
        const rangeNum = parseInt(selectedRange, 10)

        switch (selectedUnit) {
          case 'week':
            // Si elige semanas, mostramos días. Límite = semanas * 7 días
            groupBy = 'day'
            limit = rangeNum * 7
            break
          case 'month':
            // Si elige meses, mostramos meses.
            groupBy = 'month'
            limit = rangeNum
            break
          case 'year':
            // Si elige años, mostramos años.
            groupBy = 'year'
            limit = rangeNum
            break
        }

        const [statsData, volData, activityData] = await Promise.all([
          dashboardService.getStats(),
          dashboardService.getVolumeStats(groupBy, limit),
          dashboardService.getRecentActivity(),
        ])
        setStats(statsData)
        setVolumeData(volData)
        setRecentActivity(activityData)
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [selectedUnit, selectedRange])

  // ... (statCards array remains same) ...
  const statCards = [
    {
      title: 'Trámites Pendientes',
      value: stats?.tramitesPendientes.toString() || '0',
      icon: FileClock,
      description: 'Esperando acción',
      className:
        'bg-orange-50 dark:bg-orange-950/30 border-orange-200 dark:border-orange-800 text-orange-700 dark:text-orange-400',
    },
    {
      title: 'Finalizados Hoy',
      value: stats?.finalizadosHoy.toString() || '0',
      icon: FileCheck,
      description: 'Gestionados hoy',
      className:
        'bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800 text-green-700 dark:text-green-400',
    },
    {
      title: 'Nuevos en la Semana',
      value: stats?.nuevosSemana.toString() || '0',
      icon: FilePlus,
      description: 'Ingresados esta semana',
      className:
        'bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-400',
    },
    {
      title: 'Usuarios Activos',
      value: stats?.usuariosActivos.toString() || '0',
      icon: Users,
      description: 'Conectados hoy',
      className:
        'bg-purple-50 dark:bg-purple-950/30 border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-400',
    },
  ]

  if (loading && !stats) {
    // Solo mostrar loader full screen la primera vez
    return (
      <Main>
        <div className='flex h-[50vh] w-full items-center justify-center'>
          <div className='bg-primary h-8 w-8 animate-spin rounded-full border-4 border-solid border-t-transparent'></div>
        </div>
      </Main>
    )
  }

  // Textos dinámicos para el select según la unidad
  const getRangeLabel = (num: string) => {
    const n = parseInt(num)
    if (n === 1) {
      if (selectedUnit === 'week') return 'Última Semana'
      if (selectedUnit === 'month') return 'Último Mes'
      if (selectedUnit === 'year') return 'Último Año'
    } else {
      const suffix =
        selectedUnit === 'week'
          ? 'Semanas'
          : selectedUnit === 'month'
            ? 'Meses'
            : 'Años'
      const gender =
        selectedUnit === 'year' || selectedUnit === 'month'
          ? 'Últimos'
          : 'Últimas'
      return `${gender} ${n} ${suffix}`
    }
    return ''
  }

  return (
    <Main>
      <div className='mb-4 flex items-center justify-between space-y-2'>
        <h1 className='text-3xl font-bold tracking-tight'>Inicio</h1>
        <div className='flex items-center space-x-2'>
          <Button asChild>
            <Link to='/tramites/nuevo'>Nuevo Trámite</Link>
          </Button>
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
          <CardHeader className='flex flex-col space-y-2 pb-2 sm:flex-row sm:items-center sm:justify-between sm:space-y-0'>
            <CardTitle className='text-base font-medium'>
              Volumen de Trámites
            </CardTitle>
            <div className='flex items-center gap-2'>
              <Tabs
                value={selectedUnit}
                onValueChange={(val) => {
                  setSelectedUnit(val as TimeUnit)
                  setSelectedRange('1') // Reset range on unit change
                }}
              >
                <TabsList className='h-8'>
                  <TabsTrigger value='week' className='h-7 text-xs'>
                    Semanas
                  </TabsTrigger>
                  <TabsTrigger value='month' className='h-7 text-xs'>
                    Meses
                  </TabsTrigger>
                  <TabsTrigger value='year' className='h-7 text-xs'>
                    Años
                  </TabsTrigger>
                </TabsList>
              </Tabs>

              <Select value={selectedRange} onValueChange={setSelectedRange}>
                <SelectTrigger className='h-8 w-[140px] text-xs'>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent align='end'>
                  <SelectItem value='1'>{getRangeLabel('1')}</SelectItem>
                  <SelectItem value='2'>{getRangeLabel('2')}</SelectItem>
                  <SelectItem value='3'>{getRangeLabel('3')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent className='ps-2 pt-4'>
            <VolumenChart data={volumeData} />
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
