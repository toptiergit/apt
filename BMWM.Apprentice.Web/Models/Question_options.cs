namespace ApplicationForm.Models
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    public partial class Question_options
    {
        public int Id { get; set; }

        public int Questionid { get; set; }

        [StringLength(500)]
        public string Questionoption { get; set; }
        public string Image { get; set; }
        public DateTime? Lastupdated { get; set; }

        public virtual Quiz_questions Quiz_questions { get; set; }
    }
}
