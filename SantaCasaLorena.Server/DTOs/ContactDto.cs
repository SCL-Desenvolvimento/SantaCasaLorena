namespace SantaCasaLorena.Server.DTOs
{
    public class ContactRequestDto
    {
        public required string Title { get; set; }
        public required string PhoneNumber { get; set; }
        public required string Description { get; set; }
        public bool IsActive { get; set; }
    }
    public class ContactResponseDto
    {
        public Guid Id { get; set; }
        public string Title { get; set; }
        public string PhoneNumber { get; set; }
        public string Description { get; set; }
        public bool IsActive { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }
}
