namespace SantaCasaLorena.Server.Entities
{
    public class PatientManual
    {
        public Guid Id { get; set; } = Guid.NewGuid();

        public required string Title { get; set; }
        public string Content { get; set; }
        public string? FileUrl { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
