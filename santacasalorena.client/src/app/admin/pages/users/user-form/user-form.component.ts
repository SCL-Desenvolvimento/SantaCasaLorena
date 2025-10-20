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

  roles = [
    { value: 'admin', label: 'Administrador' },
    { value: 'editor', label: 'Editor' },
    { value: 'viewer', label: 'Visualizador' }
  ];

  statuses = [
    { value: 'active', label: 'Ativo' },
    { value: 'inactive', label: 'Inativo' }
  ];

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
      if (params["id"]) {
        this.isEditMode = true;
        this.userId = params["id"];
        if (this.userId)
          this.loadUser(this.userId);
      }
    });
  }

  createForm(): FormGroup {
    return this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.minLength(6), Validators.maxLength(50)]],
      role: ['viewer', Validators.required],
      status: ['active', Validators.required]
    });
  }

  loadUser(id: string): void {
    this.loading = true;
    this.userService.getById(id).subscribe({
      next: (user: User) => {
        console.log('Usuário carregado:', user);
        this.userForm.patchValue({
          username: user.username,
          email: user.email,
          role: user.role,
          status: user.status
        });

        // Remove validação de senha em edição
        this.userForm.get('password')?.clearValidators();
        this.userForm.get('password')?.updateValueAndValidity();

        // Carrega photoUrl se existir
        if (user.photoUrl) {
          this.profileImagePreview = user.photoUrl;
        }

        this.loading = false;
      },
      error: (error: HttpErrorResponse) => {
        console.error('Erro detalhado ao carregar usuário:', error);
        console.error('Status:', error.status);
        console.error('Mensagem:', error.message);
        console.error('Erro completo:', error.error);

        alert('Erro ao carregar usuário.');
        this.loading = false;
        this.router.navigate(['/admin/users']);
      }
    });
  }

  // Método para acionar o input de arquivo
  triggerFileInput(): void {
    const fileInput = document.getElementById('profileImage') as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  }

  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    const file = input.files[0];

    // Validações básicas
    if (!file.type.startsWith('image/')) {
      alert('Por favor, selecione apenas arquivos de imagem.');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      alert('A imagem deve ter no máximo 2MB.');
      return;
    }

    this.selectedImageFile = file;

    // Cria preview
    const reader = new FileReader();
    reader.onload = () => {
      this.profileImagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  removeImage(): void {
    this.profileImagePreview = '';
    this.selectedImageFile = null;

    const input = document.getElementById('profileImage') as HTMLInputElement;
    if (input) input.value = '';
  }

  save(): void {
    console.log('=== INICIANDO SALVAMENTO ===');

    if (this.userForm.invalid) {
      console.log('Formulário inválido:', this.getFormValidationErrors());
      this.markFormGroupTouched();
      return;
    }

    // Validação extra para criação
    if (!this.isEditMode && !this.userForm.value.password) {
      alert('Para criar um usuário, a senha é obrigatória.');
      return;
    }

    this.saving = true;

    const formValue = this.userForm.value;

    console.log('Valores do formulário:', formValue);

    // Cria objeto User SIMPLIFICADO - sem campos problemáticos
    const userData: any = {
      username: formValue.username,
      email: formValue.email,
      role: formValue.role,
      status: formValue.status
    };

    // Password - obrigatório em criação, opcional em edição
    if (this.isEditMode) {
      // Em edição, só envia password se foi alterado
      if (formValue.password && formValue.password.length >= 6) {
        userData.password = formValue.password;
      }
    } else {
      // Em criação, password é obrigatório
      userData.password = formValue.password;
    }

    // photoUrl apenas se existe imagem (e não é muito grande)
    if (this.profileImagePreview && this.profileImagePreview.length < 100000) { // Limite de ~100KB
      userData.photoUrl = this.profileImagePreview;
    }

    console.log('Dados que serão enviados para a API:', userData);

    const operation = this.isEditMode
      ? this.userService.update(this.userId!, userData)
      : this.userService.create(userData);

    operation.subscribe({
      next: (response) => {
        console.log('✅ Sucesso! Resposta do servidor:', response);
        this.saving = false;
        alert(this.isEditMode ? 'Usuário atualizado com sucesso!' : 'Usuário criado com sucesso!');
        this.router.navigate(['/admin/users']);
      },
      error: (error: HttpErrorResponse) => {
        console.error('❌ Erro detalhado ao salvar usuário:', error);
        console.error('Status:', error.status);
        console.error('Mensagem:', error.message);
        console.error('Erro completo:', error.error);

        let errorMessage = 'Erro ao salvar usuário. ';

        if (error.status === 400) {
          errorMessage += 'Dados inválidos enviados. ';
          if (error.error && typeof error.error === 'object') {
            // Tenta extrair mensagens de validação do backend
            const validationErrors = error.error;
            Object.keys(validationErrors).forEach(key => {
              errorMessage += `${key}: ${validationErrors[key]}. `;
            });
          } else if (error.error) {
            errorMessage += error.error;
          }
        } else if (error.status === 409) {
          errorMessage += 'Email ou username já existe.';
        } else if (error.status === 500) {
          errorMessage += 'Erro interno do servidor.';
        } else {
          errorMessage += 'Tente novamente.';
        }

        alert(errorMessage);
        this.saving = false;
      }
    });
  }

  private getFormValidationErrors(): any {
    const errors: any = {};
    Object.keys(this.userForm.controls).forEach(key => {
      const control = this.userForm.get(key);
      if (control?.errors) {
        errors[key] = control.errors;
      }
    });
    return errors;
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
      if (field.errors['minlength']) return `Mínimo ${field.errors['minlength'].requiredLength} caracteres`;
      if (field.errors['maxlength']) return `Máximo ${field.errors['maxlength'].requiredLength} caracteres`;
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
