using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BMW.ClassLibrary.Reports.Models
{
    public class Evaluation
    {
        public int Id { get; set; }
        public string UserId { get; set; }
        [NotMapped]
        public string FullName { get; set; }
        [DataType(DataType.Date)]
        [DisplayFormat(DataFormatString = "{0:yyyy-MM-dd}", ApplyFormatInEditMode = true)]
        public DateTime Startdate { get; set; }
        [NotMapped]
        public string Department { get; set; }
        public string Title { get; set; }
        [DataType(DataType.Date)]
        [DisplayFormat(DataFormatString = "{0:yyyy-MM-dd}", ApplyFormatInEditMode = true)]
        public DateTime EvaluateFdate { get; set; }
        [DataType(DataType.Date)]
        [DisplayFormat(DataFormatString = "{0:yyyy-MM-dd}", ApplyFormatInEditMode = true)]
        public DateTime EvaluateTdate { get; set; }
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
        public string QOJRank { get; set; }
        public string QOJRecord { get; set; }
        public string QOJARank { get; set; }
        public string QOJARecord { get; set; }
        public string STWRank { get; set; }
        public string STWRecord { get; set; }
        public string WRRank { get; set; }
        public string WRRecord { get; set; }
        public string TWRank { get; set; }
        public string TWRecord { get; set; }
        public string PTRank { get; set; }
        public string PTRecord { get; set; }
        public string ATTActwork { get; set; }
        public string ATTLeave { get; set; }
        public string ATTActworkLeft { get; set; }
        public string ATTRate { get; set; }
        public string ATTRank { get; set; }
        public string ATTTotal { get; set; }
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
