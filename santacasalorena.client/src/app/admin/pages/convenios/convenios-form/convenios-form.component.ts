import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Agreement } from '../../../../models/agreement';
import { AgreementService } from '../../../../services/agreement.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-convenios-form',
  standalone: false,
  templateUrl: './convenios-form.component.html',
  styleUrls: ['./convenios-form.component.css']
})
export class ConveniosFormComponent implements OnInit {
  convenioForm!: FormGroup;
  loading = false;
  saving = false;
  isEditMode = false;
  convenioId?: number;

  categories = [
    'Educação',
    'Saúde',
    'Assistência Social',
    'Cultura',
    'Esporte',
    'Meio Ambiente'
  ];

  statuses = [
    { value: 'active', label: 'Ativo' },
    { value: 'inactive', label: 'Inativo' },
    { value: 'pending', label: 'Pendente' }
  ];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private agreementService: AgreementService
  ) {
    this.createForm();
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.convenioId = +params['id'];
        this.loadConvenio(this.convenioId);
      }
    });
  }

  createForm(): void {
    this.convenioForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(150)]],
      description: ['', [Validators.required, Validators.minLength(20), Validators.maxLength(500)]],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      status: ['pending', Validators.required],
      category: ['', Validators.required],
      partner: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      value: [0, [Validators.required, Validators.min(0)]]
    });
  }

  loadConvenio(id: number): void {
    this.loading = true;
    this.agreementService.getById(id).subscribe({
      next: (convenio: Agreement) => {
        this.convenioForm.patchValue(convenio);
        this.loading = false;
      },
      error: (error: HttpErrorResponse) => {
        console.error('Erro ao carregar convênio:', error);
        alert('Erro ao carregar convênio. Tente novamente mais tarde.');
        this.loading = false;
        this.router.navigate(['/admin/convenios']);
      }
    });
  }

  save(): void {
    if (this.convenioForm.invalid) {
      this.markFormGroupTouched();
      return;
    }

    this.saving = true;
    const formData: Agreement = this.convenioForm.value;

    if (this.isEditMode && this.convenioId) {
      this.agreementService.update(this.convenioId, formData).subscribe({
        next: () => {
          alert('Convênio atualizado com sucesso!');
          this.saving = false;
          this.router.navigate(['/admin/convenios']);
        },
        error: (error: HttpErrorResponse) => {
          console.error('Erro ao atualizar convênio:', error);
          alert('Erro ao atualizar convênio. Tente novamente mais tarde.');
          this.saving = false;
        }
      });
    } else {
      this.agreementService.create(formData).subscribe({
        next: () => {
          alert('Convênio criado com sucesso!');
          this.saving = false;
          this.router.navigate(['/admin/convenios']);
        },
        error: (error: HttpErrorResponse) => {
          console.error('Erro ao criar convênio:', error);
          alert('Erro ao criar convênio. Tente novamente mais tarde.');
          this.saving = false;
        }
      });
    }
  }

  markFormGroupTouched(): void {
    Object.keys(this.convenioForm.controls).forEach(key => {
      const control = this.convenioForm.get(key);
      control?.markAsTouched();
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.convenioForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getFieldError(fieldName: string): string {
    const field = this.convenioForm.get(fieldName);
    if (field?.errors) {
      if (field.errors['required']) return 'Este campo é obrigatório';
      if (field.errors['minlength']) return `Mínimo de ${field.errors['minlength'].requiredLength} caracteres`;
      if (field.errors['maxlength']) return `Máximo de ${field.errors['maxlength'].requiredLength} caracteres`;
      if (field.errors['min']) return `O valor mínimo é ${field.errors['min'].min}`;
    }
    return '';
  }

  cancel(): void {
    if (this.convenioForm.dirty) {
      if (confirm('Você tem alterações não salvas. Deseja realmente sair?')) {
        this.router.navigate(['/admin/convenios']);
      }
    } else {
      this.router.navigate(['/admin/convenios']);
    }
  }
}

