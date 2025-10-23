using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using SantaCasaLorena.Server.Context;
using SantaCasaLorena.Server.DTOs;
using SantaCasaLorena.Server.Entities;
using SantaCasaLorena.Server.Interfaces;

namespace SantaCasaLorena.Server.Services
{
    public class UserService : IUserService
    {
        private readonly SantaCasaDbContext _context;
        private readonly IPasswordHasher<object> _passwordHasher;

        public UserService(SantaCasaDbContext context, IPasswordHasher<object> passwordHasher)
        {
            _context = context;
            _passwordHasher = passwordHasher;
        }

        public async Task<IEnumerable<UserResponseDto>> GetAllAsync()
        {
            return await _context.Users
                .Select(u => new UserResponseDto
                {
                    Id = u.Id,
                    Username = u.Username,
                    Email = u.Email,
                    PhotoUrl = u.PhotoUrl,
                    CreatedAt = u.CreatedAt,
                    IsActive = u.IsActive
                })
                .ToListAsync();
        }

        public async Task<UserResponseDto?> GetByIdAsync(Guid id)
        {
            return await _context.Users
                .Where(u => u.Id == id)
                .Select(u => new UserResponseDto
                {
                    Id = u.Id,
                    Username = u.Username,
                    Email = u.Email,
                    PhotoUrl = u.PhotoUrl,
                    CreatedAt = u.CreatedAt,
                    IsActive = u.IsActive
                })
                .FirstOrDefaultAsync();
        }

        public async Task<UserResponseDto> AddAsync(UserRequestDto dto)
        {
            var entity = new User
            {
                Username = dto.Username,
                Email = dto.Email,
                IsActive = dto.IsActive,
                PasswordHash = _passwordHasher.HashPassword(null!, dto.Password ?? "SantaCasa123"),
                PhotoUrl = dto.File == null ? "Uploads/Usuarios/padrao.png" : await ProcessarMidiasAsync(dto.File)
            };

            _context.Users.Add(entity);
            await _context.SaveChangesAsync();

            return new UserResponseDto
            {
                Id = entity.Id,
                Username = entity.Username,
                Email = entity.Email,
                PhotoUrl = entity.PhotoUrl,
                CreatedAt = entity.CreatedAt,
                IsActive = entity.IsActive
            };
        }

        public async Task<UserResponseDto> UpdateAsync(Guid id, UserRequestDto dto)
        {
            var entity = await _context.Users.FindAsync(id) ?? throw new Exception("Usuário não encontrado");

            entity.Username = dto.Username;
            entity.Email = dto.Email;
            entity.IsActive = dto.IsActive;

            if (!string.IsNullOrWhiteSpace(dto.Password))
                entity.PasswordHash = _passwordHasher.HashPassword(null!, dto.Password);

            if (!string.IsNullOrEmpty(entity.PhotoUrl) && dto.File != null)
            {
                if (File.Exists(entity.PhotoUrl) && entity.PhotoUrl != "Uploads/Usuarios/padrao.png")
                {
                    File.Delete(entity.PhotoUrl);
                }
            }

            if (dto.File != null)
                entity.PhotoUrl = await ProcessarMidiasAsync(dto.File);

            _context.Users.Update(entity);
            await _context.SaveChangesAsync();

            return new UserResponseDto
            {
                Id = entity.Id,
                Username = entity.Username,
                Email = entity.Email,
                PhotoUrl = entity.PhotoUrl,
                CreatedAt = entity.CreatedAt,
                IsActive = entity.IsActive
            };
        }

        public async Task<bool> DeleteAsync(Guid id)
        {
            var entity = await _context.Users.FindAsync(id);
            if (entity == null) return false;

            _context.Users.Remove(entity);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<UserResponseDto?> ToggleActiveAsync(Guid id)
        {
            var entity = await _context.Users.FirstOrDefaultAsync(c => c.Id == id);
            if (entity == null)
                return null;

            entity.IsActive = !entity.IsActive;

            await _context.SaveChangesAsync();

            return new UserResponseDto
            {
                Id = entity.Id,
                Username = entity.Username,
                Email = entity.Email,
                PhotoUrl = entity.PhotoUrl,
                CreatedAt = entity.CreatedAt,
                IsActive = entity.IsActive
            };

        }

        public async Task<bool> BulkDeleteAsync(IEnumerable<Guid> ids)
        {
            var entity = await _context.Users
                .Where(c => ids.Contains(c.Id))
                .ToListAsync();

            if (!entity.Any()) return false;

            _context.Users.RemoveRange(entity);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> BulkToggleActiveAsync(IEnumerable<Guid> ids, bool activate)
        {
            var entity = await _context.Users
                .Where(c => ids.Contains(c.Id))
                .ToListAsync();

            if (entity.Count == 0) return false;

            foreach (var c in entity)
            {
                c.IsActive = activate;
            }

            await _context.SaveChangesAsync();
            return true;
        }


        private static async Task<string?> ProcessarMidiasAsync(IFormFile midia)
        {
            if (midia == null) return null;

            var baseDirectory = Path.Combine("Uploads", "Usuarios").Replace("\\", "/");

            if (!Directory.Exists(baseDirectory))
            {
                Directory.CreateDirectory(baseDirectory);
            }

            var filePath = Path.Combine(baseDirectory, Guid.NewGuid() + Path.GetExtension(midia.FileName)).Replace("\\", "/");

            await using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await midia.CopyToAsync(stream);
            }

            return filePath;
        }

        public async Task<bool> ResetPasswordAsync(Guid id)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == id);
            if (user == null)
                return false;

            user.PasswordHash = _passwordHasher.HashPassword(null!, "SantaCasa123");
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> ChangePasswordAsync(Guid id, string newPassword)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == id);
            if (user == null)
                return false;

            user.PasswordHash = _passwordHasher.HashPassword(null!, newPassword);
            await _context.SaveChangesAsync();

            return true;
        }
    }
}
