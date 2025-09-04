using MimeKit;
using SantaCasaLorena.Server.Context;
using SantaCasaLorena.Server.DTOs;
using SantaCasaLorena.Server.Interfaces;

namespace SantaCasaLorena.Server.Services
{
    public class FeedbackService : IFeedbackService
    {
        private readonly SantaCasaDbContext _context;
        private readonly IConfiguration _config;
        private readonly IEmailService _emailService;

        public FeedbackService(SantaCasaDbContext context, IConfiguration config, IEmailService emailService)
        {
            _context = context;
            _config = config;
            _emailService = emailService;
        }

        public async Task<bool> EnviarContatoAsync(FeedbackDto dto)
        {
            var entity = new Entities.Feedback
            {
                Name = dto.Name,
                Email = dto.Email,
                City = dto.City,
                Subject = dto.Subject,
                Reason = dto.Reason,
                Message = dto.Message,
                CreatedAt = DateTime.Now
            };
            _context.Ouvidorias.Add(entity);
            //await _context.SaveChangesAsync();

            var destinatario = _config["MailSettings:Contacts:Ouvidoria"];

            var email = new EmailDto
            {
                Destinatario = destinatario,
                Assunto = "Ouvidoria - Novo contato através do site",
                CorpoHtml = $@"
                    <h2>Novo contato recebido</h2>
                    <p><b>Nome:</b> {dto.Name}</p>
                    <p><b>Email:</b> {dto.Email}</p>
                    <p><b>Cidade:</b> {dto.City}</p>
                    <p><b>Assunto:</b> {dto.Subject}</p>
                    <p><b>Razão:</b> {dto.Reason}</p>
                    <p><b>Mensagem:</b> {dto.Message}</p>"
            };

            return await _emailService.EnviarEmailAsync(email);
        }

        public async Task<bool> TrabalheConoscoAsync(JobApplicationDto dto)
        {
            var entity = new Entities.JobApplication
            {
                Name = dto.Name,
                Email = dto.Email,
                City = dto.City,
                ResumeUrl = dto.File?.FileName,
                CreatedAt = DateTime.Now
            };
            _context.TrabalheConosco.Add(entity);
            //await _context.SaveChangesAsync();

            var destinatario = _config["MailSettings:Contacts:TrabalheConosco"];

            var email = new EmailDto
            {
                Destinatario = destinatario,
                Assunto = "Trabalhe Conosco - Novo contato através do site",
                CorpoHtml = $@"
                    <h2>Novo currículo recebido</h2>
                    <p><b>Nome:</b> {dto.Name}</p>
                    <p><b>Email:</b> {dto.Email}</p>
                    <p><b>Cidade:</b> {dto.City}</p>"
            };

            if (dto.File != null)
            {
                using var ms = new MemoryStream();
                await dto.File.CopyToAsync(ms);
                email.Anexos =
                [
                    (dto.File.FileName, ms.ToArray())
                ];
            }

            return await _emailService.EnviarEmailAsync(email);
        }

        public async Task<bool> PesquisaAsync(ServiceSurveyDto dto)
        {
            var entity = new Entities.ServiceSurvey
            {
                WaitingTime = dto.WaitingTime,
                ServiceRating = dto.ServiceRating,
                ProblemResolution = dto.ProblemResolution,
                StaffPreparedness = dto.StaffPreparedness,
                InformationClarity = dto.InformationClarity,
                QuestionsAnswered = dto.QuestionsAnswered,
                Experience = dto.Experience,
                Comments = dto.Comments,
                CreatedAt = DateTime.Now
            };
            _context.Pesquisas.Add(entity);
            //await _context.SaveChangesAsync();

            var destinatario = _config["MailSettings:Contacts:Pesquisa"];

            var email = new EmailDto
            {
                Destinatario = destinatario,
                Assunto = "Pesquisa de Atendimento - Novo contato",
                CorpoHtml = $@"
                    <h2>Nova pesquisa recebida</h2>
                    <p><b>Tempo de Espera:</b> {dto.WaitingTime}</p>
                    <p><b>Nota:</b> {dto.ServiceRating}</p>
                    <p><b>Resolução:</b> {dto.ProblemResolution}</p>
                    <p><b>Preparo:</b> {dto.StaffPreparedness}</p>
                    <p><b>Informações:</b> {dto.InformationClarity}</p>
                    <p><b>Perguntas:</b> {dto.QuestionsAnswered}</p>
                    <p><b>Experiência:</b> {dto.Experience}</p>
                    <p><b>Mensagem:</b> {dto.Comments}</p>"
            };

            return await _emailService.EnviarEmailAsync(email);
        }
    }
}
