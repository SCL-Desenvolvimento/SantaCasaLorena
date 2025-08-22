using SantaCasaLorena.Server.DTOs;

namespace SantaCasaLorena.Server.Interfaces
{
    public interface IProviderService
    {
        Task<IEnumerable<ProviderResponseDto>> GetAllAsync();
        Task<ProviderResponseDto?> GetByIdAsync(Guid id);
        Task<ProviderResponseDto> AddAsync(ProviderRequestDto dto);
        Task<ProviderResponseDto> UpdateAsync(Guid id, ProviderRequestDto dto);
        Task<bool> DeleteAsync(Guid id);
    }
}
