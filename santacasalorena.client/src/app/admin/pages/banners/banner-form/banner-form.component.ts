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

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private homeBannerService: HomeBannerService,
    private newsService: NewsService // ✅ injetado
  ) {
    this.bannerForm = this.createForm();
  }

  createForm(): FormGroup {
    return this.fb.group({
      id: [''],
      title: ['', [Validators.required, Validators.maxLength(200)]],
      description: ['', [Validators.maxLength(500)]],
      desktopImageUrl: ['', Validators.required],
      tabletImageUrl: ['', Validators.required],
      mobileImageUrl: ['', Validators.required],
      order: [0, Validators.required],
      timeSeconds: [5, [Validators.required, Validators.min(1)]],
      newsId: [''],
      isActive: [true],
      createdAt: ['']
    });
  }

  ngOnInit(): void {
    this.bannerId = this.route.snapshot.paramMap.get('id') || undefined;
    this.isEditMode = !!this.bannerId;

    this.loadNewsList(); // ✅ carrega as notícias

    if (this.isEditMode) {
      this.loadBanner();
    }
  }

  loadNewsList(): void {
    this.loadingNews = true;
    this.newsService.getAll().subscribe({
      next: (news: News[]) => {
        this.newsList = news;
        this.loadingNews = false;
      },
      error: (err: HttpErrorResponse) => {
        console.error('Erro ao carregar notícias:', err);
        this.loadingNews = false;
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
      error: (err: HttpErrorResponse) => {
        console.error('Erro ao carregar banner:', err);
        this.loading = false;
      }
    });
  }

  onImageSelected(event: Event, field: 'desktopImageUrl' | 'tabletImageUrl' | 'mobileImageUrl'): void {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    const file = input.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      this.previews[field.split('ImageUrl')[0] as 'desktop' | 'tablet' | 'mobile'] = reader.result as string;
      this.bannerForm.patchValue({ [field]: reader.result });
    };
    reader.readAsDataURL(file);
  }

  removeImage(field: 'desktopImageUrl' | 'tabletImageUrl' | 'mobileImageUrl'): void {
    this.previews[field.split('ImageUrl')[0] as 'desktop' | 'tablet' | 'mobile'] = '';
    this.bannerForm.patchValue({ [field]: '' });
  }

  save(): void {
    if (this.bannerForm.invalid) {
      this.bannerForm.markAllAsTouched();
      return;
    }

    this.saving = true;

    const formData = new FormData();
    const formValue = this.bannerForm.value;

    // Campos de texto
    formData.append('Title', formValue.title);
    formData.append('Description', formValue.description || '');
    formData.append('TimeSeconds', formValue.timeSeconds.toString());
    formData.append('Order', formValue.order.toString());
    formData.append('IsActive', formValue.isActive.toString());

    if (formValue.newsId) {
      formData.append('NewsId', formValue.newsId);
    }

    // Arquivos
    if (formValue.desktopFile) formData.append('DesktopFile', formValue.desktopFile);
    if (formValue.tabletFile) formData.append('TabletFile', formValue.tabletFile);
    if (formValue.mobileFile) formData.append('MobileFile', formValue.mobileFile);

    const request = this.isEditMode
      ? this.homeBannerService.update(this.bannerId!, formData)
      : this.homeBannerService.create(formData);

    request.subscribe({
      next: () => {
        this.saving = false;
        this.router.navigate(['/admin/banners']);
      },
      error: (err: HttpErrorResponse) => {
        console.error('Erro ao salvar banner:', err);
        this.saving = false;
      }
    });
  }


  cancel(): void {
    this.router.navigate(['/admin/banners']);
  }
}
