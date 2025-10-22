using SantaCasaLorena.Server.DTOs;

namespace SantaCasaLorena.Server.Interfaces
{
    public interface IContactService
    {
        Task<IEnumerable<ContactResponseDto>> GetAllContactsAsync();
        Task<ContactResponseDto> GetContactByIdAsync(Guid id);
        Task<ContactResponseDto> CreateContactAsync(ContactRequestDto dto);
        Task<ContactResponseDto> UpdateContactAsync(Guid id, ContactRequestDto dto);
        Task<bool> DeleteContactAsync(Guid id);
        Task<ContactResponseDto?> ToggleActiveAsync(Guid id);
        Task<bool> BulkDeleteAsync(IEnumerable<Guid> ids);
        Task<bool> BulkToggleActiveAsync(IEnumerable<Guid> ids, bool activate);

    }
}
