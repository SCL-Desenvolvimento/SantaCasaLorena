import { Component, Input, Output, EventEmitter } from '@angular/core';
import { HomeBanner } from '../../../models/homeBanner';

@Component({
  selector: 'app-home-banner',
  standalone: false,
  templateUrl: './home-banner.component.html',
  styleUrl: './home-banner.component.css'
})
export class HomeBannerComponent {
  @Input() banners: HomeBanner[] = [];
  @Output() createBanner = new EventEmitter<void>();
  @Output() editBanner = new EventEmitter<HomeBanner>();
  @Output() deleteBanner = new EventEmitter<string>();

  onCreateBanner() {
    this.createBanner.emit();
  }

  onEditBanner(item: HomeBanner) {
    this.editBanner.emit(item);
  }

  onDeleteBanner(id: string) {
    this.deleteBanner.emit(id);
  }
}
