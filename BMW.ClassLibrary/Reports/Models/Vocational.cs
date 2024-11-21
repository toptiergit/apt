using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace BMW.ClassLibrary.Reports.Models
{
    public class Vocational
    {
		public int Id { get; set; }
		public string UserId { get; set; }

		[NotMapped]
		public string FullName { get; set; }
		[DataType(DataType.Date)]
		[DisplayFormat(DataFormatString = "{0:yyyy-MM-dd}", ApplyFormatInEditMode = true)]
		public DateTime HireDate { get; set; }
		public string PositionTitle { get; set; }
		public string CostCenter { get; set; }
		public string ReviewPeriod { get; set; }
		public string SafetyRank { get; set; }
		public string SafetyRecord { get; set; }
		public string QualityRank { get; set; }
		public string QualityRecord { get; set; }
		public string ProJKnRank { get; set; }
		public string ProJKnRecord { get; set; }
		public string TeamWorkRank { get; set; }
		public string TeamWorkRecord { get; set; }
		public string PunctuallityRank { get; set; }
		public string PunctuallityRecord { get; set; }
		[StringLength(1000)]
		[DataType(DataType.MultilineText)]
		public string AreasforImp { get; set; }
		public string OverallRatingPointSystem { get; set; }
		public string OverallTotalpoint { get; set; }
		[StringLength(1000)]
		[DataType(DataType.MultilineText)]
		public string StudentComments { get; set; }
		public string Quarter { get; set; }
		public string CreateBy { get; set; }
		public string UpdateBy { get; set; }
		public DateTime CreateOn { get; set; }
		public DateTime UpdateOn { get; set; }
	}
}