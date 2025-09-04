using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using SantaCasaLorena.Server.Context;
using SantaCasaLorena.Server.DTOs;
using SantaCasaLorena.Server.Entities;
using SantaCasaLorena.Server.Interfaces;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace SantaCasaLorena.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly SantaCasaDbContext _context;
        private readonly IConfiguration _config;
        private readonly IPasswordHasher<object> _passwordHasher;
        private readonly IEmailService _emailService;

        public AuthController(SantaCasaDbContext context, IConfiguration config, IPasswordHasher<object> passwordHasher, IEmailService emailService)
        {
            _context = context;
            _config = config;
            _passwordHasher = passwordHasher;
            _emailService = emailService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromForm] UserRequestDto dto)
        {
            if (await _context.Users.AnyAsync(u => u.Username == dto.Username))
                return BadRequest("Usuário já cadastrado.");

            var user = new User
            {
                Email = dto.Email,
                Username = dto.Username,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow,
                PhotoUrl = dto.File == null ? "Uploads/Usuarios/padrao.png" : await ProcessarMidiasAsync(dto.File),
                PasswordHash = _passwordHasher.HashPassword(null!, "MV")
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            var token = GenerateJwtToken(user);
            return Ok(new { token });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto dto)
        {
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Username == dto.UserName);

            if (user == null)
                return Unauthorized("Usuário não encontrado.");

            var result = _passwordHasher.VerifyHashedPassword(null!, user.PasswordHash, dto.Password);

            if (result != PasswordVerificationResult.Success)
                return Unauthorized("Senha inválida.");

            // Gera o token diretamente
            var token = GenerateJwtToken(user);

            return Ok(new { userId = user.Id, token });
        }

        [HttpPost("recuperar-senha")]
        public async Task<IActionResult> RecuperarSenha([FromBody] string email)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == email);

            if (user == null)
                return NotFound("Usuário não encontrado com este e-mail.");

            // Gera nova senha temporária
            var novaSenha = Guid.NewGuid().ToString("N")[..8]; // 8 caracteres

            // Atualiza hash da senha
            user.PasswordHash = _passwordHasher.HashPassword(null!, novaSenha);
            user.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            // Corpo do e-mail
            var corpo = $@"
                        <h3>Recuperação de Senha</h3>
                        <p>Olá <b>{user.Username}</b>,</p>
                        <p>Sua nova senha temporária é:</p>
                        <p style='font-size:18px; font-weight:bold; color:#2c3e50'>{novaSenha}</p>
                        <p>Recomendamos alterá-la após o login.</p>";

            var emailDto = new EmailDto()
            {
                Destinatario = user.Email!,
                Assunto = "Recuperação de Senha - Santa Casa",
                CorpoHtml = corpo
            };

            // Envia o e-mail
            var enviado = await _emailService.EnviarEmailAsync(emailDto);

            if (!enviado)
                return StatusCode(500, "Erro ao enviar o e-mail de recuperação.");

            return Ok("Uma nova senha foi enviada para o seu e-mail.");
        }

        private string GenerateJwtToken(User user)
        {
            if (string.IsNullOrWhiteSpace(_config["Jwt:Key"]) ||
                string.IsNullOrWhiteSpace(_config["Jwt:Issuer"]) ||
                string.IsNullOrWhiteSpace(_config["Jwt:Audience"]))
            {
                throw new InvalidOperationException("JWT configuration is missing in appsettings.json.");
            }

            var claims = new[]
            {
                new Claim("id", user.Id.ToString()),
                new Claim("email", user.Email ?? string.Empty),
                new Claim("username", user.Username),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]!));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _config["Jwt:Issuer"],
                audience: _config["Jwt:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddHours(2),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        private static async Task<string> ProcessarMidiasAsync(IFormFile midia)
        {
            var baseDirectory = Path.Combine("Uploads", "Usuarios").Replace("\\", "/");

            if (!Directory.Exists(baseDirectory))
                Directory.CreateDirectory(baseDirectory);

            var filePath = Path.Combine(baseDirectory, Guid.NewGuid() + Path.GetExtension(midia.FileName)).Replace("\\", "/");

            await using var stream = new FileStream(filePath, FileMode.Create);
            await midia.CopyToAsync(stream);

            return filePath;
        }
    }
}
