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
      name: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      email: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.minLength(6), Validators.maxLength(50)]],
      role: ["viewer", Validators.required],
      status: ["active", Validators.required]
    });
  }

  loadUser(id: string): void {
    this.loading = true;
    this.userService.getById(id).subscribe({
      next: (user: User) => {
        this.userForm.patchValue(user);
        this.userForm.get("password")?.setValidators([]); // Clear validators for password in edit mode
        this.userForm.get("password")?.updateValueAndValidity();
        this.loading = false;
      },
      error: (error: HttpErrorResponse) => {
        console.error("Erro ao carregar usuário:", error);
        alert("Erro ao carregar usuário.");
        this.loading = false;
        this.router.navigate(["/admin/users"]);
      }
    });
  }

  save(): void {
    if (this.userForm.invalid) {
      this.markFormGroupTouched();
      return;
    }

    this.saving = true;
    const userData = this.userForm.value;

    const operation = this.isEditMode
      ? this.userService.update(this.userId!, userData)
      : this.userService.create(userData);

    operation.subscribe({
      next: () => {
        this.saving = false;
        alert(this.isEditMode ? "Usuário atualizado com sucesso!" : "Usuário criado com sucesso!");
        this.router.navigate(["/admin/users"]);
      },
      error: (error: HttpErrorResponse) => {
        console.error("Erro ao salvar usuário:", error);
        alert("Erro ao salvar usuário. Verifique o console para mais detalhes.");
        this.saving = false;
      }
    });
  }

  markFormGroupTouched(): void {
    Object.keys(this.userForm.controls).forEach(key => {
      const control = this.userForm.get(key);
      control?.markAsTouched();
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.userForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getFieldError(fieldName: string): string {
    const field = this.userForm.get(fieldName);
    if (field?.errors) {
      if (field.errors['required']) return 'Este campo é obrigatório';
      if (field.errors['minlength']) return `Mínimo de ${field.errors['minlength'].requiredLength} caracteres`;
      if (field.errors['maxlength']) return `Máximo de ${field.errors['maxlength'].requiredLength} caracteres`;
      if (field.errors['email']) return 'Email inválido';
    }
    return '';
  }

  cancel(): void {
    if (this.userForm.dirty) {
      if (confirm('Você tem alterações não salvas. Deseja realmente sair?')) {
        this.router.navigate(['/admin/users']);
      }
    } else {
      this.router.navigate(['/admin/users']);
    }
  }
}

