import { Component, Input } from '@angular/core';
import { Providers } from '../../../models/provider'; // Alterado de Provider para Providers

@Component({
  selector: 'app-provider-card',
  standalone: false,
  templateUrl: './provider-card.component.html',
  styleUrls: ['./provider-card.component.css']
})
export class ProviderCardComponent {
  @Input() provider!: Providers;

  // Os métodos getStatusBadgeClass e getStatusText foram removidos
  // pois o modelo original 'Providers' não possui o campo 'status'.
  // O HTML correspondente também precisará ser ajustado.
}

