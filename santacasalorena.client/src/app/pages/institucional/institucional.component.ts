import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

interface Valor {
  icon: string;   // classe do Bootstrap Icons, ex.: 'bi-heart-fill'
  title: string;
  description: string;
}

interface TimelineItem {
  year: string;
  title: string;
  description: string;
}

@Component({
  selector: 'app-institucional',
  standalone: false,
  templateUrl: './institucional.component.html',
  styleUrl: './institucional.component.css'
})
export class InstitucionalComponent {
  values: Valor[] = [
    {
      icon: 'bi-heart-fill',
      title: 'Humanização',
      description: 'Tratamento humanizado e acolhedor para todos os pacientes e familiares.'
    },
    {
      icon: 'bi-award-fill',
      title: 'Excelência',
      description: 'Busca constante pela qualidade e excelência em todos os serviços prestados.'
    },
    {
      icon: 'bi-people-fill',
      title: 'Compromisso Social',
      description: 'Responsabilidade social e compromisso com a comunidade de Lorena e região.'
    },
    {
      icon: 'bi-handshake',
      title: 'Ética',
      description: 'Conduta ética e transparente em todas as relações e procedimentos.'
    }
  ];

  timeline: TimelineItem[] = [
    {
      year: '1874',
      title: 'Fundação',
      description: 'Fundação da Santa Casa de Misericórdia de Lorena pelas Irmãs de São José de Chambéry.'
    },
    {
      year: '1900',
      title: 'Expansão',
      description: 'Ampliação das instalações e início dos primeiros serviços especializados.'
    },
    {
      year: '1950',
      title: 'Modernização',
      description: 'Modernização dos equipamentos e implementação de novos tratamentos.'
    },
    {
      year: '2000',
      title: 'Tecnologia',
      description: 'Investimento em tecnologia de ponta e equipamentos de última geração.'
    },
    {
      year: '2024',
      title: '150 Anos',
      description: 'Celebração de 150 anos de dedicação à saúde da comunidade.'
    }
  ];
}
