namespace SantaCasaLorena.Server.DTOs
{
    public class BulkToggleRequest
    {
        public IEnumerable<Guid> Ids { get; set; } = [];
        public bool Activate { get; set; }
    }
}
