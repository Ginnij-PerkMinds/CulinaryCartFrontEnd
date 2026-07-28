import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PromocodeService, Promocode } from '../../services/promocode.service';

@Component({
  selector: 'app-promocode',
  standalone: true,
  imports: [CommonModule, FormsModule],   // ✅ import here
  templateUrl: './promocode.component.html',
  styleUrls: ['./promocode.component.scss']
})
export class PromocodeComponent implements OnInit {
  promocodes: Promocode[] = [];
  selectedPromo: Promocode | null = null;

  constructor(private promocodeService: PromocodeService) {}

  ngOnInit(): void {
    this.loadPromocodes();
  }

  loadPromocodes() {
  this.promocodeService.getPromocodes().subscribe({
    next: data => this.promocodes = [...data],
    error: err => console.error('Failed to load promocodes', err)
  });
}


  toggleActive(promo: Promocode) {
    this.promocodeService.updatePromocode(promo.id!, promo).subscribe(() => {
      console.log("Active status updated");
    });
  }

  openAddModal() {
    this.selectedPromo = {
      promoCodeName: '',
      amount: 0,
      criteria: 0,
      freeDelivery: false,
      usageCount: 0,
      isActive: true
    };
  }

  openUpdateModal(promo: Promocode) {
    this.selectedPromo = { ...promo };
  }

  savePromocode() {
    if (this.selectedPromo?.id) {
      this.promocodeService.updatePromocode(this.selectedPromo.id, this.selectedPromo).subscribe(() => {
        this.loadPromocodes();
      });
    } else {
      this.promocodeService.addPromocode(this.selectedPromo!).subscribe(() => {
        this.loadPromocodes();
      });
    }
  }

  deletePromocode(id: number) {
    this.promocodeService.deletePromocode(id).subscribe(() => {
      this.promocodes = this.promocodes.filter(p => p.id !== id);
    });
  }
}


