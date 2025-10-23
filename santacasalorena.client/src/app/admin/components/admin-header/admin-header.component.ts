import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service'; 

@Component({
  selector: 'app-admin-header',
  standalone: false,
  templateUrl: './admin-header.component.html',
  styleUrls: ['./admin-header.component.css']
})
export class AdminHeaderComponent {
  @Input() pageTitle = '';
  @Input() breadcrumbs: string[] = [];
  @Output() toggleSidebar = new EventEmitter<void>();

  showUserMenu = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  onToggleSidebar(): void {
    this.toggleSidebar.emit();
  }

  toggleUserMenu(): void {
    this.showUserMenu = !this.showUserMenu;
  }

  logout(): void {
    this.authService.logout();      
    this.router.navigate(['/login']);
  }
}
