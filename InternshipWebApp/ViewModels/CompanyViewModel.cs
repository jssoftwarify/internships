using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace InternshipWebApp.ViewModels
{
    public class CompanyViewModel
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int CompanyIdentificationNumber { get; set; }
        public string Contact { get; set; }
        public string CompanyAddressId { get; set; }
    }
}
