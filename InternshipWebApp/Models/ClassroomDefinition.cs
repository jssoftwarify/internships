using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace InternshipWebApp.Models
{
    public class ClassroomDefinition
    {
        [Key]
        public int ClassroomId { get; set; }
        [Key]
        public int DefinitionId { get; set; }
        [ForeignKey("ClassroomId")]
        [JsonIgnore]
        public Classroom Classroom { get; set; }
       
        [ForeignKey("DefinitionId")]
        [JsonIgnore]
        public ProfessionalExperienceDefinition Definition { get; set; }
    }
}
