import { Component, OnInit } from '@angular/core';

interface UnidadeInfo {
  label: string;
  valor: string;
}

interface Unidade {
  titulo: string;
  descricao: string;
  icon: string;
  leitos?: number;
  leitosSus?: number;
  informacoes?: UnidadeInfo[];
}

@Component({
  selector: 'app-unidades-de-internacao',
  standalone: false,
  templateUrl: './unidades-de-internacao.component.html',
  styleUrls: ['./unidades-de-internacao.component.css']
})
export class UnidadesDeInternacaoComponent implements OnInit {

  // Mock das unidades
  unidades: Unidade[] = [
    {
      titulo: 'UTI – NEO – Unidade de Assistência NEO-Natal – UNAN',
      descricao: 'Inaugurada em 2006, a unidade é composta por um berçário comum e uma Unidade de Cuidados Intermediários (Semi-Intensivos), oferecendo total segurança e qualidade aos partos realizados.',
      icon: 'fas fa-baby',
      informacoes: [
        { label: 'Coordenador Médico', valor: 'Dr. José Waldyr Fleury de Azevedo' },
        { label: 'Neonatologista Responsável', valor: 'Dr. Daniel Porte Fernandes' },
        { label: 'Fisioterapeuta responsável', valor: 'Dra. Aline Pereira de Souza' }
      ]
    },
    {
      titulo: 'Clínica Cirúrgica e Ortopédica',
      descricao: 'Leitos com padrão de conforto e qualidade, destinados aos pacientes do Sistema Único de Saúde (SUS), entre outros convênios.',
      icon: 'fas fa-user-md',
      leitos: 25
    },
    {
      titulo: 'Maternidade BABYMED',
      descricao: 'Apartamentos de alto padrão, destinados ao público beneficiário de planos de saúde e/ou particulares, com estrutura física, tecnológica e de apoio necessários a um serviço de excelência.',
      icon: 'fas fa-heart',
      leitos: 7
    },
    {
      titulo: 'UTI - Unidade de Terapia Intensiva',
      descricao: 'Unidade de Terapia Intensiva equipada com os mais modernos equipamentos e tecnologia de ponta para cuidados intensivos.',
      icon: 'fas fa-heartbeat',
      leitos: 10,
      leitosSus: 7
    },
    {
      titulo: 'Pediatria SUS',
      descricao: 'Leitos especializados voltados ao atendimento pediátrico para pacientes do Sistema Único de Saúde.',
      icon: 'fas fa-child',
      leitos: 16
    },
    {
      titulo: 'Centro Cirúrgico',
      descricao: 'Centro cirúrgico moderno e equipado para realizar diversos tipos de procedimentos cirúrgicos com segurança e qualidade.',
      icon: 'fas fa-procedures',
      leitos: 10,
      leitosSus: 7
    }
  ];

  // Estatísticas
  totalLeitos: number = 0;
  leitosSus: number = 0;
  apartamentosPrivados: number = 0;

  ngOnInit(): void {
    this.calcularEstatisticas();
  }

  private calcularEstatisticas(): void {
    this.totalLeitos = this.unidades.reduce((total, u) => total + (u.leitos || 0), 0);
    this.leitosSus = this.unidades.reduce((total, u) => total + (u.leitosSus || 0), 0);

    const maternidade = this.unidades.find(u => u.titulo.includes('BABYMED'));
    this.apartamentosPrivados = maternidade?.leitos || 0;
  }
}
