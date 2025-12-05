import api from '@/lib/api'

export interface DashboardStats {
  tramitesPendientes: number
  finalizadosHoy: number
  nuevosSemana: number
  usuariosActivos: number
}

export interface MonthlyVolume {
  name: string
  total: number
}

export interface RecentActivity {
  user: string
  action: string
  document: string
  to: string
  color: string
}

export const dashboardService = {
  getStats: async (): Promise<DashboardStats> => {
    const { data } = await api.get('/dashboard/stats')
    return data
  },

  getMonthlyVolume: async (): Promise<MonthlyVolume[]> => {
    const { data } = await api.get('/dashboard/monthly-volume')
    return data
  },

  getRecentActivity: async (): Promise<RecentActivity[]> => {
    const { data } = await api.get('/dashboard/recent-activity')
    return data
  },
}
