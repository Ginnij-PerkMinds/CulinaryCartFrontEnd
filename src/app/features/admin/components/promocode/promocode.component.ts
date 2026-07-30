import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PromocodeService, Promocode } from '../../services/promocode.service';

@Component({
  selector: 'app-promocode',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './promocode.component.html',
  styleUrls: ['./promocode.component.scss']
})
export class PromocodeComponent implements OnInit {
  promocodes: Promocode[] = [];
  selectedPromo: Promocode | null = null;
  notification: string | null = null;
  isPercentage: boolean = false;

  constructor(private promocodeService: PromocodeService) {}

  ngOnInit(): void {
    this.loadPromocodes();
  }

  private normalizeMessage(res: any): string {
    if (typeof res === 'string') return res;
    if (res && typeof res.message === 'string') return res.message;
    if (res && typeof res.error === 'string') return res.error;
    if (res && typeof res === 'object') return res.text || JSON.stringify(res);
    return 'Unknown response from server';
  }

  loadPromocodes(): void {
    this.promocodeService.getPromocodes().subscribe({
      next: (data) => this.promocodes = [...data],
      error: (err) => this.showNotification(this.normalizeMessage(err.error))
    });
  }

  toggleActive(promo: Promocode): void {
    this.promocodeService.updatePromocode(promo.id!, promo).subscribe({
      next: (res) => this.showNotification(this.normalizeMessage(res)),
      error: (err) => this.showNotification(this.normalizeMessage(err.error))
    });
  }

  openAddModal(): void {
    this.selectedPromo = {
      promoCodeName: '',
      amount: 0,
      criteria: 0,
      freeDelivery: false,
      usageCount: 0,
      isActive: true
    };
    this.isPercentage = false;
  }

  openUpdateModal(promo: Promocode): void {
    this.selectedPromo = { ...promo };
     // detect if amount is stored with "%" and set toggle accordingly
    if (typeof promo.amount === 'string' && promo.amount.includes('%')) {
      this.isPercentage = true;
      // strip "%" for editing in input
      this.selectedPromo.amount = parseFloat(promo.amount.replace('%', ''));
    } else {
      this.isPercentage = false;
      this.selectedPromo.amount = Number(promo.amount);
    }
  }
   
  savePromocode(): void {
  if (!this.selectedPromo) return;

  let finalAmount: number;

  if (this.isPercentage) {
    // Example: user enters 10, toggle ON → store as 0.10
    finalAmount = Number(this.selectedPromo.amount) / 100;
  } else {
    // Toggle OFF → store as plain numeric
    finalAmount = Number(this.selectedPromo.amount);
  }

  const promoRequest = {
    ...this.selectedPromo,
    amount: finalAmount   // ✅ always numeric now
  };

  if (this.selectedPromo.id) {
    this.promocodeService.updatePromocode(this.selectedPromo.id, promoRequest).subscribe({
      next: (res) => {
        this.loadPromocodes();
        this.showNotification(this.normalizeMessage(res));
      },
      error: (err) => this.showNotification(this.normalizeMessage(err.error))
    });
  } else {
    this.promocodeService.addPromocode(promoRequest).subscribe({
      next: (res) => {
        this.loadPromocodes();
        this.showNotification(this.normalizeMessage(res));
      },
      error: (err) => this.showNotification(this.normalizeMessage(err.error))
    });
  }
}

formatAmount(amount: number | string): string {
  if (typeof amount === 'number') {
    // If stored as fraction (e.g. 0.10), show as percentage
    if (amount > 0 && amount < 1) {
      return (amount * 100).toFixed(0) + '%';
    }
    // Otherwise show as plain number
    return amount.toString();
  }

  // If backend ever returns string, just show it
  return amount;
}

  deletePromocode(id: number): void {
    this.promocodeService.deletePromocode(id).subscribe({
      next: (res) => {
        this.promocodes = this.promocodes.filter(p => p.id !== id);
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