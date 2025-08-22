using Microsoft.EntityFrameworkCore;
using SantaCasaLorena.Server.Context;
using SantaCasaLorena.Server.DTOs;
using SantaCasaLorena.Server.Entities;
using SantaCasaLorena.Server.Interfaces;

namespace SantaCasaLorena.Server.Services
{
    public class HomeBannerService : IHomeBannerService
    {
        private readonly SantaCasaDbContext _context;

        public HomeBannerService(SantaCasaDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<HomeBannerResponseDto>> GetAllAsync()
        {
            return await _context.HomeBanners
                .Select(b => new HomeBannerResponseDto
                {
                    Id = b.Id,
                    imageUrl = b.ImageUrl,
                    TimeSeconds = b.TimeSeconds,
                    Order = b.Order,
                    NewsId = b.NewsId
                })
                .ToListAsync();
        }

        public async Task<HomeBannerResponseDto?> GetByIdAsync(Guid id)
        {
            return await _context.HomeBanners
                .Where(b => b.Id == id)
                .Select(b => new HomeBannerResponseDto
                {
                    Id = b.Id,
                    imageUrl = b.ImageUrl,
                    TimeSeconds = b.TimeSeconds,
                    Order = b.Order,
                    NewsId = b.NewsId
                })
                .FirstOrDefaultAsync();
        }

        public async Task<HomeBannerResponseDto> AddAsync(HomeBannerRequestDto dto)
        {
            var entity = new HomeBanner
            {
                ImageUrl = await ProcessarMidiasAsync(dto.File),
                TimeSeconds = dto.TimeSeconds,
                Order = dto.Order,
                NewsId = dto.NewsId
            };

            _context.HomeBanners.Add(entity);
            await _context.SaveChangesAsync();

            return new HomeBannerResponseDto
            {
                Id = entity.Id,
                imageUrl = entity.ImageUrl,
                NewsId = entity.NewsId,
                Order = entity.Order,
                TimeSeconds = entity.TimeSeconds
            };
        }

        public async Task<HomeBannerResponseDto> UpdateAsync(Guid id, HomeBannerRequestDto dto)
        {
            var entity = await _context.HomeBanners.FindAsync(id);
            if (entity == null) throw new Exception("Banner não encontrado");

            entity.TimeSeconds = dto.TimeSeconds;
            entity.Order = dto.Order;
            entity.NewsId = dto.NewsId;

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

            _context.HomeBanners.Update(entity);
            await _context.SaveChangesAsync();

            return new HomeBannerResponseDto
            {
                Id = entity.Id,
                imageUrl = entity.ImageUrl,
                NewsId = entity.NewsId,
                Order = entity.Order,
                TimeSeconds = entity.TimeSeconds
            };
        }

        public async Task<bool> DeleteAsync(Guid id)
        {
            var entity = await _context.HomeBanners.FindAsync(id);
            if (entity == null) return false;

            _context.HomeBanners.Remove(entity);
            await _context.SaveChangesAsync();
            return true;
        }

        private static async Task<string?> ProcessarMidiasAsync(IFormFile midia)
        {
            if (midia == null) return null;

            // Define o caminho para a pasta "Usuarios"
            var baseDirectory = Path.Combine("Uploads", "HomeBanner").Replace("\\", "/");

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
