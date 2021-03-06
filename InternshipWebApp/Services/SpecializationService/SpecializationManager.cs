using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using InternshipWebApp.Data;
using InternshipWebApp.Models;

namespace InternshipWebApp.Services.SpecializationService
{
    public class SpecializationManager : ISpecializationManager
    {
        private ApplicationDbContext _context;
        public SpecializationManager(ApplicationDbContext context)
        {
            _context = context;
        }
        public async Task<ICollection<Specialization>> ListAllElements(string search = null, string sort = null)
        {
            IQueryable<Specialization> specializations = _context.Specializations;

            if (!String.IsNullOrEmpty(search))
            {
                specializations = specializations.Where(x => x.Name.Contains(search));
            }
            specializations = sort switch
            {
                "name_desc" => specializations.OrderByDescending(x => x.Name),
                "name_asc" => specializations.OrderBy(x => x.Name),
                _ => specializations.OrderBy(x => x.Id),
            };
            return await specializations.ToListAsync();
            
        }
        public async Task<Specialization> Create(Specialization input)
        {
            Specialization newSpecialization = new Specialization
            {
                Name = input.Name
            };
            _context.Specializations.Add(newSpecialization);
            await _context.SaveChangesAsync();
            return newSpecialization;
        }
        public async Task<Specialization> Delete(int id)
        {
            Specialization specialization = _context.Specializations.Find(id);
            if (specialization != null)
            {
                _context.Specializations.Remove(specialization);
                await _context.SaveChangesAsync();
            }
            return specialization;
        }
        public async Task<Specialization> Update(int id, Specialization input)
        {
            Specialization specialization = _context.Specializations.Find(id);
            if (specialization != null)
            {
                specialization.Name = input.Name;
                await _context.SaveChangesAsync();
                return specialization;
            }
            else
            {
                return null;
            }
        }
        public async Task<Specialization> Read(int id)
        {
            Specialization specialization = await _context.Specializations.FindAsync(id);
            if (specialization != null)
            {
                return specialization;
            }
            else
            {
                return null;
            }
        }
        public bool Exists(int id)
        {
            return _context.Specializations.Any(a => a.Id == id);
        }
    }
}
