using Microsoft.EntityFrameworkCore;
using SantaCasaLorena.Server.Context;
using SantaCasaLorena.Server.DTOs;
using SantaCasaLorena.Server.Entities;
using SantaCasaLorena.Server.Interfaces;

namespace SantaCasaLorena.Server.Services
{
    public class TransparencyPortalService : ITransparencyPortalService
    {
        private readonly SantaCasaDbContext _context;

        public TransparencyPortalService(SantaCasaDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<TransparencyPortalResponseDto>> GetAllAsync()
        {
            return await _context.TransparencyPortals
                .Select(t => new TransparencyPortalResponseDto
                {
                    Id = t.Id,
                    Category = t.Category,
                    Title = t.Title,
                    Description = t.Description,
                    Type = t.Type,
                    Year = t.Year,
                    StartYear = t.StartYear,
                    EndYear = t.EndYear,
                    FileUrl = t.FileUrl,
                    CreatedAt = t.CreatedAt
                })
                .ToListAsync();
        }

        public async Task<TransparencyPortalResponseDto?> GetByIdAsync(Guid id)
        {
            return await _context.TransparencyPortals
                .Where(t => t.Id == id)
                .Select(t => new TransparencyPortalResponseDto
                {
                    Id = t.Id,
                    Category = t.Category,
                    Title = t.Title,
                    Description = t.Description,
                    Type = t.Type,
                    Year = t.Year,
                    StartYear = t.StartYear,
                    EndYear = t.EndYear,
                    FileUrl = t.FileUrl,
                    CreatedAt = t.CreatedAt
                })
                .FirstOrDefaultAsync();
        }

        public async Task<TransparencyPortalResponseDto> AddAsync(TransparencyPortalRequestDto dto)
        {
            var entity = new TransparencyPortal
            {
                Category = dto.Category,
                Title = dto.Title,
                Description = dto.Description,
                Type = dto.Type,
                Year = dto.Year,
                StartYear = dto.StartYear,
                EndYear = dto.EndYear,
                FileUrl = await ProcessarMidiasAsync(dto.File)
            };

            _context.TransparencyPortals.Add(entity);
            await _context.SaveChangesAsync();

            return new TransparencyPortalResponseDto
            {
                Id = entity.Id,
                Category = entity.Category,
                Title = entity.Title,
                Description = entity.Description,
                Type = entity.Type,
                Year = entity.Year,
                StartYear = entity.StartYear,
                EndYear = entity.EndYear,
                FileUrl = entity.FileUrl,
                CreatedAt = entity.CreatedAt
            };
        }

        public async Task<TransparencyPortalResponseDto> UpdateAsync(Guid id, TransparencyPortalRequestDto dto)
        {
            var entity = await _context.TransparencyPortals.FindAsync(id);
            if (entity == null) throw new Exception("Registro não encontrado");

            entity.Category = dto.Category;
            entity.Title = dto.Title;
            entity.Description = dto.Description;
            entity.Type = dto.Type;
            entity.Year = dto.Year;
            entity.StartYear = dto.StartYear;
            entity.EndYear = dto.EndYear;

            if (!string.IsNullOrEmpty(entity.FileUrl) && dto.File != null)
            {
                if (File.Exists(entity.FileUrl))
                {
                    File.Delete(entity.FileUrl);
                }
            }

            if (dto.File != null)
            {
                entity.FileUrl = await ProcessarMidiasAsync(dto.File);
            }

            _context.TransparencyPortals.Update(entity);
            await _context.SaveChangesAsync();

            return new TransparencyPortalResponseDto
            {
                Id = entity.Id,
                Category = entity.Category,
                Title = entity.Title,
                Description = entity.Description,
                Type = entity.Type,
                Year = entity.Year,
                StartYear = entity.StartYear,
                EndYear = entity.EndYear,
                FileUrl = entity.FileUrl,
                CreatedAt = entity.CreatedAt
            };
        }

        public async Task<bool> DeleteAsync(Guid id)
        {
            var entity = await _context.TransparencyPortals.FindAsync(id);
            if (entity == null) return false;

            _context.TransparencyPortals.Remove(entity);
            await _context.SaveChangesAsync();
            return true;
        }

        private static async Task<string?> ProcessarMidiasAsync(IFormFile midia)
        {
            if (midia == null) return null;

            var baseDirectory = Path.Combine("Uploads", "PortalTransparencia").Replace("\\", "/");
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
    }
}
