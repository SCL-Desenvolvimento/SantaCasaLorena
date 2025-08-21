import { Component, OnInit } from '@angular/core';

// Interfaces para tipagem dos dados
interface EmendaValue {
  year: number;
  amount: number;
  amountText: string;
  updateDate?: string;
  status: 'current' | 'completed' | 'pending';
}

interface EmendaCategory {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  values: EmendaValue[];
}

interface SummaryData {
  year: number;
  status: 'current' | 'completed';
  description: string;
  federal: number;
  state: number;
  municipal: number;
  total: number;
  emoji: string;
}

@Component({
  selector: 'app-emendas',
  standalone: false,
  templateUrl: './emendas.component.html',
  styleUrls: ['./emendas.component.css']
})
export class EmendasComponent implements OnInit {

  // Dados das categorias de emendas
  federalEmendas: EmendaCategory = {
    id: 'federal',
    title: 'RANKING DE EMENDAS DA UNIÃO',
    subtitle: 'DEPUTADOS FEDERAIS E SENADORES',
    description: 'O apoio desses parlamentares, tem ajudado a instituição a oferecer atendimento de qualidade e promover a saúde em Lorena.',
    values: [
      {
        year: 2025,
        amount: 3400000.00,
        amountText: 'TRÊS MILHÕES E QUATROCENTOS MIL REAIS',
        updateDate: '20/07/2025',
        status: 'current'
      },
      {
        year: 2024,
        amount: 865000.00,
        amountText: 'OITOCENTOS E SESSENTA E CINCO MIL REAIS',
        status: 'completed'
      },
      {
        year: 2023,
        amount: 1200000.00,
        amountText: 'UM MILHÃO E DUZENTOS MIL REAIS',
        status: 'completed'
      }
    ]
  };

  stateEmendas: EmendaCategory = {
    id: 'state',
    title: 'RANKING DAS EMENDAS DO ESTADO - SP',
    subtitle: 'DEPUTADOS ESTADUAIS',
    description: 'O apoio desses parlamentares, tem ajudado a instituição a oferecer atendimento de qualidade e promover a saúde em Lorena.',
    values: [
      {
        year: 2025,
        amount: 1200000.00,
        amountText: 'UM MILHÃO E DUZENTOS MIL REAIS',
        updateDate: '20/07/2025',
        status: 'current'
      },
      {
        year: 2024,
        amount: 1350000.00,
        amountText: 'UM MILHÃO, TREZENTOS E CINQUENTA MIL REAIS',
        status: 'completed'
      },
      {
        year: 2023,
        amount: 500000.00,
        amountText: 'QUINHENTOS MIL REAIS',
        status: 'completed'
      }
    ]
  };

  municipalEmendas: EmendaCategory = {
    id: 'municipal',
    title: 'EMENDAS MUNICIPAIS',
    subtitle: 'VEREADORES DE LORENA',
    description: 'O apoio desses parlamentares, tem ajudado a instituição a oferecer atendimento de qualidade e promover a saúde em Lorena.',
    values: [
      {
        year: 2025,
        amount: 0,
        amountText: 'VALOR A SER DIVULGADO EM OUTUBRO',
        status: 'pending'
      },
      {
        year: 2024,
        amount: 2891960.84,
        amountText: 'RECURSOS ENVIADOS PELOS VEREADORES DE LORENA',
        status: 'completed'
      },
      {
        year: 2023,
        amount: 1902000.00,
        amountText: 'RECURSOS ENVIADOS PELOS VEREADORES DE LORENA',
        status: 'completed'
      }
    ]
  };

  // Dados do resumo
  summaryData: SummaryData[] = [
    {
      year: 2025,
      status: 'current',
      emoji: '🔄',
      description: 'Até o momento, as emendas registradas em 2025 já somam cifras relevantes, com indicações em diferentes estágios de tramitação.',
      federal: 3400000.00,
      state: 1200000.00,
      municipal: 1461304.93,
      total: 6061304.93
    },
    {
      year: 2024,
      status: 'completed',
      emoji: '✅',
      description: 'O ano de 2024 contou com um volume significativo de indicações, envolvendo parlamentares estaduais, federais e vereadores. Parte dessas emendas já foi recebida, e outras seguem em análise técnica ou diligência.',
      federal: 865000.00,
      state: 1350000.00,
      municipal: 2891960.84,
      total: 5106960.84
    },
    {
      year: 2023,
      status: 'completed',
      emoji: '✅',
      description: 'Em 2023, a Santa Casa de Lorena foi contemplada com diversas emendas parlamentares de deputados estaduais, federais, senadores e da Câmara Municipal. Todas as emendas deste ano foram recebidas com sucesso.',
      federal: 1200000.00,
      state: 500000.00,
      municipal: 1902000.00,
      total: 3602000.00
    }
  ];

  // Informações gerais
  mandatePeriod: string = '2023/2026';
  lastUpdate: string = '20/07/2025';
  finalUpdateDate: string = '1º de agosto de 2025';
  organizationName: string = 'FRL Assessoria e Consultoria';
  institutionName: string = 'Irmandade da Santa Casa de Misericórdia de Lorena/SP';

  constructor() { }

  ngOnInit(): void {
    // Inicialização do componente
    this.loadEmendas();
  }

  /**
   * Carrega os dados das emendas
   */
  loadEmendas(): void {
    // Aqui você pode implementar a lógica para carregar dados de uma API
    console.log('Dados das emendas carregados');
  }

  /**
   * Formata valor monetário para exibição
   */
  formatCurrency(value: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2
    }).format(value);
  }

  /**
   * Formata valor monetário sem símbolo
   */
  formatAmount(value: number): string {
    return new Intl.NumberFormat('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  }

  /**
   * Retorna a classe CSS baseada no status da emenda
   */
  getStatusClass(status: string): string {
    switch (status) {
      case 'current':
        return 'current-year';
      case 'completed':
        return 'completed-year';
      case 'pending':
        return 'pending-year';
      default:
        return '';
    }
  }

  /**
   * Retorna a classe CSS para o valor baseado na categoria
   */
  getValueClass(categoryId: string): string {
    switch (categoryId) {
      case 'federal':
        return 'federal-value';
      case 'state':
        return 'state-value';
      case 'municipal':
        return 'municipal-value';
      default:
        return '';
    }
  }

  /**
   * Calcula o total geral de todas as emendas
   */
  getTotalGeral(): number {
    return this.summaryData.reduce((total, year) => total + year.total, 0);
  }

  /**
   * Retorna o ano atual
   */
  getCurrentYear(): number {
    return new Date().getFullYear();
  }

  /**
   * Verifica se o ano é o atual
   */
  isCurrentYear(year: number): boolean {
    return year === this.getCurrentYear();
  }

  /**
   * Retorna mensagem de status baseada no ano
   */
  getStatusMessage(year: number): string {
    if (this.isCurrentYear(year)) {
      return `Atualizado até ${this.lastUpdate}`;
    }
    return 'Dados consolidados';
  }

  /**
   * Retorna informações de atualização
   */
  getUpdateInfo(): string {
    return `Última atualização: ${this.lastUpdate}`;
  }

  /**
   * Retorna informações sobre próximas atualizações
   */
  getNextUpdateInfo(): string {
    return `Próxima atualização completa: ${this.finalUpdateDate}`;
  }

  /**
   * Método para scroll suave até uma seção
   */
  scrollToSection(sectionId: string): void {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  }

  /**
   * Método para exportar dados (futuro)
   */
  exportData(format: 'pdf' | 'excel'): void {
    // Implementação futura para exportação de dados
    console.log(`Exportando dados em formato ${format}`);
  }

  /**
   * Método para compartilhar dados
   */
  shareData(): void {
    if (navigator.share) {
      navigator.share({
        title: 'Emendas da Santa Casa de Lorena',
        text: 'Acompanhe o ranking das emendas parlamentares destinadas à Santa Casa de Lorena',
        url: window.location.href
      });
    } else {
      // Fallback para navegadores que não suportam Web Share API
      const url = window.location.href;
      navigator.clipboard.writeText(url).then(() => {
        alert('Link copiado para a área de transferência!');
      });
    }
  }

  /**
   * Método para filtrar dados por ano
   */
  filterByYear(year: number): void {
    // Implementação futura para filtros
    console.log(`Filtrando dados do ano ${year}`);
  }

  /**
   * Método para buscar parlamentar
   */
  searchParliamentarian(name: string): void {
    // Implementação futura para busca
    console.log(`Buscando parlamentar: ${name}`);
  }

  /**
   * Retorna cor do tema baseada na categoria
   */
  getThemeColor(categoryId: string): string {
    switch (categoryId) {
      case 'federal':
        return '#2196f3';
      case 'state':
        return '#9c27b0';
      case 'municipal':
        return '#4caf50';
      default:
        return '#2a5298';
    }
  }

  /**
   * Método para animação de entrada dos elementos
   */
  animateOnScroll(): void {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('fade-in-up');
        }
      });
    });

    const elements = document.querySelectorAll('.year-card, .summary-card');
    elements.forEach(el => observer.observe(el));
  }

  /**
   * Lifecycle hook - após a view ser inicializada
   */
  ngAfterViewInit(): void {
    // Inicializa animações
    setTimeout(() => {
      this.animateOnScroll();
    }, 100);
  }
}

