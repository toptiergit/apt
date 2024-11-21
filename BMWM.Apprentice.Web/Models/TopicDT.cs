using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace ApplicationForm.Models
{
    public class TopicDT
    {
        [Key]
        public int Id { get; set; }
        public int TopicId { get; set; }
        public string Desciption { get; set; }
        public string CreatedBy { get; set; }
        public DateTime CreatedOn { get; set; }
    }
}