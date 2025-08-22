"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MoreHorizontal, Edit, Eye, Trash2, Building2 } from "lucide-react"
import { Company } from "@/lib/models/Company"

interface CompanyTableProps {
  companies: Company[]
  selectedCompanies: string[]
  onSelectedCompaniesChange: (selected: string[]) => void
  onEditCompany: (company: Company) => void
  onViewCompany: (company: Company) => void
  onDeleteCompany: (companyId: string) => void
}

// Consistent date formatting function
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}


export function CompanyTable({
  companies,
  selectedCompanies,
  onSelectedCompaniesChange,
  onEditCompany,
  onViewCompany,
  onDeleteCompany,
}: CompanyTableProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10
  const totalPages = Math.ceil(companies.length / itemsPerPage)

  const paginatedCompanies = companies.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      onSelectedCompaniesChange(paginatedCompanies.map((company) => company.id))
    } else {
      onSelectedCompaniesChange([])
    }
  }

  const handleSelectCompany = (companyId: string, checked: boolean) => {
    if (checked) {
      onSelectedCompaniesChange([...selectedCompanies, companyId])
    } else {
      onSelectedCompaniesChange(selectedCompanies.filter((id) => id !== companyId))
    }
  }

  const isAllSelected =
    paginatedCompanies.length > 0 && paginatedCompanies.every((company) => selectedCompanies.includes(company.id))

  return (
    <div className="space-y-4">
      {/* Batch Actions */}
      {selectedCompanies.length > 0 && (
        <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
          <span className="text-sm font-medium text-blue-900">{selectedCompanies.length} company(ies) selected</span>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700"
                          onClick={async () => {
              await Promise.all(selectedCompanies.map((comp) => onDeleteCompany(comp)))
                  onSelectedCompaniesChange([])
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
                <Checkbox checked={isAllSelected} onCheckedChange={handleSelectAll} aria-label="Select all companies" />
              </TableHead>
              <TableHead>Company</TableHead>
              <TableHead>OIB</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Updated</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedCompanies.map((company) => (
              <TableRow key={company.id} className="hover:bg-gray-50">
                <TableCell>
                  <Checkbox
                    checked={selectedCompanies.includes(company.id)}
                    onCheckedChange={(checked) => handleSelectCompany(company.id, checked as boolean)}
                    aria-label={`Select ${company.companyName}`}
                  />
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage alt={company.companyName} />
                      <AvatarFallback>
                        <Building2 className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium text-gray-900">{company.companyName}</div>
                      <div className="text-sm text-gray-500">ID: {company.id}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary" className="font-mono text-xs">
                    {(company.oib)}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm text-gray-500">{formatDate(company.createdAt)}</TableCell>
                <TableCell className="text-sm text-gray-500">{formatDate(company.updatedAt)}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onViewCompany(company)}>
                        <Eye className="mr-2 h-4 w-4" />
                        View
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onEditCompany(company)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onDeleteCompany(company.id)} className="text-red-600">
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
        {paginatedCompanies.map((company) => (
          <div key={company.id} className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3 flex-1">
                <Checkbox
                  checked={selectedCompanies.includes(company.id)}
                  onCheckedChange={(checked) => handleSelectCompany(company.id, checked as boolean)}
                  aria-label={`Select ${company.companyName}`}
                />
                <Avatar className="h-10 w-10">
                  <AvatarImage alt={company.companyName} />
                  <AvatarFallback>
                    <Building2 className="h-5 w-5" />
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-gray-900 truncate">{company.companyName}</div>
                  <div className="text-sm text-gray-500 truncate">OIB: {company.oib}</div>
                  <div className="flex items-center space-x-2 mt-2">
                    <Badge variant="secondary" className="text-xs">
                      ID: {company.id}
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
                  <DropdownMenuItem onClick={() => onViewCompany(company)}>
                    <Eye className="mr-2 h-4 w-4" />
                    View
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onEditCompany(company)}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onDeleteCompany(company.id)} className="text-red-600">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className="mt-2 text-xs text-gray-500">
              Created: {formatDate(company.createdAt)} • Updated: {formatDate(company.updatedAt)}
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-3 bg-white border border-gray-200 rounded-lg">
          <div className="text-sm text-gray-700">
            Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, companies.length)}{" "}
            of {companies.length} results
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
