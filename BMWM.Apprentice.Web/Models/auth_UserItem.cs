using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace ApplicationForm.Models
{
    public class auth_UserItem
    {
        [Key]
        public string UserId { get; set; }
        public string ItemCode { get; set; }
        public DateTime CreatedOn { get; set; }
        public string CreatedUserId { get; set; }
        //public virtual MessageBox MessageBox { get;set;}
    }
}