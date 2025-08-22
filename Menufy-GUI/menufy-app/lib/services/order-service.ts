import { CreateOrderLine, Order, TableWithOrders } from "../models/Orders";
import { FilterOrderRequest } from "../req/FilterOrdersRequest";
import axiosInstance from "./axios";
import { OrdersResponse, ActiveOrdersResponse } from "../res/OrdersResponse";


export const getPendingOrders = async (): Promise<Order[]> => {
    const response = await axiosInstance.get<OrdersResponse>("/order/pending")
    return response.data.orders;
}

export const getOrdersForTable = async (): Promise<Order[]>  => {
    const response = await axiosInstance.get<OrdersResponse>("/order/table")
    return response.data.orders;
}

export const getActiveOrders = async (): Promise<TableWithOrders[]> => {
    const response = await axiosInstance.get<ActiveOrdersResponse>("/order/active")
    return response.data.tables;
}

export const getOrdersFiltered = async (parameters: object, reqBody: FilterOrderRequest): Promise<Order[]> => {
    const response = await axiosInstance.post<OrdersResponse>("/order/filter", reqBody, {
        params: {...parameters}
    });
    return response.data.orders;
}

export const createOrder = async (order: CreateOrderLine[]): Promise<Order> => {
    const response = await axiosInstance.post<Order>("/order", order);
    return response.data;
}

export const rejectPendingOrder = async (orderId:string): Promise<TableWithOrders[]> => {
    const response = await axiosInstance.get<ActiveOrdersResponse>("/order/reject", {
        params: {
            order: orderId
        }
    })
    return response.data.tables;
}
export const acceptPendingOrder = async (orderId:string): Promise<TableWithOrders[]> => {
    const response = await axiosInstance.get<ActiveOrdersResponse>("/order/accept", {
    params: {
        order: orderId
    }
    })
    return response.data.tables;
}

export const deliverActiveOrder = async (orderId:string): Promise<TableWithOrders[]> => {
    const response = await axiosInstance.get<ActiveOrdersResponse>("/order/deliver", {
    params: {
        order: orderId
    }
    })
    return response.data.tables;
}

export const markOrderAsPaid = async (orderId:string): Promise<TableWithOrders[]> => {
    const response = await axiosInstance.get<ActiveOrdersResponse>("/order/pay", {
    params: {
        order: orderId
    }
    })
    return response.data.tables;
}
