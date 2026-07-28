export interface IUserCategory {
  _id: string;
  categoryName: string;
  description?: string;
  averageValue: number;
  data: any;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserCategoryInput {
  categoryName: string;
  description?: string;
  averageValue: number;
}

export interface UpdateUserCategoryInput {
  categoryName?: string;
  description?: string;
  averageValue?: number;
}

export interface UserCategoryQuery {
  page?: number;
  limit?: number;
  search?: string;
}

export interface PaginatedUserCategories {
  data: IUserCategory[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPage: number;
  };
}

export interface UserCategoryStats {
  data: {
    totalCategories: number;
    averageOfAverages: number;
    minValue: number;
    maxValue: number;
    totalSum: number;
  };
  
}
