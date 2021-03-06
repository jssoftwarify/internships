using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.InteropServices;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using InternshipWebApp.Models;
using InternshipWebApp.Services.SpecializationService;

namespace InternshipWebApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SpecializationController : ControllerBase
    {
        private ISpecializationManager _specializationManager;
        public SpecializationController(ISpecializationManager specializationManager)
        {
            _specializationManager = specializationManager;
        }
        // GET: api/Specialization
        [HttpGet]
        public async Task<IEnumerable<Specialization>> Get(string search = null, string sort = null)
        {
            return await _specializationManager.ListAllElements(search, sort);
        }
        [HttpGet("{id}")]
        public async Task<Specialization> Get(int id)
        {
            return await _specializationManager.Read(id);
        }
        [HttpPost]
        public async Task Post([FromBody] Specialization value)
        {
            await _specializationManager.Create(value);
        }
        [HttpPut("{id}")]
        public async Task<Specialization> Put(int id, [FromBody] Specialization value)
        {
            await _specializationManager.Update(id, value);
            return await _specializationManager.Read(id);
        }
        [HttpDelete("{id}")]
        public async Task Delete(int id)
        {
            await _specializationManager.Delete(id);
        }
    }
}
