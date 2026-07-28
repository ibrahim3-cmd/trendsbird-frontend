export enum PaymentFailureReason {
  INSUFFICIENT_FUNDS = "INSUFFICIENT_FUNDS",
  CARD_DECLINED = "CARD_DECLINED",
  EXPIRED_CARD = "EXPIRED_CARD",
  INVALID_CARD = "INVALID_CARD",
  AUTHENTICATION_FAILED = "AUTHENTICATION_FAILED",
  PROCESSING_ERROR = "PROCESSING_ERROR",
  FRAUD_DETECTED = "FRAUD_DETECTED",
  NETWORK_ERROR = "NETWORK_ERROR",
  GATEWAY_ERROR = "GATEWAY_ERROR",
  UNKNOWN = "UNKNOWN",
}

export enum PaymentFailureSource {
  SUBSCRIPTION_RENEWAL = "SUBSCRIPTION_RENEWAL",
  PLAN_PURCHASE = "PLAN_PURCHASE",
  PLAN_CHANGE = "PLAN_CHANGE",
  CREDIT_PURCHASE = "CREDIT_PURCHASE",
  JOB_PAYMENT = "JOB_PAYMENT",
  INVOICE_PAYMENT = "INVOICE_PAYMENT",
  OTHER = "OTHER",
}

export interface IPaymentFailedLog {
  _id: string;
  org: {
    _id: string;
    orgName: string;
    orgEmail: string;
  };
  user?: {
    _id: string;
    name: string;
    email: string;
  };
  source: PaymentFailureSource;
  failureReason: PaymentFailureReason;
  amount: number;
  currency: string;
  paymentMethodId?: string;
  transactionId?: string;
  stripeErrorCode?: string;
  stripeErrorMessage?: string;
  errorDetails: string;
  metadata?: {
    planId?: string;
    planName?: string;
    creditAmount?: number;
    invoiceId?: string;
    jobId?: string;
    [key: string]: any;
  };
  attemptCount?: number;
  isResolved: boolean;
  resolvedAt?: string;
  resolvedBy?: {
    _id: string;
    name: string;
    email: string;
  };
  resolutionNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentFailedLogQuery {
  page?: number;
  limit?: number;
  search?: string;
  source?: PaymentFailureSource | "ALL";
  failureReason?: PaymentFailureReason | "ALL";
  isResolved?: boolean | "ALL";
  orgId?: string;
  userId?: string;
  startDate?: string;
  endDate?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  minAmount?: number;
  maxAmount?: number;
}

export interface PaymentFailedLogStats {
  totalFailures: number;
  unresolvedFailures: number;
  resolvedFailures: number;
  totalFailedAmount: number;
  failuresByReason: Array<{
    _id: PaymentFailureReason;
    count: number;
    totalAmount: number;
  }>;
  failuresBySource: Array<{
    _id: PaymentFailureSource;
    count: number;
    totalAmount: number;
  }>;
  recentFailures: Array<{
    date: string;
    count: number;
    amount: number;
  }>;
}

export interface UpdatePaymentFailedLogInput {
  isResolved?: boolean;
  resolvedBy?: string;
  resolutionNotes?: string;
  attemptCount?: number;
}
