import { Component } from '@angular/core';

@Component({
  selector: 'app-admin',
  standalone: false,
  template: `<app-admin-layout></app-admin-layout>`,
  styleUrls: ['./admin.component.css']
})
export class AdminComponent {
  constructor() { }
}
