import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule, DatePipe, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RefundsService, RefundDto, RefundDetailsDto } from '../../services/Refunds.service';

@Component({
  selector: 'app-refunds',
  standalone: true,
  imports: [CommonModule, DatePipe, CurrencyPipe, FormsModule],
  templateUrl: './admin-refunds.component.html',
  styleUrls: ['./admin-refunds.component.scss']
})
export class RefundsComponent implements OnInit {
  @ViewChild('rejectModal') rejectModal!: ElementRef;

  activeTab: string = 'all';
  refunds: RefundDto[] = [];
  selectedRefund?: RefundDetailsDto;

  rejectRefundId?: number;
  rejectRemarks: string = '';

  constructor(private refundsService: RefundsService) {}

  ngOnInit(): void {
    this.loadRefunds('all');
  }

  loadRefunds(tab: string): void {
    this.activeTab = tab;
    if (tab === 'all') {
      this.refundsService.getAllRefunds().subscribe(data => {
         this.refunds = data.sort((a, b) =>
           new Date(b.requestDate).getTime() - new Date(a.requestDate).getTime()
         );
      });
    } else {
      this.refundsService.getRefundsByStatus(tab).subscribe(data => {
        this.refunds = data.sort((a, b) =>
          new Date(b.requestDate).getTime() - new Date(a.requestDate).getTime()
        );
      });
    }
  }

  viewDetails(id: number): void {
    this.refundsService.getRefundDetails(id).subscribe(data => this.selectedRefund = data);
  }

  acceptRefund(id: number): void {
    this.refundsService.acceptRefund(id).subscribe(() => this.loadRefunds(this.activeTab));
  }

  openRejectModal(refundId: number): void {
    this.rejectRefundId = refundId;
    this.rejectRemarks = '';

    import('bootstrap').then(({ Modal }) => {
      let modal = Modal.getInstance(this.rejectModal.nativeElement);
      if (!modal) {
        modal = new Modal(this.rejectModal.nativeElement);
      }
      modal.show();
    });
  }

  submitReject(): void {
    if (!this.rejectRefundId) return;
    this.refundsService.rejectRefund(this.rejectRefundId, this.rejectRemarks)
      .subscribe(() => {
        this.loadRefunds(this.activeTab);
        import('bootstrap').then(({ Modal }) => {
          const modal = Modal.getInstance(this.rejectModal.nativeElement);
          modal?.hide();
        });
      });
  }
}
