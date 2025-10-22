using Microsoft.EntityFrameworkCore;
using SantaCasaLorena.Server.Context;
using SantaCasaLorena.Server.DTOs;
using SantaCasaLorena.Server.Entities;
using SantaCasaLorena.Server.Interfaces;

namespace SantaCasaLorena.Server.Services
{
    public class ContactService : IContactService
    {
        private readonly SantaCasaDbContext _context;

        public ContactService(SantaCasaDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<ContactResponseDto>> GetAllContactsAsync()
        {
            var contacts = await _context.Contact
                .AsNoTracking()
                .Select(c => new ContactResponseDto
                {
                    Id = c.Id,
                    Title = c.Title,
                    PhoneNumber = c.PhoneNumber,
                    Description = c.Description,
                    IsActive = c.IsActive,
                    CreatedAt = c.CreatedAt,
                    UpdatedAt = c.UpdatedAt
                })
                .ToListAsync();

            return contacts;
        }

        public async Task<ContactResponseDto?> GetContactByIdAsync(Guid id)
        {
            var contact = await _context.Contact
                .AsNoTracking()
                .FirstOrDefaultAsync(c => c.Id == id);

            if (contact == null)
                return null;

            return new ContactResponseDto
            {
                Id = contact.Id,
                Title = contact.Title,
                PhoneNumber = contact.PhoneNumber,
                Description = contact.Description,
                IsActive = contact.IsActive,
                CreatedAt = contact.CreatedAt,
                UpdatedAt = contact.UpdatedAt
            };
        }

        public async Task<ContactResponseDto?> CreateContactAsync(ContactRequestDto dto)
        {
            var newContact = new Contact
            {
                Id = Guid.NewGuid(),
                Title = dto.Title,
                PhoneNumber = dto.PhoneNumber,
                Description = dto.Description,
                IsActive = dto.IsActive,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            try
            {
                await _context.Contact.AddAsync(newContact);
                await _context.SaveChangesAsync();

                return new ContactResponseDto
                {
                    Id = newContact.Id,
                    Title = newContact.Title,
                    PhoneNumber = newContact.PhoneNumber,
                    Description = newContact.Description,
                    IsActive = newContact.IsActive,
                    CreatedAt = newContact.CreatedAt,
                    UpdatedAt = newContact.UpdatedAt
                };
            }
            catch (Exception ex)
            {
                // _logger.LogError(ex, "Erro ao criar contato");
                return null;
            }
        }

        public async Task<ContactResponseDto?> UpdateContactAsync(Guid id, ContactRequestDto dto)
        {
            var existingContact = await _context.Contact.FirstOrDefaultAsync(c => c.Id == id);
            if (existingContact == null)
                return null;

            existingContact.Title = dto.Title;
            existingContact.PhoneNumber = dto.PhoneNumber;
            existingContact.Description = dto.Description;
            existingContact.IsActive = dto.IsActive;
            existingContact.UpdatedAt = DateTime.UtcNow;

            try
            {
                await _context.SaveChangesAsync();

                return new ContactResponseDto
                {
                    Id = existingContact.Id,
                    Title = existingContact.Title,
                    PhoneNumber = existingContact.PhoneNumber,
                    Description = existingContact.Description,
                    IsActive = existingContact.IsActive,
                    CreatedAt = existingContact.CreatedAt,
                    UpdatedAt = existingContact.UpdatedAt
                };
            }
            catch (Exception ex)
            {
                // _logger.LogError(ex, "Erro ao atualizar contato");
                return null;
            }
        }

        public async Task<bool> DeleteContactAsync(Guid id)
        {
            var contactToRemove = await _context.Contact.FirstOrDefaultAsync(c => c.Id == id);
            if (contactToRemove == null)
                return false;

            try
            {
                _context.Contact.Remove(contactToRemove);
                await _context.SaveChangesAsync();
                return true;
            }
            catch (Exception ex)
            {
                // _logger.LogError(ex, "Erro ao deletar contato");
                return false;
            }
        }

        public async Task<ContactResponseDto?> ToggleActiveAsync(Guid id)
        {
            var contact = await _context.Contact.FirstOrDefaultAsync(c => c.Id == id);
            if (contact == null)
                return null;

            contact.IsActive = !contact.IsActive;
            contact.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return new ContactResponseDto
            {
                Id = contact.Id,
                Title = contact.Title,
                PhoneNumber = contact.PhoneNumber,
                Description = contact.Description,
                IsActive = contact.IsActive,
                CreatedAt = contact.CreatedAt,
                UpdatedAt = contact.UpdatedAt
            };
        }

        public async Task<bool> BulkDeleteAsync(IEnumerable<Guid> ids)
        {
            var contacts = await _context.Contact
                .Where(c => ids.Contains(c.Id))
                .ToListAsync();

            if (!contacts.Any()) return false;

            _context.Contact.RemoveRange(contacts);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> BulkToggleActiveAsync(IEnumerable<Guid> ids, bool activate)
        {
            var contacts = await _context.Contact
                .Where(c => ids.Contains(c.Id))
                .ToListAsync();

            if (!contacts.Any()) return false;

            foreach (var c in contacts)
            {
                c.IsActive = activate;
                c.UpdatedAt = DateTime.UtcNow;
            }

            await _context.SaveChangesAsync();
            return true;
        }

    }
}
