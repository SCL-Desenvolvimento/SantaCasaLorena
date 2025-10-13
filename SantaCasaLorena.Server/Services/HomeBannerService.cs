using Microsoft.EntityFrameworkCore;
using SantaCasaLorena.Server.Context;
using SantaCasaLorena.Server.DTOs;
using SantaCasaLorena.Server.Entities;
using SantaCasaLorena.Server.Interfaces;
using System.Drawing;

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
                .Include(b => b.News)
                .Select(b => MapToResponse(b))
                .ToListAsync();
        }

        public async Task<HomeBannerResponseDto?> GetByIdAsync(Guid id)
        {
            return await _context.HomeBanners
                .Where(b => b.Id == id)
                .Select(b => MapToResponse(b))
                .FirstOrDefaultAsync();
        }

        public async Task<HomeBannerResponseDto> AddAsync(HomeBannerRequestDto dto)
        {
            // validação obrigatória
            if (dto.DesktopFile == null || dto.TabletFile == null || dto.MobileFile == null)
                throw new Exception("Os 3 arquivos (desktop, tablet, mobile) são obrigatórios.");

            var entity = new HomeBanner
            {
                DesktopImageUrl = await ProcessarMidiasAsync(dto.DesktopFile, 1920, 540),
                TabletImageUrl = await ProcessarMidiasAsync(dto.TabletFile, 1280, 800),
                MobileImageUrl = await ProcessarMidiasAsync(dto.MobileFile, 600, 600),
                TimeSeconds = dto.TimeSeconds,
                Title = dto.Title,
                Description = dto.Description,
                IsActive = dto.IsActive,
                Order = dto.Order,
                NewsId = dto.NewsId
            };

            _context.HomeBanners.Add(entity);
            await _context.SaveChangesAsync();

            return MapToResponse(entity);
        }

        public async Task<HomeBannerResponseDto> UpdateAsync(Guid id, HomeBannerRequestDto dto)
        {
            var entity = await _context.HomeBanners.FindAsync(id);
            if (entity == null) throw new Exception("Banner não encontrado");

            entity.TimeSeconds = dto.TimeSeconds;
            entity.Order = dto.Order;
            entity.NewsId = dto.NewsId;
            entity.Title = dto.Title;
            entity.Description = dto.Description;
            entity.IsActive = dto.IsActive;

            if (dto.DesktopFile != null)
                entity.DesktopImageUrl = await ProcessarMidiasAsync(dto.DesktopFile, 1920, 540);

            if (dto.TabletFile != null)
                entity.TabletImageUrl = await ProcessarMidiasAsync(dto.TabletFile, 1280, 800);

            if (dto.MobileFile != null)
                entity.MobileImageUrl = await ProcessarMidiasAsync(dto.MobileFile, 600, 600);

            _context.HomeBanners.Update(entity);
            await _context.SaveChangesAsync();

            return MapToResponse(entity);
        }

        public async Task<bool> DeleteAsync(Guid id)
        {
            var entity = await _context.HomeBanners.FindAsync(id);
            if (entity == null) return false;

            _context.HomeBanners.Remove(entity);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> UpdateStatusAsync(Guid id, bool isActive)
        {
            var banner = await _context.HomeBanners.FindAsync(id);
            if (banner == null) return false;

            banner.IsActive = isActive;
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> UpdateOrderAsync(Guid id, int newOrder)
        {
            var banner = await _context.HomeBanners.FindAsync(id);
            if (banner == null) return false;

            banner.Order = newOrder;
            await _context.SaveChangesAsync();
            return true;
        }

        private static async Task<string> ProcessarMidiasAsync(IFormFile file, int larguraEsperada, int alturaEsperada)
        {
            if (file == null) throw new Exception("Arquivo inválido.");

            using var img = Image.FromStream(file.OpenReadStream());

            if (img.Width != larguraEsperada || img.Height != alturaEsperada)
                throw new Exception($"A imagem deve ter {larguraEsperada}x{alturaEsperada}px");

            var baseDirectory = Path.Combine("Uploads", "HomeBanner").Replace("\\", "/");
            if (!Directory.Exists(baseDirectory)) Directory.CreateDirectory(baseDirectory);

            var filePath = Path.Combine(baseDirectory, Guid.NewGuid() + Path.GetExtension(file.FileName)).Replace("\\", "/");

            await using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            return filePath;
        }

        private static HomeBannerResponseDto MapToResponse(HomeBanner entity)
        {
            return new HomeBannerResponseDto
            {
                Id = entity.Id,
                Title = entity.Title,
                Description = entity.Description,
                IsActive = entity.IsActive,
                DesktopImageUrl = entity.DesktopImageUrl,
                TabletImageUrl = entity.TabletImageUrl,
                MobileImageUrl = entity.MobileImageUrl,
                NewsId = entity.NewsId,
                Order = entity.Order,
                TimeSeconds = entity.TimeSeconds,
                NewsTitle = entity?.News?.Title
            };
        }
    }
}
