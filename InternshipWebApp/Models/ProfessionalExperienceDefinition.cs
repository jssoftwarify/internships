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
    public class ProfessionalExperienceDefinition
    {
        [Key]
        public int Id { get; set; }
        [Required]
        public string Name { get; set; }
        [Required]
        [DataType(DataType.Date)]
        [DisplayFormat(DataFormatString = "{yyyy-MM-dd}")]
        public DateTime Start { get; set; }
        [Required]
        [DataType(DataType.Date)]
        [DisplayFormat(DataFormatString = "{yyyy-MM-dd}")]
        public DateTime End { get; set; }
        [Required]
        public int Year { get; set; }
        [Required]
        public int NumberOfDays { get; set; }
        [Required]
        public int NumberOfHours { get; set; }
        [Required]
        public bool Active { get; set; }
        [Required]
        public bool Longtime { get; set; }

        [Required]
        public string DefinitionRepresentative { get; set; }
        [Required]
        public string DefinitionRepresentativeEmail { get; set; }
        [Required]
        public string DefinitionRepresentativeTelephoneNumber { get; set; }
        public ICollection<ClassroomDefinition> ClassroomDefinitions { get;set; }
       
    }
}
