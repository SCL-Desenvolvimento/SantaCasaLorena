import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Agreement } from '../../../models/agreement';

@Component({
  selector: 'app-convenios',
  standalone: false,
  templateUrl: './convenios.component.html',
  styleUrl: './convenios.component.css'
})
export class ConveniosComponent {
  @Input() convenios: Agreement[] = [];
  @Output() createConvenio = new EventEmitter<void>();
  @Output() editConvenio = new EventEmitter<Agreement>();
  @Output() deleteConvenio = new EventEmitter<string>();

  onCreateConvenio() {
    this.createConvenio.emit();
  }

  onEditConvenio(item: Agreement) {
    this.editConvenio.emit(item);
  }

  onDeleteConvenio(id: string) {
    this.deleteConvenio.emit(id);
  }
}
