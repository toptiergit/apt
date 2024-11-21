namespace ApplicationForm.Models
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    public partial class Children
    {
        public int Id { get; set; }

        [StringLength(200)]
        public string Name { get; set; }

        [Column(TypeName = "date")]
        public DateTime? Birthday { get; set; }

        [StringLength(50)]
        public string IdCardNo { get; set; }

        [StringLength(500)]
        public string SchoolOfficeAddress { get; set; }

        public int ApplicantId { get; set; }

        public virtual Applicant Applicant { get; set; }
    }
}
