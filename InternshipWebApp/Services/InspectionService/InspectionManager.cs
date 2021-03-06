using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using InternshipWebApp.Data;
using InternshipWebApp.Models;

namespace InternshipWebApp.Services.InspectionService
{
    public class InspectionManager : IInspectionManager
    {
        private ApplicationDbContext _context;
        public InspectionManager(ApplicationDbContext context)
        {
            _context = context;
        }
        public async Task<ICollection<Inspection>> ListAllElements()
        {
            return await _context.Inspections.ToListAsync();
        }
        public async Task<Inspection> Create(Inspection input)
        {
            foreach(var i in _context.Inspections)
            {
                if(i.InternshipId == input.InternshipId)
                {
                    _context.Inspections.Remove(i);
                  
                }
            }
            Inspection newInspection = new Inspection
            {
                InspectionDate = input.InspectionDate, 
                InspectionRating = input.InspectionRating, 
                AdditionalInformations = input.AdditionalInformations, 
                InternshipId = input.InternshipId
            };
            _context.Inspections.Add(newInspection);
            await _context.SaveChangesAsync();
            return newInspection;
        }
        public async Task<Inspection> Delete(int id)
        {
            Inspection inspection = _context.Inspections.Find(id);
            if (inspection != null)
            {
                _context.Inspections.Remove(inspection);
                await _context.SaveChangesAsync();
            }
            return inspection;
        }
        public async Task<Inspection> Update(int id, Inspection input)
        {
            Inspection inspection = _context.Inspections.Find(id);
            if (inspection != null)
            {
                inspection.InspectionDate = input.InspectionDate;
                inspection.InspectionRating = input.InspectionRating;
                inspection.AdditionalInformations = input.AdditionalInformations;
                inspection.InternshipId = input.InternshipId;
                await _context.SaveChangesAsync();
                return inspection;
            }
            else
            {
                return null;
            }
        }
        public async Task<Inspection> Read(int id)
        {
            Inspection inspection = await _context.Inspections.FindAsync(id);
            if (inspection != null)
            {
                return inspection;
            }
            else
            {
                return null;
            }
        }
        public bool Exists(int id)
        {
            return _context.Inspections.Any(a => a.Id == id);
        }
        /*
        public async void Asign(int companyAddressId, int supervisorId)
        {
            foreach (Internship i in _context.Internships.Where(x => x.CompanyAddressId == companyAddressId).ToList())
            {
                if (i.SupervisorId == null)
                {
                    i.SupervisorId = supervisorId;
                    await _context.SaveChangesAsync();
                }
            }
        }
        */
    }
}
