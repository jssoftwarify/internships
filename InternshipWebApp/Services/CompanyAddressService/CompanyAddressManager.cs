using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using InternshipWebApp.Data;
using InternshipWebApp.Models;

namespace InternshipWebApp.Services.CompanyAddressService
{
    public class CompanyAddressManager : ICompanyAddressManager
    {
        private ApplicationDbContext _context;
        public CompanyAddressManager(ApplicationDbContext context)
        {
            _context = context;
        }
        public async Task<ICollection<CompanyAddress>> ListAllElements(string search = null, string sort = null)
        {
            IQueryable<CompanyAddress> addresses = _context.CompaniesAddresses.Include(x => x.Company);

            if (!String.IsNullOrEmpty(search))
            {
                addresses = addresses.Where(x => x.StreetName.Contains(search) || x.HouseNumber.Contains(search) || x.City.Contains(search) || x.PostalCode.Contains(search) ||  x.Company.Name.Contains(search));
            }
            addresses = sort switch
            {
                "streetNumber_desc" => addresses.OrderByDescending(x => x.StreetName),
                "streetNumber_asc" => addresses.OrderBy(x => x.StreetName),
                "houseNumber_desc" => addresses.OrderByDescending(x => x.HouseNumber),
                "houseNumber_asc" => addresses.OrderBy(x => x.HouseNumber),
                "city_desc" => addresses.OrderByDescending(x => x.City),
                "city_asc" => addresses.OrderBy(x => x.City),
                "pc_desc" => addresses.OrderByDescending(x => x.PostalCode),
                "pc_asc" => addresses.OrderBy(x => x.PostalCode),
                "company_desc" => addresses.OrderByDescending(x => x.Company.Name),
                "company_asc" => addresses.OrderBy(x => x.Company.Name),
                _ => addresses.OrderBy(x => x.Id),
            };
            return await addresses.ToListAsync();
        }
        public async Task<CompanyAddress> Create(CompanyAddress input)
        {
            CompanyAddress newCompanyAddress = new CompanyAddress
            {
                StreetName = input.StreetName,
                HouseNumber = input.HouseNumber,
                City = input.City,
                PostalCode = input.PostalCode,
                Latitude = input.Latitude,
                Longtitude = input.Longtitude,
                Headquarter = input.Headquarter,
                CompanyId = input.CompanyId,
                UserId = input.UserId,
                FreeForInspection =true
            };
            _context.CompaniesAddresses.Add(newCompanyAddress);
            await _context.SaveChangesAsync();
            return newCompanyAddress;
        }
        public async Task<CompanyAddress> Delete(int id)
        {
            CompanyAddress companyAddress = _context.CompaniesAddresses.Find(id);
            if(companyAddress != null)
            {
                _context.CompaniesAddresses.Remove(companyAddress);
                await _context.SaveChangesAsync();
            }
            return companyAddress;
        }
        public async Task<CompanyAddress> Update(int id, CompanyAddress input)
        {
            CompanyAddress companyAddress = _context.CompaniesAddresses.Find(id);
            if(companyAddress != null)
            {
                companyAddress.StreetName = input.StreetName;
                companyAddress.HouseNumber = input.HouseNumber;
                companyAddress.City = input.City;
                companyAddress.PostalCode = input.PostalCode;
                companyAddress.Latitude = input.Latitude;
                companyAddress.Longtitude = input.Longtitude;
                companyAddress.Headquarter = input.Headquarter;
                companyAddress.CompanyId = input.CompanyId;
                companyAddress.UserId = input.UserId;
                companyAddress.FreeForInspection = input.FreeForInspection;
                await _context.SaveChangesAsync();
                return companyAddress;
            }
            else
            {
                return null;
            }
        }
        public async Task<CompanyAddress> Read(int id)
        {
            CompanyAddress companyAddress = await _context.CompaniesAddresses.Include(x => x.Company).Where(x => x.Id == id).FirstOrDefaultAsync();
            if(companyAddress != null)
            {
                return companyAddress;
            }
            else
            {
                return null;
            }
        }
        public bool Exists(int id)
        {
            return _context.CompaniesAddresses.Any(a => a.Id == id);
        }
    }
}
