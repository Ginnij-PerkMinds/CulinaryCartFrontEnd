import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RefundsUserService } from '../admin/services/refund-user.service';
import { OrderHistoryService } from '../admin/services/orderhistory.service';

@Component({
  selector: 'app-my-orders',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './my-orders.component.html',
  styleUrls: ['./my-orders.component.scss']
})
export class MyOrdersComponent implements OnInit {
  orders: any[] = [];
  selectedOrder: any | null = null;

  // Refund form fields
  refundItem: string = 'all';   // dropdown selection ("all" or itemId)
  refundRemarks: string = '';   // textarea
  refundProofFile: File | null = null; // proof image file

  constructor(private http: HttpClient, private refundsService: RefundsUserService,
                                 private orderHistoryService: OrderHistoryService) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  // Load all orders for the logged-in user
  // loadOrders(): void {
  //   this.http.get<any[]>('http://localhost:5209/api/Cart/my-orders').subscribe(data => {
  //     this.orders = data;
  //   });
  // }
  loadOrders(): void {
  this.orderHistoryService.getMyOrders().subscribe(data => {
    console.log('Orders API response:', data);
    this.orders = data;
  });
}

  // Open details modal for a specific order
  viewDetails(order: any): void {
    this.selectedOrder = order;
    this.resetRefundForm();
  }

  // Reset refund form fields when opening modal
  resetRefundForm(): void {
    this.refundItem = 'all';
    this.refundRemarks = '';
    this.refundProofFile = null;
  }

  // Handle file selection
  onFileSelected(event: any): void {
    this.refundProofFile = event.target.files[0];
  }

  // Submit refund request
  submitRefund(orderId: number): void {
    this.refundsService.claimRefund(
      orderId,                        // orderId
      this.refundRemarks,             // remarks
      this.refundItem,                // dropdown value ("all" or itemId)
      this.refundProofFile || undefined   // proof file (avoid null)
    ).subscribe(() => {
      alert('Refund request submitted successfully!');
      this.loadOrders(); // reload orders to reflect new status

      const modal = document.getElementById('detailsModal');
      if (modal) {
        (window as any).bootstrap.Modal.getInstance(modal)?.hide();
      }
    });
  }
}
