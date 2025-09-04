namespace SantaCasaLorena.Server.Entities
{
    public class JobApplication
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string City { get; set; } = string.Empty;
        public string? ResumeUrl { get; set; } // nome do arquivo ou caminho
        public DateTime CreatedAt { get; set; }
    }
}
