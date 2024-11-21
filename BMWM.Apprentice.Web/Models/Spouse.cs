namespace ApplicationForm.Models
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    [Table("Spouse")]
    public partial class Spouse
    {
        public int Id { get; set; }

        [Required]
        [StringLength(200)]
        public string Name { get; set; }

        [StringLength(50)]
        public string Occupation { get; set; }

        public int? Age { get; set; }

        public int? RegisteredYear { get; set; }

        [StringLength(50)]
        public string District { get; set; }

        [StringLength(50)]
        public string Province { get; set; }

        [StringLength(50)]
        public string IdCard { get; set; }

        [StringLength(50)]
        public string TaxIdNo { get; set; }

        [StringLength(500)]
        public string Address { get; set; }

        [StringLength(500)]
        public string WorkingAddress { get; set; }

        public int? NumberChildren { get; set; }

        public int? NumberPatronized { get; set; }

        public int? NumberSchoolingChildren { get; set; }

        public int ApplicantId { get; set; }

        public virtual Applicant Applicant { get; set; }
    }
}
