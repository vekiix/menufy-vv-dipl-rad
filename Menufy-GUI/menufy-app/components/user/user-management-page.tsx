"use client"

import { useEffect, useState, useCallback, useMemo } from "react"
import { UserTable } from "@/components/user/user-table"
import { UserFormModal } from "@/components/user/user-form-modal"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Search, Filter, Users } from "lucide-react"
import { createUser, deleteUser, getAllUsers, updateUser } from "@/lib/services/auth-service"
import { useToast } from "../providers/toast-provider"
import { CreateUserRequest } from "@/lib/req/CreateUserRequest"
import { User } from "@/lib/models/User"
import { DataStatusView } from "@/components/ui/data-status-view"



export function UserManagementPage() {
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(true)
  const [users, setUsers] = useState<User[]>([])
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  
  // Combine modal-related state to reduce re-renders
  const [modalState, setModalState] = useState<{
    isOpen: boolean
    editingUser: User | null
    viewingUser: User | null
  }>({
    isOpen: false,
    editingUser: null,
    viewingUser: null
  })

  const fetchUsers = useCallback(async () => {
    setIsLoading(true)
    try {
      const fetchedUsers = await getAllUsers();
      setUsers(fetchedUsers);
    } catch (error) {
      showToast(`Error occured while fetching users. ${error}`,"error");
    }
    setIsLoading(false)
  }, [showToast]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Memoize filtered users to prevent unnecessary recalculations
  const filteredUsers = useMemo(() => {
    return users.filter(
      (user) =>
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.role.toString().includes(searchTerm.toLowerCase()),
    )
  }, [users, searchTerm])

  const handleAddUser = useCallback(() => {
    setModalState({
      isOpen: true,
      editingUser: null,
      viewingUser: null
    })
  }, [])

  const handleEditUser = useCallback((user: User) => {
    setModalState({
      isOpen: true,
      editingUser: user,
      viewingUser: null
    })
  }, [])

  const handleViewUser = useCallback((user: User) => {
    setModalState({
      isOpen: true,
      editingUser: null,
      viewingUser: user
    })
  }, [])

  const handleDeleteUser = useCallback(async (userId: string) => {
    try{
      const users = await deleteUser(userId);
      setUsers(users);
      setSelectedUsers(prev => prev.filter((id) => id !== userId))
      showToast(`A user with ID: '${userId}' has successfully been deleted.`, "success");
    } catch(error){
      showToast(`Error while deleting a user. ${error}`, "error");
    }
  }, [showToast])

  const handleSaveUser = useCallback(async (userData: Partial<User>) => {
    if (modalState.editingUser) {
      const updatedUser: CreateUserRequest = {
        username: userData.username || "",
        companyId: userData.companyId || "",
        password: userData.password || "",
        roleId: userData.roleId || 1,
      }
      try{
        const userObject = await updateUser(modalState.editingUser.id, updatedUser);
        setUsers(prev => prev.map((user) => (user.id === modalState.editingUser!.id ? { ...user, ...userObject} : user)))
        showToast(`User with ID: '${modalState.editingUser.id}' successfully updated`, "success");
        setModalState({ isOpen: false, editingUser: null, viewingUser: null })
      }catch (err) {
        showToast(`There was an error while updating a user. ${err}`, "error");
      }

    } else {
      // Add new user - use a predictable ID generation
      const newUser: CreateUserRequest = {
        username: userData.username || "",
        companyId: userData.companyId || "",
        password: userData.password || "",
        roleId: userData.roleId || 1,
      }
      try{
        const createdUser = await createUser(newUser);
        setUsers(prev => [...prev, createdUser])
        showToast(`New user has successfully been created.`, "success");
        setModalState({ isOpen: false, editingUser: null, viewingUser: null })
      } catch(err){
        showToast(`Error while creating a user. ${err}`, "error");
      }
    }
  }, [modalState.editingUser, showToast])

  const handleModalClose = useCallback(() => {
    setModalState({ isOpen: false, editingUser: null, viewingUser: null })
  }, [])

  const handleSelectedUsersChange = useCallback((selected: string[]) => {
    setSelectedUsers(selected)
  }, [])

  return (

      <div className="min-h-screen w-full bg-gray-50">
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
          <DataStatusView 
            isLoading={isLoading} 
            hasData={users.length > 0}
            loadingTitle="Loading users..."
            loadingMessage="Please wait while we fetch users."
            errorTitle="No users available"
            errorMessage="Unable to load users."
            errorIcon={Users}
          />
          
          {!isLoading && users.length > 0 && (
            <div className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
              <UserTable
                users={filteredUsers}
                selectedUsers={selectedUsers}
                onSelectedUsersChange={handleSelectedUsersChange}
                onEditUser={handleEditUser}
                onViewUser={handleViewUser}
                onDeleteUser={handleDeleteUser}
              />
            </div>
          )}

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

        {/* User Form Modal */}
        <UserFormModal
          isOpen={modalState.isOpen}
          onClose={handleModalClose}
          onSave={handleSaveUser}
          user={modalState.editingUser}
          viewOnly={!!modalState.viewingUser}
          initialData={modalState.viewingUser || modalState.editingUser}
        />
      </div>
  )
}

