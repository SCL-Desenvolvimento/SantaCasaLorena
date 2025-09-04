namespace SantaCasaLorena.Server.DTOs
{
    public class JobApplicationDto
    {
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string City { get; set; } = string.Empty;
        public IFormFile? File { get; set; }
        public string RecaptchaToken { get; set; } = string.Empty;
    }
}
