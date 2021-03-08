using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using InternshipWebApp.Data;
using InternshipWebApp.Models;
using InternshipWebApp.Services;
using InternshipWebApp.Services.InternshipService;
using InternshipWebApp.Services.RecordService;

namespace InternshipWebApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RecordController : ControllerBase
    {
        private ApplicationDbContext _context;
        private IRecordManager _recordManager;
        private IInternshipManager _internshipManager;
        private RazorViewToStringRenderer _razorViewToStringRenderer;
        public RecordController(IRecordManager recordManager, ApplicationDbContext context,IInternshipManager internshipManager, RazorViewToStringRenderer razorViewToStringRenderer)
        {
            _context = context;
            _recordManager = recordManager;
            _internshipManager = internshipManager;
            _razorViewToStringRenderer = razorViewToStringRenderer;
        }
        [HttpGet]
        public async Task<IEnumerable<Record>> Get()
        {
            return await _recordManager.ListAllElements();
        }
        [HttpGet("{id}")]
        public async Task<Record> Get(int id)
        {
            return await _recordManager.Read(id);
        }
        [HttpPost]
        public async Task Post([FromBody] Record value)
        {
            await _recordManager.Create(value);
        }
        [HttpPut("{id}")]
        public async Task<Record> Put(int id, [FromBody] Record value)
        {
            await _recordManager.Update(id, value);
            return await _recordManager.Read(id);
        }
        [HttpDelete("{id}")]
        public async Task Delete(int id)
        {
            await _recordManager.Delete(id);
        }

        [HttpGet("print/{userId}/{internshipId}")]
        public async Task<ActionResult> DownloadContract(int userId, int internshipId)
        {
            User user = _context.Users.Include(x => x.Address).Include(x => x.Classroom).Where(x => x.Id == userId).FirstOrDefaultAsync().Result;
            if (user == null)
            {
                return BadRequest("Uživatel nenalezen!");
            }
            Internship internship = _internshipManager.Read(internshipId).Result;

            if (internship == null)
            {
                return BadRequest("Praxe nenalezena!");
            }
            string formatedAddressInternship = internship.CompanyAddress.StreetName + " " + internship.CompanyAddress.HouseNumber + ", " + internship.CompanyAddress.PostalCode + " " + internship.CompanyAddress.City;
            var dbRecords = _context.Records.Where(x => x.InternshipId == internshipId);

            List < RecordModel > records = new List<RecordModel>();

            foreach(var i in dbRecords)
            {
                records.Add(new RecordModel { Date = i.DateOfRecord.ToString("dd.MM.yyy"), Description = i.WorkDescription, NumberOfHours = i.NumberOfHours });
            }

            string documentBody = await _razorViewToStringRenderer.RenderViewToStringAsync("/Prints/Records.cshtml", new RecordPrintModel
            {
                RecordList = records,
                StudentName = user.FirstName + " " +user.LastName,
                Classroom = user.Classroom.Name,
                CompanyAddress = formatedAddressInternship,
                CompanyRepresentative = internship.CompanyRepresentative,
                CompanyRepresentativeEmail = internship.CompaniesRepresentativeEmail,
                CompanyRepresentativeTelephone = internship.CompaniesRepresentativeTelephoneNumber,
                Company = internship.Company.Name
            });

            MemoryStream memory = new MemoryStream(Encoding.UTF8.GetBytes(documentBody));
            return File(memory, "text/html", "random.html");
        }
    }
}
