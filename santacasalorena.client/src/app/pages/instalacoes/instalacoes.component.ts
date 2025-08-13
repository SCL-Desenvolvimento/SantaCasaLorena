import { Component } from '@angular/core';

@Component({
  selector: 'app-instalacoes',
  standalone: false,
  templateUrl: './instalacoes.component.html',
  styleUrl: './instalacoes.component.css'
})
export class InstalacoesComponent {
  specs = [
    { label: 'Leitos de Internação', value: '120+' },
    { label: 'Leitos de UTI', value: '20+' },
    { label: 'Salas Cirúrgicas', value: '8' },
    { label: 'Consultórios', value: '25+' },
    { label: 'Área Total', value: '15.000m²' },
    { label: 'Funcionários', value: '500+' },
  ];

  facilities = [
    {
      icon: 'bi-heart-pulse',
      title: 'Pronto Atendimento',
      description: 'Atendimento 24 horas com equipe médica especializada para urgências e emergências.',
      features: ['Atendimento 24h', 'Equipe especializada', 'Equipamentos modernos', 'Triagem classificatória'],
      colorClass: 'bg-red'
    },
    {
      icon: 'bi-hospital',
      title: 'Internação',
      description: 'Quartos confortáveis e seguros para internação com hotelaria de qualidade.',
      features: ['Quartos privativos', 'Acompanhante', 'TV e Wi-Fi', 'Enfermagem 24h'],
      colorClass: 'bg-blue'
    },
    {
      icon: 'bi-activity',
      title: 'UTI',
      description: 'Unidade de Terapia Intensiva com tecnologia de ponta e equipe multidisciplinar.',
      features: ['Monitorização contínua', 'Ventiladores modernos', 'Equipe 24h', 'Protocolos rigorosos'],
      colorClass: 'bg-purple'
    },
    {
      icon: 'bi-stethoscope',
      title: 'Centro Cirúrgico',
      description: 'Salas cirúrgicas modernas equipadas com tecnologia de última geração.',
      features: ['Salas climatizadas', 'Equipamentos modernos', 'Cirurgias especializadas', 'Segurança total'],
      colorClass: 'bg-green'
    },
    {
      icon: 'bi-people',
      title: 'Ambulatório',
      description: 'Consultas especializadas e exames ambulatoriais com agendamento facilitado.',
      features: ['Múltiplas especialidades', 'Agendamento online', 'Convênios aceitos', 'Localização central'],
      colorClass: 'bg-orange'
    },
    {
      icon: 'bi-shield-check',
      title: 'Centro de Diagnóstico',
      description: 'Exames de imagem e laboratoriais com equipamentos de alta precisão.',
      features: ['Ressonância magnética', 'Tomografia', 'Ultrassom', 'Laboratório completo'],
      colorClass: 'bg-indigo'
    }
  ];

  amenities = [
    { icon: 'bi-car-front', title: 'Estacionamento', description: 'Estacionamento gratuito para pacientes e visitantes' },
    { icon: 'bi-wifi', title: 'Wi-Fi Gratuito', description: 'Internet wireless disponível em todas as áreas' },
    { icon: 'bi-cup-hot', title: 'Lanchonete', description: 'Praça de alimentação para pacientes e acompanhantes' },
    { icon: 'bi-universal-access', title: 'Acessibilidade', description: 'Instalações adaptadas para pessoas com deficiência' }
  ];

  safetyItems = [
    {
      icon: 'bi-shield-check',
      title: 'Protocolos de Segurança',
      text: 'Seguimos protocolos rigorosos de segurança do paciente e controle de infecção.',
      toneClass: 'bg-success-subtle'
    },
    {
      icon: 'bi-lightning',
      title: 'Tecnologia Avançada',
      text: 'Equipamentos de última geração para diagnóstico e tratamento precisos.',
      toneClass: 'bg-primary-subtle'
    },
    {
      icon: 'bi-building',
      title: 'Infraestrutura Moderna',
      text: 'Instalações modernas e bem conservadas para máximo conforto e eficiência.',
      toneClass: 'bg-purple-subtle'
    }
  ];

  details = [
    {
      title: 'Pronto Atendimento',
      description: 'Nosso Pronto Atendimento funciona 24 horas por dia, 7 dias por semana...',
      columns: [
        {
          title: 'Equipamentos Disponíveis:',
          items: ['Desfibriladores', 'Monitores cardíacos', 'Ventiladores portáteis', 'Equipamentos de suporte avançado']
        },
        {
          title: 'Especialidades:',
          items: ['Clínica Médica', 'Pediatria', 'Ortopedia', 'Cardiologia']
        }
      ]
    },
    {
      title: 'Centro de Diagnóstico por Imagem',
      description: 'Nosso Centro de Diagnóstico conta com equipamentos de última geração...',
      columns: [
        {
          title: 'Exames Disponíveis:',
          items: ['Ressonância Magnética', 'Tomografia Computadorizada', 'Ultrassonografia', 'Raio-X Digital', 'Mamografia', 'Densitometria Óssea']
        },
        {
          title: 'Diferenciais:',
          items: ['Laudos em até 24h', 'Radiologistas especializados', 'Agendamento facilitado', 'Resultados online']
        }
      ]
    },
    {
      title: 'Hotelaria Hospitalar',
      description: 'Nossos quartos de internação foram projetados para oferecer máximo conforto...',
      columns: [
        {
          title: 'Comodidades dos Quartos:',
          items: ['Quartos privativos e semi-privativos', 'Banheiro privativo', 'TV com canais a cabo', 'Wi-Fi gratuito', 'Ar condicionado', 'Poltrona para acompanhante']
        },
        {
          title: 'Serviços Inclusos:',
          items: ['Enfermagem 24 horas', 'Limpeza diária', 'Roupas de cama e banho', 'Alimentação balanceada']
        }
      ]
    }
  ];
}
