using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SantaCasaLorena.Server.DTOs;
using SantaCasaLorena.Server.Interfaces;

namespace SantaCasaLorena.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class HomeBannersController : ControllerBase
    {
        private readonly IHomeBannerService _service;

        public HomeBannersController(IHomeBannerService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<HomeBannerResponseDto>>> GetAll()
        {
            var result = await _service.GetAllAsync();
            return Ok(result);
        }

        [HttpGet("{id:guid}")]
        public async Task<ActionResult<HomeBannerResponseDto>> GetById(Guid id)
        {
            var item = await _service.GetByIdAsync(id);
            if (item == null) return NotFound();
            return Ok(item);
        }

        [Authorize]
        [HttpPost]
        public async Task<ActionResult<HomeBannerResponseDto>> Create([FromForm] HomeBannerRequestDto dto)
        {
            var created = await _service.AddAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
        }

        [Authorize]
        [HttpPut("{id:guid}")]
        public async Task<ActionResult<HomeBannerResponseDto>> Update(Guid id, [FromForm] HomeBannerRequestDto dto)
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
        [HttpPut("{id:guid}/status")]
        public async Task<ActionResult> UpdateStatus(Guid id, [FromQuery] bool status)
        {
            var success = await _service.UpdateStatusAsync(id, status);
            if (!success) return NotFound();
            return NoContent();
        }

        [Authorize]
        [HttpPut("{id:guid}/order")]
        public async Task<ActionResult> UpdateOrder(Guid id, [FromQuery] int order)
        {
            var success = await _service.UpdateOrderAsync(id, order);
            if (!success) return NotFound();
            return NoContent();
        }

    }
}
