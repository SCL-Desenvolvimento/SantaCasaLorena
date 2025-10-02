import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Providers } from '../../../../models/provider';
import { ProviderService } from '../../../../services//provider.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-provider-form',
  standalone: false,
  templateUrl: './provider-form.component.html',
  styleUrls: ['./provider-form.component.css']
})
export class ProviderFormComponent implements OnInit {
  providerForm!: FormGroup;
  loading = false;
  saving = false;
  isEditMode = false;
  providerId?: string; // ID é string no modelo Providers
  serviceAreas: string[] = [
    'Tecnologia',
    'Logística',
    'Construção',
    'Saúde',
    'Educação'
  ];
  statuses: { value: string, label: string }[] = [
    { value: 'active', label: 'Ativo' },
    { value: 'inactive', label: 'Inativo' },
    { value: 'pending', label: 'Pendente' }
  ];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private providerService: ProviderService
  ) { }

  ngOnInit(): void {
    this.createForm();
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.providerId = params['id'];
        if (this.providerId)
          this.loadProvider(this.providerId);
      }
    });
  }

  createForm(): void {
    this.providerForm = this.fb.group({
      id: [''], // ID pode ser gerado ou preenchido em edição
      imageUrl: ['', Validators.maxLength(255)],
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(150)]],
      startYear: ['', [Validators.required, Validators.min(1900), Validators.max(new Date().getFullYear())]],
      endYear: ['', [Validators.min(1900), Validators.max(new Date().getFullYear())]]
    });
  }

  loadProvider(id: string): void {
    this.loading = true;
    this.providerService.getById(id).subscribe({
      next: (provider: Providers) => {
        this.providerForm.patchValue(provider);
        this.loading = false;
      },
      error: (err) => {
        console.error('Erro ao carregar fornecedor:', err);
        alert('Erro ao carregar fornecedor. Tente novamente mais tarde.');
        this.loading = false;
        this.router.navigate(['/admin/providers']);
      }
    });
  }

  save(): void {
    if (this.providerForm.invalid) {
      this.markFormGroupTouched();
      return;
    }

    this.saving = true;
    const formData: Providers = this.providerForm.value;

    let operation: Observable<Providers>;

    if (this.isEditMode && this.providerId) {
      operation = this.providerService.update(this.providerId, formData);
    } else {
      // Se o ID não for fornecido para um novo registro, o backend deve gerá-lo.
      // Se o formulário tiver um campo de ID, ele será enviado.
      operation = this.providerService.create(formData);
    }

    operation.subscribe({
      next: () => {
        alert(this.isEditMode ? 'Fornecedor atualizado com sucesso!' : 'Fornecedor criado com sucesso!');
        this.saving = false;
        this.router.navigate(['/admin/providers']);
      },
      error: (err) => {
        console.error('Erro ao salvar fornecedor:', err);
        alert('Erro ao salvar fornecedor. Tente novamente mais tarde.');
        this.saving = false;
      }
    });
  }

  markFormGroupTouched(): void {
    Object.keys(this.providerForm.controls).forEach(key => {
      const control = this.providerForm.get(key);
      control?.markAsTouched();
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.providerForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getFieldError(fieldName: string): string {
    const field = this.providerForm.get(fieldName);
    if (field?.errors) {
      if (field.errors['required']) return 'Este campo é obrigatório';
      if (field.errors['minlength']) return `Mínimo de ${field.errors['minlength'].requiredLength} caracteres`;
      if (field.errors['maxlength']) return `Máximo de ${field.errors['maxlength'].requiredLength} caracteres`;
      if (field.errors['min']) return `O ano deve ser no mínimo ${field.errors['min'].min}`;
      if (field.errors['max']) return `O ano deve ser no máximo ${field.errors['max'].max}`;
    }
    return '';
  }

  cancel(): void {
    if (this.providerForm.dirty) {
      if (confirm('Você tem alterações não salvas. Deseja realmente sair?')) {
        this.router.navigate(['/admin/providers']);
      }
    } else {
      this.router.navigate(['/admin/providers']);
    }
  }
}

