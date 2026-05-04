import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Agreement } from '../../../../models/agreement';
import { AgreementService } from '../../../../services/agreement.service';
import { HttpErrorResponse } from '@angular/common/http';
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';

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
    private agreementService: AgreementService,
    private toastr: ToastrService // ✅ Toastr adicionado
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
      imageUrl: [''],
      isActive: [true, Validators.required],
      createdAt: ['']
    });
  }

  loadConvenio(id: string): void {
    this.loading = true;
    this.agreementService.getById(id).subscribe({
      next: (agreement: Agreement) => {
        this.convenioForm.patchValue(agreement);
        this.previewImage = agreement.imageUrl;
        this.loading = false;
      },
      error: (error: HttpErrorResponse) => {
        this.toastr.error('Erro ao carregar convênio.', 'Erro');
        console.error('Erro ao carregar convênio:', error);
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
      this.toastr.warning('Preencha os campos obrigatórios corretamente.', 'Atenção');
      return;
    }

    this.saving = true;
    const formValue = this.convenioForm.value;
    const formData = new FormData();

    formData.append('name', formValue.name);
    formData.append('isActive', formValue.isActive ? 'true' : 'false');

    if (this.selectedFile) {
      formData.append('file', this.selectedFile);
    } else if (formValue.imageUrl) {
      formData.append('imageUrl', formValue.imageUrl);
    }

    if (this.isEditMode && this.convenioId) {
      this.agreementService.update(this.convenioId, formData).subscribe({
        next: () => {
          Swal.fire('Sucesso!', 'Convênio atualizado com sucesso.', 'success');
          this.saving = false;
          this.router.navigate(['/admin/convenios']);
        },
        error: (error: HttpErrorResponse) => {
          this.toastr.error('Erro ao atualizar convênio.', 'Erro');
          console.error(error);
          this.saving = false;
        }
      });
    } else {
      this.agreementService.create(formData).subscribe({
        next: () => {
          Swal.fire('Sucesso!', 'Convênio criado com sucesso.', 'success');
          this.saving = false;
          this.router.navigate(['/admin/convenios']);
        },
        error: (error: HttpErrorResponse) => {
          this.toastr.error('Erro ao criar convênio.', 'Erro');
          console.error(error);
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
      Swal.fire({
        title: 'Tem certeza?',
        text: 'Existem alterações não salvas. Deseja sair?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sim, sair',
        cancelButtonText: 'Cancelar'
      }).then(result => {
        if (result.isConfirmed) {
          this.router.navigate(['/admin/convenios']);
        }
      });
    } else {
      this.router.navigate(['/admin/convenios']);
    }
  }
}
