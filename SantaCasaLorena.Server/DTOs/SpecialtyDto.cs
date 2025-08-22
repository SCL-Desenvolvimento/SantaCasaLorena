namespace SantaCasaLorena.Server.DTOs
{
    public class SpecialtyRequestDto
    {
        public required string Name { get; set; }
        public string Type { get; set; }
        public IFormFile File { get; set; }
    }

    public class SpecialtyResponseDto
    {
        public Guid Id { get; set; }
        public required string Name { get; set; }
        public string Type { get; set; }
        public string ImageUrl { get; set; }
    }
}
