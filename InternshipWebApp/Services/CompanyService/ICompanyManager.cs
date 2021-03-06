using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using InternshipWebApp.Models;

namespace InternshipWebApp.Services.CompanyService
{
    public interface ICompanyManager
    {
        Task<ICollection<Company>> ListAllElements(string search = null, string sort = null);
        Task<Company> Create(int CompanyIdentificationNumber);
        Task<Company> Delete(int id);
        Task<Company> Update(int id, Company input);
        Company Read(int id);
        void Asign(int companyAddressId, int companyId);
    }
}
