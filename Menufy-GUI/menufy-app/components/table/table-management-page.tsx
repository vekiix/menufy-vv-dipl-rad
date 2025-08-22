"use client"

import { useEffect, useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Search, Utensils } from "lucide-react"
import { TableFormModal } from "./table-form-modal"
import { TableTable } from "./table-table"
import { createTable, deleteTable, getAllTables, updateTable } from "@/lib/services/auth-service"
import { useToast } from "../providers/toast-provider"
import { Table } from "@/lib/models/Table"
import { CreateTableRequest } from "@/lib/req/CreateTableRequest"
import { DataStatusView } from "@/components/ui/data-status-view"


export function TableManagementPage() {
  const { showToast } = useToast();

  const [isLoading, setIsLoading ] = useState(true)
  const [isOperationLoading, setIsOperationLoading] = useState(false)
  const [tables, setTables] = useState<Table[]>([])
  const [selectedTables, setSelectedTables] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingTable, setEditingTable] = useState<Table | null>(null)
  const [viewingTable, setViewingTable] = useState<Table | null>(null)

  const fetchTables = useCallback(async () => {
    setIsLoading(true)
    try {
      const fetchedTables = await getAllTables();
      setTables(fetchedTables);
    } catch (error) {
      showToast(`Error occurred while fetching tables. ${error}`,"error");
    }
    setIsLoading(false)
  }, [showToast]);

  useEffect(() => {
    fetchTables();
  }, [fetchTables]);

  const filteredTables = tables.filter(
    (table) =>
      table.uid.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (table.tableName && table.tableName.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  const handleAddTable = useCallback(() => {
    setEditingTable(null)
    setViewingTable(null)
    setIsModalOpen(true)
  }, []);

  const handleEditTable = useCallback((table: Table) => {
    setEditingTable(table)
    setViewingTable(null)
    setIsModalOpen(true)
  }, []);

  const handleViewTable = useCallback((table: Table) => {
    setViewingTable(table)
    setEditingTable(null)
    setIsModalOpen(true)
  }, []);

  const handleDeleteTable = useCallback(async (tableUid: string) => {
    setIsOperationLoading(true)
    try{
      setTables(await deleteTable(tableUid))
      setSelectedTables(prev => prev.filter((uid) => uid !== tableUid))
      showToast(`A table with UID: '${tableUid}' has successfully been deleted.`, "success");
    } catch(error){
      showToast(`Error while deleting a table. ${error}`, "error");
    } finally {
      setIsOperationLoading(false)
    }
  }, [showToast]);

  const handleSaveTable = useCallback(async (tableData: Partial<Table>) => {
    setIsOperationLoading(true)
    try {
      if (editingTable) {
        const updatedTable: CreateTableRequest = {
          tableName: tableData.tableName || ""
        }

        const userObject = await updateTable(editingTable.uid, updatedTable);
        setTables(prev => prev.map((t) => (t.uid === editingTable.uid ? { ...t, ...userObject} : t)))
        showToast(`Table with UID: '${editingTable.uid}' successfully updated`, "success");
        setIsModalOpen(false)
        setEditingTable(null)
      } else {
        // Add new table
        const tableObject: CreateTableRequest = {
          tableName: tableData.tableName || "",
          uid: tableData.uid || ""
        }
        const table = await createTable(tableObject);
        setTables(prev => [...prev, table])
        showToast(`New table has successfully been created.`, "success");
        setIsModalOpen(false)
        setEditingTable(null)
      }
    } catch(err){
      showToast(`Error while ${editingTable ? 'updating' : 'creating'} a table. ${err}`, "error");
    } finally {
      setIsOperationLoading(false)
    }
  }, [editingTable, showToast]);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false)
    setEditingTable(null)
    setViewingTable(null)
  }, []);

  return (
    
      <div className=" min-h-screen w-full bg-gray-50">
        {/* Main Content */}
        <main className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-white border-b border-gray-200 px-4 py-4 sm:px-6 lg:px-8">
            <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Table Management</h1>
                <p className="text-sm text-gray-600 mt-1">Manage restaurant tables, capacity, and availability</p>
              </div>

              {/* Desktop Actions */}
              <div className="hidden sm:flex items-center space-x-3">
                <Button 
                  onClick={handleAddTable} 
                  disabled={isOperationLoading}
                  className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Table
                </Button>
              </div>
            </div>

            {/* Search and Filters */}
            <div className="mt-4 flex flex-col space-y-3 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-3">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search tables..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>

          {/* Table Table */}
          <DataStatusView 
            isLoading={isLoading} 
            hasData={tables.length > 0}
            loadingTitle="Loading tables..."
            loadingMessage="Please wait while we fetch your tables."
            errorTitle="No tables available"
            errorMessage="Unable to load tables."
            errorIcon={Utensils}
          />
          
          {!isLoading && tables.length > 0 && (
            <div className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
              <TableTable
                tables={filteredTables}
                selectedTables={selectedTables}
                onSelectedTablesChange={setSelectedTables}
                onEditTable={handleEditTable}
                onViewTable={handleViewTable}
                onDeleteTable={handleDeleteTable}
                isOperationLoading={isOperationLoading}
              />
            </div>
          )}

          {/* Mobile FAB */}
          <div className="fixed bottom-20 right-4 sm:hidden">
            <Button
              onClick={handleAddTable}
              disabled={isOperationLoading}
              size="lg"
              className="h-14 w-14 rounded-full bg-blue-600 hover:bg-blue-700 shadow-lg disabled:opacity-50"
            >
              <Plus className="h-6 w-6" />
            </Button>
          </div>
        </main>
        
        {/* Table Form Modal */}
        <TableFormModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSave={handleSaveTable}
          table={editingTable}
          viewOnly={!!viewingTable}
          initialData={viewingTable || editingTable}
          isLoading={isOperationLoading}
        />
      </div>
  )
}
