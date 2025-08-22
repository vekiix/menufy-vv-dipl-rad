interface ErrorDetail {
  path: string;
  httpStatus: number;
  detail: string;
  timestamp: string;
}

export interface ErrorResponse {
  errors: ErrorDetail[];
}
