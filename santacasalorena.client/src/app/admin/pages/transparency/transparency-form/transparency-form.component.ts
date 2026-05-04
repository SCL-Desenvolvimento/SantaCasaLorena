import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TransparencyPortal } from '../../../../models/transparencyPortal';
import { TransparencyPortalService } from '../../../../services/transparency-portal.service';
import { HttpErrorResponse } from '@angular/common/http';
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-transparency-form',
  standalone: false,
  templateUrl: './transparency-form.component.html',
  styleUrls: ['./transparency-form.component.css']
})
export class TransparencyFormComponent implements OnInit {
  transparencyForm: FormGroup;
  loading = false;
  saving = false;
  isEditMode = false;
  transparencyId?: string;

  categories = [
    'Receitas',
    'Despesas',
    'Licitações',
    'Contratos',
    'Servidores',
    'Planejamento',
    'Relatórios'
  ];

  statuses = [
    { value: 'published', label: 'Publicado' },
    { value: 'draft', label: 'Rascunho' }
  ];

  filePreview?: string;
  fileName?: string;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private transparencyPortalService: TransparencyPortalService,
    private toastr: ToastrService
  ) {
    this.transparencyForm = this.createForm();
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params["id"]) {
        this.isEditMode = true;
        this.transparencyId = params["id"];
        if (this.transparencyId)
          this.loadTransparencyItem(this.transparencyId);
      }
    });
  }

  createForm(): FormGroup {
    return this.fb.group({
      title: [null, [Validators.required, Validators.minLength(5), Validators.maxLength(200)]],
      category: [null, Validators.required],
      publishDate: [null, Validators.required],
      status: ["draft", Validators.required],
      file: [null],
      fileUrl: [null]
    });
  }

  loadTransparencyItem(id: string): void {
    this.loading = true;
    this.transparencyPortalService.getById(id).subscribe({
      next: (item: TransparencyPortal) => {
        this.transparencyForm.patchValue({
          title: item.title,
          category: item.category,
          fileUrl: item.fileUrl
        });
        this.filePreview = item.fileUrl;
        if (item.fileUrl) {
          this.fileName = item.fileUrl.substring(item.fileUrl.lastIndexOf("/") + 1);
        }
        this.loading = false;
      },
      error: (error: HttpErrorResponse) => {
        console.error("Erro ao carregar item de transparência:", error);
        this.toastr.error('Erro ao carregar item de transparência.', 'Erro');
        this.loading = false;
        this.router.navigate(["/admin/transparency"]);
      }
    });
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        this.toastr.warning('Por favor, selecione apenas arquivos PDF.', 'Atenção');
        return;
      }

      if (file.size > 10 * 1024 * 1024) {
        this.toastr.warning('O arquivo deve ter no máximo 10MB.', 'Atenção');
        return;
      }

      this.fileName = file.name;
      this.filePreview = URL.createObjectURL(file);
      this.transparencyForm.patchValue({ file: file });
    }
  }

  removeFile(): void {
    Swal.fire({
      title: 'Remover arquivo?',
      text: 'Deseja realmente remover o arquivo anexado?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sim, remover',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#d33'
    }).then(result => {
      if (result.isConfirmed) {
        this.filePreview = undefined;
        this.fileName = undefined;
        const fileInput = document.getElementById('fileInput') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
        this.transparencyForm.patchValue({ file: null });
        this.toastr.info('Arquivo removido.', 'Removido');
      }
    });
  }

  save(): void {
    if (this.transparencyForm.invalid) {
      this.markFormGroupTouched();
      this.toastr.warning('Preencha todos os campos obrigatórios.', 'Atenção');
      return;
    }

    this.saving = true;
    const formData = new FormData();
    formData.append("title", this.transparencyForm.get("title")?.value);
    formData.append("category", this.transparencyForm.get("category")?.value);
    formData.append("publishDate", this.transparencyForm.get("publishDate")?.value);
    formData.append("status", this.transparencyForm.get("status")?.value);

    const file = this.transparencyForm.get("file")?.value;
    if (file) {
      formData.append("file", file, file.name);
    }

    const operation = this.isEditMode
      ? this.transparencyPortalService.update(this.transparencyId!, formData)
      : this.transparencyPortalService.create(formData);

    operation.subscribe({
      next: () => {
        this.saving = false;
        Swal.fire({
          icon: 'success',
          title: this.isEditMode ? 'Item atualizado!' : 'Item criado!',
          text: this.isEditMode
            ? 'O item de transparência foi atualizado com sucesso!'
            : 'O item de transparência foi criado com sucesso!',
          confirmButtonText: 'OK'
        }).then(() => {
          this.router.navigate(["/admin/transparency"]);
        });
      },
      error: (error: HttpErrorResponse) => {
        console.error("Erro ao salvar item de transparência:", error);
        this.toastr.error('Erro ao salvar item de transparência.', 'Erro');
        this.saving = false;
      }
    });
  }

  markFormGroupTouched(): void {
    Object.keys(this.transparencyForm.controls).forEach(key => {
      const control = this.transparencyForm.get(key);
      control?.markAsTouched();
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.transparencyForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getFieldError(fieldName: string): string {
    const field = this.transparencyForm.get(fieldName);
    if (field?.errors) {
      if (field.errors['required']) return 'Este campo é obrigatório';
      if (field.errors['minlength']) return `Mínimo de ${field.errors['minlength'].requiredLength} caracteres`;
      if (field.errors['maxlength']) return `Máximo de ${field.errors['maxlength'].requiredLength} caracteres`;
    }
    return '';
  }

  cancel(): void {
    if (this.transparencyForm.dirty) {
      Swal.fire({
        title: 'Descartar alterações?',
        text: 'Você tem alterações não salvas. Deseja realmente sair?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sim, sair',
        cancelButtonText: 'Cancelar'
      }).then(result => {
        if (result.isConfirmed) {
          this.router.navigate(['/admin/transparency']);
        }
      });
    } else {
      this.router.navigate(['/admin/transparency']);
    }
  }
}
