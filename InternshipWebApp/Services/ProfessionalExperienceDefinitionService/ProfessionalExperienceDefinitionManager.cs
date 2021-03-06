using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using InternshipWebApp.Controllers;
using InternshipWebApp.Data;
using InternshipWebApp.Models;

namespace InternshipWebApp.Services.ProfessionalExperienceDefinitionService
{
    public class ProfessionalExperienceDefinitionManager: IProfessionalExperienceDefinitionManager
    {
        private ApplicationDbContext _context;
        public ProfessionalExperienceDefinitionManager(ApplicationDbContext context)
        {
            _context = context;
        }
        public async Task<ICollection<ProfessionalExperienceDefinition>> ListAllElements(string search = null, string sort = null)
        {
            IQueryable<ProfessionalExperienceDefinition> definitions = _context.ProfessionalExperienceDefinitions;

            if (!String.IsNullOrEmpty(search))
            {
                definitions = definitions.Where(x => x.Name.Contains(search));
            }
            definitions = sort switch
            {
                "name_desc" => definitions.OrderByDescending(x => x.Name),
                "name_asc" => definitions.OrderBy(x => x.Name),
                "start_desc" => definitions.OrderByDescending(x => x.Start),
                "start_asc" => definitions.OrderBy(x => x.Start),
                "end_desc" => definitions.OrderByDescending(x => x.End),
                "end_asc" => definitions.OrderBy(x => x.End),
                "year_desc" => definitions.OrderByDescending(x => x.Year),
                "year_asc" => definitions.OrderBy(x => x.Year),
                "days_desc" => definitions.OrderByDescending(x => x.NumberOfDays),
                "days_asc" => definitions.OrderBy(x => x.NumberOfDays),
                "hours_desc" => definitions.OrderByDescending(x => x.NumberOfHours),
                "hours_asc" => definitions.OrderBy(x => x.NumberOfHours),
                _ => definitions.OrderBy(x => x.Id),
            };
            return await definitions.ToListAsync();
        }
        public async Task<ProfessionalExperienceDefinition> Create(DefinitionViewModel input)
        {
            ProfessionalExperienceDefinition newProfessionalExperienceDefinition = new ProfessionalExperienceDefinition
            {
                Name = input.Name,
                Start = input.Start,
                End = input.End,
                Year = input.Year,
                NumberOfDays = input.NumberOfDays,
                NumberOfHours = input.NumberOfHours, 
                Active = input.Active,
                Longtime = input.Longtime,
                DefinitionRepresentative = input.DefinitionRepresentative,
                DefinitionRepresentativeEmail = input.DefinitionRepresentativeEmail,
                DefinitionRepresentativeTelephoneNumber = input.DefinitionRepresentativeTelephoneNumber,
                
            };
            _context.ProfessionalExperienceDefinitions.Add(newProfessionalExperienceDefinition);
            await _context.SaveChangesAsync();
            
            foreach(var i in input.ClassroomIds)
            {
                var classroomDefinition = new ClassroomDefinition { ClassroomId = i, DefinitionId = newProfessionalExperienceDefinition.Id };
                _context.ClassroomDefinitions.Add(classroomDefinition);
            }
            await _context.SaveChangesAsync();
            

            return newProfessionalExperienceDefinition;
        }
        public async Task<ProfessionalExperienceDefinition> Delete(int id)
        {
            ProfessionalExperienceDefinition professionalExperienceDefinition = _context.ProfessionalExperienceDefinitions.Find(id);
            if (professionalExperienceDefinition != null)
            {
                _context.ProfessionalExperienceDefinitions.Remove(professionalExperienceDefinition);
                await _context.SaveChangesAsync();
            }
            return professionalExperienceDefinition;
        }
        public async Task<ProfessionalExperienceDefinition> Update(int id, DefinitionViewModel input)
        {
            ProfessionalExperienceDefinition professionalExperienceDefinition = _context.ProfessionalExperienceDefinitions.Find(id);
            if (professionalExperienceDefinition != null)
            {
                professionalExperienceDefinition.Name = input.Name;
                professionalExperienceDefinition.Start = input.Start;
                professionalExperienceDefinition.End = input.End;
                professionalExperienceDefinition.Year = input.Year;
                professionalExperienceDefinition.NumberOfDays = input.NumberOfDays;
                professionalExperienceDefinition.NumberOfHours = input.NumberOfHours;
                professionalExperienceDefinition.Active = input.Active;
                professionalExperienceDefinition.Longtime = input.Longtime;
                professionalExperienceDefinition.DefinitionRepresentative = input.DefinitionRepresentative;
                professionalExperienceDefinition.DefinitionRepresentativeEmail = input.DefinitionRepresentativeEmail;
                professionalExperienceDefinition.DefinitionRepresentativeTelephoneNumber = input.DefinitionRepresentativeTelephoneNumber;
                await _context.SaveChangesAsync();
                
                
                foreach (var i in _context.ClassroomDefinitions)
                {
                   
                    if(i.DefinitionId == id){
                        _context.ClassroomDefinitions.Remove(i);
                    }
                }
                await _context.SaveChangesAsync();
                
                foreach (var i in input.ClassroomIds)
                {
                    var classroomDefinition = new ClassroomDefinition { ClassroomId = i, DefinitionId = id };
                    _context.ClassroomDefinitions.Add(classroomDefinition);
                }
              
                await _context.SaveChangesAsync();
                
                return professionalExperienceDefinition;
            }
            else
            {
                return null;
            }
        }

        public async Task<ProfessionalExperienceDefinition> setState(int id)
        {
            var professionalExperienceDefinition = _context.ProfessionalExperienceDefinitions.Find(id);
            if (professionalExperienceDefinition == null)
            {
                return null;
            }
            professionalExperienceDefinition.Active = !professionalExperienceDefinition.Active;

            await _context.SaveChangesAsync();
            return professionalExperienceDefinition;
        }
        public async Task<ProfessionalExperienceDefinition> Read(int id)
        {
            ProfessionalExperienceDefinition professionalExperienceDefinition = await _context.ProfessionalExperienceDefinitions.Where(x=> x.Id == id).FirstOrDefaultAsync();
            if (professionalExperienceDefinition != null)
            {
                return professionalExperienceDefinition;
            }
            else
            {
                return null;
            }
        }
        public bool Exists(int id)
        {
            return _context.ProfessionalExperienceDefinitions.Any(a => a.Id == id);
        }
    }
}
