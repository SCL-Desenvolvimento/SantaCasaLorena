import { Component } from '@angular/core';
import { AccessibilityService } from '../../../services/accessibility.service';

@Component({
  selector: 'app-accessibility-button',
  standalone: false,
  templateUrl: './accessibility-button.component.html',
  styleUrl: './accessibility-button.component.css'
})
export class AccessibilityButtonComponent {
  menuOpen = false;

  // Injeta o serviço no construtor
  constructor(private accessibilityService: AccessibilityService) { }

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }

  increaseFont(): void {
    this.accessibilityService.increaseFont();
  }

  decreaseFont(): void {
    this.accessibilityService.decreaseFont();
  }

  toggleContrast(): void {
    this.accessibilityService.toggleContrast();
  }

  reset(): void {
    this.accessibilityService.reset();
  }
}
