using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using InternshipWebApp.Data;
using InternshipWebApp.Models;

namespace InternshipWebApp.Services.ImprovementService
{
    public class ImprovementManager : IImprovementManager
    {
        private ApplicationDbContext _context;
        public ImprovementManager(ApplicationDbContext context)
        {
            _context = context;
        }
        public async Task<ICollection<Improvement>> ListAllElements(string search = null, string sort = null)
        {
            IQueryable<Improvement> improvements = _context.Improvements;

            if (!String.IsNullOrEmpty(search))
            {
                improvements = improvements.Where(x => x.Head.Contains(search) || x.Status.Contains(search));
            }
            improvements = sort switch
            {
                "name_desc" => improvements.OrderByDescending(x => x.Head),
                "name_asc" => improvements.OrderBy(x => x.Head),
                "status_desc" => improvements.OrderByDescending(x => x.Status),
                "status_asc" => improvements.OrderBy(x => x.Status),
                _ => improvements.OrderBy(x => x.Id),
            };
            return await improvements.ToListAsync();
        }
        public async Task<Improvement> Create(Improvement input)
        {
            Improvement newImprovement = new Improvement
            {
                Head = input.Head, 
                Body = input.Body,
                Status =input.Status,
            };
            _context.Improvements.Add(newImprovement);
            await _context.SaveChangesAsync();
            return newImprovement;
        }
        public async Task<Improvement> Delete(int id)
        {
            Improvement improvement = _context.Improvements.Find(id);
            if (improvement != null)
            {
                _context.Improvements.Remove(improvement);
                await _context.SaveChangesAsync();
            }
            return improvement;
        }
        public async Task<Improvement> Update(int id, Improvement input)
        {
            Improvement improvement = _context.Improvements.Find(id);
            if (improvement != null)
            {
                improvement.Head = input.Head;
                improvement.Body = input.Body;
                improvement.Status = input.Status;
                await _context.SaveChangesAsync();
                return improvement;
            }
            else
            {
                return null;
            }
        }
        public async Task<Improvement> Read(int id)
        {
            Improvement improvement = await _context.Improvements.FindAsync(id);
            if (improvement != null)
            {
                return improvement;
            }
            else
            {
                return null;
            }
        }
        public bool Exists(int id)
        {
            return _context.Improvements.Any(a => a.Id == id);
        }
    }
}
