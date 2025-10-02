import { Component, Input } from '@angular/core';
import { HomeBanner } from '../../../models/homeBanner';

@Component({
  selector: 'app-banner-card',
  standalone: false,
  templateUrl: './banner-card.component.html',
  styleUrls: ['./banner-card.component.css']
})
export class BannerCardComponent {
  @Input() banner!: HomeBanner;

  formatDate(dateString: string | undefined): string {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('pt-BR');
  }
}

