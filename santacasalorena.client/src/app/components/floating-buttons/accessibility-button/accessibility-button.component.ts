import { Component } from '@angular/core';

@Component({
  selector: 'app-accessibility-button',
  standalone: false,
  templateUrl: './accessibility-button.component.html',
  styleUrl: './accessibility-button.component.css'
})
export class AccessibilityButtonComponent {
  menuOpen = false;

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  increaseFont() {
    document.body.style.fontSize = 'larger';
  }

  decreaseFont() {
    document.body.style.fontSize = 'smaller';
  }

  toggleContrast() {
    document.body.classList.toggle('high-contrast');
  }

  reset() {
    document.body.style.fontSize = '';
    document.body.classList.remove('high-contrast');
  }

}
