namespace SantaCasaLorena.Server.DTOs
{
    public class PatientManualRequestDto
    {
        public required string Title { get; set; }
        public string Content { get; set; }
        public IFormFile File { get; set; }
    }

    public class PatientManualResponseDto
    {
        public Guid Id { get; set; }
        public required string Title { get; set; }
        public string Content { get; set; }
        public string imageUrl { get; set; }
    }
}
