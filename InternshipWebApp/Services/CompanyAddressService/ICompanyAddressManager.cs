using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using InternshipWebApp.Models;

namespace InternshipWebApp.Services.CompanyAddressService
{
    public interface ICompanyAddressManager
    {
        Task<ICollection<CompanyAddress>> ListAllElements(string search = null, string sort = null);
        Task<CompanyAddress> Create(CompanyAddress input);
        Task<CompanyAddress> Delete(int id);
        Task<CompanyAddress> Update(int id, CompanyAddress input);
        Task<CompanyAddress> Read(int id);
    }
}
