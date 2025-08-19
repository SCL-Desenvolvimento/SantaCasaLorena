import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Service } from '../../../models/service';

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
  @Output() deleteService = new EventEmitter<number>();

  onCreateService() {
    this.createService.emit();
  }

  onEditService(item: Service) {
    this.editService.emit(item);
  }

  onDeleteService(id: number) {
    this.deleteService.emit(id);
  }
}
