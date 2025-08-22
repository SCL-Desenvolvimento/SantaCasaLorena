namespace SantaCasaLorena.Server.DTOs
{
    public class TransparencyPortalRequestDto
    {
        public required string AgreementName { get; set; }
        public required string Type { get; set; }
        public int StartYear { get; set; }
        public int? EndYear { get; set; }
        public IFormFile File { get; set; }
    }

    public class TransparencyPortalResponseDto
    {
        public Guid Id { get; set; }
        public required string AgreementName { get; set; }
        public required string Type { get; set; }
        public int StartYear { get; set; }
        public int? EndYear { get; set; }
        public string FileUrl { get; set; }
    }
}
