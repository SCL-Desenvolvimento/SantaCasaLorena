import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProviderService } from '../../../../services/provider.service';
import { Providers } from '../../../../models/provider';

@Component({
  selector: 'app-provider-form',
  standalone: false,
  templateUrl: './provider-form.component.html',
  styleUrls: ['./provider-form.component.css'],
})
export class ProviderFormComponent implements OnInit {
  providerForm!: FormGroup;
  loading = false;
  saving = false;
  isEditMode = false;
  providerId?: string;
  selectedFile?: File;
  previewImage?: string | ArrayBuffer | null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private providerService: ProviderService
  ) {
    this.createForm();
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.providerId = params['id'];
        if (this.providerId) this.loadProvider(this.providerId);
      }
    });
  }

  createForm(): void {
    this.providerForm = this.fb.group({
      id: [''],
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(150)]],
      imageUrl: [''],
      startYear: ['', [Validators.required, Validators.min(1900), Validators.max(new Date().getFullYear())]],
      endYear: ['', [Validators.min(1900), Validators.max(new Date().getFullYear())]],
    });
  }

  loadProvider(id: string): void {
    this.loading = true;
    this.providerService.getById(id).subscribe({
      next: (provider: Providers) => {
        this.providerForm.patchValue(provider);
        this.previewImage = provider.imageUrl;
        this.loading = false;
      },
      error: error => {
        console.error('Erro ao carregar provedor:', error);
        alert('Erro ao carregar provedor. Tente novamente mais tarde.');
        this.loading = false;
        this.router.navigate(['/admin/providers']);
      },
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];

      const reader = new FileReader();
      reader.onload = () => (this.previewImage = reader.result);
      reader.readAsDataURL(this.selectedFile);
    }
  }

  save(): void {
    if (this.providerForm.invalid) {
      this.markFormGroupTouched();
      return;
    }

    this.saving = true;
    const formValue = this.providerForm.value;
    const formData = new FormData();

    formData.append('name', formValue.name);
    formData.append('startYear', formValue.startYear);
    if (formValue.endYear) formData.append('endYear', formValue.endYear);

    if (this.selectedFile) {
      formData.append('file', this.selectedFile);
    } else if (formValue.imageUrl) {
      formData.append('imageUrl', formValue.imageUrl);
    }

    const saveOperation = this.isEditMode && this.providerId
      ? this.providerService.update(this.providerId, formData)
      : this.providerService.create(formData);

    saveOperation.subscribe({
      next: () => {
        alert(this.isEditMode ? 'Provedor atualizado com sucesso!' : 'Provedor criado com sucesso!');
        this.router.navigate(['/admin/providers']);
        this.saving = false;
      },
      error: error => {
        console.error('Erro ao salvar provedor:', error);
        alert('Erro ao salvar provedor. Tente novamente mais tarde.');
        this.saving = false;
      },
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
      if (field.errors['minlength'])
        return `Mínimo de ${field.errors['minlength'].requiredLength} caracteres`;
      if (field.errors['maxlength'])
        return `Máximo de ${field.errors['maxlength'].requiredLength} caracteres`;
      if (field.errors['min'])
        return `O valor mínimo é ${field.errors['min'].min}`;
      if (field.errors['max'])
        return `O valor máximo é ${field.errors['max'].max}`;
    }
    return '';
  }

  cancel(): void {
    if (this.providerForm.dirty && confirm('Você tem alterações não salvas. Deseja realmente sair?')) {
      this.router.navigate(['/admin/providers']);
    } else {
      this.router.navigate(['/admin/providers']);
    }
  }
}
