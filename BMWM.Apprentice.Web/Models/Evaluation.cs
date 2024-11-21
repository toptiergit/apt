using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace ApplicationForm.Models
{
    public class Evaluation
    {
        //[Key]
        //[DatabaseGenerat‌ed(DatabaseGeneratedOp‌tion.None)]
        public int Id { get; set; }
        [UIHint("UserId")]
        public string UserId { get; set; }
        public string Prefix { get; set; }
        [UIHint("FullName")]
        [NotMapped]
        public string FullName { get; set; }
        [NotMapped]
        public string Department { get; set; }
        [DataType(DataType.Date)]
        [DisplayFormat(DataFormatString = "{0:yyyy-MM-dd}", ApplyFormatInEditMode = true)]
        public DateTime Startdate { get; set; }      
        [DataType(DataType.Date)]
        [DisplayFormat(DataFormatString = "{0:yyyy-MM-dd}", ApplyFormatInEditMode = true)]
        public DateTime EvaluateFdate { get; set; }
        [DataType(DataType.Date)]
        [DisplayFormat(DataFormatString = "{0:yyyy-MM-dd}", ApplyFormatInEditMode = true)]
        public DateTime EvaluateTdate { get; set; }
        [Required(ErrorMessage = "*")]
        [UIHint("ServicesInYear")]
        public string ServicesInYear { get; set; }
        public string ProcessManager { get; set; }
        public string PPASubject { get; set; }
        [DataType(DataType.Date)]
        [DisplayFormat(DataFormatString = "{0:yyyy-MM-dd}", ApplyFormatInEditMode = true)]
        public DateTime PPAIssuedate { get; set; }
        [StringLength(1000)]
        [DataType(DataType.MultilineText)]
        public string DiscActionLevel { get; set; }
        [DataType(DataType.Date)]
        [DisplayFormat(DataFormatString = "{0:yyyy-MM-dd}", ApplyFormatInEditMode = true)]
        public DateTime DiscActionIssuedate { get; set; }
        [Required(ErrorMessage = "*")]
        public string QOJRank { get; set; }
        public string QOJRecord { get; set; }
        [Required(ErrorMessage = "*")]
        public string QOJARank { get; set; }
        public string QOJARecord { get; set; }
        [Required(ErrorMessage = "*")]
        public string STWRank { get; set; }
        public string STWRecord { get; set; }
        [Required(ErrorMessage = "*")]
        public string WRRank { get; set; }
        public string WRRecord { get; set; }
        [Required(ErrorMessage = "*")]
        public string TWRank { get; set; }
        public string TWRecord { get; set; }
        [Required(ErrorMessage = "*")]
        public string PTRank { get; set; }
        public string PTRecord { get; set; }
        [Required(ErrorMessage = "*")]
        public string ATTActwork { get; set; }
        [Required(ErrorMessage = "*")]
        public string ATTLeave { get; set; }
        [Required(ErrorMessage = "*")]
        public string ATTActworkLeft { get; set; }
        [Required(ErrorMessage = "*")]
        [UIHint("ATTRate")]
        public string ATTRate { get; set; }
        [Required(ErrorMessage = "*")]
        public string ATTRank { get; set; }
        [Required(ErrorMessage = "*")]
        public string ATTTotal { get; set; }
        [Required(ErrorMessage = "*")]
        public string OverallEvaluation { get; set; }
        public string Half { get; set; }
        [StringLength(1000)]
        [DataType(DataType.MultilineText)]
        public string TopicStr { get; set; }
        [StringLength(1000)]
        [DataType(DataType.MultilineText)]
        public string AreaImp { get; set; }
        [StringLength(1000)]
        [DataType(DataType.MultilineText)]
        public string Course { get; set; }
        [DataType(DataType.Date)]
        [DisplayFormat(DataFormatString = "{0:yyyy-MM-dd}", ApplyFormatInEditMode = true)]
        public DateTime PlanGetdate { get; set; }
        [Required(ErrorMessage = "*")]
        public string OriginalDeptConf { get; set; }
        [StringLength(1000)]
        [DataType(DataType.MultilineText)]
        public string AssociateFeedback { get; set; }
        [StringLength(1000)]
        [DataType(DataType.MultilineText)]
        public string HumanResources { get; set; }
        public string CreateBy { get; set; }
        public string UpdateBy { get; set; }
        public DateTime CreateOn { get; set; }
        public DateTime UpdateOn { get; set; }
    }
}