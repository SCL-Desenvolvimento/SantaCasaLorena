import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-entity-dialog',
  standalone: false,
  templateUrl: './entity-dialog.component.html',
  styleUrl: './entity-dialog.component.css'
})
export class EntityDialogComponent implements OnChanges {
  @Input() activeTab!: string;             // news | services | convenios
  @Input() editingItem: any | null = null; // item em edição
  @Input() formData: any = {};             // objeto vindo do AdminLayout
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
          summary: [this.formData?.summary || '', Validators.required],
          content: [this.formData?.content || '', Validators.required],
          author: [this.formData?.author || '', Validators.required],
          category: [this.formData?.category || '', Validators.required],
          image_url: [this.formData?.image_url || '', Validators.pattern(/https?:\/\/.+/)],
          is_published: [this.formData?.is_published || false]
        });
        break;

      case 'services':
        this.form = this.fb.group({
          name: [this.formData?.name || '', Validators.required],
          description: [this.formData?.description || '', Validators.required],
          category: [this.formData?.category || '', Validators.required],
          icon: [this.formData?.icon || '', Validators.required],
          is_active: [this.formData?.is_active || false]
        });
        break;

      case 'convenios':
        this.form = this.fb.group({
          name: [this.formData?.name || '', Validators.required],
          description: [this.formData?.description || '', Validators.required],
          category: [this.formData?.category || '', Validators.required],
          phone: [this.formData?.phone || '', Validators.pattern(/^\(?\d{2}\)?\s?\d{4,5}-?\d{4}$/)],
          email: [this.formData?.email || '', Validators.email],
          website_url: [this.formData?.website_url || '', Validators.pattern(/https?:\/\/.+/)],
          logo_url: [this.formData?.logo_url || '', Validators.pattern(/https?:\/\/.+/)],
          is_active: [this.formData?.is_active || false]
        });
        break;
    }
  }

  handleSave() {
    if (this.form.valid) {
      this.save.emit(this.form.value); // envia dados validados
    } else {
      this.form.markAllAsTouched(); // força exibição dos erros
    }
  }
}

