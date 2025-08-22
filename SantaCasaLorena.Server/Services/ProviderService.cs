using Microsoft.EntityFrameworkCore;
using SantaCasaLorena.Server.Context;
using SantaCasaLorena.Server.DTOs;
using SantaCasaLorena.Server.Entities;
using SantaCasaLorena.Server.Interfaces;

namespace SantaCasaLorena.Server.Services
{
    public class ProviderService : IProviderService
    {
        private readonly SantaCasaDbContext _context;

        public ProviderService(SantaCasaDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<ProviderResponseDto>> GetAllAsync()
        {
            return await _context.Providers
                .Select(p => new ProviderResponseDto
                {
                    Id = p.Id,
                    Name = p.Name,
                    ImageUrl = p.ImageUrl,
                    StartYear = p.StartYear,
                    EndYear = p.EndYear
                })
                .ToListAsync();
        }

        public async Task<ProviderResponseDto?> GetByIdAsync(Guid id)
        {
            return await _context.Providers
                .Where(p => p.Id == id)
                .Select(p => new ProviderResponseDto
                {
                    Id = p.Id,
                    Name = p.Name,
                    ImageUrl = p.ImageUrl,
                    StartYear = p.StartYear,
                    EndYear = p.EndYear
                })
                .FirstOrDefaultAsync();
        }

        public async Task<ProviderResponseDto> AddAsync(ProviderRequestDto dto)
        {
            var entity = new Provider
            {
                Name = dto.Name,
                ImageUrl = await ProcessarMidiasAsync(dto.File),
                StartYear = dto.StartYear,
                EndYear = dto.EndYear
            };

            _context.Providers.Add(entity);
            await _context.SaveChangesAsync();

            return new ProviderResponseDto
            {
                Id = entity.Id,
                Name = entity.Name,
                ImageUrl = entity.ImageUrl,
                StartYear = entity.StartYear,
                EndYear = entity.EndYear
            };
        }

        public async Task<ProviderResponseDto> UpdateAsync(Guid id, ProviderRequestDto dto)
        {
            var entity = await _context.Providers.FindAsync(id);
            if (entity == null) throw new Exception("Provedor não encontrado");

            entity.Name = dto.Name;
            entity.StartYear = dto.StartYear;
            entity.EndYear = dto.EndYear;

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

            _context.Providers.Update(entity);
            await _context.SaveChangesAsync();

            return new ProviderResponseDto
            {
                Id = entity.Id,
                Name = entity.Name,
                ImageUrl = entity.ImageUrl,
                StartYear = entity.StartYear,
                EndYear = entity.EndYear
            };
        }

        public async Task<bool> DeleteAsync(Guid id)
        {
            var entity = await _context.Providers.FindAsync(id);
            if (entity == null) return false;

            _context.Providers.Remove(entity);
            await _context.SaveChangesAsync();
            return true;
        }

        private static async Task<string?> ProcessarMidiasAsync(IFormFile midia)
        {
            if (midia == null) return null;

            // Define o caminho para a pasta "Usuarios"
            var baseDirectory = Path.Combine("Uploads", "Provedores").Replace("\\", "/");

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
