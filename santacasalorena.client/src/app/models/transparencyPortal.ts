export interface TransparencyPortal {
  id: string;
  category: 'Convenio' | 'Emenda' | 'Estatuto' | 'Dirigente' | 'DemonstracaoFinanceira';
  title: string;          // Nome amigável exibido (ex: "Convênio 350")
  description?: string;   // Texto complementar (ex: "Creditação em 2023")
  type?: string;          // Subtipo (ex: Estadual / Municipal)
  year?: number;          // Ano único (ex: 2022)
  startYear?: number;     // Intervalo inicial (quando houver)
  endYear?: number | null;// Intervalo final (quando houver)
  fileUrl: string;        // Caminho/URL do arquivo
  isActive: boolean;
  createdAt: string;
}
