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
    }
}
