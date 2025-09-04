using SantaCasaLorena.Server.DTOs;
using System.Net.Http.Json;

namespace SantaCasaLorena.Server.Services
{
    public class RecaptchaService
    {
        private readonly IConfiguration _config;
        private readonly HttpClient _http;

        public RecaptchaService(IConfiguration config, HttpClient http)
        {
            _config = config;
            _http = http;
        }

        public async Task<bool> ValidateAsync(string token)
        {
            var secret = _config["Recaptcha:SecretKey"];
            var response = await _http.PostAsync(
                $"https://www.google.com/recaptcha/api/siteverify?secret={secret}&response={token}",
                null
            );
            var result = await response.Content.ReadFromJsonAsync<RecaptchaResponse>();
            return result?.Success ?? false;
        }

    }
}
