namespace SantaCasaLorena.Server.Entities
{
    public class TransparencyPortal
    {
        public Guid Id { get; set; } = Guid.NewGuid();

        // Categoria principal (Convenio, Emenda, Estatuto, Dirigente, DemonstracaoFinanceira)
        public required string Category { get; set; }

        // Nome ou título exibido
        public required string Title { get; set; }

        // Descrição opcional (ex: "Creditada em 2023")
        public string? Description { get; set; }

        // Subtipo quando aplicável (ex: Estadual, Municipal)
        public string? Type { get; set; }

        // Para registros de ano único
        public int? Year { get; set; }

        // Para registros que possuem intervalo
        public int? StartYear { get; set; }
        public int? EndYear { get; set; }

        // Caminho do arquivo
        public required string FileUrl { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
