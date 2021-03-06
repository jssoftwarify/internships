using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using InternshipWebApp.Models;
using InternshipWebApp.Services.CompanyAddressService;

namespace InternshipWebApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CompanyAddressController : ControllerBase
    {
        private ICompanyAddressManager _companyAddressManager;
        public CompanyAddressController(ICompanyAddressManager companyAddressManager)
        {
            _companyAddressManager = companyAddressManager;
        }
        [HttpGet]
        public async Task<IEnumerable<CompanyAddress>> Get(string search = null, string sort = null)
        {
            return await _companyAddressManager.ListAllElements(search, sort);
        }
        [HttpGet("{id}")]
        public async Task<CompanyAddress> Get(int id)
        {
            return await _companyAddressManager.Read(id);
        }
        [HttpPost]
        public async Task Post([FromBody] CompanyAddress value)
        {
            await _companyAddressManager.Create(value);
        }
        [HttpPut("{id}")]
        public async Task<CompanyAddress> Put(int id, [FromBody] CompanyAddress value)
        {
            await _companyAddressManager.Update(id, value);
            return await _companyAddressManager.Read(id);
        }
        [HttpDelete("{id}")]
        public async Task Delete(int id)
        {
            await _companyAddressManager.Delete(id);
        }
    }
}
