import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RefundsUserService } from '../admin/services/refund-user.service';
import { OrderHistoryService,MyOrderItemDto, MyOrderDto, MyOrderDetailsDto } from '../admin/services/orderhistory.service';

@Component({
  selector: 'app-refund-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, CurrencyPipe],
  templateUrl: './refund-modal.component.html',
  styleUrls: ['./refund-modal.component.scss']
})
export class RefundModalComponent implements OnInit {
  eligibleOrders: MyOrderDto[] = [];
  selectedOrder: MyOrderDetailsDto | null = null;

  selectAllChecked: boolean = false;

  selectedItemId: string = 'all';
  itemDetails: any;
  userRemarks: string = '';
  proofFile?: File;

  constructor(
    private refundsUserService: RefundsUserService,
    private orderHistoryService: OrderHistoryService
  ) {}

  ngOnInit(): void {
    //  Fetch recent orders directly from backend
    this.orderHistoryService.getDeliveredEligibleOrders().subscribe({
      next: (data) => {
        this.eligibleOrders = data;
        console.log('Recent orders:', this.eligibleOrders);
      },
      error: (err) => console.error('Error fetching recent orders', err)
    });
  }

  viewOrderDetails(order: MyOrderDto): void {
    // If refund already claimed, show message instead of fetching details
  if (order.refundStatus && order.refundStatus !== '') {
    alert('Refund already claimed for this order.');
    return;
  }
    //  Fetch full order details from backend
    this.orderHistoryService.getMyOrdersDetails(order.orderId).subscribe({
      next: (data) => {
        this.selectedOrder = data;
        this.resetForm();
      },
      error: (err) => console.error('Error fetching order details', err)
    });
  }

  fetchItemDetails(): void {
    if (this.selectedItemId === 'all') {
      this.itemDetails = undefined;
    } else {
      this.itemDetails = this.selectedOrder?.orderItems.find(
        (i) => i.foodItemId === +this.selectedItemId
      );
    }
  }

  toggleAllItems() {
  if (!this.selectedOrder) return;
  this.selectedOrder.orderItems.forEach(item => item.checked = this.selectAllChecked);
}

toggleSingleItem() {
  if (!this.selectedOrder) return;
  // If any item is unchecked, uncheck "All Items"
  if (this.selectedOrder.orderItems.some(item => !item.checked)) {
    this.selectAllChecked = false;
  } else {
    // If all items are checked, check "All Items"
    this.selectAllChecked = true;
  }
}

get selectedItemsTotal(): number {
  if (!this.selectedOrder) return 0;

  // If "All Items" is checked, sum all
  if (this.selectAllChecked) {
    return this.selectedOrder.orderItems.reduce((sum, i) => sum + i.finalPrice, 0);
  }

  // Otherwise sum only checked items
  return this.selectedOrder.orderItems
    .filter(i => i.checked)
    .reduce((sum, i) => sum + i.finalPrice, 0);
}

  // uploading proofimage
  onItemFileSelected(event: any, item: MyOrderItemDto) {
  const file = event.target.files[0];
  if (file) {
    item.proofFile = file;
  }
}

submitRefund(): void {
  if (!this.selectedOrder) return;

  const formData = new FormData();

  // Basic refund info
  formData.append("orderId", this.selectedOrder.orderId.toString());
  formData.append("refundAmount", this.selectedItemsTotal.toString());

  // Build items payload
  const selectedItems = this.selectAllChecked
    ? this.selectedOrder.orderItems
    : this.selectedOrder.orderItems.filter(i => i.checked);

  const itemsPayload = selectedItems.map(item => ({
    foodItemId: item.foodItemId,
    remarks: item.remarks || "",
    proofImage: null
  }));

  // Attach JSON string
  formData.append("itemsJson", JSON.stringify(itemsPayload));

  // Attach files separately
  selectedItems.forEach(item => {
    if (item.proofFile) {
      formData.append("proofFiles", item.proofFile, `${item.foodItemId}_${item.proofFile.name}`);
    }
  });

  // Call service
  this.refundsUserService.claimRefund(formData).subscribe({
    next: () => alert("Refund request submitted!"),
    error: () => alert("Failed to submit refund request.")
  });
}

  private resetForm(): void {
    this.selectedItemId = 'all';
    this.itemDetails = undefined;
    this.userRemarks = '';
    this.proofFile = undefined;
  }
}