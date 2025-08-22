using SantaCasaLorena.Server.DTOs;

namespace SantaCasaLorena.Server.Interfaces
{
    public interface ISpecialtyService
    {
        Task<IEnumerable<SpecialtyResponseDto>> GetAllAsync();
        Task<SpecialtyResponseDto?> GetByIdAsync(Guid id);
        Task<SpecialtyResponseDto> AddAsync(SpecialtyRequestDto dto);
        Task<SpecialtyResponseDto> UpdateAsync(Guid id, SpecialtyRequestDto dto);
        Task<bool> DeleteAsync(Guid id);
    }
}
