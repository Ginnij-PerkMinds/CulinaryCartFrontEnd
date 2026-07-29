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
  }

  openUpdateModal(promo: Promocode): void {
    this.selectedPromo = { ...promo };
  }

  savePromocode(): void {
    if (this.selectedPromo?.id) {
      this.promocodeService.updatePromocode(this.selectedPromo.id, this.selectedPromo).subscribe({
        next: (res) => {
          this.loadPromocodes();
          this.showNotification(this.normalizeMessage(res));
        },
        error: (err) => this.showNotification(this.normalizeMessage(err.error))
      });
    } else {
      this.promocodeService.addPromocode(this.selectedPromo!).subscribe({
        next: (res) => {
          this.loadPromocodes();
          this.showNotification(this.normalizeMessage(res));
        },
        error: (err) => this.showNotification(this.normalizeMessage(err.error))
      });
    }
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