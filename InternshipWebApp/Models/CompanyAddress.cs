using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace InternshipWebApp.Models
{
    public class CompanyAddress
    {
        [Key]
        public int Id { get; set; }
        [Required]
        public string StreetName { get; set; }
        [Required]
        public string HouseNumber { get; set; }
        [Required]
        public string City { get; set; }
        [Required]
        public string PostalCode { get; set; }
        public double Latitude { get; set; }
        public double Longtitude { get; set; }
        [Required]
        public bool Headquarter { get; set; }

        public int? CompanyId { get; set; }
        [ForeignKey("CompanyId")]
        public Company Company { get; set; }

        public int? UserId { get; set; }
        [ForeignKey("UserId")]
        public User User { get; set; }

        public bool FreeForInspection { get; set; }

    }
}
