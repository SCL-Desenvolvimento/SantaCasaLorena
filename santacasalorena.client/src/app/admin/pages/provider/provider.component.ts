import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Providers } from '../../../models/provider';

@Component({
  selector: 'app-provider',
  standalone: false,
  templateUrl: './provider.component.html',
  styleUrl: './provider.component.css'
})
export class ProviderComponent {
  @Input() providers: Providers[] = [];
  @Output() createProvider = new EventEmitter<void>();
  @Output() editProvider = new EventEmitter<Providers>();
  @Output() deleteProvider = new EventEmitter<string>();

  onCreateProvider() {
    this.createProvider.emit();
  }

  onEditProvider(item: Providers) {
    this.editProvider.emit(item);
  }

  onDeleteProvider(id: string) {
    this.deleteProvider.emit(id);
  }
}
