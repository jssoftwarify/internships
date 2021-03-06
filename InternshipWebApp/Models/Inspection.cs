using Microsoft.EntityFrameworkCore.Storage.ValueConversion.Internal;
using Newtonsoft.Json.Converters;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace InternshipWebApp.Models
{
    public class Inspection
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [DataType(DataType.Date)]
        [DisplayFormat(DataFormatString = "{yyyy-MM-dd}")]
        public DateTime InspectionDate { get; set; }
        [Required]
        public Inspectionrating InspectionRating { get; set; }
        public string AdditionalInformations { get; set; }
        [Required]
        public int? InternshipId { get; set; }
        [ForeignKey("InternshipId")]
        [JsonIgnore]
        public Internship Internship { get; set; }
    }
    public enum Inspectionrating
    {
        Vyborny,
        Chvalitebny, 
        Dobry,
        Dostacujici, 
        Nedostacujici,
    }
}
