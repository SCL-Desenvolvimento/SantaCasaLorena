import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Specialty } from '../../../models/specialty';

@Component({
  selector: 'app-specialty',
  standalone: false,
  templateUrl: './specialty.component.html',
  styleUrl: './specialty.component.css'
})
export class SpecialtyComponent {
  @Input() specialties: Specialty[] = [];
  @Output() createSpecialty = new EventEmitter<void>();
  @Output() editSpecialty = new EventEmitter<Specialty>();
  @Output() deleteSpecialty = new EventEmitter<string>();

  onCreateSpecialty() {
    this.createSpecialty.emit();
  }

  onEditSpecialty(item: Specialty) {
    this.editSpecialty.emit(item);
  }

  onDeleteSpecialty(id: string) {
    this.deleteSpecialty.emit(id);
  }
}
