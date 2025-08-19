import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Convenio } from '../../../models/convenio';

@Component({
  selector: 'app-convenios',
  standalone: false,
  templateUrl: './convenios.component.html',
  styleUrl: './convenios.component.css'
})
export class ConveniosComponent {
  @Input() convenios: Convenio[] = [];
  @Output() createConvenio = new EventEmitter<void>();
  @Output() editConvenio = new EventEmitter<Convenio>();
  @Output() deleteConvenio = new EventEmitter<number>();

  onCreateConvenio() {
    this.createConvenio.emit();
  }

  onEditConvenio(item: Convenio) {
    this.editConvenio.emit(item);
  }

  onDeleteConvenio(id: number) {
    this.deleteConvenio.emit(id);
  }
}
