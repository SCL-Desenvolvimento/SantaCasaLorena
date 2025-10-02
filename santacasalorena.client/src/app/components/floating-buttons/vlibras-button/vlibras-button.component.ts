import { Component, AfterViewInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { VlibrasService } from '../../../services/vlibras.service';

@Component({
  selector: 'app-vlibras-button',
  standalone: false,
  templateUrl: './vlibras-button.component.html',
  styleUrls: ['./vlibras-button.component.css']
})
export class VlibrasButtonComponent implements  AfterViewInit {
  constructor(private vlibras: VlibrasService, @Inject(PLATFORM_ID) private platformId: Object) { }

  async ngAfterViewInit() {
    if (!isPlatformBrowser(this.platformId)) return;
    try {
      await this.vlibras.init();
    } catch (err) {
      console.error('Erro iniciando VLibras', err);
    }
  }
}
