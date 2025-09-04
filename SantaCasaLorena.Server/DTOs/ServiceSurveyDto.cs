namespace SantaCasaLorena.Server.DTOs
{
    public class ServiceSurveyDto
    {
        public string WaitingTime { get; set; } = string.Empty;
        public int ServiceRating { get; set; }
        public string ProblemResolution { get; set; } = string.Empty;
        public string StaffPreparedness { get; set; } = string.Empty;
        public string InformationClarity { get; set; } = string.Empty;
        public string QuestionsAnswered { get; set; } = string.Empty;
        public string Experience { get; set; } = string.Empty;
        public string Comments { get; set; } = string.Empty;
        public string? RecaptchaToken { get; set; } = string.Empty;
    }
}
