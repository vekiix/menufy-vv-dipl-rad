import { Order, TableWithOrders } from "../models/Orders";

export interface OrdersResponse {
  orders: Order[]
}

export interface ActiveOrdersResponse {
  tables: TableWithOrders[]
}