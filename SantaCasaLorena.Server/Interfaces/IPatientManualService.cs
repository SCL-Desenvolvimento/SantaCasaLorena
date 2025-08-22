using SantaCasaLorena.Server.DTOs;

namespace SantaCasaLorena.Server.Interfaces
{
    public interface IPatientManualService
    {
        Task<IEnumerable<PatientManualResponseDto>> GetAllAsync();
        Task<PatientManualResponseDto?> GetByIdAsync(Guid id);
        Task<PatientManualResponseDto> AddAsync(PatientManualRequestDto dto);
        Task<PatientManualResponseDto> UpdateAsync(Guid id, PatientManualRequestDto dto);
        Task<bool> DeleteAsync(Guid id);
    }
}
