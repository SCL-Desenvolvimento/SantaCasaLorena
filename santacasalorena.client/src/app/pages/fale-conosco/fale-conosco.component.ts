import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { FeedbackService } from '../../services/feedback.service';

@Component({
  selector: 'app-fale-conosco',
  standalone: false,
  templateUrl: './fale-conosco.component.html',
  styleUrls: ['./fale-conosco.component.css']
})
export class FaleConoscoComponent implements OnInit {
  formData!: FormGroup;
  isSubmitting = false;
  isSubmitted = false;
  error = '';
  successMessage = '';

  formTypes = ['Ouvidoria', 'Trabalhe Conosco', 'Pesquisa de Atendimento'];
  selectedFormType = 'Ouvidoria';

  heroTitle = 'Fale Conosco';
  heroSubtitle = 'Estamos aqui para ajudar você';

  contactInfo = [
    { icon: 'bi-telephone-fill', title: "Telefone", details: ["(12) 3159-3344", "(12) 3159-3349"], color: "bg-primary" },
    { icon: 'bi-whatsapp', title: "WhatsApp", details: ["(12) 98891-5484", "Ambulatório Convênio"], color: "bg-success" },
    { icon: 'bi-geo-alt-fill', title: "Endereço", details: ["Rua Dom Bosco - 562", "Centro, Lorena/SP"], color: "bg-danger" },
    { icon: 'bi-envelope-fill', title: "E-mail", details: ["contato@santacasalorena.org.br", "Atendimento geral"], color: "bg-info" }
  ];

  departments = [
    { name: "Pronto Atendimento", phone: "(12) 3159-3344", hours: "24 horas" },
    { name: "Ambulatório", phone: "(12) 3159-3349", hours: "7h às 17h" },
    { name: "Centro de Diagnóstico", phone: "(12) 3159-3350", hours: "6h às 18h" },
    { name: "Internação", phone: "(12) 3159-3351", hours: "24 horas" }
  ];

  formConfigs: Record<string, any[]> = {
    'Ouvidoria': [
      { name: 'name', label: 'Nome', type: 'text', placeholder: 'Seu nome completo', required: true },
      { name: 'email', label: 'E-mail', type: 'email', placeholder: 'seu@email.com', required: true },
      { name: 'city', label: 'Cidade', type: 'text', placeholder: 'Sua cidade', required: true },
      { name: 'subject', label: 'Assunto', type: 'text', placeholder: 'Assunto da manifestação', required: true },
      { name: 'reason', label: 'Razão para contato', type: 'text', placeholder: 'Ex: Reclamação, Sugestão, Elogio...', required: true },
      { name: 'message', label: 'Mensagem', type: 'textarea', placeholder: 'Descreva sua manifestação...', required: true }
    ],
    'Trabalhe Conosco': [
      { name: 'name', label: 'Nome', type: 'text', placeholder: 'Seu nome completo', required: true },
      { name: 'email', label: 'E-mail', type: 'email', placeholder: 'seu@email.com', required: true },
      { name: 'city', label: 'Cidade', type: 'text', placeholder: 'Sua cidade', required: true },
      { name: 'file', label: 'Currículo (PDF)', type: 'file', required: true }
    ],
    'Pesquisa de Atendimento': [
      { name: 'waitingTime', label: 'Quanto tempo você teve que esperar para o primeiro atendimento na Santa Casa de Lorena?', type: 'radio', options: ['Minutos', 'Horas'], required: true },
      { name: 'serviceRating', label: 'Avalie o nosso atendimento de 0 (muito ruim) a 5 (excelente):', type: 'radio', options: ['0', '1', '2', '3', '4', '5'], required: true },
      { name: 'problemResolution', label: 'Com que rapidez a equipe de atendimento resolveu o problema?', type: 'radio', options: ['Imediatamente', 'Em poucos minutos', 'Em poucas horas', 'Não foi resolvido'], required: true },
      { name: 'staffPreparedness', label: 'Quão preparada estava nossa equipe de atendimento?', type: 'radio', options: ['Extremamente preparados', 'Muito preparados', 'Preparados', 'Pouco preparados', 'Nada preparados'], required: true },
      { name: 'informationClarity', label: 'As informações passadas foram claras?', type: 'radio', options: ['Sim', 'Moderadamente', 'Não'], required: true },
      { name: 'questionsAnswered', label: 'Quantas de suas perguntas foram respondidas pela equipe de atendimento?', type: 'radio', options: ['Todas', 'A maioria', 'Nenhuma'], required: true },
      { name: 'experience', label: 'Sua experiência com o nosso atendimento foi melhor ou pior do que você esperava?', type: 'radio', options: ['Muito melhor', 'Mais ou menos o que esperava', 'Muito pior'], required: true },
      { name: 'comments', label: 'Observação', type: 'textarea', placeholder: 'Digite aqui sua observação...', required: false }
    ]
  };

  get formFields() {
    return this.formConfigs[this.selectedFormType];
  }

  recaptchaToken: string | null = null;

  constructor(private fb: FormBuilder, private http: HttpClient, private feedbackService: FeedbackService) { }

  ngOnInit() {
    this.buildForm();
  }

  buildForm() {
    this.formData = this.fb.group(
      this.formFields.reduce((acc, field) => {
        acc[field.name] = field.required
          ? ['', Validators.required]
          : [''];
        if (field.type === 'email') {
          acc[field.name] = ['', [Validators.required, Validators.email]];
        }
        return acc;
      }, {} as Record<string, any>)
    );
  }

  setFormType(type: string) {
    this.selectedFormType = type;
    this.buildForm();
  }

  onSubmit() {
    //if (this.formData.invalid || !this.recaptchaToken) {
    //  this.formData.markAllAsTouched();
    //  this.error = 'Por favor, preencha todos os campos obrigatórios e confirme o reCAPTCHA.';
    //  return;
    //}

    this.isSubmitting = true;
    this.error = '';
    this.successMessage = '';

    let body: any = this.formData.value;

    // Adiciona token do recaptcha
    body.recaptchaToken = this.recaptchaToken;

    // Se tiver arquivo
    if (this.selectedFormType === 'Trabalhe Conosco' && body.file) {
      const formData = new FormData();
      Object.keys(body).forEach(key => {
        formData.append(key, body[key]);
      });
      body = formData;
    }

    switch (this.selectedFormType) {
      case 'Ouvidoria':
        this.feedbackService.enviarContato(body).subscribe({
          next: (data) => {
            console.log(data)
            console.log("Sucess")
            this.isSubmitted = true;
            this.successMessage = 'Mensagem enviada com sucesso!';
            this.formData.reset();
            this.isSubmitting = false;
          },
          error: (err) => {
            console.log(err)
            console.log("Erro")
            this.error = 'Erro ao enviar mensagem. Tente novamente.';
            this.isSubmitting = false;
          }
        });
        break;
      case 'Trabalhe Conosco':
        this.feedbackService.trabalheConosco(body).subscribe({
          next: (data) => {
            this.isSubmitted = true;
            this.successMessage = 'Mensagem enviada com sucesso!';
            this.formData.reset();
            this.isSubmitting = false;
          },
          error: (err) => {
            this.error = 'Erro ao enviar mensagem. Tente novamente.';
            this.isSubmitting = false;
          }
        });
        break;
      case 'Pesquisa de Atendimento':
        this.feedbackService.pesquisa(body).subscribe({
          next: (data) => {
            this.isSubmitted = true;
            this.successMessage = 'Mensagem enviada com sucesso!';
            this.formData.reset();
            this.isSubmitting = false;
          },
          error: (err) => {
            this.error = 'Erro ao enviar mensagem. Tente novamente.';
            this.isSubmitting = false;
          }
        });
        break;
    }
  }

  onFileSelected(event: Event, controlName: string) {
    const input = event.target as HTMLInputElement;
    if (input?.files?.length) {
      this.formData.get(controlName)?.setValue(input.files[0]);
    }
  }

  resetForm() { this.isSubmitted = false; this.error = ''; }
}
