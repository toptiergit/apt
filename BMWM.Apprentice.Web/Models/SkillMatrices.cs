using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ApplicationForm.Models
{
    public class SkillMatrices
    {
        public int Id { get; set; }
        public string UserId { get; set; }
        public int StationId { get; set; }
        //public string SkillName { get; set; }
        //public string Area { get; set; }
        public int Score { get; set; }
        public DateTime LastUpdate { get; set; }

    }
}