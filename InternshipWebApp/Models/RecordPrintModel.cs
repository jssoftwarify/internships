using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace InternshipWebApp.Models
{
    public class RecordPrintModel
    {
        public List<RecordModel> RecordList { get; set; }
        public string StudentName { get; set; }
        public string Classroom { get; set; }
        public string CompanyAddress { get; set; }
        public string CompanyRepresentative { get; set; }
        public string CompanyRepresentativeEmail { get; set; }
        public string CompanyRepresentativeTelephone { get; set; }
        public string Company { get; set; }
    }
    public class RecordModel
    {
        public string Date { get; set; }
        public string Description { get; set; }
        public string NumberOfHours { get; set; }
    }
}
