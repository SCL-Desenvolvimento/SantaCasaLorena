import { Component } from '@angular/core';

@Component({
  selector: 'app-clinica-emilia',
  standalone: false,
  templateUrl: './clinica-emilia.component.html',
  styleUrl: './clinica-emilia.component.css'
})
export class ClinicaEmiliaComponent {
  // Estrutura e Comodidades
  estruturas = [
    {
      titulo: '27 Leitos',
      descricao: 'Capacidade total para atendimento',
      icon: 'bi-hospital'
    },
    {
      titulo: '15 Apartamentos Individuais',
      descricao: 'Privacidade e conforto personalizado',
      icon: 'bi-door-open'
    },
    {
      titulo: '6 Enfermarias',
      descricao: '2 leitos cada uma',
      icon: 'bi-people'
    },
    {
      titulo: '3 Apartamentos VIP',
      descricao: 'Com ampla antessala e espaço de convivência',
      icon: 'bi-star'
    }
  ];

  // Comodidades Especiais
  amenidades = [
    {
      titulo: 'Painéis Decorativos',
      icon: 'fas fa-palette'
    },
    {
      titulo: 'Frigobar',
      icon: 'fas fa-snowflake'
    },
    {
      titulo: 'Televisores',
      icon: 'fas fa-tv'
    },
    {
      titulo: 'Sofá Cama',
      icon: 'fas fa-couch'
    }
  ];
}
