import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '../../../../models/user';
import { UserService } from '../../../../services/user.service';
import { HttpErrorResponse } from '@angular/common/http';
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-user-form',
  standalone: false,
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css']
})
export class UserFormComponent implements OnInit {
  userForm: FormGroup;
  loading = false;
  saving = false;
  isEditMode = false;
  userId?: string;
  profileImagePreview: string = '';
  selectedImageFile: File | null = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private toastr: ToastrService
  ) {
    this.userForm = this.createForm();
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.userId = params['id'];
        if (this.userId) this.loadUser(this.userId);
      }
    });
  }

  createForm(): FormGroup {
    return this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.minLength(6), Validators.maxLength(50)]],
      isActive: [true, Validators.required]
    });
  }

  loadUser(id: string): void {
    this.loading = true;
    this.userService.getById(id).subscribe({
      next: (user: User) => {
        this.userForm.patchValue({
          username: user.username,
          email: user.email,
          isActive: user.isActive
        });

        // Remove validação de senha em edição
        this.userForm.get('password')?.clearValidators();
        this.userForm.get('password')?.updateValueAndValidity();

        // Carrega imagem se houver
        if (user.photoUrl) {
          this.profileImagePreview = user.photoUrl;
        }

        this.loading = false;
      },
      error: (error: HttpErrorResponse) => {
        console.error('Erro ao carregar usuário:', error);
        this.toastr.error('Erro ao carregar usuário.', 'Erro');
        this.loading = false;
        this.router.navigate(['/admin/users']);
      }
    });
  }

  triggerFileInput(): void {
    const fileInput = document.getElementById('profileImage') as HTMLInputElement;
    if (fileInput) fileInput.click();
  }

  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    const file = input.files[0];
    if (!file.type.startsWith('image/')) {
      Swal.fire('Arquivo inválido', 'Por favor, selecione apenas arquivos de imagem.', 'warning');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      Swal.fire('Imagem muito grande', 'A imagem deve ter no máximo 2MB.', 'warning');
      return;
    }

    this.selectedImageFile = file;
    const reader = new FileReader();
    reader.onload = () => (this.profileImagePreview = reader.result as string);
    reader.readAsDataURL(file);
  }

  removeImage(): void {
    this.profileImagePreview = '';
    this.selectedImageFile = null;
    const input = document.getElementById('profileImage') as HTMLInputElement;
    if (input) input.value = '';
  }

  async save(): Promise<void> {
    if (this.userForm.invalid) {
      this.markFormGroupTouched();
      this.toastr.warning('Preencha os campos obrigatórios corretamente.', 'Atenção');
      return;
    }

    if (!this.isEditMode && !this.userForm.value.password) {
      Swal.fire('Senha obrigatória', 'Para criar um usuário, a senha é obrigatória.', 'warning');
      return;
    }

    this.saving = true;
    const formValue = this.userForm.value;

    // === CRIA O FORM DATA CONFORME UserRequestDto ===
    const formData = new FormData();
    formData.append('Username', formValue.username);
    formData.append('Email', formValue.email);
    formData.append('IsActive', formValue.isActive ? 'true' : 'false');

    if (formValue.password) {
      formData.append('Password', formValue.password);
    }

    if (this.selectedImageFile) {
      formData.append('File', this.selectedImageFile);
    }

    const operation = this.isEditMode
      ? this.userService.update(this.userId!, formData)
      : this.userService.create(formData);

    operation.subscribe({
      next: async () => {
        this.saving = false;
        this.toastr.success(
          this.isEditMode ? 'Usuário atualizado com sucesso!' : 'Usuário criado com sucesso!',
          'Sucesso'
        );
        await Swal.fire({
          icon: 'success',
          title: this.isEditMode ? 'Usuário atualizado!' : 'Usuário criado!',
          showConfirmButton: false,
          timer: 1200
        });
        this.router.navigate(['/admin/users']);
      },
      error: (error: HttpErrorResponse) => {
        console.error('Erro ao salvar usuário:', error);
        this.saving = false;
        this.toastr.error('Erro ao salvar usuário. Tente novamente.', 'Erro');
      }
    });
  }

  markFormGroupTouched(): void {
    Object.keys(this.userForm.controls).forEach(key => {
      this.userForm.get(key)?.markAsTouched();
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.userForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getFieldError(fieldName: string): string {
    const field = this.userForm.get(fieldName);
    if (field?.errors) {
      if (field.errors['required']) return 'Campo obrigatório';
      if (field.errors['minlength'])
        return `Mínimo ${field.errors['minlength'].requiredLength} caracteres`;
      if (field.errors['maxlength'])
        return `Máximo ${field.errors['maxlength'].requiredLength} caracteres`;
      if (field.errors['email']) return 'Email inválido';
    }
    return '';
  }

  async cancel(): Promise<void> {
    if (this.userForm.dirty || this.selectedImageFile) {
      const result = await Swal.fire({
        title: 'Tem certeza?',
        text: 'Você tem alterações não salvas. Deseja realmente sair?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sim, sair',
        cancelButtonText: 'Cancelar'
      });

      if (result.isConfirmed) {
        this.router.navigate(['/admin/users']);
      }
    } else {
      this.router.navigate(['/admin/users']);
    }
  }
}
