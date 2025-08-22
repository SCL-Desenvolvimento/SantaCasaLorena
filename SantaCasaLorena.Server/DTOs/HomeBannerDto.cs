namespace SantaCasaLorena.Server.DTOs
{
    public class HomeBannerRequestDto
    {
        public IFormFile File { get; set; }
        public int TimeSeconds { get; set; }
        public int Order { get; set; }
        public Guid? NewsId { get; set; }
    }

    public class HomeBannerResponseDto
    {
        public Guid Id { get; set; }
        public string imageUrl { get; set; }
        public int TimeSeconds { get; set; }
        public int Order { get; set; }
        public Guid? NewsId { get; set; }
    }
}
