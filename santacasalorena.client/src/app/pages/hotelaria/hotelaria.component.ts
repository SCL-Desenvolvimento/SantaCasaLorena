import { Component } from '@angular/core';

@Component({
  selector: 'app-hotelaria',
  standalone: false,
  templateUrl: './hotelaria.component.html',
  styleUrl: './hotelaria.component.css'
})
export class HotelariaComponent {
  servicos = [
    {
      titulo: 'Nutrição e Dietética',
      descricao: 'Equipe especializada no preparo das refeições, garantindo sabor, nutrição e dietas personalizadas.',
      icon: 'bi-egg-fried',
      bgClass: 'bg-success'
    },
    {
      titulo: 'Lavanderia Hospitalar',
      descricao: 'Serviço terceirizado profissional, responsável por todo o enxoval da instituição.',
      icon: 'bi-basket',
      bgClass: 'bg-warning'
    },
    {
      titulo: 'Ambientes Confortáveis',
      descricao: 'Quartos e áreas planejados para oferecer aconchego, privacidade e bem-estar.',
      icon: 'bi-door-closed',
      bgClass: 'bg-primary'
    }
  ];
}
