
import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-confirm-dialog',
  standalone: false,
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.css']
})
export class ConfirmDialogComponent {
  @Input() message: string = 'Tem certeza que deseja continuar?';
  @Input() confirmButtonText: string = 'Confirmar';
  @Input() cancelButtonText: string = 'Cancelar';
  @Output() confirmed = new EventEmitter<boolean>();

  showDialog = false;

  open(): void {
    this.showDialog = true;
  }

  close(): void {
    this.showDialog = false;
  }

  onConfirm(): void {
    this.confirmed.emit(true);
    this.close();
  }

  onCancel(): void {
    this.confirmed.emit(false);
    this.close();
  }
}

