using Microsoft.AspNetCore.Mvc;
using SantaCasaLorena.Server.DTOs;
using SantaCasaLorena.Server.Interfaces;

namespace SantaCasaLorena.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PatientManualsController : ControllerBase
    {
        private readonly IPatientManualService _service;

        public PatientManualsController(IPatientManualService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<PatientManualResponseDto>>> GetAll()
        {
            var result = await _service.GetAllAsync();
            return Ok(result);
        }

        [HttpGet("{id:guid}")]
        public async Task<ActionResult<PatientManualResponseDto>> GetById(Guid id)
        {
            var item = await _service.GetByIdAsync(id);
            if (item == null) return NotFound();
            return Ok(item);
        }

        [HttpPost]
        public async Task<ActionResult<PatientManualResponseDto>> Create(PatientManualRequestDto dto)
        {
            var created = await _service.AddAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
        }

        [HttpPut("{id:guid}")]
        public async Task<ActionResult<PatientManualResponseDto>> Update(Guid id, PatientManualRequestDto dto)
        {
            var updated = await _service.UpdateAsync(id, dto);
            return Ok(updated);
        }

        [HttpDelete("{id:guid}")]
        public async Task<ActionResult> Delete(Guid id)
        {
            var success = await _service.DeleteAsync(id);
            if (!success) return NotFound();
            return NoContent();
        }
    }
}
