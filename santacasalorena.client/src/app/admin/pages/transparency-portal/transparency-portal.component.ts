import { Component, Input, Output, EventEmitter } from '@angular/core';
import { TransparencyPortal } from '../../../models/transparencyPortal';

@Component({
  selector: 'app-transparency-portal',
  standalone: false,
  templateUrl: './transparency-portal.component.html',
  styleUrls: ['./transparency-portal.component.css']
})
export class TransparencyPortalComponent {
  @Input() items: TransparencyPortal[] = [];

  @Output() createItem = new EventEmitter<void>();
  @Output() editItem = new EventEmitter<TransparencyPortal>();
  @Output() deleteItem = new EventEmitter<string>();

  onCreateItem() {
    this.createItem.emit();
  }

  onEditItem(item: TransparencyPortal) {
    this.editItem.emit(item);
  }

  onDeleteItem(id: string) {
    this.deleteItem.emit(id);
  }
}
