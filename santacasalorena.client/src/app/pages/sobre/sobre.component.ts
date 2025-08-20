import { Component } from '@angular/core';

interface Secao {
  titulo: string;
  subtitulo?: string;
  texto?: string;
  paragrafos?: string[];
}

interface Valor {
  icon: string;
  color: string;
  title: string;
  description: string;
}

interface Provedor {
  periodo: string;
  nome: string;
  descricao?: string;
}

@Component({
  selector: 'app-sobre',
  standalone: false,
  templateUrl: './sobre.component.html',
  styleUrl: './sobre.component.css'
})
export class SobreComponent {
  hero: Secao = {
    titulo: 'A Santa Casa',
    subtitulo: '150 anos de História - Cuidando da nossa gente!'
  };

  historia: Secao = {
    titulo: '150 anos de História',
    subtitulo: 'Cuidando da nossa gente!',
    paragrafos: [
      `Fundada em 1º de dezembro de 1867 pelo Conde de Moreira Lima, secretário da primeira diretoria e dedicou-se às obras da Santa Casa, até falecer, quando então a instituição passou a ser administrada pelas Irmãs Salesianas de Lorena.`,

      `Ao longo de sua história já contou com 15 provedores ajudando em seu crescimento e desenvolvimento. Com um caráter filantrópico e sem fins lucrativos, a Santa Casa tem por objetivo atender pacientes de todos os níveis econômicos e sociais, destinando a maior parte de seus serviços e atendimentos aos pacientes do SUS – Sistema Único de Saúde.`,

      `Atualmente é reconhecida como hospital referência para o Vale Histórico, atendendo não só o município onde está sediada, como também as adjacências, somando uma população de 140.000 habitantes. No ano de 2017, em parceria com a SES (Secretária da Saúde), por meio da Regional de Taubaté, passa a ser referência para as cidades de Aparecida, Roseira e Potim, na retaguarda de obstetrícia.`
    ]
  };

  textoNarrativo: string[] = [
    `Eu cheguei aqui apenas 11 anos depois de Lorena ser elevada à cidade. De lá para cá quanta coisa mudou, são 150 anos de uma jornada cheia de momentos marcantes.`,

    `Vi muita história acontecer, vi a nossa economia evoluir do café, passando pela cana-de-açúcar, arroz, até atrair uma série de indústrias. Eu vejo o nascimento e o crescimento a cada dia.`,

    `Eu sou quem cuida e acolhe nossa cidade, nossa região. Combino experiência e sabedoria, com modernidade e estrutura de ponta, para receber a todos sempre de braços abertos.`,

    `Agora entro em uma nova fase, uma nova gestão, uma nova marca, uma nova era. Ainda melhor. Eu sou a Santa Casa de Lorena. Cuidando de você! Cuidando da nossa gente!`
  ];

  valoresPrincipais: Valor[] = [
    {
      icon: 'bi-bullseye',
      color: '#0d6efd',
      title: 'Missão',
      description: 'Prestar serviços de assistência à saúde da população de Lorena e região com qualidade e ética, buscando o bem-estar dos pacientes.'
    },
    {
      icon: 'bi-eye',
      color: '#198754',
      title: 'Visão',
      description: 'Ser reconhecida perante a sociedade pela excelência na assistência à saúde, sendo referência em serviços de média e alta complexidade.'
    },
    {
      icon: 'bi-heart-fill',
      color: '#dc3545',
      title: 'Valores',
      description: 'Assistência à saúde humanizada e personalizada, conduta ética, excelência e motivação para mudanças, valorizando sempre o ser humano.'
    }
  ];

  valoresDetalhados: Valor[] = [
    {
      icon: 'bi-heart-pulse',
      color: '#e3f2fd',
      title: 'Assistência à Saúde',
      description: 'Humanizada e personalizada, valorizando o ser humano.'
    },
    {
      icon: 'bi-shield-check',
      color: '#f3e5f5',
      title: 'Conduta Ética',
      description: 'Lisura na conduta moral e profissional, respeitando as relações internas e externas do trabalho, zelando pela sua própria imagem e políticas.'
    },
    {
      icon: 'bi-award',
      color: '#fff3e0',
      title: 'Excelência',
      description: 'Trabalhar a melhoria contínua dos processos, resultados e satisfação das necessidades presentes e futuras, superando as expectativas dos clientes.'
    },
    {
      icon: 'bi-arrow-up-circle',
      color: '#e8f5e8',
      title: 'Motivação para Mudanças',
      description: 'Promover e estimular o desenvolvimento pessoal e profissional por meio do aprimoramento do conhecimento.'
    }
  ];

  provedores: Provedor[] = [
    { periodo: '1867 - 1879', nome: 'Dr. Joaquim Pedro Vilhaça' },
    { periodo: '1879 - 1926', nome: 'Conde Moreira de Lima' },
    { periodo: '1926 - 1944', nome: 'Dr. Antônio Gama Rodrigues' },
    { periodo: '1944 - 1947', nome: 'Dr. Euclides Braga' },
    { periodo: '1947 - 1949', nome: 'Dr. Salim Felix' },
    { periodo: '1949 - 1951', nome: 'Dr. José Machado Coelho de Castro' },
    { periodo: '1951 - 1958', nome: 'Sr. Augusto Sveberi' },
    { periodo: '1958 - 1961', nome: 'Sr. Raul Penha Nunes' },
    { periodo: '1961 - 1962', nome: 'Sr. Sebastião Plínio de Sampaio' },
    { periodo: '1962 - 1966', nome: 'Sr Raul Penha Nunes' },
    { periodo: '1966 - 1979', nome: 'Sr. Américo Nogueira' },
    { periodo: '1979 - 2000', nome: 'Irmã Maria da Glória Castanheira' },
    { periodo: '2000 - 2000', nome: 'Sra. Célia Carvalho de Castro' },
    { periodo: '2001 - 2005', nome: 'Sr. Juares Nilton Guimarães' },
    { periodo: '2005 - 2015', nome: 'Paulo Sérgio Moure dos Reis' },
    { periodo: '2015 - 2017', nome: 'Paola de Gara Geronimi' },
    { periodo: '2017 - 2018', nome: 'Luiz Geraldo Rangel Ferraz' },
    { periodo: '2018 - 2023', nome: 'Dr. Mário Teixeira da Silva' }
  ];
}
