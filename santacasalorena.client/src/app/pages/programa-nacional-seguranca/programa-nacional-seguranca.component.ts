import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';

interface Feature {
  icon: string;
  title: string;
  description: string;
}

@Component({
  selector: 'app-programa-nacional-seguranca',
  standalone: false,
  templateUrl: './programa-nacional-seguranca.component.html',
  styleUrls: ['./programa-nacional-seguranca.component.css']
})
export class ProgramaNacionalSegurancaComponent implements OnInit, OnDestroy {
  
  // Page Content Properties
  pageTitle: string = 'Programa Nacional de Segurança do Paciente';
  heroSubtitle: string = 'Segurança no Atendimento de seus pacientes';
  heroDescription: string = 'Uma equipe de profissionais proporcionando um serviço de excelência, com total segurança para seus pacientes.';
  
  programaNacionalTitle: string = 'Programa Nacional de Segurança do Paciente';
  programaNacionalContent: string[] = [
    'O Programa Nacional de Segurança do Paciente (PNSP) tem o objetivo de contribuir para a qualificação do cuidado em saúde em todos os estabelecimentos desse segmento no território nacional.',
    'A Segurança do Paciente é um componente essencial da qualidade do cuidado, e tem adquirido, em todo o mundo, importância cada vez maior para os pacientes e suas famílias, para os gestores e profissionais de saúde no sentido de oferecer uma assistência segura.'
  ];
  
  nucleoTitle: string = 'Núcleo de Segurança do Paciente';
  nucleoContent: string[] = [
    'A Santa Casa de Lorena, com o apoio do seu NSP – Núcleo de Segurança do Paciente – formado por uma equipe multiprofissional, busca promover ações para a gestão de risco. O trabalho se baseia nos Protocolos Básicos de Segurança do Paciente, aprovados pelo Ministério da Saúde, e está dividido em seis tópicos.',
    'É também responsabilidade do grupo, avaliar as notificações de incidentes e não conformidades abertas e as propostas de melhorias apresentadas pelos gestores.',
    'Os profissionais são treinados para desenvolver suas atividades de forma preventiva, utilizando os protocolos documentados.'
  ];
  
  features: Feature[] = [
    {
      icon: 'fas fa-shield-alt',
      title: 'Protocolos de Segurança',
      description: 'Implementação rigorosa dos Protocolos Básicos de Segurança do Paciente aprovados pelo Ministério da Saúde.'
    },
    {
      icon: 'fas fa-users',
      title: 'Equipe Multiprofissional',
      description: 'Núcleo de Segurança formado por profissionais especializados em gestão de risco e qualidade assistencial.'
    },
    {
      icon: 'fas fa-chart-line',
      title: 'Melhoria Contínua',
      description: 'Avaliação constante de incidentes e implementação de propostas de melhorias para aprimorar a assistência.'
    }
  ];
  
  private intersectionObserver?: IntersectionObserver;
  
  constructor() {}
  
  ngOnInit(): void {
    this.initializeAnimations();
    this.loadPageData();
  }
  
  ngOnDestroy(): void {
    if (this.intersectionObserver) {
      this.intersectionObserver.disconnect();
    }
  }
  
  /**
   * Initialize scroll animations for elements
   */
  private initializeAnimations(): void {
    if (typeof window !== 'undefined' && 'IntersectionObserver' in window) {
      this.intersectionObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              entry.target.classList.add('visible');
            }
          });
        },
        {
          threshold: 0.1,
          rootMargin: '0px 0px -50px 0px'
        }
      );
      
      // Observe elements after view init
      setTimeout(() => {
        const animatedElements = document.querySelectorAll('.content-section, .feature-card');
        animatedElements.forEach(el => {
          el.classList.add('fade-in');
          this.intersectionObserver?.observe(el);
        });
      }, 100);
    }
  }
  
  /**
   * Load additional page data if needed
   */
  private loadPageData(): void {
    // This method can be extended to load data from services
    // For now, all data is static and defined in the component
    console.log('Programa Nacional de Segurança component initialized');
  }
  
  /**
   * Scroll to top of the page
   */
  scrollToTop(): void {
    if (typeof window !== 'undefined') {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  }
  
  /**
   * Handle window scroll events for additional animations
   */
  @HostListener('window:scroll', ['$event'])
  onWindowScroll(): void {
    // Additional scroll-based animations can be implemented here
    // For example, navbar changes, progress indicators, etc.
  }
  
  /**
   * Handle window resize events
   */
  @HostListener('window:resize', ['$event'])
  onWindowResize(): void {
    // Handle responsive behavior if needed
    // This can be useful for complex responsive interactions
  }
  
  /**
   * Track by function for ngFor optimization
   */
  trackByIndex(index: number, item: any): number {
    return index;
  }
  
  /**
   * Track by function for features array
   */
  trackByFeature(index: number, feature: Feature): string {
    return feature.title;
  }
  
  /**
   * Get current year for copyright
   */
  getCurrentYear(): number {
    return new Date().getFullYear();
  }
  
  /**
   * Handle feature card click events
   */
  onFeatureClick(feature: Feature): void {
    console.log('Feature clicked:', feature.title);
    // Implement feature-specific actions here
    // For example, open modals, navigate to detailed pages, etc.
  }
  
  /**
   * Handle accessibility keyboard navigation
   */
  onKeyDown(event: KeyboardEvent, action: string): void {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      switch (action) {
        case 'scrollToTop':
          this.scrollToTop();
          break;
        default:
          break;
      }
    }
  }
}

