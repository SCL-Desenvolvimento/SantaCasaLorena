namespace SantaCasaLorena.Server.DTOs
{
    public class ProviderRequestDto
    {
        public IFormFile File { get; set; }
        public required string Name { get; set; }
        public int StartYear { get; set; }
        public int? EndYear { get; set; }
    }

    public class ProviderResponseDto
    {
        public Guid Id { get; set; }
        public string ImageUrl { get; set; }
        public required string Name { get; set; }
        public int StartYear { get; set; }
        public int? EndYear { get; set; }
    }
}
