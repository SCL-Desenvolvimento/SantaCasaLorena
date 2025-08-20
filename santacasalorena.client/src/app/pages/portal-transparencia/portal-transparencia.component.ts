import { Component, OnInit } from '@angular/core';

interface ConvenioItem {
  id: string;
  nome: string;
  tipo: string;
  periodo: string;
  url?: string;
}

@Component({
  selector: 'app-portal-transparencia',
  standalone: false,
  templateUrl: './portal-transparencia.component.html',
  styleUrls: ['./portal-transparencia.component.css']
})
export class PortalTransparenciaComponent implements OnInit {

  conveniosEstaduais: ConvenioItem[] = [
    {
      id: 'conv-383-2020',
      nome: 'Convênio 383',
      tipo: 'Estadual',
      periodo: '2020',
      url: '#'
    },
    {
      id: 'conv-102-2021',
      nome: 'Convênio 102',
      tipo: 'Estadual',
      periodo: '2021',
      url: '#'
    },
    {
      id: 'conv-350-2020-2023',
      nome: 'Convênio 350',
      tipo: 'Estadual',
      periodo: '2020-2023',
      url: '#'
    },
    {
      id: 'conv-285-2020-2023',
      nome: 'Convênio 285',
      tipo: 'Estadual',
      periodo: '2020-2023',
      url: '#'
    }
  ];

  conveniosMunicipais: ConvenioItem[] = [
    {
      id: 'termo-aditivo-23',
      nome: 'Termo Aditivo 23 - Convênio 01',
      tipo: 'Municipal',
      periodo: '2021',
      url: '#'
    },
    {
      id: 'conv-1-2021',
      nome: 'Convênio 1',
      tipo: 'Municipal',
      periodo: '2021',
      url: '#'
    }
  ];

  emendas: ConvenioItem[] = [
    {
      id: 'emendas-166-512-927',
      nome: 'Emendas Parlamentares 166 - 512 - 927',
      tipo: 'Emenda',
      periodo: 'Creditadas em 2023',
      url: '#'
    },
    {
      id: 'emenda-349',
      nome: 'Emenda Parlamentar 349',
      tipo: 'Emenda',
      periodo: 'Creditada em 2022',
      url: '#'
    }
  ];

  constructor() { }

  ngOnInit(): void {
    // Inicialização do componente
    this.loadTransparencyData();
  }

  /**
   * Carrega os dados de transparência
   */
  private loadTransparencyData(): void {
    // Aqui você pode implementar a lógica para carregar dados de uma API
    console.log('Dados de transparência carregados');
  }

  /**
   * Abre o portal da transparência em uma nova aba
   */
  openTransparencyPortal(): void {
    // URL do portal da transparência - substitua pela URL real
    const transparencyUrl = 'https://www.santacasalorena.org.br/portal-transparencia';

    window.open(transparencyUrl, '_blank', 'noopener,noreferrer');
  }

  /**
   * Faz o download de um convênio específico
   * @param convenio - Item do convênio a ser baixado
   */
  downloadConvenio(convenio: ConvenioItem): void {
    if (convenio.url && convenio.url !== '#') {
      // Se há uma URL válida, abre o link
      window.open(convenio.url, '_blank', 'noopener,noreferrer');
    } else {
      // Implementar lógica de download ou mostrar mensagem
      this.showDownloadMessage(convenio);
    }
  }

  /**
   * Exibe mensagem sobre o download
   * @param convenio - Item do convênio
   */
  private showDownloadMessage(convenio: ConvenioItem): void {
    alert(`Download do ${convenio.nome} (${convenio.periodo}) será disponibilizado em breve.`);

    // Aqui você pode implementar uma lógica mais sofisticada:
    // - Mostrar um modal
    // - Fazer uma requisição para gerar o documento
    // - Registrar o interesse do usuário
    console.log(`Solicitação de download: ${convenio.nome}`);
  }

  /**
   * Navega para uma seção específica da página
   * @param sectionId - ID da seção
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
   * Filtra convênios por tipo
   * @param tipo - Tipo de convênio a filtrar
   */
  filterConveniosByType(tipo: string): ConvenioItem[] {
    const allConvenios = [
      ...this.conveniosEstaduais,
      ...this.conveniosMunicipais,
      ...this.emendas
    ];

    return allConvenios.filter(convenio =>
      convenio.tipo.toLowerCase() === tipo.toLowerCase()
    );
  }

  /**
   * Busca convênios por termo
   * @param searchTerm - Termo de busca
   */
  searchConvenios(searchTerm: string): ConvenioItem[] {
    if (!searchTerm.trim()) {
      return [];
    }

    const allConvenios = [
      ...this.conveniosEstaduais,
      ...this.conveniosMunicipais,
      ...this.emendas
    ];

    const term = searchTerm.toLowerCase();

    return allConvenios.filter(convenio =>
      convenio.nome.toLowerCase().includes(term) ||
      convenio.periodo.toLowerCase().includes(term) ||
      convenio.tipo.toLowerCase().includes(term)
    );
  }

  /**
   * Obtém estatísticas dos convênios
   */
  getConveniosStats(): { total: number; estaduais: number; municipais: number; emendas: number } {
    return {
      total: this.conveniosEstaduais.length + this.conveniosMunicipais.length + this.emendas.length,
      estaduais: this.conveniosEstaduais.length,
      municipais: this.conveniosMunicipais.length,
      emendas: this.emendas.length
    };
  }

  /**
   * Verifica se um convênio está disponível para download
   * @param convenio - Item do convênio
   */
  isDownloadAvailable(convenio: ConvenioItem): boolean {
    return convenio.url !== undefined && convenio.url !== '#';
  }

  /**
   * Formata o nome do convênio para exibição
   * @param convenio - Item do convênio
   */
  formatConvenioName(convenio: ConvenioItem): string {
    return `${convenio.nome} - ${convenio.periodo}`;
  }

  /**
   * Obtém a classe CSS para o badge do convênio
   * @param tipo - Tipo do convênio
   */
  getBadgeClass(tipo: string): string {
    switch (tipo.toLowerCase()) {
      case 'estadual':
        return 'bg-success';
      case 'municipal':
        return 'bg-info';
      case 'emenda':
        return 'bg-warning text-dark';
      default:
        return 'bg-secondary';
    }
  }

  /**
   * Obtém o ícone para o tipo de convênio
   * @param tipo - Tipo do convênio
   */
  getConvenioIcon(tipo: string): string {
    switch (tipo.toLowerCase()) {
      case 'estadual':
        return 'fas fa-building';
      case 'municipal':
        return 'fas fa-city';
      case 'emenda':
        return 'fas fa-file-contract';
      default:
        return 'fas fa-file';
    }
  }
}

