import { Component, OnInit } from '@angular/core';

interface ServiceInfo {
  id: string;
  title: string;
  description: string;
  icon: string;
  featured?: boolean;
  additionalInfo?: any;
}

interface HospitalStats {
  totalBeds: number;
  susBeds: number;
  utiAdultBeds: number;
  utiAdultSusBeds: number;
  surgicalRooms: number;
  monthlySurgeries: number;
}

@Component({
  selector: 'app-capacidade-instalacao-e-producao',
  standalone: false,
  templateUrl: './capacidade-instalacao-e-producao.component.html',
  styleUrls: ['./capacidade-instalacao-e-producao.component.css']
})
export class CapacidadeInstalacaoEProducaoComponent implements OnInit {

  // Dados estatísticos do hospital
  hospitalStats: HospitalStats = {
    totalBeds: 145,
    susBeds: 98,
    utiAdultBeds: 10,
    utiAdultSusBeds: 7,
    surgicalRooms: 5,
    monthlySurgeries: 32
  };

  // Informações dos serviços
  services: ServiceInfo[] = [
    {
      id: 'internacao',
      title: 'Internação',
      description: 'Atendemos basicamente a demanda gerada pelo pronto-socorro, além de uma menor parcela de demanda eletiva referenciada pela Rede Municipal.',
      icon: 'fas fa-bed'
    },
    {
      id: 'uti-adulto',
      title: 'UTI Adulto Nível II',
      description: `Dispomos de ${this.hospitalStats.utiAdultBeds} leitos, dos quais ${this.hospitalStats.utiAdultSusBeds} estão ofertados ao SUS.`,
      icon: 'fas fa-heartbeat'
    },
    {
      id: 'uti-neonatal',
      title: 'UTI Neonatal',
      description: 'Inaugurada em 2006, a unidade é composta por um berçário comum e uma Unidade de Cuidados Intermediários (Semi-Intensivos), oferecendo total segurança e qualidade aos partos realizados.',
      icon: 'fas fa-baby',
      featured: true,
      additionalInfo: {
        coordinator: 'Dr. José Waldyr Fleury de Azevedo',
        neonatologist: 'Dr. Daniel Porte Fernandes',
        physiotherapist: 'Dra. Aline Pereira de Souza',
        inauguratedYear: 2006
      }
    },
    {
      id: 'convenio-urgencia',
      title: 'Convênio para Atendimento em Urgência e Emergência',
      description: 'Através do Plantão Regulador e mediante disponibilidade de vagas, atendemos casos de urgência e emergência das cidades da região (DRS 17/Taubaté) nas especialidades de Clínica Médica, Cirurgia Geral e Ortopedia.',
      icon: 'fas fa-ambulance'
    },
    {
      id: 'fisioterapia',
      title: 'Fisioterapia',
      description: 'Serviço de Fisioterapia para segmento dos pacientes referenciados pela própria Instituição (Santa Casa).',
      icon: 'fas fa-dumbbell'
    },
    {
      id: 'pro-santa-casa',
      title: 'Pró Santa Casa',
      description: `Atendimento a ${this.hospitalStats.monthlySurgeries} cirurgias por mês, destinadas aos municípios de Lorena, Canas, Cachoeira Paulista e Piquete.`,
      icon: 'fas fa-user-md'
    },
    {
      id: 'sadt',
      title: 'SADT (Ambulatorial e Internação 24 horas)',
      description: 'Serviços de apoio diagnóstico e terapêutico disponíveis 24 horas.',
      icon: 'fas fa-microscope',
      additionalInfo: {
        services: [
          {
            category: 'Imagem (terceirizado)',
            items: ['Raios-X', 'Ultrassom', 'Mamografia', 'Tomografia Computadorizada'],
            icon: 'fas fa-x-ray'
          },
          {
            category: 'Laboratório (terceirizado)',
            items: ['Exames Laboratoriais', 'Microbiológicos Gerais'],
            icon: 'fas fa-flask'
          },
          {
            category: 'Agência Transfusional',
            items: ['Próprio'],
            icon: 'fas fa-tint'
          }
        ]
      }
    },
    {
      id: 'centro-cirurgico',
      title: 'Centro Cirúrgico',
      description: `${this.hospitalStats.surgicalRooms} (cinco) salas funcionando 24 horas.`,
      icon: 'fas fa-procedures',
      featured: true
    }
  ];

  // Informações de navegação (breadcrumb)
  breadcrumbItems = [
    { label: 'Home', link: '/' },
    { label: 'Serviços', link: '/servicos' },
    { label: 'Capacidade de instalação e produção', active: true }
  ];

  constructor() { }

  ngOnInit(): void {
    // Inicialização do componente
    this.loadComponentData();
  }

  /**
   * Carrega os dados do componente
   */
  private loadComponentData(): void {
    // Aqui você pode implementar chamadas para APIs
    // para carregar dados dinâmicos se necessário
    console.log('Componente Capacidade de Instalação e Produção carregado');
  }

  /**
   * Retorna se um serviço é destacado
   */
  isServiceFeatured(service: ServiceInfo): boolean {
    return service.featured || false;
  }

  /**
   * Retorna informações estatísticas formatadas
   */
  getFormattedStats(): any {
    return {
      totalBeds: this.hospitalStats.totalBeds.toString(),
      susPercentage: Math.round((this.hospitalStats.susBeds / this.hospitalStats.totalBeds) * 100),
      utiAdultOccupancy: `${this.hospitalStats.utiAdultSusBeds}/${this.hospitalStats.utiAdultBeds}`,
      surgicalCapacity: `${this.hospitalStats.surgicalRooms} salas 24h`
    };
  }

  /**
   * Navega para uma seção específica
   */
  navigateToSection(sectionId: string): void {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }

  /**
   * Retorna a classe CSS para um serviço
   */
  getServiceCardClass(service: ServiceInfo): string {
    const baseClass = 'service-card h-100';
    return service.featured ? `${baseClass} featured-service` : baseClass;
  }

  /**
   * Retorna informações adicionais de um serviço
   */
  getServiceAdditionalInfo(service: ServiceInfo): any {
    return service.additionalInfo || null;
  }

  /**
   * Verifica se o serviço tem informações da equipe
   */
  hasTeamInfo(service: ServiceInfo): boolean {
    return service.id === 'uti-neonatal' && service.additionalInfo;
  }

  /**
   * Verifica se o serviço é SADT
   */
  isSadtService(service: ServiceInfo): boolean {
    return service.id === 'sadt';
  }

  /**
   * Retorna os serviços SADT
   */
  getSadtServices(): any[] {
    const sadtService = this.services.find(s => s.id === 'sadt');
    return sadtService?.additionalInfo?.services || [];
  }

  /**
   * Manipula cliques em links do breadcrumb
   */
  onBreadcrumbClick(item: any): void {
    if (!item.active && item.link) {
      // Implementar navegação aqui
      console.log(`Navegando para: ${item.link}`);
    }
  }

  /**
   * Retorna informações para SEO/acessibilidade
   */
  getPageMetadata(): any {
    return {
      title: 'Capacidade de instalação e produção - Santa Casa de Lorena',
      description: 'Conheça a capacidade de instalação e produção da Santa Casa de Lorena. Hospital geral de porte médio com 145 leitos operacionais.',
      keywords: 'santa casa lorena, hospital, leitos, uti, centro cirúrgico, internação'
    };
  }
}

