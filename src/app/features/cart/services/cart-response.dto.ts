export interface CartItemDto {
  foodItemId: number,
  foodItemName: string;
  quantity: number;
  finalPrice: number;
}

export interface CartChargeDto {
  chargeType: string;
  value: number;   // lowercase for consistency
}

export interface CartResponseDto {
  items: CartItemDto[];
  baseAmount: number;
  promoDiscount: number;
  charges: CartChargeDto[];
  finalAmount: number;
  appliedPromoCode?: string;
  message?: string;
}