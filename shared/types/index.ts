// shared typescript types defenitions for all microservices

export interface User {
  id: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}


export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  errors?: Record<string, string[]>;
}
