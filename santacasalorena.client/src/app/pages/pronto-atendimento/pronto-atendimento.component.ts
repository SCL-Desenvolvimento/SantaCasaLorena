import { Component } from '@angular/core';

@Component({
  selector: 'app-pronto-atendimento',
  standalone: false,
  templateUrl: './pronto-atendimento.component.html',
  styleUrl: './pronto-atendimento.component.css'
})
export class ProntoAtendimentoComponent {
  riscos = [
    {
      titulo: 'Emergência',
      cor: 'VERMELHO',
      descricao: 'ALTO RISCO E VIDA',
      tempo: 'ATENDIMENTO IMEDIATO',
      bgClass: 'bg-danger'
    },
    {
      titulo: 'Urgência',
      cor: 'AMARELO',
      descricao: 'RISCO MODERADO',
      tempo: 'ATENDIMENTO EM ATÉ 60 MINUTOS',
      bgClass: 'bg-warning'
    },
    {
      titulo: 'Pouca Urgência',
      cor: 'VERDE',
      descricao: 'RISCO BAIXO',
      tempo: 'ATENDIMENTO EM ATÉ 2 HORAS',
      bgClass: 'bg-success'
    },
    {
      titulo: 'Não Urgência',
      cor: 'AZUL',
      descricao: 'SITUAÇÃO NÃO AGUDA',
      tempo: 'ATENDIMENTO EM ATÉ 4 HORAS',
      bgClass: 'bg-primary'
    }
  ];
}
