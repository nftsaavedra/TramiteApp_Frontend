import api from '@/lib/api'

export interface DashboardStats {
  tramitesPendientes: number
  finalizadosHoy: number
  nuevosSemana: number
  usuariosActivos: number
}

export interface VolumeStat {
  name: string
  total: number
  date?: string
}

export interface RecentActivity {
  user: string
  action: string
  document: string
  to: string
  color: string
  date: string
}

export const dashboardService = {
  getStats: async (): Promise<DashboardStats> => {
    const { data } = await api.get('/dashboard/stats')
    return data
  },

  getVolumeStats: async (
    groupBy: 'hour' | 'day' | 'week' | 'month' | 'year' = 'month',
    limit: number = 6
  ): Promise<VolumeStat[]> => {
    const { data } = await api.get('/dashboard/volume-stats', {
      params: { groupBy, limit },
    })
    return data
  },

  getRecentActivity: async (): Promise<RecentActivity[]> => {
    const { data } = await api.get('/dashboard/recent-activity')
    return data
  },
}
