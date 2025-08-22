export interface User {
  id: string
  password?: string
  username: string
  companyId: string
  company: string
  role: string
  roleId: number
  status: "active" | "inactive"
  createdAt: string
  avatar?: string
}