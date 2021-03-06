using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace InternshipWebApp.Models
{
    public class Record
    {
        [Key]
        public int Id { get; set; }
        [Required]
        public string NumberOfHours { get; set; }
        [Required]
        public string WorkDescription { get; set; }
        [Required]
        [DataType(DataType.Date)]
        [DisplayFormat(DataFormatString = "{yyyy-MM-dd}")]
        public DateTime DateOfRecord { get; set; }
        [Required]
        public int? InternshipId { get; set; }
        [ForeignKey("InternshipId")]
        public Internship Internship {get;set;}

    }
}
