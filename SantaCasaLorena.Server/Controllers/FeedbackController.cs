using Microsoft.AspNetCore.Mvc;
using SantaCasaLorena.Server.DTOs;
using SantaCasaLorena.Server.Interfaces;
using SantaCasaLorena.Server.Services;

namespace SantaCasaLorena.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class FeedbackController : ControllerBase
    {
        private readonly IFeedbackService _service;
        private readonly RecaptchaService _recaptcha;

        public FeedbackController(IFeedbackService service, RecaptchaService recaptcha)
        {
            _service = service;
            _recaptcha = recaptcha;
        }

        [HttpPost("contato")]
        public async Task<IActionResult> EnviarContato([FromBody] FeedbackDto dto)
        {
            //if (!await _recaptcha.ValidateAsync(dto.RecaptchaToken))
            //    return BadRequest("Falha no reCAPTCHA");

            var result = await _service.EnviarContatoAsync(dto);
            return result
                ? Ok(new { message = "Contato enviado com sucesso" })
                : BadRequest(new { message = "Erro ao enviar contato" });
        }

        [HttpPost("trabalhe-conosco")]
        public async Task<IActionResult> TrabalheConosco([FromForm] JobApplicationDto dto)
        {
            //if (!await _recaptcha.ValidateAsync(dto.RecaptchaToken))
            //    return BadRequest("Falha no reCAPTCHA");

            var result = await _service.TrabalheConoscoAsync(dto);
            return result ? Ok(new { message = "Currículo enviado com sucesso" }) : BadRequest(new { message = "Erro ao enviar currículo" });

        }

        [HttpPost("pesquisa")]
        public async Task<IActionResult> Pesquisa([FromBody] ServiceSurveyDto dto)
        {
            //if (!await _recaptcha.ValidateAsync(dto.RecaptchaToken))
            //    return BadRequest("Falha no reCAPTCHA");

            var result = await _service.PesquisaAsync(dto);
            return result ? Ok(new { message = "Pesquisa enviada com sucesso" }) : BadRequest(new { message = "Erro ao enviar pesquisa" });
        }
    }
}
