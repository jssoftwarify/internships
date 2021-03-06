using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using InternshipWebApp.Models;

namespace InternshipWebApp.Services.SpecializationService
{
    public interface ISpecializationManager
    {
        Task<ICollection<Specialization>> ListAllElements(string search = null, string sort = null);
        Task<Specialization> Create(Specialization input);
        Task<Specialization> Delete(int id);
        Task<Specialization> Update(int id, Specialization input);
        Task<Specialization> Read(int id);
    }
}
