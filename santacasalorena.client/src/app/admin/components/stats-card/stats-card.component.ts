import { Component, Input } from '@angular/core';

interface Trend {
  value: number;
  isPositive: boolean;
}

@Component({
  selector: 'app-stats-card',
  standalone: false,
  templateUrl: './stats-card.component.html',
  styleUrls: ['./stats-card.component.css']
})
export class StatsCardComponent {
  @Input() label = '';
  @Input() value: number = 0;
  @Input() icon = '';
  @Input() bgClass = 'bg-primary';
  @Input() textClass = 'text-primary';
  @Input() trend?: Trend;
  @Input() loading = false;
}
