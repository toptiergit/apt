namespace ApplicationForm.Models
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    [Table("WorkExperience")]
    public partial class WorkExperience
    {
        public int Id { get; set; }

        [StringLength(1000)]
        public string Name { get; set; }

        [StringLength(50)]
        public string WorkFrom { get; set; }

        [StringLength(50)]
        public string WorkTo { get; set; }

        [StringLength(50)]
        public string Position { get; set; }

        [StringLength(1000)]
        public string Responsibility { get; set; }

        public decimal? SalaryStart { get; set; }

        public decimal? SalaryEnd { get; set; }

        [StringLength(500)]
        public string ReasonLeaving { get; set; }

        public int ApplicantId { get; set; }

        public virtual Applicant Applicant { get; set; }
    }
}
