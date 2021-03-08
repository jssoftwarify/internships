using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using InternshipWebApp.Data;
using InternshipWebApp.Models;
using InternshipWebApp.Services.ProfessionalExperienceDefinitionService;

namespace InternshipWebApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProfessionalExperienceDefinitionController : ControllerBase
    {
        private IProfessionalExperienceDefinitionManager _professionalExperienceDefinitionManager;
        private ApplicationDbContext _context;

        public ProfessionalExperienceDefinitionController(IProfessionalExperienceDefinitionManager professionalExperienceDefinitionManager, ApplicationDbContext context)
        {
            _professionalExperienceDefinitionManager = professionalExperienceDefinitionManager;
            _context = context;
        }
        [HttpGet]
        public async Task<IEnumerable<ProfessionalExperienceDefinition>> Get(string search = null, string sort = null)
        {
            return await _professionalExperienceDefinitionManager.ListAllElements(search, sort);
        }
        [HttpGet("{id}")]
        public Task<ProfessionalExperienceDefinition> Get(int id)
        {
            return _professionalExperienceDefinitionManager.Read(id);
        }
        [HttpPost]
        public async Task Post([FromBody] DefinitionViewModel value)
        {
            await _professionalExperienceDefinitionManager.Create(value);   
        }
        [HttpPost("setState/{id}")]
        public async Task<ProfessionalExperienceDefinition> setState([FromRoute] int id)
        {
            return await _professionalExperienceDefinitionManager.setState(Convert.ToInt32(id));
        }
        [HttpPut("{id}")]
        public async Task<ProfessionalExperienceDefinition> Put(int id, [FromBody] DefinitionViewModel value)
        {
            await _professionalExperienceDefinitionManager.Update(id, value);
            return await _professionalExperienceDefinitionManager.Read(id);
        }
        [HttpDelete("{id}")]
        public async Task Delete(int id)
        {
            await _professionalExperienceDefinitionManager.Delete(id);
        }

        [HttpGet("getClassrooms/{id}")]
        public List<ClassroomDefinition> GetClassrooms(int id)
        {
            var list = new List<ClassroomDefinition>();
            foreach(var i in _context.ClassroomDefinitions)
            {
                if(i.DefinitionId == id)
                {
                    list.Add(i);
                }
            }
            return list;
        }
    }
    public class DefinitionViewModel
    {
        public string Name { get; set; }
       
        public DateTime Start { get; set; }

        public DateTime End { get; set; }
        public int Year { get; set; }
        public int NumberOfDays { get; set; }
        public int NumberOfHours { get; set; }
        public bool Active { get; set; }
        public bool Longtime { get; set; }
        public string DefinitionRepresentative { get; set; }
        public string DefinitionRepresentativeEmail { get; set; }
        public string DefinitionRepresentativeTelephoneNumber { get; set; }

        public ICollection<int> ClassroomIds { get; set; }
    }
}
