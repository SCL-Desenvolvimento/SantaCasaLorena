namespace SantaCasaLorena.Server.DTOs
{
    public class NewsRequestDto
    {
        public IFormFile File { get; set; }
        public required string Title { get; set; }
        public string Description { get; set; }
        public required string Content { get; set; }
        public string Category { get; set; }
        public bool IsPublished { get; set; }
        public required Guid UserId { get; set; }
    }

    public class NewsResponseDto
    {
        public Guid Id { get; set; }
        public string ImageUrl { get; set; }
        public required string Title { get; set; }
        public string Description { get; set; }
        public required string Content { get; set; }
        public string Category { get; set; }
    }
}
