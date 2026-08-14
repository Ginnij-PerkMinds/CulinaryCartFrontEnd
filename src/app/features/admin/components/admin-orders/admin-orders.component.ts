import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule, DatePipe, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OrdersService, OrderDto, OrderDetailsDto } from '../../services/Orders.service';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, DatePipe, CurrencyPipe, FormsModule],
  templateUrl: './admin-orders.component.html',
  styleUrls: ['./admin-orders.component.scss']
})
export class OrdersComponent implements OnInit {
  @ViewChild('rejectModal') rejectModal!: ElementRef;

  activeTab: string = 'all';
  orders: OrderDto[] = [];
  selectedOrder?: OrderDetailsDto;

  rejectOrderId?: number;
  rejectRemarks: string = '';

  constructor(private ordersService: OrdersService) {}

  ngOnInit(): void {
    this.loadOrders('all');
  }
  
  loadOrders(tab: string): void {
  this.activeTab = tab;
  if (tab === 'all') {
    this.ordersService.getAllOrders().subscribe(data => {
      this.orders = data.sort((a, b) =>
        new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime()
      );
    });
  } else {
    this.ordersService.getOrdersByStatus(tab).subscribe(data => {
      this.orders = data.sort((a, b) =>
        new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime()
      );
    });
  }
}

  viewDetails(id: number): void {
    this.ordersService.getOrderDetails(id).subscribe(data => this.selectedOrder = data);
  }

  acceptOrder(id: number): void {
    this.ordersService.acceptOrder(id).subscribe(() => this.loadOrders(this.activeTab));
  }

  openRejectModal(orderId: number): void {
    this.rejectOrderId = orderId;
    this.rejectRemarks = '';

    import('bootstrap').then(({ Modal }) => {
      if (this.rejectModal?.nativeElement) {
      let modal = Modal.getInstance(this.rejectModal.nativeElement);
      if (!modal) {
        modal = new Modal(this.rejectModal.nativeElement);
      }
      modal.show();
    }
    });
  }

  // submitReject(): void {
  //   if (!this.rejectOrderId) return;
  //   this.ordersService.rejectOrder(this.rejectOrderId, this.rejectRemarks)
  //     .subscribe(() => {
  //       this.loadOrders(this.activeTab);
  //       import('bootstrap').then(({ Modal }) => {
  //         const modal = Modal.getInstance(this.rejectModal.nativeElement);
  //         modal?.hide();
  //       });
  //     });
  // }
  submitReject(): void {
  if (!this.rejectOrderId) return;
  this.ordersService.rejectOrder(this.rejectOrderId, this.rejectRemarks)
    .subscribe(() => {
      this.loadOrders(this.activeTab);
      import('bootstrap').then(({ Modal }) => {
        const modal = Modal.getInstance(this.rejectModal.nativeElement);
        modal?.hide();
      });
    });
}

}