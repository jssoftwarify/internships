using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace InternshipWebApp.Models
{
    public class User
    {
        [Key]
        public int Id { get; set; }
        [Required]
        public string FirstName { get; set; }
        public string MiddleName { get; set; }
        [Required]
        public string LastName { get; set; }
        [Required]
        public string Email { get; set; }
        public bool Controller { get; set; }
        public string TelephoneNumber { get; set;  }
        public int? ClassroomId { get; set; }
        [ForeignKey("ClassroomId")]
        public Classroom Classroom { get; set; }
        public int? SpecializationId { get; set; }
        [ForeignKey("SpecializationId")]
        public Specialization Specialization { get; set; }
        public int? AddressId { get; set; }
        [ForeignKey("AddressId")]
        public  UserAddress Address { get; set; }
        public DateTime BirthDate { get; set; }   
        public ICollection<Internship> Internships { get; set; } 
        public ICollection<CompanyAddress> Addresses { get; set; }

    }
}
