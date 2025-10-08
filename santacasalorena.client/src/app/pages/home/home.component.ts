import { Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Agreement } from '../../models/agreement';
import { AgreementService } from '../../services/agreement.service';
import { environment } from '../../../environments/environment';
import { HomeBanner } from '../../models/homeBanner';
import { HomeBannerService } from '../../services/home-banner.service';
import { Router } from '@angular/router';
import { NewsService } from '../../services/news.service';
import { News } from '../../models/news';
type BannerVM = HomeBanner & { currentImage: string };

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit, OnDestroy {

  @ViewChild('heroCarousel') heroCarousel!: ElementRef;

  heroSlides: BannerVM[] = [];

  currentSlide = 0;
  currentTranslate = 0;
  currentTransition = 'transform 0.5s ease-in-out';
  intervalId: any;

  // controle de drag
  private startX = 0;
  private isDragging = false;

  heroServices = [
    {
      image: 'assets/img/paginas/home_prontoatendimento.jpg',
      title: 'Pronto Atendimento',
      description: 'Mais de 25 mil casos por ano, situações de urgência e emergência.',
      color: 'bg-danger',
      link: '/pronto-atendimento'
    },
    {
      image: 'assets/img/paginas/home_hotelaria.jpg',
      title: 'Hotelaria',
      description: 'Satisfazendo todas as necessidades dos pacientes bem como a integridade física.',
      color: 'bg-primary',
      link: '/hotelaria'
    },
    {
      image: 'assets/img/paginas/home_clinicaemilia.jpg',
      title: 'Clínica Emília',
      description: 'Equipe médica especializada de alto nível técnico garantindo assim o atendimento com qualidade.',
      color: 'bg-success',
      link: '/clinica-emilia'
    },
    {
      image: 'assets/img/paginas/home_diagnosticoimagem.jpg',
      title: 'Centro de Diagnóstico',
      description: 'Planejadas para oferecer aos nossos pacientes todo acolhimento e segurança necessários.',
      color: 'bg-purple',
      link: '/diagnostico-imagem'
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
    items: [] as Agreement[]
  };

  cta = {
    bgGradient: '#22BCEE',
    title: 'Manual do Paciente e Visitante',
    description: 'Este manual foi desenvolvido para facilitar o relacionamento entre o paciente, familiares e o hospital garantindo total segurança, conforto e tranquilidade ao utilizar nossos serviços.',
    buttonLabel: 'Clique aqui para acessar'
  };

  // Variáveis para notícias e filtros
  news: News[] = [];
  filteredNews: News[] = [];
  selectedCategory: string = '';
  categories: string[] = ['Notícias', 'Eventos', 'Blog', 'Campanhas'];
  newsSection = { title: 'Últimas Notícias' };

  constructor(private agreementService: AgreementService,
    private bannerService: HomeBannerService,
    private newsService: NewsService,
    private router: Router) { }

  ngOnInit(): void {
    this.loadAgreement();
    this.loadBanner();
    this.loadNews();
  }

  ngOnDestroy(): void {
    clearInterval(this.intervalId);
  }

  // ADICIONE ESTA FUNÇÃO PARA NAVEGAÇÃO EXTERNA
  navigateToExternal(url: string): void {
    window.open(url, '_blank');
  }

  // Função para navegação interna (se necessário)
  navigateTo(path: string): void {
    this.router.navigate([path]);
  }

  loadNews(): void {
    this.newsService.getAll().subscribe({
      next: (data) => {
        this.news = data
          .filter(item => item.isPublished)
          .sort((a, b) => {
            if (!a.createdAt) return 1;
            if (!b.createdAt) return -1;
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          })
          .slice(0, 5); // Aumentei para 5 para ter mais notícias para filtrar

        // Inicializa as notícias filtradas
        this.filteredNews = [...this.news];

        // Extrai categorias únicas das notícias
        this.extractCategories();
      },
      error: (err) => {
        console.error('Erro ao carregar notícias:', err);
      }
    });
  }

  // Extrai categorias únicas das notícias
  private extractCategories(): void {
    const uniqueCategories = [
      ...new Set(
        this.news
          .map(item => item.category)
          .filter((cat): cat is string => typeof cat === 'string' && cat.trim() !== '')
      ),
    ];

    if (uniqueCategories.length > 0) {
      this.categories = uniqueCategories;
    }
  }


  // Filtra notícias por categoria
  filterByCategory(category: string): void {
    this.selectedCategory = category;

    if (category === '') {
      // Mostra todas as notícias
      this.filteredNews = [...this.news];
    } else {
      // Filtra por categoria
      this.filteredNews = this.news.filter(item =>
        item.category?.toLowerCase() === category.toLowerCase()
      );
    }
  }

  loadBanner(): void {
    this.bannerService.getAll().subscribe({
      next: (data: HomeBanner[]) => {
        // ordena por "order" e cria o VM com currentImage
        const sorted = data.slice().sort((a, b) => a.order - b.order);
        this.heroSlides = sorted.map(b => ({
          ...b,
          currentImage: this.pickImageForWidth(b, window.innerWidth)
        }));

        this.currentSlide = 0;
        this.updateTranslate();
        this.startAutoSlide();
      },
      error: (err) => console.error('Erro ao carregar banners', err)
    });
  }

  loadAgreement() {
    this.agreementService.getAll().subscribe({
      next: (data) => {
        this.convenios.items = data;
      },
      error: (err) => console.error('Erro ao carregar convênios', err)
    });
  }

  private pickImageForWidth(slide: HomeBanner, width: number): string {
    if (width < 768) return `${slide.mobileImageUrl}`;
    if (width < 1280) return `${slide.tabletImageUrl} `;
    return `${slide.desktopImageUrl}`;
  }

  updateTranslate(): void {
    this.currentTranslate = -100 * this.currentSlide;
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    // atualiza a imagem atual de cada slide conforme o breakpoint
    const w = window.innerWidth;
    this.heroSlides = this.heroSlides.map(s => ({
      ...s,
      currentImage: this.pickImageForWidth(s, w)
    }));
  }

  startAutoSlide(): void {
    if (!this.heroSlides.length) return;

    clearInterval(this.intervalId);

    const current = this.heroSlides[this.currentSlide];
    const delay = (current?.timeSeconds ?? 5) * 1000;

    this.intervalId = setInterval(() => {
      this.nextSlide();
    }, delay);
  }


  nextSlide(): void {
    if (!this.heroSlides.length) return;
    this.currentSlide = (this.currentSlide + 1) % this.heroSlides.length;
    this.updateTranslate();
    this.startAutoSlide(); // reinicia com o tempo do novo slide
  }

  prevSlide(): void {
    if (!this.heroSlides.length) return;
    this.currentSlide =
      (this.currentSlide - 1 + this.heroSlides.length) % this.heroSlides.length;
    this.updateTranslate();
    this.startAutoSlide();
  }

  goToSlide(index: number): void {
    this.currentSlide = index;
    this.updateTranslate();
    this.startAutoSlide();
  }

  onSlideClick(slide: BannerVM): void {
    // evita navegação se foi um drag
    if (this.isDragging) return;
    if (slide.newsId) this.router.navigate(['/newsDetail', slide.newsId]);
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
