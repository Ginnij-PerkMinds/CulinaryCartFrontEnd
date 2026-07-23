// DTO for creating/updating dietary preferences
export interface DietUpdateRequest {
  diet: string;
}

// DTO for dietary preference response from backend
export interface DietResponse {
  dietId: number;
  diet: string;
  menuItems?: any; // optional, since backend may return null
}
