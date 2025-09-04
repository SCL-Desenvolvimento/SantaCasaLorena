namespace SantaCasaLorena.Server.DTOs
{
    public class RecaptchaResponse
    {
        public bool Success { get; set; }
        public double Score { get; set; }
        public IEnumerable<string> ErrorCodes { get; set; } = new List<string>();

    }
}
