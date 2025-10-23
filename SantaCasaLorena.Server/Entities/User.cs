namespace SantaCasaLorena.Server.Entities
{
    public class User
    {
        public Guid Id { get; set; } = Guid.NewGuid();

        public required string Username { get; set; }
        public required string Email { get; set; }
        public required string PasswordHash { get; set; }
        public string? PhotoUrl { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }
        public bool IsActive { get; set; }
        public ICollection<News> NewsList { get; set; } = new List<News>();
    }

}
