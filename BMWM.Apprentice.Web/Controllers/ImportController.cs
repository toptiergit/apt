using ApplicationForm.DBContext;
using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Toptier.ImportingService.Services;
using Toptier.ImportingService.Models;
using ApplicationForm.Models;
using System.Text.RegularExpressions;
using System.Reflection;
using System.IO.Compression;
using System.Data.Entity.Migrations;
using BMWM.Apprentice.Web.AuthWebService;
using System.Threading;
using System.Globalization;

namespace ApplicationForm.Controllers
{
    [AuthorizeUser]
    public class ImportController : Controller
    {
        // GET: Import//
        public ImportController()
        {
            var oCustomCulture = new CultureInfo("en-EN", true);
            oCustomCulture.DateTimeFormat.ShortDatePattern = "dd/MM/yyyy";
            Thread.CurrentThread.CurrentCulture = oCustomCulture;
            Thread.CurrentThread.CurrentUICulture = oCustomCulture;
        }
        public ActionResult Index()
        {
            ViewBag.ImportStatus = false;
            return View();
        }
        [HttpPost]
        [ActionName("Index")]
        public ActionResult Import(HttpPostedFileBase FileImport)
        {
            if (FileImport != null && FileImport.ContentLength > 0)
            {
                var sFileName = FileImport.FileName;
                var sPathFolder = Server.MapPath("~/Files/Importfile");
                var sPathFile = Path.Combine(sPathFolder, sFileName);//ไฟล์Zip
                CLEARxFile(sPathFolder);

                FileImport.SaveAs(sPathFile);
                ExtractFilesZ(sPathFolder, sPathFile);//แตกไฟล์Zip
                try
                {
                    var sCsvFileName = "*.csv"; //ประเภทไฟล์
                    //var sFilePath = sPathFolder + "\\" + sFileName.Substring(0, sFileName.LastIndexOf('.'));
                    var sFilePath = sPathFolder;
                    var oDirectoryPath = new DirectoryInfo(sFilePath);
                    var oApplicant = new List<Applicant>();
                    var oWorkExperience = new List<WorkExperience>();
                    var oTraining = new List<Training>();
                    var oSpouse = new List<Spouse>();
                    var oLanguageSkill = new List<LanguageSkill>();
                    var oEducation = new List<Education>();
                    var oDisease = new List<Disease>();
                    var oChildren = new List<Children>();
                    var oBrethren = new List<Brethren>();
                    var oAuth_User = new List<auth_User>();
                    var oQiuzRes = new List<Quiz_responses>();
                    var oQuestRes = new List<Question_responses>();
                    var oQiuzdetail = new List<Quizdetail>();
                    var oQiuzQuest = new List<Quiz_questions>();
                    foreach (FileInfo oFileCsv in oDirectoryPath.GetFiles(sCsvFileName))
                    {
                        var sFileCsv = oFileCsv.Name;
                        var oDt = CONVoCSVtoDataTable(sFilePath, sFileCsv);
                        //var oDt = new DataTable();
                        //var xDateOfBirth = "" == "" ? DateTime.Now : DateTime.Parse("15/10/2025 0:00");
                        switch (sFileCsv)
                        {
                            case "Applicant.csv":
                                foreach (DataRow oRows in oDt.Rows)
                                {
                                    if (oRows != null)
                                    {
                                        //var oDateOfBirth= oRows["DateOfBirth"].ToString();
                                        //var oVISAExpiryDate = oRows["VISAExpiryDate"].ToString();
                                        //var oVISAIssueDate = oRows["VISAIssueDate"].ToString();
                                        //var oWorkPermitIssueDate = oRows["WorkPermitIssueDate"].ToString();
                                        //var oWorkPermitExpiryDate = oRows["WorkPermitExpiryDate"].ToString();
                                        //var oIdNoExpiryDate = oRows["IdNoExpiryDate"].ToString();
                                        //var oCarLicenseExpiryDate = oRows["CarLicenseExpiryDate"].ToString();
                                        //var oMotorcycleLicenseExpiryDate = oRows["MotorcycleLicenseExpiryDate"].ToString();
                                        //var oInternationalExpiryDate = oRows["InternationalExpiryDate"].ToString();
                                        //var oUpdatedOn = oRows["UpdatedOn"].ToString();
                                        ////////////////////////////////////////////////////////////////////
                                        var oApplicantTemp = new Applicant
                                        {
                                            Id = int.Parse(oRows["Id"].ToString()),
                                            FirstNameTh = oRows["FirstNameTh"].ToString(),
                                            LastNameTh = oRows["LastNameTh"].ToString(),
                                            FirstNameEn = oRows["FirstNameEn"].ToString(),
                                            LastNameEn = oRows["LastNameEn"].ToString(),
                                            Nickname = oRows["Nickname"].ToString(),
                                            Sex = oRows["Sex"].ToString(),
                                            Weight = oRows["Weight"].ToString() == "" ? 0 : decimal.Parse(oRows["Weight"].ToString()),
                                            Height = oRows["Height"].ToString() == "" ? 0 : decimal.Parse(oRows["Height"].ToString()),
                                            DateOfBirth = oRows["DateOfBirth"].ToString() == "" ? DateTime.Now : DateTime.Parse(oRows["DateOfBirth"].ToString()),
                                            Age = oRows["Age"].ToString() == "" ? 0 : int.Parse(oRows["Age"].ToString()),
                                            PlaceOfBirth = oRows["PlaceOfBirth"].ToString(),
                                            Address = oRows["Address"].ToString(),
                                            Tel = oRows["Tel"].ToString(),
                                            HomePhone = oRows["HomePhone"].ToString(),
                                            TelOffice = oRows["TelOffice"].ToString(),
                                            TelExt = oRows["TelExt"].ToString(),
                                            Email = oRows["Email"].ToString(),
                                            Nationality = oRows["Nationality"].ToString(),
                                            Religion = oRows["Religion"].ToString(),
                                            TaxNo = oRows["TaxNo"].ToString(),
                                            SocialSecurityNumber = oRows["SocialSecurityNumber"].ToString(),
                                            Hospital = oRows["Hospital"].ToString(),
                                            VISANo = oRows["VISANo"].ToString(),
                                            VISAIssueAt = oRows["VISAIssueAt"].ToString(),
                                            VISAExpiryDate = oRows["VISAExpiryDate"].ToString() == "" ? DateTime.Now : DateTime.Parse(oRows["VISAExpiryDate"].ToString()),
                                            VISAIssueDate = oRows["VISAIssueDate"].ToString() == "" ? DateTime.Now : DateTime.Parse(oRows["VISAIssueDate"].ToString()),
                                            WorkPermitNo = oRows["WorkPermitNo"].ToString(),
                                            WorkPermitIssueAt = oRows["WorkPermitIssueAt"].ToString(),
                                            WorkPermitIssueDate = oRows["WorkPermitIssueDate"].ToString() == "" ? DateTime.Now : DateTime.Parse(oRows["WorkPermitIssueDate"].ToString()),
                                            WorkPermitExpiryDate = oRows["WorkPermitExpiryDate"].ToString() == "" ? DateTime.Now : DateTime.Parse(oRows["WorkPermitExpiryDate"].ToString()),
                                            IdNo = oRows["IdNo"].ToString(),
                                            IdNoIssueAt = oRows["IdNoIssueAt"].ToString(),
                                            IdNoExpiryDate = oRows["IdNoExpiryDate"].ToString() == "" ? DateTime.Now : DateTime.Parse(oRows["IdNoExpiryDate"].ToString()),
                                            BloodGroup = oRows["BloodGroup"].ToString(),
                                            SoldierReason = oRows["SoldierReason"].ToString(),
                                            SoldierUsed = oRows["SoldierUsed"].ToString() == "" ? false : bool.Parse(oRows["SoldierUsed"].ToString()),
                                            FatherName = oRows["FatherName"].ToString(),
                                            FatherStatus = oRows["FatherStatus"].ToString() == "" ? false : bool.Parse(oRows["FatherStatus"].ToString()),
                                            FatherAge = oRows["FatherAge"].ToString() == "" ? 0 : int.Parse(oRows["FatherAge"].ToString()),
                                            FatherAddress = oRows["FatherAddress"].ToString(),
                                            FatherCitizenship = oRows["FatherCitizenship"].ToString(),
                                            FatherNationality = oRows["FatherNationality"].ToString(),
                                            FatherOccupation = oRows["FatherOccupation"].ToString(),
                                            MotherAddress = oRows["MotherAddress"].ToString(),
                                            MotherAge = oRows["MotherAge"].ToString() == "" ? 0 : int.Parse(oRows["MotherAge"].ToString()),
                                            MotherCitizenship = oRows["MotherCitizenship"].ToString(),
                                            MotherName = oRows["MotherName"].ToString(),
                                            MotherNationality = oRows["MotherNationality"].ToString(),
                                            MotherOccupation = oRows["MotherOccupation"].ToString(),
                                            MotherStatus = oRows["MotherStatus"].ToString() == "" ? false : bool.Parse(oRows["MotherStatus"].ToString()),
                                            Marital = oRows["Marital"].ToString(),
                                            ComputerSkill = oRows["ComputerSkill"].ToString(),
                                            OfficeSkill = oRows["OfficeSkill"].ToString(),
                                            CarLicenseExpiryDate = oRows["CarLicenseExpiryDate"].ToString() == "" ? DateTime.Now : DateTime.Parse(oRows["CarLicenseExpiryDate"].ToString()),
                                            CarLicenseNo = oRows["CarLicenseNo"].ToString(),
                                            CarLicenseType = oRows["CarLicenseType"].ToString(),
                                            MotorcycleLicenseExpiryDate = oRows["MotorcycleLicenseExpiryDate"].ToString() == "" ? DateTime.Now : DateTime.Parse(oRows["MotorcycleLicenseExpiryDate"].ToString()),
                                            MotorcycleLicenseNo = oRows["MotorcycleLicenseNo"].ToString(),
                                            MotorcycleLicenseType = oRows["MotorcycleLicenseType"].ToString(),
                                            InternationalDrivingLicenseNo = oRows["InternationalDrivingLicenseNo"].ToString(),
                                            InternationalExpiryDate = oRows["InternationalExpiryDate"].ToString() == "" ? DateTime.Now : DateTime.Parse(oRows["InternationalExpiryDate"].ToString()),
                                            InternationalIssueCountry = oRows["InternationalIssueCountry"].ToString(),
                                            OtherSkill = oRows["OtherSkill"].ToString(),
                                            ExtraActivities = oRows["ExtraActivities"].ToString(),
                                            UpdatedOn = oRows["UpdatedOn"].ToString() == "" ? DateTime.Now : DateTime.Parse((oRows["UpdatedOn"].ToString())),
                                            SendMailStatus = oRows["SendMailStatus"].ToString() == "" ? false : bool.Parse(oRows["SendMailStatus"].ToString())
                                        };
                                        oApplicant.Add(oApplicantTemp);
                                    }
                                }
                                break;
                            case "WorkExperience.csv":
                                foreach (DataRow oRows in oDt.Rows)
                                {
                                    if (!oRows.IsNull(0))
                                    {
                                        var nId = int.Parse(oRows["Id"].ToString());
                                        var oWorkExperienceTemp = new WorkExperience
                                        {
                                            Id = nId,
                                            Name = oRows["Name"].ToString(),
                                            WorkFrom = oRows["WorkFrom"].ToString(),
                                            WorkTo = oRows["WorkTo"].ToString(),
                                            Position = oRows["Position"].ToString(),
                                            ApplicantId = oRows["ApplicantId"].ToString() == "" ? 0 : int.Parse(oRows["ApplicantId"].ToString()),
                                            ReasonLeaving = oRows["ReasonLeaving"].ToString(),
                                            Responsibility = oRows["Responsibility"].ToString(),
                                            SalaryStart = oRows["SalaryStart"].ToString() == "" ? 0 : decimal.Parse(oRows["SalaryStart"].ToString()),
                                            SalaryEnd = oRows["SalaryEnd"].ToString() == "" ? 0 : decimal.Parse(oRows["SalaryEnd"].ToString())
                                        };
                                        oWorkExperience.Add(oWorkExperienceTemp);
                                    }
                                }
                                break;
                            case "Training.csv":
                                foreach (DataRow oRows in oDt.Rows)
                                {
                                    if (!oRows.IsNull(0))
                                    {
                                        var nId = int.Parse(oRows["Id"].ToString());
                                        var oTrainingTemp = new Training
                                        {
                                            Id = nId,
                                            Course = oRows["Course"].ToString(),
                                            HoldBy = oRows["HoldBy"].ToString(),
                                            Period = oRows["Period"].ToString(),
                                            ApplicantId = oRows["ApplicantId"].ToString() == "" ? 0 : int.Parse(oRows["ApplicantId"].ToString())
                                        };
                                        oTraining.Add(oTrainingTemp);
                                    }
                                }
                                break;
                            case "Spouse.csv":
                                foreach (DataRow oRows in oDt.Rows)
                                {
                                    if (!oRows.IsNull(0))
                                    {
                                        var nId = int.Parse(oRows["Id"].ToString());
                                        var oSpouseTemp = new Spouse
                                        {
                                            Id = nId,
                                            Name = oRows["Name"].ToString(),
                                            Occupation = oRows["Occupation"].ToString(),
                                            Age = oRows["Age"].ToString() == "" ? 0 : int.Parse(oRows["Age"].ToString()),
                                            RegisteredYear = oRows["RegisteredYear"].ToString() == "" ? 0 : int.Parse(oRows["RegisteredYear"].ToString()),
                                            District = oRows["District"].ToString(),
                                            Province = oRows["Province"].ToString(),
                                            IdCard = oRows["IdCard"].ToString(),
                                            TaxIdNo = oRows["TaxIdNo"].ToString(),
                                            Address = oRows["Address"].ToString(),
                                            WorkingAddress = oRows["WorkingAddress"].ToString(),
                                            NumberChildren = oRows["NumberChildren"].ToString() == "" ? 0 : int.Parse(oRows["NumberChildren"].ToString()),
                                            NumberPatronized = oRows["NumberPatronized"].ToString() == "" ? 0 : int.Parse(oRows["NumberPatronized"].ToString()),
                                            NumberSchoolingChildren = oRows["NumberSchoolingChildren"].ToString() == "" ? 0 : int.Parse(oRows["NumberSchoolingChildren"].ToString()),
                                            ApplicantId = oRows["ApplicantId"].ToString() == "" ? 0 : int.Parse(oRows["ApplicantId"].ToString())
                                        };
                                        oSpouse.Add(oSpouseTemp);
                                    }
                                }
                                break;
                            case "LanguageSkill.csv":
                                foreach (DataRow oRows in oDt.Rows)
                                {
                                    if (!oRows.IsNull(0))
                                    {
                                        var nId = int.Parse(oRows["Id"].ToString());
                                        var oLanguageSkillTemp = new LanguageSkill
                                        {
                                            Id = nId,
                                            Language = oRows["Language"].ToString(),
                                            Speaking = oRows["Speaking"].ToString(),
                                            ApplicantId = oRows["ApplicantId"].ToString() == "" ? 0 : int.Parse(oRows["ApplicantId"].ToString()),
                                            Reading = oRows["Reading"].ToString(),
                                            Writing = oRows["Writing"].ToString()
                                        };
                                        oLanguageSkill.Add(oLanguageSkillTemp);
                                    }
                                }
                                break;
                            case "Education.csv":
                                foreach (DataRow oRows in oDt.Rows)
                                {
                                    if (!oRows.IsNull(0))
                                    {
                                        var nId = int.Parse(oRows["Id"].ToString());
                                        var oEducationTemp = new Education
                                        {
                                            Id = nId,
                                            Name = oRows["Name"].ToString(),
                                            Level = oRows["Level"].ToString(),
                                            FromYear = oRows["FromYear"].ToString() == "" ? 0 : int.Parse(oRows["FromYear"].ToString()),
                                            ToYear = oRows["ToYear"].ToString() == "" ? 0 : int.Parse(oRows["ToYear"].ToString()),
                                            CertificateDegree = oRows["CertificateDegree"].ToString(),
                                            Grade = oRows["Grade"].ToString() == "" ? 0 : decimal.Parse(oRows["Grade"].ToString()),
                                            Major = oRows["Major"].ToString(),
                                            ApplicantId = oRows["ApplicantId"].ToString() == "" ? 0 : int.Parse(oRows["ApplicantId"].ToString())
                                        };
                                        oEducation.Add(oEducationTemp);
                                    }
                                }
                                break;
                            case "Disease.csv":
                                foreach (DataRow oRows in oDt.Rows)
                                {
                                    if (!oRows.IsNull(0))
                                    {
                                        var nId = int.Parse(oRows["Id"].ToString());
                                        var oDiseaseTemp = new Disease
                                        {
                                            Id = nId,
                                            Name = oRows["Name"].ToString(),
                                            Remark = oRows["Remark"].ToString(),
                                            ApplicantId = oRows["ApplicantId"].ToString() == "" ? 0 : int.Parse(oRows["ApplicantId"].ToString()),
                                            DrugAllergy = oRows["DrugAllergy"].ToString()
                                        };
                                        oDisease.Add(oDiseaseTemp);
                                    }
                                }
                                break;
                            case "Children.csv":
                                foreach (DataRow oRows in oDt.Rows)
                                {
                                    if (!oRows.IsNull(0))
                                    {
                                        var nId = int.Parse(oRows["Id"].ToString());
                                        var oChildrenTemp = new Children
                                        {
                                            Id = nId,
                                            Name = oRows["Name"].ToString(),
                                            IdCardNo = oRows["IdCardNo"].ToString(),
                                            Birthday = oRows["Birthday"].ToString() == "" ? DateTime.Now : DateTime.Parse(oRows["Birthday"].ToString()),
                                            ApplicantId = oRows["ApplicantId"].ToString() == "" ? 0 : int.Parse(oRows["ApplicantId"].ToString()),
                                            SchoolOfficeAddress = oRows["SchoolOfficeAddress"].ToString()
                                        };
                                        oChildren.Add(oChildrenTemp);
                                    }
                                }
                                break;
                            case "Brethren.csv":
                                foreach (DataRow oRows in oDt.Rows)
                                {
                                    if (!oRows.IsNull(0))
                                    {
                                        var nId = int.Parse(oRows["Id"].ToString());
                                        var oBrethrenTemp = new Brethren
                                        {
                                            Id = nId,
                                            Name = oRows["Name"].ToString(),
                                            Occupation = oRows["Occupation"].ToString(),
                                            Age = oRows["Age"].ToString() == "" ? 0 : int.Parse(oRows["Age"].ToString()),
                                            ApplicantId = oRows["ApplicantId"].ToString() == "" ? 0 : int.Parse(oRows["ApplicantId"].ToString()),
                                            OfficeAddress = oRows["OfficeAddress"].ToString()
                                        };
                                        oBrethren.Add(oBrethrenTemp);
                                    }
                                }
                                break;
                            case "Quizdetails.csv":
                                foreach (DataRow oRows in oDt.Rows)
                                {
                                    if (!oRows.IsNull(0))
                                    {
                                        var nId = int.Parse(oRows["Id"].ToString());
                                        var oQuizdetailsTemp = new Quizdetail
                                        {
                                            Id = nId,
                                            QuizTypeId = oRows["QuizTypeId"].ToString() == "" ? 0 : int.Parse(oRows["QuizTypeId"].ToString()),
                                            Description = oRows["description"].ToString(),
                                            Name = oRows["Name"].ToString(),
                                            Completiondescription = oRows["Completiondescription"].ToString(),
                                            Termsandconditions = oRows["Termsandconditions"].ToString(),
                                            IsActive = oRows["IsActive"].ToString() == "" ? false : bool.Parse(oRows["IsActive"].ToString()),
                                            Lastupdated = oRows["Lastupdated"].ToString() == "" ? DateTime.Now : DateTime.Parse(oRows["Lastupdated"].ToString()),
                                            Startdate = oRows["Startdate"].ToString() == "" ? DateTime.Now : DateTime.Parse(oRows["Startdate"].ToString()),
                                            Enddate = oRows["Enddate"].ToString() == "" ? DateTime.Now : DateTime.Parse(oRows["Enddate"].ToString()),
                                        };
                                        oQiuzdetail.Add(oQuizdetailsTemp);
                                    }
                                }
                                break;
                            case "Quiz_responses.csv":
                                foreach (DataRow oRows in oDt.Rows)
                                {
                                    if (!oRows.IsNull(0))
                                    {
                                        var nId = int.Parse(oRows["Id"].ToString());
                                        var oQuizResTemp = new Quiz_responses
                                        {
                                            Id = nId,
                                            Quizid = oRows["Quizid"].ToString() == "" ? 0 : int.Parse(oRows["Quizid"].ToString()),
                                            //Email = oRows["Email"].ToString(),
                                            UserId = oRows["UserId"].ToString(),
                                            Correctanswers = oRows["Correctanswers"].ToString() == "" ? 0 : int.Parse(oRows["Correctanswers"].ToString()),
                                            Wronganswers = oRows["Wronganswers"].ToString() == "" ? 0 : int.Parse(oRows["Wronganswers"].ToString()),
                                            Lastupdated = oRows["Lastupdated"].ToString() == "" ? DateTime.Now : DateTime.Parse(oRows["Lastupdated"].ToString())
                                        };
                                        oQiuzRes.Add(oQuizResTemp);
                                    }
                                }
                                break;
                            case "Question_responses.csv":
                                foreach (DataRow oRows in oDt.Rows)
                                {
                                    if (!oRows.IsNull(0))
                                    {
                                        var nId = int.Parse(oRows["Id"].ToString());
                                        var oQuestResTemp = new Question_responses
                                        {
                                            Id = nId,
                                            Responseid = oRows["Responseid"].ToString() == "" ? 0 : int.Parse(oRows["Responseid"].ToString()),
                                            Questionid = oRows["Questionid"].ToString() == "" ? 0 : int.Parse(oRows["Questionid"].ToString()),
                                            Reason = oRows["Reason"].ToString(),
                                            Optionid = oRows["Optionid"].ToString() == "" ? 0 : int.Parse(oRows["Optionid"].ToString()),
                                            Lastupdated = oRows["Lastupdated"].ToString() == "" ? DateTime.Now : DateTime.Parse(oRows["Lastupdated"].ToString())
                                        };
                                        oQuestRes.Add(oQuestResTemp);
                                    }
                                }
                                break;
                            case "Quiz_questions.csv":
                                foreach (DataRow oRows in oDt.Rows)
                                {
                                    if (!oRows.IsNull(0))
                                    {
                                        var nId = int.Parse(oRows["Id"].ToString());
                                        var oQuizQuestTemp = new Quiz_questions
                                        {
                                            Id = nId,
                                            Quizid = oRows["Quizid"].ToString() == "" ? 0 : int.Parse(oRows["Quizid"].ToString()),
                                            Questionorder = oRows["Questionorder"].ToString() == "" ? 0 : int.Parse(oRows["Questionorder"].ToString()),
                                            Type = oRows["type"].ToString(),
                                            Title = oRows["title"].ToString(),
                                            Lastupdated = oRows["Lastupdated"].ToString() == "" ? DateTime.Now : DateTime.Parse(oRows["Lastupdated"].ToString()),
                                            Image = oRows["Image"].ToString()
                                        };
                                        oQiuzQuest.Add(oQuizQuestTemp);
                                    }
                                }
                                break;
                            case "auth_User.csv":
                                foreach (DataRow oRows in oDt.Rows)
                                {
                                    if (!oRows.IsNull(0))
                                    {
                                        var oAuth_UserTemp = new auth_User
                                        {
                                            Id = oRows["Id"].ToString(),
                                            Password = oRows["Password"].ToString(),
                                            LDAPUsername = oRows["Password"].ToString(),
                                            AuthenticateBy = oRows["AuthenticateBy"].ToString() == "" ? 0 : int.Parse(oRows["AuthenticateBy"].ToString()),
                                            DisplayName = oRows["DisplayName"].ToString(),
                                            DisplayName2 = oRows["DisplayName2"].ToString(),
                                            Email = oRows["Email"].ToString(),
                                            Department = oRows["Department"].ToString(),
                                            Level = oRows["Level"].ToString(),
                                            RedirectPage = oRows["RedirectPage"].ToString(),
                                            ExpireOn = oRows["ExpireOn"]?.ToString() == "" ? DateTime.Now.AddMonths(1) : DateTime.Parse(oRows["ExpireOn"]?.ToString()),
                                            //IsActive = bool.Parse(oRows["IsActive"].ToString()),
                                            IsActive = false,
                                            LastLogonOn = oRows["LastLogonOn"].ToString() == "" ? DateTime.Now : DateTime.Parse(oRows["LastLogonOn"]?.ToString()),
                                            LastLogonMachineName = oRows["LastLogonMachineName"].ToString(),
                                            LastLogonIP = oRows["LastLogonIP"].ToString(),
                                            CreatedOn = oRows["CreatedOn"].ToString() == "" ? DateTime.Now : DateTime.Parse(oRows["CreatedOn"]?.ToString()),
                                            CreatedUserId = oRows["CreatedUserId"].ToString(),
                                            UpdatedOn = oRows["UpdatedOn"].ToString() == "" ? DateTime.Now : DateTime.Parse(oRows["UpdatedOn"]?.ToString()),
                                            UpdatedUserId = oRows["UpdatedUserId"].ToString(),
                                            //CFStr1 = oRows["CFStr1"].ToString(),
                                            //CFStr2 = oRows["CFStr2"].ToString(),
                                            //CFStr3 = oRows["CFStr3"].ToString(),
                                            //CFStr4 = oRows["CFStr4"].ToString(),
                                            //CFStr5 = oRows["CFStr5"].ToString(),
                                            //CFInt1 = int.Parse(oRows["CFInt1"].ToString()),
                                            //CFInt2 = int.Parse(oRows["CFInt2"].ToString()),
                                            //CFInt3 = int.Parse(oRows["CFInt3"].ToString()),
                                            //CFInt4 = int.Parse(oRows["CFInt4"].ToString()),
                                            //CFInt5 = int.Parse(oRows["CFInt5"].ToString()),
                                            //CFDec1 = decimal.Parse(oRows["CFDec1"].ToString()),
                                            //CFDec2 = decimal.Parse(oRows["CFDec2"].ToString()),
                                            //CFDec3 = decimal.Parse(oRows["CFDec3"].ToString()),
                                            //CFDec4 = decimal.Parse(oRows["CFDec4"].ToString()),
                                            //CFDec5 = decimal.Parse(oRows["CFDec5"].ToString()),
                                            //CFDtm1 = DateTime.Parse(oRows["CFDtm1"]?.ToString()),
                                            //CFDtm2 = DateTime.Parse(oRows["CFDtm2"]?.ToString()),
                                            //CFDtm3 = DateTime.Parse(oRows["CFDtm3"]?.ToString()),
                                            //CFDtm4 = DateTime.Parse(oRows["CFDtm4"]?.ToString()),
                                            //CFDtm5 = DateTime.Parse(oRows["CFDtm5"]?.ToString()),
                                            //BlockOn = DateTime.Parse(oRows["BlockOn"]?.ToString()),
                                            //PasswordExpireOn = DateTime.Parse(oRows["PasswordExpireOn"]?.ToString())
                                        };
                                        oAuth_User.Add(oAuth_UserTemp);
                                    }
                                }
                                break;
                        }
                    }
                    using (var oDb = new ApprenticeDB())
                    {
                        foreach (var oApplicantItem in oApplicant)
                        {
                            foreach (var oData in oWorkExperience.Where(x => x.ApplicantId == oApplicantItem.Id).ToList())
                                oApplicantItem.WorkExperience.Add(oData);
                            foreach (var oData in oTraining.Where(x => x.ApplicantId == oApplicantItem.Id).ToList())
                                oApplicantItem.Training.Add(oData);
                            foreach (var oData in oSpouse.Where(x => x.ApplicantId == oApplicantItem.Id).ToList())
                                oApplicantItem.Spouse.Add(oData);
                            foreach (var oData in oLanguageSkill.Where(x => x.ApplicantId == oApplicantItem.Id).ToList())
                                oApplicantItem.LanguageSkill.Add(oData);
                            foreach (var oData in oEducation.Where(x => x.ApplicantId == oApplicantItem.Id).ToList())
                                oApplicantItem.Education.Add(oData);
                            foreach (var oData in oDisease.Where(x => x.ApplicantId == oApplicantItem.Id).ToList())
                                oApplicantItem.Disease.Add(oData);
                            foreach (var oData in oChildren.Where(x => x.ApplicantId == oApplicantItem.Id).ToList())
                                oApplicantItem.Children.Add(oData);
                            foreach (var oData in oBrethren.Where(x => x.ApplicantId == oApplicantItem.Id).ToList())
                                oApplicantItem.Brethren.Add(oData);

                            oDb.Applicants.AddOrUpdate(oApplicantItem);
                        }
                        oDb.SaveChanges();
                    }
                    using (var oDb = new ApprenticeDB())
                    {
                        foreach (var oRow in oAuth_User)
                            oDb.auth_User.AddOrUpdate(oRow);
                        oDb.SaveChanges();
                        foreach (var oRow in oQiuzdetail)
                            oDb.Quizdetails.AddOrUpdate(oRow);
                        oDb.SaveChanges();
                        foreach (var oRow in oQiuzQuest)
                            oDb.Quiz_questions.AddOrUpdate(oRow);
                        oDb.SaveChanges();
                        foreach (var oRow in oQiuzRes)
                        {
                            foreach (var oRows in oQuestRes.Where(x => x.Responseid == oRow.Id))
                                oRow.Question_responses.Add(oRows);
                            oDb.Quiz_responses.AddOrUpdate(oRow);
                            oDb.SaveChanges();
                        }
                        ViewBag.ImportStatus = true;
                        //CLEARxFile(sPathFolder);
             
                    }
                }
                catch (Exception ex)
                {
                    ViewBag.Error = ex.Message;
                    throw ex;
                }
            }
            return View();
        }

        private void CLEARxFile(string sPathFolder)
        {
            if (Directory.Exists(sPathFolder))
                Directory.Delete(sPathFolder, true);//ลบทิ้ง
            if (!Directory.Exists(sPathFolder))
                Directory.CreateDirectory(sPathFolder);//สร้างใหม่
        }

        private DataTable CONVoCSVtoDataTable(string sPath, string sFileCsv)
        {
            try
            {
                var sFilePath = Path.Combine(sPath, sFileCsv);
                var oDt = new DataTable();
                using (StreamReader oSr = new StreamReader(sFilePath))
                {
                    string[] headers = oSr.ReadLine().Split(',');
                    foreach (string header in headers)
                    {
                        oDt.Columns.Add(header);
                    }
                    while (!oSr.EndOfStream)
                    {
                        string[] oRows = Regex.Split(oSr.ReadLine(), ",(?=(?:[^\"]*\"[^\"]*\")*[^\"]*$)");
                        var oDr = oDt.NewRow();
                        for (int i = 0; i < headers.Length; i++)
                        {
                            oDr[i] = oRows[i];
                        }
                        oDt.Rows.Add(oDr);
                    }
                }
                return oDt;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        private void ExtractFilesZ(string sImportPath, string sPathFile)
        {   
            try
            {
                using (ZipArchive oArchive = ZipFile.Open(sPathFile, ZipArchiveMode.Update))
                {
                    foreach (ZipArchiveEntry oFile in oArchive.Entries)
                    {
                        string oCompleteFileName = Path.GetFullPath(Path.Combine(sImportPath, oFile.FullName));

                        if (!oCompleteFileName.StartsWith(sImportPath, StringComparison.OrdinalIgnoreCase))
                        {
                            throw new IOException("Trying to extract file outside of destination directory. See this link for more info: https://snyk.io/research/zip-slip-vulnerability");
                        }
                        if (oFile.Name == "")
                        {// Assuming Empty for Directory
                            Directory.CreateDirectory(Path.GetDirectoryName(oCompleteFileName));
                            continue;
                        }
                        oFile.ExtractToFile(oCompleteFileName, true);
                    }
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        //private void CreateZipContentFolder(List<String> zips, string destinationPath)
        //{
        //    if (zips.Any())
        //    {
        //        foreach (string zip in zips)
        //        {
        //            string dirName = Path.Combine(destinationPath, Path.GetFileNameWithoutExtension(zip));

        //            using (ZipArchive archive = ZipFile.OpenRead(zip))
        //            {
        //                foreach (ZipArchiveEntry entry in archive.Entries)
        //                {
        //                    if (entry.FullName.EndsWith("/"))
        //                    {
        //                        ZipFile.ExtractToDirectory(zip, destinationPath);
        //                        break;
        //                    }
        //                    else if (!Directory.Exists(dirName))
        //                    {
        //                        Directory.CreateDirectory(dirName);
        //                        ZipFile.ExtractToDirectory(zip, dirName);
        //                        break;
        //                    }
        //                }
        //            }
        //        }
        //    }
        //}
        //private static List<T> ConvertDataTable<T>(DataTable dt)
        //{
        //    List<T> data = new List<T>();
        //    foreach (DataRow row in dt.Rows)
        //    {
        //        T item = GetItem<T>(row);
        //        data.Add(item);
        //    }
        //    return data;
        //}
        //private static T GetItem<T>(DataRow dr)
        //{
        //    Type temp = typeof(T);
        //    T obj = Activator.CreateInstance<T>();

        //    foreach (DataColumn column in dr.Table.Columns)
        //    {
        //        foreach (PropertyInfo pro in temp.GetProperties())
        //        {
        //            if (pro.Name == column.ColumnName)
        //            {
        //                var data = dr[column.ColumnName] == null ? "" : dr[column.ColumnName].ToString();
        //                if (data != "")
        //                {
        //                    switch (pro.PropertyType.Name)
        //                    {
        //                        case "Int32":
        //                            pro.SetValue(obj, int.Parse(data), null); break;
        //                        case "Nullable`1":
        //                        case "DateTime":
        //                            //if (data >= 0)
        //                            //{

        //                            //}
        //                            pro.SetValue(obj, data == "" ? DateTime.Now : DateTime.Parse(data), null); break;
        //                        default: pro.SetValue(obj, data, null); break;
        //                    }
        //                }
        //                else
        //                    pro.SetValue(obj, data, null);

        //            }
        //            else
        //                continue;
        //        }
        //    }
        //    return obj;
        //}
    }
}