using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using InternshipWebApp.Data;
using InternshipWebApp.Models;

namespace InternshipWebApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    
    public class UsersController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<UsersController> _logger;
        private readonly IAuthorizationService _authorizationService;
        private int iconSize = 64;

        public UsersController(ApplicationDbContext context, ILogger<UsersController> logger, IAuthorizationService authorizationService)
        {
            _context = context;
            _logger = logger;
            _authorizationService = authorizationService;
        }
        [HttpGet]
      
        public async Task<ActionResult<IEnumerable<User>>> GetUsers(string search = null, string sort = null)
        {
            IQueryable<User> users = _context.Users.Include(x=>x.Classroom).Include(x=>x.Specialization)/*.Include(x=>x.Address)*/;
            if (!String.IsNullOrEmpty(search))
            {
                users = users.Where(u => (u.FirstName.Contains(search) || u.LastName.Contains(search) || u.Email.Contains(search) || u.TelephoneNumber.Contains(search) || u.Specialization.Name.Contains(search) || u.Classroom.Name.Contains(search)));
            }
           
            users = sort switch
            {
                "firstname_desc" => users.OrderByDescending(x => x.FirstName),
                "firstname_asc" => users.OrderBy(x => x.FirstName),
                "lastname_desc" => users.OrderByDescending(x => x.LastName),
                "lastname_asc" => users.OrderBy(x => x.LastName),
                "email_desc" => users.OrderByDescending(x => x.Email),
                "email_asc" => users.OrderBy(x => x.Email),
                "phoneNumber_desc" => users.OrderByDescending(x => x.TelephoneNumber),
                "phoneNumber_asc" => users.OrderBy(x => x.TelephoneNumber),
                "specialization_desc" => users.OrderByDescending(x => x.Specialization.Name),
                "specialization_asc" => users.OrderBy(x => x.Specialization.Name),
                "classroom_desc" => users.OrderByDescending(x => x.Classroom.Name),
                "classroom_asc" => users.OrderBy(x => x.Classroom.Name),
                _ => users.OrderBy(u => u.Id),
            };
            
            return Ok(new { data = users });
        }
        [HttpGet("{id}")]
        [Authorize]
        public async Task<ActionResult<User>> GetUser(int id)
        {

            var user = await _context.Users.Include(x => x.Classroom).Include(x
                => x.Specialization).Include(x => x.Address).Where(x => x.Id == id).FirstOrDefaultAsync();
            if(user == null)
            {

                _logger.LogError("user not found", id);
                return NotFound();
            }
            user = new User { Id = user.Id, FirstName = user.FirstName, LastName = user.LastName,Email = user.Email, MiddleName = user.MiddleName, ClassroomId = user.ClassroomId,Classroom = user.Classroom, SpecializationId = user.SpecializationId, Specialization = user.Specialization, Controller = user.Controller, TelephoneNumber = user.TelephoneNumber, AddressId = user.AddressId, Address = user.Address, BirthDate = user.BirthDate };
            return user;
        }
        [HttpPost]
        [Authorize]
        public async Task<ActionResult<User>> PostUser([FromBody] User user)
        {
            foreach(var i in _context.Users)
            {
                if(i.Email == user.Email)
                {
                    var existingUser = await _context.Users.FindAsync(user.Id);
                    _logger.LogInformation("existing user used", user);
                    return Ok(existingUser);
                }
                
            }

            try
            {
                _context.Users.Add(user);
                await _context.SaveChangesAsync();
                _logger.LogInformation("new user created", user);
                return CreatedAtAction("GetUser", new { id = user.Id }, user);
            }
            catch (Exception ex)
            {
                _logger.LogError("storing of new user has failed", ex, user);
                throw ex;
            }

        }
        [HttpPut("{id}")]
        [Authorize]
        public async Task<IActionResult> PutUser(int id, User newUser)
        {
          
            var user = await _context.Users.FindAsync(id);
            if (user == null)
            {
                _logger.LogError("user not found", id);
                return NotFound();
            }

            _context.Entry(user).State = EntityState.Modified;

            try
            {
                user.FirstName = newUser.FirstName;
                user.MiddleName = newUser.MiddleName;
                user.LastName = newUser.LastName;
                user.TelephoneNumber = newUser.TelephoneNumber;
                user.Address = newUser.Address;
                user.BirthDate = newUser.BirthDate;

                user.ClassroomId = newUser.ClassroomId;
                user.SpecializationId = newUser.SpecializationId;
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!UserExists(id))
                {
                    return NotFound();
                }
                else
                {
                    _logger.LogError("storing of updated user has failed", user);
                    throw;
                }
            }
            catch (Exception ex)
            {
                _logger.LogError("storing of updated user has failed", ex, user);
                throw;
            }
            _logger.LogInformation("new user data stored", user);
            return NoContent();
        }

        // DELETE: api/ApiWithActions/5
        [HttpDelete("{id}")]
        [Authorize(Policy = "Administrator")]
        public async Task<ActionResult<User>> DeleteUser(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
            {
                _logger.LogError("user not found, so cannot be deleted", id);
                return NotFound();
            }
            try
            {
                _context.Users.Remove(user);
                _logger.LogInformation("user deleted", user);
                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError("deleting of user has failed", ex, user);
                throw ex;
            }

            return user;
        }

        [Authorize]
        private bool UserExists(int id)
        {
            return _context.Users.Any(e => e.Id == id);
        }

        [HttpPost("setTelephone/{id}/{value}")]
        [Authorize]
        public async Task<IActionResult> setTelephone( int id, string value)
        {
            var user = _context.Users.Find(id);
            if (user == null)
            {
                return BadRequest();
            }
            user.TelephoneNumber = value;
            await _context.SaveChangesAsync();
            return Ok(new { user=user});

        }
        
        [HttpPost("setBirthDate/{id}/{value}")]
        [Authorize]
        public async Task<IActionResult> setBirthDate(int id, DateTime value)
        {
            var user = _context.Users.Find(id);
            if (user == null)
            {
                return BadRequest();
            }
            user.BirthDate = value;
            await _context.SaveChangesAsync();
            return Ok(new { user = user });

        }
        [HttpPost("setUserAddress/{id}")]
        [Authorize]
        public async Task<IActionResult> setUserAddress(int id, [FromBody] UserAddress value)
        {
            var user = _context.Users.Find(id);
            if (user == null)
            {
                return BadRequest("Uživatel nebyl nalezen!");
            }
            
            _context.UserAddresses.Add(value);
            await _context.SaveChangesAsync();
            var address = _context.UserAddresses.Find(value.Id);
            if(address == null)
            {
                return BadRequest("Adresa nebyl nalezena! " + value.Id );
            }
            user.AddressId = address.Id;
            await _context.SaveChangesAsync();
            
            return Ok(new { user = user });

        }
    }
}
