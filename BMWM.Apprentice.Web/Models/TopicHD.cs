using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace ApplicationForm.Models
{
    public class TopicHD
    {
        [Key]
        public int Id { get; set; }
        public string Name { get; set; }
        public string Desciption { get; set; }
        public string CreatedBy { get; set; }
        public DateTime CreatedOn { get; set; }
    }
}