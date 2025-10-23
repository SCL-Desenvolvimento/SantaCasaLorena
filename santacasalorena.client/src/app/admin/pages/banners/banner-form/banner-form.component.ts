import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HomeBanner } from '../../../../models/homeBanner';
import { HomeBannerService } from '../../../../services/home-banner.service';
import { HttpErrorResponse } from '@angular/common/http';
import { NewsService } from '../../../../services/news.service';
import { News } from '../../../../models/news';

@Component({
  selector: 'app-banner-form',
  standalone: false,
  templateUrl: './banner-form.component.html',
  styleUrls: ['./banner-form.component.css']
})
export class BannerFormComponent implements OnInit {
  bannerForm: FormGroup;
  previews = { desktop: '', tablet: '', mobile: '' };
  saving = false;
  loading = false;
  loadingNews = false;
  isEditMode = false;
  bannerId?: string;
  newsList: News[] = [];

  // Arquivos selecionados
  selectedFiles = {
    desktop: null as File | null,
    tablet: null as File | null,
    mobile: null as File | null
  };

  readonly IMAGE_SIZES = {
    desktop: { width: 1920, height: 540, label: 'Desktop (1920x540)' },
    tablet: { width: 1280, height: 800, label: 'Tablet (1280x800)' },
    mobile: { width: 600, height: 600, label: 'Mobile (600x600)' }
  };

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private homeBannerService: HomeBannerService,
    private newsService: NewsService
  ) {
    this.bannerForm = this.createForm();
  }

  createForm(): FormGroup {
    return this.fb.group({
      id: [''],
      title: ['', [Validators.required, Validators.maxLength(200)]],
      description: ['', [Validators.maxLength(500)]],
      order: [0, [Validators.required, Validators.min(0)]],
      timeSeconds: [5, [Validators.required, Validators.min(1)]],
      newsId: [{ value: '', disabled: false }],
      isActive: [true],
      createdAt: ['']
    });
  }

  ngOnInit(): void {
    this.bannerId = this.route.snapshot.paramMap.get('id') || undefined;
    this.isEditMode = !!this.bannerId;

    this.loadNewsList();

    if (this.isEditMode) {
      this.loadBanner();
    }
  }

  loadNewsList(): void {
    this.loadingNews = true;
    // Desabilita o campo usando a abordagem reativa correta
    this.bannerForm.get('newsId')?.disable();

    this.newsService.getAll().subscribe({
      next: (news: News[]) => {
        this.newsList = news;
        this.loadingNews = false;
        // Reabilita o campo após carregar
        this.bannerForm.get('newsId')?.enable();
      },
      error: (err: HttpErrorResponse) => {
        console.error('Erro ao carregar notícias:', err);
        this.loadingNews = false;
        // Reabilita mesmo com erro
        this.bannerForm.get('newsId')?.enable();
      }
    });
  }

  loadBanner(): void {
    this.loading = true;
    this.homeBannerService.getById(this.bannerId!).subscribe({
      next: (banner: HomeBanner) => {
        this.bannerForm.patchValue({
          id: banner.id,
          title: banner.title,
          description: banner.description,
          order: banner.order,
          timeSeconds: banner.timeSeconds,
          newsId: banner.newsId,
          isActive: banner.isActive,
          createdAt: banner.createdAt
        });

        this.previews.desktop = banner.desktopImageUrl || '';
        this.previews.tablet = banner.tabletImageUrl || '';
        this.previews.mobile = banner.mobileImageUrl || '';

        this.loading = false;
      },
      error: (err: HttpErrorResponse) => {
        console.error('Erro ao carregar banner:', err);
        alert('Erro ao carregar banner');
        this.loading = false;
      }
    });
  }

  onImageSelected(event: Event, type: 'desktop' | 'tablet' | 'mobile'): void {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    const file = input.files[0];

    // Validação básica
    if (!file.type.startsWith('image/')) {
      alert('Por favor, selecione apenas arquivos de imagem.');
      input.value = '';
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('A imagem deve ter no máximo 5MB.');
      input.value = '';
      return;
    }

    // Salva o arquivo e cria preview
    this.selectedFiles[type] = file;

    const reader = new FileReader();
    reader.onload = () => {
      this.previews[type] = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  removeImage(type: 'desktop' | 'tablet' | 'mobile'): void {
    this.previews[type] = '';
    this.selectedFiles[type] = null;

    const input = document.getElementById(`${type}File`) as HTMLInputElement;
    if (input) input.value = '';
  }

  save(): void {
    console.log('Iniciando salvamento...');

    if (this.bannerForm.invalid) {
      console.log('Formulário inválido:', this.getFormValidationErrors());
      this.markFormGroupTouched();
      return;
    }

    // Validação de imagens para novo banner
    if (!this.isEditMode) {
      const missingImages = [];
      if (!this.selectedFiles.desktop) missingImages.push('Desktop');
      if (!this.selectedFiles.tablet) missingImages.push('Tablet');
      if (!this.selectedFiles.mobile) missingImages.push('Mobile');

      if (missingImages.length > 0) {
        alert(`Por favor, selecione todas as três imagens: ${missingImages.join(', ')}`);
        return;
      }
    }

    this.saving = true;
    const formData = this.prepareFormData();

    console.log('Enviando FormData...');
    this.logFormData(formData);

    const request = this.isEditMode
      ? this.homeBannerService.update(this.bannerId!, formData)
      : this.homeBannerService.create(formData);

    request.subscribe({
      next: (response) => {
        console.log('Banner salvo com sucesso:', response);
        this.saving = false;
        alert('Banner salvo com sucesso!');
        this.router.navigate(['/admin/banners']);
      },
      error: (err: HttpErrorResponse) => {
        console.error('Erro detalhado ao salvar banner:', err);
        console.error('Erro completo:', err.error);

        let errorMessage = 'Erro ao salvar banner. ';
        if (err.error && typeof err.error === 'string') {
          errorMessage += err.error;
        } else if (err.error?.message) {
          errorMessage += err.error.message;
        } else if (err.status === 400) {
          errorMessage += 'Dados inválidos enviados para o servidor.';
        } else if (err.status === 500) {
          errorMessage += 'Erro interno do servidor. Verifique os logs do servidor.';
        } else {
          errorMessage += 'Tente novamente.';
        }

        alert(errorMessage);
        this.saving = false;
      }
    });
  }

  private prepareFormData(): FormData {
    // Usa getRawValue() para incluir campos disabled
    const formValue = this.bannerForm.getRawValue();
    const formData = new FormData();

    console.log('Preparando FormData com valores:', formValue);

    // Campos obrigatórios
    formData.append('title', formValue.title);
    formData.append('description', formValue.description || '');
    formData.append('timeSeconds', formValue.timeSeconds.toString());
    formData.append('order', formValue.order.toString());
    formData.append('isActive', formValue.isActive.toString());

    // Campos opcionais
    if (formValue.newsId) {
      formData.append('newsId', formValue.newsId);
    }

    // Arquivos
    if (this.selectedFiles.desktop) {
      formData.append('desktopFile', this.selectedFiles.desktop, this.selectedFiles.desktop.name);
    }
    if (this.selectedFiles.tablet) {
      formData.append('tabletFile', this.selectedFiles.tablet, this.selectedFiles.tablet.name);
    }
    if (this.selectedFiles.mobile) {
      formData.append('mobileFile', this.selectedFiles.mobile, this.selectedFiles.mobile.name);
    }

    return formData;
  }

  private logFormData(formData: FormData): void {
    console.log('=== FORM DATA ===');
    for (const pair of formData.entries()) {
      if (pair[1] instanceof File) {
        console.log(pair[0] + ': ', `File(${pair[1].name}, ${pair[1].size} bytes)`);
      } else {
        console.log(pair[0] + ': ', pair[1]);
      }
    }
    console.log('=================');
  }

  private getFormValidationErrors(): any {
    const errors: any = {};
    Object.keys(this.bannerForm.controls).forEach(key => {
      const control = this.bannerForm.get(key);
      if (control?.errors) {
        errors[key] = control.errors;
      }
    });
    return errors;
  }

  private markFormGroupTouched(): void {
    Object.keys(this.bannerForm.controls).forEach(key => {
      const control = this.bannerForm.get(key);
      control?.markAsTouched();
    });
  }

  // Getters para validação no template
  get title() { return this.bannerForm.get('title'); }
  get description() { return this.bannerForm.get('description'); }
  get order() { return this.bannerForm.get('order'); }
  get timeSeconds() { return this.bannerForm.get('timeSeconds'); }
  get newsId() { return this.bannerForm.get('newsId'); }

  cancel(): void {
    if (this.bannerForm.dirty || this.selectedFiles.desktop || this.selectedFiles.tablet || this.selectedFiles.mobile) {
      if (confirm('Tem certeza que deseja cancelar? As alterações não salvas serão perdidas.')) {
        this.router.navigate(['/admin/banners']);
      }
    } else {
      this.router.navigate(['/admin/banners']);
    }
  }
}
