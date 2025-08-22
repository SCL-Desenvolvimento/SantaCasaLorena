using Microsoft.AspNetCore.Mvc;
using SantaCasaLorena.Server.DTOs;
using SantaCasaLorena.Server.Interfaces;

namespace SantaCasaLorena.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TransparencyPortalController : ControllerBase
    {
        private readonly ITransparencyPortalService _service;

        public TransparencyPortalController(ITransparencyPortalService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<TransparencyPortalResponseDto>>> GetAll()
        {
            var result = await _service.GetAllAsync();
            return Ok(result);
        }

        [HttpGet("{id:guid}")]
        public async Task<ActionResult<TransparencyPortalResponseDto>> GetById(Guid id)
        {
            var item = await _service.GetByIdAsync(id);
            if (item == null) return NotFound();
            return Ok(item);
        }

        [HttpPost]
        public async Task<ActionResult<TransparencyPortalResponseDto>> Create(TransparencyPortalRequestDto dto)
        {
            var created = await _service.AddAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
        }

        [HttpPut("{id:guid}")]
        public async Task<ActionResult<TransparencyPortalResponseDto>> Update(Guid id, TransparencyPortalRequestDto dto)
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
