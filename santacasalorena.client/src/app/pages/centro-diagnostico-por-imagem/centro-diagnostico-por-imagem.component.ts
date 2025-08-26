import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-centro-diagnostico-por-imagem',
  standalone: false,
  templateUrl: './centro-diagnostico-por-imagem.component.html',
  styleUrls: ['./centro-diagnostico-por-imagem.component.css']
})
export class CentroDiagnosticoPorImagemComponent {
  pageData = {
    title: 'Centro de Diagnóstico por Imagem',
    subtitle: 'Tecnologia e Precisão em Exames',
    description1: 'Oferecemos exames de alta qualidade com equipamentos modernos e equipe especializada.',
    mainTitle: 'Excelência em Diagnóstico',
    description2: 'Nosso centro conta com tecnologia de ponta para garantir resultados rápidos e precisos.',
    description3: 'Além da estrutura moderna, oferecemos atendimento humanizado para maior conforto dos pacientes.'
  };

  services = [
    {
      icon: 'fas fa-heart-pulse',
      name: 'Tomografia',
      description: 'Exames de tomografia computadorizada com imagens de alta definição.'
    },
    {
      icon: 'fas fa-user-doctor',
      name: 'Ressonância Magnética',
      description: 'Tecnologia avançada para diagnósticos neurológicos e ortopédicos.'
    },
    {
      icon: 'fas fa-hospital',
      name: 'Ultrassonografia',
      description: 'Procedimentos rápidos, seguros e sem radiação.'
    },
    {
      icon: 'fas fa-x-ray',
      name: 'Raio-X Digital',
      description: 'Imagens com qualidade superior e entrega ágil de laudos.'
    }
  ];

  features = [
    {
      icon: 'bi bi-shield-check',
      title: 'Segurança',
      description: 'Protocolos de biossegurança e equipamentos de última geração.'
    },
    {
      icon: 'bi bi-people',
      title: 'Equipe Especializada',
      description: 'Profissionais qualificados e em constante atualização.'
    },
    {
      icon: 'bi bi-clock-history',
      title: 'Agilidade',
      description: 'Atendimento rápido e entrega de resultados em tempo reduzido.'
    }
  ];

  galleryImages = [
    { src: 'assets/img/paginas/diagnostico-imagem2.jpg', alt: 'Sala de Tomografia' },
    { src: 'assets/img/paginas/diagnostico-imagem3.jpg', alt: 'Sala de Ressonância' },
    { src: 'assets/img/paginas/diagnostico-imagem4.jpg', alt: 'Recepção moderna' }
  ];

  selectedImage: { src: string, alt: string } | null = null;

  openImageModal(image: { src: string, alt: string }) {
    this.selectedImage = image;
    const modal = document.getElementById('imageModal');
    if (modal) {
      const bootstrapModal = new (window as any).bootstrap.Modal(modal);
      bootstrapModal.show();
    }
  }
}

