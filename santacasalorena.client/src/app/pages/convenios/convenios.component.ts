import { Component, OnInit } from '@angular/core';
import { Agreement } from '../../models/agreement';
import { AgreementService } from '../../services/agreement.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-convenios',
  standalone: false,
  templateUrl: './convenios.component.html',
  styleUrls: ['./convenios.component.css'],
})
export class ConveniosComponent implements OnInit {

  convenios: Agreement[] = [];

  private readonly fallbackImage = 'assets/images/fallback-convenio.png';
  constructor(private agreementService: AgreementService) { }

  ngOnInit(): void {
    this.loadConvenios();
  }

  private loadConvenios(): void {
    this.agreementService.getAll().subscribe({
      next: (data) => {
        this.convenios = data.map(con => ({
          ...con,
          imageUrl: `${environment.imageServerUrl}${con.imageUrl}`
        }));
      },
      error: (err) => console.error('Erro ao carregar convênios', err)
    });

    this.convenios.sort((a, b) => a.name.localeCompare(b.name));
  }
}

