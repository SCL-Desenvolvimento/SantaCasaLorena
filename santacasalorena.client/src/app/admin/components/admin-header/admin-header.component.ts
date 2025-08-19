import { Component, Input, Output, EventEmitter } from '@angular/core';
import { User } from '../../../models/user';

@Component({
  selector: 'app-admin-header',
  standalone: false,
  templateUrl: './admin-header.component.html',
  styleUrl: './admin-header.component.css'
})
export class AdminHeaderComponent {
  @Input() user: User | null = null;
  @Output() logout = new EventEmitter<void>();

  onLogout() {
    this.logout.emit();
  }
}
