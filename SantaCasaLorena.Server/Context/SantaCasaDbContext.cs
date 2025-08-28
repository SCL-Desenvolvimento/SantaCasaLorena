using Microsoft.EntityFrameworkCore;
using SantaCasaLorena.Server.Entities;

namespace SantaCasaLorena.Server.Context
{
    public class SantaCasaDbContext : DbContext
    {
        public SantaCasaDbContext(DbContextOptions<SantaCasaDbContext> options) : base(options) { }

        public DbSet<User> Users { get; set; }
        public DbSet<HomeBanner> HomeBanners { get; set; }
        public DbSet<Agreement> Agreements { get; set; }
        public DbSet<News> News { get; set; }
        public DbSet<Provider> Providers { get; set; }
        public DbSet<TransparencyPortal> TransparencyPortals { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // USER
            modelBuilder.Entity<User>(entity =>
            {
                entity.HasKey(u => u.Id);
                entity.HasIndex(u => u.Email).IsUnique();
                entity.Property(u => u.Username).HasMaxLength(100).IsRequired();
                entity.Property(u => u.Email).HasMaxLength(200).IsRequired();
                entity.Property(u => u.PasswordHash).IsRequired();
                entity.Property(u => u.UserType).HasMaxLength(50).IsRequired();
            });

            // NEWS
            modelBuilder.Entity<News>(entity =>
            {
                entity.HasKey(n => n.Id);
                entity.Property(n => n.Title).HasMaxLength(200).IsRequired();
                entity.Property(n => n.Content).IsRequired();

                // como Description e Category não são mais `?`, agora são obrigatórios
                entity.Property(n => n.Description).IsRequired(false); // se você quiser permitir nulo no banco mesmo sem `?`
                entity.Property(n => n.Category).IsRequired(false);   // idem

                entity.HasOne(n => n.User)
                      .WithMany(u => u.NewsList)
                      .HasForeignKey(n => n.UserId)
                      .OnDelete(DeleteBehavior.Cascade);
            });

            // HOME BANNERS
            modelBuilder.Entity<HomeBanner>(entity =>
            {
                entity.HasKey(b => b.Id);
                entity.HasOne(b => b.News)
                      .WithMany()
                      .HasForeignKey(b => b.NewsId)
                      .OnDelete(DeleteBehavior.SetNull);
            });

            // AGREEMENTS
            modelBuilder.Entity<Agreement>(entity =>
            {
                entity.HasKey(a => a.Id);
                entity.Property(a => a.Name).HasMaxLength(150).IsRequired();
            });

            // PROVIDERS
            modelBuilder.Entity<Provider>(entity =>
            {
                entity.HasKey(p => p.Id);
                entity.Property(p => p.Name).HasMaxLength(150).IsRequired();
            });

            // TRANSPARENCY PORTAL
            modelBuilder.Entity<TransparencyPortal>(entity =>
            {
                entity.HasKey(t => t.Id);

                entity.Property(t => t.Category)
                      .HasMaxLength(100)
                      .IsRequired();

                entity.Property(t => t.Title)
                      .HasMaxLength(200)
                      .IsRequired();

                entity.Property(t => t.Description)
                      .HasMaxLength(500);

                entity.Property(t => t.Type)
                      .HasMaxLength(100);

                entity.Property(t => t.FileUrl)
                      .IsRequired();
            });
        }
    }
}
