import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '../../../../models/user';
import { UserService } from '../../../../services/user.service';
import { HttpErrorResponse } from '@angular/common/http';

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
    private userService: UserService
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

        // Carrega imagem
        if (user.photoUrl) {
          this.profileImagePreview = user.photoUrl;
        }

        this.loading = false;
      },
      error: (error: HttpErrorResponse) => {
        console.error('Erro ao carregar usuário:', error);
        alert('Erro ao carregar usuário.');
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
      alert('Por favor, selecione apenas arquivos de imagem.');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      alert('A imagem deve ter no máximo 2MB.');
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

  save(): void {
    if (this.userForm.invalid) {
      this.markFormGroupTouched();
      return;
    }

    if (!this.isEditMode && !this.userForm.value.password) {
      alert('Para criar um usuário, a senha é obrigatória.');
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
      next: () => {
        alert(this.isEditMode ? 'Usuário atualizado com sucesso!' : 'Usuário criado com sucesso!');
        this.saving = false;
        this.router.navigate(['/admin/users']);
      },
      error: (error: HttpErrorResponse) => {
        console.error('Erro ao salvar usuário:', error);
        alert('Erro ao salvar usuário. Tente novamente.');
        this.saving = false;
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

  cancel(): void {
    if (this.userForm.dirty || this.selectedImageFile) {
      if (confirm('Tem alterações não salvas. Deseja sair?')) {
        this.router.navigate(['/admin/users']);
      }
    } else {
      this.router.navigate(['/admin/users']);
    }
  }
}
