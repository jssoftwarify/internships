using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using InternshipWebApp.Models;

namespace InternshipWebApp.Services.RecordService
{
    public interface IRecordManager
    {
        Task<ICollection<Record>> ListAllElements();
        Task<Record> Create(Record inpup);
        Task<Record> Delete(int id);
        Task<Record> Update(int id, Record input);
        Task<Record> Read(int id);
    }
}
