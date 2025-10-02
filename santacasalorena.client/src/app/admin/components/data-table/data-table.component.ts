import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';

interface Column {
  field: string;
  header: string;
  sortable?: boolean;
  filterable?: boolean;
  selectable?: boolean; // Adicionado para indicar se a coluna é selecionável
}

@Component({
  selector: 'app-data-table',
  standalone: false,
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.css']
})
export class DataTableComponent implements OnInit {
  @Input() data: any[] = [];
  @Input() columns: Column[] = [];
  @Input() loading: boolean = false;
  @Input() totalItems: number = 0;
  @Input() itemsPerPage: number = 10;
  @Input() currentPage: number = 1;
  @Input() sortBy: string = '';
  @Input() sortOrder: 'asc' | 'desc' = 'asc';
  @Input() selectedItems: any[] = [];

  @Output() pageChange = new EventEmitter<number>();
  @Output() sortChange = new EventEmitter<{ field: string, order: 'asc' | 'desc' }>();
  @Output() itemsPerPageChange = new EventEmitter<number>();
  @Output() selectAllChange = new EventEmitter<boolean>();
  @Output() itemSelectionChange = new EventEmitter<any>();

  // Adicionado para permitir o uso de Math no template
  Math = Math;

  ngOnInit(): void {
    // Inicialização, se necessário
  }

  get totalPages(): number {
    return Math.ceil(this.totalItems / this.itemsPerPage);
  }

  // Getter para verificar se há colunas selecionáveis
  get hasSelectableColumns(): boolean {
    return this.columns.some(col => col.selectable === true);
  }

  onPageChange(page: number): void {
    if (page > 0 && page <= this.totalPages) {
      this.currentPage = page;
      this.pageChange.emit(page);
    }
  }

  onSort(field: string): void {
    const order = this.sortBy === field && this.sortOrder === 'desc' ? 'asc' : 'desc';
    this.sortBy = field;
    this.sortOrder = order;
    this.sortChange.emit({ field, order });
  }

  onItemsPerPageChange(event: any): void {
    this.itemsPerPage = +event.target.value;
    this.itemsPerPageChange.emit(this.itemsPerPage);
  }

  toggleSelectAll(event: any): void {
    this.selectAllChange.emit(event.target.checked);
  }

  toggleItemSelection(item: any, event: any): void {
    this.itemSelectionChange.emit({ item, selected: event.target.checked });
  }

  isAllSelected(): boolean {
    return this.data.length > 0 && this.selectedItems.length === this.data.length;
  }

  isSelected(item: any): boolean {
    return this.selectedItems.includes(item.id);
  }

  getMin(a: number, b: number): number {
    return Math.min(a, b);
  }
}

