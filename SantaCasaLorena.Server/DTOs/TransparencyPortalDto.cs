namespace SantaCasaLorena.Server.DTOs
{
    public class TransparencyPortalRequestDto
    {
        public required string Category { get; set; }
        public required string Title { get; set; }
        public string? Description { get; set; }
        public string? Type { get; set; }
        public int? Year { get; set; }
        public int? StartYear { get; set; }
        public int? EndYear { get; set; }
        public IFormFile? File { get; set; }
        public bool IsActive { get; set; }
    }

    public class TransparencyPortalResponseDto
    {
        public Guid Id { get; set; }
        public required string Category { get; set; }
        public required string Title { get; set; }
        public string? Description { get; set; }
        public string? Type { get; set; }
        public int? Year { get; set; }
        public int? StartYear { get; set; }
        public int? EndYear { get; set; }
        public string FileUrl { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
        public bool IsActive { get; set; }
    }
}
