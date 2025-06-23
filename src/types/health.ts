// types/health.ts

export interface HealthProfile {
  bloodType?: string;
  bloodPressure?: string;
  cholesterol?: {
    total?: number;
    hdl?: number;
    ldl?: number;
  };
  hasAllergies?: boolean;
  allergies?: string[];
  hasConditions?: boolean;
  conditions?: string[];
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
}