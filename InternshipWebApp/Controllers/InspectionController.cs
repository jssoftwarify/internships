using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using InternshipWebApp.Models;
using InternshipWebApp.Services.InspectionService;
using Microsoft.AspNetCore.Authorization;

namespace InternshipWebApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class InspectionController : ControllerBase
    {
        private IInspectionManager _inspectionManager;
        public InspectionController(IInspectionManager inspectionManager)
        {
            _inspectionManager = inspectionManager;
        }
        [HttpGet]

        public async Task<IEnumerable<Inspection>> Get()
        {
            return await _inspectionManager.ListAllElements();
        }
        [HttpGet("{id}")]
        public async Task<Inspection> Get(int id)
        {
            return await _inspectionManager.Read(id);
        }
        [HttpPost]
        [Authorize(Policy = "Controller")]
        public async Task Post([FromBody] Inspection value)
        {
            await _inspectionManager.Create(value);
        }
        [HttpPut("{id}")]
        [Authorize(Policy = "Controller")]
        public async Task<Inspection> Put(int id, [FromBody] Inspection value)
        {
            await _inspectionManager.Update(id, value);
            return await _inspectionManager.Read(id);
        }
        [HttpDelete("{id}")]
        [Authorize(Policy = "Controller")]
        public async void Delete(int id)
        {
            await _inspectionManager.Delete(id);
        }
    }
}
