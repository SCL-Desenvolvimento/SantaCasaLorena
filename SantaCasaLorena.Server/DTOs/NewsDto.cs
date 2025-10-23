using System.ComponentModel.DataAnnotations;

namespace SantaCasaLorena.Server.DTOs
{
    public class NewsRequestDto
    {
        public IFormFile? File { get; set; }
        [Required]
        [StringLength(200, MinimumLength = 10)]
        public required string Title { get; set; }
        [StringLength(300, MinimumLength = 50)]
        public string? Description { get; set; }
        [Required]
        [StringLength(int.MaxValue, MinimumLength = 100)]
        public required string Content { get; set; }
        public string? Category { get; set; }
        public bool IsPublished { get; set; }
        public string[]? Tags { get; set; } 

        [StringLength(60)]
        public string? SeoTitle { get; set; }
        [StringLength(160)]
        public string? SeoDescription { get; set; }
        [StringLength(200)]
        public string? SeoKeywords { get; set; }

        [Required]
        public required string UserId { get; set; }
    }

    public class NewsResponseDto
    {
        public Guid Id { get; set; }
        public string? ImageUrl { get; set; }
        public required string Title { get; set; }
        public string? Description { get; set; }
        public required string Content { get; set; }
        public string? Category { get; set; }
        public bool IsPublished { get; set; }
        public string[]? Tags { get; set; }

        public string? SeoTitle { get; set; }
        public string? SeoDescription { get; set; }
        public string? SeoKeywords { get; set; }

        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; } 
        public DateTime? PublishedAt { get; set; }
        public int Views { get; set; } 
    }
}

