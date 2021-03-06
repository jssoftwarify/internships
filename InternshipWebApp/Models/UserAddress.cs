using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace InternshipWebApp.Models
{
    public class UserAddress
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

        [JsonIgnore]
        public User User { get; set; }

    }
}
