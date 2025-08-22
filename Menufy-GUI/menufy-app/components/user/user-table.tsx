"use client"

import { useState, memo, useCallback } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MoreHorizontal, Edit, Eye, Trash2 } from "lucide-react"
import { User } from "@/lib/models/User"

interface UserTableProps {
  users: User[]
  selectedUsers: string[]
  onSelectedUsersChange: (selected: string[]) => void
  onEditUser: (user: User) => void
  onViewUser: (user: User) => void
  onDeleteUser: (userId: string) => void
}

// Consistent date formatting function
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

const UserTableComponent = ({
  users,
  selectedUsers,
  onSelectedUsersChange,
  onEditUser,
  onViewUser,
  onDeleteUser,
}: UserTableProps) => {
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10
  const totalPages = Math.ceil(users.length / itemsPerPage)

  const paginatedUsers = users.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const handleSelectAll = useCallback((checked: boolean) => {
    if (checked) {
      onSelectedUsersChange(paginatedUsers.map((user) => user.id))
    } else {
      onSelectedUsersChange([])
    }
  }, [paginatedUsers, onSelectedUsersChange])

  const handleSelectUser = useCallback((userId: string, checked: boolean) => {
    if (checked) {
      onSelectedUsersChange([...selectedUsers, userId])
    } else {
      onSelectedUsersChange(selectedUsers.filter((id) => id !== userId))
    }
  }, [selectedUsers, onSelectedUsersChange])

  const isAllSelected = paginatedUsers.length > 0 && paginatedUsers.every((user) => selectedUsers.includes(user.id))

  return (
    <div className="space-y-4">
      {/* Batch Actions */}
      {selectedUsers.length > 0 && (
        <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
          <span className="text-sm font-medium text-blue-900">{selectedUsers.length} user(s) selected</span>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700"
              onClick={async () => {
              await Promise.all(selectedUsers.map((userId) => onDeleteUser(userId)))
                  onSelectedUsersChange([])
              }}>
              Delete Selected
            </Button>
          </div>
        </div>
      )}

      {/* Desktop Table */}
      <div className="hidden sm:block bg-white rounded-lg border border-gray-200 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="w-12">
                <Checkbox checked={isAllSelected} onCheckedChange={handleSelectAll} aria-label="Select all users" />
              </TableHead>
              <TableHead>User</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created at</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedUsers.map((user) => (
              <TableRow key={user.id} className="hover:bg-gray-50">
                <TableCell>
                  <Checkbox
                    checked={selectedUsers.includes(user.id)}
                    onCheckedChange={(checked) => handleSelectUser(user.id, checked as boolean)}
                    aria-label={`Select ${user.username}`}
                  />
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-6">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.avatar || "/user_placeholder.png"} alt={user.username} />
                      <AvatarFallback>
                        {user.username
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium text-gray-900">{user.username}</div>
                      <div className="text-sm text-gray-500">{user.company}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={user.role.toLowerCase() === "admin" ? "default" : "secondary"}>{user.role}</Badge>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={user.status === "active" ? "default" : "secondary"}
                    className={user.status === "active" ? "bg-green-100 text-green-800" : ""}
                  >
                    {user.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm text-gray-500">{formatDate(user.createdAt)}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onViewUser(user)}>
                        <Eye className="mr-2 h-4 w-4" />
                        View
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onEditUser(user)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onDeleteUser(user.id)} className="text-red-600">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Cards */}
      <div className="sm:hidden space-y-3">
        {paginatedUsers.map((user) => (
          <div key={user.id} className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3 flex-1">
                <Checkbox
                  checked={selectedUsers.includes(user.id)}
                  onCheckedChange={(checked) => handleSelectUser(user.id, checked as boolean)}
                  aria-label={`Select ${user.username}`}
                />
                <Avatar className="h-10 w-10">
                  <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.username} />
                  <AvatarFallback>
                    {user.username
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-gray-900 truncate">{user.username}</div>
                  <div className="text-sm text-gray-500 truncate">{user.company}</div>
                  <div className="flex items-center space-x-2 mt-2">
                    <Badge variant="secondary" className="text-xs">
                      {user.role}
                    </Badge>
                    <Badge
                      variant={user.status === "active" ? "default" : "secondary"}
                      className={`text-xs ${user.status === "active" ? "bg-green-100 text-green-800" : ""}`}
                    >
                      {user.status}
                    </Badge>
                  </div>
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">Open menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onViewUser(user)}>
                    <Eye className="mr-2 h-4 w-4" />
                    View
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onEditUser(user)}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onDeleteUser(user.id)} className="text-red-600">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className="mt-2 text-xs text-gray-500">Created at: {formatDate(user.createdAt)}</div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-3 bg-white border border-gray-200 rounded-lg">
          <div className="text-sm text-gray-700">
            Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, users.length)} of{" "}
            {users.length} results
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

export const UserTable = memo(UserTableComponent)
