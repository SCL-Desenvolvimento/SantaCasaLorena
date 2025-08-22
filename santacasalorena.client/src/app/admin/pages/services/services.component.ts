import { Component, Input, Output, EventEmitter } from '@angular/core';
export interface Service {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: string;
  is_active: boolean;
  order_index?: number;
}

@Component({
  selector: 'app-services',
  standalone: false,
  templateUrl: './services.component.html',
  styleUrl: './services.component.css'
})
export class ServicesComponent {
  @Input() services: Service[] = [];
  @Output() createService = new EventEmitter<void>();
  @Output() editService = new EventEmitter<Service>();
  @Output() deleteService = new EventEmitter<string>();

  onCreateService() {
    this.createService.emit();
  }

  onEditService(item: Service) {
    this.editService.emit(item);
  }

  onDeleteService(id: string) {
    this.deleteService.emit(id);
  }
}
