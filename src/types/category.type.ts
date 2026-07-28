export interface ICategory {
  _id: string;
  org: {
    _id: string;
    orgName: string;
  };
  name: string;
  description?: string;
  status: "Active" | "Inactive";
  createdAt: string;
  updatedAt: string;
}

export interface CategoryQuery {
  page?: number;
  limit?: number;
  search?: string;
  status?: "Active" | "Inactive";
  orgId?: string; // Add this line
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface CategoriesResponse {
  data: ICategory[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPage: number;
  };
}

export interface CreateCategoryInput {
  name: string;
  description?: string;
  status?: "Active" | "Inactive";
}

export interface UpdateCategoryInput extends Partial<CreateCategoryInput> {}