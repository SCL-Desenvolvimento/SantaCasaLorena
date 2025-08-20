import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {

  @ViewChild('heroCarousel') heroCarousel!: ElementRef;

  basePath: string = '../../../assets/img/carrossel/';

  heroSlides: any[] = [
    { num: '3' },
    { num: '5' },
    { num: '3' }
  ];

  currentSlide = 0;
  currentTranslate: number = 0;
  currentTransition: string = 'transform 0.5s ease-in-out';
  intervalId: any;
  // controle de drag
  private startX = 0;
  private isDragging = false;

  heroServices = [
    {
      icon: 'bi-clock', title: 'Pronto Atendimento', description: 'Mais de 25 mil casos por ano, situações de urgência e emergência.', color: 'bg-danger'
    },
    {
      icon: 'bi-building', title: 'Hotelaria', description: 'Satisfazendo todas as necessidades dos pacientes bem como a integridade física.', color: 'bg-primary'
    },
    {
      icon: 'bi-stethoscope', title: 'Clínica Emília', description: 'Equipe médica especializada de alto nível técnico garantindo assim o atendimento com qualidade.', color: 'bg-success'
    },
    {
      icon: 'bi-heart', title: 'Centro de Diagnóstico', description: 'Planejadas para oferecer aos nossos pacientes todo acolhimento e segurança necessários.', color: 'bg-purple'
    }
  ];

  stats = [
    { number: '150+', label: 'Anos de História', icon: 'bi-award' },
    { number: '25k+', label: 'Atendimentos/Ano', icon: 'bi-people' },
    { number: '24h', label: 'Pronto Socorro', icon: 'bi-clock' },
    { number: '100%', label: 'Dedicação', icon: 'bi-heart' }
  ];

  convenios = {
    title: 'Convênios',
    description: 'Uma série de convênios atendidos em nossa unidade, que levam aos nossos pacientes toda a dedicação, qualidade e suporte.',
    items: [
      { name: 'Convênio 1', logo: '' },
      { name: 'Convênio 2', logo: '' },
      { name: 'Convênio 3', logo: '' },
      { name: 'Convênio 4', logo: '' },
      { name: 'Convênio 5', logo: '' },
      { name: 'Convênio 6', logo: '' }
    ]
  };

  newsSection = { title: 'Últimas Notícias' };

  cta = {
    bgGradient: 'linear-gradient(135deg, #0d6efd, #198754)',
    title: 'Manual do Paciente e Visitante',
    description: 'Este manual foi desenvolvido para facilitar o relacionamento entre o paciente, familiares e o hospital garantindo total segurança, conforto e tranquilidade ao utilizar nossos serviços.',
    buttonLabel: 'Clique aqui para acessar'
  };

  // Apenas placeholders para simular notícias locais
  news: any[] = [];
  placeholderNews = [1, 2, 3];

  ngOnInit(): void {
    this.updateImages();
    this.updateTranslate();
    this.startAutoSlide();
  }

  updateImages(): void {
    const width = window.innerWidth;
    let prefix = 'Desktop_-1920x540-';
    if (width < 768) {
      prefix = 'Mobile_-600x600-';
    } else if (width < 1280) {
      prefix = 'Tablet_-1280x800-';
    }
    this.heroSlides.forEach(slide => {
      slide.image = this.basePath + prefix + slide.num + '.png';
    });
  }

  updateTranslate(): void {
    this.currentTranslate = -100 * this.currentSlide;
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    this.updateImages();
  }

  startAutoSlide(): void {
    this.intervalId = setInterval(() => {
      this.nextSlide();
    }, 5000); // troca a cada 5s
  }

  nextSlide(): void {
    if (!this.heroSlides || this.heroSlides.length === 0) return;
    this.currentSlide = (this.currentSlide + 1) % this.heroSlides.length;
    this.updateTranslate();
  }

  prevSlide(): void {
    if (!this.heroSlides || this.heroSlides.length === 0) return;
    this.currentSlide =
      (this.currentSlide - 1 + this.heroSlides.length) % this.heroSlides.length;
    this.updateTranslate();
  }

  goToSlide(index: number): void {
    this.currentSlide = index;
    this.updateTranslate();
    clearInterval(this.intervalId);
    this.startAutoSlide(); // reinicia o timer ao clicar
  }

  // ===== Eventos de drag =====
  onDragStart(event: MouseEvent | TouchEvent): void {
    clearInterval(this.intervalId); // pausa o auto slide
    this.isDragging = true;
    this.startX = this.getPositionX(event);
    this.currentTransition = 'none';
  }

  onDragMove(event: MouseEvent | TouchEvent): void {
    if (!this.isDragging) return;
    const currentX = this.getPositionX(event);
    const diff = currentX - this.startX;
    const width = this.getClientWidth();
    this.currentTranslate = -this.currentSlide * 100 + (diff / width * 100);
  }

  onDragEnd(event: MouseEvent | TouchEvent): void {
    if (!this.isDragging) return;
    this.isDragging = false;

    const endX = this.getPositionX(event);
    const diff = this.startX - endX;

    this.currentTransition = 'transform 0.5s ease-in-out';

    if (diff > 50) {
      this.nextSlide();
    } else if (diff < -50) {
      this.prevSlide();
    } else {
      this.updateTranslate();
    }

    this.startAutoSlide(); // retoma auto slide
  }

  private getPositionX(event: MouseEvent | TouchEvent): number {
    return event instanceof MouseEvent ? event.pageX : event.touches[0].pageX;
  }

  private getClientWidth(): number {
    return this.heroCarousel?.nativeElement.clientWidth || window.innerWidth;
  }
}
