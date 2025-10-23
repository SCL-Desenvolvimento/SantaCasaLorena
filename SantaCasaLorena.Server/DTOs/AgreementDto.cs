namespace SantaCasaLorena.Server.DTOs
{
    public class AgreementRequestDto
    {
        public required string Name { get; set; }
        public bool IsActive { get; set; }
        public IFormFile? File { get; set; }
    }

    public class AgreementResponseDto
    {
        public Guid Id { get; set; }
        public required string Name { get; set; }
        public string ImageUrl { get; set; }
        public bool IsActive { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
