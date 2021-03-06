using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using InternshipWebApp.Controllers;
using InternshipWebApp.Models;

namespace InternshipWebApp.Services.ProfessionalExperienceDefinitionService
{
    public interface IProfessionalExperienceDefinitionManager
    {
        Task<ICollection<ProfessionalExperienceDefinition>> ListAllElements(string search = null, string sort = null);
        Task<ProfessionalExperienceDefinition> Create(DefinitionViewModel input);
        Task<ProfessionalExperienceDefinition> Delete(int id);
        Task<ProfessionalExperienceDefinition> Update(int id, DefinitionViewModel input);
        Task<ProfessionalExperienceDefinition> Read(int id);
        Task<ProfessionalExperienceDefinition> setState(int id);
    }
}
