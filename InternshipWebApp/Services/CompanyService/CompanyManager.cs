using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using InternshipWebApp.Data;
using InternshipWebApp.Models;
using InternshipWebApp.Helpers;

namespace InternshipWebApp.Services.CompanyService
{
    public class CompanyManager : ICompanyManager
    {
        private ApplicationDbContext _context;
        public CompanyManager(ApplicationDbContext context)
        {
            _context = context;
        }
        public async Task<ICollection<Company>> ListAllElements(string search = null, string sort = null)
        {
            IQueryable<Company> companies = _context.Companies.Include(x => x.Addresses);

            if (!String.IsNullOrEmpty(search))
            {
                companies = companies.Where(x => x.Name.Contains(search) || x.CompanyIdentificationNumber.ToString().Contains(search));
            }
            companies = sort switch
            {
                "name_desc" => companies.OrderByDescending(x => x.Name),
                "name_asc" => companies.OrderBy(x => x.Name),
                _ => companies.OrderBy(x => x.Id),
            };
            return await companies.ToListAsync();
       

        }
        public async Task<Company> Create(int CompanyIdentificationNumber)
        {
            AresCompanyHelpers company = new AresCompanyHelpers(CompanyIdentificationNumber);
            Company newCompany = new Company
            {
                Name = company.CompanyName,
                CompanyIdentificationNumber = company.ICO,

            };
            _context.Companies.Add(newCompany);
            await _context.SaveChangesAsync();
            return newCompany;
        }
        public async Task<Company> Delete(int id)
        {
            Company company = _context.Companies.Find(id);
            if (company != null)
            {
                _context.Companies.Remove(company);
                await _context.SaveChangesAsync();
            }
            return company;
        }
        public async Task<Company> Update(int id, Company input)
        {
            Company company = _context.Companies.Find(id);
            if (company != null)
            {
                company.Name = input.Name;
                company.CompanyIdentificationNumber = input.CompanyIdentificationNumber;
                await _context.SaveChangesAsync();
                return company;
            }
            else
            {
                return null;
            }
        }
        public Company Read(int id)
        {
            foreach(Company i in _context.Companies)
            {
                if(id == i.CompanyIdentificationNumber)
                {
                    return i;
                }
            }
            return null;
        }
        public bool Exists(int id)
        {
            return _context.Companies.Any(a => a.Id == id);
        }
        public async void Asign(int companyAddressId, int companyId)
        {
            foreach (CompanyAddress i in _context.CompaniesAddresses.Where(x => x.Id == companyAddressId).ToList())
            {
                i.CompanyId = companyId;
                await _context.SaveChangesAsync();
            }
        }
    }
}
