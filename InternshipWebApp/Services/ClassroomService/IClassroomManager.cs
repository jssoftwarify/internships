using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using InternshipWebApp.Models;

namespace InternshipWebApp.Services.ClassroomService
{
    public interface IClassroomManager
    {
        Task<ICollection<Classroom>> ListAllElements(string search = null, string sort = null);
        Task<Classroom> Create(Classroom value);
        Task<Classroom> Delete(int id);
        Task<Classroom> Update(int id, Classroom input);
        Task<Classroom> Read(int id);
    }
}
