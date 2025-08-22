"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Search, Filter, List, Package, Eye } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
import { MenuCategoryTable } from "./menu-category-table"
import { AllCategoriesTable } from "./all-categories-table"
import { AllItemsTable } from "./all-items-table"
import { MenuPreview } from "./menu-preview"
import { AddCategoryToMenuModal } from "./add-category-to-menu-modal"
import { CategoryFormModal } from "./category-form-modal"
import { ItemFormModal } from "./item-form-modal"
import { ManageCategoryItemsModal } from "./manage-category-items-modal"
import { MenuItem } from "@/lib/models/MenuItem"
import { MenuCategory } from "@/lib/models/MenuCategory"
import { Menu } from "@/lib/models/Menu"
import { addCategoryToMenu, createMenuCategory, createMenuItem, deleteCategory, deleteMenuItem, getCompanyCategories, getCompanyItems, getCompanyMenu, removeCategoryFromMenu, updateMenuCategory, updateMenuItem } from "@/lib/services/menu-service"
import { CreateItemRequest } from "@/lib/req/CreateItemRequest"
import { useToast } from "../providers/toast-provider"
import { CreateCategoryRequest } from "@/lib/req/CreateCategoryRequest"

export function MenuManagementPage() {

  const {showToast} = useToast();

  const fetchMenu = async () => {
      setIsLoading(true)
      try {
        const companyMenu = await getCompanyMenu()
        setMenu(companyMenu);
      } catch (error) {
        showToast(`Error occured while fetching menu. ${error}`,"error");
      }
      setIsLoading(false)
  };
  const fetchCategories= async () => {
      setIsLoading(true)

      try {
        const companyCategories = await getCompanyCategories()
        setAllCategories(companyCategories)
      } catch (error) {
        showToast(`Error occured while fetching categories. ${error}`,"error");
      }

      setIsLoading(false)
  };
    const fetchItems = async () => {
      setIsLoading(true)

      try {
        const companyItems  = await getCompanyItems()
        setAllItems(companyItems)
      } catch (error) {
        showToast(`Error occured while fetching items. ${error}`,"error");
      }
      setIsLoading(false)
  };

  useEffect(() => {
    
    fetchCategories()
    fetchItems()
    fetchMenu();
  }, []);
  
  const [menu, setMenu] = useState<Menu>({
      id: "",
      categories: []
  })

  const [isLoading, setIsLoading] = useState(true)

  const [allCategories, setAllCategories] = useState<MenuCategory[]>([])
  const [allItems, setAllItems] = useState<MenuItem[]>([])
  const [activeTab, setActiveTab] = useState("menu")

  // Menu tab state
  const [selectedMenuCategories, setSelectedMenuCategories] = useState<string[]>([])
  const [menuSearchTerm, setMenuSearchTerm] = useState("")
  const [isAddCategoryToMenuModalOpen, setIsAddCategoryToMenuModalOpen] = useState(false)

  // Categories tab state
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [categorySearchTerm, setCategorySearchTerm] = useState("")
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<MenuCategory | null>(null)
  const [viewingCategory, setViewingCategory] = useState<MenuCategory | null>(null)
  const [managingCategoryItems, setManagingCategoryItems] = useState<MenuCategory | null>(null)

  // Items tab state
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [itemSearchTerm, setItemSearchTerm] = useState("")
  const [isItemModalOpen, setIsItemModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null)
  const [viewingItem, setViewingItem] = useState<MenuItem | null>(null)

  // Filter functions
  const filteredMenuCategories = menu?.categories?.filter((category) =>
    category?.name.toLowerCase().includes(menuSearchTerm.toLowerCase()),
  ) ?? []

  const filteredAllCategories = allCategories?.filter((category) =>
    category?.name.toLowerCase().includes(categorySearchTerm.toLowerCase()),
  ) ?? []

  const filteredAllItems = allItems?.filter(
    (item) =>
      item?.name.toLowerCase().includes(itemSearchTerm.toLowerCase()) ||
      item?.description.toLowerCase().includes(itemSearchTerm.toLowerCase()),
  ) ?? []

  // Menu management functions
  const handleAddCategoryToMenu = () => {
    setIsAddCategoryToMenuModalOpen(true)
  }

  const handleRemoveCategoryFromMenu = async (categoryId: string) => {
    try{
      const updatedMenu = await removeCategoryFromMenu(categoryId)
      setMenu(updatedMenu)
      showToast(`Category has successfully been removed from the menu`, "success")
    }
    catch(error){
      showToast(`There was an error while removing a category from the menu. ${error}`, "error")
    }
  }

  const handleSaveCategoriesToMenu = async (categoryIds: string[]) => {
    const categoriesToAdd = allCategories.filter((cat) => categoryIds.includes(cat.id));
    const existingCategoryIds = menu?.categories.map((cat) => cat.id) ?? [];
    const newCategories = categoriesToAdd.filter((cat) => !existingCategoryIds.includes(cat.id));
    console.log(newCategories)
    try {
      // Fetch all new categories to add in parallel
      const updatedMenus = await Promise.all(
        newCategories.map(async (category) => 
          {
            console.log('category', category)
            return await addCategoryToMenu(category.id)
          })
      );
      console.log('updatedMenus', updatedMenus)
      // Get the latest version of the last updated menu (assuming all return a full menu object)
      const lastMenu = updatedMenus[updatedMenus.length - 1];

      // Option 1 (if each `addCategoryToMenu` returns full menu): use the last menu
      // Option 2 (if each returns only the added category): manually merge into current menu
      setMenu(lastMenu); // Adjust this depending on what your API returns

      showToast(`Successfully added ${newCategories.length} categor${newCategories.length === 1 ? "y" : "ies"} to the menu`, "success");
    } catch (error) {
      console.error(error);
      showToast(`There was an error while adding categories to the menu. ${error}`, "error");
    } finally {
      setIsAddCategoryToMenuModalOpen(false);
    }
  };


  // Category management functions
  const handleAddCategory = () => {
    setEditingCategory(null)
    setViewingCategory(null)
    setIsCategoryModalOpen(true)
  }

  const handleEditCategory = (category: MenuCategory) => {
    setEditingCategory(category)
    setViewingCategory(null)
    setIsCategoryModalOpen(true)
  }

  const handleViewCategory = (category: MenuCategory) => {
    setViewingCategory(category)
    setEditingCategory(null)
    setIsCategoryModalOpen(true)
  }

  const handleManageCategoryItems = (category: MenuCategory) => {
    setManagingCategoryItems(category)
  }

  const handleDeleteCategory = async (categoryId: string) => {
    // Remove from all categories
    try{
      const updatedCategories = await deleteCategory(categoryId)
      setAllCategories(updatedCategories)
      // Also remove from menu if it's there
      showToast(`Category has successfully been deleted`, "success")
    }
    catch(error){
      showToast(`There was an error while deleting a category. ${error}`, "error")
    }

  }

  const handleSaveCategory = async (categoryData: Partial<MenuCategory>) => {
    
    const categoryReq: CreateCategoryRequest = {
      name: categoryData.name || "",
      image: categoryData.image || ""
    }
    try{
      if (editingCategory) {
        const updatedCategory = await updateMenuCategory(editingCategory.id || "",categoryReq)
        const updatedAllCategories = allCategories.map((category) =>
          category.id === updatedCategory.id ? updatedCategory : category
        )
        setAllCategories(updatedAllCategories)
        const updatedMenuCategories = menu?.categories.map((category) =>
          category.id === editingCategory.id ? { ...category, ...updatedCategory } : category,
        )
        setMenu({ ...menu, categories: updatedMenuCategories ?? [] })
        showToast(`Category ${editingCategory.name} has successfully been updated`, "success")
      } else {
        const categories = await createMenuCategory(categoryReq);
        setAllCategories(categories)
        showToast(`Category has successfully been created`, "success")
      }
      setIsCategoryModalOpen(false)
      setEditingCategory(null)
    }catch (error){
      showToast(`There was an error while ${editingItem? "updating": "creating"} a category. ${error}`, "error")
    }

  }

  const handleUpdateCategoryItems = (updatedCategory:MenuCategory) => {
    // Replace category in allCategories
    const updatedAllCategories = allCategories.map((category) =>
      category.id === updatedCategory.id ? updatedCategory : category
    )
    setAllCategories(updatedAllCategories)

    // Replace items in menu.categories if category exists
    const updatedMenuCategories = menu?.categories.map((category) =>
      category.id === updatedCategory.id
        ? { ...category, items: updatedCategory.items }
        : category
    )
    setMenu({ ...menu, categories: updatedMenuCategories ?? [] })
  }

  // Item management functions
  const handleAddItem = () => {
    setEditingItem(null)
    setViewingItem(null)
    setIsItemModalOpen(true)
  }

  const handleEditItem = (item: MenuItem) => {
    setEditingItem(item)
    setViewingItem(null)
    setIsItemModalOpen(true)
  }

  const handleViewItem = (item: MenuItem) => {
    setViewingItem(item)
    setEditingItem(null)
    setIsItemModalOpen(true)
  }

  const handleDeleteItem = async (itemId: string) => {
    try{
      const items = await deleteMenuItem(itemId);
      setAllItems(items)

      // Remove from all categories
      const updatedCategories = allCategories?.map((category) => ({
        ...category,
        items: category.items.filter((item) => item.id !== itemId),
      }))
      setAllCategories(updatedCategories)

      // Remove from menu categories
      const updatedMenuCategories = menu?.categories.map((category) => ({
        ...category,
        items: category.items.filter((item) => item.id !== itemId),
      }))
      setMenu({ ...menu, categories: updatedMenuCategories })
      showToast(`Item has successfully been deleted`, "success")
    }catch (error){
      showToast(`There was an error while deleting an item ${error}`, "error")
    }
    
  }

  const handleSaveItem = async (itemData: Partial<MenuItem>) => {
      const itemReq: CreateItemRequest = {
        name: itemData.name || "",
        description: itemData.description || "",
        portion: itemData.portion || "",
        price: itemData.price || 0,
        image: itemData.image || "",
      }
  try{
   if (editingItem) {
      // Update existing item
      const updatedItem = await updateMenuItem(editingItem.id || "", itemReq)

      const updatedItems = allItems?.map((item) => (item.id === editingItem.id ? { ...item, ...updatedItem } : item))
      setAllItems(updatedItems)

      // Update in categories and menu
      const updatedCategories = allCategories.map((category) => ({
        ...category,
        items: category.items.map((item) => (item.id === editingItem.id ? { ...item, ...updatedItem } : item)),
      }))
      setAllCategories(updatedCategories)

      const updatedMenuCategories = menu?.categories.map((category) => ({
        ...category,
        items: category.items.map((item) => (item.id === editingItem.id ? { ...item, ...updatedItem } : item)),
      }))
      setMenu({ ...menu, categories: updatedMenuCategories ?? [] })
      } else {
      // Add new item
        const item = await createMenuItem(itemReq);
        setAllItems([...allItems, item])
      }
      showToast(`Successfully ${editingItem ? "updated": "created"} item.`,"success")
      setIsItemModalOpen(false)
      setEditingItem(null)
  } catch(error){
    showToast(`There was an error while ${editingItem ? "updating": "creating"} item. ${error}`,"error");
  }
 
  }

  return (
      <div className="w-full">
        {/* Desktop/Tablet Sidebar */}

        {/* Main Content */}
        <main className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-white border-b border-gray-200 px-4 py-4 sm:px-6 lg:px-8">
            <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Menu Management</h1>
                <p className="text-sm text-gray-600 mt-1">Manage restaurant menu, categories, and items</p>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex-1 flex flex-col overflow-hidden">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden">
              <div className="border-b border-gray-200 px-4 sm:px-6 lg:px-8">
                <TabsList className="grid w-full max-w-lg grid-cols-4">
                  <TabsTrigger value="menu" className="flex items-center space-x-2">
                    <List className="h-4 w-4" />
                    <span className="hidden sm:inline">Menu</span>
                  </TabsTrigger>
                  <TabsTrigger value="categories" className="flex items-center space-x-2">
                    <Package className="h-4 w-4" />
                    <span className="hidden sm:inline">Categories</span>
                  </TabsTrigger>
                  <TabsTrigger value="items" className="flex items-center space-x-2">
                    <Plus className="h-4 w-4" />
                    <span className="hidden sm:inline">Items</span>
                  </TabsTrigger>
                  <TabsTrigger value="preview" className="flex items-center space-x-2">
                    <Eye className="h-4 w-4" />
                    <span className="hidden sm:inline">Preview</span>
                  </TabsTrigger>
                </TabsList>
              </div>

          {!isLoading && (
              <TabsContent value="menu" className="flex-1 flex flex-col overflow-hidden">
                <div className="px-4 py-4 sm:px-6 lg:px-8 border-b border-gray-200">
                  <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
                    <div className="relative flex-1 max-w-md">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Search menu categories..."
                        value={menuSearchTerm}
                        onChange={(e) => setMenuSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Filter className="h-4 w-4 mr-2" />
                        Filters
                      </Button>
                      <Button
                        onClick={handleAddCategoryToMenu}
                        className="bg-blue-600 hover:bg-blue-700 hidden sm:inline-flex"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Categories
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
                  <MenuCategoryTable
                    categories={filteredMenuCategories}
                    selectedCategories={selectedMenuCategories}
                    onSelectedCategoriesChange={setSelectedMenuCategories}
                    onRemoveFromMenu={handleRemoveCategoryFromMenu}
                  />
                </div>
              </TabsContent>
            )}

              {/* Categories Tab */}
              <TabsContent value="categories" className="flex-1 flex flex-col overflow-hidden">
                <div className="px-4 py-4 sm:px-6 lg:px-8 border-b border-gray-200">
                  <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
                    <div className="relative flex-1 max-w-md">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Search categories..."
                        value={categorySearchTerm}
                        onChange={(e) => setCategorySearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Filter className="h-4 w-4 mr-2" />
                        Filters
                      </Button>
                      <Button onClick={handleAddCategory} className="bg-blue-600 hover:bg-blue-700 hidden sm:inline-flex">
                        <Plus className="h-4 w-4 mr-2 " />
                        Add Category
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
                  <AllCategoriesTable
                    categories={filteredAllCategories}
                    selectedCategories={selectedCategories}
                    onSelectedCategoriesChange={setSelectedCategories}
                    onEditCategory={handleEditCategory}
                    onViewCategory={handleViewCategory}
                    onManageItems={handleManageCategoryItems}
                    onDeleteCategory={handleDeleteCategory}
                    menuCategoryIds={menu?.categories.map((cat) => cat.id) ?? []}
                  />
                </div>
              </TabsContent>

              {/* Items Tab */}
              <TabsContent value="items" className="flex-1 flex flex-col overflow-hidden">
                <div className="px-4 py-4 sm:px-6 lg:px-8 border-b border-gray-200">
                  <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
                    <div className="relative flex-1 max-w-md">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Search items..."
                        value={itemSearchTerm}
                        onChange={(e) => setItemSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Filter className="h-4 w-4 mr-2" />
                        Filters
                      </Button>
                      <Button onClick={handleAddItem} className="bg-blue-600 hover:bg-blue-700 hidden sm:inline-flex">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Item
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
                  <AllItemsTable
                    items={filteredAllItems}
                    selectedItems={selectedItems}
                    onSelectedItemsChange={setSelectedItems}
                    onEditItem={handleEditItem}
                    onViewItem={handleViewItem}
                    onDeleteItem={handleDeleteItem}
                    allCategories={allCategories}
                  />
                </div>
              </TabsContent>

              {/* Preview Tab */}
              <TabsContent value="preview" className="flex-1 flex flex-col overflow-hidden">
                <div className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
                  <MenuPreview menu={menu} />
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Mobile FAB */}
          <div className="fixed bottom-20 right-4 sm:hidden">
            {activeTab === "menu" && (
              <Button
                onClick={handleAddCategoryToMenu}
                size="lg"
                className="h-14 w-14 rounded-full bg-blue-600 hover:bg-blue-700 shadow-lg"
              >
                <Plus className="h-6 w-6" />
              </Button>
            )}
            {activeTab === "categories" && (
              <Button
                onClick={handleAddCategory}
                size="lg"
                className="h-14 w-14 rounded-full bg-blue-600 hover:bg-blue-700 shadow-lg"
              >
                <Plus className="h-6 w-6" />
              </Button>
            )}
            {activeTab === "items" && (
              <Button
                onClick={handleAddItem}
                size="lg"
                className="h-14 w-14 rounded-full bg-blue-600 hover:bg-blue-700 shadow-lg"
              >
                <Plus className="h-6 w-6" />
              </Button>
            )}
          </div>
        </main>


        {/* Modals */}
        <AddCategoryToMenuModal
          isOpen={isAddCategoryToMenuModalOpen}
          onClose={() => setIsAddCategoryToMenuModalOpen(false)}
          onSave={handleSaveCategoriesToMenu}
          availableCategories={allCategories}
          currentMenuCategoryIds={menu?.categories.map((cat) => cat.id) ?? []}
        />

        <CategoryFormModal
          isOpen={isCategoryModalOpen}
          onClose={() => {
            setIsCategoryModalOpen(false)
            setEditingCategory(null)
            setViewingCategory(null)
          }}
          onSave={handleSaveCategory}
          category={editingCategory}
          viewOnly={!!viewingCategory}
          initialData={viewingCategory || editingCategory}
        />

        <ItemFormModal
          isOpen={isItemModalOpen}
          onClose={() => {
            setIsItemModalOpen(false)
            setEditingItem(null)
            setViewingItem(null)
          }}
          onSave={handleSaveItem}
          item={editingItem}
          viewOnly={!!viewingItem}
          initialData={viewingItem || editingItem}
        />

        {managingCategoryItems && (
          <ManageCategoryItemsModal
            isOpen={!!managingCategoryItems}
            onClose={() => setManagingCategoryItems(null)}
            category={managingCategoryItems}
            availableItems={allItems || []}
            onUpdateItems={(category:MenuCategory) => handleUpdateCategoryItems(category)}
          />
        )}
      </div>
  )
}

