using System;
using System.Collections.Generic;
using System.Text;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc.Formatters;
using Microsoft.EntityFrameworkCore;
using InternshipWebApp.Models;

namespace InternshipWebApp.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }
        public DbSet<User> Users { get; set; }
        public DbSet<Classroom> Classrooms { get; set; }
        public DbSet<Company> Companies { get; set; }
        public DbSet<CompanyAddress> CompaniesAddresses { get; set; }
        public DbSet<Improvement> Improvements { get; set; }
        public DbSet<Inspection> Inspections { get; set; }
        public DbSet<Internship> Internships { get; set; }
        public DbSet<ProfessionalExperienceDefinition> ProfessionalExperienceDefinitions { get; set; }
        public DbSet<Record> Records { get; set; }
        public DbSet<Specialization> Specializations { get; set; }
        public DbSet<UserAddress> UserAddresses { get; set; }
        public DbSet<ClassroomDefinition> ClassroomDefinitions { get; set; }
        protected override void OnModelCreating(ModelBuilder builder)
        {
            builder.Entity<ClassroomDefinition>().HasKey(cd => new { cd.ClassroomId, cd.DefinitionId });
            base.OnModelCreating(builder);
        }       
    }
}
