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
  convenioId?: string;
  selectedFile?: File;
  previewImage?: string | ArrayBuffer | null;

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
        this.convenioId = params['id'];
        if (this.convenioId) this.loadConvenio(this.convenioId);
      }
    });
  }

  createForm(): void {
    this.convenioForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(150)]],
      imageUrl: [''], // Mantém para armazenar o URL retornado do backend
      isActive: [true, Validators.required],
      createdAt: ['']
    });
  }

  loadConvenio(id: string): void {
    this.loading = true;
    this.agreementService.getById(id).subscribe({
      next: (agreement: Agreement) => {
        this.convenioForm.patchValue(agreement);
        this.previewImage = agreement.imageUrl; // Exibe imagem atual
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

  onFileSelected(event: Event): void {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files.length > 0) {
      this.selectedFile = fileInput.files[0];

      const reader = new FileReader();
      reader.onload = () => (this.previewImage = reader.result);
      reader.readAsDataURL(this.selectedFile);
    }
  }

  save(): void {
    if (this.convenioForm.invalid) {
      this.markFormGroupTouched();
      return;
    }

    this.saving = true;
    const formValue = this.convenioForm.value;
    const formData = new FormData();

    formData.append('name', formValue.name);
    formData.append('isActive', formValue.isActive ? 'true' : 'false');

    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    } else if (formValue.imageUrl) {
      formData.append('imageUrl', formValue.imageUrl);
    }

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
      if (field.errors['minlength'])
        return `Mínimo de ${field.errors['minlength'].requiredLength} caracteres`;
      if (field.errors['maxlength'])
        return `Máximo de ${field.errors['maxlength'].requiredLength} caracteres`;
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
