using SantaCasaLorena.Server.DTOs;

namespace SantaCasaLorena.Server.Interfaces
{
    public interface IUserService
    {
        Task<IEnumerable<UserResponseDto>> GetAllAsync();
        Task<UserResponseDto?> GetByIdAsync(Guid id);
        Task<UserResponseDto> AddAsync(UserRequestDto dto);
        Task<UserResponseDto> UpdateAsync(Guid id, UserRequestDto dto);
        Task<bool> DeleteAsync(Guid id);
        Task<UserResponseDto?> ToggleActiveAsync(Guid id);
        Task<bool> BulkDeleteAsync(IEnumerable<Guid> ids);
        Task<bool> BulkToggleActiveAsync(IEnumerable<Guid> ids, bool activate);

    }
}
