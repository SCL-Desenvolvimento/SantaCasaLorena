using Microsoft.AspNetCore.Mvc;
using SantaCasaLorena.Server.DTOs;
using SantaCasaLorena.Server.Interfaces;

namespace SantaCasaLorena.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ContactsController : ControllerBase
    {
        private readonly IContactService _service;

        public ContactsController(IContactService contactService)
        {
            _service = contactService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<ContactResponseDto>>> GetContacts()
        {
            var contacts = await _service.GetAllContactsAsync();
            return Ok(contacts);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ContactResponseDto>> GetContact(Guid id)
        {
            var contact = await _service.GetContactByIdAsync(id);
            if (contact == null)
            {
                return NotFound();
            }
            return Ok(contact);
        }

        [HttpPost]
        public async Task<ActionResult<ContactResponseDto>> CreateContact(ContactRequestDto dto)
        {
            var newContact = await _service.CreateContactAsync(dto);
            return CreatedAtAction(nameof(GetContact), new { id = newContact.Id }, newContact);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<ContactResponseDto>> UpdateContact(Guid id, ContactRequestDto dto)
        {
            var updatedContact = await _service.UpdateContactAsync(id, dto);
            if (updatedContact == null)
            {
                return NotFound();
            }
            return Ok(updatedContact);
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteContact(Guid id)
        {
            var result = await _service.DeleteContactAsync(id);
            if (!result)
            {
                return NotFound();
            }
            return NoContent();
        }

        [HttpPatch("{id}/toggle-active")]
        public async Task<ActionResult<ContactResponseDto>> ToggleActive(Guid id)
        {
            var result = await _service.ToggleActiveAsync(id);
            if (result == null)
                return NotFound();

            return Ok(result);
        }

        [HttpPost("bulk-delete")]
        public async Task<ActionResult> BulkDelete([FromBody] IEnumerable<Guid> ids)
        {
            var success = await _service.BulkDeleteAsync(ids);
            if (!success)
                return NotFound();

            return NoContent();
        }

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
