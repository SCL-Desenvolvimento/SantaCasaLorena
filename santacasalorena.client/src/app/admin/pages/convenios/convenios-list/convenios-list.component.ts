import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Agreement } from '../../../../models/agreement';
import { AgreementService } from '../../../../services/agreement.service';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-convenios-list',
  standalone: false,
  templateUrl: './convenios-list.component.html',
  styleUrls: ['./convenios-list.component.css']
})
export class ConveniosListComponent implements OnInit {
  convenios: Agreement[] = [];
  filteredConvenios: Agreement[] = [];
  searchTerm = '';
  statusFilter: 'all' | 'active' | 'inactive' = 'all';
  loading = true;
  selectedItems: string[] = [];

  constructor(
    private router: Router,
    private agreementService: AgreementService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.loadConvenios();
  }

  loadConvenios(): void {
    this.loading = true;
    this.agreementService.getAll().subscribe({
      next: (data) => {
        this.convenios = data;
        this.applyFilters();
        this.loading = false;
      },
      error: (error: HttpErrorResponse) => {
        console.error(error);
        this.toastr.error('Erro ao carregar convênios', 'Erro');
        this.loading = false;
      }
    });
  }

  applyFilters(): void {
    this.filteredConvenios = this.convenios.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchesStatus =
        this.statusFilter === 'all' ||
        (this.statusFilter === 'active' && item.isActive) ||
        (this.statusFilter === 'inactive' && !item.isActive);
      return matchesSearch && matchesStatus;
    });
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

  // CRUD
  createConvenio(): void {
    this.router.navigate(['/admin/convenios/new']);
  }

  editConvenio(id: string): void {
    this.router.navigate([`/admin/convenios/edit/${id}`]);
  }

  toggleActiveStatus(convenio: Agreement): void {
    this.agreementService.toggleActive(convenio.id).subscribe({
      next: (updated) => {
        convenio.isActive = updated.isActive;
        this.toastr.success('Status atualizado com sucesso', 'Sucesso');
      },
      error: () => this.toastr.error('Erro ao alterar status', 'Erro')
    });
  }

  deleteConvenio(id: string): void {
    Swal.fire({
      title: 'Tem certeza?',
      text: 'Você não poderá reverter essa ação!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sim, excluir',
      cancelButtonText: 'Cancelar'
    }).then(result => {
      if (result.isConfirmed) {
        this.agreementService.delete(id).subscribe({
          next: () => {
            this.convenios = this.convenios.filter(c => c.id !== id);
            this.applyFilters();
            this.toastr.success('Convênio excluído com sucesso!', 'Sucesso');
          },
          error: () => this.toastr.error('Erro ao excluir convênio', 'Erro')
        });
      }
    });
  }

  // Seleção
  toggleAllSelection(): void {
    if (this.isAllSelected()) {
      this.selectedItems = [];
    } else {
      this.selectedItems = this.filteredConvenios.map(c => c.id);
    }
  }

  toggleItemSelection(id: string): void {
    const index = this.selectedItems.indexOf(id);
    if (index > -1) this.selectedItems.splice(index, 1);
    else this.selectedItems.push(id);
  }

  isSelected(id: string): boolean {
    return this.selectedItems.includes(id);
  }

  isAllSelected(): boolean {
    return (
      this.filteredConvenios.length > 0 &&
      this.selectedItems.length === this.filteredConvenios.length
    );
  }

  // Ações em massa
  bulkActivate(): void {
    if (this.selectedItems.length === 0) {
      this.toastr.warning('Nenhum item selecionado', 'Atenção');
      return;
    }

    this.agreementService.bulkToggle(this.selectedItems, true).subscribe({
      next: () => {
        this.convenios.forEach(c => {
          if (this.selectedItems.includes(c.id)) c.isActive = true;
        });
        this.toastr.success('Convênios ativados com sucesso', 'Sucesso');
        this.applyFilters();
      },
      error: () => this.toastr.error('Erro ao ativar convênios', 'Erro')
    });
  }

  bulkDeactivate(): void {
    if (this.selectedItems.length === 0) {
      this.toastr.warning('Nenhum item selecionado', 'Atenção');
      return;
    }

    this.agreementService.bulkToggle(this.selectedItems, false).subscribe({
      next: () => {
        this.convenios.forEach(c => {
          if (this.selectedItems.includes(c.id)) c.isActive = false;
        });
        this.toastr.success('Convênios desativados com sucesso', 'Sucesso');
        this.applyFilters();
      },
      error: () => this.toastr.error('Erro ao desativar convênios', 'Erro')
    });
  }

  bulkDelete(): void {
    if (this.selectedItems.length === 0) {
      this.toastr.warning('Nenhum item selecionado', 'Atenção');
      return;
    }

    Swal.fire({
      title: 'Excluir selecionados?',
      text: 'Essa ação não poderá ser desfeita!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sim, excluir',
      cancelButtonText: 'Cancelar'
    }).then(result => {
      if (result.isConfirmed) {
        this.agreementService.bulkDelete(this.selectedItems).subscribe({
          next: () => {
            this.convenios = this.convenios.filter(c => !this.selectedItems.includes(c.id));
            this.selectedItems = [];
            this.applyFilters();
            this.toastr.success('Convênios excluídos com sucesso', 'Sucesso');
          },
          error: () => this.toastr.error('Erro ao excluir convênios', 'Erro')
        });
      }
    });
  }

  formatDate(dateString?: string): string {
    return dateString ? new Date(dateString).toLocaleDateString('pt-BR') : '-';
  }
}
