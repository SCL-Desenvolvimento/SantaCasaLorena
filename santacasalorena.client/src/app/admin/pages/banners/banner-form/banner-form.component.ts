import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HomeBanner } from '../../../../models/homeBanner';
import { HomeBannerService } from '../../../../services/home-banner.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-banner-form',
  standalone: false,
  templateUrl: './banner-form.component.html',
  styleUrls: ['./banner-form.component.css']
})
export class BannerFormComponent implements OnInit {
  bannerForm: FormGroup;
  loading = false;
  saving = false;
  isEditMode = false;
  bannerId?: number;

  positions = [
    { value: 'home', label: 'Página Inicial' },
    { value: 'header', label: 'Cabeçalho' },
    { value: 'sidebar', label: 'Barra Lateral' },
    { value: 'footer', label: 'Rodapé' }
  ];

  imagePreview?: string;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private homeBannerService: HomeBannerService
  ) {
    this.bannerForm = this.createForm();
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.bannerId = +params['id'];
        this.loadBanner(this.bannerId);
      }
    });
  }

  createForm(): FormGroup {
    return this.fb.group({
      title: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
      description: ['', Validators.maxLength(200)], // Changed from subtitle to description
      image: ['', Validators.required], // Changed from imageUrl to image and made required
      link: ['', [Validators.required, Validators.pattern(/^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/)]],
      isActive: [true], // Changed from status to isActive
      position: ['home', Validators.required], // Added position
      order: [0, Validators.required], // Added order
      startDate: ['', Validators.required],
      endDate: ['', Validators.required]
    });
  }

  loadBanner(id: number): void {
    this.loading = true;
    this.homeBannerService.getById(id).subscribe({
      next: (banner) => {
        this.bannerForm.patchValue({
          title: banner.title,
          description: banner.description,
          image: banner.image,
          link: banner.link,
          isActive: banner.isActive,
          position: banner.position,
          order: banner.order,
          startDate: banner.startDate ? new Date(banner.startDate).toISOString().split('T')[0] : '',
          endDate: banner.endDate ? new Date(banner.endDate).toISOString().split('T')[0] : ''
        });
        this.imagePreview = banner.image;
        this.loading = false;
      },
      error: (error: HttpErrorResponse) => {
        console.error('Erro ao carregar banner:', error);
        this.loading = false;
        alert('Erro ao carregar banner. Tente novamente mais tarde.');
        this.router.navigate(['/admin/banners']);
      }
    });
  }

  onImageSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Por favor, selecione apenas arquivos de imagem.');
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        alert('O arquivo deve ter no máximo 5MB.');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePreview = e.target.result;
        this.bannerForm.patchValue({ image: e.target.result }); // Set base64 string to image field
      };
      reader.readAsDataURL(file);
    }
  }

  removeImage(): void {
    this.imagePreview = undefined;
    const fileInput = document.getElementById('imageInput') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
    this.bannerForm.patchValue({ image: '' });
  }

  save(): void {
    if (this.bannerForm.invalid) {
      this.markFormGroupTouched();
      return;
    }

    this.saving = true;
    const bannerData: HomeBanner = this.bannerForm.value;

    if (this.isEditMode && this.bannerId) {
      this.homeBannerService.update(this.bannerId, bannerData).subscribe({
        next: () => {
          alert('Banner atualizado com sucesso!');
          this.saving = false;
          this.router.navigate(['/admin/banners']);
        },
        error: (error: HttpErrorResponse) => {
          console.error('Erro ao atualizar banner:', error);
          this.saving = false;
          alert('Erro ao atualizar banner. Tente novamente mais tarde.');
        }
      });
    } else {
      this.homeBannerService.create(bannerData).subscribe({
        next: () => {
          alert('Banner criado com sucesso!');
          this.saving = false;
          this.router.navigate(['/admin/banners']);
        },
        error: (error: HttpErrorResponse) => {
          console.error('Erro ao criar banner:', error);
          this.saving = false;
          alert('Erro ao criar banner. Tente novamente mais tarde.');
        }
      });
    }
  }

  markFormGroupTouched(): void {
    Object.keys(this.bannerForm.controls).forEach(key => {
      const control = this.bannerForm.get(key);
      control?.markAsTouched();
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.bannerForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getFieldError(fieldName: string): string {
    const field = this.bannerForm.get(fieldName);
    if (field?.errors) {
      if (field.errors['required']) return 'Este campo é obrigatório';
      if (field.errors['minlength']) return `Mínimo de ${field.errors['minlength'].requiredLength} caracteres`;
      if (field.errors['maxlength']) return `Máximo de ${field.errors['maxlength'].requiredLength} caracteres`;
      if (field.errors['pattern']) return 'Formato inválido';
    }
    return '';
  }

  cancel(): void {
    if (this.bannerForm.dirty) {
      if (confirm('Você tem alterações não salvas. Deseja realmente sair?')) {
        this.router.navigate(['/admin/banners']);
      }
    } else {
      this.router.navigate(['/admin/banners']);
    }
  }
}
