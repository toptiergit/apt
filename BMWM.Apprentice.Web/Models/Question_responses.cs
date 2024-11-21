namespace ApplicationForm.Models
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    public partial class Question_responses
    {
        public int Id { get; set; }

        public int? Responseid { get; set; }

        public int? Questionid { get; set; }

        public int? Optionid { get; set; }

        public DateTime? Lastupdated { get; set; }

        [StringLength(500)]
        public string Reason { get; set; }
        [NotMapped]
        public int? QuesResId { get; set; }
        [NotMapped]
        public int? QuesOptionResId { get; set; }



        public virtual Quiz_responses Quiz_responses { get; set; }

        [ForeignKey("Questionid")]
        public virtual Quiz_questions Quiz_Questions { get; set; }

        [ForeignKey("Optionid")]
        public virtual Question_options Question_Options { get; set; }

        [ForeignKey("Questionid")]
        public virtual Question_answer Question_answer { get; set; }
    }
}
