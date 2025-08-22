namespace SantaCasaLorena.Server.Entities
{
    public class Provider
    {
        public Guid Id { get; set; } = Guid.NewGuid();

        public string? ImageUrl { get; set; }
        public required string Name { get; set; }
        public int StartYear { get; set; }
        public int? EndYear { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
