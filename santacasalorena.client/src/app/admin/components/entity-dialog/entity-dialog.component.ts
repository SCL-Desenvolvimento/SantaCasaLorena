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
          description: [this.formData?.description || '', Validators.required],
          content: [this.formData?.content || '', Validators.required],
          category: [this.formData?.category || '', Validators.required],
          imageUrl: [this.formData?.imageUrl || '', Validators.pattern(/https?:\/\/.+/)],
          isPublished: [this.formData?.isPublished || false]
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
          imageUrl: [this.formData?.imageUrl || '', Validators.pattern(/https?:\/\/.+/)],
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

