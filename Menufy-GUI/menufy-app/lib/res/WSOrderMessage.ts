
export interface WSOrderMessage {
    orderId: string,
    companyId: string,
    newOrderStatus:    "ORDERED" | "REJECTED" | "IN_PROGRESS"| "DELIVERED" | "PAID"
}