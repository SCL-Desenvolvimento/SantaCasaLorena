namespace SantaCasaLorena.Server.DTOs
{
    public class HomeBannerRequestDto
    {
        public IFormFile DesktopFile { get; set; }
        public IFormFile TabletFile { get; set; }
        public IFormFile MobileFile { get; set; }

        public int TimeSeconds { get; set; }
        public int Order { get; set; }
        public Guid? NewsId { get; set; }
    }

    public class HomeBannerResponseDto
    {
        public Guid Id { get; set; }
        public string DesktopImageUrl { get; set; }
        public string TabletImageUrl { get; set; }
        public string MobileImageUrl { get; set; }

        public int TimeSeconds { get; set; }
        public int Order { get; set; }
        public Guid? NewsId { get; set; }
    }
}
