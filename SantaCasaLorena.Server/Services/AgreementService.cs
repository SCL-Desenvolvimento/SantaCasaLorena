using Microsoft.EntityFrameworkCore;
using SantaCasaLorena.Server.Context;
using SantaCasaLorena.Server.DTOs;
using SantaCasaLorena.Server.Entities;
using SantaCasaLorena.Server.Interfaces;

namespace SantaCasaLorena.Server.Services
{
    public class AgreementService : IAgreementService
    {
        private readonly SantaCasaDbContext _context;

        public AgreementService(SantaCasaDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<AgreementResponseDto>> GetAllAsync()
        {
            return await _context.Agreements
                .Select(a => new AgreementResponseDto
                {
                    Id = a.Id,
                    Name = a.Name,
                    ImageUrl = a.ImageUrl,
                    CreatedAt = a.CreatedAt,
                    IsActive = a.IsActive
                })
                .ToListAsync();
        }

        public async Task<AgreementResponseDto?> GetByIdAsync(Guid id)
        {
            return await _context.Agreements
                .Where(a => a.Id == id)
                .Select(a => new AgreementResponseDto
                {
                    Id = a.Id,
                    Name = a.Name,
                    ImageUrl = a.ImageUrl,
                    CreatedAt = a.CreatedAt,
                    IsActive = a.IsActive
                })
                .FirstOrDefaultAsync();
        }

        public async Task<AgreementResponseDto> AddAsync(AgreementRequestDto dto)
        {
            var entity = new Agreement
            {
                Name = dto.Name,
                ImageUrl = await ProcessarMidiasAsync(dto.File),
                IsActive = dto.IsActive
            };

            _context.Agreements.Add(entity);
            await _context.SaveChangesAsync();

            return new AgreementResponseDto
            {
                Id = entity.Id,
                Name = entity.Name,
                ImageUrl = entity.ImageUrl,
                CreatedAt = entity.CreatedAt,
                IsActive = entity.IsActive
            };
        }

        public async Task<AgreementResponseDto> UpdateAsync(Guid id, AgreementRequestDto dto)
        {
            var entity = await _context.Agreements.FindAsync(id);
            if (entity == null) throw new Exception("Convênio não encontrado");

            entity.Name = dto.Name;
            entity.IsActive = dto.IsActive;

            if (!string.IsNullOrEmpty(entity.ImageUrl) && dto.File != null)
            {
                if (File.Exists(entity.ImageUrl))
                {
                    File.Delete(entity.ImageUrl);
                }
            }

            if (dto.File != null)
            {
                entity.ImageUrl = await ProcessarMidiasAsync(dto.File);
            }

            _context.Agreements.Update(entity);
            await _context.SaveChangesAsync();

            return new AgreementResponseDto
            {
                Id = entity.Id,
                Name = entity.Name,
                ImageUrl = entity.ImageUrl,
                CreatedAt = entity.CreatedAt,
                IsActive = entity.IsActive
            };
        }

        public async Task<bool> DeleteAsync(Guid id)
        {
            var entity = await _context.Agreements.FindAsync(id);
            if (entity == null) return false;

            _context.Agreements.Remove(entity);
            await _context.SaveChangesAsync();
            return true;
        }

        private static async Task<string?> ProcessarMidiasAsync(IFormFile midia)
        {
            if (midia == null) return null;

            // Define o caminho para a pasta "Usuarios"
            var baseDirectory = Path.Combine("Uploads", "Convenios").Replace("\\", "/");

            // Verifica se a pasta "Usuarios" existe, e a cria caso não exista
            if (!Directory.Exists(baseDirectory))
            {
                Directory.CreateDirectory(baseDirectory);
            }

            // Gera o caminho completo para o arquivo dentro da pasta "Usuarios"
            var filePath = Path.Combine(baseDirectory, Guid.NewGuid() + Path.GetExtension(midia.FileName)).Replace("\\", "/");

            // Salva o arquivo no caminho especificado
            await using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await midia.CopyToAsync(stream);
            }

            return filePath;
        }

    }

}
