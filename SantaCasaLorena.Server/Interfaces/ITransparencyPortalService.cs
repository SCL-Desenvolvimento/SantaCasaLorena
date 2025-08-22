using SantaCasaLorena.Server.DTOs;

namespace SantaCasaLorena.Server.Interfaces
{
    public interface ITransparencyPortalService
    {
        Task<IEnumerable<TransparencyPortalResponseDto>> GetAllAsync();
        Task<TransparencyPortalResponseDto?> GetByIdAsync(Guid id);
        Task<TransparencyPortalResponseDto> AddAsync(TransparencyPortalRequestDto dto);
        Task<TransparencyPortalResponseDto> UpdateAsync(Guid id, TransparencyPortalRequestDto dto);
        Task<bool> DeleteAsync(Guid id);
    }
}
