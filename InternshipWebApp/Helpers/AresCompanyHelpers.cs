using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace InternshipWebApp.Helpers
{
    public class AresCompanyHelpers
    {
        private XmlHelper xml = new XmlHelper();

        public string CompanyName;
        public int ICO;
        public string StreetName;
        public string HouseNumber;
        public string TownName;
        public int PSC;
        public AresCompanyHelpers(int ico)
        {
            string url = "http://wwwinfo.mfcr.cz/cgi-bin/ares/darv_std.cgi?ico=" + ico;
            string str = xml.XmlURLToString(url);

            CompanyName = xml.GetValueOfAttribute("Obchodni_firma", str);
            ICO = ico;
            StreetName = xml.GetValueOfAttribute("Nazev_ulice", str);
            HouseNumber = xml.GetValueOfAttribute("Cislo_domovni", str);
            TownName = xml.GetValueOfAttribute("Nazev_obce", str);
            PSC = xml.GetIntOfAttribute("PSC", str);
        }
    }
}
