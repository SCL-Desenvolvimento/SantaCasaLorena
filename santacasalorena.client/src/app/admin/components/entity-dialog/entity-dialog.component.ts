import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-entity-dialog',
  standalone: false,
  templateUrl: './entity-dialog.component.html',
  styleUrl: './entity-dialog.component.css'
})
export class EntityDialogComponent implements OnChanges {
  @Input() activeTab!: string;
  @Input() editingItem: any | null = null;
  @Input() formData: any = {};
  @Output() save = new EventEmitter<any>();
  @Output() close = new EventEmitter<void>();
  tabLabels: Record<string, string> = {
    dashboard: 'Dashboard',
    news: 'Notícia',
    convenios: 'Convênio',
    contacts: 'Contato',
    homeBanner: 'Banner da Home',
    patientManual: 'Manual do Paciente',
    provider: 'Provedor',
    specialty: 'Especialidade',
    transparencyPortal: 'Portal da Transparência',
    user: 'Usuário',
  };

  form!: FormGroup;

  constructor(private fb: FormBuilder, private toastrService: ToastrService) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['formData'] || changes['activeTab']) {
      this.buildForm();
    }
  }

  private buildForm() {
    switch (this.activeTab) {
      case 'news':
        this.form = this.fb.group({
          title: [this.formData?.title || '', Validators.required],
          description: [this.formData?.description || '', Validators.required],
          content: [this.formData?.content || '', Validators.required],
          category: [this.formData?.category || '', Validators.required],
          file: [null, this.editingItem ? [] : [Validators.required]],
          isPublished: [this.formData?.isPublished ?? false]
        });
        break;

      case 'convenios':
        this.form = this.fb.group({
          name: [this.formData?.name || '', Validators.required],
          file: [null, this.editingItem ? [] : [Validators.required]]
        });
        break;

      case 'homeBanner':
        this.form = this.fb.group({
          DesktopFile: [null, this.editingItem ? [] : [Validators.required]],
          TabletFile: [null, this.editingItem ? [] : [Validators.required]],
          MobileFile: [null, this.editingItem ? [] : [Validators.required]],
          timeSeconds: [this.formData?.timeSeconds || 5, [Validators.required, Validators.min(1)]],
          order: [this.formData?.order || 1, [Validators.required, Validators.min(1)]],
          newsId: [this.formData?.newsId || null]
        });
        break;

      case 'patientManual':
        this.form = this.fb.group({
          title: [this.formData?.title || '', Validators.required],
          content: [this.formData?.content || '', Validators.required],
          file: [null, this.editingItem ? [] : [Validators.required]]
        });
        break;

      case 'provider':
        this.form = this.fb.group({
          name: [this.formData?.name || '', Validators.required],
          file: [null],
          startYear: [this.formData?.startYear || new Date().getFullYear(), Validators.required],
          endYear: [this.formData?.endYear || null]
        });
        break;

      case 'specialty':
        this.form = this.fb.group({
          name: [this.formData?.name || '', Validators.required],
          type: [this.formData?.type || '', Validators.required],
          file: [null, this.editingItem ? [] : [Validators.required]]
        });
        break;

      case 'transparencyPortal':
        this.form = this.fb.group({
          category: [this.formData?.category || '', Validators.required],
          title: [this.formData?.title || '', Validators.required],
          description: [this.formData?.description || ''],
          type: [this.formData?.type || ''],
          year: [this.formData?.year || null],
          startYear: [this.formData?.startYear || null],
          endYear: [this.formData?.endYear || null],
          file: [null, this.editingItem ? [] : [Validators.required]]
        });
        break;

      case 'user':
        this.form = this.fb.group({
          username: [this.formData?.username || '', Validators.required],
          email: [this.formData?.email || '', [Validators.required, Validators.email]],
          password: ['', this.editingItem ? [] : [Validators.required]],
          file: [null]
        });
        break;
    }
  }

  onFileSelected(event: Event, controlName: string) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.form.patchValue({
        [controlName]: input.files[0]
      });
    }
  }

  handleSave() {
    if (this.form.valid) {
      const formValue = this.form.value;
      const formData = new FormData();

      for (const key of Object.keys(formValue)) {
        if (formValue[key] instanceof File) {
          formData.append(key, formValue[key]); // DesktopFile, TabletFile, MobileFile
        } else if (formValue[key] !== null && formValue[key] !== undefined) {
          formData.append(key, formValue[key]);
        }
      }

      this.toastrService.success('Registro salvo com sucesso!', this.tabLabels[this.activeTab]);
      this.save.emit(formData);
    } else {
      this.form.markAllAsTouched();
      this.toastrService.error('Preencha todos os campos obrigatórios!', 'Erro de Validação');
    }
  }
}
