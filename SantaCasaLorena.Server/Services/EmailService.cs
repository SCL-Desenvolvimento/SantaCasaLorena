using MailKit.Net.Smtp;
using MailKit.Security;
using MimeKit;
using SantaCasaLorena.Server.DTOs;
using SantaCasaLorena.Server.Interfaces;

namespace SantaCasaLorena.Server.Services
{
    public class EmailService : IEmailService
    {
        private readonly IConfiguration _config;

        public EmailService(IConfiguration config)
        {
            _config = config;
        }

        public async Task<bool> EnviarEmailAsync(EmailDto email)
        {
            try
            {
                var mailSettings = _config.GetSection("MailSettings");

                var message = new MimeMessage();

                // Remetente
                message.From.Add(new MailboxAddress(
                    email.RemetenteNome ?? "Santa Casa de Lorena",
                    email.RemetenteEmail ?? mailSettings["From"]
                ));

                // Destinatário
                message.To.Add(new MailboxAddress(email.Destinatario, email.Destinatario));

                message.Subject = email.Assunto;

                var builder = new BodyBuilder
                {
                    HtmlBody = email.CorpoHtml
                };

                if (email.Anexos != null)
                {
                    foreach (var (fileName, content) in email.Anexos)
                    {
                        builder.Attachments.Add(fileName, content);
                    }
                }

                message.Body = builder.ToMessageBody();

                using var client = new SmtpClient();

                var host = mailSettings["Smtp:Host"];
                var port = int.Parse(mailSettings["Smtp:Port"]);
                var user = mailSettings["Smtp:UserName"];
                var pass = mailSettings["Smtp:Password"];

                await client.ConnectAsync(host, port, SecureSocketOptions.StartTls);

                // só autentica se tiver usuário/senha configurados
                if (!string.IsNullOrEmpty(user) && !string.IsNullOrEmpty(pass))
                {
                    await client.AuthenticateAsync(user, pass);
                }

                await client.SendAsync(message);
                await client.DisconnectAsync(true);

                return true;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Erro ao enviar e-mail: {ex.Message}");
                return false;
            }
        }
    }
}
