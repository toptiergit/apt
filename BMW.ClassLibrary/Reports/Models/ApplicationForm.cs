namespace Reports.Models
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;

    public partial class ApplicationForm
    {
        public int Id { get; set; }

        [Required(ErrorMessage = "*")]
        [StringLength(50)]
        public string FirstNameTh { get; set; }

        [Required(ErrorMessage = "*")]

        [StringLength(50)]
        public string LastNameTh { get; set; }

        [Required(ErrorMessage = "*")]
        [StringLength(50)]
        public string FirstNameEn { get; set; }

        [Required(ErrorMessage = "*")]
        [StringLength(50)]
        public string LastNameEn { get; set; }

        [StringLength(50)]
        public string Nickname { get; set; }

        [Required(ErrorMessage = "*")]
        [StringLength(10)]
        public string Sex { get; set; }

        [Required(ErrorMessage = "*")]
        public decimal Weight { get; set; }

        [Required(ErrorMessage = "*")]
        public decimal Height { get; set; }

        [Required(ErrorMessage = "*")]
        [DataType(DataType.Date)]
        [DisplayFormat(DataFormatString = "{0:yyyy-MM-dd}", ApplyFormatInEditMode = true)]
        public DateTime? DateOfBirth { get; set; }

        //[Required(ErrorMessage = "*")]
        public int Age { get; set; }

        [StringLength(2000)]
        public string PlaceOfBirth { get; set; }

        [Required(ErrorMessage = "*")]
        [StringLength(2000)]
        public string Address { get; set; }

        [Required(ErrorMessage = "*")]
        [StringLength(25)]
        public string Tel { get; set; }

        [StringLength(25)]
        public string HomePhone { get; set; }

        [StringLength(25)]
        public string TelOffice { get; set; }

        [StringLength(25)]
        public string TelExt { get; set; }

        [Required(ErrorMessage = "*")]
        [StringLength(50)]
        public string Email { get; set; }

        [Required(ErrorMessage = "*")]
        [StringLength(15)]
        public string Nationality { get; set; }

        [Required(ErrorMessage = "*")]
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

        [DataType(DataType.Date)]
        [DisplayFormat(DataFormatString = "{0:yyyy-MM-dd}", ApplyFormatInEditMode = true)]
        public DateTime? VISAIssueDate { get; set; }

        [DataType(DataType.Date)]
        [DisplayFormat(DataFormatString = "{0:yyyy-MM-dd}", ApplyFormatInEditMode = true)]
        public DateTime? VISAExpiryDate { get; set; }

        [StringLength(20)]
        public string WorkPermitNo { get; set; }

        [StringLength(100)]
        public string WorkPermitIssueAt { get; set; }

        [DataType(DataType.Date)]
        [DisplayFormat(DataFormatString = "{0:yyyy-MM-dd}", ApplyFormatInEditMode = true)]
        public DateTime? WorkPermitIssueDate { get; set; }

        [DataType(DataType.Date)]
        [DisplayFormat(DataFormatString = "{0:yyyy-MM-dd}", ApplyFormatInEditMode = true)]
        public DateTime? WorkPermitExpiryDate { get; set; }

        [Required(ErrorMessage = "*")]
        [StringLength(20)]
        public string IdNo { get; set; }

        [Required(ErrorMessage = "*")]
        [StringLength(100)]
        public string IdNoIssueAt { get; set; }
        
        [Required(ErrorMessage = "*")]
        [DataType(DataType.Date)]
        [DisplayFormat(DataFormatString = "{0:yyyy-MM-dd}", ApplyFormatInEditMode = true)]
        public DateTime IdNoExpiryDate { get; set; }

        [StringLength(10)]
        public string BloodGroup { get; set; }

        public bool SoldierUsed { get; set; }

        [StringLength(500)]
        public string SoldierReason { get; set; }

        [Required(ErrorMessage = "*")]
        [StringLength(200)]
        public string FatherName { get; set; }

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

        [Required(ErrorMessage = "*")]
        [StringLength(200)]
        public string MotherName { get; set; }

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
        public string Marital { get; set; }

        [StringLength(1000)]
        [DataType(DataType.MultilineText)]
        public string ExtraActivities { get; set; }


        //Brethren------------------------------------
        [StringLength(150)]
        public string BrethrenName1 { get; set; }
        public int? BrethrenAge1 { get; set; }
        [StringLength(150)]
        public string BrethrenOccupation1 { get; set; }
        [StringLength(500)]
        public string BrethrenOfficeAddress1 { get; set; }

        [StringLength(150)]
        public string BrethrenName2 { get; set; }
        public int? BrethrenAge2 { get; set; }
        [StringLength(150)]
        public string BrethrenOccupation2 { get; set; }
        [StringLength(500)]
        public string BrethrenOfficeAddress2 { get; set; }

        [StringLength(150)]
        public string BrethrenName3 { get; set; }
        public int? BrethrenAge3 { get; set; }
        [StringLength(150)]
        public string BrethrenOccupation3 { get; set; }
        [StringLength(500)]
        public string BrethrenOfficeAddress3 { get; set; }

        [StringLength(150)]
        public string BrethrenName4 { get; set; }
        public int? BrethrenAge4 { get; set; }
        [StringLength(150)]
        public string BrethrenOccupation4 { get; set; }
        [StringLength(500)]
        public string BrethrenOfficeAddress4 { get; set; }

        [StringLength(150)]
        public string BrethrenName5 { get; set; }
        public int? BrethrenAge5 { get; set; }
        [StringLength(150)]
        public string BrethrenOccupation5 { get; set; }
        [StringLength(500)]
        public string BrethrenOfficeAddress5 { get; set; }

        [StringLength(150)]
        public string BrethrenName6 { get; set; }
        public int? BrethrenAge6 { get; set; }
        [StringLength(150)]
        public string BrethrenOccupation6 { get; set; }
        [StringLength(500)]
        public string BrethrenOfficeAddress6 { get; set; }


        //Spouse
        [StringLength(200)]
        public string SpouseName { get; set; }

        [StringLength(50)]
        public string SpouseOccupation { get; set; }

        public int? SpouseAge { get; set; }

        public int? SpouseRegisteredYear { get; set; }

        [StringLength(50)]
        public string SpouseDistrict { get; set; }

        [StringLength(50)]
        public string SpousProvince { get; set; }

        [StringLength(50)]
        public string SpousIdCard { get; set; }

        [StringLength(50)]
        public string SpousTaxIdNo { get; set; }

        [StringLength(500)]
        public string SpouseAddress { get; set; }

        [StringLength(500)]
        public string SpouseWorkingAddress { get; set; }

        public int? SpouseNumberChildren { get; set; }

        public int? SpouseNumberPatronized { get; set; }

        public int? SpouseNumberSchoolingChildren { get; set; }

        //Children
        public string ChildrenName1 { get; set; }

        [DataType(DataType.Date)]
        [DisplayFormat(DataFormatString = "{0:yyyy-MM-dd}", ApplyFormatInEditMode = true)]
        public DateTime? ChildrenBirthday1 { get; set; }

        public string ChildrenIdCardNo1 { get; set; }

        public string ChildrenSchoolOfficeAddress1 { get; set; }
        public string ChildrenName2 { get; set; }

        [DataType(DataType.Date)]
        [DisplayFormat(DataFormatString = "{0:yyyy-MM-dd}", ApplyFormatInEditMode = true)]
        public DateTime? ChildrenBirthday2 { get; set; }

        public string ChildrenIdCardNo2 { get; set; }

        public string ChildrenSchoolOfficeAddress2 { get; set; }
        public string ChildrenName3 { get; set; }

        [DataType(DataType.Date)]
        [DisplayFormat(DataFormatString = "{0:yyyy-MM-dd}", ApplyFormatInEditMode = true)]
        public DateTime? ChildrenBirthday3 { get; set; }

        public string ChildrenIdCardNo3 { get; set; }

        public string ChildrenSchoolOfficeAddress3 { get; set; }
        public string ChildrenName4 { get; set; }

        [DataType(DataType.Date)]
        [DisplayFormat(DataFormatString = "{0:yyyy-MM-dd}", ApplyFormatInEditMode = true)]
        public DateTime? ChildrenBirthday4 { get; set; }

        public string ChildrenIdCardNo4 { get; set; }

        public string ChildrenSchoolOfficeAddress4 { get; set; }
        public string ChildrenName5 { get; set; }

        [DataType(DataType.Date)]
        [DisplayFormat(DataFormatString = "{0:yyyy-MM-dd}", ApplyFormatInEditMode = true)]
        public DateTime? ChildrenBirthday5 { get; set; }

        public string ChildrenIdCardNo5 { get; set; }

        public string ChildrenSchoolOfficeAddress5 { get; set; }
        public string ChildrenName6 { get; set; }

        [DataType(DataType.Date)]
        [DisplayFormat(DataFormatString = "{0:yyyy-MM-dd}", ApplyFormatInEditMode = true)]
        public DateTime? ChildrenBirthday6 { get; set; }

        public string ChildrenIdCardNo6 { get; set; }

        public string ChildrenSchoolOfficeAddress6 { get; set; }

        //Education
        [StringLength(200)]
        public string EducationName1 { get; set; }
        [StringLength(200)]
        public string EducationLevel1 { get; set; }
        public int? EducationFromYear1 { get; set; }
        public int? EducationToYear1 { get; set; }
        [StringLength(200)]
        public string EducationCertificateDegree1 { get; set; }
        public decimal? EducationGrade1 { get; set; }
        [StringLength(200)]
        public string EducationMajor1 { get; set; }


        [StringLength(200)]
        public string EducationName2 { get; set; }
        [StringLength(200)]
        public string EducationLevel2 { get; set; }
        public int? EducationFromYear2 { get; set; }
        public int? EducationToYear2 { get; set; }
        [StringLength(200)]
        public string EducationCertificateDegree2 { get; set; }
        public decimal? EducationGrade2 { get; set; }
        [StringLength(200)]
        public string EducationMajor2 { get; set; }


        [StringLength(200)]
        public string EducationName3 { get; set; }
        [StringLength(200)]
        public string EducationLevel3 { get; set; }
        public int? EducationFromYear3 { get; set; }
        public int? EducationToYear3 { get; set; }
        [StringLength(200)]
        public string EducationCertificateDegree3 { get; set; }
        public decimal? EducationGrade3 { get; set; }
        [StringLength(200)]
        public string EducationMajor3 { get; set; }

        [StringLength(200)]
        public string EducationName4 { get; set; }
        [StringLength(200)]
        public string EducationLevel4 { get; set; }
        public int? EducationFromYear4 { get; set; }
        public int? EducationToYear4 { get; set; }
        [StringLength(200)]
        public string EducationCertificateDegree4 { get; set; }
        public decimal? EducationGrade4 { get; set; }
        [StringLength(200)]
        public string EducationMajor4 { get; set; }


        //Training
        [StringLength(200)]
        public string TrainingCourse1 { get; set; }

        [StringLength(200)]
        public string TrainingHoldBy1 { get; set; }

        [StringLength(100)]
        public string TrainingPeriod1 { get; set; }

        [StringLength(200)]
        public string TrainingCourse2 { get; set; }

        [StringLength(200)]
        public string TrainingHoldBy2 { get; set; }

        [StringLength(100)]
        public string TrainingPeriod2 { get; set; }

        [StringLength(200)]
        public string TrainingCourse3 { get; set; }

        [StringLength(200)]
        public string TrainingHoldBy3 { get; set; }

        [StringLength(100)]
        public string TrainingPeriod3 { get; set; }

        [StringLength(200)]
        public string TrainingCourse4 { get; set; }

        [StringLength(200)]
        public string TrainingHoldBy4 { get; set; }

        [StringLength(100)]
        public string TrainingPeriod4 { get; set; }

        //LanguageSkill
        [StringLength(50)]
        public string LanguageSkillLanguage1 { get; set; }

        [StringLength(50)]
        public string LanguageSkillSpeaking1 { get; set; }

        [StringLength(50)]
        public string LanguageSkillReading1 { get; set; }

        [StringLength(50)]
        public string LanguageSkillWriting1 { get; set; }

        [StringLength(50)]
        public string LanguageSkillLanguage2 { get; set; }

        [StringLength(50)]
        public string LanguageSkillSpeaking2 { get; set; }

        [StringLength(50)]
        public string LanguageSkillReading2 { get; set; }

        [StringLength(50)]
        public string LanguageSkillWriting2 { get; set; }

        [StringLength(50)]
        public string LanguageSkillLanguage3 { get; set; }

        [StringLength(50)]
        public string LanguageSkillSpeaking3 { get; set; }

        [StringLength(50)]
        public string LanguageSkillReading3 { get; set; }

        [StringLength(50)]
        public string LanguageSkillWriting3 { get; set; }

        [StringLength(50)]
        public string LanguageSkillLanguage4 { get; set; }

        [StringLength(50)]
        public string LanguageSkillSpeaking4 { get; set; }

        [StringLength(50)]
        public string LanguageSkillReading4 { get; set; }

        [StringLength(50)]
        public string LanguageSkillWriting4 { get; set; }

        //Other Skill -------------------------------------
        [StringLength(1000)]
        public string ComputerSkill { get; set; }
        [StringLength(1000)]
        public string OfficeSkill { get; set; }
        [StringLength(50)]
        public string CarLicenseNo { get; set; }

        [StringLength(50)]
        public string CarLicenseType { get; set; }
        [DataType(DataType.Date)]
        [DisplayFormat(DataFormatString = "{0:yyyy-MM-dd}", ApplyFormatInEditMode = true)]
        public DateTime? CarLicenseExpiryDate { get; set; }

        [StringLength(50)]
        public string MotorcycleLicenseNo { get; set; }

        [StringLength(50)]
        public string MotorcycleLicenseType { get; set; }
        [DataType(DataType.Date)]
        [DisplayFormat(DataFormatString = "{0:yyyy-MM-dd}", ApplyFormatInEditMode = true)]
        public DateTime? MotorcycleLicenseExpiryDate { get; set; }

        [StringLength(50)]
        public string InternationalDrivingLicenseNo { get; set; }

        [StringLength(50)]
        public string InternationalIssueCountry { get; set; }
        [DataType(DataType.Date)]
        [DisplayFormat(DataFormatString = "{0:yyyy-MM-dd}", ApplyFormatInEditMode = true)]
        public DateTime? InternationalExpiryDate { get; set; }

        [StringLength(500)]
        [DataType(DataType.MultilineText)]
        public string OtherSkill { get; set; }

        //WorkExperience ------------------------------
        [StringLength(1000)]
        public string WorkExperienceName1 { get; set; }
        [StringLength(50)]
        public string WorkExperienceWorkFrom1 { get; set; }
        [StringLength(50)]
        public string WorkExperienceWorkTo1 { get; set; }
        [StringLength(50)]
        public string WorkExperiencePosition1 { get; set; }
        [StringLength(1000)]
        public string WorkExperienceResponsibility1 { get; set; }
        public decimal? WorkExperienceSalaryStart1 { get; set; }
        public decimal? WorkExperienceSalaryEnd1 { get; set; }
        [StringLength(500)]
        public string WorkExperienceReasonLeaving1 { get; set; }

        [StringLength(1000)]
        public string WorkExperienceName2 { get; set; }
        [StringLength(50)]
        public string WorkExperienceWorkFrom2 { get; set; }
        [StringLength(50)]
        public string WorkExperienceWorkTo2 { get; set; }
        [StringLength(50)]
        public string WorkExperiencePosition2 { get; set; }
        [StringLength(1000)]
        public string WorkExperienceResponsibility2 { get; set; }
        public decimal? WorkExperienceSalaryStart2 { get; set; }
        public decimal? WorkExperienceSalaryEnd2 { get; set; }
        [StringLength(500)]
        public string WorkExperienceReasonLeaving2 { get; set; }

        [StringLength(1000)]
        public string WorkExperienceName3 { get; set; }
        [StringLength(50)]
        public string WorkExperienceWorkFrom3 { get; set; }
        [StringLength(50)]
        public string WorkExperienceWorkTo3 { get; set; }
        [StringLength(50)]
        public string WorkExperiencePosition3 { get; set; }
        [StringLength(1000)]
        public string WorkExperienceResponsibility3 { get; set; }
        public decimal? WorkExperienceSalaryStart3 { get; set; }
        public decimal? WorkExperienceSalaryEnd3 { get; set; }
        [StringLength(500)]
        public string WorkExperienceReasonLeaving3 { get; set; }

        [StringLength(1000)]
        public string WorkExperienceName4 { get; set; }
        [StringLength(50)]
        public string WorkExperienceWorkFrom4 { get; set; }
        [StringLength(50)]
        public string WorkExperienceWorkTo4 { get; set; }
        [StringLength(50)]
        public string WorkExperiencePosition4 { get; set; }
        [StringLength(1000)]
        public string WorkExperienceResponsibility4 { get; set; }
        public decimal? WorkExperienceSalaryStart4 { get; set; }
        public decimal? WorkExperienceSalaryEnd4 { get; set; }
        [StringLength(500)]
        public string WorkExperienceReasonLeaving4 { get; set; }

        //Disease -----------------------------------------------
        [StringLength(100)]
        public string DiseaseName1 { get; set; }
        [StringLength(500)]
        public string DiseaseRemark1 { get; set; }
        [StringLength(500)]
        public string DiseaseDrugAllergy1 { get; set; }

        [StringLength(100)]
        public string DiseaseName2 { get; set; }
        [StringLength(500)]
        public string DiseaseRemark2 { get; set; }
        [StringLength(500)]
        public string DiseaseDrugAllergy2 { get; set; }

        [StringLength(100)]
        public string DiseaseName3 { get; set; }
        [StringLength(500)]
        public string DiseaseRemark3 { get; set; }
        [StringLength(500)]
        public string DiseaseDrugAllergy3 { get; set; }

        [StringLength(100)]
        public string DiseaseName4 { get; set; }
        [StringLength(500)]
        public string DiseaseRemark4 { get; set; }
        [StringLength(500)]
        public string DiseaseDrugAllergy4 { get; set; }
    }
}
