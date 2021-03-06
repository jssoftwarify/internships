using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace InternshipWebApp.ViewModels
{
    public class ProfessionalExperienceDefinitionViewModel
    {
        public int Id { get; set; }
        public string Classroom { get; set; }
        public DateTime Start { get; set; }
        public DateTime End { get; set; }
        public int Year { get; set; }
        public int NumberOfDays { get; set; }
        public int NumberOfHours { get; set; }
        public bool Active { get; set; }
    }
}
