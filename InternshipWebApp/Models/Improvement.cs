using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace InternshipWebApp.Models
{
    public class Improvement
    {
        [Key]
        public int Id { get; set; }
        [Required]
        public string Head { get; set; }
        [Required]
        public string Body { get; set; }
        [Required]
        public string Status { get; set; }
    }
}
