using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json.Linq;
using InternshipWebApp.Data;
using InternshipWebApp.Models;
using InternshipWebApp.Services;
using InternshipWebApp.Services.InternshipService;

namespace InternshipWebApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class InternshipController : ControllerBase
    {
        private IInternshipManager _internshipManager;
        private ApplicationDbContext _context;
        private RazorViewToStringRenderer _razorViewToStringRenderer;
        public InternshipController(IInternshipManager internshipManager, ApplicationDbContext context, RazorViewToStringRenderer razorViewToStringRenderer)
        {
            _internshipManager = internshipManager;
            _context = context;
            _razorViewToStringRenderer = razorViewToStringRenderer;
        }
        [HttpGet]
        public async Task<IEnumerable<Internship>> Get(string search = null, string sort = null)
        {
            return await _internshipManager.ListAllElements(search, sort);
        }
        [HttpGet("{id}")]
        public async Task<Internship> Get(int id)
        {
            return await _internshipManager.Read(id);
        }
        [Route("createInternship/{id}"), HttpPost("{id}")]

        public async Task Post([FromBody] Internship value, int id)
        {
            bool temp = true;
            foreach(var i in _context.Internships)
            {
                if(i == value)
                {
                    temp = false;
                }
            }
            if (temp)
            {
                await _internshipManager.Create(value, id);
            }
            
        }

        [Route("setState/{id}"), HttpPost("{id}")]
        public async Task<Internship> setState([FromRoute] int id)
        {
            return await _internshipManager.setState(Convert.ToInt32(id));
        }

        [HttpPut("{id}")]
        public async Task<Internship> Put(int id, [FromBody] Internship value)
        {
            await _internshipManager.Update(id, value);
            return await _internshipManager.Read(id);
        }
        [HttpDelete("{id}")]
        public async Task Delete(int id)
        {
            await _internshipManager.Delete(id);
        }

        [HttpGet("contract")]

        public async Task<ActionResult> DownloadContract(int userId, int internshipId)
        {
            User user = _context.Users.Include(x => x.Address).Include(x=> x.Classroom).Where(x => x.Id == userId).FirstOrDefaultAsync().Result;
            if(user == null)
            {
                return BadRequest("Uživatel nenalezen!");
            }
            Internship internship = _internshipManager.Read(internshipId).Result;
            
            if(internship == null)
            {
                return BadRequest("Praxe nenalezena!");
            }
            string formatedAddressInternship = internship.CompanyAddress.StreetName + " " + internship.CompanyAddress.HouseNumber + ", " + internship.CompanyAddress.PostalCode + " " + internship.CompanyAddress.City;
            string formatedAddressStudent = user.Address.StreetName + " " + user.Address.HouseNumber + ", " + user.Address.PostalCode + " " + user.Address.City;
            string definice = "";
            if (internship.ProfessionalExperienceDefinition.Longtime)
            {
                definice = "Odborná praxe je průběžná - 1 den v týdnu, s denní pracovní dobou 8 hodin, její začátek je stanoven na 21.09.2020.";
            }
            else
            {
                definice = "Odborná praxe je souvislá - 10 denní, s denní pracovní dobou 8 hodin, její začátek je stanoven na 20.05.2019.";
            }

            string documentBody = await _razorViewToStringRenderer.RenderViewToStringAsync("/Prints/Contract.cshtml", new Contract
            {
                CompanyName = internship.Company.Name,
                CompanyAddress = formatedAddressInternship,
                CompanyContact = internship.CompanyContactPerson,
                CompanyContactTelephoneNumber = internship.CompaniesContacPersonTelephoneNumber,
                CompanyContactEmail = internship.CompaniesContactPersonEmail,
                StudentFirstName = user.FirstName,
                StudentLastName = user.LastName,
                Classroom = user.Classroom.Name,
                StudentAddress = formatedAddressStudent,
                StudentBirthDate = user.BirthDate.ToString("dd.MM.yyy"),
                StudentTelephone = user.TelephoneNumber,
                CompanyRepresentative = internship.CompanyRepresentative,
                CompanyRepresentativeTelephone = internship.CompaniesContacPersonTelephoneNumber,
                CompanyRepresentativeEmail = internship.CompaniesRepresentativeEmail,
                InternshipAddress = formatedAddressInternship,
                InternshipDetail = internship.JobDescription,
                DefinitionDetail = definice,
                DefinitionRpresentative = internship.ProfessionalExperienceDefinition.DefinitionRepresentative,
                DefinitionRepresentativeEmail = internship.ProfessionalExperienceDefinition.DefinitionRepresentativeEmail,
                DefinitionRepresentativeTelephoneNumber = internship.ProfessionalExperienceDefinition.DefinitionRepresentativeTelephoneNumber,
            });
            MemoryStream memory = new MemoryStream(Encoding.UTF8.GetBytes(documentBody));
            return File(memory, "text/html", "random.html");
        }

        
        public class listModel
        {
            public ICollection<int> Ids { get; set; }
        }
        [HttpPost("byDefinition")]
        public async Task<IEnumerable<Internship>> ByDefinition([FromBody] listModel ids)
        {
            return await _internshipManager.ListAllElementsByDefinition(ids.Ids);
        }
    }
}
