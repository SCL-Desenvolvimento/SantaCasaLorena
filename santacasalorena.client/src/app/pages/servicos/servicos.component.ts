import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

interface Service {
  id: number;
  name: string;
  description: string;
  icon: string;
  category: string;
}

@Component({
  selector: 'app-servicos',
  standalone: false,
  templateUrl: './servicos.component.html',
  styleUrl: './servicos.component.css'
})
export class ServicosComponent implements OnInit {

  services: Service[] = [];
  filteredServices: Service[] = [];
  searchTerm: string = '';
  selectedCategory: string = 'all';
  loading: boolean = true;
  heroTitle = 'Serviços';
  heroSubtitle = 'Cuidados médicos especializados com excelência e humanização';

  infos = [
    { iconClass: 'bi-people-fill text-primary', title: 'Convênios Aceitos', text: 'Atendemos diversos convênios médicos...', buttonText: 'Ver lista completa' },
    { iconClass: 'bi-calendar-event-fill text-success', title: 'Agendamento', text: 'Agende suas consultas e exames...', buttonText: 'Agendar consulta' }
  ];

  schedules = [
    { name: 'Pronto Atendimento', time: '24h / 7 dias' },
    { name: 'Ambulatório', time: 'Seg-Sex: 7h-17h | Sáb: 7h-12h' },
    { name: 'Centro de Diagnóstico', time: 'Seg-Sex: 6h-18h | Sáb: 6h-12h' },
    { name: 'Internação', time: 'Visitas: 14h-20h | UTI: 14h-15h e 19h-20h' }
  ];

  ctaTitle = 'Precisa de Atendimento?';
  ctaSubtitle = 'Nossa equipe está pronta para atendê-lo com qualidade e dedicação.';
  ctaPrimaryBtn = 'Agendar Consulta';
  ctaSecondaryBtn = 'Fale Conosco';

  defaultServices: Service[] = [
    { id: 1, name: 'Cardiologia', description: 'Diagnóstico e tratamento de doenças cardiovasculares com equipamentos de última geração.', icon: 'heart-fill', category: 'Especialidades Médicas' },
    { id: 2, name: 'Neurologia', description: 'Atendimento especializado em doenças do sistema nervoso central e periférico.', icon: 'cpu-fill', category: 'Especialidades Médicas' },
    { id: 3, name: 'Ortopedia', description: 'Tratamento de lesões e doenças do sistema musculoesquelético.', icon: 'bone', category: 'Especialidades Médicas' },
    { id: 4, name: 'Pediatria', description: 'Cuidados médicos especializados para crianças e adolescentes.', icon: 'emoji-smile-fill', category: 'Especialidades Médicas' },
    { id: 5, name: 'Oftalmologia', description: 'Diagnóstico e tratamento de doenças oculares e distúrbios da visão.', icon: 'eye-fill', category: 'Especialidades Médicas' },
    { id: 6, name: 'Pronto Atendimento', description: 'Atendimento 24 horas para urgências e emergências médicas.', icon: 'activity', category: 'Emergência' },
    { id: 7, name: 'UTI', description: 'Unidade de Terapia Intensiva com monitoramento contínuo e cuidados especializados.', icon: 'heart-pulse-fill', category: 'Cuidados Intensivos' },
    { id: 8, name: 'Centro Cirúrgico', description: 'Cirurgias de diversas especialidades com tecnologia avançada.', icon: 'stethoscope', category: 'Cirurgia' }
  ];

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.fetchServices();
  }

  fetchServices(): void {
    this.http.get<Service[]>('/api/services').subscribe({
      next: (data) => {
        if (data && data.length > 0) {
          this.services = data;
          this.filteredServices = data;
        } else {
          this.services = this.defaultServices;
          this.filteredServices = this.defaultServices;
        }
        this.loading = false;
      },
      error: () => {
        this.services = this.defaultServices;
        this.filteredServices = this.defaultServices;
        this.loading = false;
      }
    });
  }

  filterServices(): void {
    let filtered = [...this.services];

    if (this.selectedCategory !== 'all') {
      filtered = filtered.filter(service => service.category === this.selectedCategory);
    }

    if (this.searchTerm) {
      filtered = filtered.filter(service =>
        service.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        service.description.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }

    this.filteredServices = filtered;
  }

  get categories(): string[] {
    return ['all', ...Array.from(new Set(this.services.map(s => s.category)))];
  }

  getCategoryColor(category: string): string {
    const colors: any = {
      'Especialidades Médicas': 'bg-primary text-white',
      'Emergência': 'bg-danger text-white',
      'Cuidados Intensivos': 'bg-purple text-white',
      'Cirurgia': 'bg-success text-white',
      'Diagnóstico': 'bg-warning text-dark'
    };
    return colors[category] || 'bg-secondary text-white';
  }
}
