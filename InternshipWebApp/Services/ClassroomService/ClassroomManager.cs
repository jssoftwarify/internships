
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using InternshipWebApp.Data;
using InternshipWebApp.Models;

//List, Read, Update, Delete, Create

namespace InternshipWebApp.Services.ClassroomService
{
    public class ClassroomManager : IClassroomManager
    {
        private ApplicationDbContext _context;
        public ClassroomManager(ApplicationDbContext context)
        {
            _context = context;
        }
        public async Task<ICollection<Classroom>> ListAllElements(string search = null, string sort = null)
        {
            IQueryable<Classroom> classrooms = _context.Classrooms;

            if (!String.IsNullOrEmpty(search))
            {
                classrooms = classrooms.Where(x => x.Name.Contains(search));
            }
            classrooms = sort switch
            {
                "name_desc" => classrooms.OrderByDescending(x => x.Name),
                "name_asc" => classrooms.OrderBy(x => x.Name),
                _ => classrooms.OrderBy(x => x.Id),
            };
            return await classrooms.ToListAsync();
            
        }
        public async Task<Classroom> Create(Classroom value)
        {
            Classroom newClassroom = new Classroom
            {
                Name = value.Name,
                
            };
            _context.Classrooms.Add(newClassroom);
            await _context.SaveChangesAsync();
            return newClassroom;
        }
        public async Task<Classroom> Delete(int id)
        {
            Classroom classroom = _context.Classrooms.Find(id);
            if (classroom != null)
            {
                _context.Classrooms.Remove(classroom);
                await _context.SaveChangesAsync();
            }
            return classroom;
        }
        public async Task<Classroom> Update(int id, Classroom input)
        {
            Classroom classroom = _context.Classrooms.Find(id);
            if (classroom != null)
            {
                classroom.Name = input.Name;
                await _context.SaveChangesAsync();
                return classroom;
            }
            else
            {
                return null;
            }
        }
        public async Task<Classroom> Read(int id)
        {
            Classroom classroom = await _context.Classrooms.Where(y=>y.Id == id).FirstOrDefaultAsync();
            if (classroom != null)
            {
                return classroom;
            }
            else
            {
                return null;
            }
        }
        public bool Exists(int id)
        {
            return _context.Classrooms.Any(a => a.Id == id);
        }
    }
}
