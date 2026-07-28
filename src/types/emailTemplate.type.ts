import { IPaginatedMeta } from ".";

export interface ITemplateCategory {
  _id: string;
  name: string;
  description?: string;
  // If undefined or null -> global category; string -> org id
  org?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface IEmailTemplate {
  _id: string;
  title: string;
  subject: string;
  body: string;
  designJson?: string;
  placeholders: string[];
  des?: string;
  category?: string | ITemplateCategory | null;
  // If undefined or null -> global template; string -> org id
  org?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface ITemplateQuery {
  page?: number;
  limit?: number;
  searchTerm?: string;
  category?: string; // category id
  // Super admin can filter by specific org id
  org?: string;
}

export interface TemplateListResponse {
  data: IEmailTemplate[];
  meta: IPaginatedMeta;
}

export interface CategoryListResponse {
  data: ITemplateCategory[];
}
