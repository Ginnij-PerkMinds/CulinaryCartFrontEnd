export interface PaymentOrderDto {
  razorpayOrderId: string;
  Amount: number; // paise
  dto: {
    baseAmount: number;
    promoDiscount: number;
    appliedPromoCode: string;
    handlingFee: number;
    deliveryFee: number;
    taxAmount: number;
    finalAmount: number;
    currency: string;
  };
  Items: {
    foodItemId: number;
    foodItemName: string;
    quantity: number;
    finalPrice: number;
  }[];
}
