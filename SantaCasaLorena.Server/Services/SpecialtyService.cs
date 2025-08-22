using Microsoft.EntityFrameworkCore;
using SantaCasaLorena.Server.Context;
using SantaCasaLorena.Server.DTOs;
using SantaCasaLorena.Server.Entities;
using SantaCasaLorena.Server.Interfaces;

namespace SantaCasaLorena.Server.Services
{
    public class SpecialtyService : ISpecialtyService
    {
        private readonly SantaCasaDbContext _context;

        public SpecialtyService(SantaCasaDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<SpecialtyResponseDto>> GetAllAsync()
        {
            return await _context.Specialties
                .Select(s => new SpecialtyResponseDto
                {
                    Id = s.Id,
                    Name = s.Name,
                    Type = s.Type,
                    ImageUrl = s.ImageUrl
                })
                .ToListAsync();
        }

        public async Task<SpecialtyResponseDto?> GetByIdAsync(Guid id)
        {
            return await _context.Specialties
                .Where(s => s.Id == id)
                .Select(s => new SpecialtyResponseDto
                {
                    Id = s.Id,
                    Name = s.Name,
                    Type = s.Type,
                    ImageUrl = s.ImageUrl
                })
                .FirstOrDefaultAsync();
        }

        public async Task<SpecialtyResponseDto> AddAsync(SpecialtyRequestDto dto)
        {
            var entity = new Specialty
            {
                Name = dto.Name,
                Type = dto.Type,
                ImageUrl = await ProcessarMidiasAsync(dto.File)
            };

            _context.Specialties.Add(entity);
            await _context.SaveChangesAsync();

            return new SpecialtyResponseDto
            {
                Id = entity.Id,
                Name = entity.Name,
                Type = entity.Type,
                ImageUrl = entity.ImageUrl
            };
        }

        public async Task<SpecialtyResponseDto> UpdateAsync(Guid id, SpecialtyRequestDto dto)
        {
            var entity = await _context.Specialties.FindAsync(id);
            if (entity == null) throw new Exception("Especialidade não encontrada");

            entity.Name = dto.Name;
            entity.Type = dto.Type;

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

            _context.Specialties.Update(entity);
            await _context.SaveChangesAsync();

            return new SpecialtyResponseDto
            {
                Id = entity.Id,
                Name = entity.Name,
                Type = entity.Type,
                ImageUrl = entity.ImageUrl
            };
        }

        public async Task<bool> DeleteAsync(Guid id)
        {
            var entity = await _context.Specialties.FindAsync(id);
            if (entity == null) return false;

            _context.Specialties.Remove(entity);
            await _context.SaveChangesAsync();
            return true;
        }

        private static async Task<string?> ProcessarMidiasAsync(IFormFile midia)
        {
            if (midia == null) return null;

            // Define o caminho para a pasta "Usuarios"
            var baseDirectory = Path.Combine("Uploads", "Especialidades").Replace("\\", "/");

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
