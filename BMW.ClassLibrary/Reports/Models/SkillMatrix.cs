using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BMW.ClassLibrary.Reports.Models
{
   public class SkillMatrix
    {
        public string UserId { get; set; }
        public string UserName { get; set; }
        public int SkillId { get; set; }
        public string SkillName { get; set; }
        public string Area { get; set; }
        public int Score { get; set; }
        public DateTime LastUpdate { get; set; }
    }
}
