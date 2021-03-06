using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using InternshipWebApp.Models;

namespace InternshipWebApp.Services.InspectionService
{
    public interface IInspectionManager
    {
        Task<ICollection<Inspection>> ListAllElements();
        Task<Inspection> Create(Inspection input);
        Task<Inspection> Delete(int id);
        Task<Inspection> Update(int id, Inspection input);
        Task<Inspection> Read(int id);

    }
}
