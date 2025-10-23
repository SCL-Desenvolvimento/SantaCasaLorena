import { Component } from '@angular/core';

@Component({
  selector: 'app-admin-footer',
  standalone: false,
  templateUrl: './admin-footer.component.html',
  styleUrls: ['./admin-footer.component.css']
})
export class AdminFooterComponent {
  currentYear = new Date().getFullYear();
}
