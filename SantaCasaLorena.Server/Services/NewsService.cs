using Microsoft.EntityFrameworkCore;
using SantaCasaLorena.Server.Context;
using SantaCasaLorena.Server.DTOs;
using SantaCasaLorena.Server.Entities;
using SantaCasaLorena.Server.Interfaces;

namespace SantaCasaLorena.Server.Services
{
    public class NewsService : INewsService
    {
        private readonly SantaCasaDbContext _context;

        public NewsService(SantaCasaDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<NewsResponseDto>> GetAllAsync()
        {
            return await _context.News
                .Include(n => n.User)
                .Select(n => new NewsResponseDto
                {
                    Id = n.Id,
                    ImageUrl = n.ImageUrl,
                    Title = n.Title,
                    Description = n.Description,
                    Content = n.Content,
                    Category = n.Category,
                    IsPublished = n.IsPublished,
                    CreatedAt = n.CreatedAt
                })
                .ToListAsync();
        }

        public async Task<NewsResponseDto?> GetByIdAsync(Guid id)
        {
            return await _context.News
                .Include(n => n.User)
                .Where(n => n.Id == id)
                .Select(n => new NewsResponseDto
                {
                    Id = n.Id,
                    ImageUrl = n.ImageUrl,
                    Title = n.Title,
                    Description = n.Description,
                    Content = n.Content,
                    Category = n.Category,
                    IsPublished = n.IsPublished,
                    CreatedAt = n.CreatedAt
                })
                .FirstOrDefaultAsync();
        }

        public async Task<NewsResponseDto> AddAsync(NewsRequestDto dto)
        {
            var entity = new News
            {
                ImageUrl = await ProcessarMidiasAsync(dto.File),
                Title = dto.Title,
                Description = dto.Description,
                Content = dto.Content,
                Category = dto.Category,
                UserId = dto.UserId,
                IsPublished = dto.IsPublished
            };

            _context.News.Add(entity);
            await _context.SaveChangesAsync();

            return new NewsResponseDto
            {
                Id = entity.Id,
                ImageUrl = entity.ImageUrl,
                Title = entity.Title,
                Description = entity.Description,
                Content = entity.Content,
                Category = entity.Category,
                IsPublished = entity.IsPublished,
                CreatedAt = entity.CreatedAt
            };
        }

        public async Task<NewsResponseDto> UpdateAsync(Guid id, NewsRequestDto dto)
        {
            var entity = await _context.News.FindAsync(id) ?? throw new Exception("Notícia não encontrada");

            entity.Title = dto.Title;
            entity.Description = dto.Description;
            entity.Content = dto.Content;
            entity.Category = dto.Category;
            entity.IsPublished = dto.IsPublished;
            entity.UserId = dto.UserId;
            entity.UpdatedAt = DateTime.Now;

            if (!string.IsNullOrEmpty(entity.ImageUrl) && dto.File != null)
            {
                if (File.Exists(entity.ImageUrl))
                    File.Delete(entity.ImageUrl);
            }

            if (dto.File != null)
                entity.ImageUrl = await ProcessarMidiasAsync(dto.File);
            

            _context.News.Update(entity);
            await _context.SaveChangesAsync();

            return new NewsResponseDto
            {
                Id = entity.Id,
                ImageUrl = entity.ImageUrl,
                Title = entity.Title,
                Description = entity.Description,
                Content = entity.Content,
                Category = entity.Category,
                IsPublished = entity.IsPublished,
                CreatedAt = entity.CreatedAt
            };
        }

        public async Task<bool> DeleteAsync(Guid id)
        {
            var entity = await _context.News.FindAsync(id);
            if (entity == null) return false;

            _context.News.Remove(entity);
            await _context.SaveChangesAsync();
            return true;
        }

        private static async Task<string?> ProcessarMidiasAsync(IFormFile midia)
        {
            if (midia == null) return null;

            // Define o caminho para a pasta "Usuarios"
            var baseDirectory = Path.Combine("Uploads", "Noticias").Replace("\\", "/");

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
