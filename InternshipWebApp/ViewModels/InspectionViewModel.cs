using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using InternshipWebApp.Models;

namespace InternshipWebApp.ViewModels
{
    public class InspectionViewModel
    {
        public int Id { get; set; }
        public DateTime InspectionDate { get; set; }
        public Inspectionrating InspectionRating { get; set; }
        public string AdditionalInformations { get; set; }
        public int InternshipId { get; set; }
    }
}
