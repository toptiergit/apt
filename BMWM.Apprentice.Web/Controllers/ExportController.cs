using ApplicationForm.DBContext;
using ApplicationForm.Models;
using BMWM.Apprentice.Web.AuthWebService;
using DataTables.Mvc;
using FastMember;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Globalization;
using System.IO;
using System.IO.Compression;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading;
using System.Web;
using System.Web.Mvc;
using System.Windows.Forms;
using JsonResult = System.Web.Mvc.JsonResult;

namespace ApplicationForm.Controllers
{
    [AuthorizeUser]
    public class ExportController : Controller
    {
        // GET: Export
        public ExportController()
        {
            //_ = Thread.CurrentThread.CurrentUICulture;
            var oCustomCulture = new CultureInfo("en-EN", true);
            oCustomCulture.DateTimeFormat.ShortDatePattern = "dd/MM/yyyy";
            Thread.CurrentThread.CurrentCulture = oCustomCulture;
            Thread.CurrentThread.CurrentUICulture = oCustomCulture;
        }
        public ActionResult Index()
        {

            return View();
        }
        public JsonResult ExportData(List<string> Id)
        {

            //var path = Path.Combine(Server.MapPath("~/Files"), "QuizTemplate.xlsx");
            //var sExportPath = "\\Downloads\\";//FolderExport ที่เสกขึ้น
            var sExportPath = Server.MapPath("~/Files/Exportfile");
            if (Directory.Exists(sExportPath))
                Directory.Delete(sExportPath, true);//ลบทิ้ง
            if (!Directory.Exists(sExportPath))
                Directory.CreateDirectory(sExportPath);//สร้างใหม่
            List<string> oTableName = new List<string> { "Applicant", "WorkExperience", "Training", "Spouse", "LanguageSkill", "Education", "Disease", "Children", "Brethren", "Quiz_responses", "Question_responses", "auth_User", "Quizdetails", "Quiz_questions" };
            IQueryable<Quiz_responses> oQuizRes = null;
            using (var oDb = new ApprenticeDB())
            {
                foreach (var sTableName in oTableName)
                {
                    var sFileName = sTableName + ".csv";
                    var oTable = new DataTable();
                    switch (sTableName)
                    {
                        case "Applicant":
                            var oApplicants = oDb.Applicants.Where(e => Id.Contains(e.Id.ToString())).AsQueryable();
                            using (var oReader = ObjectReader.Create(oApplicants))
                            {
                                oTable.Load(oReader);
                                oTable.Columns.Remove(oTable.Columns["Brethren"]);
                                oTable.Columns.Remove(oTable.Columns["Children"]);
                                oTable.Columns.Remove(oTable.Columns["Disease"]);
                                oTable.Columns.Remove(oTable.Columns["Education"]);
                                oTable.Columns.Remove(oTable.Columns["LanguageSkill"]);
                                oTable.Columns.Remove(oTable.Columns["Spouse"]);
                                oTable.Columns.Remove(oTable.Columns["Training"]);
                                oTable.Columns.Remove(oTable.Columns["WorkExperience"]);
                            }
                            break;
                        case "WorkExperience":
                            var oWorkExperiences = oDb.WorkExperiences.Where(e => Id.Contains(e.ApplicantId.ToString())).AsQueryable();
                            using (var oReader = ObjectReader.Create(oWorkExperiences))
                            {
                                oTable.Load(oReader);
                                oTable.Columns.Remove(oTable.Columns["Applicant"]);
                            }
                            break;
                        case "Training":
                            var oTraining = oDb.Trainings.Where(e => Id.Contains(e.ApplicantId.ToString())).AsQueryable();
                            using (var oReader = ObjectReader.Create(oTraining))
                            {
                                oTable.Load(oReader);
                                oTable.Columns.Remove(oTable.Columns["Applicant"]);
                            }
                            break;
                        case "Spouse":
                            var oSpouse = oDb.Spouses.Where(e => Id.Contains(e.ApplicantId.ToString())).AsQueryable();
                            using (var oReader = ObjectReader.Create(oSpouse))
                            {
                                oTable.Load(oReader);
                                oTable.Columns.Remove(oTable.Columns["Applicant"]);
                            }
                            break;
                        case "LanguageSkill":
                            var oLanguageSkill = oDb.LanguageSkills.Where(e => Id.Contains(e.ApplicantId.ToString())).AsQueryable();
                            using (var oReader = ObjectReader.Create(oLanguageSkill))
                            {
                                oTable.Load(oReader);
                                oTable.Columns.Remove(oTable.Columns["Applicant"]);
                            }
                            break;
                        case "Education":
                            var oEducation = oDb.Educations.Where(e => Id.Contains(e.ApplicantId.ToString())).AsQueryable();
                            using (var oReader = ObjectReader.Create(oEducation))
                            {
                                oTable.Load(oReader);
                                oTable.Columns.Remove(oTable.Columns["Applicant"]);
                            }
                            break;
                        case "Disease":
                            var oDisease = oDb.Diseases.Where(e => Id.Contains(e.ApplicantId.ToString())).AsQueryable();
                            using (var oReader = ObjectReader.Create(oDisease))
                            {
                                oTable.Load(oReader);
                                oTable.Columns.Remove(oTable.Columns["Applicant"]);
                            }
                            break;
                        case "Children":
                            var oChildrens = oDb.Childrens.Where(e => Id.Contains(e.ApplicantId.ToString())).AsQueryable();
                            using (var oReader = ObjectReader.Create(oChildrens))
                            {
                                oTable.Load(oReader);
                                oTable.Columns.Remove(oTable.Columns["Applicant"]);
                            }
                            break;
                        case "Brethren":
                            var oBrethrens = oDb.Brethrens.Where(e => Id.Contains(e.ApplicantId.ToString())).AsQueryable();
                            using (var oReader = ObjectReader.Create(oBrethrens))
                            {
                                oTable.Load(oReader);
                                oTable.Columns.Remove(oTable.Columns["Applicant"]);
                            }
                            break;
                        case "Quiz_responses":
                            oQuizRes = (from a in oDb.Applicants
                                        join c in oDb.Quiz_responses on a.Email equals c.UserId
                                        where Id.Contains(a.Id.ToString())
                                        select c
                                            );
                            using (var oReader = ObjectReader.Create(oQuizRes))
                            {
                                oTable.Load(oReader);
                                oTable.Columns.Remove(oTable.Columns["auth_User"]);
                                oTable.Columns.Remove(oTable.Columns["quizdetail"]);
                                oTable.Columns.Remove(oTable.Columns["question_responses"]);
                            }
                            break;
                        case "Question_responses":
                            foreach (var oRow in oQuizRes)
                            {
                                var oQuestRes = oDb.Question_responses.Where(e => oRow.Id.ToString().Contains(e.Responseid.ToString()))
                                    .Select(s => new
                                    {
                                        s.Id,
                                        s.Responseid,
                                        s.Questionid,
                                        s.Optionid,
                                        s.Lastupdated,
                                        s.Reason
                                    }
                                    ).AsQueryable();
                                using (var oReader = ObjectReader.Create(oQuestRes))
                                {
                                    oTable.Load(oReader);
                                }
                            }
                            if (oQuizRes.Count()==0)//ถ้าไม่มีข้อมูล ให้เอาชื่อฟิลด์เท่านั้น
                            {
                                var oQuestRes = oDb.Question_responses.Where(e => "".ToString().Contains(e.Responseid.ToString()));
                                using (var oReader = ObjectReader.Create(oQuestRes))
                                {
                                    oTable.Load(oReader);
                                }
                            }
                            break;
                        case "auth_User":
                            var oAuth_User = (from a in oDb.Applicants
                                              join c in oDb.auth_User on a.Email equals c.Id
                                              where Id.Contains(a.Id.ToString())
                                              select c
                                            );
                            using (var oReader = ObjectReader.Create(oAuth_User))
                            {
                                oTable.Load(oReader);
                                oTable.Columns.Remove(oTable.Columns["quiz_responses"]);
                                //oTable.Columns.Remove(oTable.Columns["RedirectPage"]);
                            }
                            break;
                        case "Quizdetails":
                            var oQuizdetails = oDb.Quizdetails
                                .Select(s => new
                                {
                                    s.Id,
                                    s.IsActive,
                                    s.Lastupdated,
                                    s.Name,
                                    s.Description,
                                    s.QuizTypeId,
                                    s.Termsandconditions,
                                    s.Completiondescription,
                                    s.Startdate,
                                    s.Enddate
                                })
                                .AsQueryable();
                            using (var oReader = ObjectReader.Create(oQuizdetails))
                            {
                                oTable.Load(oReader);
                            }
                            break;
                        case "Quiz_questions":
                            var oQuizQuest = oDb.Quiz_questions
                                .Select(s => new
                                {
                                    s.Id,
                                    s.Quizid,
                                    s.Questionorder,
                                    s.Type,
                                    s.Title,
                                    s.Lastupdated,
                                    s.Image
                                })
                                .AsQueryable();
                            using (var oReader = ObjectReader.Create(oQuizQuest))
                            {
                                oTable.Load(oReader);
                                //oTable.Columns.Remove(oTable.Columns["quiz_responses"]);
                                //oTable.Columns.Remove(oTable.Columns["quiz_responses"]);
                                //oTable.Columns.Remove(oTable.Columns["quiz_responses"]);
                                //oTable.Columns.Remove(oTable.Columns["quiz_responses"]);
                            }
                            break;
                    }
                    WritFileCSV(sExportPath, sFileName, oTable);
                }
                //ClearFileZip(sExportPath);//ลบไฟล์Zipอันเดิมออก
                var sZipFileName = ZipFilesZ(sExportPath);//Zipไฟล์ใหม่
                //return Redirect("Index");
                return Json(new { ZipFileName = sZipFileName });
            }
        }

        private static void ClearFileZip(string sExportPath)
        {
            try
            {
                DirectoryInfo oFilePath = new DirectoryInfo(sExportPath);//ที่อยู่ไฟล์ ที่จะลบ
                foreach (FileInfo oFileToCompress in oFilePath.GetFiles("*.zip"))
                {
                    var sFilePath = Path.Combine(sExportPath, oFileToCompress.FullName);//ไฟล์Zip   
                    if (System.IO.File.Exists(sFilePath))
                        System.IO.File.Delete(sFilePath);
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        private static void WritFileCSV(string sExportPath, string sFileName, DataTable oData)
        {

            var oStr = new StringBuilder();
            foreach (DataColumn oColumn in oData.Columns)
            {
                oStr.Append(oColumn.ColumnName + ',');
            }
            // tCsv = tCsv.Substring(0, tCsv.Length - 1);// ลบ ,ตัวสุดท้ายออก
            oStr.Length--;
            oStr.Append("\r\n");
            foreach (DataRow oRow in oData.Rows)
            {
                foreach (DataColumn oColumn in oData.Columns)
                {
                    var sReplacement = Regex.Replace(oRow[oColumn.ColumnName].ToString(), @"\t|\n|\r", "");
                    oStr.Append(sReplacement.Replace(",", ";") + ',');
                }
                oStr.Length--;
                oStr.Append("\r\n");
            }
            if (oStr != null)
            {
                oStr.Length--;//ลบ "\r\n" ตัวสุดท้ายออก
            }

            //เช็คว่ามี Folder อยู่หรือไม่
            if (!Directory.Exists(sExportPath))
            {
                Directory.CreateDirectory(sExportPath);
            }
            var sPath = Path.Combine(sExportPath, sFileName);
            //เขียนไฟล์ .CSV Export
            using (var oWriterExport = new StreamWriter(sPath, false, Encoding.UTF8))
            {
                oWriterExport.Write(oStr.ToString());
                oWriterExport.Flush();
                oWriterExport.Close();
            }
        }
        public JsonResult GETDataTable([ModelBinder(typeof(DataTablesBinder))] IDataTablesRequest datatable, string FNmae, string LName, string Sex, DateTime? DateFrom, DateTime? DateTo)
        {
            using (var oDb = new ApprenticeDB())
            {
                var oQ = oDb.Applicants.AsQueryable();

                if (DateFrom.HasValue)
                    oQ = oQ.Where(e => e.UpdatedOn >= DateFrom.Value);
                if (DateTo.HasValue)
                {
                    var tdate = DateTo.Value.Date.AddDays(1);
                    oQ = oQ.Where(e => e.UpdatedOn < tdate);
                }
                if (!String.IsNullOrEmpty(FNmae))
                    oQ = oQ.Where(e => e.FirstNameEn.Contains(FNmae) || e.FirstNameTh.Contains(FNmae));

                if (!String.IsNullOrEmpty(LName))
                    oQ = oQ.Where(e => e.LastNameEn.Contains(LName) || e.LastNameTh.Contains(LName));
                if (!String.IsNullOrEmpty(Sex))
                    oQ = oQ.Where(e => e.Sex == Sex);
                var oData = oQ.Select(s => new
                {
                    s.Id,
                    EnName = s.FirstNameEn + " " + s.LastNameEn,
                    ThName = s.FirstNameTh + " " + s.LastNameTh,
                    s.Email,
                    RegistDate = s.UpdatedOn
                }).ToList();
                return Json(DataTablesService.GetDataTablesResponse(datatable, oData.AsQueryable()));
            }
        }
        public JsonResult DeleteData(List<string> Id)
        {
            using (var oDb = new ApprenticeDB())
            {
                var oApplicants = oDb.Applicants.Where(e => Id.Contains(e.Id.ToString())).ToList();
                if (oApplicants.Count() > 0)
                {
                    foreach (var oRow in oApplicants)
                    {
                        var oBrethrens = oDb.Brethrens.Where(e => e.ApplicantId == oRow.Id).FirstOrDefault();
                        if (oBrethrens != null)
                            oDb.Brethrens.Remove(oBrethrens);
                        var oChildrens = oDb.Childrens.Where(e => e.ApplicantId == oRow.Id).FirstOrDefault();
                        if (oChildrens != null)
                            oDb.Childrens.Remove(oChildrens);
                        var oDiseases = oDb.Diseases.Where(e => e.ApplicantId == oRow.Id).FirstOrDefault();
                        if (oDiseases != null)
                            oDb.Diseases.Remove(oDiseases);
                        var oEducations = oDb.Educations.Where(e => e.ApplicantId == oRow.Id).FirstOrDefault();
                        if (oEducations != null)
                            oDb.Educations.Remove(oEducations);
                        var oLanguageSkills = oDb.LanguageSkills.Where(e => e.ApplicantId == oRow.Id).FirstOrDefault();
                        if (oLanguageSkills != null)
                            oDb.LanguageSkills.Remove(oLanguageSkills);
                        var oSpouses = oDb.Spouses.Where(e => e.ApplicantId == oRow.Id).FirstOrDefault();
                        if (oSpouses != null)
                            oDb.Spouses.Remove(oSpouses);
                        var oTrainings = oDb.Trainings.Where(e => e.ApplicantId == oRow.Id).FirstOrDefault();
                        if (oTrainings != null)
                            oDb.Trainings.Remove(oTrainings);
                        var oWorkExperiences = oDb.WorkExperiences.Where(e => e.ApplicantId == oRow.Id).FirstOrDefault();
                        if (oBrethrens != null)
                            oDb.WorkExperiences.Remove(oWorkExperiences);
                        oDb.Applicants.Remove(oRow);
                        var oQuizRes = oDb.Quiz_responses.Where(e => e.UserId == oRow.Email).FirstOrDefault();
                        if (oQuizRes != null)
                            oDb.Quiz_responses.Remove(oQuizRes);
                        //var oUserItem = oDb.auth_UserItem.Where(e => e.Email == oRow.Email).FirstOrDefault();
                        //if (oUserItem != null)
                        //    oDb.auth_User.Remove(oUserItem);
                        var oUser = oDb.auth_User.Where(e => e.Id == oRow.Email).FirstOrDefault();
                        if (oUser != null)
                            oDb.auth_User.Remove(oUser);

                        //oDb.Quiz_questions.Where(e => e.Quizid == oQuizRes.Quizid);
                    }
                }
                oDb.SaveChanges();
                return Json(new { success = true });
            }
        }
        public string ZipFilesZ(string psExportPath)
        {
            //var sExportPath = psExportPath.Substring(0, psExportPath.LastIndexOf('\\') + 1);
            var sDate = DateTime.Now.ToString("yyyyMMddHHmmss", new CultureInfo("en-US"));
            var sFileType = "*.csv"; //ประเภทไฟล์ที่จะZip
            var sZipFileName = "Exportfile" + sDate + ".zip";// ชื่อไฟล์ที่ หลังจากZip     
            var sFullFilePath = Path.Combine(psExportPath, sZipFileName);//ที่อยู่ไฟล์ หลังจากZip
            //Delete the zip file
            //if (System.IO.File.Exists(sFullFilePath)) System.IO.File.Delete(sFullFilePath);
            DirectoryInfo oFilePath = new DirectoryInfo(psExportPath);//ที่อยู่ไฟล์ ที่จะZip
            try
            {
                foreach (FileInfo oFileToCompress in oFilePath.GetFiles(sFileType))
                {
                    using (ZipArchive archive = ZipFile.Open(sFullFilePath, ZipArchiveMode.Update))
                    {
                        archive.CreateEntryFromFile(oFileToCompress.FullName, oFileToCompress.Name);
                    }
                }
                return sZipFileName;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
    }
}