"use client"

import { useEffect, useState, memo } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { User } from "@/lib/models/User"
import { Company } from "@/lib/models/Company"
import { X } from "lucide-react"
import { getAllCompanies } from "@/lib/services/auth-service"
import { UserRole } from "@/lib/enum/UserRole"

interface UserFormModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (userData: Partial<User>) => void
  user?: User | null
  viewOnly?: boolean
  initialData?: User | null
}

const UserFormModalComponent = ({ isOpen, onClose, onSave, user, viewOnly = false, initialData }: UserFormModalProps) => {
  const [formData, setFormData] = useState<Partial<User>>({
      id: "",
      username: "",
      password: "",
      companyId: "",
      role: "",
      roleId: 1,
      createdAt: "",
      company: "", 
      status: "inactive"
  })
  
  const [companies, setCompanies] = useState<Company[]>([])
  const [loading, setLoading] = useState(true)


  useEffect(() => {
    const loadCompanies = async () => {
      try {
        const data = await getAllCompanies()
        console.log(data)
        setCompanies(data)
      } catch (error) {
        console.error("Failed to load companies:", error)
      } finally {
        setLoading(false)
      }
    }
    loadCompanies()
  }, [])

  useEffect(() => {
    if (initialData) {
      setFormData({
        id: initialData.id,
        username: initialData.username,
        password: initialData.password,
        companyId: initialData.companyId,
        role: initialData.role,
        roleId: initialData.roleId,
        createdAt: initialData.createdAt,
        company: initialData.company,
        status: initialData.status
      })
    } else {
      setFormData({
        id: "",
        username: "",
        password: "",
        companyId: "",
        role: "",
        roleId: 1,
        createdAt: "",
        company: "", 
        status: "inactive"
      })
    }
  }, [initialData, isOpen])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!viewOnly) {
      onSave(formData)
    }
  }

  const handleInputChange = (field: keyof User, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const isEditing = !!user
  const title = viewOnly ? "View User" : isEditing ? "Edit User" : "Add New User"

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between sm:hidden mb-4">
          <DialogTitle className="text-lg font-semibold">{title}</DialogTitle>
          <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0">
            <X className="h-4 w-4" />
          </Button>
        </div>

        <DialogHeader className="hidden sm:block">
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        

        <form onSubmit={handleSubmit} className="space-y-6">
            {viewOnly && <div className="space-y-2">
              <Label htmlFor="userId">User ID</Label>
              <Input
              id="userId"
              value={formData.id}
              required
              disabled={true}
            />
            </div>
            }
            {viewOnly && <div className="space-y-2">
              <Label htmlFor="companyId">Company ID</Label>
              <Input
              id="companyId"
              value={formData.companyId}
              required
              disabled={true}
            />
            </div>
            }
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              value={formData.username}
              onChange={(e) => handleInputChange("username", e.target.value)}
              placeholder="Enter username"
              required
              disabled={viewOnly}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => handleInputChange("password", e.target.value)}
              placeholder="Enter password"
              required={!isEditing}
              disabled={viewOnly}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Select
              value={formData.roleId?.toString() || ""}
              onValueChange={(value) => handleInputChange("roleId", parseInt(value))}
              disabled={viewOnly}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={UserRole.User.toString()}>User</SelectItem>
                <SelectItem value={UserRole.Admin.toString()}>Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {loading ? "Loading companies..." : 
            <div className="space-y-2">
              <Label htmlFor="company">Company</Label>
              <Select
                value={formData.companyId || ""}
                onValueChange={(value) => handleInputChange("companyId", value)}
                disabled={viewOnly}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select company" />
                </SelectTrigger>
                <SelectContent>
                {companies.map((company) => (
                  <SelectItem key={company.id} value={company.id}>
                    {company.companyName}
                  </SelectItem>
                ))}
                </SelectContent>
              </Select>
            </div>
          }
          {!viewOnly && (
            <div className="flex justify-end pt-4 space-x-2">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                {isEditing ? "Update User" : "Add User"}
              </Button>
            </div>
          )}
        </form>
      </DialogContent>
    </Dialog>
  )
}

export const UserFormModal = memo(UserFormModalComponent)
