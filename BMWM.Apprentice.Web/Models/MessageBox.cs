using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ApplicationForm.Models
{
    public class MessageBox
    {
		public int Id { get; set; }
		public string Message { get; set; }
		public string AdminUserId { get; set; }
		public string UserId { get; set; }
		public bool IsRead { get; set; }
		public string SenderUserId { get; set; }
		public DateTime CreatedOn { get; set; }

	}
}