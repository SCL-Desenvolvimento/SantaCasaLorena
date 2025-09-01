import { Component, Input, Output, EventEmitter } from '@angular/core';
import { User } from '../../../models/user';

@Component({
  selector: 'app-users',
  standalone: false,
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent {
  @Input() users: User[] = [];

  @Output() createUser = new EventEmitter<void>();
  @Output() editUser = new EventEmitter<User>();
  @Output() deleteUser = new EventEmitter<string>();

  onCreateUser() {
    this.createUser.emit();
  }

  onEditUser(user: User) {
    this.editUser.emit(user);
  }

  onDeleteUser(id: string) {
    this.deleteUser.emit(id);
  }
}
