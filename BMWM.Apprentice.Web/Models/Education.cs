namespace ApplicationForm.Models
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    [Table("Education")]
    public partial class Education
    {
        public int Id { get; set; }

        //[Required]
        [StringLength(200)]
        public string Name { get; set; }

        [StringLength(200)]
        public string Level { get; set; }

        public int? FromYear { get; set; }

        public int? ToYear { get; set; }

        [StringLength(200)]
        public string CertificateDegree { get; set; }

        public decimal? Grade { get; set; }

        [StringLength(200)]
        public string Major { get; set; }


        public int ApplicantId { get; set; }

        public virtual Applicant Applicant { get; set; }
    }
}
