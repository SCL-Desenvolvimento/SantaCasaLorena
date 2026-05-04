import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HomeBanner } from '../../../../models/homeBanner';
import { HomeBannerService } from '../../../../services/home-banner.service';
import { HttpErrorResponse } from '@angular/common/http';
import { NewsService } from '../../../../services/news.service';
import { News } from '../../../../models/news';
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';

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
    private newsService: NewsService,
    private toastr: ToastrService
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
    this.bannerForm.get('newsId')?.disable();

    this.newsService.getAll().subscribe({
      next: (news: News[]) => {
        this.newsList = news;
        this.loadingNews = false;
        this.bannerForm.get('newsId')?.enable();
      },
      error: (err: HttpErrorResponse) => {
        this.toastr.error('Erro ao carregar notícias');
        this.loadingNews = false;
        this.bannerForm.get('newsId')?.enable();
      }
    });
  }

  loadBanner(): void {
    this.loading = true;
    this.homeBannerService.getById(this.bannerId!).subscribe({
      next: (banner: HomeBanner) => {
        this.bannerForm.patchValue(banner);
        this.previews.desktop = banner.desktopImageUrl || '';
        this.previews.tablet = banner.tabletImageUrl || '';
        this.previews.mobile = banner.mobileImageUrl || '';
        this.loading = false;
      },
      error: () => {
        this.toastr.error('Erro ao carregar banner.');
        this.loading = false;
      }
    });
  }

  onImageSelected(event: Event, type: 'desktop' | 'tablet' | 'mobile'): void {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    const file = input.files[0];

    if (!file.type.startsWith('image/')) {
      Swal.fire('Atenção', 'Selecione apenas arquivos de imagem!', 'warning');
      input.value = '';
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      Swal.fire('Atenção', 'A imagem deve ter no máximo 5MB.', 'warning');
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
    if (this.bannerForm.invalid) {
      this.toastr.warning('Preencha os campos obrigatórios.');
      this.markFormGroupTouched();
      return;
    }

    if (!this.isEditMode && (!this.selectedFiles.desktop || !this.selectedFiles.tablet || !this.selectedFiles.mobile)) {
      Swal.fire('Atenção', 'Envie todas as 3 imagens (Desktop, Tablet e Mobile).', 'warning');
      return;
    }

    this.saving = true;
    const formData = this.prepareFormData();

    const request = this.isEditMode
      ? this.homeBannerService.update(this.bannerId!, formData)
      : this.homeBannerService.create(formData);

    request.subscribe({
      next: () => {
        Swal.fire('Sucesso!', 'Banner salvo com sucesso!', 'success').then(() => {
          this.router.navigate(['/admin/banners']);
        });
        this.saving = false;
      },
      error: (err: HttpErrorResponse) => {
        this.toastr.error('Erro ao salvar banner.');
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

  private markFormGroupTouched(): void {
    Object.keys(this.bannerForm.controls).forEach(key => {
      const control = this.bannerForm.get(key);
      control?.markAsTouched();
    });
  }

  // Getters para validação no template
  get title() {
    return this.bannerForm.get('title');
  }
  get description() {
    return this.bannerForm.get('description');
  }
  get order() {
    return this.bannerForm.get('order');
  }
  get timeSeconds() {
    return this.bannerForm.get('timeSeconds');
  }
  get newsId() {
    return this.bannerForm.get('newsId');
  }

  cancel(): void {
    Swal.fire({
      title: 'Cancelar?',
      text: 'As alterações não salvas serão perdidas.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sim, cancelar',
      cancelButtonText: 'Não'
    }).then(result => {
      if (result.isConfirmed) this.router.navigate(['/admin/banners']);
    });
  }
}
