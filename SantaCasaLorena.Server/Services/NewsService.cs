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
                    Tags = n.Tags,
                    SeoTitle = n.SeoTitle,
                    SeoDescription = n.SeoDescription,
                    SeoKeywords = n.SeoKeywords,
                    CreatedAt = n.CreatedAt,
                    UpdatedAt = n.UpdatedAt,
                    PublishedAt = n.PublishedAt,
                    Views = n.Views
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
                    Tags = n.Tags,
                    SeoTitle = n.SeoTitle,
                    SeoDescription = n.SeoDescription,
                    SeoKeywords = n.SeoKeywords,
                    CreatedAt = n.CreatedAt,
                    UpdatedAt = n.UpdatedAt,
                    PublishedAt = n.PublishedAt,
                    Views = n.Views
                })
                .FirstOrDefaultAsync();
        }

        public async Task<NewsResponseDto> AddAsync(NewsRequestDto dto)
        {
            var entity = new News
            {
                ImageUrl = dto.File != null ? await ProcessarMidiasAsync(dto.File) : null,
                Title = dto.Title,
                Description = dto.Description,
                Content = dto.Content,
                Category = dto.Category,
                UserId = Guid.Parse(dto.UserId),
                IsPublished = dto.IsPublished,
                Tags = dto.Tags,
                SeoTitle = dto.SeoTitle,
                SeoDescription = dto.SeoDescription,
                SeoKeywords = dto.SeoKeywords,
                PublishedAt = dto.IsPublished ? DateTime.UtcNow : null,
                Views = 0
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
                Tags = entity.Tags,
                SeoTitle = entity.SeoTitle,
                SeoDescription = entity.SeoDescription,
                SeoKeywords = entity.SeoKeywords,
                CreatedAt = entity.CreatedAt,
                UpdatedAt = entity.UpdatedAt,
                PublishedAt = entity.PublishedAt,
                Views = entity.Views
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
            entity.UserId = Guid.Parse(dto.UserId);
            entity.Tags = dto.Tags;
            entity.SeoTitle = dto.SeoTitle;
            entity.SeoDescription = dto.SeoDescription;
            entity.SeoKeywords = dto.SeoKeywords;
            entity.UpdatedAt = DateTime.UtcNow;

            if (dto.IsPublished && !entity.PublishedAt.HasValue)
            {
                entity.PublishedAt = DateTime.UtcNow;
            }
            else if (!dto.IsPublished)
            {
                entity.PublishedAt = null;
            }

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
                Tags = entity.Tags,
                SeoTitle = entity.SeoTitle,
                SeoDescription = entity.SeoDescription,
                SeoKeywords = entity.SeoKeywords,
                CreatedAt = entity.CreatedAt,
                UpdatedAt = entity.UpdatedAt,
                PublishedAt = entity.PublishedAt,
                Views = entity.Views
            };
        }

        public async Task<bool> DeleteAsync(Guid id)
        {
            var entity = await _context.News.FindAsync(id);
            if (entity == null) return false;

            if (!string.IsNullOrEmpty(entity.ImageUrl) && File.Exists(entity.ImageUrl))
            {
                File.Delete(entity.ImageUrl);
            }

            _context.News.Remove(entity);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> UpdatePublishStatusAsync(Guid id, bool isPublished)
        {
            var entity = await _context.News.FindAsync(id);
            if (entity == null) return false;

            entity.IsPublished = isPublished;
            entity.UpdatedAt = DateTime.UtcNow;
            if (isPublished && !entity.PublishedAt.HasValue)
            {
                entity.PublishedAt = DateTime.UtcNow;
            }
            else if (!isPublished)
            {
                entity.PublishedAt = null;
            }

            _context.News.Update(entity);
            await _context.SaveChangesAsync();
            return true;
        }

        private static async Task<string?> ProcessarMidiasAsync(IFormFile midia)
        {
            if (midia == null) return null;

            // Define o caminho para a pasta "Noticias" dentro de "Uploads"
            var baseDirectory = Path.Combine("Uploads", "Noticias");

            // Verifica se a pasta "Noticias" existe, e a cria caso não exista
            if (!Directory.Exists(baseDirectory))
            {
                Directory.CreateDirectory(baseDirectory);
            }

            // Gera um nome de arquivo único e o caminho completo
            var fileName = Guid.NewGuid().ToString() + Path.GetExtension(midia.FileName);
            var filePath = Path.Combine(baseDirectory, fileName);

            // Salva o arquivo no caminho especificado
            await using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await midia.CopyToAsync(stream);
            }

            // Retorna o caminho relativo que será usado para construir a URL no frontend
            return filePath;
        }
    }
}

