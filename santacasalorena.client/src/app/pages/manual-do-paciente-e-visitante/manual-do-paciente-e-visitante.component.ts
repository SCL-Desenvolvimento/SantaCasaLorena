import { Component, OnInit } from '@angular/core';

declare var bootstrap: any;

interface ManualItem {
  id: number;
  title: string;
  description: string;
  icon: string;
  fullContent: string;
}

@Component({
  selector: 'app-manual-do-paciente-e-visitante',
  standalone: false,
  templateUrl: './manual-do-paciente-e-visitante.component.html',
  styleUrls: ['./manual-do-paciente-e-visitante.component.css']
})
export class ManualDoPacienteEVisitantesComponent implements OnInit {

  selectedItem: ManualItem | null = null;

  manualItems: ManualItem[] = [
    {
      id: 1,
      title: 'Consentimento de procedimentos',
      description: 'Informações sobre consentimento para procedimentos médicos e cirúrgicos.',
      icon: 'fas fa-file-signature',
      fullContent: `
        <h6>Consentimento de Procedimentos</h6>
        <p>Todo procedimento médico ou cirúrgico requer o consentimento informado do paciente ou responsável legal.</p>
        <ul>
          <li>Leia atentamente todos os documentos apresentados</li>
          <li>Esclareça todas as dúvidas com a equipe médica</li>
          <li>Assine apenas quando estiver completamente esclarecido</li>
          <li>Mantenha uma cópia dos documentos assinados</li>
        </ul>
        <p><strong>Importante:</strong> O consentimento pode ser revogado a qualquer momento antes do procedimento.</p>
      `
    },
    {
      id: 2,
      title: 'Informações e visitas ao paciente',
      description: 'Diretrizes para visitas e informações sobre o estado do paciente.',
      icon: 'fas fa-users',
      fullContent: `
        <h6>Informações e Visitas ao Paciente</h6>
        <p>As visitas são importantes para o bem-estar do paciente, mas devem seguir as normas hospitalares.</p>
        <h6>Horários de Visita:</h6>
        <ul>
          <li>Segunda a domingo: 14h às 16h e 18h às 20h</li>
          <li>UTI: Horários específicos conforme orientação médica</li>
          <li>Pediatria: Acompanhante 24h (um responsável)</li>
        </ul>
        <h6>Informações sobre o Paciente:</h6>
        <ul>
          <li>Informações médicas são fornecidas apenas aos familiares autorizados</li>
          <li>Respeite a privacidade e confidencialidade</li>
          <li>Em caso de dúvidas, procure a enfermagem ou médico responsável</li>
        </ul>
      `
    },
    {
      id: 3,
      title: 'Especialidades ambulatório de convênio',
      description: 'Informações sobre as especialidades médicas disponíveis no ambulatório.',
      icon: 'fas fa-stethoscope',
      fullContent: `
        <h6>Especialidades do Ambulatório de Convênio</h6>
        <p>O ambulatório oferece diversas especialidades médicas para atendimento aos conveniados.</p>
        <h6>Especialidades Disponíveis:</h6>
        <ul>
          <li>Cardiologia</li>
          <li>Dermatologia</li>
          <li>Endocrinologia</li>
          <li>Gastroenterologia</li>
          <li>Ginecologia e Obstetrícia</li>
          <li>Neurologia</li>
          <li>Oftalmologia</li>
          <li>Ortopedia</li>
          <li>Otorrinolaringologia</li>
          <li>Pediatria</li>
          <li>Psiquiatria</li>
          <li>Urologia</li>
        </ul>
        <h6>Agendamento:</h6>
        <p>Para agendar consultas, entre em contato através do telefone (12) 3159-3344 ou WhatsApp (12) 98891-5484.</p>
      `
    },
    {
      id: 4,
      title: 'Orientação para maternidade',
      description: 'Guia completo para gestantes e acompanhantes na maternidade.',
      icon: 'fas fa-baby',
      fullContent: `
        <h6>Orientação para Maternidade</h6>
        <p>A maternidade da Santa Casa oferece cuidado especializado para mães e bebês.</p>
        <h6>Pré-Parto:</h6>
        <ul>
          <li>Traga todos os exames pré-natais</li>
          <li>Documento de identidade e cartão do convênio</li>
          <li>Roupas confortáveis para a mãe e o bebê</li>
          <li>Produtos de higiene pessoal</li>
        </ul>
        <h6>Durante o Parto:</h6>
        <ul>
          <li>Um acompanhante pode permanecer durante todo o trabalho de parto</li>
          <li>Siga as orientações da equipe médica</li>
          <li>Mantenha a calma e confie na equipe</li>
        </ul>
        <h6>Pós-Parto:</h6>
        <ul>
          <li>Orientações sobre amamentação</li>
          <li>Cuidados com o recém-nascido</li>
          <li>Acompanhamento médico regular</li>
        </ul>
      `
    },
    {
      id: 5,
      title: 'Assistência de enfermagem e serviços extras',
      description: 'Informações sobre os serviços de enfermagem e cuidados adicionais.',
      icon: 'fas fa-user-nurse',
      fullContent: `
        <h6>Assistência de Enfermagem e Serviços Extras</h6>
        <p>Nossa equipe de enfermagem está preparada para oferecer cuidados especializados 24 horas por dia.</p>
        <h6>Serviços de Enfermagem:</h6>
        <ul>
          <li>Administração de medicamentos</li>
          <li>Curativos e procedimentos</li>
          <li>Monitoramento de sinais vitais</li>
          <li>Cuidados pós-operatórios</li>
          <li>Orientações de alta hospitalar</li>
        </ul>
        <h6>Serviços Extras:</h6>
        <ul>
          <li>Enfermagem particular (sob consulta)</li>
          <li>Fisioterapia hospitalar</li>
          <li>Nutrição clínica</li>
          <li>Psicologia hospitalar</li>
          <li>Serviço social</li>
        </ul>
        <h6>Como Solicitar:</h6>
        <p>Para solicitar serviços extras, entre em contato com a enfermagem do andar ou com a administração.</p>
      `
    },
    {
      id: 6,
      title: 'Downloads',
      description: 'Acesso a formulários, documentos e materiais informativos.',
      icon: 'fas fa-download',
      fullContent: `
        <h6>Downloads</h6>
        <p>Disponibilizamos diversos documentos e formulários para facilitar seu atendimento.</p>
        <h6>Documentos Disponíveis:</h6>
        <ul>
          <li>Manual completo do paciente (PDF)</li>
          <li>Formulário de consentimento</li>
          <li>Declaração de acompanhante</li>
          <li>Orientações pré-operatórias</li>
          <li>Orientações pós-operatórias</li>
          <li>Guia de preparação para exames</li>
          <li>Cartilha de direitos do paciente</li>
        </ul>
        <h6>Como Acessar:</h6>
        <p>Os documentos estão disponíveis no site oficial da Santa Casa de Lorena ou podem ser solicitados na recepção.</p>
        <h6>Formatos:</h6>
        <ul>
          <li>PDF para impressão</li>
          <li>Versões digitais para preenchimento online</li>
          <li>Versões em áudio para pessoas com deficiência visual</li>
        </ul>
      `
    }
  ];

  constructor() { }

  ngOnInit(): void {
  }

  openModal(item: ManualItem): void {
    this.selectedItem = item;
    const modalElement = document.getElementById('detailModal');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
  }
}

