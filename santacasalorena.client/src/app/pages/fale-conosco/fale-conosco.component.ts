import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-fale-conosco',
  standalone: false,
  templateUrl: './fale-conosco.component.html',
  styleUrl: './fale-conosco.component.css'
})
export class FaleConoscoComponent {
  formData: FormGroup;
  isSubmitting = false;
  isSubmitted = false;
  error = '';

  contactInfo = [
    {
      icon: 'bi-telephone-fill',
      title: "Telefone",
      details: ["(12) 3159-3344", "(12) 3159-3349"],
      color: "bg-primary"
    },
    {
      icon: 'bi-whatsapp',
      title: "WhatsApp",
      details: ["(12) 98891-5484", "Ambulatório Convênio"],
      color: "bg-success"
    },
    {
      icon: 'bi-geo-alt-fill',
      title: "Endereço",
      details: ["Rua Dom Bosco - 562", "Centro, Lorena/SP"],
      color: "bg-danger"
    },
    {
      icon: 'bi-envelope-fill',
      title: "E-mail",
      details: ["contato@santacasalorena.org.br", "Atendimento geral"],
      color: "bg-purple"
    }
  ];

  departments = [
    { name: "Pronto Atendimento", phone: "(12) 3159-3344", hours: "24 horas" },
    { name: "Ambulatório", phone: "(12) 3159-3349", hours: "7h às 17h" },
    { name: "Centro de Diagnóstico", phone: "(12) 3159-3350", hours: "6h às 18h" },
    { name: "Internação", phone: "(12) 3159-3351", hours: "24 horas" }
  ];

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.formData = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      subject: ['', Validators.required],
      message: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.formData.invalid) return;

    this.isSubmitting = true;
    this.error = '';

    this.http.post('/api/contacts', this.formData.value).subscribe({
      next: () => {
        this.isSubmitted = true;
        this.formData.reset();
        this.isSubmitting = false;
      },
      error: () => {
        this.error = 'Erro ao enviar mensagem. Tente novamente.';
        this.isSubmitting = false;
      }
    });
  }

  resetForm() {
    this.isSubmitted = false;
    this.error = '';
  }

}
