namespace SantaCasaLorena.Server.DTOs
{
    public class UserRequestDto
    {
        public required string Username { get; set; }
        public string Email { get; set; }
        public string? Password { get; set; }
        public IFormFile? File { get; set; }
    }

    public class UserResponseDto
    {
        public Guid Id { get; set; }
        public string Username { get; set; }
        public string Email { get; set; }
        public string? PhotoUrl { get; set; }
    }
}
