
import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-image-uploader',
  standalone: false,
  templateUrl: './image-uploader.component.html',
  styleUrls: ['./image-uploader.component.css']
})
export class ImageUploaderComponent {
  @Input() imageUrl: string | undefined;
  @Input() label: string = 'Upload de Imagem';
  @Input() aspectRatio: string = '16/9'; // e.g., '16/9', '4/3', '1/1'
  @Input() maxFileSizeMB: number = 5;
  @Output() imageSelected = new EventEmitter<File | null>();

  imagePreview: string | ArrayBuffer | null = null;

  ngOnInit(): void {
    if (this.imageUrl) {
      this.imagePreview = this.imageUrl;
    }
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Por favor, selecione apenas arquivos de imagem.');
        this.clearSelection();
        return;
      }

      if (file.size > this.maxFileSizeMB * 1024 * 1024) {
        alert(`O arquivo deve ter no máximo ${this.maxFileSizeMB}MB.`);
        this.clearSelection();
        return;
      }

      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePreview = e.target.result;
      };
      reader.readAsDataURL(file);
      this.imageSelected.emit(file);
    } else {
      this.clearSelection();
    }
  }

  removeImage(): void {
    this.clearSelection();
    this.imageSelected.emit(null);
  }

  clearSelection(): void {
    this.imagePreview = null;
    const fileInput = document.getElementById('imageInput') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }
}

