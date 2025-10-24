using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SantaCasaLorena.Server.DTOs;
using SantaCasaLorena.Server.Interfaces;

namespace SantaCasaLorena.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AgreementsController : ControllerBase
    {
        private readonly IAgreementService _service;

        public AgreementsController(IAgreementService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<AgreementResponseDto>>> GetAll()
        {
            var result = await _service.GetAllAsync();
            return Ok(result);
        }

        [HttpGet("{id:guid}")]
        public async Task<ActionResult<AgreementResponseDto>> GetById(Guid id)
        {
            var item = await _service.GetByIdAsync(id);
            if (item == null) return NotFound();
            return Ok(item);
        }

        [Authorize]
        [HttpPost]
        public async Task<ActionResult<AgreementResponseDto>> Create([FromForm] AgreementRequestDto dto)
        {
            var created = await _service.AddAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
        }

        [Authorize]
        [HttpPut("{id:guid}")]
        public async Task<ActionResult<AgreementResponseDto>> Update(Guid id, [FromForm] AgreementRequestDto dto)
        {
            var updated = await _service.UpdateAsync(id, dto);
            return Ok(updated);
        }

        [Authorize]
        [HttpDelete("{id:guid}")]
        public async Task<ActionResult> Delete(Guid id)
        {
            var success = await _service.DeleteAsync(id);
            if (!success) return NotFound();
            return NoContent();
        }

        [Authorize]
        [HttpPatch("{id}/toggle-active")]
        public async Task<ActionResult<ContactResponseDto>> ToggleActive(Guid id)
        {
            var result = await _service.ToggleActiveAsync(id);
            if (result == null)
                return NotFound();

            return Ok(result);
        }

        [Authorize]
        [HttpPost("bulk-delete")]
        public async Task<ActionResult> BulkDelete([FromBody] IEnumerable<Guid> ids)
        {
            var success = await _service.BulkDeleteAsync(ids);
            if (!success)
                return NotFound();

            return NoContent();
        }

        [Authorize]
        [HttpPost("bulk-toggle")]
        public async Task<ActionResult> BulkToggle([FromBody] BulkToggleRequest request)
        {
            var success = await _service.BulkToggleActiveAsync(request.Ids, request.Activate);
            if (!success)
                return NotFound();

            return NoContent();
        }

    }
}
