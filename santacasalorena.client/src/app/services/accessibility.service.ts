import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';

export interface AccessibilitySettings {
  fontSize: number;
  highContrast: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AccessibilityService {
  private renderer: Renderer2;
  private settings: AccessibilitySettings;

  private readonly STORAGE_KEY = 'accessibility_settings';
  private readonly INITIAL_FONT_SIZE = 16;
  private readonly FONT_SIZE_STEP = 2;
  private readonly MAX_FONT_SIZE = 24;
  private readonly MIN_FONT_SIZE = 12;

  constructor(rendererFactory: RendererFactory2) {
    this.renderer = rendererFactory.createRenderer(null, null);
    this.settings = this.loadSettings();
    this.applySettings();
  }

  // Carrega as configurações do localStorage
  private loadSettings(): AccessibilitySettings {
    const savedSettings = localStorage.getItem(this.STORAGE_KEY);
    if (savedSettings) {
      return JSON.parse(savedSettings);
    }
    // Retorna o padrão se nada for encontrado
    return {
      fontSize: this.INITIAL_FONT_SIZE,
      highContrast: false,
    };
  }

  // Salva as configurações no localStorage
  private saveSettings(): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.settings));
  }

  // Aplica as configurações salvas ao body do documento
  private applySettings(): void {
    // Aplica o tamanho da fonte
    this.renderer.setStyle(document.body, 'font-size', `${this.settings.fontSize}px`);

    // Aplica ou remove a classe de alto contraste
    if (this.settings.highContrast) {
      this.renderer.addClass(document.body, 'high-contrast');
    } else {
      this.renderer.removeClass(document.body, 'high-contrast');
    }
  }

  // --- Funções Públicas ---

  increaseFont(): void {
    if (this.settings.fontSize < this.MAX_FONT_SIZE) {
      this.settings.fontSize += this.FONT_SIZE_STEP;
      this.applySettings();
      this.saveSettings();
    }
  }

  decreaseFont(): void {
    if (this.settings.fontSize > this.MIN_FONT_SIZE) {
      this.settings.fontSize -= this.FONT_SIZE_STEP;
      this.applySettings();
      this.saveSettings();
    }
  }

  toggleContrast(): void {
    this.settings.highContrast = !this.settings.highContrast;
    this.applySettings();
    this.saveSettings();
  }

  reset(): void {
    this.settings = {
      fontSize: this.INITIAL_FONT_SIZE,
      highContrast: false,
    };
    this.applySettings();
    this.saveSettings();
  }

  // Expõe as configurações atuais, caso o componente precise saber
  getCurrentSettings(): AccessibilitySettings {
    return this.settings;
  }
}
