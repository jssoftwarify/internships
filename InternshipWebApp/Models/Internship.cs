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
    public class Internship
    {
        [Key]
        public int Id { get; set; }
        [Required]
        public string CompanyRepresentative { get; set; }
        [Required]
        public string CompaniesRepresentativeEmail { get; set; }
        [Required]
        public string CompaniesRepresentativeTelephoneNumber { get; set; }
        [Required]
        public string CompanyContactPerson { get; set; }
        [Required]
        public string CompaniesContactPersonEmail { get; set; }
        [Required]
        public string CompaniesContacPersonTelephoneNumber { get; set; }
        [Required]
        public string JobDescription { get; set; }
        public string AdditionalInformations { get; set; }
        [Required]
        public bool Aktivni { get; set; }
        public int? CompanyId { get; set; }
        [ForeignKey("CompanyId")]
        public Company Company { get; set; }
        public int? CompanyAddressId { get; set; }
        [ForeignKey("CompanyAddressId")]
        public CompanyAddress CompanyAddress { get; set; }
        public int? ProfessionalExperienceDefinitionId { get; set; }
        [ForeignKey("ProfessionalExperienceDefinitionId")]
        public ProfessionalExperienceDefinition ProfessionalExperienceDefinition { get; set; }
        public ICollection<Record> Records { get; set; }
        public int? UserId { get; set; }
        [ForeignKey("UserId")]
        public User User { get; set; }
        public Inspection Inspection { get; set; }
    }
}
