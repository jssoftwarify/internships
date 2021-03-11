using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using InternshipWebApp.Models;
using InternshipWebApp.Services.ImprovementService;
using Microsoft.AspNetCore.Authorization;

namespace InternshipWebApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class ImprovementController : ControllerBase
    {
        private IImprovementManager _improvementManager;
        public ImprovementController(IImprovementManager improvementManager)
        {
            _improvementManager = improvementManager;
        }
        [HttpGet]
        public async Task<IEnumerable<Improvement>> Get(string search = null, string sort = null)
        {
            return await _improvementManager.ListAllElements(search, sort);
        }
        [HttpGet("{id}")]
        public async Task<Improvement> Get(int id)
        {
            return await _improvementManager.Read(id);
        }
        [HttpPost]
        public async Task Post([FromBody] Improvement value)
        {
            await _improvementManager.Create(value);
        }
        [HttpPut("{id}")]
        [Authorize(Policy = "Administrator")]
        public async Task<Improvement> Put(int id, [FromBody] Improvement value)
        {
            await _improvementManager.Update(id, value);
            return await _improvementManager.Read(id);
        }
        [HttpDelete("{id}")]
        [Authorize(Policy = "Administrator")]
        public async Task Delete(int id)
        {
            await _improvementManager.Delete(id);
        }
    }
}
