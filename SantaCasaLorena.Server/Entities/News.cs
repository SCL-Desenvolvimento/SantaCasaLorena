namespace SantaCasaLorena.Server.Entities
{
    public class News
    {
        public Guid Id { get; set; } = Guid.NewGuid();

        public string ImageUrl { get; set; }
        public required string Title { get; set; }
        public string Description { get; set; }
        public required string Content { get; set; }
        public string Category { get; set; }
        public bool IsPublished { get; set; }


        public Guid UserId { get; set; }
        public User User { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }
    }
}
