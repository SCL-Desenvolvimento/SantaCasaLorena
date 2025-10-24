using SantaCasaLorena.Server.DTOs;

namespace SantaCasaLorena.Server.Interfaces
{
    public interface INewsService
    {
        Task<IEnumerable<NewsResponseDto>> GetAllAsync();
        Task<NewsResponseDto?> GetByIdAsync(Guid id);
        Task<NewsResponseDto> AddAsync(NewsRequestDto dto);
        Task<NewsResponseDto> UpdateAsync(Guid id, NewsRequestDto dto);
        Task<bool> DeleteAsync(Guid id);
        Task<NewsResponseDto?> ToggleActiveAsync(Guid id);
        Task<bool> BulkDeleteAsync(IEnumerable<Guid> ids);
        Task<bool> BulkToggleActiveAsync(IEnumerable<Guid> ids, bool isPublished);
    }
}
