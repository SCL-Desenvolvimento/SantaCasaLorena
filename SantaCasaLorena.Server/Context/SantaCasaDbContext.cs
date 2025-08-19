using Microsoft.EntityFrameworkCore;

namespace SantaCasaLorena.Server.Context
{
    public class SantaCasaDbContext : DbContext
    {
        public SantaCasaDbContext(DbContextOptions<SantaCasaDbContext> options) : base(options) { }


        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

        }
    }
}
