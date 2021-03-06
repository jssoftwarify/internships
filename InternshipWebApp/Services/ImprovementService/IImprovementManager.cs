using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using InternshipWebApp.Models;

namespace InternshipWebApp.Services.ImprovementService
{
    public interface IImprovementManager
    {
        Task<ICollection<Improvement>> ListAllElements(string search = null, string sort = null);
        Task<Improvement> Create(Improvement input);
        Task<Improvement> Delete(int id);
        Task<Improvement> Update(int id, Improvement input);
        Task<Improvement> Read(int id);
    }
}
