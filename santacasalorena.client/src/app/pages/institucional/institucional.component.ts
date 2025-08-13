import { Component } from '@angular/core';

interface Secao {
  titulo: string;
  subtitulo?: string;
  texto?: string;
  paragrafos?: string[];
}

interface Valor {
  icon: string;
  color: string;
  title: string;
  description: string;
}

interface TimelineItem {
  year: string;
  title: string;
  description: string;
}

interface Certificacao {
  icon: string;
  color: string;
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
  hero: Secao = {
    titulo: 'Institucional',
    subtitulo: '150 anos de história, tradição e dedicação à saúde'
  };

  historia: Secao = {
    titulo: 'Nossa História',
    paragrafos: [
      `A Santa Casa de Misericórdia de Lorena foi fundada em 1874 pelas Irmãs de São José de Chambéry,
      com o objetivo de prestar assistência médica e hospitalar à população da região do Vale do Paraíba.
      Ao longo de seus 150 anos de existência, a instituição se consolidou como referência em saúde,
      sempre pautada pelos valores cristãos de caridade, solidariedade e amor ao próximo.`,

      `Durante mais de um século e meio, a Santa Casa de Lorena tem sido um pilar fundamental na
      prestação de serviços de saúde para a comunidade local e regional. Nossa trajetória é marcada
      por constantes investimentos em infraestrutura, tecnologia e capacitação profissional, sempre
      com o objetivo de oferecer o melhor atendimento possível aos nossos pacientes.`,

      `Hoje, somos reconhecidos como um hospital de referência, oferecendo serviços de alta complexidade
      e mantendo nosso compromisso original de servir a todos, independentemente de sua condição social
      ou econômica. Nossa missão continua sendo a mesma: cuidar da vida com dedicação, competência e amor.`
    ]
  };

  valoresPrincipais: Valor[] = [
    { icon: 'bi-bullseye', color: '#0d6efd', title: 'Missão', description: 'Prestar assistência médica e hospitalar de qualidade, com humanização e excelência técnica, promovendo a saúde e o bem-estar da comunidade, fundamentados nos valores cristãos de caridade e solidariedade.' },
    { icon: 'bi-eye', color: '#198754', title: 'Visão', description: 'Ser reconhecida como referência regional em saúde, destacando-se pela excelência no atendimento, inovação tecnológica e responsabilidade social, mantendo nossa tradição de 150 anos de dedicação à vida.' },
    { icon: 'bi-heart-fill', color: '#dc3545', title: 'Valores', description: 'Humanização, ética, excelência, compromisso social, respeito à vida, transparência, trabalho em equipe e melhoria contínua.' }
  ];

  valoresAcao: Valor[] = [
    { icon: 'bi-heart-fill', color: '#f8d7da', title: 'Humanização', description: 'Tratamento humanizado e acolhedor para todos os pacientes e familiares.' },
    { icon: 'bi-award-fill', color: '#e7f1ff', title: 'Excelência', description: 'Busca constante pela qualidade e excelência em todos os serviços prestados.' },
    { icon: 'bi-people-fill', color: '#d1e7dd', title: 'Compromisso Social', description: 'Responsabilidade social e compromisso com a comunidade de Lorena e região.' },
    { icon: 'bi-handshake', color: '#fff3cd', title: 'Ética', description: 'Conduta ética e transparente em todas as relações e procedimentos.' }
  ];

  timeline: TimelineItem[] = [
    { year: '1874', title: 'Fundação', description: 'Fundação da Santa Casa de Misericórdia de Lorena pelas Irmãs de São José de Chambéry.' },
    { year: '1900', title: 'Expansão', description: 'Ampliação das instalações e início dos primeiros serviços especializados.' },
    { year: '1950', title: 'Modernização', description: 'Modernização dos equipamentos e implementação de novos tratamentos.' },
    { year: '2000', title: 'Tecnologia', description: 'Investimento em tecnologia de ponta e equipamentos de última geração.' },
    { year: '2024', title: '150 Anos', description: 'Celebração de 150 anos de dedicação à saúde da comunidade.' }
  ];

  certificacoes: Certificacao[] = [
    { icon: 'bi-award', color: '#ffc107', title: 'Selo Hospital Amigo do Idoso', description: 'Reconhecimento pela qualidade no atendimento à população idosa.' },
    { icon: 'bi-heart-pulse-fill', color: '#198754', title: 'Acreditação Hospitalar', description: 'Certificação de qualidade e segurança nos processos hospitalares.' },
    { icon: 'bi-people-fill', color: '#0d6efd', title: 'Responsabilidade Social', description: 'Reconhecimento pelas ações sociais e ambientais desenvolvidas.' }
  ];
}
