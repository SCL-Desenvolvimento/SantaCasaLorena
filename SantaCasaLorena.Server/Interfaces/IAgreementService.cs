using SantaCasaLorena.Server.DTOs;

namespace SantaCasaLorena.Server.Interfaces
{
    public interface IAgreementService
    {
        Task<IEnumerable<AgreementResponseDto>> GetAllAsync();
        Task<AgreementResponseDto?> GetByIdAsync(Guid id);
        Task<AgreementResponseDto> AddAsync(AgreementRequestDto dto);
        Task<AgreementResponseDto> UpdateAsync(Guid id, AgreementRequestDto dto);
        Task<bool> DeleteAsync(Guid id);
    }
}
