using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace InternshipWebApp.Models
{
    public class Company
    {
        [Key]
        public int Id { get; set; }
        [Required]
        public string Name { get; set; }
        [Required]
        public int CompanyIdentificationNumber { get; set; }
        [JsonIgnore]
        public ICollection<CompanyAddress> Addresses { get; set; }
    }
}
