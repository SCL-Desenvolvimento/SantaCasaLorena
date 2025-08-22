namespace SantaCasaLorena.Server.Entities
{
    public class HomeBanner
    {
        public Guid Id { get; set; } = Guid.NewGuid();

        public required string ImageUrl { get; set; }
        public int TimeSeconds { get; set; } = 5;
        public int Order { get; set; } = 1;

        public Guid? NewsId { get; set; }
        public News? News { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
