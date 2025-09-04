namespace SantaCasaLorena.Server.DTOs
{
    public class FeedbackDto
    {
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string City { get; set; } = string.Empty;
        public string Subject { get; set; } = string.Empty;
        public string Reason { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;
        public string? RecaptchaToken { get; set; } = string.Empty;
    }
}
