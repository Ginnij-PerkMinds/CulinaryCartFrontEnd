import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartService } from '../services/cart.service';
import { CartResponseDto } from '../../cart/services/cart-response.dto';
import { PaymentService } from '../../admin/services/payment.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, FormsModule,],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent {
   cartResponse: CartResponseDto = {
    items: [],
    baseAmount: 0,
    promoDiscount: 0,
    charges: [],
    finalAmount: 0,
    appliedPromoCode: '',
    message: ''
  };
  
  itemCount: number = 0; 
  isVisible: boolean = false;
  notification: string | null = null;
  promoCode: string = '';

  constructor(private cartService: CartService,
              private paymentService: PaymentService,
              private router: Router) {}

  openCart(): void {
    this.isVisible = true;
    this.loadCart();
  }

  closeCart(): void {
    this.isVisible = false;
  }

  loadCart(promoCode?: string): void {
    this.cartService.getCart(promoCode).subscribe({
      next: (response) => {
        this.cartResponse = response;
        this.itemCount = response.items.reduce((sum, i) => sum + i.quantity, 0);
      },
      error: () => this.showNotification("Failed to load cart")
    });
  }

  addItem(foodItemId: number, qty: number = 1): void {
    this.cartService.addItem(foodItemId, qty).subscribe({
      next: () => {
        this.showNotification("Item Added Successfully!");
        this.itemCount +=qty;
        this.loadCart(this.promoCode);
      },
      error: () => this.showNotification("Failed to add item.")
    });
  }

  updateItem(foodItemId: number, qty: number): void {
    this.cartService.updateItem(foodItemId, qty).subscribe({
      next: () => this.loadCart(this.promoCode),
      error: () => this.showNotification("Failed to update quantity.")
    });
  }

  removeItem(foodItemId: number): void {
    this.cartService.removeItem(foodItemId).subscribe({
      next: () => {
        this.showNotification("Item removed");
        this.loadCart(this.promoCode);
      },
      error: () => this.showNotification("Failed to remove item.")
    });
  }

  cancelPromo() {
  this.promoCode = '';
  this.loadCart(); // reload cart without promo
}
checkout() {
  const finalAmount = this.cartResponse.finalAmount;
  console.log("Checkout triggered with FinalAmount (₹):", finalAmount);

  this.paymentService.createOrder(finalAmount).subscribe({
    next: (order: any) => {
      console.log("✅ Order created:", order);

      // Log both paise and rupees for clarity
      console.log("Order.Amount (paise):", order.Amount);
      console.log("Order.Amount (₹):", order.Amount / 100);

      const options: any = {
        key: 'rzp_test_TLzmtgiwgzRLpH',
        amount: order.Amount, // paise for Razorpay
        currency: order.Currency,
        name: 'Culinary Cart',
        description: `Food Order Payment (₹${order.FinalAmount})`, // ✅ rupees shown to user
        order_id: order.RazorpayOrderId,
        handler: (response: any) => {
          console.log("💳 Payment response:", response);

          this.paymentService.verifyPayment({
            razorpayOrderId: response.razorpay_order_id,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpaySignature: response.razorpay_signature,
            promoCode: this.promoCode // pass promo if applied
          }).subscribe({
            next: (result) => {
              console.log("🔍 Verification result:", result);

              if (result.success) {
                console.log("✅ Payment verified successfully");
                this.router.navigate(['/order-confirmation'], { state: { order } });
              } else {
                console.error("❌ Payment verification failed");
                this.showNotification("Payment verification failed.");
              }
            },
            error: (err) => {
              console.error("❌ Verification API call failed:", err);
              this.showNotification("Payment verification error.");
            }
          });
        },
        prefill: {
          name: 'Test User',
          email: 'test@example.com',
          contact: '9999999999'
        },
        theme: { color: '#EA4626' }
      };

      console.log("⚙️ Razorpay options prepared:", options);

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
      console.log("🚀 Razorpay checkout opened");
    },
    error: (err) => {
      console.error("❌ Failed to create order:", err);
      this.showNotification("Payment order creation failed.");
    }
  });
}

// checkout() {
//   const finalAmount = this.cartResponse.finalAmount;
//   console.log("Checkout triggered with FinalAmount:", finalAmount);

//   this.paymentService.createOrder(finalAmount).subscribe({
//     next: (order: any) => {
//       console.log("✅ Order created:", order);

//       const options: any = {
//         key: 'rzp_test_TLzmtgiwgzRLpH',
//         amount: order.Amount, // Razorpay expects amount in paise
//         currency: order.Currency,
//         name: 'Culinary Cart',
//         description: 'Food Order Payment (₹${order.Amount / 100})',
//         order_id: order.RazorpayOrderId,
//         handler: (response: any) => {
//           console.log("💳 Payment response:", response);

//           this.paymentService.verifyPayment({
//             razorpayOrderId: response.razorpay_order_id,
//             razorpayPaymentId: response.razorpay_payment_id,
//             razorpaySignature: response.razorpay_signature
//           }).subscribe({
//             next: (result) => {
//               console.log("🔍 Verification result:", result);

//               if (result.success) {
//                 console.log("✅ Payment verified successfully");
//                 this.router.navigate(['/order-confirmation'], { state: { order } });
//               } else {
//                 console.error("❌ Payment verification failed");
//                 this.showNotification("Payment verification failed.");
//               }
//             },
//             error: (err) => {
//               console.error("❌ Verification API call failed:", err);
//               this.showNotification("Payment verification error.");
//             }
//           });
//         },
//         prefill: {
//           name: 'Test User',
//           email: 'test@example.com',
//           contact: '9999999999'
//         },
//         theme: { color: '#EA4626' }
//       };

//       console.log("⚙️ Razorpay options prepared:", options);

//       const rzp = new (window as any).Razorpay(options);
//       rzp.open();
//       console.log("🚀 Razorpay checkout opened");
//     },
//     error: (err) => {
//       console.error("❌ Failed to create order:", err);
//       this.showNotification("Payment order creation failed.");
//     }
//   });
// }

  showNotification(message: string): void {
    this.notification = message;
    setTimeout(() => this.notification = null, 5000);
  }
}