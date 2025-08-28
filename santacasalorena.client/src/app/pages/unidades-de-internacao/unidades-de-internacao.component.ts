import { Component, OnInit, OnDestroy } from '@angular/core';

interface UnidadeInfo {
  label: string;
  valor: string;
}

interface UnidadeImagem {
  url: string;
  alt: string;
}

interface Unidade {
  titulo: string;
  descricao: string;
  icon: string;
  leitos?: number;
  leitosSus?: number;
  informacoes?: UnidadeInfo[];
  imagens: UnidadeImagem[];
}

@Component({
  selector: 'app-unidades-de-internacao',
  standalone: false,
  templateUrl: './unidades-de-internacao.component.html',
  styleUrls: ['./unidades-de-internacao.component.css']
})
export class UnidadesDeInternacaoComponent implements OnInit, OnDestroy {

  // Controle dos slides
  currentSlideIndex: { [key: string]: number } = {};
  slideIntervals: { [key: string]: any } = {};

  // Mock das unidades com imagens
  unidades: Unidade[] = [
    {
      titulo: 'UTI – NEO – Unidade de Assistência NEO-Natal – UNAN',
      descricao: 'Inaugurada em 2006, a unidade é composta por um berçário comum e uma Unidade de Cuidados Intermediários (Semi-Intensivos), oferecendo total segurança e qualidade aos partos realizados.',
      icon: 'fas fa-baby',
      informacoes: [
        { label: 'Coordenador Médico', valor: 'Dr. José Waldyr Fleury de Azevedo' },
        { label: 'Neonatologista Responsável', valor: 'Dr. Daniel Porte Fernandes' },
        { label: 'Fisioterapeuta responsável', valor: 'Dra. Aline Pereira de Souza' }
      ],
      imagens: [
        { url: 'assets/img/paginas/UTI-unidade-de-terapia-intensiva.jpg', alt: 'UTI Neonatal - Berçário' },
        { url: 'assets/img/paginas/UTI-unidade-de-terapia-intensiva2.jpg', alt: 'UTI Neonatal - Equipamentos' },
        { url: 'assets/img/paginas/UTI-unidade-de-terapia-intensiva3.jpg', alt: 'UTI Neonatal - Ambiente' },
        { url: 'assets/img/paginas/UTI-unidade-de-terapia-intensiva4.jpg', alt: 'UTI Neonatal - Ambiente' }
      ]
    },
    {
      titulo: 'Clínica Cirúrgica e Ortopédica',
      descricao: 'Leitos com padrão de conforto e qualidade, destinados aos pacientes do Sistema Único de Saúde (SUS), entre outros convênios.',
      icon: 'fas fa-user-md',
      leitos: 25,
      imagens: [
        { url: 'assets/img/paginas/clinica-cirurgica-e-ortopedica.jpg', alt: 'Clínica Cirúrgica - Quarto' },
        { url: 'assets/img/paginas/clinica-cirurgica-e-ortopedica2.jpg', alt: 'Clínica Cirúrgica - Corredor' }
      ]
    },
    {
      titulo: 'Maternidade BABYMED',
      descricao: 'Apartamentos de alto padrão, destinados ao público beneficiário de planos de saúde e/ou particulares, com estrutura física, tecnológica e de apoio necessários a um serviço de excelência.',
      icon: 'fas fa-heart',
      leitos: 7,
      imagens: [
        { url: 'assets/img/paginas/maternidade-BABYMED.jpg', alt: 'Maternidade - Apartamento' },
        { url: 'assets/img/paginas/maternidade-BABYMED2.jpg', alt: 'Maternidade - Berçário' },
        { url: 'assets/img/paginas/maternidade-BABYMED3.jpg', alt: 'Maternidade - Sala de Parto' },
        { url: 'assets/img/paginas/maternidade-BABYMED4.jpg', alt: 'Maternidade - Sala de Parto' },
        { url: 'assets/img/paginas/maternidade-BABYMED5.jpg', alt: 'Maternidade - Sala de Parto' }
      ]
    },
    {
      titulo: 'UTI - Unidade de Terapia Intensiva',
      descricao: 'Unidade de Terapia Intensiva equipada com os mais modernos equipamentos e tecnologia de ponta para cuidados intensivos.',
      icon: 'fas fa-heartbeat',
      leitos: 10,
      leitosSus: 7,
      imagens: [
        { url: 'assets/img/paginas/UTI-unidade-de-terapia-intensiva.jpg', alt: 'UTI - Leitos' },
        { url: 'assets/img/paginas/UTI-unidade-de-terapia-intensiva2.jpg', alt: 'UTI - Equipamentos' },
        { url: 'assets/img/paginas/UTI-unidade-de-terapia-intensiva3.jpg', alt: 'UTI - Posto Central' },
        { url: 'assets/img/paginas/UTI-unidade-de-terapia-intensiva4.jpg', alt: 'UTI - Posto Central' }
      ]
    },
    {
      titulo: 'Pediatria SUS',
      descricao: 'Leitos especializados voltados ao atendimento pediátrico para pacientes do Sistema Único de Saúde.',
      icon: 'fas fa-child',
      leitos: 16,
      imagens: [
        { url: 'assets/img/paginas/pediatria-SUS.jpg', alt: 'Pediatria - Enfermaria' },
        { url: 'assets/img/paginas/pediatria-SUS2.jpg', alt: 'Pediatria - Área de Recreação' },
        { url: 'assets/img/paginas/pediatria-SUS3.jpg', alt: 'Pediatria - Posto de Enfermagem' },
        { url: 'assets/img/paginas/pediatria-SUS4.jpg', alt: 'Pediatria - Posto de Enfermagem' },
        { url: 'assets/img/paginas/pediatria-SUS5.jpg', alt: 'Pediatria - Posto de Enfermagem' }
      ]
    },
    {
      titulo: 'Centro Cirúrgico',
      descricao: 'Centro cirúrgico moderno e equipado para realizar diversos tipos de procedimentos cirúrgicos com segurança e qualidade.',
      icon: 'fas fa-procedures',
      leitos: 10,
      leitosSus: 7,
      imagens: [
        { url: 'assets/img/paginas/centro-cirurgico.jpg', alt: 'Centro Cirúrgico - Sala de Cirurgia' },
        { url: 'assets/img/paginas/centro-cirurgico2.jpg', alt: 'Centro Cirúrgico - Equipamentos' },
        { url: 'assets/img/paginas/centro-cirurgico3.jpg', alt: 'Centro Cirúrgico - Corredor' }
      ]
    }
  ];

  // Estatísticas
  totalLeitos: number = 0;
  leitosSus: number = 0;
  apartamentosPrivados: number = 0;

  ngOnInit(): void {
    this.calcularEstatisticas();
    this.inicializarSlides();
  }

  ngOnDestroy(): void {
    // Limpar intervalos ao destruir o componente
    Object.values(this.slideIntervals).forEach(interval => {
      if (interval) {
        clearInterval(interval);
      }
    });
  }

  private calcularEstatisticas(): void {
    this.totalLeitos = this.unidades.reduce((total, u) => total + (u.leitos || 0), 0);
    this.leitosSus = this.unidades.reduce((total, u) => total + (u.leitosSus || 0), 0);

    const maternidade = this.unidades.find(u => u.titulo.includes('BABYMED'));
    this.apartamentosPrivados = maternidade?.leitos || 0;
  }

  private inicializarSlides(): void {
    this.unidades.forEach((unidade, index) => {
      const unidadeId = `unidade-${index}`;
      this.currentSlideIndex[unidadeId] = 0;
      
      // Auto-play dos slides (troca a cada 4 segundos)
      this.slideIntervals[unidadeId] = setInterval(() => {
        this.nextSlide(unidadeId, unidade.imagens.length);
      }, 4000);
    });
  }

  nextSlide(unidadeId: string, totalImages: number): void {
    this.currentSlideIndex[unidadeId] = (this.currentSlideIndex[unidadeId] + 1) % totalImages;
  }

  prevSlide(unidadeId: string, totalImages: number): void {
    this.currentSlideIndex[unidadeId] = 
      this.currentSlideIndex[unidadeId] === 0 
        ? totalImages - 1 
        : this.currentSlideIndex[unidadeId] - 1;
  }

  goToSlide(unidadeId: string, slideIndex: number): void {
    this.currentSlideIndex[unidadeId] = slideIndex;
  }

  getCurrentSlideIndex(unidadeId: string): number {
    return this.currentSlideIndex[unidadeId] || 0;
  }

  pauseSlideshow(unidadeId: string): void {
    if (this.slideIntervals[unidadeId]) {
      clearInterval(this.slideIntervals[unidadeId]);
      this.slideIntervals[unidadeId] = null;
    }
  }

  resumeSlideshow(unidadeId: string, totalImages: number): void {
    if (!this.slideIntervals[unidadeId]) {
      this.slideIntervals[unidadeId] = setInterval(() => {
        this.nextSlide(unidadeId, totalImages);
      }, 4000);
    }
  }
}

