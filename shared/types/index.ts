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

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}
 
export interface JWTPayload {
  userId: string;
  email: string;
  int: number;
  exp: number;
} 

export class ServiceError extends Error {
   statusCode: number;
   code?: string;
   details?: any;

   constructor(message: string, statusCode: number = 500, code?: string, details?: any) {

    super(message);
    this.name = "ServiceError";
    this.statusCode = statusCode; 
    this.code = code; 
    this.details = details;
   }
}
