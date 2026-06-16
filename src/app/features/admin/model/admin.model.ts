export interface MenuItem {
  foodItemID: number;
  foodItemName: string;
  imageUrl: string;
  categoryName: string;
  dietaryPreferenceName: string;
  offers: string;
  price: number;
  quantity?: number;
}

export interface MenuResponse {
  totalFoodItems: number;
  pageNumber: number;
  pageSize: number;
  data: MenuItem[];
}

