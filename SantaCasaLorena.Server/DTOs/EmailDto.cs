namespace SantaCasaLorena.Server.DTOs
{
    public class EmailDto
    {
        public string Destinatario { get; set; }
        public string Assunto { get; set; }
        public string CorpoHtml { get; set; }
        public string? RemetenteNome { get; set; } = string.Empty;
        public string? RemetenteEmail { get; set; } = string.Empty;
        public List<(string FileName, byte[] Content)>? Anexos { get; set; }
    }
}
