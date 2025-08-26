import { Component, OnInit } from '@angular/core';
import { TransparencyPortal } from '../../models/transparencyPortal';
import { TransparencyPortalService } from '../../services/transparency-portal.service';
interface GroupedData {
  category: string;
  types: {
    type: string | null;
    items: TransparencyPortal[];
  }[];
}


@Component({
  selector: 'app-portal-transparencia',
  standalone: false,
  templateUrl: './portal-transparencia.component.html',
  styleUrls: ['./portal-transparencia.component.css']
})
export class PortalTransparenciaComponent implements OnInit {
  groupedData: GroupedData[] = [];

  constructor(private transparencyService: TransparencyPortalService) { }

  ngOnInit(): void {
    this.loadTransparencyData();
  }

  private loadTransparencyData(): void {
    this.transparencyService.getAll().subscribe(data => {
      const grouped: { [category: string]: { [type: string]: TransparencyPortal[] } } = {};

      data.forEach(item => {
        const category = item.category;
        const type = item.type || 'Geral';

        if (!grouped[category]) grouped[category] = {};
        if (!grouped[category][type]) grouped[category][type] = [];

        grouped[category][type].push(item);
      });

      // Converte para um array organizado
      this.groupedData = Object.keys(grouped).map(category => ({
        category,
        types: Object.keys(grouped[category]).map(type => ({
          type: type === 'Geral' ? null : type,
          items: grouped[category][type]
        }))
      }));
    });
  }

  getPeriodo(item: TransparencyPortal): string {
    if (item.year) return item.year.toString();
    if (item.startYear && item.endYear) return `${item.startYear} - ${item.endYear}`;
    if (item.startYear) return `${item.startYear} - Atual`;
    return '';
  }

  downloadItem(item: TransparencyPortal): void {
    if (item.fileUrl) {
      window.open(item.fileUrl, '_blank', 'noopener,noreferrer');
    }
  }

}

