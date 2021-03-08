using InternshipWebApp.Data;
using InternshipWebApp.Services.ClassroomService;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.SpaServices.ReactDevelopmentServer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.IdentityModel.Logging;
using InternshipWebApp.Services.CompanyAddressService;
using InternshipWebApp.Services.CompanyService;
using InternshipWebApp.Services.Email;
using InternshipWebApp.Services.ImprovementService;
using InternshipWebApp.Services.InspectionService;
using InternshipWebApp.Services.InternshipService;
using InternshipWebApp.Services.ProfessionalExperienceDefinitionService;
using InternshipWebApp.Services.SpecializationService;
using InternshipWebApp.Services.RecordService;
using InternshipWebApp.Services;
using Microsoft.OpenApi.Models;

namespace InternshipWebApp
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            //IdentityModelEventSource.ShowPII = true; //Add this line
            services.AddDbContext<ApplicationDbContext>(options =>
                options.UseSqlServer(
                    Configuration.GetConnectionString("DefaultConnection")));
            services.AddControllersWithViews();
           
            services.AddScoped<IClassroomManager, ClassroomManager>();
            services.AddScoped<ICompanyAddressManager, CompanyAddressManager>();
            services.AddScoped<ICompanyManager, CompanyManager>();
            services.AddScoped<EmailSender>();
            services.AddScoped<IImprovementManager, ImprovementManager>();
            services.AddScoped<IInspectionManager, InspectionManager>();
            services.AddScoped<IInternshipManager, InternshipManager>();
            services.AddScoped<IProfessionalExperienceDefinitionManager, ProfessionalExperienceDefinitionManager>();
            services.AddScoped<ISpecializationManager, SpecializationManager>();
            services.AddScoped<IRecordManager, RecordManager>();
            services.AddScoped<RazorViewToStringRenderer>();


            // In production, the React files will be served from this directory
            services.AddSpaStaticFiles(configuration =>
            {
                configuration.RootPath = "ClientApp/build";
            });
            services.AddAuthentication("Bearer").AddJwtBearer("Bearer", options =>
            {
                options.Authority = Configuration["Authority:Server"];
                options.RequireHttpsMetadata = true;
                options.Audience = Configuration["Authority:ClientId"];
            }
            );

            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new OpenApiInfo { Title = "Internship API", Version = "v1" });
            });
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseExceptionHandler("/Error");
                // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
                app.UseHsts();
            }

            app.UseHttpsRedirection();
            app.UseStaticFiles();
            app.UseSpaStaticFiles();

            app.UseRouting();
            app.UseAuthentication();
            app.UseAuthorization();

            app.UseSwagger();
            app.UseSwaggerUI(c =>
            {
                c.SwaggerEndpoint("/swagger/v1/swagger.json", "Internship API");
            });

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllerRoute(
                    name: "default",
                    pattern: "{controller}/{action=Index}/{id?}");
            });

            app.UseSpa(spa =>
            {
                spa.Options.SourcePath = "ClientApp";

                if (env.IsDevelopment())
                {
                    //spa.UseReactDevelopmentServer(npmScript: "start");
                    spa.UseProxyToSpaDevelopmentServer("http://localhost:3000");
                }
            });
        }
    }
}
