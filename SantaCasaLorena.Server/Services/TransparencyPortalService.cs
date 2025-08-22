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
                    AgreementName = t.AgreementName,
                    Type = t.Type,
                    StartYear = t.StartYear,
                    EndYear = t.EndYear,
                    FileUrl = t.FileUrl
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
                    AgreementName = t.AgreementName,
                    Type = t.Type,
                    StartYear = t.StartYear,
                    EndYear = t.EndYear,
                    FileUrl = t.FileUrl
                })
                .FirstOrDefaultAsync();
        }

        public async Task<TransparencyPortalResponseDto> AddAsync(TransparencyPortalRequestDto dto)
        {
            var entity = new TransparencyPortal
            {
                AgreementName = dto.AgreementName,
                Type = dto.Type,
                StartYear = dto.StartYear,
                EndYear = dto.EndYear,
                FileUrl = await ProcessarMidiasAsync(dto.File)
            };

            _context.TransparencyPortals.Add(entity);
            await _context.SaveChangesAsync();

            return new TransparencyPortalResponseDto
            {
                Id = entity.Id,
                AgreementName = entity.AgreementName,
                Type = entity.Type,
                StartYear = entity.StartYear,
                EndYear = entity.EndYear,
                FileUrl = entity.FileUrl
            };
        }

        public async Task<TransparencyPortalResponseDto> UpdateAsync(Guid id, TransparencyPortalRequestDto dto)
        {
            var entity = await _context.TransparencyPortals.FindAsync(id);
            if (entity == null) throw new Exception("Portal não encontrado");

            entity.AgreementName = dto.AgreementName;
            entity.Type = dto.Type;
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
                AgreementName = entity.AgreementName,
                Type = entity.Type,
                StartYear = entity.StartYear,
                EndYear = entity.EndYear,
                FileUrl = entity.FileUrl
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

            // Define o caminho para a pasta "Usuarios"
            var baseDirectory = Path.Combine("Uploads", "PortalTransparencia").Replace("\\", "/");

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
