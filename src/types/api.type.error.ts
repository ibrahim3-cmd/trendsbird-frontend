export interface ApiError {
  status: number;
  data: {
    success: boolean;
    errorSources?: Array<{
      source: string;
      message: string;
    }>;
    message: string;
  };
}
