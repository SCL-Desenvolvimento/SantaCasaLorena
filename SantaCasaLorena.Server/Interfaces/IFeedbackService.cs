using SantaCasaLorena.Server.DTOs;

namespace SantaCasaLorena.Server.Interfaces
{
    public interface IFeedbackService
    {
        Task<bool> EnviarContatoAsync(FeedbackDto dto);
        Task<bool> TrabalheConoscoAsync(JobApplicationDto dto);
        Task<bool> PesquisaAsync(ServiceSurveyDto dto);
    }
}
