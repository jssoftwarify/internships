using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using InternshipWebApp.Data;
using InternshipWebApp.Models;

namespace InternshipWebApp.Services.InternshipService
{
    public class InternshipManager : IInternshipManager
    {
        private ApplicationDbContext _context;


        public InternshipManager(ApplicationDbContext context)
        {
            _context = context;
        }
        public async Task<ICollection<Internship>> ListAllElements(string search = null, string sort = null)
        {
            IQueryable<Internship> internships = _context.Internships.Include(x => x.Company).Include(x => x.ProfessionalExperienceDefinition).Include(x => x.CompanyAddress).Include(x => x.Inspection);

            if (!String.IsNullOrEmpty(search))
            {
                internships = internships.Where(x => x.Company.Name.Contains(search) || x.ProfessionalExperienceDefinition.Name.Contains(search) || x.User.FirstName.Contains(search) || x.User.LastName.Contains(search));
            }
            internships = sort switch
            {
                "company_desc" => internships.OrderByDescending(x => x.Company.Name),
                "company_asc" => internships.OrderBy(x => x.Company.Name),
                "definition_desc" => internships.OrderByDescending(x => x.ProfessionalExperienceDefinition.Name),
                "definition_asc" => internships.OrderBy(x => x.ProfessionalExperienceDefinition.Name),
              
                _ => internships.OrderBy(x => x.Id),
            };
            return await internships.ToListAsync();
        }
        public async Task<ICollection<Internship>> ListAllElementsByDefinition(ICollection<int> ids)
        {
            IQueryable<Internship> internships = _context.Internships.Where(x => ids.Contains(x.ProfessionalExperienceDefinitionId.Value)).Include(x => x.Company).Include(x => x.ProfessionalExperienceDefinition).Include(x => x.CompanyAddress).Include(x => x.Inspection);
            return await internships.ToListAsync();

           
        }
        public async Task<Internship> Create(Internship input, int userId)
        {
            int userInternshipCount = 0;

            foreach(var i in _context.Internships)
            {
                if(i.UserId == userId)
                {
                    userInternshipCount++;

                }
            }
            Internship newInternship = new Internship
            {
                CompanyRepresentative = input.CompanyRepresentative,
                CompaniesRepresentativeEmail = input.CompaniesRepresentativeEmail,
                CompaniesRepresentativeTelephoneNumber = input.CompaniesRepresentativeTelephoneNumber,
                CompanyContactPerson = input.CompanyContactPerson,
                CompaniesContactPersonEmail = input.CompaniesContactPersonEmail,
                CompaniesContacPersonTelephoneNumber = input.CompaniesContacPersonTelephoneNumber,
                JobDescription = input.JobDescription,
                AdditionalInformations = input.AdditionalInformations,
                CompanyId = input.CompanyId,
                CompanyAddressId = input.CompanyAddressId,
                ProfessionalExperienceDefinitionId = input.ProfessionalExperienceDefinitionId,
                UserId = userId,
                Aktivni = userInternshipCount == 0 ? true : false,
            };
            _context.Internships.Add(newInternship);       
            await _context.SaveChangesAsync();
            return newInternship;
        }
        public async Task<Internship> Delete(int id)
        {
            Internship internships = _context.Internships.Find(id);
            if (internships != null)
            {
                _context.Internships.Remove(internships);
            
                await _context.SaveChangesAsync();
            }
            return internships;
        }
        public async Task<Internship> Update(int id, Internship input)
        {
            Internship internship = _context.Internships.Find(id);
            if (internship != null)
            {
                internship.CompanyRepresentative = input.CompanyRepresentative;
                internship.CompaniesRepresentativeEmail = input.CompaniesRepresentativeEmail;
                internship.CompaniesRepresentativeTelephoneNumber = input.CompaniesRepresentativeTelephoneNumber;
                internship.CompanyContactPerson = input.CompanyContactPerson;
                internship.CompaniesContactPersonEmail = input.CompaniesContactPersonEmail;
                internship.CompaniesContacPersonTelephoneNumber = input.CompaniesContacPersonTelephoneNumber;
                internship.JobDescription = input.JobDescription;
                internship.AdditionalInformations = input.AdditionalInformations;
                internship.CompanyId = input.CompanyId;
                internship.CompanyAddressId = input.CompanyAddressId;
                internship.ProfessionalExperienceDefinitionId = input.ProfessionalExperienceDefinitionId;
                internship.UserId = input.UserId;
                internship.Aktivni = input.Aktivni;
                await _context.SaveChangesAsync();
                return internship;
            }
            else
            {
                return null;
            }
        }
        public async Task<Internship> Read(int id)
        {
            Internship internship = await _context.Internships.Include(x => x.Company).Include(x => x.ProfessionalExperienceDefinition).Include(x => x.CompanyAddress).Include(x=>x.Inspection).Where(x => x.Id == id).FirstOrDefaultAsync();
            if (internship != null)
            {
                return internship;
            }
            else
            {
                return null;
            }
        }

        public async Task<Internship> setState(int id)
        {
            var internship = _context.Internships.Find(id);
            if (internship == null)
            {
                return null;
            }

           

            var list = _context.Internships.Where(x => x.UserId == internship.UserId);

            internship.Aktivni = true;
            
            foreach (var i in list)
            {
               
                if (i != internship)
                {
                    i.Aktivni = false;
                }
            }
            await _context.SaveChangesAsync();
            return internship;
        }
        public async Task<CompanyAddress> setInternship(int id, int userId)
        {
            var address = _context.CompaniesAddresses.Find(id);

            if(address == null)
            {
                return null;
            }
            address.UserId = userId;
            address.FreeForInspection = false;
           
            await _context.SaveChangesAsync();
            return address;
        }
        public bool Exists(int id)
        {
            return _context.Internships.Any(a => a.Id == id);
        }
    }
}
