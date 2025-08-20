import { Component, OnInit } from '@angular/core';

interface Melhoria {
  titulo: string;
  descricao?: string;
}

@Component({
  selector: 'app-humanizacao',
  standalone: false,
  templateUrl: './humanizacao.component.html',
  styleUrls: ['./humanizacao.component.css']
})
export class HumanizacaoComponent {

  // Lista de tarefas do Grupo de Humanização
  tarefas = [
    {
      titulo: 'Acolhimento',
      descricao: 'Receber pacientes e familiares de forma humanizada, oferecendo suporte e escuta ativa.',
      icon: 'bi-hand-thumbs-up'
    },
    {
      titulo: 'Capacitação',
      descricao: 'Treinar continuamente colaboradores para práticas mais humanas no atendimento.',
      icon: 'bi-mortarboard'
    },
    {
      titulo: 'Apoio Familiar',
      descricao: 'Criar espaços e iniciativas para acolher familiares durante o tratamento do paciente.',
      icon: 'bi-people'
    },
    {
      titulo: 'Eventos e Campanhas',
      descricao: 'Promover ações que incentivem a valorização da vida e da saúde.',
      icon: 'bi-calendar-event'
    }
  ];

  // Lista de melhorias e iniciativas em andamento
  melhorias = [
    {
      titulo: 'Treinamento Contínuo',
      descricao: 'Capacitação periódica para os profissionais de saúde com foco em empatia e comunicação.'
    },
    {
      titulo: 'Ambientes Confortáveis',
      descricao: 'Reforma de alas hospitalares para proporcionar maior conforto aos pacientes.'
    },
    {
      titulo: 'Projetos Culturais',
      descricao: 'Atividades artísticas e musicais para melhorar o ambiente hospitalar.'
    },
    {
      titulo: 'Feedback da Comunidade',
      descricao: 'Criação de canais de escuta para pacientes e familiares opinarem sobre melhorias.'
    }
  ];
}

