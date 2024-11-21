namespace ApplicationForm.Models
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    [Table("Training")]
    public partial class Training
    {
        public int Id { get; set; }

        [StringLength(200)]
        public string Course { get; set; }

        [StringLength(200)]
        public string HoldBy { get; set; }

        [StringLength(100)]
        public string Period { get; set; }

        public int ApplicantId { get; set; }

        public virtual Applicant Applicant { get; set; }
    }
}
