export interface MenuItem {
  foodItemID: number;
  foodItemName: string;
  price: number;
  offers: string;
  imageUrl: string;
  categoryName: string;
  dietaryPreferenceName: string;

  selectedQty?: number;
}

export interface MenuResponse {
  totalFoodItems: number;
  pageNumber: number;
  pageSize: number;
  data: MenuItem[];
}