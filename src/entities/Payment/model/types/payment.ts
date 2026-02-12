export interface Payment {
    id: string;
    amount: number;
    currency: string;
    status: 'succeeded' | 'pending' | 'failed';
    createdAt: string;
    paymentMethod?: string;
    description?: string;
    receiptUrl?: string;
}

export interface PaymentListResponse {
    rows: Payment[];
    count: number;
}
