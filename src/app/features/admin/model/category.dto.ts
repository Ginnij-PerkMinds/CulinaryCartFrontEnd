// DTO for creating/updating categories
export interface CategoryUpdateRequest {
  categoryName: string;
}

// DTO for category response from backend
export interface CategoryResponse {
  categoryId: number;
  categoryName: string;
  menuItems?: any; // optional, since backend may return null
}
