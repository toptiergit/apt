using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace ApplicationForm.Models
{
    public class Vocational
    {
		//[Key]
		//[DatabaseGenerat‌ed(DatabaseGeneratedOp‌tion.None)]
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
		[Required(ErrorMessage = "*")]
		public string SafetyRank { get; set; }
		public string SafetyRecord { get; set; }
		[Required(ErrorMessage = "*")]
		public string QualityRank { get; set; }
		public string QualityRecord { get; set; }
		[Required(ErrorMessage = "*")]
		public string ProJKnRank { get; set; }
		public string ProJKnRecord { get; set; }
		[Required(ErrorMessage = "*")]
		public string TeamWorkRank { get; set; }
		public string TeamWorkRecord { get; set; }
		[Required(ErrorMessage = "*")]
		public string PunctuallityRank { get; set; }
		public string PunctuallityRecord { get; set; }
		[StringLength(1000)]
		[DataType(DataType.MultilineText)]
		public string AreasforImp { get; set; }
		public string OverallRatingPointSystem { get; set; }
		[Required(ErrorMessage = "*")]
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