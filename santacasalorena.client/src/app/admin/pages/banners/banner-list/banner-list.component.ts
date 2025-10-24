import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HomeBanner } from '../../../../models/homeBanner';
import { HomeBannerService } from '../../../../services/home-banner.service';
import { HttpErrorResponse } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-banner-list',
  standalone: false,
  templateUrl: './banner-list.component.html',
  styleUrls: ['./banner-list.component.css']
})
export class BannerListComponent implements OnInit {
  loading = true;
  banners: HomeBanner[] = [];
  filteredBanners: HomeBanner[] = [];
  searchTerm = '';
  statusFilter = 'all';
  selectedItems: string[] = [];

  constructor(
    private router: Router,
    private homeBannerService: HomeBannerService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.loadBanners();
  }

  loadBanners(): void {
    this.loading = true;
    this.homeBannerService.getAll().subscribe({
      next: data => {
        this.banners = data.sort((a, b) => a.order - b.order);
        this.applyFilters();
        this.loading = false;
      },
      error: (err: HttpErrorResponse) => {
        this.toastr.error('Erro ao carregar os banners.', 'Erro');
        this.loading = false;
      }
    });
  }

  applyFilters(): void {
    let filtered = [...this.banners];

    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(item =>
        item.title?.toLowerCase().includes(term) ||
        item.description?.toLowerCase().includes(term) ||
        item.newsTitle?.toLowerCase().includes(term)
      );
    }

    if (this.statusFilter !== 'all') {
      filtered = filtered.filter(b => this.statusFilter === 'active' ? b.isActive : !b.isActive);
    }

    this.filteredBanners = filtered.sort((a, b) => a.order - b.order);
  }

  onSearch(): void {
    this.applyFilters();
  }

  onFilterChange(): void {
    this.applyFilters();
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.statusFilter = 'all';
    this.applyFilters();
  }

  createBanner(): void {
    this.router.navigate(['/admin/banners/new']);
  }

  editBanner(id: string): void {
    this.router.navigate(['/admin/banners/edit', id]);
  }

  toggleItemSelection(id: string): void {
    const index = this.selectedItems.indexOf(id);
    if (index > -1) this.selectedItems.splice(index, 1);
    else this.selectedItems.push(id);
  }

  isSelected(id: string): boolean {
    return this.selectedItems.includes(id);
  }

  toggleActiveStatus(banner: HomeBanner): void {
    this.homeBannerService.updateBannerStatus(banner.id, !banner.isActive).subscribe({
      next: () => {
        banner.isActive = !banner.isActive;
        this.toastr.success('Status atualizado com sucesso!', 'Sucesso');
        this.applyFilters();
      },
      error: () => this.toastr.error('Erro ao atualizar status.', 'Erro')
    });
  }

  async deleteBanner(id: string): Promise<void> {
    const result = await Swal.fire({
      title: 'Tem certeza?',
      text: 'Você não poderá desfazer esta ação!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sim, excluir',
      cancelButtonText: 'Cancelar'
    });

    if (!result.isConfirmed) return;

    try {
      await firstValueFrom(this.homeBannerService.delete(id));
      this.banners = this.banners.filter(b => b.id !== id);
      this.applyFilters();
      this.toastr.success('Banner excluído com sucesso!', 'Sucesso');
    } catch {
      this.toastr.error('Erro ao excluir banner.', 'Erro');
    }
  }

  async bulkDelete(): Promise<void> {
    if (this.selectedItems.length === 0) return;

    const result = await Swal.fire({
      title: `Excluir ${this.selectedItems.length} banner(s)?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sim, excluir',
      cancelButtonText: 'Cancelar'
    });

    if (!result.isConfirmed) return;

    try {
      await Promise.all(this.selectedItems.map(id => firstValueFrom(this.homeBannerService.delete(id))));
      this.banners = this.banners.filter(b => !this.selectedItems.includes(b.id));
      this.selectedItems = [];
      this.applyFilters();
      this.toastr.success('Banners excluídos com sucesso!', 'Sucesso');
    } catch {
      this.toastr.error('Erro ao excluir em massa.', 'Erro');
    }
  }

  async bulkActivate(): Promise<void> {
    await Promise.all(this.selectedItems.map(id => firstValueFrom(this.homeBannerService.updateBannerStatus(id, true))));
    this.banners.forEach(b => { if (this.selectedItems.includes(b.id)) b.isActive = true; });
    this.selectedItems = [];
    this.toastr.success('Banners ativados!', 'Sucesso');
    this.applyFilters();
  }

  async bulkDeactivate(): Promise<void> {
    await Promise.all(this.selectedItems.map(id => firstValueFrom(this.homeBannerService.updateBannerStatus(id, false))));
    this.banners.forEach(b => { if (this.selectedItems.includes(b.id)) b.isActive = false; });
    this.selectedItems = [];
    this.toastr.success('Banners desativados!', 'Sucesso');
    this.applyFilters();
  }

  // --- Movimentação de ordem ---
  async moveUp(index: number): Promise<void> {
    if (index === 0) return;
    const current = this.filteredBanners[index];
    const previous = this.filteredBanners[index - 1];
    await this.swapOrder(current, previous);
  }

  async moveDown(index: number): Promise<void> {
    if (index === this.filteredBanners.length - 1) return;
    const current = this.filteredBanners[index];
    const next = this.filteredBanners[index + 1];
    await this.swapOrder(current, next);
  }

  private async swapOrder(a: HomeBanner, b: HomeBanner): Promise<void> {
    try {
      await Promise.all([
        firstValueFrom(this.homeBannerService.updateBannerOrder(a.id, b.order)),
        firstValueFrom(this.homeBannerService.updateBannerOrder(b.id, a.order))
      ]);

      const tmp = a.order;
      a.order = b.order;
      b.order = tmp;

      this.filteredBanners.sort((x, y) => x.order - y.order);
    } catch {
      this.toastr.error('Erro ao alterar ordem.', 'Erro');
    }
  }
}
