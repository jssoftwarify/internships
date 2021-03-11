using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using InternshipWebApp.Data;
using InternshipWebApp.Models;
using InternshipWebApp.Services.ClassroomService;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace InternshipWebApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class ClassroomController : ControllerBase
    {
        private ApplicationDbContext _context;
        private IClassroomManager _classroomManager;
        private readonly IAuthorizationService _authorizationService;
        public ClassroomController(IClassroomManager classroomManager, ApplicationDbContext context, IAuthorizationService authorizationService)
        {
            _classroomManager = classroomManager;
            _context = context;
            _authorizationService = authorizationService;
        }
        [HttpGet]
        public async Task<IEnumerable<Classroom>> Get(string search=null, string sort=null)
        {
            return await _classroomManager.ListAllElements(search, sort);
        }
        [HttpGet("{id}")]
        public async Task<Classroom> Get(int id)
        {
            return await _classroomManager.Read(id);
        }
        [HttpPost]
        [Authorize(Policy ="Administrator")]
        public async Task Post([FromBody] Classroom value)
        {
            await _classroomManager.Create(value);
        }
        [HttpPut("{id}")]
        [Authorize(Policy = "Administrator")]
        public async Task<Classroom> Put(int id, [FromBody] Classroom value)
        {
            await _classroomManager.Update(id, value);
            return await _classroomManager.Read(id);
        }
        [HttpDelete("{id}")]
        [Authorize(Policy = "Administrator")]
        public async Task Delete(int id)
        {
            await _classroomManager.Delete(id);
        }
    }
}
