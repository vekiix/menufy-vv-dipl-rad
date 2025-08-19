"use client"

import { useState } from "react"
import { SidebarProvider } from "@/app/components/ui/sidebar"
import { AppSidebar } from "@/app/components/app-sidebar"
import { MobileBottomNav } from "@/app/components/mobile-bottom-nav"
import { UserTable } from "@/app/components/user-table"
import { UserFormModal } from "@/app/components/user-form-modal"
import { Button } from "@/app/components/ui/button"
import { Input } from "@/app/components/ui/input"
import { Plus, Search, Filter } from "lucide-react"

export interface User {
  id: string
  name: string
  email: string
  role: string
  status: "active" | "inactive"
  lastLogin: string
  avatar?: string
}

const mockUsers: User[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    role: "Admin",
    status: "active",
    lastLogin: "2024-01-15",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@example.com",
    role: "Manager",
    status: "active",
    lastLogin: "2024-01-14",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "3",
    name: "Bob Johnson",
    email: "bob@example.com",
    role: "Staff",
    status: "inactive",
    lastLogin: "2024-01-10",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "4",
    name: "Alice Brown",
    email: "alice@example.com",
    role: "Staff",
    status: "active",
    lastLogin: "2024-01-15",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "5",
    name: "Charlie Wilson",
    email: "charlie@example.com",
    role: "Manager",
    status: "active",
    lastLogin: "2024-01-13",
    avatar: "/placeholder.svg?height=40&width=40",
  },
]

export function UserManagementPage() {
  const [users, setUsers] = useState<User[]>(mockUsers)
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [viewingUser, setViewingUser] = useState<User | null>(null)

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleAddUser = () => {
    setEditingUser(null)
    setViewingUser(null)
    setIsModalOpen(true)
  }

  const handleEditUser = (user: User) => {
    setEditingUser(user)
    setViewingUser(null)
    setIsModalOpen(true)
  }

  const handleViewUser = (user: User) => {
    setViewingUser(user)
    setEditingUser(null)
    setIsModalOpen(true)
  }

  const handleDeleteUser = (userId: string) => {
    setUsers(users.filter((user) => user.id !== userId))
    setSelectedUsers(selectedUsers.filter((id) => id !== userId))
  }

  const handleSaveUser = (userData: Partial<User>) => {
    if (editingUser) {
      // Update existing user
      setUsers(users.map((user) => (user.id === editingUser.id ? { ...user, ...userData } : user)))
    } else {
      // Add new user
      const newUser: User = {
        id: Date.now().toString(),
        name: userData.name || "",
        email: userData.email || "",
        role: userData.role || "Staff",
        status: userData.status || "active",
        lastLogin: new Date().toISOString().split("T")[0],
        avatar: "/placeholder.svg?height=40&width=40",
      }
      setUsers([...users, newUser])
    }
    setIsModalOpen(false)
    setEditingUser(null)
  }

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full bg-gray-50">
        {/* Desktop/Tablet Sidebar */}
        <AppSidebar />

        {/* Main Content */}
        <main className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-white border-b border-gray-200 px-4 py-4 sm:px-6 lg:px-8">
            <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
                <p className="text-sm text-gray-600 mt-1">Manage user accounts, roles, and permissions</p>
              </div>

              {/* Desktop Actions */}
              <div className="hidden sm:flex items-center space-x-3">
                <Button onClick={handleAddUser} className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Add User
                </Button>
              </div>
            </div>

            {/* Search and Filters */}
            <div className="mt-4 flex flex-col space-y-3 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-3">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
            </div>
          </div>

          {/* User Table */}
          <div className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
            <UserTable
              users={filteredUsers}
              selectedUsers={selectedUsers}
              onSelectedUsersChange={setSelectedUsers}
              onEditUser={handleEditUser}
              onViewUser={handleViewUser}
              onDeleteUser={handleDeleteUser}
            />
          </div>

          {/* Mobile FAB */}
          <div className="fixed bottom-20 right-4 sm:hidden">
            <Button
              onClick={handleAddUser}
              size="lg"
              className="h-14 w-14 rounded-full bg-blue-600 hover:bg-blue-700 shadow-lg"
            >
              <Plus className="h-6 w-6" />
            </Button>
          </div>
        </main>

        {/* Mobile Bottom Navigation */}
        <MobileBottomNav />

        {/* User Form Modal */}
        <UserFormModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false)
            setEditingUser(null)
            setViewingUser(null)
          }}
          onSave={handleSaveUser}
          user={editingUser}
          viewOnly={!!viewingUser}
          initialData={viewingUser || editingUser}
        />
      </div>
    </SidebarProvider>
  )
}
