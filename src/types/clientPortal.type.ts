// types/client.type.ts

export interface IClientDashboardStats {
  totalJobs: number;
  completed: number;
  inProgress: number;
  upcoming: number;
  scheduled?: number;

  paymentSummary: {
    totalBilled: number;
    totalPaid: number;
    totalDue: number;
    upcomingPayments?: number;
    recentActualPayments?: Array<{
      jobTitle: string;
      jobId: string;
      amount: number;
      transactionId: string;
      paymentMethod: string;
      paidAt: string;
      refundAmount: number;
    }>;
    recentInvoices?: Array<{
      invoiceId: string;
      jobTitle: string;
      totalAmount: number;
      prePayAmount: number;
      dueAmount: number;
      paymentStatus: string;
      createdAt: string;
    }>;
  };

  // Signed documents (Estimate / Proposal)
  docSigned?: Array<{
    id: string;
    title?: string;
    status?: string;
    pdfUrl?: string;
    pdfFilename?: string;
    sentToReceiverAt?: string;
    signedAtByReceiver?: string;
    completedAt?: string;
    createdAt?: string;
  }>;

  // Pending documents
  docPending?: Array<{
    id: string;
    title?: string;
    status?: string;
    pdfUrl?: string;
    pdfFilename?: string;
    sentToReceiverAt?: string;
    signedAtByReceiver?: string;
    completedAt?: string;
    createdAt?: string;
  }>;
}

export interface IClientDocumentEntry {
  docId: string;
  status: string;
  approvalStatus?: string;
  html: string;
  pdfUrl?: string;
  pdfFilename?: string;
  signedAtBySender?: string;
  signedAtByReceiver?: string;
  sentToReceiverAt?: string;
  completedAt?: string;
}

export interface IClientPaymentsResponseMeta {
  page: number;
  limit: number;
  total: number;
  totalPage?: number;
}

import { IPayment } from "@/types/payment.type";

export interface IClientPaymentsResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: IPayment[];
  meta: IClientPaymentsResponseMeta;
}

// Client Job types
export interface IClientJobQuery {
  page?: number;
  limit?: number;
  searchTerm?: string;
  status?: string;
}

export interface IClientJobComputed {
  serviceCost: number;
  packageCost: number;
  leadEstimationCost: number;
  leadEstimationServicesCost: number;
  leadEstimationPackagesCost: number;
  totalCost: number;
  taskProgress: number;
  totalTasks: number;
  totalServices: number;
  totalPackages: number;
}

// Embedded service item in job (snapshotted cost data)
export interface IClientJobServiceItem {
  serviceId: string;
  name: string;
  category?: string;
  description?: string;
  quantity: number;
  unitCost: number;
  totalCost: number;
}

// Embedded package service item
export interface IClientJobPackageServiceItem {
  serviceId: string;
  name: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

// Embedded package item with snapshotted cost data
export interface IClientJobPackageItem {
  packageId: string;
  packageName: string;
  description?: string;
  serviceItems: IClientJobPackageServiceItem[];
  totalCost: number;
}

// Embedded lead estimation with snapshotted cost data
export interface IClientJobLeadEstimation {
  leadId: string;
  leadName?: string;
  leadEmail?: string;
  serviceItems: IClientJobServiceItem[];
  packageItems: IClientJobPackageItem[];
  totalCost: number;
}

export interface IClientTaskAssignee {
  _id: string;
  name?: string;
  email?: string;
  role?: string;
}

export interface IClientTaskItem {
  _id?: string;
  name?: string;
  description?: string;
  deadline?: string;
  progress?: number;
  status?: string;
  assignedTo?: IClientTaskAssignee[];
}

export interface IClientJobLead {
  _id?: string;
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  company?: string;
  stage?: string;
}

export interface IClientJobOrg {
  _id?: string;
  orgName?: string;
  orgEmail?: string;
  orgPhone?: string;
  plan?: {
    _id?: string;
    name?: string;
    durationUnit?: string;
    durationValue?: number;
    price?: number;
  };
}

export interface IClientJobClient {
  _id?: string;
  name?: string;
  email?: string;
  role?: string;
  phone?: string;
  picture?: string;
}

export interface IClientJobCreatedBy {
  _id?: string;
  name?: string;
  email?: string;
  role?: string;
}

export interface IClientJob {
  _id: string;
  jobId?: string;
  title: string;
  description?: string;
  status: string;
  scheduledAt?: string;
  createdAt?: string;
  updatedAt?: string;
  org?: IClientJobOrg;
  lead?: IClientJobLead;
  client?: IClientJobClient;
  createdBy?: IClientJobCreatedBy;
  tasks?: IClientTaskItem[];
  // Optional client note attached to the job (embedded)
  clientNote?: {
    _id?: string;
    job?: { _id?: string; title?: string; description?: string; status?: string };
    role?: string;
    title?: string;
    description?: string;
    tags?: string[];
    createdBy?: { _id?: string; name?: string; email?: string; role?: string };
    isDeleted?: boolean;
    createdAt?: string;
    updatedAt?: string;
  };
  // New embedded cost items (snapshotted at time of adding)
  serviceItems?: IClientJobServiceItem[];
  packageItems?: IClientJobPackageItem[];
  // Embedded lead estimation (snapshotted at time of job creation)
  leadEstimation?: IClientJobLeadEstimation;
  // Total cost from all items
  totalCost?: number;
  // Computed fields from backend
  computed?: IClientJobComputed;
  isDeleted?: boolean;
}

// Client tasks list page
export interface IClientTask {
  _id: string;
  name: string;
  description?: string;
  // Additional fields exposed by backend for client tasks
  job?: { _id: string; title?: string };
  assignedTo?: Array<{ _id: string; name?: string; email?: string }>;
  priority?: "HIGH" | "MEDIUM" | "LOW" | string;
  startDate?: string;
  deadline?: string;
  progress?: number;
  status?: string;
  tags?: string[];
}

export interface IClientTaskQuery {
  page?: number;
  limit?: number;
  searchTerm?: string;
  job?: string; // filter tasks by job id
}

export interface IClientTasksResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: IClientTask[];
  meta: { page: number; limit: number; total: number; totalPage?: number };
}

// Client Dashboard Response Interface
export interface IClientDashboardResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: IClientDashboardStats;
}