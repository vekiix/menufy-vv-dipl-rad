
// Types based on the JSON structure
export interface OrderItem {
  id: string
  companyId: string
  name: string
  price: number
}

export interface OrderLine {
  item: OrderItem
  quantity: number
}

export interface CreateOrderLine {
  item: string
  quantity: number
}

export interface Order {
  id: string
  tableId: string
  companyId: string
  status: OrderStatus
  transactionToken: string | null
  createdAt: string
  paidAt: string | null
  deliveredAt: string | null
  lines: OrderLine[]
  totalPrice: number
}

export enum OrderStatus {
  ORDERED = "ORDERED",
  IN_PROGRESS = "IN_PROGRESS",
  DELIVERED = "DELIVERED",
  PAID = "PAID",
  REJECTED = "REJECTED"
}

export interface TableWithOrders {
  companyId: string
  uid: string
  name: string
  activeOrders: Order[]
}
