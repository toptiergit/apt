namespace ApplicationForm.Models
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    [Table("Applicant")]
    public partial class Applicant
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public Applicant()
        {
            Brethren = new HashSet<Brethren>();
            Children = new HashSet<Children>();
            Disease = new HashSet<Disease>();
            Education = new HashSet<Education>();
            LanguageSkill = new HashSet<LanguageSkill>();
            Spouse = new HashSet<Spouse>();
            Training = new HashSet<Training>();
            WorkExperience = new HashSet<WorkExperience>();
        }
        [Key]
        [DatabaseGenerat‌ed(DatabaseGeneratedOp‌tion.None)]
        public int Id { get; set; }

        [Required]
        [StringLength(50)]
        public string FirstNameTh { get; set; }

        [Required]
        [StringLength(50)]
        public string LastNameTh { get; set; }

        [Required]
        [StringLength(50)]
        public string FirstNameEn { get; set; }

        [Required]
        [StringLength(50)]
        public string LastNameEn { get; set; }

        [StringLength(50)]
        public string Nickname { get; set; }

        [Required]
        [StringLength(10)]
        public string Sex { get; set; }
        [Required]
        public decimal Weight { get; set; }
        [Required]
        public decimal Height { get; set; }
        [Required]
        [Column(TypeName = "date")]
        public DateTime DateOfBirth { get; set; }

        public int Age { get; set; }

        [Required]
        [StringLength(2000)]
        public string PlaceOfBirth { get; set; }

        [Required]
        [StringLength(2000)]
        public string Address { get; set; }

        [Required]
        [StringLength(25)]
        public string Tel { get; set; }

        [StringLength(25)]
        public string HomePhone { get; set; }

        [StringLength(25)]
        public string TelOffice { get; set; }

        [StringLength(25)]
        public string TelExt { get; set; }

        [Required]
        [StringLength(50)]
        public string Email { get; set; }

        [Required]
        [StringLength(15)]
        public string Nationality { get; set; }

        [Required]
        [StringLength(15)]
        public string Religion { get; set; }

        [StringLength(20)]
        public string TaxNo { get; set; }

        [StringLength(20)]
        public string SocialSecurityNumber { get; set; }

        [StringLength(120)]
        public string Hospital { get; set; }

        [StringLength(20)]
        public string VISANo { get; set; }

        [StringLength(100)]
        public string VISAIssueAt { get; set; }

        [Column(TypeName = "date")]
        public DateTime? VISAIssueDate { get; set; }

        [Column(TypeName = "date")]
        public DateTime? VISAExpiryDate { get; set; }

        [StringLength(20)]
        public string WorkPermitNo { get; set; }

        [StringLength(100)]
        public string WorkPermitIssueAt { get; set; }

        [Column(TypeName = "date")]
        public DateTime? WorkPermitIssueDate { get; set; }

        [Column(TypeName = "date")]
        public DateTime? WorkPermitExpiryDate { get; set; }

        [Required]
        [StringLength(20)]
        public string IdNo { get; set; }

        [Required]
        [StringLength(100)]
        public string IdNoIssueAt { get; set; }
        [Required]
        [Column(TypeName = "date")]
        public DateTime IdNoExpiryDate { get; set; }

        [StringLength(10)]
        public string BloodGroup { get; set; }
        [Required]
        public bool SoldierUsed { get; set; }

        [StringLength(500)]
        public string SoldierReason { get; set; }

        [Required]
        [StringLength(200)]
        public string FatherName { get; set; }
        [Required]
        public bool FatherStatus { get; set; }

        public int? FatherAge { get; set; }

        [StringLength(50)]
        public string FatherOccupation { get; set; }

        [StringLength(50)]
        public string FatherNationality { get; set; }

        [StringLength(50)]
        public string FatherCitizenship { get; set; }

        [StringLength(500)]
        public string FatherAddress { get; set; }

        [Required]
        [StringLength(200)]
        public string MotherName { get; set; }
        [Required]
        public bool MotherStatus { get; set; }

        public int? MotherAge { get; set; }

        [StringLength(50)]
        public string MotherOccupation { get; set; }

        [StringLength(50)]
        public string MotherNationality { get; set; }

        [StringLength(50)]
        public string MotherCitizenship { get; set; }

        [StringLength(500)]
        public string MotherAddress { get; set; }

        [StringLength(50)]
        public string Marital { get; set; }

        [StringLength(1000)]
        public string ComputerSkill { get; set; }

        [StringLength(1000)]
        public string OfficeSkill { get; set; }

        [StringLength(50)]
        public string CarLicenseNo { get; set; }

        [StringLength(50)]
        public string CarLicenseType { get; set; }

        [Column(TypeName = "date")]
        public DateTime? CarLicenseExpiryDate { get; set; }

        [StringLength(50)]
        public string MotorcycleLicenseNo { get; set; }

        [StringLength(50)]
        public string MotorcycleLicenseType { get; set; }

        [Column(TypeName = "date")]
        public DateTime? MotorcycleLicenseExpiryDate { get; set; }

        [StringLength(50)]
        public string InternationalDrivingLicenseNo { get; set; }

        [StringLength(50)]
        public string InternationalIssueCountry { get; set; }

        [Column(TypeName = "date")]
        public DateTime? InternationalExpiryDate { get; set; }
        public DateTime? UpdatedOn { get; set; }

        [StringLength(500)]
        [DataType(DataType.MultilineText)]
        public string OtherSkill { get; set; }

        [StringLength(1000)]
        [DataType(DataType.MultilineText)]
        public string ExtraActivities { get; set; }
        public bool SendMailStatus { get; set; }

        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<Brethren> Brethren { get; set; }

        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<Children> Children { get; set; }

        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<Disease> Disease { get; set; }

        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<Education> Education { get; set; }

        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<LanguageSkill> LanguageSkill { get; set; }

        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<Spouse> Spouse { get; set; }

        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<Training> Training { get; set; }

        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<WorkExperience> WorkExperience { get; set; }
    }
}
