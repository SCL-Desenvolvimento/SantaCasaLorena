namespace SantaCasaLorena.Server.Entities
{
    public class Specialty
    {
        public Guid Id { get; set; } = Guid.NewGuid();

        public required string Name { get; set; }
        public string Type { get; set; }
        public string ImageUrl { get; set; }

        // Audit
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
