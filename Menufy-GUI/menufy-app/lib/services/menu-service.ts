import { Menu } from "../models/Menu";
import { MenuCategory } from "../models/MenuCategory";
import { MenuItem } from "../models/MenuItem";
import { CreateCategoryRequest } from "../req/CreateCategoryRequest";
import { CreateItemRequest } from "../req/CreateItemRequest";
import { CategoriesResponse } from "../res/CategoriesResponse";
import { CategoryResponse } from "../res/CategoryResponse";
import { ItemResponse } from "../res/ItemResponse";
import { ItemsResponse } from "../res/ItemsResponse";
import { MenuResponse } from "../res/MenuResponse";
import axiosInstance from "./axios";

export const getCompanyMenu = async (): Promise<Menu> => {
    const response = await axiosInstance.get<MenuResponse>("/menu")
    return response.data.menu;
}

export const getCompanyCategories = async (): Promise<MenuCategory[]> => {
    const response = await axiosInstance.get<CategoriesResponse>("/category")
    return response.data.categories;
}

export const getCompanyItems = async (): Promise<MenuItem[]> => {
    const response = await axiosInstance.get<ItemsResponse>("/item")
    return response.data.items;
}

export const deleteMenuItem = async (itemId: string): Promise<MenuItem[]> => {
    const response = await axiosInstance.delete<ItemsResponse>("/item", {
        params: {
            item: itemId
        }
    })
    return response.data.items;
}

export const createMenuItem = async (itemReq : CreateItemRequest): Promise<MenuItem> => {
    const response = await axiosInstance.post<ItemResponse>("/item",itemReq)
    return response.data.item;
}

export const updateMenuItem = async (itemId: string, itemReq : CreateItemRequest): Promise<MenuItem> => {
    const response = await axiosInstance.put<ItemResponse>("/item", itemReq, {
        params: {
            item: itemId
        }
    })
    return response.data.item;
}

export const createMenuCategory = async (categoryReq: CreateCategoryRequest): Promise<MenuCategory[]> => {
    const response = await axiosInstance.post<CategoriesResponse>("/category", categoryReq)
    return response.data.categories;
}

export const updateMenuCategory = async (categoryId: string ,categoryReq: CreateCategoryRequest): Promise<MenuCategory> => {
    const response = await axiosInstance.put<CategoryResponse>("/category", categoryReq,{
        params: {
            category: categoryId
        }
    })
    return response.data.category;
}

export const deleteCategory = async (categoryId: string): Promise<MenuCategory[]> => {
    const response = await axiosInstance.delete<CategoriesResponse>("/category", {
        params: {
            category: categoryId
        }
    })
    return response.data.categories;
}

export const addMenuItemToCategory = async (itemId: string, categoryId: string):Promise<MenuCategory> => {
    const response = await axiosInstance.get<CategoryResponse>("/category/add",{
        params: {
            category: categoryId,
            item: itemId
        }
    });

    return response.data.category;
}

export const removeItemFromCategory = async (itemId: string, categoryId: string):Promise<MenuCategory> => {
    const response = await axiosInstance.get<CategoryResponse>("/category/remove",{
        params: {
            category: categoryId,
            item: itemId
        }
    });

    return response.data.category;
}

export const removeCategoryFromMenu = async (categoryId: string):Promise<Menu> => {
    const response = await axiosInstance.get<MenuResponse>("/menu/remove",{
        params: {
            category: categoryId
        }
    });

    return response.data.menu;
}

export const addCategoryToMenu = async (categoryId: string):Promise<Menu> => {
    const response = await axiosInstance.get<MenuResponse>("/menu/add",{
        params: {
            category: categoryId
        }
    });

    return response.data.menu;
}

