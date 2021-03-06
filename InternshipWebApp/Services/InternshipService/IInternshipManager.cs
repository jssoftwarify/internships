using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using InternshipWebApp.Models;

namespace InternshipWebApp.Services.InternshipService
{
    public interface IInternshipManager
    {
        Task<ICollection<Internship>> ListAllElements(string search = null, string sort = null);
        Task<ICollection<Internship>> ListAllElementsByDefinition(ICollection<int> ids);
        
        Task<Internship> Create(Internship input, int userId);
        Task<Internship> Delete(int id);
        Task<Internship> Update(int id, Internship input);
        Task<Internship> Read(int id);
        Task<Internship> setState(int id);
    }
}
