using Microsoft.EntityFrameworkCore;
using SantaCasaLorena.Server.Context;
using SantaCasaLorena.Server.DTOs;
using SantaCasaLorena.Server.Entities;
using SantaCasaLorena.Server.Interfaces;

namespace SantaCasaLorena.Server.Services
{
    public class PatientManualService : IPatientManualService
    {
        private readonly SantaCasaDbContext _context;

        public PatientManualService(SantaCasaDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<PatientManualResponseDto>> GetAllAsync()
        {
            return await _context.PatientManuals
                .Select(pm => new PatientManualResponseDto
                {
                    Id = pm.Id,
                    Title = pm.Title,
                    Content = pm.Content,
                    imageUrl = pm.FileUrl
                })
                .ToListAsync();
        }

        public async Task<PatientManualResponseDto?> GetByIdAsync(Guid id)
        {
            return await _context.PatientManuals
                .Where(pm => pm.Id == id)
                .Select(pm => new PatientManualResponseDto
                {
                    Id = pm.Id,
                    Title = pm.Title,
                    Content = pm.Content,
                    imageUrl = pm.FileUrl
                })
                .FirstOrDefaultAsync();
        }

        public async Task<PatientManualResponseDto> AddAsync(PatientManualRequestDto dto)
        {
            var entity = new PatientManual
            {
                Title = dto.Title,
                Content = dto.Content,
                FileUrl = await ProcessarMidiasAsync(dto.File)
            };

            _context.PatientManuals.Add(entity);
            await _context.SaveChangesAsync();

            return new PatientManualResponseDto
            {
                Id = entity.Id,
                Title = entity.Title,
                Content = entity.Content,
                imageUrl = entity.FileUrl
            };
        }

        public async Task<PatientManualResponseDto> UpdateAsync(Guid id, PatientManualRequestDto dto)
        {
            var entity = await _context.PatientManuals.FindAsync(id);
            if (entity == null) throw new Exception("Manual do paciente não encontrado");

            entity.Title = dto.Title;
            entity.Content = dto.Content;

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

            _context.PatientManuals.Update(entity);
            await _context.SaveChangesAsync();

            return new PatientManualResponseDto
            {
                Id = entity.Id,
                Title = entity.Title,
                Content = entity.Content,
                imageUrl = entity.FileUrl
            };
        }

        public async Task<bool> DeleteAsync(Guid id)
        {
            var entity = await _context.PatientManuals.FindAsync(id);
            if (entity == null) return false;

            _context.PatientManuals.Remove(entity);
            await _context.SaveChangesAsync();
            return true;
        }

        private static async Task<string?> ProcessarMidiasAsync(IFormFile midia)
        {
            if (midia == null) return null;

            // Define o caminho para a pasta "Usuarios"
            var baseDirectory = Path.Combine("Uploads", "ManualPaciente").Replace("\\", "/");

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
