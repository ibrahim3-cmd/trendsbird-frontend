// types/payment.type.ts
export enum PaymentStatus {
  PENDING = "PENDING",
  SUCCESS = "SUCCESS",
  FAILED = "FAILED",
  REFUNDED = "REFUNDED",
}

export interface IPayment {
  _id: string;
  org: {
    _id: string;
    orgName: string;
    orgEmail: string;
  };
  plan: {
    _id: string;
    name: string;
    price: number;
    duration: string;
  };
  description: string;
  transactionId: string;
  invoiceId: string;
  amount: number;
  status: PaymentStatus;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentQuery {
  page?: number;
  limit?: number;
  search?: string;
  status?: PaymentStatus | "ALL";
  orgId?: string;
  sortBy?: string;
  type?: string;
  planId?: string;
  sortOrder?: "asc" | "desc";
  startDate?: string;
  endDate?: string;
}

export interface PaymentStats {
  totalRevenue: number;
  successfulPayments: number;
  pendingPayments: number;
  failedPayments: number;
  refundedAmount: number;
  monthlyRevenue: Array<{
    month: string;
    revenue: number;
    count: number;
  }>;
}

export interface PaginatedPayments {
  data: IPayment[];
  meta: {
    page: number;
    total: number;
    limit: number;
    totalPage: number;
  };
}

export interface CreatePaymentInput {
  org: string;
  plan: string;
  transactionId: string;
  invoiceId: string;
  amount: number;
  status?: PaymentStatus;
}

export interface UpdatePaymentInput {
  transactionId?: string;
  amount?: number;
  status?: PaymentStatus;
}