namespace SantaCasaLorena.Server.Entities
{
    public class ServiceSurvey
    {
        public int Id { get; set; }
        public string WaitingTime { get; set; } = string.Empty;
        public int ServiceRating { get; set; }
        public string ProblemResolution { get; set; } = string.Empty;
        public string StaffPreparedness { get; set; } = string.Empty;
        public string InformationClarity { get; set; } = string.Empty;
        public string QuestionsAnswered { get; set; } = string.Empty;
        public string Experience { get; set; } = string.Empty;
        public string Comments { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
    }
}
