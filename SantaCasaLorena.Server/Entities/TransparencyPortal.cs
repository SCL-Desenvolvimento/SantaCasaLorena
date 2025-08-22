namespace SantaCasaLorena.Server.Entities
{
    public class TransparencyPortal
    {
        public Guid Id { get; set; } = Guid.NewGuid();

        public required string AgreementName { get; set; }
        public required string Type { get; set; }
        public int StartYear { get; set; }
        public int? EndYear { get; set; }
        public required string FileUrl { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
