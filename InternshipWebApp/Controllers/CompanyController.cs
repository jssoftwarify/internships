using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using InternshipWebApp.Models;
using InternshipWebApp.Services.CompanyService;
using Microsoft.AspNetCore.Authorization;

namespace InternshipWebApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class CompanyController : ControllerBase
    {
        private ICompanyManager _companyManager;
        public CompanyController(ICompanyManager companyManager)
        {
            _companyManager = companyManager;
        }
        [HttpGet]
        public async Task<IEnumerable<Company>> Get(string search = null, string sort = null)
        {
            return await _companyManager.ListAllElements(search, sort);
        }
        [HttpGet("{id}")]
        public Company Get(int id)
        {
            return _companyManager.Read(id);
        }
        [HttpPost("{value}")]
        public async Task Post( int value)
        {
            if(_companyManager.Read(value) == null)
            {
                await _companyManager.Create(value);
            }
        }
        [HttpPut("{id}")]
        public async void Put(int id, [FromBody] Company value)
        {
            await _companyManager.Update(id, value);
        }
        [HttpDelete("{id}")]
        [Authorize(Policy = "Administrator")]
        public async Task Delete(int id)
        {
            await _companyManager.Delete(id);
        }
    }
}
