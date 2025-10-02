import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HomeBanner } from '../../../../models/homeBanner';
import { HomeBannerService } from '../../../../services/home-banner.service';
import { HttpErrorResponse } from '@angular/common/http';

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

  // Filters
  searchTerm = '';
  statusFilter = 'all'; // all, active, inactive
  positionFilter = 'all';

  // Selection
  selectedItems: number[] = [];
  selectAll = false;

  positions = [
    { value: 'home', label: 'Página Inicial' },
    { value: 'header', label: 'Cabeçalho' },
    { value: 'sidebar', label: 'Barra Lateral' },
    { value: 'footer', label: 'Rodapé' }
  ];

  constructor(private router: Router, private homeBannerService: HomeBannerService) { }

  ngOnInit(): void {
    this.loadBanners();
  }

  loadBanners(): void {
    this.loading = true;
    this.homeBannerService.getAll().subscribe({
      next: (data) => {
        this.banners = data;
        this.applyFilters();
        this.loading = false;
      },
      error: (error: HttpErrorResponse) => {
        console.error('Erro ao carregar banners:', error);
        // Tratar erro, talvez exibir uma mensagem para o usuário
        this.loading = false;
      }
    });
  }

  applyFilters(): void {
    let filtered = [...this.banners];

    // Search filter
    if (this.searchTerm) {
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (this.statusFilter !== 'all') {
      filtered = filtered.filter(item =>
        this.statusFilter === 'active' ? item.isActive : !item.isActive
      );
    }

    // Position filter
    if (this.positionFilter !== 'all') {
      filtered = filtered.filter(item => item.position === this.positionFilter);
    }

    this.filteredBanners = filtered.sort((a, b) => a.order - b.order);
  }

  onSearch(): void {
    this.applyFilters();
  }

  onFilterChange(): void {
    this.applyFilters();
  }

  toggleSelectAll(): void {
    if (this.selectAll) {
      this.selectedItems = this.filteredBanners.map(item => item.id);
    } else {
      this.selectedItems = [];
    }
  }

  toggleItemSelection(id: number): void {
    const index = this.selectedItems.indexOf(id);
    if (index > -1) {
      this.selectedItems.splice(index, 1);
    } else {
      this.selectedItems.push(id);
    }
    this.selectAll = this.selectedItems.length === this.filteredBanners.length;
  }

  isSelected(id: number): boolean {
    return this.selectedItems.includes(id);
  }

  createBanner(): void {
    this.router.navigate(['/admin/banners/new']);
  }

  editBanner(id: number): void {
    this.router.navigate(['/admin/banners/edit', id]);
  }

  duplicateBanner(id: number): void {
    console.log('Duplicating banner:', id);
    // Implement duplication logic
  }

  toggleActiveStatus(id: number): void {
    const banner = this.banners.find(b => b.id === id);
    if (banner) {
      this.homeBannerService.updateBannerStatus(id, !banner.isActive).subscribe({
        next: () => {
          banner.isActive = !banner.isActive;
          this.applyFilters();
        },
        error: (error: HttpErrorResponse) => {
          console.error('Erro ao atualizar status do banner:', error);
        }
      });
    }
  }

  deleteBanner(id: number): void {
    if (confirm('Tem certeza que deseja excluir este banner?')) {
      this.homeBannerService.delete(id).subscribe({
        next: () => {
          this.banners = this.banners.filter(item => item.id !== id);
          this.applyFilters();
        },
        error: (error: HttpErrorResponse) => {
          console.error('Erro ao excluir banner:', error);
        }
      });
    }
  }

  bulkDelete(): void {
    if (this.selectedItems.length === 0) return;

    if (confirm(`Tem certeza que deseja excluir ${this.selectedItems.length} banner(s)?`)) {
      // Using Promise.all to wait for all deletions to complete
      Promise.all(this.selectedItems.map(id =>
        this.homeBannerService.delete(id).toPromise().catch(error => {
          console.error(`Erro ao excluir banner ${id}:`, error);
          // Optionally, handle individual errors or re-throw to fail all
        })
      )).then(() => {
        this.banners = this.banners.filter(item => !this.selectedItems.includes(item.id));
        this.selectedItems = [];
        this.selectAll = false;
        this.applyFilters();
      });
    }
  }

  bulkActivate(): void {
    if (this.selectedItems.length === 0) return;

    Promise.all(this.selectedItems.map(id =>
      this.homeBannerService.updateBannerStatus(id, true).toPromise().catch(error => {
        console.error(`Erro ao ativar banner ${id}:`, error);
      })
    )).then(() => {
      this.banners.forEach(banner => {
        if (this.selectedItems.includes(banner.id)) {
          banner.isActive = true;
        }
      });
      this.selectedItems = [];
      this.selectAll = false;
      this.applyFilters();
    });
  }

  bulkDeactivate(): void {
    if (this.selectedItems.length === 0) return;

    Promise.all(this.selectedItems.map(id =>
      this.homeBannerService.updateBannerStatus(id, false).toPromise().catch(error => {
        console.error(`Erro ao desativar banner ${id}:`, error);
      })
    )).then(() => {
      this.banners.forEach(banner => {
        if (this.selectedItems.includes(banner.id)) {
          banner.isActive = false;
        }
      });
      this.selectedItems = [];
      this.selectAll = false;
      this.applyFilters();
    });
  }

  moveUp(id: number): void {
    const index = this.filteredBanners.findIndex(item => item.id === id);
    if (index > 0) {
      const currentBanner = this.filteredBanners[index];
      const previousBanner = this.filteredBanners[index - 1];

      // Atualiza a ordem no backend para ambos os banners
      this.homeBannerService.updateBannerOrder(currentBanner.id, previousBanner.order).subscribe({
        next: () => {
          this.homeBannerService.updateBannerOrder(previousBanner.id, currentBanner.order).subscribe({
            next: () => {
              // Troca a ordem no array local após sucesso no backend
              [this.filteredBanners[index], this.filteredBanners[index - 1]] = [this.filteredBanners[index - 1], this.filteredBanners[index]];
              this.applyFilters(); // Re-aplica filtros para reordenar visualmente
            },
            error: (error: HttpErrorResponse) => {
              console.error('Erro ao atualizar ordem do banner anterior:', error);
            }
          });
        },
        error: (error: HttpErrorResponse) => {
          console.error('Erro ao atualizar ordem do banner atual:', error);
        }
      });
    }
  }

  moveDown(id: number): void {
    const index = this.filteredBanners.findIndex(item => item.id === id);
    if (index < this.filteredBanners.length - 1) {
      const currentBanner = this.filteredBanners[index];
      const nextBanner = this.filteredBanners[index + 1];

      // Atualiza a ordem no backend para ambos os banners
      this.homeBannerService.updateBannerOrder(currentBanner.id, nextBanner.order).subscribe({
        next: () => {
          this.homeBannerService.updateBannerOrder(nextBanner.id, currentBanner.order).subscribe({
            next: () => {
              // Troca a ordem no array local após sucesso no backend
              [this.filteredBanners[index], this.filteredBanners[index + 1]] = [this.filteredBanners[index + 1], this.filteredBanners[index]];
              this.applyFilters(); // Re-aplica filtros para reordenar visualmente
            },
            error: (error: HttpErrorResponse) => {
              console.error('Erro ao atualizar ordem do próximo banner:', error);
            }
          });
        },
        error: (error: HttpErrorResponse) => {
          console.error('Erro ao atualizar ordem do banner atual:', error);
        }
      });
    }
  }

  getPositionLabel(position: string): string {
    const pos = this.positions.find(p => p.value === position);
    return pos ? pos.label : position;
  }

  formatDate(dateString: string | undefined): string {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }

  isExpired(banner: HomeBanner): boolean {
    if (!banner.endDate) return false;
    return new Date(banner.endDate) < new Date();
  }

  isScheduled(banner: HomeBanner): boolean {
    if (!banner.startDate) return false;
    return new Date(banner.startDate) > new Date();
  }
}

