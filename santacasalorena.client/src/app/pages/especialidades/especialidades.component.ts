import { Component } from '@angular/core';

interface Especialidade {
  id: number;
  nome: string;
  icone?: string;
  tipo: 'clinica' | 'cirurgica';
}

@Component({
  selector: 'app-especialidades',
  standalone: false,
  templateUrl: './especialidades.component.html',
  styleUrls: ['./especialidades.component.css']
})
export class EspecialidadesComponent {

  subtitulo = 'Cuidando da sua saúde com diversas especialidades';
  descricao = 'Cuidado e assistência hospitalar nas mais diversas áreas da saúde.';
  textoDescritivo = 'Com uma equipe de profissionais capacitados e instalações modernas, a Santa Casa de Lorena oferece uma série de especialidades em seus serviços, atendendo os mais diversos casos, e buscando sempre melhorias e novas especializações para continuar com sua excelência em atendimento.';

  especialidades: Especialidade[] = [];

  constructor() { }

  ngOnInit(): void {
    this.especialidades = [
      { id: 1, nome: 'Acupuntura', icone: 'fas fa-hand-holding-medical', tipo: 'clinica' },
      { id: 2, nome: 'Anestesiologia', icone: 'fas fa-syringe', tipo: 'clinica' },
      { id: 3, nome: 'Angiologia', icone: 'fas fa-heartbeat', tipo: 'clinica' },
      { id: 4, nome: 'Cardiologia', icone: 'fas fa-heart', tipo: 'clinica' },
      { id: 5, nome: 'Clínico Geral', icone: 'fas fa-user-md', tipo: 'clinica' },
      { id: 6, nome: 'Dermatologia', icone: 'fas fa-hand-paper', tipo: 'clinica' },
      { id: 7, nome: 'Endocrinologia', icone: 'fas fa-dna', tipo: 'clinica' },
      { id: 8, nome: 'Especialista em Dor', icone: 'fas fa-band-aid', tipo: 'clinica' },
      { id: 9, nome: 'Fisioterapia', icone: 'fas fa-walking', tipo: 'clinica' },
      { id: 10, nome: 'Fonoaudiologia', icone: 'fas fa-comment-medical', tipo: 'clinica' },
      { id: 11, nome: 'Gastroenterologia', icone: 'fas fa-stomach', tipo: 'clinica' },
      { id: 12, nome: 'Geriatria', icone: 'fas fa-user-clock', tipo: 'clinica' },
      { id: 13, nome: 'Ginecologia / Obstetrícia', icone: 'fas fa-baby', tipo: 'clinica' },
      { id: 14, nome: 'Neurologia', icone: 'fas fa-brain', tipo: 'clinica' },
      { id: 15, nome: 'Ortopedia / Traumatologia', icone: 'fas fa-bone', tipo: 'clinica' },
      { id: 16, nome: 'Psicologia', icone: 'fas fa-head-side-virus', tipo: 'clinica' },
      { id: 17, nome: 'Psiquiatria', icone: 'fas fa-user-friends', tipo: 'clinica' },
      { id: 18, nome: 'Pediatria', icone: 'fas fa-child', tipo: 'clinica' },
      { id: 19, nome: 'Urologia', icone: 'fas fa-kidneys', tipo: 'clinica' },

      // Cirúrgicas
      { id: 20, nome: 'Cirurgia Cardiovascular', icone: 'fas fa-heart-pulse', tipo: 'cirurgica' },
      { id: 21, nome: 'Cirurgia Geral', icone: 'fas fa-cut', tipo: 'cirurgica' },
      { id: 22, nome: 'Neurocirurgia', icone: 'fas fa-brain', tipo: 'cirurgica' },
      { id: 23, nome: 'Cirurgia Pediátrica', icone: 'fas fa-baby', tipo: 'cirurgica' },
      { id: 24, nome: 'Cirurgia Vascular', icone: 'fas fa-lungs', tipo: 'cirurgica' }
    ];
  }

  getEspecialidadesClinicas(): Especialidade[] {
    return this.especialidades.filter(e => e.tipo === 'clinica');
  }

  getEspecialidadesCirurgicas(): Especialidade[] {
    return this.especialidades.filter(e => e.tipo === 'cirurgica');
  }

  trackByEspecialidade(index: number, item: Especialidade): number {
    return item.id;
  }

  onIconError(event: Event): void {
    const element = event.target as HTMLElement;
    element.className = 'fas fa-stethoscope text-muted';
  }
}

