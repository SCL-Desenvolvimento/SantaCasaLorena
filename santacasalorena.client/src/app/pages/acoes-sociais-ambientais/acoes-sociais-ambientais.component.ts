import { Component, OnInit } from '@angular/core';

interface ContentSection {
  id: string;
  title: string;
  content: string;
  image: string;
}

interface VoluntariadoStat {
  number: string;
  label: string;
}

interface TimelineItem {
  year: string;
  title: string;
  description: string;
  icon: string;
}

interface Value {
  title: string;
  description: string;
  icon: string;
}
@Component({
  selector: 'app-acoes-sociais-ambientais',
  standalone: false,
  templateUrl: './acoes-sociais-ambientais.component.html',
  styleUrl: './acoes-sociais-ambientais.component.css'
})
export class AcoesSociaisAmbientaisComponent implements OnInit {

  pageTitle: string = 'Ações Sociais Ambientais';
  pageSubtitle: string = 'Desenvolvemos atividades voluntárias através de uma organização regulamentada, prestando assistência religiosa aos pacientes de diversas religiões.';

  contentSections: ContentSection[] = [
    {
      id: 'acoes-voluntarias',
      title: 'Ações Voluntárias e Apoio Religioso',
      content: `
        <p>A Santa Casa de Lorena desenvolve atividades voluntárias em sua unidade através de uma organização regulamentada, e presta assistência religiosa aos pacientes de diversas religiões.</p>
        <p>Nosso compromisso vai além do cuidado médico, oferecendo suporte espiritual e emocional para pacientes e familiares em momentos de vulnerabilidade.</p>
      `,
      image: 'assets/img/paginas/acoes_sociais_ambientais.jpg'
    },
    {
      id: 'ministro-eucaristia',
      title: 'Ministro da Eucaristia e Demais Religiões',
      content: `
        <p>A Santa Casa de Lorena conta com o apoio voluntário de ministros da eucaristia, que prestam assistência religiosa ao paciente com o sacramento da eucaristia distribuindo o sacramento da comunhão e trabalhando de maneira integrada ao serviço de capelania da Santa Casa de Lorena.</p>
        <p>O Hospital recebe representantes das demais religiões conforme demanda, obtendo autorização prévia junto ao Serviço Social, garantindo o respeito à diversidade religiosa e cultural de nossos pacientes.</p>
      `,
      image: 'assets/img/paginas/sociais2-img.jpg'
    },
    {
      id: 'voluntariado',
      title: 'Voluntariado',
      content: `
        <p>O voluntariado sempre esteve presente nas atividades da Santa Casa de Lorena. Desde 1989 esse trabalho é desenvolvido, mas somente com o passar do tempo essa filosofia foi ganhando mais força e possibilitou aumentar o bem-estar dos pacientes por meio de apoio, orientação e disposição em doar-se.</p>
        <p>Tudo começou bem tímido e singelo. O Grupo de Voluntariado não tinha uma sede específica, dependia de raras disponibilidades de algumas salas da Santa Casa, e esse trabalho voluntário se resumia em almoços e jantares para arrecadar fundos.</p>
        <p>Com a chegada da nova administração, o voluntariado ganhou mais credibilidade e foi possível investir nesse serviço. Foi cedido um espaço dentro da instituição, onde hoje é realizado o bazar de peças usadas. No local é possível adquirir roupas e até móveis com preços competitivos.</p>
        <p>O trabalho das voluntárias é todo regulamentado, com organização de registro e estatutos e independente da administração da Santa Casa. A cada três anos é feita uma eleição, para definição dos conselheiros e diretores.</p>
        <p>Além disso, as voluntárias possuem total autonomia para organizar e direcionar potenciais de atuação em diversas áreas e promover mecanismos de impacto social, refletindo em um trabalho positivo para toda sociedade lorenense.</p>
      `,
      image: 'assets/img/paginas/sociais3-img.jpg'
    }
  ];


  voluntariadoStats: VoluntariadoStat[] = [
    {
      number: '216',
      label: 'Voluntários Cadastrados'
    },
    {
      number: '13',
      label: 'Conselheiros'
    },
    {
      number: '6',
      label: 'Diretores'
    },
    {
      number: '35+',
      label: 'Anos de História'
    }
  ];

  timelineItems: TimelineItem[] = [
    {
      year: '1989',
      title: 'Início do Voluntariado',
      description: 'Primeiros passos do trabalho voluntário na Santa Casa de Lorena, com atividades simples de arrecadação de fundos.',
      icon: 'fas fa-seedling'
    },
    {
      year: '2000s',
      title: 'Crescimento e Estruturação',
      description: 'O voluntariado ganha mais força e credibilidade, expandindo suas atividades e impacto na comunidade.',
      icon: 'fas fa-chart-line'
    },
    {
      year: '2010s',
      title: 'Nova Administração',
      description: 'Com a nova administração, o voluntariado recebe maior apoio e investimento, ganhando espaço próprio.',
      icon: 'fas fa-building'
    },
    {
      year: 'Hoje',
      title: 'Organização Consolidada',
      description: 'Voluntariado totalmente regulamentado com 216 voluntários, bazar permanente e eleições democráticas.',
      icon: 'fas fa-users'
    }
  ];

  values: Value[] = [
    {
      title: 'Solidariedade',
      description: 'Promovemos o espírito de solidariedade através de ações voluntárias que beneficiam pacientes e comunidade.',
      icon: 'bi-people'
    },
    {
      title: 'Respeito à Diversidade',
      description: 'Acolhemos e respeitamos todas as religiões e culturas, oferecendo assistência espiritual inclusiva.',
      icon: 'bi-peace'
    },
    {
      title: 'Transparência',
      description: 'Mantemos total transparência em nossas ações, com organização regulamentada e prestação de contas.',
      icon: 'bi-eye'
    },
    {
      title: 'Impacto Social',
      description: 'Buscamos gerar impacto positivo na sociedade lorenense através de mecanismos sustentáveis.',
      icon: 'bi-heart'
    },
    {
      title: 'Autonomia',
      description: 'Garantimos autonomia aos voluntários para organizar e direcionar suas atividades de forma independente.',
      icon: 'bi-person-check'
    },
    {
      title: 'Sustentabilidade',
      description: 'Promovemos práticas sustentáveis através do bazar de peças usadas e reutilização de materiais.',
      icon: 'bi-recycle'
    }
  ];

  constructor() { }

  ngOnInit(): void {
    // Inicialização do componente
    this.loadComponentData();
  }

  private loadComponentData(): void {
    // Método para carregar dados adicionais se necessário
    // Pode ser usado para buscar dados de uma API no futuro
    console.log('Componente Ações Sociais Ambientais carregado com sucesso');
  }

  onVolunteerClick(): void {
    // Método para lidar com o clique no botão "Seja Voluntário"
    // Pode redirecionar para uma página de cadastro ou abrir um modal
    console.log('Botão Seja Voluntário clicado');

    // Exemplo de implementação:
    // this.router.navigate(['/voluntario/cadastro']);
    // ou
    // this.openVolunteerModal();

    // Por enquanto, apenas exibe um alerta
    alert('Funcionalidade em desenvolvimento. Entre em contato conosco para se tornar voluntário!');
  }

  onContactClick(): void {
    // Método para lidar com o clique no botão "Entre em Contato"
    // Pode redirecionar para uma página de contato ou abrir um modal
    console.log('Botão Entre em Contato clicado');

    // Exemplo de implementação:
    // this.router.navigate(['/contato']);
    // ou
    // this.openContactModal();

    // Por enquanto, apenas exibe um alerta
    alert('Entre em contato conosco:\nTelefone: (12) 3159-3344\nWhatsApp: (12) 98891-5484');
  }

  // Método auxiliar para scroll suave até uma seção específica
  scrollToSection(sectionId: string): void {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  }

  // Método para animações de entrada dos elementos
  onElementInView(element: HTMLElement): void {
    element.classList.add('animate-in');
  }
}
