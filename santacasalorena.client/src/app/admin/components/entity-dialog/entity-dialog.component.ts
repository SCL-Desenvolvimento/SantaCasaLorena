import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

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

  form!: FormGroup;

  constructor(private fb: FormBuilder) { }

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
          file: [null],
          isPublished: [this.formData?.isPublished ?? false]
        });
        break;

      case 'convenios':
        this.form = this.fb.group({
          name: [this.formData?.name || '', Validators.required],
          file: [null],
        });
        break;

      case 'homeBanner':
        this.form = this.fb.group({
          file: [null],
          timeSeconds: [this.formData?.timeSeconds || 5, [Validators.required, Validators.min(1)]],
          order: [this.formData?.order || 1, [Validators.required, Validators.min(1)]],
          newsId: [this.formData?.newsId || null]
        });
        break;

      case 'patientManual':
        this.form = this.fb.group({
          title: [this.formData?.title || '', Validators.required],
          content: [this.formData?.content || '', Validators.required],
          file: [null]
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
          file: [null]
        });
        break;

      case 'transparencyPortal':
        this.form = this.fb.group({
          agreementName: [this.formData?.agreementName || '', Validators.required],
          type: [this.formData?.type || '', Validators.required],
          startYear: [this.formData?.startYear || new Date().getFullYear(), Validators.required],
          endYear: [this.formData?.endYear || null],
          file: [null]
        });
        break;

      case 'user':
        this.form = this.fb.group({
          username: [this.formData?.username || '', Validators.required],
          email: [this.formData?.email || '', [Validators.required, Validators.email]],
          userType: [this.formData?.userType || '', Validators.required],
          department: [this.formData?.department || ''],
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
          formData.append(key, formValue[key]);
        } else if (formValue[key] !== null && formValue[key] !== undefined) {
          formData.append(key, formValue[key]);
        }
      }

      this.save.emit(formData);
    } else {
      this.form.markAllAsTouched();
    }
  }
}
