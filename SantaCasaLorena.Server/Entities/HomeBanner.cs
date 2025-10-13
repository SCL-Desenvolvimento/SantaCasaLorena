namespace SantaCasaLorena.Server.Entities
{
    public class HomeBanner
    {
        public Guid Id { get; set; } = Guid.NewGuid();

        public required string Title { get; set; }
        public string Description { get; set; }

        public required string DesktopImageUrl { get; set; }
        public required string TabletImageUrl { get; set; }
        public required string MobileImageUrl { get; set; }

        public int TimeSeconds { get; set; } = 5;
        public int Order { get; set; } = 1;

        public bool IsActive { get; set; }

        public Guid? NewsId { get; set; }
        public News? News { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
