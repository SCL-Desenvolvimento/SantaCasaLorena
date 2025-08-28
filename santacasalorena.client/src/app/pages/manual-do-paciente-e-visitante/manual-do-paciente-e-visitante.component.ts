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
      title: '16 pontos importantes para uma melhor relação paciente x hospital',
      description: 'Regras e orientações essenciais para pacientes e acompanhantes durante a internação.',
      icon: 'fas fa-hospital-user',
      fullContent: `
      <h6>16 Pontos Importantes para uma Melhor Relação Paciente x Hospital</h6>
      <ul>
        <li>O hospital está isento de qualquer responsabilidade sobre a perda ou roubo de objetos pessoais. Não deixe nos apartamentos objetos de valor, dinheiro, jóias, relógios, notebooks, carteiras, etc.</li>
        <li>No procedimento de saída do hospital, serão verificados todos os equipamentos do quarto. Quebras, faltas ou extravios serão cobrados na conta hospitalar, incluindo enxoval como lençóis, fronhas, toalhas e roupões.</li>
        <li>É proibido fumar nas dependências do hospital (Lei nº 3.868, de 24/06/02).</li>
        <li>É proibida a entrada de bebida alcoólica no hospital.</li>
        <li>Não são permitidos acompanhantes com problemas de saúde, idosos e menores de 18 anos.</li>
        <li>As informações sobre o tratamento clínico do paciente serão fornecidas somente pelo médico. O relatório da internação pode ser solicitado no dia da alta hospitalar.</li>
        <li>É proibida a circulação de pacientes e acompanhantes no hospital.</li>
        <li>Recomendamos não trazer flores para os pacientes.</li>
        <li>É proibido sentar e/ou deitar no leito do paciente.</li>
        <li>É proibido manipular equipamentos hospitalares.</li>
        <li>É vedado o acesso de pessoas com trajes inadequados, que ofendam a dignidade do serviço hospitalar.</li>
        <li>Os aparelhos de televisão serão desligados às 22h.</li>
        <li>É proibido lavar e estender roupas nos apartamentos ou janelas do hospital.</li>
        <li>Solicitamos que visitantes evitem conversas em tom elevado e o uso de aparelhos que possam interferir no repouso dos pacientes. Perturbações serão comunicadas à segurança.</li>
        <li>É permitida a permanência de um acompanhante durante o período de internação, exceto na UTI.</li>
        <li>Na Unidade de Terapia Neonatal é permitida a permanência da mãe e/ou pai durante o período diurno.</li>
      </ul>
    `
    },
    {
      id: 2,
      title: 'Direitos e deveres do paciente',
      description: 'Conheça os principais direitos e deveres dos pacientes durante o atendimento hospitalar.',
      icon: 'fas fa-balance-scale',
      fullContent: `
      <h6>Direitos do Paciente</h6>
      <ul>
        <li>Ter um atendimento digno, atencioso e respeitoso;</li>
        <li>Identificar o profissional por crachá;</li>
        <li>Receber informações claras, simples e compreensíveis sobre as ações diagnósticas e terapêuticas;</li>
        <li>Consentir ou recusar procedimentos diagnósticos ou terapêuticos. Nos casos de incapacidade de manifestação da vontade, o paciente deverá ser representado legalmente;</li>
        <li>Receber, quando solicitar, todas as informações sobre os medicamentos que lhe serão administrados;</li>
        <li>Ter resguardados seus segredos, por meio do sigilo profissional, desde que o mesmo não acarrete riscos a terceiros ou à saúde pública;</li>
        <li>Receber ou recusar assistência moral, psicológica, social e religiosa;</li>
        <li>Em situações de incapacidade de entendimento ou manifestação da vontade, será imprescindível a representação do paciente por um responsável legal devidamente habilitado.</li>
      </ul>

      <h6>Deveres do Paciente</h6>
      <ul>
        <li>O paciente ou seu representante legal deve fornecer informações precisas e completas sobre o histórico de saúde;</li>
        <li>Demonstrar entendimento das ações que estão sendo efetuadas ou propostas, visando a cura dos agravos à saúde;</li>
        <li>Seguir as instruções recomendadas pela equipe multiprofissional, sendo responsável pelas consequências de sua recusa;</li>
        <li>Conhecer e respeitar as normas e regulamentos do hospital.</li>
      </ul>
    `
    },
    {
      id: 3,
      title: 'Paciente particular',
      description: 'Orientações e responsabilidades para pacientes particulares durante a internação.',
      icon: 'fas fa-id-card',
      fullContent: `
      <h6>Paciente Particular</h6>
      <ul>
        <li>O paciente ou seu responsável deverá apresentar os seguintes documentos: carteira de identidade e CPF, além de fornecer todos os dados de identificação solicitados;</li>
        <li>Todo paciente deve ter um responsável pelo pagamento da conta hospitalar;</li>
        <li>A conta hospitalar será fechada na data da alta médica ou no primeiro dia útil seguinte, quando será apresentada a relação das despesas hospitalares;</li>
        <li>Em se tratando de pacientes particulares, o médico titular e outros especialistas envolvidos no tratamento apresentarão seus honorários médicos separadamente das contas hospitalares. O paciente e seu responsável responderão solidariamente pelo pagamento desses honorários;</li>
        <li>O hospital se reserva ao direito de cobrar os danos causados ao patrimônio pelo paciente, acompanhantes ou visitantes durante o período de internação.</li>
      </ul>
    `
    },
    {
      id: 4,
      title: 'Paciente convênio',
      description: 'Orientações e responsabilidades para pacientes atendidos por convênio.',
      icon: 'fas fa-file-medical',
      fullContent: `
      <h6>Paciente Convênio</h6>
      <ul>
        <li>O paciente ou seu responsável deverá apresentar os seguintes documentos: carteira de identidade, CPF e carteira do convênio, além de fornecer todos os dados de identificação solicitados;</li>
        <li>Na impossibilidade de apresentação de documentos que comprovem a vinculação do convênio, a internação ocorrerá de forma particular;</li>
        <li>Todo paciente deve assinar o <strong>Termo de Responsabilidade de Despesas Hospitalares, Extras de Particulares e Convênios</strong> no ato da internação, onde estão definidos os compromissos do hospital, do paciente e do responsável legal;</li>
        <li>Todo paciente deve ter um responsável pelo pagamento da conta hospitalar eventualmente não coberta pelo convênio, inclusive das diárias do acompanhante;</li>
        <li>As faturas hospitalares serão encaminhadas diretamente aos convênios. Caso haja recusa total ou parcial do pagamento, os valores serão repassados integralmente ao paciente e seu responsável, que responderão solidariamente;</li>
        <li>Procedimentos, exames, próteses, órteses e demais despesas não cobertas pelo convênio serão cobrados do paciente e responsável, solidariamente, no ato da internação ou durante a permanência no hospital;</li>
        <li>O hospital recomenda verificar junto ao plano de saúde os procedimentos e despesas não cobertos;</li>
        <li>O hospital se reserva ao direito de cobrar os danos causados ao patrimônio pelo paciente, acompanhantes ou visitantes durante o período de internação.</li>
      </ul>
    `
    },
    {
      id: 5,
      title: 'Diárias de internação',
      description: 'Informações sobre o que está incluído e regras relacionadas às diárias hospitalares.',
      icon: 'fas fa-bed',
      fullContent: `
      <h6>Diárias de Internação</h6>
      <ul>
        <li>As diárias cobrem as despesas com alimentação, rouparia e acomodação do paciente;</li>
        <li>Não estão incluídas na diária: medicamentos, exames laboratoriais ou radiológicos, hemoterapia, fisioterapia ou outros procedimentos médicos;</li>
        <li>Em caso de transferência do paciente para outra unidade (UTI), para evitar duplicidade de cobrança, solicita-se aos acompanhantes e visitantes que desocupem a acomodação. A cobrança será realizada de acordo com o período de ocupação;</li>
        <li>Após assinada a alta hospitalar pelo médico, o paciente terá o prazo de <strong>uma hora</strong> de permanência no apartamento;</li>
        <li>O hospital disponibiliza duas salas de espera para maior conforto, onde o paciente poderá aguardar os procedimentos de saída ou seus familiares que o acompanharão.</li>
      </ul>
    `
    },
    {
      id: 6,
      title: 'Pré-internação',
      description: 'Documentos necessários e informações para agilizar o processo de internação.',
      icon: 'fas fa-clipboard-list',
      fullContent: `
      <h6>Pré-internação</h6>
      <ul>
        <li><strong>Chegada:</strong> para garantir um melhor atendimento, solicitamos que no ato da internação os pacientes e/ou acompanhantes tenham em mãos: identidade original, CPF, carteira do convênio/seguro-saúde e guia da internação autorizada;</li>
        <li>Para menores de idade é necessário apresentar a certidão de nascimento (caso não tenha RG). O responsável deve ser maior de 18 anos e apresentar seus documentos pessoais;</li>
        <li>Mais informações relacionadas à internação pelo telefone: (12) 3159-3349.</li>
      </ul>
    `
    },
    {
      id: 7,
      title: 'Refeições',
      description: 'Horários, regras e orientações sobre as refeições dos pacientes e acompanhantes.',
      icon: 'fas fa-utensils',
      fullContent: `
      <h6>Refeições</h6>
      <p>As refeições serão servidas aos pacientes nos seguintes horários:</p>
      <ul>
        <li><strong>Café da manhã:</strong> entre 7h e 9h</li>
        <li><strong>Almoço:</strong> entre 11h e 12h</li>
        <li><strong>Lanche da tarde:</strong> entre 14h e 15h</li>
        <li><strong>Jantar:</strong> entre 17h e 18h</li>
        <li><strong>Ceia:</strong> entre 20h e 21h</li>
      </ul>
      <ul>
        <li>As bandejas das refeições serão retiradas dos quartos uma hora após serem servidas;</li>
        <li>As refeições serão servidas conforme prescrição médica do paciente. Alterações ou substituições somente com ordem médica, de enfermagem ou nutricionista;</li>
        <li>É proibido trazer comida para o paciente internado, mesmo em dieta livre, exceto com autorização médica expressa e por escrito;</li>
        <li>Após assinada a alta do paciente pelo médico, as refeições não serão mais servidas;</li>
        <li>Em caso de internação por convênios, as refeições para acompanhantes serão servidas conforme o contrato de prestação de serviços entre o hospital e as seguradoras de saúde.</li>
      </ul>
    `
    },
    {
      id: 8,
      title: 'Medicamentos e materiais especiais',
      description: 'Orientações sobre administração de medicamentos e uso de materiais especiais.',
      icon: 'fas fa-pills',
      fullContent: `
      <h6>Medicamentos e Materiais Especiais</h6>
      <ul>
        <li>A administração de medicamentos segue o horário padrão da equipe de enfermagem, a partir da prescrição médica;</li>
        <li>O acompanhante deverá indicar por escrito à equipe de enfermagem os medicamentos de uso contínuo do paciente, que serão administrados pela própria equipe de enfermagem;</li>
        <li>O hospital não fornece medicamentos para acompanhantes e/ou visitantes.</li>
      </ul>
    `
    },
    {
      id: 9,
      title: 'Higiene',
      description: 'Orientações sobre higiene para pacientes, acompanhantes e visitantes.',
      icon: 'fas fa-hand-sparkles',
      fullContent: `
      <h6>Higiene</h6>
      <ul>
        <li>Todo o hospital conta com álcool gel à disposição para evitar contaminação;</li>
        <li>Na entrada da UTI, há lavatórios para que os visitantes higienizem as mãos antes de entrar;</li>
        <li>A higiene das mãos deve ser feita antes e depois do contato com o paciente;</li>
        <li>Não é permitido sentar no leito do paciente, pois este ato também é um potencial gerador de contaminação.</li>
      </ul>
    `
    },
    {
      id: 10,
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
      id: 11,
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
      id: 12,
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
      id: 13,
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
      id: 14,
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
      id: 15,
      title: 'Downloads',
      description: 'Acesso a formulários, documentos e materiais informativos.',
      icon: 'fas fa-download',
      fullContent: `
    <h6>Downloads</h6>
    <p>Disponibilizamos diversos documentos e formulários para facilitar seu atendimento.</p>
    <h6>Documentos Disponíveis:</h6>
    <ul>
      <li><a href="assets/documentos/baby_med.pdf" download>Baby Med</a></li>
      <li><a href="assets/documentos/manual_do_paciente.pdf" download>Manual do Paciente</a></li>
      <li><a href="assets/documentos/direitos_e_deveres.pdf" download>Direitos e Deveres</a></li>
      <li><a href="assets/documentos/informacoes_visita_sus.pdf" download>Informações Visita SUS</a></li>
      <li><a href="assets/documentos/informacoes_visita_convenio.pdf" download>Informações Visita Convênio</a></li>
    </ul>
    <h6>Como Acessar:</h6>
    <p>Os documentos também podem ser solicitados na recepção da Santa Casa de Lorena.</p>`
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

