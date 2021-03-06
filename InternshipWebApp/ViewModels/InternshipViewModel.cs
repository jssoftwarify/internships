using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using InternshipWebApp.Models;

namespace InternshipWebApp.ViewModels
{
    public class InternshipViewModel
    {
        public int Id { get; set; }
        public string CompanyRepresentative { get; set; }
        public string CompaniesRepresentativeEmail { get; set; }
        public string CompaniesRepresentativeTelephoneNumber { get; set; }
        public string CompanyContactPerson { get; set; }
        public string CompaniesContactPersonEmail { get; set; }
        public string CompaniesContacPersonTelephoneNumber { get; set; }
        public string JobDescription { get; set; }
        public string AdditionalInformations { get; set; }
        public DateTime LastControlDate { get; set; }
        public Company Company { get; set; }
        public CompanyAddress CompanyAddress { get; set; }
        public User User { get; set; }
        public User Supervisor { get; set; }
        public ProfessionalExperienceDefinition ProfessionalExperienceDefinition { get; set; }

    }
}
