using SantaCasaLorena.Server.DTOs;

namespace SantaCasaLorena.Server.Interfaces
{
    public interface IHomeBannerService
    {
        Task<IEnumerable<HomeBannerResponseDto>> GetAllAsync();
        Task<HomeBannerResponseDto?> GetByIdAsync(Guid id);
        Task<HomeBannerResponseDto> AddAsync(HomeBannerRequestDto dto);
        Task<HomeBannerResponseDto> UpdateAsync(Guid id, HomeBannerRequestDto dto);
        Task<bool> DeleteAsync(Guid id);
        Task<bool> UpdateOrderAsync(Guid id, int newOrder);
        Task<HomeBannerResponseDto?> ToggleActiveAsync(Guid id);
        Task<bool> BulkDeleteAsync(IEnumerable<Guid> ids);
        Task<bool> BulkToggleActiveAsync(IEnumerable<Guid> ids, bool activate);
    }
}
