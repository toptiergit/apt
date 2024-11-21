namespace ApplicationForm.Models
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    public partial class Question_answer
    {
        public int Id { get; set; }
        public int Questionid { get; set; }

        public int Optionid { get; set; }

        public DateTime? Lastupdated { get; set; }

        public virtual Quiz_questions Quiz_questions { get; set; }
        [ForeignKey("Optionid")]
        public virtual Question_options Question_options { get; set; }

    }
}
