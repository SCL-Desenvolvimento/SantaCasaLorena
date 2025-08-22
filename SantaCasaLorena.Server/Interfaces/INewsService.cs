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
    }
}
