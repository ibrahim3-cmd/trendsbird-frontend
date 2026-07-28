// types/email.type.ts

// Add this interface for attachments
export interface IEmailAttachment {
  filename: string;
  content?: Buffer;
  contentType?: string;
  size?: number;
  path?: string;
}

// types/email.type.ts
export interface IEmailLog {
  _id: string;
  orgId: string;
  orgId_populated?: { // Add this optional field for populated data
    _id: string;
    orgName: string;
  };
  to: string[];
  cc: string[];
  bcc: string[];
  from: string;
  subject: string;
  body?: string;
  attachments: IEmailAttachment[];
  status: 'pending' | 'sent' | 'delivered' | 'opened' | 'clicked' | 'bounced' | 'failed';
  provider: 'sendgrid' | 'mailgun' | 'smtp';
  providerMessageId?: string;
  providerResponse?: any;
  errorMessage?: string;
  retryCount?: number;
  maxRetries?: number;
  sentAt?: string;
  deliveredAt?: string;
  openedAt?: string;
  clickedAt?: string;
  bouncedAt?: string;
  failedAt?: string;
  unsubscribedAt?: string;
  metadata?: {
    automationId?: {
      _id: string;
      name: string;
    };
    leadId?: {
      _id: string;
      name: string;
      email: string;
    };
    userId?: {
      _id: string;
      name: string;
      email: string;
    };
    campaignId?: string;
    templateName?: string;
    type?: string;
    additionalData?: any;
  };
  createdAt: string;
  updatedAt: string;
}

export interface EmailLogQuery {
  page?: string;
  limit?: string;
  search?: string;
  status?: string;
  automation?: string;
  lead?: string;
  startDate?: string;
  endDate?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}