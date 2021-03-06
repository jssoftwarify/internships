using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using InternshipWebApp.Models;
using InternshipWebApp.Services.InspectionService;

namespace InternshipWebApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
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
        public async Task Post([FromBody] Inspection value)
        {
            await _inspectionManager.Create(value);
        }
        [HttpPut("{id}")]
        public async Task<Inspection> Put(int id, [FromBody] Inspection value)
        {
            await _inspectionManager.Update(id, value);
            return await _inspectionManager.Read(id);
        }
        [HttpDelete("{id}")]
        public async void Delete(int id)
        {
            await _inspectionManager.Delete(id);
        }
    }
}
