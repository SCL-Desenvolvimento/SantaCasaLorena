using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SantaCasaLorena.Server.DTOs;
using SantaCasaLorena.Server.Interfaces;

namespace SantaCasaLorena.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class NewsController : ControllerBase
    {
        private readonly INewsService _service;

        public NewsController(INewsService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<NewsResponseDto>>> GetAll()
        {
            var result = await _service.GetAllAsync();
            return Ok(result);
        }

        [HttpGet("{id:guid}")]
        public async Task<ActionResult<NewsResponseDto>> GetById(Guid id)
        {
            var item = await _service.GetByIdAsync(id);
            if (item == null) return NotFound();
            return Ok(item);
        }

        [Authorize]
        [HttpPost]
        public async Task<ActionResult<NewsResponseDto>> Create([FromForm] NewsRequestDto dto)
        {
            var created = await _service.AddAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
        }

        [Authorize]
        [HttpPut("{id:guid}")]
        public async Task<ActionResult<NewsResponseDto>> Update(Guid id, [FromForm] NewsRequestDto dto)
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
        [HttpPatch("{id:guid}/publish")]
        public async Task<ActionResult> UpdatePublishStatus(Guid id, [FromBody] NewsPublishStatusDto dto)
        {
            var success = await _service.UpdatePublishStatusAsync(id, dto.IsPublished);
            if (!success) return NotFound();
            return NoContent();
        }
    }

    // DTO para o status de publicação, pois o PATCH espera um corpo JSON simples
    public class NewsPublishStatusDto
    {
        public bool IsPublished { get; set; }
    }
}

