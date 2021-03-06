using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace InternshipWebApp.ViewModels
{
    public class CompanyAddressViewModel
    {
        public int Id { get; set; }
        public string StreetName { get; set; }
        public string HouseNumber { get; set; }
        public string City { get; set; }
        public string PostalCode { get; set; }
        public double Latitude { get; set; }
        public double Longtitude { get; set; }
        public string Company { get; set; }
        public bool Headquarter { get; set; }
    }
}
