import { Component, OnInit } from '@angular/core';

interface Convenio {
  id: number;
  name: string;
  imageUrl: string;
}

@Component({
  selector: 'app-convenios',
  standalone: false,
  templateUrl: './convenios.component.html',
  styleUrls: ['./convenios.component.css'],
})
export class ConveniosComponent implements OnInit {

  convenios: Convenio[] = [];

  private readonly fallbackImage = 'assets/images/fallback-convenio.png';

  ngOnInit(): void {
    this.loadConvenios();
  }

  /**
   * Carrega a lista de convênios (mock ou chamada de API futuramente).
   */
  private loadConvenios(): void {
    // Exemplo mockado - depois pode trocar por chamada ao service
    this.convenios = [
      { id: 1, name: 'Amil', imageUrl: 'assets/images/convenios/amil.png' },
      { id: 2, name: 'Bradesco Saúde', imageUrl: 'assets/images/convenios/bradesco.png' },
      { id: 3, name: 'OAB CAASP', imageUrl: 'assets/images/convenios/oab.png' },
      { id: 4, name: 'Cabesp', imageUrl: 'assets/images/convenios/cabesp.png' },
      { id: 5, name: 'CAS', imageUrl: 'assets/images/convenios/cas.png' },
      { id: 6, name: 'Cassi', imageUrl: 'assets/images/convenios/cassi.png' },
      { id: 7, name: 'Economus', imageUrl: 'assets/images/convenios/economus.png' },
      { id: 8, name: 'EEAR', imageUrl: 'assets/images/convenios/eear.png' },
      { id: 9, name: 'FUSEX', imageUrl: 'assets/images/convenios/fusex.png' },
      { id: 10, name: 'INB', imageUrl: 'assets/images/convenios/inb.png' },
      { id: 11, name: 'Mediservice', imageUrl: 'assets/images/convenios/mediservice.png' },
      { id: 12, name: 'NotreDame Intermédica', imageUrl: 'assets/images/convenios/notredame.png' },
      { id: 13, name: 'Saúde Petrobras', imageUrl: 'assets/images/convenios/petrobras.png' },
      { id: 14, name: 'Policlin Saúde', imageUrl: 'assets/images/convenios/policlin.png' },
      { id: 15, name: 'Porto Seguro Saúde', imageUrl: 'assets/images/convenios/porto.png' },
      { id: 16, name: 'Santa Casa Saúde', imageUrl: 'assets/images/convenios/santacasa.png' },
      { id: 17, name: 'S.P.A. Saúde', imageUrl: 'assets/images/convenios/spa.png' },
      { id: 18, name: 'SulAmérica Saúde', imageUrl: 'assets/images/convenios/sulamerica.png' },
      { id: 19, name: 'Total MedCare', imageUrl: 'assets/images/convenios/totalmedcare.png' },
      { id: 20, name: 'Única Saúde', imageUrl: 'assets/images/convenios/unica.png' },
      { id: 21, name: 'Vivest', imageUrl: 'assets/images/convenios/vivest.png' }
    ];

    // Ordena por nome (opcional)
    this.convenios.sort((a, b) => a.name.localeCompare(b.name));
  }

  /**
   * TrackBy para melhorar performance do *ngFor.
   */
  trackByConvenio(index: number, convenio: Convenio): number {
    return convenio.id;
  }

  /**
   * Define uma imagem fallback caso a original falhe.
   */
  onImageError(event: Event): void {
    const element = event.target as HTMLImageElement;
    element.src = this.fallbackImage;
  }
}

