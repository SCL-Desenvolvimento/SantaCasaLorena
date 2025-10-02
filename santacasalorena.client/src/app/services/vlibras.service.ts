// vlibras.service.ts
import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class VlibrasService {
  private scriptPromise: Promise<void> | null = null;
  private initialized = false;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) { }

  loadScript(): Promise<void> {
    if (!isPlatformBrowser(this.platformId)) return Promise.resolve();
    if ((window as any).VLibras) {
      return Promise.resolve();
    }
    if (this.scriptPromise) return this.scriptPromise;

    this.scriptPromise = new Promise<void>((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://vlibras.gov.br/app/vlibras-plugin.js';
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Falha ao carregar vlibras-plugin.js'));
      document.body.appendChild(script);
    });

    return this.scriptPromise;
  }

  async init(appUrl = 'https://vlibras.gov.br/app'): Promise<void> {
    if (!isPlatformBrowser(this.platformId)) return;
    await this.loadScript();
    if (this.initialized) return;
    const VL = (window as any).VLibras;
    if (!VL) {
      console.warn('VLibras não disponível após carregar o script.');
      return;
    }
    // instancia o widget (padrão: usa appUrl remoto). Documentação permite passar pasta local também.
    new VL.Widget(appUrl);
    this.initialized = true;
  }
}
