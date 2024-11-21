namespace ApplicationForm.Models
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    [Table("Brethren")]
    public partial class Brethren
    {
        public int Id { get; set; }

        [Required]
        [StringLength(150)]
        public string Name { get; set; }

        public int? Age { get; set; }

        [StringLength(150)]
        public string Occupation { get; set; }

        [StringLength(500)]
        public string OfficeAddress { get; set; }

        public int ApplicantId { get; set; }

        public virtual Applicant Applicant { get; set; }
    }
}
