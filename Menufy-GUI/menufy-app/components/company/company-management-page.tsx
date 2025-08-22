"use client"

import { useEffect, useState } from "react"
import { CreateCompanyRequest } from "@/lib/req/CreateCompanyRequest"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Search, Filter, Building2 } from "lucide-react"
import { CompanyTable } from "./company-table"
import { CompanyFormModal } from "./company-form-modal"
import { Company } from "@/lib/models/Company"
import { getAllCompanies, deleteCompany, updateCompany, createCompany } from "@/lib/services/auth-service"
import { useToast } from "../providers/toast-provider"
import { DataStatusView } from "@/components/ui/data-status-view"

export function CompanyManagementPage() {
  const [isLoading, setIsLoading] = useState(true)

  const [companies, setCompanies] = useState<Company[]>([])
  const [selectedCompanies, setSelectedCompanies] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingCompany, setEditingCompany] = useState<Company | null>(null)
  const [viewingCompany, setViewingCompany] = useState<Company | null>(null)

  const { showToast } = useToast();
  
  const fetchCompanies = async () => {
    setIsLoading(true)
    try {
      const fetchCompanies = await getAllCompanies();
      setCompanies(fetchCompanies);
    } catch (error) {
      showToast(`Error occured while fetching companies. ${error}`,"error");
    }
    setIsLoading(false)
  };
  useEffect(() => {
    fetchCompanies();
  }, []);

  const filteredCompanies = companies.filter(
    (company) =>
      company.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.oib.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleAddCompany = () => {
    setEditingCompany(null)
    setViewingCompany(null)
    setIsModalOpen(true)
  }

  const handleEditCompany = (company: Company) => {
    setEditingCompany(company)
    setViewingCompany(null)
    setIsModalOpen(true)
  }

  const handleViewCompany = (company: Company) => {
    setViewingCompany(company)
    setEditingCompany(null)
    setIsModalOpen(true)
  }

  const handleDeleteCompany = async (companyId: string) => {
    try{
      const companies = await deleteCompany(companyId);
      setCompanies(companies);
      showToast(`A company with ID: '${companyId}' has successfully been deleted.`, "success");
    } catch(error){
      showToast(`Error while deleting a company. ${error}`, "error");
    }
    setSelectedCompanies(selectedCompanies.filter((id) => id !== companyId))
  }

  const handleSaveCompany = async (companyData: Partial<Company>) => {
    if (editingCompany) {
      const updatedCompany : CreateCompanyRequest  = {
        companyName: companyData.companyName || "",
        oib: companyData.oib || "",
        logo: companyData.logo || "00000000000000000000000000000000",
        encryptionKey: companyData.encryptionKey || "00000000000000000000000000000000",
      }
      try{
        const companyObject = await updateCompany(editingCompany.id, updatedCompany);
        setCompanies(companies.map((company) => (company.id === editingCompany.id ? { ...company, ...companyObject} : company)))
        showToast(`Company with ID: '${editingCompany.id}' successfully updated`, "success");
        setIsModalOpen(false)
        setEditingCompany(null)
      }catch (err) {
        showToast(`There was an error while updating a company. ${err}`, "error");
      }   
    } else {
      // Add new company
      const newCompany: CreateCompanyRequest = {
        companyName: companyData.companyName || "",
        oib: companyData.oib || "",
        encryptionKey: companyData.encryptionKey || "00000000000000000000000000000000",
        logo: companyData.logo || "00000000000000000000000000000000",
      }
      try{
        await createCompany(newCompany).then(createdCompany => {
          setCompanies([...companies, createdCompany])
          showToast(`New company has successfully been created.`, "success");
          setIsModalOpen(false)
          setEditingCompany(null)
        })
      } catch(err){
        showToast(`Error while creating a company. ${err}`, "error");
      }
    }
  }

  return (
      <div className="flex min-h-screen w-full bg-gray-50">
        {/* Desktop/Tablet Sidebar */}

        {/* Main Content */}
        <main className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-white border-b border-gray-200 px-4 py-4 sm:px-6 lg:px-8">
            <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Company Management</h1>
                <p className="text-sm text-gray-600 mt-1">Manage company profiles, settings, and configurations</p>
              </div>

              {/* Desktop Actions */}
              <div className="hidden sm:flex items-center space-x-3">
                <Button onClick={handleAddCompany} className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Company
                </Button>
              </div>
            </div>

            {/* Search and Filters */}
            <div className="mt-4 flex flex-col space-y-3 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-3">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search companies..."
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

          {/* Company Table */}
            <DataStatusView 
              isLoading={isLoading} 
              hasData={companies.length > 0}
              loadingTitle="Loading companies..."
              loadingMessage="Please wait while we fetch your companies."
              errorTitle="No companies available"
              errorMessage="Unable to load companies."
              errorIcon={Building2}
            />
            
            {!isLoading && companies.length > 0 && (
              <div className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
                <CompanyTable
                  companies={filteredCompanies}
                  selectedCompanies={selectedCompanies}
                  onSelectedCompaniesChange={setSelectedCompanies}
                  onEditCompany={handleEditCompany}
                  onViewCompany={handleViewCompany}
                  onDeleteCompany={handleDeleteCompany}
                />
              </div>
            )}
          {/* Mobile FAB */}
          <div className="fixed bottom-20 right-4 sm:hidden">
            <Button
              onClick={handleAddCompany}
              size="lg"
              className="h-14 w-14 rounded-full bg-blue-600 hover:bg-blue-700 shadow-lg"
            >
              <Plus className="h-6 w-6" />
            </Button>
          </div>
        </main>

        {/* Company Form Modal */}
        <CompanyFormModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false)
            setEditingCompany(null)
            setViewingCompany(null)
          }}
          onSave={handleSaveCompany}
          company={editingCompany}
          viewOnly={!!viewingCompany}
          initialData={viewingCompany || editingCompany}
        />
      </div>
  )
}


