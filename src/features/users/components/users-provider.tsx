// En: src/features/users/components/users-provider.tsx
import React from 'react'
import {
  useQuery,
  useMutation,
  useQueryClient,
  UseQueryResult,
  UseMutationResult,
} from '@tanstack/react-query'
import { toast } from 'sonner'
import api from '@/lib/api'
import { UserFormValues } from '../data/schema'

// --- Tipos de Datos Centralizados para el Módulo ---
export type User = {
  id: string
  name: string
  email: string
  role: 'ADMIN' | 'RECEPCIONISTA' | 'ANALISTA' | 'ASESORIA'
  isActive: boolean
  oficina: {
    id: string
    nombre: string
    siglas: string
  } | null
}

export type Oficina = {
  id: string
  nombre: string
  siglas: string
}

// --- Tipos para el Contexto ---
type UsersDialogType = 'add' | 'edit' | 'delete'

type UsersContextType = {
  // Estado de la UI
  openDialog: UsersDialogType | null
  setOpenDialog: (dialog: UsersDialogType | null) => void
  selectedUser: User | null
  setSelectedUser: (user: User | null) => void

  // Consultas de React Query
  usersQuery: UseQueryResult<User[], Error>
  oficinasQuery: UseQueryResult<Oficina[], Error>

  // Mutaciones de React Query
  createMutation: UseMutationResult<any, Error, UserFormValues, unknown>
  updateMutation: UseMutationResult<
    any,
    Error,
    { id: string } & Partial<UserFormValues>,
    unknown
  >
  deleteMutation: UseMutationResult<any, Error, string, unknown>
}

const UsersContext = React.createContext<UsersContextType | null>(null)

// --- Funciones de API Aisladas ---
const fetchUsers = async (): Promise<User[]> => {
  const { data } = await api.get('/users')
  return Array.isArray(data) ? data : []
}

const fetchOficinas = async (): Promise<Oficina[]> => {
  const { data } = await api.get('/oficinas')
  return Array.isArray(data) ? data : []
}

const createUser = (newData: UserFormValues) => api.post('/users', newData)
const updateUser = ({
  id,
  ...updateData
}: { id: string } & Partial<UserFormValues>) =>
  api.patch(`/users/${id}`, updateData)
const deleteUser = (id: string) => api.delete(`/users/${id}`)

// --- El Componente Provider ---
export function UsersProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient()

  const [openDialog, setOpenDialog] = React.useState<UsersDialogType | null>(
    null
  )
  const [selectedUser, setSelectedUser] = React.useState<User | null>(null)

  const usersQuery = useQuery({ queryKey: ['users'], queryFn: fetchUsers })
  const oficinasQuery = useQuery({
    queryKey: ['oficinas'],
    queryFn: fetchOficinas,
  })

  const handleMutation = {
    onSuccess: (successMessage: string) => {
      toast.success(successMessage)
      queryClient.invalidateQueries({ queryKey: ['users'] })
      setOpenDialog(null)
      setSelectedUser(null)
    },
    onError: (error: any) => {
      toast.error(
        `Error: ${error.response?.data?.message || 'No se pudo realizar la operación.'}`
      )
    },
  }

  const createMutation = useMutation({
    mutationFn: createUser,
    onSuccess: () => handleMutation.onSuccess('Usuario creado exitosamente.'),
    onError: handleMutation.onError,
  })

  const updateMutation = useMutation({
    mutationFn: updateUser,
    onSuccess: () =>
      handleMutation.onSuccess('Usuario actualizado exitosamente.'),
    onError: handleMutation.onError,
  })

  const deleteMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: () =>
      handleMutation.onSuccess('Usuario eliminado exitosamente.'),
    onError: handleMutation.onError,
  })

  const value = {
    openDialog,
    setOpenDialog,
    selectedUser,
    setSelectedUser,
    usersQuery,
    oficinasQuery,
    createMutation,
    updateMutation,
    deleteMutation,
  }

  return <UsersContext.Provider value={value}>{children}</UsersContext.Provider>
}

// --- Hook Personalizado para Consumir el Contexto ---
export const useUsers = () => {
  const context = React.useContext(UsersContext)
  if (!context) {
    throw new Error('useUsers debe ser usado dentro de un UsersProvider')
  }
  return context
}
