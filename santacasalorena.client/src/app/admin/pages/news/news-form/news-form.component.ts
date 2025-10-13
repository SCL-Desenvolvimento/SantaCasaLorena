import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { News } from '../../../../models/news';
import { NewsService } from '../../../../services/news.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../../../../services/auth.service';

@Component({
  selector: 'app-news-form',
  standalone: false,
  templateUrl: './news-form.component.html',
  styleUrls: ['./news-form.component.css']
})
export class NewsFormComponent implements OnInit {
  newsForm: FormGroup;
  loading = false;
  saving = false;
  isEditMode = false;
  newsId?: string;

  categories = [
    'Saúde',
    'Educação',
    'Infraestrutura',
    'Meio Ambiente',
    'Cultura',
    'Esporte',
    'Assistência Social'
  ];

  availableTags = [
    'urgente',
    'importante',
    'novidade',
    'evento',
    'serviço',
    'informativo',
    'comunicado',
    'atualização'
  ];

  selectedTags: string[] = [];
  imageFile?: File; // Para armazenar o arquivo de imagem
  imagePreview?: string;

  // Editor configuration
  editorConfig = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],
      ['blockquote', 'code-block'],
      [{ 'header': 1 }, { 'header': 2 }],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      [{ 'script': 'sub' }, { 'script': 'super' }],
      [{ 'indent': '-1' }, { 'indent': '+1' }],
      [{ 'direction': 'rtl' }],
      [{ 'size': ['small', false, 'large', 'huge'] }],
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'font': [] }],
      [{ 'align': [] }],
      ['clean'],
      ['link', 'image', 'video']
    ]
  };

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private newsService: NewsService,
    private authService: AuthService
  ) {
    this.newsForm = this.createForm();
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.newsId = params['id'];
        if (this.newsId)
          this.loadNews(this.newsId);
      }
    });
  }

  createForm(): FormGroup {
    return this.fb.group({
      title: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(200)]],
      description: ['', [Validators.required, Validators.minLength(50), Validators.maxLength(300)]],
      content: ['', [Validators.required, Validators.minLength(100)]],
      category: ['', Validators.required],
      isPublished: [false],
      publishedAt: [''],
      seoTitle: ['', Validators.maxLength(60)],
      seoDescription: ['', Validators.maxLength(160)],
      seoKeywords: ['', Validators.maxLength(200)]
    });
  }

  loadNews(id: string): void {
    this.loading = true;
    this.newsService.getById(id).subscribe({
      next: (news: News) => {
        this.newsForm.patchValue({
          title: news.title,
          description: news.description,
          content: news.content,
          category: news.category,
          isPublished: news.isPublished,
          publishedAt: news.publishedAt ? new Date(news.publishedAt).toISOString().slice(0, 16) : '',
          seoTitle: news.seoTitle,
          seoDescription: news.seoDescription,
          seoKeywords: news.seoKeywords
        });
        this.selectedTags = news.tags || [];
        this.imagePreview = news.imageUrl;
        this.loading = false;
      },
      error: (error: HttpErrorResponse) => {
        console.error('Erro ao carregar notícia:', error);
        alert('Erro ao carregar notícia. Por favor, tente novamente.');
        this.loading = false;
        this.router.navigate(['/admin/news']);
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

      this.imageFile = file; // Armazena o arquivo
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePreview = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  triggerFileInput(): void {
    document.getElementById('imageInput')?.click();
  }

  removeImage(): void {
    this.imageFile = undefined;
    this.imagePreview = undefined;
    const fileInput = document.getElementById('imageInput') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }

  addTag(tag: string): void {
    if (!this.selectedTags.includes(tag)) {
      this.selectedTags.push(tag);
    }
  }

  removeTag(tag: string): void {
    this.selectedTags = this.selectedTags.filter(t => t !== tag);
  }

  addCustomTag(event: any): void {
    const input = event.target;
    const tag = input.value.trim();

    if (tag && !this.selectedTags.includes(tag)) {
      this.selectedTags.push(tag);
      input.value = '';
    }
  }

  generateSeoFromTitle(): void {
    const title = this.newsForm.get('title')?.value;
    if (title && !this.newsForm.get('seoTitle')?.value) {
      this.newsForm.patchValue({
        seoTitle: title.substring(0, 60)
      });
    }
  }

  generateSeoFromDescription(): void {
    const description = this.newsForm.get('description')?.value;
    if (description && !this.newsForm.get('seoDescription')?.value) {
      this.newsForm.patchValue({
        seoDescription: description.substring(0, 160)
      });
    }
  }

  onPublishToggle(): void {
    const isPublished = this.newsForm.get('isPublished')?.value;
    if (isPublished && !this.newsForm.get('publishedAt')?.value) {
      this.newsForm.patchValue({
        publishedAt: new Date().toISOString().slice(0, 16)
      });
    }
  }

  previewNews(): void {
    if (this.newsId) {
      this.router.navigate(['/admin/news/view', this.newsId]);
    }
  }

  saveDraft(): void {
    this.newsForm.patchValue({ isPublished: false });
    this.save();
  }

  publishNews(): void {
    this.newsForm.patchValue({
      isPublished: true,
      publishedAt: this.newsForm.get('publishedAt')?.value || new Date().toISOString().slice(0, 16)
    });
    this.save();
  }

  save(): void {
    if (this.newsForm.invalid) {
      this.markFormGroupTouched();
      alert('Por favor, preencha todos os campos obrigatórios e corrija os erros.');
      return;
    }

    this.saving = true;
    const newsData = this.getNewsData();
    console.log(newsData);

    let operation: Observable<News>;

    if (this.isEditMode && this.newsId) {
      operation = this.newsService.update(this.newsId, newsData, this.imageFile);
    } else {
      operation = this.newsService.create(newsData, this.imageFile);
    }

    operation.subscribe({
      next: () => {
        this.saving = false;
        alert(this.isEditMode ? 'Notícia atualizada com sucesso!' : 'Notícia criada com sucesso!');
        this.router.navigate(['/admin/news']);
      },
      error: (error: HttpErrorResponse) => {
        console.error('Erro ao salvar notícia:', error);
        alert(`Erro ao salvar notícia: ${error.error?.message || error.message}`);
        this.saving = false;
      }
    });
  }

  getNewsData(): News {
    const formValue = this.newsForm.value;
    return {
      id: this.newsId,
      title: formValue.title,
      description: formValue.description,
      content: formValue.content,
      category: formValue.category,
      tags: this.selectedTags,
      imageUrl: '',
      isPublished: formValue.isPublished,
      publishedAt: formValue.isPublished && formValue.publishedAt ? new Date(formValue.publishedAt).toISOString() : undefined,
      seoTitle: formValue.seoTitle,
      seoDescription: formValue.seoDescription,
      seoKeywords: formValue.seoKeywords,
      userId: this.authService.getUserInfo('id') ?? undefined
      // createdAt, updatedAt, views são gerenciados pelo backend
    };
  }

  markFormGroupTouched(): void {
    Object.keys(this.newsForm.controls).forEach(key => {
      const control = this.newsForm.get(key);
      control?.markAsTouched();
      control?.updateValueAndValidity();
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.newsForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getFieldError(fieldName: string): string {
    const field = this.newsForm.get(fieldName);
    if (field?.errors) {
      if (field.errors['required']) return 'Este campo é obrigatório';
      if (field.errors['minlength']) return `Mínimo de ${field.errors['minlength'].requiredLength} caracteres`;
      if (field.errors['maxlength']) return `Máximo de ${field.errors['maxlength'].requiredLength} caracteres`;
    }
    return '';
  }

  cancel(): void {
    if (this.newsForm.dirty) {
      if (confirm('Você tem alterações não salvas. Deseja realmente sair?')) {
        this.router.navigate(['/admin/news']);
      }
    } else {
      this.router.navigate(['/admin/news']);
    }
  }
}
