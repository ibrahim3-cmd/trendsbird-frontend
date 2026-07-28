export interface ILogUser {
  _id: string;
  name: string;
  email: string;
}

export interface ILogOrg {
  _id: string;
  orgName: string;
  orgEmail: string;
}

export interface ILog {
  _id: string;
  org: ILogOrg | null;
  action: string;
  user: ILogUser;
  details: string;
  createdAt: string;
  updatedAt: string;
}

export interface LogQuery {
  page?: number;
  limit?: number;
  user?: string;
  action?: string;
  actions?: string[];
  startDate?: string;
  endDate?: string;
  sortBy?: 'createdAt' | 'action' | 'user';
  sortOrder?: 'asc' | 'desc';
  search?: string;
  orgId?: string;
}

export interface PaginatedLogs {
  logs: ILog[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}