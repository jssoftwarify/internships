using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using InternshipWebApp.Data;
using InternshipWebApp.Models;

namespace InternshipWebApp.Services.RecordService
{
    public class RecordManager : IRecordManager
    {
        private ApplicationDbContext _context;
        public RecordManager(ApplicationDbContext context)
        {
            _context = context;
        }
        public async Task<ICollection<Record>> ListAllElements()
        {
            return await _context.Records.ToListAsync();
        }
        public async Task<Record> Create(Record value)
        {
            Record newRecord = new Record
            {
                NumberOfHours = value.NumberOfHours,
                WorkDescription = value.WorkDescription,
                DateOfRecord = value.DateOfRecord,
                InternshipId = value.InternshipId
            };
            _context.Records.Add(newRecord);
            await _context.SaveChangesAsync();
            return newRecord;
        }
        public async Task<Record> Delete(int id)
        {
            Record record = _context.Records.Find(id);
            if (record != null)
            {
                _context.Records.Remove(record);
                await _context.SaveChangesAsync();
            }
            return record;
        }
        public async Task<Record> Update(int id, Record input)
        {
            Record record = _context.Records.Find(id);
            if (record != null)
            {
                record.NumberOfHours = input.NumberOfHours;
                record.WorkDescription = input.WorkDescription;
                record.DateOfRecord = input.DateOfRecord;
                record.InternshipId = input.InternshipId;
                await _context.SaveChangesAsync();
                return record;
            }
            else
            {
                return null;
            }
        }
        public async Task<Record> Read(int id)
        {
            Record record = await _context.Records.Where(y => y.Id == id).FirstOrDefaultAsync();
            if (record != null)
            {
                return record;
            }
            else
            {
                return null;
            }
        }
    }
}
