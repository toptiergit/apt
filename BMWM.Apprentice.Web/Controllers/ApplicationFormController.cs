using ApplicationForm.Models;
using BMWM.Apprentice.Web.AuthWebService;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Net;
using System.Net.Mail;
using System.Web;
using System.Web.Mvc;


namespace ApplicationForm.Controllers
{
    public class ApplicationFormController : Controller
    {
        public ActionResult Index()
        {
            using (var db = new DBContext.ApprenticeDB())
            {
                //var applicationForm = new Models.ApplicationForm();
                //var applicant = db.Applicants.Find(5);
                //applicationForm.FirstNameTh = applicant.FirstNameTh;
                ViewBag.IsRegister = false;
                return View();
            }
        }
        [HttpPost]
        public ActionResult Index(string email)
        {

            using (var oDb = new DBContext.ApprenticeDB())
            {
                if (oDb.auth_User.Where(e => (e.Id==email) && e.IsActive).Count() > 0)
                {
                    ViewBag.IsRegister = true;
                    return View();
                }else
                    ViewBag.IsRegister = false;
            }
            Models.ApplicationForm applicationForm = GetApplicantByEmail(email);
            return View("MangeApplicant", applicationForm);
        }
        [AuthorizeUser]
        public ActionResult Home()
        {
            using (var db = new DBContext.ApprenticeDB())
            {
                //var applicationForm = new Models.ApplicationForm();
                //var applicant = db.Applicants.Find(5);
                //applicationForm.FirstNameTh = applicant.FirstNameTh;
                return View();
            }
        }

        private static int calulateAge(DateTime birthdate)
        {
            // Save today's date.
            var today = DateTime.Today;

            // Calculate the age.
            var age = today.Year - birthdate.Year;

            // Go back to the year in which the person was born in case of a leap year
            if (birthdate.Date > today.AddYears(-age)) age--;

            return age;
        }
        public static Models.ApplicationForm GetApplicantById(int ApplicantId)
        {
            using (var db = new DBContext.ApprenticeDB())
            {
                var applicationForm = new Models.ApplicationForm();
                var applicant = db.Applicants.FirstOrDefault(e => e.Id == ApplicantId);

                if (applicant != null)
                {
                    applicationForm.FirstNameTh = applicant.FirstNameTh;
                    applicationForm.LastNameTh = applicant.LastNameTh;
                    applicationForm.LastNameTh = applicant.LastNameTh;
                    applicationForm.FirstNameEn = applicant.FirstNameEn;
                    applicationForm.LastNameEn = applicant.LastNameEn;
                    applicationForm.Nickname = applicant.Nickname;
                    applicationForm.Sex = applicant.Sex;
                    applicationForm.Weight = applicant.Weight;
                    applicationForm.Height = applicant.Height;
                    applicationForm.DateOfBirth = applicant.DateOfBirth;
                    applicationForm.Age = calulateAge(applicant.DateOfBirth);
                    applicationForm.PlaceOfBirth = applicant.PlaceOfBirth;
                    applicationForm.Address = applicant.Address;
                    applicationForm.HomePhone = applicant.HomePhone;
                    applicationForm.Tel = applicant.Tel;
                    applicationForm.TelOffice = applicant.TelOffice;
                    applicationForm.TelExt = applicant.TelExt;
                    applicationForm.Email = applicant.Email;
                    applicationForm.Nationality = applicant.Nationality;
                    applicationForm.Religion = applicant.Religion;
                    applicationForm.TaxNo = applicant.TaxNo;
                    applicationForm.SocialSecurityNumber = applicant.SocialSecurityNumber;
                    applicationForm.Hospital = applicant.Hospital;
                    applicationForm.VISANo = applicant.VISANo;
                    applicationForm.VISAIssueAt = applicant.VISAIssueAt;
                    applicationForm.VISAIssueDate = applicant.VISAIssueDate;
                    applicationForm.VISAExpiryDate = applicant.VISAExpiryDate;
                    applicationForm.WorkPermitNo = applicant.WorkPermitNo;
                    applicationForm.WorkPermitIssueAt = applicant.WorkPermitIssueAt;
                    applicationForm.WorkPermitIssueDate = applicant.WorkPermitIssueDate;
                    applicationForm.WorkPermitExpiryDate = applicant.WorkPermitExpiryDate;
                    applicationForm.IdNo = applicant.IdNo;
                    applicationForm.IdNoIssueAt = applicant.IdNoIssueAt;
                    applicationForm.IdNoExpiryDate = applicant.IdNoExpiryDate;
                    applicationForm.BloodGroup = applicant.BloodGroup;
                    applicationForm.SoldierUsed = applicant.SoldierUsed;
                    applicationForm.SoldierReason = applicant.SoldierReason;
                    applicationForm.FatherName = applicant.FatherName;
                    applicationForm.FatherStatus = applicant.FatherStatus;
                    applicationForm.FatherAge = applicant.FatherAge;
                    applicationForm.FatherOccupation = applicant.FatherOccupation;
                    applicationForm.FatherNationality = applicant.FatherNationality;
                    applicationForm.FatherCitizenship = applicant.FatherCitizenship;
                    applicationForm.FatherAddress = applicant.FatherAddress;
                    applicationForm.MotherName = applicant.MotherName;
                    applicationForm.MotherStatus = applicant.MotherStatus;
                    applicationForm.MotherAge = applicant.MotherAge;
                    applicationForm.MotherOccupation = applicant.MotherOccupation;
                    applicationForm.MotherNationality = applicant.MotherNationality;
                    applicationForm.MotherCitizenship = applicant.MotherCitizenship;
                    applicationForm.MotherAddress = applicant.MotherAddress;
                    applicationForm.Marital = applicant.Marital;
                    applicationForm.ComputerSkill = applicant.ComputerSkill;
                    applicationForm.OfficeSkill = applicant.OfficeSkill;
                    applicationForm.CarLicenseNo = applicant.CarLicenseNo;
                    applicationForm.CarLicenseType = applicant.CarLicenseType;
                    applicationForm.CarLicenseExpiryDate = applicant.CarLicenseExpiryDate;
                    applicationForm.MotorcycleLicenseNo = applicant.MotorcycleLicenseNo;
                    applicationForm.MotorcycleLicenseType = applicant.MotorcycleLicenseType;
                    applicationForm.MotorcycleLicenseExpiryDate = applicant.MotorcycleLicenseExpiryDate;
                    applicationForm.InternationalDrivingLicenseNo = applicant.InternationalDrivingLicenseNo;
                    applicationForm.InternationalIssueCountry = applicant.InternationalIssueCountry;
                    applicationForm.InternationalExpiryDate = applicant.InternationalExpiryDate;
                    applicationForm.OtherSkill = applicant.OtherSkill;
                    applicationForm.ExtraActivities = applicant.ExtraActivities;

                    GetDisease(applicationForm, applicant);
                    GetBrethren(applicationForm, applicant);
                    GetSpouse(applicationForm, applicant);
                    GetChildren(applicationForm, applicant);
                    GetEducation(applicationForm, applicant);
                    GetTraining(applicationForm, applicant);
                    GetLanguageSkill(applicationForm, applicant);
                    GetWorkExperience(applicationForm, applicant);
                }

                return applicationForm;
            }

        }

        public static Models.ApplicationForm GetApplicantByEmail(string email)
        {
            using (var db = new DBContext.ApprenticeDB())
            {
                var applicationForm = new Models.ApplicationForm();
                var applicant = db.Applicants.FirstOrDefault(e => e.Email == email);

                if (applicant != null)
                {
                    applicationForm.FirstNameTh = applicant.FirstNameTh;
                    applicationForm.LastNameTh = applicant.LastNameTh;
                    applicationForm.LastNameTh = applicant.LastNameTh;
                    applicationForm.FirstNameEn = applicant.FirstNameEn;
                    applicationForm.LastNameEn = applicant.LastNameEn;
                    applicationForm.Nickname = applicant.Nickname;
                    applicationForm.Sex = applicant.Sex;
                    applicationForm.Weight = applicant.Weight;
                    applicationForm.Height = applicant.Height;
                    applicationForm.DateOfBirth = applicant.DateOfBirth;
                    applicationForm.Age = applicant.Age;
                    applicationForm.PlaceOfBirth = applicant.PlaceOfBirth;
                    applicationForm.Address = applicant.Address;
                    applicationForm.HomePhone = applicant.HomePhone;
                    applicationForm.Tel = applicant.Tel;
                    applicationForm.TelOffice = applicant.TelOffice;
                    applicationForm.TelExt = applicant.TelExt;
                    applicationForm.Email = applicant.Email;
                    applicationForm.Nationality = applicant.Nationality;
                    applicationForm.Religion = applicant.Religion;
                    applicationForm.TaxNo = applicant.TaxNo;
                    applicationForm.SocialSecurityNumber = applicant.SocialSecurityNumber;
                    applicationForm.Hospital = applicant.Hospital;
                    applicationForm.VISANo = applicant.VISANo;
                    applicationForm.VISAIssueAt = applicant.VISAIssueAt;
                    applicationForm.VISAIssueDate = applicant.VISAIssueDate;
                    applicationForm.VISAExpiryDate = applicant.VISAExpiryDate;
                    applicationForm.WorkPermitNo = applicant.WorkPermitNo;
                    applicationForm.WorkPermitIssueAt = applicant.WorkPermitIssueAt;
                    applicationForm.WorkPermitIssueDate = applicant.WorkPermitIssueDate;
                    applicationForm.WorkPermitExpiryDate = applicant.WorkPermitExpiryDate;
                    applicationForm.IdNo = applicant.IdNo;
                    applicationForm.IdNoIssueAt = applicant.IdNoIssueAt;
                    applicationForm.IdNoExpiryDate = applicant.IdNoExpiryDate;
                    applicationForm.BloodGroup = applicant.BloodGroup;
                    applicationForm.SoldierUsed = applicant.SoldierUsed;
                    applicationForm.SoldierReason = applicant.SoldierReason;
                    applicationForm.FatherName = applicant.FatherName;
                    applicationForm.FatherStatus = applicant.FatherStatus;
                    applicationForm.FatherAge = applicant.FatherAge;
                    applicationForm.FatherOccupation = applicant.FatherOccupation;
                    applicationForm.FatherNationality = applicant.FatherNationality;
                    applicationForm.FatherCitizenship = applicant.FatherCitizenship;
                    applicationForm.FatherAddress = applicant.FatherAddress;
                    applicationForm.MotherName = applicant.MotherName;
                    applicationForm.MotherStatus = applicant.MotherStatus;
                    applicationForm.MotherAge = applicant.MotherAge;
                    applicationForm.MotherOccupation = applicant.MotherOccupation;
                    applicationForm.MotherNationality = applicant.MotherNationality;
                    applicationForm.MotherCitizenship = applicant.MotherCitizenship;
                    applicationForm.MotherAddress = applicant.MotherAddress;
                    applicationForm.Marital = applicant.Marital;
                    applicationForm.ComputerSkill = applicant.ComputerSkill;
                    applicationForm.OfficeSkill = applicant.OfficeSkill;
                    applicationForm.CarLicenseNo = applicant.CarLicenseNo;
                    applicationForm.CarLicenseType = applicant.CarLicenseType;
                    applicationForm.CarLicenseExpiryDate = applicant.CarLicenseExpiryDate;
                    applicationForm.MotorcycleLicenseNo = applicant.MotorcycleLicenseNo;
                    applicationForm.MotorcycleLicenseType = applicant.MotorcycleLicenseType;
                    applicationForm.MotorcycleLicenseExpiryDate = applicant.MotorcycleLicenseExpiryDate;
                    applicationForm.InternationalDrivingLicenseNo = applicant.InternationalDrivingLicenseNo;
                    applicationForm.InternationalIssueCountry = applicant.InternationalIssueCountry;
                    applicationForm.InternationalExpiryDate = applicant.InternationalExpiryDate;
                    applicationForm.OtherSkill = applicant.OtherSkill;
                    applicationForm.ExtraActivities = applicant.ExtraActivities;

                    GetDisease(applicationForm, applicant);
                    GetBrethren(applicationForm, applicant);
                    GetSpouse(applicationForm, applicant);
                    GetChildren(applicationForm, applicant);
                    GetEducation(applicationForm, applicant);
                    GetTraining(applicationForm, applicant);
                    GetLanguageSkill(applicationForm, applicant);
                    GetWorkExperience(applicationForm, applicant);
                }

                return applicationForm;
            }

        }

        private static void GetWorkExperience(Models.ApplicationForm applicationForm, Models.Applicant applicant)
        {
            int loop = 1;
            foreach (var workExperience in applicant.WorkExperience)
            {
                if (loop == 1)
                {
                    applicationForm.WorkExperienceName1 = workExperience.Name;
                    applicationForm.WorkExperienceWorkFrom1 = workExperience.WorkFrom;
                    applicationForm.WorkExperienceWorkTo1 = workExperience.WorkTo;
                    applicationForm.WorkExperiencePosition1 = workExperience.Position;
                    applicationForm.WorkExperienceResponsibility1 = workExperience.Responsibility;
                    applicationForm.WorkExperienceSalaryStart1 = workExperience.SalaryStart;
                    applicationForm.WorkExperienceSalaryEnd1 = workExperience.SalaryEnd;
                    applicationForm.WorkExperienceReasonLeaving1 = workExperience.ReasonLeaving;
                }
                else if (loop == 2)
                {
                    applicationForm.WorkExperienceName2 = workExperience.Name;
                    applicationForm.WorkExperienceWorkFrom2 = workExperience.WorkFrom;
                    applicationForm.WorkExperienceWorkTo2 = workExperience.WorkTo;
                    applicationForm.WorkExperiencePosition2 = workExperience.Position;
                    applicationForm.WorkExperienceResponsibility2 = workExperience.Responsibility;
                    applicationForm.WorkExperienceSalaryStart2 = workExperience.SalaryStart;
                    applicationForm.WorkExperienceSalaryEnd2 = workExperience.SalaryEnd;
                    applicationForm.WorkExperienceReasonLeaving2 = workExperience.ReasonLeaving;
                }
                else if (loop == 3)
                {
                    applicationForm.WorkExperienceName3 = workExperience.Name;
                    applicationForm.WorkExperienceWorkFrom3 = workExperience.WorkFrom;
                    applicationForm.WorkExperienceWorkTo3 = workExperience.WorkTo;
                    applicationForm.WorkExperiencePosition3 = workExperience.Position;
                    applicationForm.WorkExperienceResponsibility3 = workExperience.Responsibility;
                    applicationForm.WorkExperienceSalaryStart3 = workExperience.SalaryStart;
                    applicationForm.WorkExperienceSalaryEnd3 = workExperience.SalaryEnd;
                    applicationForm.WorkExperienceReasonLeaving3 = workExperience.ReasonLeaving;
                }
                else if (loop == 4)
                {
                    applicationForm.WorkExperienceName4 = workExperience.Name;
                    applicationForm.WorkExperienceWorkFrom4 = workExperience.WorkFrom;
                    applicationForm.WorkExperienceWorkTo4 = workExperience.WorkTo;
                    applicationForm.WorkExperiencePosition4 = workExperience.Position;
                    applicationForm.WorkExperienceResponsibility4 = workExperience.Responsibility;
                    applicationForm.WorkExperienceSalaryStart4 = workExperience.SalaryStart;
                    applicationForm.WorkExperienceSalaryEnd4 = workExperience.SalaryEnd;
                    applicationForm.WorkExperienceReasonLeaving4 = workExperience.ReasonLeaving;
                }
                loop++;
            }
        }

        private static void GetLanguageSkill(Models.ApplicationForm applicationForm, Models.Applicant applicant)
        {
            int loop = 1;
            foreach (var languageSkill in applicant.LanguageSkill)
            {
                if (loop == 1)
                {
                    applicationForm.LanguageSkillLanguage1 = languageSkill.Language;
                    applicationForm.LanguageSkillSpeaking1 = languageSkill.Speaking;
                    applicationForm.LanguageSkillReading1 = languageSkill.Reading;
                    applicationForm.LanguageSkillWriting1 = languageSkill.Writing;
                }
                else if (loop == 2)
                {
                    applicationForm.LanguageSkillLanguage2 = languageSkill.Language;
                    applicationForm.LanguageSkillSpeaking2 = languageSkill.Speaking;
                    applicationForm.LanguageSkillReading2 = languageSkill.Reading;
                    applicationForm.LanguageSkillWriting2 = languageSkill.Writing;
                }
                else if (loop == 3)
                {
                    applicationForm.LanguageSkillLanguage3 = languageSkill.Language;
                    applicationForm.LanguageSkillSpeaking3 = languageSkill.Speaking;
                    applicationForm.LanguageSkillReading3 = languageSkill.Reading;
                    applicationForm.LanguageSkillWriting3 = languageSkill.Writing;
                }
                else if (loop == 4)
                {
                    applicationForm.LanguageSkillLanguage4 = languageSkill.Language;
                    applicationForm.LanguageSkillSpeaking4 = languageSkill.Speaking;
                    applicationForm.LanguageSkillReading4 = languageSkill.Reading;
                    applicationForm.LanguageSkillWriting4 = languageSkill.Writing;
                }
                loop++;
            }
        }

        private static void GetTraining(Models.ApplicationForm applicationForm, Models.Applicant applicant)
        {
            int loop = 1;
            foreach (var training in applicant.Training)
            {
                if (loop == 1)
                {
                    applicationForm.TrainingCourse1 = training.Course;
                    applicationForm.TrainingHoldBy1 = training.HoldBy;
                    applicationForm.TrainingPeriod1 = training.Period;
                }
                else if (loop == 2)
                {
                    applicationForm.TrainingCourse2 = training.Course;
                    applicationForm.TrainingHoldBy2 = training.HoldBy;
                    applicationForm.TrainingPeriod2 = training.Period;
                }
                else if (loop == 3)
                {
                    applicationForm.TrainingCourse3 = training.Course;
                    applicationForm.TrainingHoldBy3 = training.HoldBy;
                    applicationForm.TrainingPeriod3 = training.Period;
                }
                else if (loop == 4)
                {
                    applicationForm.TrainingCourse4 = training.Course;
                    applicationForm.TrainingHoldBy4 = training.HoldBy;
                    applicationForm.TrainingPeriod4 = training.Period;
                }
                loop++;
            }
        }

        private static void GetEducation(Models.ApplicationForm applicationForm, Models.Applicant applicant)
        {
            int loop = 1;
            foreach (var education in applicant.Education)
            {
                if (loop == 1)
                {
                    applicationForm.EducationName1 = education.Name;
                    applicationForm.EducationLevel1 = education.Level;
                    applicationForm.EducationFromYear1 = education.FromYear;
                    applicationForm.EducationToYear1 = education.ToYear;
                    applicationForm.EducationCertificateDegree1 = education.CertificateDegree;
                    applicationForm.EducationGrade1 = education.Grade;
                    applicationForm.EducationMajor1 = education.Major;
                }
                else if (loop == 2)
                {
                    applicationForm.EducationName2 = education.Name;
                    applicationForm.EducationLevel2 = education.Level;
                    applicationForm.EducationFromYear2 = education.FromYear;
                    applicationForm.EducationToYear2 = education.ToYear;
                    applicationForm.EducationCertificateDegree2 = education.CertificateDegree;
                    applicationForm.EducationGrade2 = education.Grade;
                    applicationForm.EducationMajor2 = education.Major;
                }
                else if (loop == 3)
                {
                    applicationForm.EducationName3 = education.Name;
                    applicationForm.EducationLevel3 = education.Level;
                    applicationForm.EducationFromYear3 = education.FromYear;
                    applicationForm.EducationToYear3 = education.ToYear;
                    applicationForm.EducationCertificateDegree3 = education.CertificateDegree;
                    applicationForm.EducationGrade3 = education.Grade;
                    applicationForm.EducationMajor3 = education.Major;
                }
                else if (loop == 4)
                {
                    applicationForm.EducationName4 = education.Name;
                    applicationForm.EducationLevel4 = education.Level;
                    applicationForm.EducationFromYear4 = education.FromYear;
                    applicationForm.EducationToYear4 = education.ToYear;
                    applicationForm.EducationCertificateDegree4 = education.CertificateDegree;
                    applicationForm.EducationGrade4 = education.Grade;
                    applicationForm.EducationMajor4 = education.Major;
                }
                loop++;
            }
        }

        private static void GetChildren(Models.ApplicationForm applicationForm, Models.Applicant applicant)
        {
            int loop = 1;
            foreach (var children in applicant.Children)
            {
                if (loop == 1)
                {
                    applicationForm.ChildrenName1 = children.Name;
                    applicationForm.ChildrenBirthday1 = children.Birthday;
                    applicationForm.ChildrenIdCardNo1 = children.IdCardNo;
                    applicationForm.ChildrenSchoolOfficeAddress1 = children.SchoolOfficeAddress;
                }
                else if (loop == 2)
                {
                    applicationForm.ChildrenName2 = children.Name;
                    applicationForm.ChildrenBirthday2 = children.Birthday;
                    applicationForm.ChildrenIdCardNo2 = children.IdCardNo;
                    applicationForm.ChildrenSchoolOfficeAddress2 = children.SchoolOfficeAddress;
                }
                else if (loop == 3)
                {
                    applicationForm.ChildrenName3 = children.Name;
                    applicationForm.ChildrenBirthday3 = children.Birthday;
                    applicationForm.ChildrenIdCardNo3 = children.IdCardNo;
                    applicationForm.ChildrenSchoolOfficeAddress3 = children.SchoolOfficeAddress;
                }
                else if (loop == 4)
                {
                    applicationForm.ChildrenName4 = children.Name;
                    applicationForm.ChildrenBirthday4 = children.Birthday;
                    applicationForm.ChildrenIdCardNo4 = children.IdCardNo;
                    applicationForm.ChildrenSchoolOfficeAddress4 = children.SchoolOfficeAddress;
                }
                else if (loop == 5)
                {
                    applicationForm.ChildrenName5 = children.Name;
                    applicationForm.ChildrenBirthday5 = children.Birthday;
                    applicationForm.ChildrenIdCardNo5 = children.IdCardNo;
                    applicationForm.ChildrenSchoolOfficeAddress5 = children.SchoolOfficeAddress;
                }
                else if (loop == 6)
                {
                    applicationForm.ChildrenName6 = children.Name;
                    applicationForm.ChildrenBirthday6 = children.Birthday;
                    applicationForm.ChildrenIdCardNo6 = children.IdCardNo;
                    applicationForm.ChildrenSchoolOfficeAddress6 = children.SchoolOfficeAddress;
                }
                loop++;
            }
        }

        private static void GetSpouse(Models.ApplicationForm applicationForm, Models.Applicant applicant)
        {
            var spouse = applicant.Spouse.FirstOrDefault();
            if (spouse != null)
            {
                applicationForm.SpouseName = spouse.Name;
                applicationForm.SpouseOccupation = spouse.Occupation;
                applicationForm.SpouseAge = spouse.Age;
                applicationForm.SpouseRegisteredYear = spouse.RegisteredYear;
                applicationForm.SpouseDistrict = spouse.District;
                applicationForm.SpousProvince = spouse.Province;
                applicationForm.SpousIdCard = spouse.IdCard;
                applicationForm.SpousTaxIdNo = spouse.TaxIdNo;
                applicationForm.SpouseAddress = spouse.Address;
                applicationForm.SpouseWorkingAddress = spouse.WorkingAddress;
                applicationForm.SpouseNumberChildren = spouse.NumberChildren;
                applicationForm.SpouseNumberPatronized = spouse.NumberPatronized;
                applicationForm.SpouseNumberSchoolingChildren = spouse.NumberSchoolingChildren;
            }
        }

        private static void GetBrethren(Models.ApplicationForm applicationForm, Models.Applicant applicant)
        {
            int loop = 1;
            foreach (var brethren in applicant.Brethren)
            {
                if (loop == 1)
                {
                    applicationForm.BrethrenName1 = brethren.Name;
                    applicationForm.BrethrenAge1 = brethren.Age;
                    applicationForm.BrethrenOccupation1 = brethren.Occupation;
                    applicationForm.BrethrenOfficeAddress1 = brethren.OfficeAddress;
                }
                else if (loop == 2)
                {
                    applicationForm.BrethrenName2 = brethren.Name;
                    applicationForm.BrethrenAge2 = brethren.Age;
                    applicationForm.BrethrenOccupation2 = brethren.Occupation;
                    applicationForm.BrethrenOfficeAddress2 = brethren.OfficeAddress;
                }
                else if (loop == 3)
                {
                    applicationForm.BrethrenName3 = brethren.Name;
                    applicationForm.BrethrenAge3 = brethren.Age;
                    applicationForm.BrethrenOccupation3 = brethren.Occupation;
                    applicationForm.BrethrenOfficeAddress3 = brethren.OfficeAddress;
                }
                else if (loop == 4)
                {
                    applicationForm.BrethrenName4 = brethren.Name;
                    applicationForm.BrethrenAge4 = brethren.Age;
                    applicationForm.BrethrenOccupation4 = brethren.Occupation;
                    applicationForm.BrethrenOfficeAddress4 = brethren.OfficeAddress;
                }
                else if (loop == 5)
                {
                    applicationForm.BrethrenName5 = brethren.Name;
                    applicationForm.BrethrenAge5 = brethren.Age;
                    applicationForm.BrethrenOccupation5 = brethren.Occupation;
                    applicationForm.BrethrenOfficeAddress5 = brethren.OfficeAddress;
                }
                else if (loop == 6)
                {
                    applicationForm.BrethrenName6 = brethren.Name;
                    applicationForm.BrethrenAge6 = brethren.Age;
                    applicationForm.BrethrenOccupation6 = brethren.Occupation;
                    applicationForm.BrethrenOfficeAddress6 = brethren.OfficeAddress;
                }
                loop++;
            }
        }

        private static void GetDisease(Models.ApplicationForm applicationForm, Models.Applicant applicant)
        {
            int loop = 1;
            foreach (var disease in applicant.Disease)
            {
                if (loop == 1)
                {
                    applicationForm.DiseaseName1 = disease.Name;
                    applicationForm.DiseaseRemark1 = disease.Name;
                    applicationForm.DiseaseDrugAllergy1 = disease.Name;
                }
                else if (loop == 2)
                {
                    applicationForm.DiseaseName2 = disease.Name;
                    applicationForm.DiseaseRemark2 = disease.Name;
                    applicationForm.DiseaseDrugAllergy2 = disease.Name;
                }
                else if (loop == 3)
                {
                    applicationForm.DiseaseName3 = disease.Name;
                    applicationForm.DiseaseRemark3 = disease.Name;
                    applicationForm.DiseaseDrugAllergy3 = disease.Name;
                }
                else if (loop == 4)
                {
                    applicationForm.DiseaseName4 = disease.Name;
                    applicationForm.DiseaseRemark4 = disease.Name;
                    applicationForm.DiseaseDrugAllergy4 = disease.Name;
                }
                loop++;
            }
        }

        [HttpPost]
        public ActionResult MangeApplicant(Models.ApplicationForm oApplicationForm)
        {
            if (ModelState.IsValid)
            { //checking model state

                //update student to db
                var oApplicant = new Applicant();
                using (var oDb = new DBContext.ApprenticeDB())
                {
                    var _applicant = oDb.Applicants.FirstOrDefault(e => e.Email == oApplicationForm.Email);
                    if (_applicant != null)
                    {
                        oDb.Brethrens.RemoveRange(_applicant.Brethren);
                        oDb.Spouses.RemoveRange(_applicant.Spouse);
                        oDb.Childrens.RemoveRange(_applicant.Children);
                        oDb.Educations.RemoveRange(_applicant.Education);
                        oDb.Trainings.RemoveRange(_applicant.Training);
                        oDb.LanguageSkills.RemoveRange(_applicant.LanguageSkill);
                        oDb.WorkExperiences.RemoveRange(_applicant.WorkExperience);
                        oDb.Diseases.RemoveRange(_applicant.Disease);
                        oDb.Applicants.Remove(_applicant);
                        oDb.SaveChanges();
                    }
                    var nApplicantId = (oDb.Applicants.Count() > 0 ? oDb.Applicants.Max(e => e.Id) : 0) + 1;
                    oApplicant.Id = nApplicantId;
                    oApplicant.FirstNameTh = oApplicationForm.FirstNameTh;
                    oApplicant.LastNameTh = oApplicationForm.LastNameTh;
                    oApplicant.LastNameTh = oApplicationForm.LastNameTh;
                    oApplicant.FirstNameEn = oApplicationForm.FirstNameEn;
                    oApplicant.LastNameEn = oApplicationForm.LastNameEn;
                    oApplicant.Nickname = oApplicationForm.Nickname;
                    oApplicant.Sex = oApplicationForm.Sex;
                    oApplicant.Weight = oApplicationForm.Weight;
                    oApplicant.Height = oApplicationForm.Height;
                    oApplicant.DateOfBirth = oApplicationForm.DateOfBirth.Value;
                    oApplicant.Age = calulateAge(oApplicationForm.DateOfBirth.Value);
                    oApplicant.PlaceOfBirth = oApplicationForm.PlaceOfBirth;
                    oApplicant.Address = oApplicationForm.Address;
                    oApplicant.HomePhone = oApplicationForm.HomePhone;
                    oApplicant.Tel = oApplicationForm.Tel;
                    oApplicant.TelOffice = oApplicationForm.TelOffice;
                    oApplicant.TelExt = oApplicationForm.TelExt;
                    oApplicant.Email = oApplicationForm.Email;
                    oApplicant.Nationality = oApplicationForm.Nationality;
                    oApplicant.Religion = oApplicationForm.Religion;
                    oApplicant.TaxNo = oApplicationForm.TaxNo;
                    oApplicant.SocialSecurityNumber = oApplicationForm.SocialSecurityNumber;
                    oApplicant.Hospital = oApplicationForm.Hospital;
                    oApplicant.VISANo = oApplicationForm.VISANo;
                    oApplicant.VISAIssueAt = oApplicationForm.VISAIssueAt;
                    oApplicant.VISAIssueDate = oApplicationForm.VISAIssueDate;
                    oApplicant.VISAExpiryDate = oApplicationForm.VISAExpiryDate;
                    oApplicant.WorkPermitNo = oApplicationForm.WorkPermitNo;
                    oApplicant.WorkPermitIssueAt = oApplicationForm.WorkPermitIssueAt;
                    oApplicant.WorkPermitIssueDate = oApplicationForm.WorkPermitIssueDate;
                    oApplicant.WorkPermitExpiryDate = oApplicationForm.WorkPermitExpiryDate;
                    oApplicant.IdNo = oApplicationForm.IdNo;
                    oApplicant.IdNoIssueAt = oApplicationForm.IdNoIssueAt;
                    oApplicant.IdNoExpiryDate = oApplicationForm.IdNoExpiryDate.Value;
                    oApplicant.BloodGroup = oApplicationForm.BloodGroup;
                    oApplicant.SoldierUsed = oApplicationForm.SoldierUsed;
                    oApplicant.SoldierReason = oApplicationForm.SoldierReason;
                    oApplicant.FatherName = oApplicationForm.FatherName;
                    oApplicant.FatherStatus = oApplicationForm.FatherStatus;
                    oApplicant.FatherAge = oApplicationForm.FatherAge;
                    oApplicant.FatherOccupation = oApplicationForm.FatherOccupation;
                    oApplicant.FatherNationality = oApplicationForm.FatherNationality;
                    oApplicant.FatherCitizenship = oApplicationForm.FatherCitizenship;
                    oApplicant.FatherAddress = oApplicationForm.FatherAddress;
                    oApplicant.MotherName = oApplicationForm.MotherName;
                    oApplicant.MotherStatus = oApplicationForm.MotherStatus;
                    oApplicant.MotherAge = oApplicationForm.MotherAge;
                    oApplicant.MotherOccupation = oApplicationForm.MotherOccupation;
                    oApplicant.MotherNationality = oApplicationForm.MotherNationality;
                    oApplicant.MotherCitizenship = oApplicationForm.MotherCitizenship;
                    oApplicant.MotherAddress = oApplicationForm.MotherAddress;
                    oApplicant.Marital = oApplicationForm.Marital;
                    oApplicant.ComputerSkill = oApplicationForm.ComputerSkill;
                    oApplicant.OfficeSkill = oApplicationForm.OfficeSkill;
                    oApplicant.CarLicenseNo = oApplicationForm.CarLicenseNo;
                    oApplicant.CarLicenseType = oApplicationForm.CarLicenseType;
                    oApplicant.CarLicenseExpiryDate = oApplicationForm.CarLicenseExpiryDate;
                    oApplicant.MotorcycleLicenseNo = oApplicationForm.MotorcycleLicenseNo;
                    oApplicant.MotorcycleLicenseType = oApplicationForm.MotorcycleLicenseType;
                    oApplicant.MotorcycleLicenseExpiryDate = oApplicationForm.MotorcycleLicenseExpiryDate;
                    oApplicant.InternationalDrivingLicenseNo = oApplicationForm.InternationalDrivingLicenseNo;
                    oApplicant.InternationalIssueCountry = oApplicationForm.InternationalIssueCountry;
                    oApplicant.InternationalExpiryDate = oApplicationForm.InternationalExpiryDate;
                    oApplicant.OtherSkill = oApplicationForm.OtherSkill;
                    oApplicant.ExtraActivities = oApplicationForm.ExtraActivities;
                    oApplicant.UpdatedOn = DateTime.Now;

                    oDb.Applicants.Add(oApplicant);
                    oDb.SaveChanges();
                    //int applicantId = applicant.Id;
                    if (nApplicantId > 0)
                    {
                        AddBrethren(oApplicationForm, oDb, nApplicantId);
                        AddSpouse(oApplicationForm, oDb, nApplicantId);
                        AddChildren(oApplicationForm, oDb, nApplicantId);
                        AddEducation(oApplicationForm, oDb, nApplicantId);
                        AddTraining(oApplicationForm, oDb, nApplicantId);
                        AddLanguageSkill(oApplicationForm, oDb, nApplicantId);
                        AddWorkExperience(oApplicationForm, oDb, nApplicantId);
                        AddDisease(oApplicationForm, oDb, nApplicantId);
                    }
                }
                Contact(oApplicant);
                return RedirectToAction("Index");
            }
            return View(oApplicationForm);
        }

        private static void AddDisease(Models.ApplicationForm applicationForm, DBContext.ApprenticeDB db, int applicantId)
        {
            if (!String.IsNullOrEmpty(applicationForm.DiseaseName1))
            {
                var disease = new Models.Disease
                {
                    Name = applicationForm.DiseaseName1,
                    Remark = applicationForm.DiseaseRemark1,
                    DrugAllergy = applicationForm.DiseaseDrugAllergy1,
                    ApplicantId = applicantId
                };
                db.Diseases.Add(disease);
                db.SaveChanges();
            }
            if (!String.IsNullOrEmpty(applicationForm.DiseaseName2))
            {
                var disease = new Models.Disease
                {
                    Name = applicationForm.DiseaseName2,
                    Remark = applicationForm.DiseaseRemark2,
                    DrugAllergy = applicationForm.DiseaseDrugAllergy2,
                    ApplicantId = applicantId
                };
                db.Diseases.Add(disease);
                db.SaveChanges();
            }
            if (!String.IsNullOrEmpty(applicationForm.DiseaseName3))
            {
                var disease = new Models.Disease
                {
                    Name = applicationForm.DiseaseName3,
                    Remark = applicationForm.DiseaseRemark3,
                    DrugAllergy = applicationForm.DiseaseDrugAllergy3,
                    ApplicantId = applicantId
                };
                db.Diseases.Add(disease);
                db.SaveChanges();
            }
            if (!String.IsNullOrEmpty(applicationForm.DiseaseName4))
            {
                var disease = new Disease
                {
                    Name = applicationForm.DiseaseName4,
                    Remark = applicationForm.DiseaseRemark4,
                    DrugAllergy = applicationForm.DiseaseDrugAllergy4,
                    ApplicantId = applicantId
                };
                db.Diseases.Add(disease);
                db.SaveChanges();
            }
        }

        private static void AddWorkExperience(Models.ApplicationForm applicationForm, DBContext.ApprenticeDB db, int applicantId)
        {
            if (!String.IsNullOrEmpty(applicationForm.WorkExperienceName1))
            {
                var workExperience = new WorkExperience
                {
                    Name = applicationForm.WorkExperienceName1,
                    WorkFrom = applicationForm.WorkExperienceWorkFrom1,
                    WorkTo = applicationForm.WorkExperienceWorkTo1,
                    Position = applicationForm.WorkExperiencePosition1,
                    Responsibility = applicationForm.WorkExperienceResponsibility1,
                    SalaryStart = applicationForm.WorkExperienceSalaryStart1,
                    SalaryEnd = applicationForm.WorkExperienceSalaryEnd1,
                    ReasonLeaving = applicationForm.WorkExperienceReasonLeaving1,
                    ApplicantId = applicantId
                };
                db.WorkExperiences.Add(workExperience);
                db.SaveChanges();
            }
            if (!String.IsNullOrEmpty(applicationForm.WorkExperienceName2))
            {
                var workExperience = new WorkExperience
                {
                    Name = applicationForm.WorkExperienceName2,
                    WorkFrom = applicationForm.WorkExperienceWorkFrom2,
                    WorkTo = applicationForm.WorkExperienceWorkTo2,
                    Position = applicationForm.WorkExperiencePosition2,
                    Responsibility = applicationForm.WorkExperienceResponsibility2,
                    SalaryStart = applicationForm.WorkExperienceSalaryStart2,
                    SalaryEnd = applicationForm.WorkExperienceSalaryEnd2,
                    ReasonLeaving = applicationForm.WorkExperienceReasonLeaving2,
                    ApplicantId = applicantId
                };
                db.WorkExperiences.Add(workExperience);
                db.SaveChanges();
            }
            if (!String.IsNullOrEmpty(applicationForm.WorkExperienceName3))
            {
                var workExperience = new WorkExperience
                {
                    Name = applicationForm.WorkExperienceName3,
                    WorkFrom = applicationForm.WorkExperienceWorkFrom3,
                    WorkTo = applicationForm.WorkExperienceWorkTo3,
                    Position = applicationForm.WorkExperiencePosition3,
                    Responsibility = applicationForm.WorkExperienceResponsibility3,
                    SalaryStart = applicationForm.WorkExperienceSalaryStart3,
                    SalaryEnd = applicationForm.WorkExperienceSalaryEnd3,
                    ReasonLeaving = applicationForm.WorkExperienceReasonLeaving3,
                    ApplicantId = applicantId
                };
                db.WorkExperiences.Add(workExperience);
                db.SaveChanges();
            }
            if (!String.IsNullOrEmpty(applicationForm.WorkExperienceName4))
            {
                var workExperience = new WorkExperience
                {
                    Name = applicationForm.WorkExperienceName4,
                    WorkFrom = applicationForm.WorkExperienceWorkFrom4,
                    WorkTo = applicationForm.WorkExperienceWorkTo4,
                    Position = applicationForm.WorkExperiencePosition4,
                    Responsibility = applicationForm.WorkExperienceResponsibility4,
                    SalaryStart = applicationForm.WorkExperienceSalaryStart4,
                    SalaryEnd = applicationForm.WorkExperienceSalaryEnd4,
                    ReasonLeaving = applicationForm.WorkExperienceReasonLeaving4,
                    ApplicantId = applicantId
                };
                db.WorkExperiences.Add(workExperience);
                db.SaveChanges();
            }
        }

        private static void AddLanguageSkill(Models.ApplicationForm applicationForm, DBContext.ApprenticeDB db, int applicantId)
        {
            if (!String.IsNullOrEmpty(applicationForm.LanguageSkillLanguage1))
            {
                var languageSkill = new LanguageSkill
                {
                    Language = applicationForm.LanguageSkillLanguage1,
                    Speaking = applicationForm.LanguageSkillSpeaking1,
                    Reading = applicationForm.LanguageSkillReading1,
                    Writing = applicationForm.LanguageSkillWriting1,
                    ApplicantId = applicantId
                };
                db.LanguageSkills.Add(languageSkill);
                db.SaveChanges();
            }
            if (!String.IsNullOrEmpty(applicationForm.LanguageSkillLanguage2))
            {
                var languageSkill = new LanguageSkill
                {
                    Language = applicationForm.LanguageSkillLanguage2,
                    Speaking = applicationForm.LanguageSkillSpeaking2,
                    Reading = applicationForm.LanguageSkillReading2,
                    Writing = applicationForm.LanguageSkillWriting2,
                    ApplicantId = applicantId
                };
                db.LanguageSkills.Add(languageSkill);
                db.SaveChanges();
            }
            if (!String.IsNullOrEmpty(applicationForm.LanguageSkillLanguage3))
            {
                var languageSkill = new LanguageSkill
                {
                    Language = applicationForm.LanguageSkillLanguage3,
                    Speaking = applicationForm.LanguageSkillSpeaking3,
                    Reading = applicationForm.LanguageSkillReading3,
                    Writing = applicationForm.LanguageSkillWriting3,
                    ApplicantId = applicantId
                };
                db.LanguageSkills.Add(languageSkill);
                db.SaveChanges();
            }
            if (!String.IsNullOrEmpty(applicationForm.LanguageSkillLanguage4))
            {
                var languageSkill = new LanguageSkill
                {
                    Language = applicationForm.LanguageSkillLanguage4,
                    Speaking = applicationForm.LanguageSkillSpeaking4,
                    Reading = applicationForm.LanguageSkillReading4,
                    Writing = applicationForm.LanguageSkillWriting4,
                    ApplicantId = applicantId
                };
                db.LanguageSkills.Add(languageSkill);
                db.SaveChanges();
            }
        }

        private static void AddTraining(Models.ApplicationForm applicationForm, DBContext.ApprenticeDB db, int applicantId)
        {
            if (!String.IsNullOrEmpty(applicationForm.TrainingCourse1))
            {
                var training = new Training
                {
                    Course = applicationForm.TrainingCourse1,
                    HoldBy = applicationForm.TrainingHoldBy1,
                    Period = applicationForm.TrainingPeriod1,
                    ApplicantId = applicantId
                };
                db.Trainings.Add(training);
                db.SaveChanges();
            }
            if (!String.IsNullOrEmpty(applicationForm.TrainingCourse2))
            {
                var training = new Training
                {
                    Course = applicationForm.TrainingCourse2,
                    HoldBy = applicationForm.TrainingHoldBy2,
                    Period = applicationForm.TrainingPeriod2,
                    ApplicantId = applicantId
                };
                db.Trainings.Add(training);
                db.SaveChanges();
            }
            if (!String.IsNullOrEmpty(applicationForm.TrainingCourse3))
            {
                var training = new Training
                {
                    Course = applicationForm.TrainingCourse3,
                    HoldBy = applicationForm.TrainingHoldBy3,
                    Period = applicationForm.TrainingPeriod3,
                    ApplicantId = applicantId
                };
                db.Trainings.Add(training);
                db.SaveChanges();
            }
            if (!String.IsNullOrEmpty(applicationForm.TrainingCourse4))
            {
                var training = new Training
                {
                    Course = applicationForm.TrainingCourse4,
                    HoldBy = applicationForm.TrainingHoldBy4,
                    Period = applicationForm.TrainingPeriod4,
                    ApplicantId = applicantId
                };
                db.Trainings.Add(training);
                db.SaveChanges();
            }
        }

        private static void AddEducation(Models.ApplicationForm applicationForm, DBContext.ApprenticeDB db, int applicantId)
        {
            if (!String.IsNullOrEmpty(applicationForm.EducationLevel1))
            {
                var education = new Education
                {
                    Level = applicationForm.EducationLevel1,
                    Name = applicationForm.EducationName1,
                    FromYear = applicationForm.EducationFromYear1,
                    ToYear = applicationForm.EducationToYear1,
                    CertificateDegree = applicationForm.EducationCertificateDegree1,
                    Grade = applicationForm.EducationGrade1,
                    Major = applicationForm.EducationMajor1,
                    ApplicantId = applicantId
                };
                db.Educations.Add(education);
                db.SaveChanges();
            }
            if (!String.IsNullOrEmpty(applicationForm.EducationLevel2))
            {
                var education = new Education
                {
                    Level = applicationForm.EducationLevel2,
                    Name = applicationForm.EducationName2,
                    FromYear = applicationForm.EducationFromYear2,
                    ToYear = applicationForm.EducationToYear2,
                    CertificateDegree = applicationForm.EducationCertificateDegree2,
                    Grade = applicationForm.EducationGrade2,
                    Major = applicationForm.EducationMajor2,
                    ApplicantId = applicantId
                };
                db.Educations.Add(education);
                db.SaveChanges();
            }
            if (!String.IsNullOrEmpty(applicationForm.EducationLevel3))
            {
                var education = new Education
                {
                    Level = applicationForm.EducationLevel3,
                    Name = applicationForm.EducationName3,
                    FromYear = applicationForm.EducationFromYear3,
                    ToYear = applicationForm.EducationToYear3,
                    CertificateDegree = applicationForm.EducationCertificateDegree3,
                    Grade = applicationForm.EducationGrade3,
                    Major = applicationForm.EducationMajor3,
                    ApplicantId = applicantId
                };
                db.Educations.Add(education);
                db.SaveChanges();
            }
            if (!String.IsNullOrEmpty(applicationForm.EducationLevel4))
            {
                var education = new Education
                {
                    Level = applicationForm.EducationLevel4,
                    Name = applicationForm.EducationName4,
                    FromYear = applicationForm.EducationFromYear4,
                    ToYear = applicationForm.EducationToYear4,
                    CertificateDegree = applicationForm.EducationCertificateDegree4,
                    Grade = applicationForm.EducationGrade4,
                    Major = applicationForm.EducationMajor4,
                    ApplicantId = applicantId
                };
                db.Educations.Add(education);
                db.SaveChanges();
            }
        }

        private static void AddChildren(Models.ApplicationForm applicationForm, DBContext.ApprenticeDB db, int applicantId)
        {
            if (!String.IsNullOrEmpty(applicationForm.ChildrenName1))
            {
                var children = new Children
                {
                    Name = applicationForm.ChildrenName1,
                    Birthday = applicationForm.ChildrenBirthday1,
                    IdCardNo = applicationForm.ChildrenIdCardNo1,
                    SchoolOfficeAddress = applicationForm.ChildrenSchoolOfficeAddress1,
                    ApplicantId = applicantId
                };
                db.Childrens.Add(children);
                db.SaveChanges();
            }
            if (!String.IsNullOrEmpty(applicationForm.ChildrenName2))
            {
                var children = new Children
                {
                    Name = applicationForm.ChildrenName2,
                    Birthday = applicationForm.ChildrenBirthday2,
                    IdCardNo = applicationForm.ChildrenIdCardNo2,
                    SchoolOfficeAddress = applicationForm.ChildrenSchoolOfficeAddress2,
                    ApplicantId = applicantId
                };
                db.Childrens.Add(children);
                db.SaveChanges();
            }
            if (!String.IsNullOrEmpty(applicationForm.ChildrenName3))
            {
                var children = new Children
                {
                    Name = applicationForm.ChildrenName3,
                    Birthday = applicationForm.ChildrenBirthday3,
                    IdCardNo = applicationForm.ChildrenIdCardNo3,
                    SchoolOfficeAddress = applicationForm.ChildrenSchoolOfficeAddress3,
                    ApplicantId = applicantId
                };
                db.Childrens.Add(children);
                db.SaveChanges();
            }
            if (!String.IsNullOrEmpty(applicationForm.ChildrenName4))
            {
                var children = new Children
                {
                    Name = applicationForm.ChildrenName4,
                    Birthday = applicationForm.ChildrenBirthday4,
                    IdCardNo = applicationForm.ChildrenIdCardNo4,
                    SchoolOfficeAddress = applicationForm.ChildrenSchoolOfficeAddress4,
                    ApplicantId = applicantId
                };
                db.Childrens.Add(children);
                db.SaveChanges();
            }
            if (!String.IsNullOrEmpty(applicationForm.ChildrenName5))
            {
                var children = new Children
                {
                    Name = applicationForm.ChildrenName5,
                    Birthday = applicationForm.ChildrenBirthday5,
                    IdCardNo = applicationForm.ChildrenIdCardNo5,
                    SchoolOfficeAddress = applicationForm.ChildrenSchoolOfficeAddress5,
                    ApplicantId = applicantId
                };
                db.Childrens.Add(children);
                db.SaveChanges();
            }
            if (!String.IsNullOrEmpty(applicationForm.ChildrenName6))
            {
                var children = new Children
                {
                    Name = applicationForm.ChildrenName6,
                    Birthday = applicationForm.ChildrenBirthday6,
                    IdCardNo = applicationForm.ChildrenIdCardNo6,
                    SchoolOfficeAddress = applicationForm.ChildrenSchoolOfficeAddress6,
                    ApplicantId = applicantId
                };
                db.Childrens.Add(children);
                db.SaveChanges();
            }
        }
        private static void AddSpouse(Models.ApplicationForm applicationForm, DBContext.ApprenticeDB db, int applicantId)
        {
            if (!String.IsNullOrEmpty(applicationForm.SpouseName))
            {
                var spouse = new Models.Spouse
                {
                    Name = applicationForm.SpouseName,
                    Occupation = applicationForm.SpouseOccupation,
                    Age = applicationForm.SpouseAge,
                    RegisteredYear = applicationForm.SpouseRegisteredYear,
                    District = applicationForm.SpouseDistrict,
                    Province = applicationForm.SpousProvince,
                    IdCard = applicationForm.SpousIdCard,
                    TaxIdNo = applicationForm.SpousTaxIdNo,
                    Address = applicationForm.SpouseAddress,
                    WorkingAddress = applicationForm.SpouseWorkingAddress,
                    NumberChildren = applicationForm.SpouseNumberChildren,
                    NumberPatronized = applicationForm.SpouseNumberPatronized,
                    NumberSchoolingChildren = applicationForm.SpouseNumberSchoolingChildren,
                    ApplicantId = applicantId
                };

                db.Spouses.Add(spouse);
                db.SaveChanges();
            }
        }

        private static void AddBrethren(Models.ApplicationForm applicationForm, DBContext.ApprenticeDB db, int applicantId)
        {
            //Brethren
            if (!String.IsNullOrEmpty(applicationForm.BrethrenName1))
            {
                var brethren = new Brethren
                {
                    Name = applicationForm.BrethrenName1,
                    Age = applicationForm.BrethrenAge1,
                    Occupation = applicationForm.BrethrenOccupation1,
                    OfficeAddress = applicationForm.BrethrenOfficeAddress1,
                    ApplicantId = applicantId
                };
                db.Brethrens.Add(brethren);
                db.SaveChanges();
            }
            if (!String.IsNullOrEmpty(applicationForm.BrethrenName2))
            {
                var brethren = new Brethren
                {
                    Name = applicationForm.BrethrenName2,
                    Age = applicationForm.BrethrenAge2,
                    Occupation = applicationForm.BrethrenOccupation2,
                    OfficeAddress = applicationForm.BrethrenOfficeAddress2,
                    ApplicantId = applicantId
                };
                db.Brethrens.Add(brethren);
                db.SaveChanges();
            }
            if (!String.IsNullOrEmpty(applicationForm.BrethrenName3))
            {
                var brethren = new Brethren
                {
                    Name = applicationForm.BrethrenName3,
                    Age = applicationForm.BrethrenAge3,
                    Occupation = applicationForm.BrethrenOccupation3,
                    OfficeAddress = applicationForm.BrethrenOfficeAddress3,
                    ApplicantId = applicantId
                };
                db.Brethrens.Add(brethren);
                db.SaveChanges();
            }
            if (!String.IsNullOrEmpty(applicationForm.BrethrenName4))
            {
                var brethren = new Brethren
                {
                    Name = applicationForm.BrethrenName4,
                    Age = applicationForm.BrethrenAge4,
                    Occupation = applicationForm.BrethrenOccupation4,
                    OfficeAddress = applicationForm.BrethrenOfficeAddress4,
                    ApplicantId = applicantId
                };
                db.Brethrens.Add(brethren);
                db.SaveChanges();
            }
            if (!String.IsNullOrEmpty(applicationForm.BrethrenName5))
            {
                var brethren = new Brethren
                {
                    Name = applicationForm.BrethrenName5,
                    Age = applicationForm.BrethrenAge5,
                    Occupation = applicationForm.BrethrenOccupation5,
                    OfficeAddress = applicationForm.BrethrenOfficeAddress5,
                    ApplicantId = applicantId
                };
                db.Brethrens.Add(brethren);
                db.SaveChanges();
            }
            if (!String.IsNullOrEmpty(applicationForm.BrethrenName6))
            {
                var brethren = new Brethren
                {
                    Name = applicationForm.BrethrenName6,
                    Age = applicationForm.BrethrenAge6,
                    Occupation = applicationForm.BrethrenOccupation6,
                    OfficeAddress = applicationForm.BrethrenOfficeAddress6,
                    ApplicantId = applicantId
                };
                db.Brethrens.Add(brethren);
                db.SaveChanges();
            }
        }

        public ActionResult About()
        {
            ViewBag.Message = "Your application description page.";

            return View();
        }

        public ActionResult Contact()
        {
            ViewBag.Message = "Your contact page.";

            return View();
        }
        private void Contact(Applicant poApplicant)
        {
            try
            {
                if (ModelState.IsValid)
                {
                    var oApplicant = poApplicant;
                    var sPathUrl = HttpContext.Request.Url.ToString();
                    sPathUrl = sPathUrl.Substring(0, sPathUrl.LastIndexOf('/'));
                    sPathUrl = sPathUrl.Substring(0, sPathUrl.LastIndexOf('/'));
                    var sEmailSender = ConfigurationManager.AppSettings["EmailSender"].ToString();//Emailระบบ ที่ใช้ส่ง
                    var sPass = ConfigurationManager.AppSettings["EmailPass"].ToString();
                    var sEmailReciver = ConfigurationManager.AppSettings["EmailReciver"].ToString();  //Email HR
                    var sMsg1 = "Application for : Apprentice program";
                    var sMsg2 = "Name : " + oApplicant.FirstNameTh + " " + oApplicant.LastNameTh;
                    var sMsg3 = "Age : " + oApplicant.Age;
                    var sMsg4 = "Gender : " + oApplicant.Sex;
                    var sMsg5 = "Email : " + oApplicant.Email;
                    var sMsg6 = "Tel No. : " + oApplicant.Tel;
                    var sMsg7 = "<a target='_blank' href='" + sPathUrl + "/Report/Applicant?ApplicantId=" + oApplicant.Id + "' > *View full profile*</a>";
                    var sBody = "<p>{0}</p><p>{1}</p><p>{2}</p><p>{3}</p><p>{4}</p><p>{5}</p><br><p>{6}</p>";
                    var oMessage = new MailMessage();
                    oMessage.From = new MailAddress(sEmailSender);
                    foreach (var sAddress in sEmailReciver.Split(new[] { "," }, StringSplitOptions.RemoveEmptyEntries))
                        oMessage.To.Add(sAddress);
                    oMessage.Subject = "Application from " + oApplicant.FirstNameTh + " " + oApplicant.LastNameTh;
                    oMessage.IsBodyHtml = true; //to make message body as html  
                    oMessage.Body = string.Format(sBody, sMsg1, sMsg2, sMsg3, sMsg4, sMsg5, sMsg6, sMsg7);
                    using (var oSmtp = new SmtpClient())
                    {
                        oSmtp.Port = 587;
                        oSmtp.Host = "smtp.gmail.com";
                        oSmtp.EnableSsl = true;
                        oSmtp.UseDefaultCredentials = false;
                        oSmtp.Credentials = new NetworkCredential(sEmailSender, sPass);
                        oSmtp.DeliveryMethod = SmtpDeliveryMethod.Network;
                        oSmtp.Send(oMessage);
                        //return RedirectToAction("Sent");
                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
            }
            //return View(model);
        }
    }
}