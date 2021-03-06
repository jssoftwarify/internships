using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using InternshipWebApp.Models;

namespace InternshipWebApp.ViewModels
{
    public class UserViewModel
    {
        public int Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public int TelephonNumber { get; set; }
        public Classroom Classroom { get; set; }
        public Internship Internship { get; set; }
        public string RoleName { get; set; }
        public IList<string> Roles { get; set; }
        public IList<System.Security.Claims.Claim> Claims { get; set; }
        public IList<IdentityRole> AllRoles { get; set; }

    }
}
