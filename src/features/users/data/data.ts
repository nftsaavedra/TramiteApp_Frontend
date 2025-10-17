// En: src/features/admin/usuarios/data/data.ts

// Corresponde al enum `Role` del backend
export const roles = ['ADMIN', 'RECEPCIONISTA', 'ANALISTA', 'ASESORIA'] as const

export const rolesOptions = roles.map((role) => ({
  label: role.charAt(0).toUpperCase() + role.slice(1).toLowerCase(),
  value: role,
}))
