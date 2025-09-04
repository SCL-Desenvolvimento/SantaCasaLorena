using SantaCasaLorena.Server.DTOs;

namespace SantaCasaLorena.Server.Interfaces
{
    public interface IEmailService
    {
        Task<bool> EnviarEmailAsync(EmailDto email);
    }
}
