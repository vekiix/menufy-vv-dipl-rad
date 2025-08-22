export interface Payment{
  id: string;
  companyId: string;
  merchantTransaction: string; 
  createdAt: string;
  paidAt?: string | null;
  paymentAmount: number;
  status: 'PENDING' | 'ACCEPTED';
  orderId: string;
  paymentType: 'WS_PAY' | 'KEKS_PAY' | "" ; // prilagodi prema enumu iz backenda
}
