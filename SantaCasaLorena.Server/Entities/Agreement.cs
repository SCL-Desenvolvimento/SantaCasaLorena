namespace SantaCasaLorena.Server.Entities
{
    public class Agreement
    {
        public Guid Id { get; set; } = Guid.NewGuid();

        public required string Name { get; set; }
        public string ImageUrl { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
