import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChargeService } from '../../services/charge.service';
import { ChargeDto } from '../../model/charge.dto';

@Component({
  selector: 'app-charge',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './charge.component.html',
  styleUrls: ['./charge.component.scss']
})
export class ChargeComponent implements OnInit {
  charges: ChargeDto[] = [];
  selectedCharge: ChargeDto | null = null;
  notification: string | null = null;

  constructor(private chargeService: ChargeService) {}

  ngOnInit(): void {
    this.loadCharges();
  }

  private normalizeMessage(res: any): string {
    if (typeof res === 'string') return res;
    if (res && typeof res.message === 'string') return res.message;
    if (res && typeof res.error === 'string') return res.error;
    if (res && typeof res === 'object') return res.text || JSON.stringify(res);
    return 'Unknown response from server';
  }

  loadCharges(): void {
    this.chargeService.getAllCharges().subscribe({
      next: (data) => this.charges = [...data],
      error: (err) => this.showNotification(this.normalizeMessage(err.error))
    });
  }

  toggleActive(charge: ChargeDto): void {
  const updateRequest = {
    chargeId: charge.chargeId,
    chargeType: charge.chargeType,
    value: charge.value,   
    isActive: charge.isActive
  };

  this.chargeService.updateCharge(updateRequest.chargeId, updateRequest).subscribe({
    next: (res) => this.showNotification(this.normalizeMessage(res)),
    error: (err) => this.showNotification(this.normalizeMessage(err.error))
  });
}

  openAddModal(): void {
    this.selectedCharge = {
      chargeId: 0,
      chargeType: '',
      value: 0,
      isActive: true
    };
  }

  openUpdateModal(charge: ChargeDto): void {
    this.selectedCharge = { ...charge };
  }

saveCharge(): void {
  if (!this.selectedCharge) return;

  // Always convert input into fraction before sending
  const fractionValue = Number(this.selectedCharge.value) / 100;

  const request = {
    chargeId: this.selectedCharge.chargeId,
    chargeType: this.selectedCharge.chargeType,
    value: fractionValue,   // ✅ send fraction (0.05 for 5%)
    isActive: this.selectedCharge.isActive
  };

  if (this.selectedCharge.chargeId && this.selectedCharge.chargeId > 0) {
    this.chargeService.updateCharge(request.chargeId, request).subscribe(/* ... */);
  } else {
    this.chargeService.addCharge(request).subscribe(/* ... */);
  }
}

formatChargeValue(value: number): string {
  return (value * 100).toFixed(0) + '%';
}

  deleteCharge(id: number): void {
    this.chargeService.deleteCharge(id).subscribe({
      next: (res) => {
        this.charges = this.charges.filter(c => c.chargeId !== id);
        this.showNotification(this.normalizeMessage(res));
      },
      error: (err) => this.showNotification(this.normalizeMessage(err.error))
    });
  }

  showNotification(message: string): void {
    this.notification = message;
    setTimeout(() => this.notification = null, 3000);
  }
}