using ApplicationForm.DBContext;
using ApplicationForm.Models;
using BMWM.Apprentice.Web.AuthModels;
using BMWM.Apprentice.Web.AuthService;
using BMWM.Apprentice.Web.AuthWebService;
using DataTables.Mvc;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Mail;
using System.Threading;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;
using Toptier.Reporting;
using JsonResult = System.Web.Mvc.JsonResult;

namespace ApplicationForm.Controllers
{
    
    public class ReportController : Controller
    {
        public ApprenticeDB dbContext = new ApprenticeDB();
        private readonly string AuthUserRole = ConfigurationManager.AppSettings["auth-user"].ToString();
        private readonly string AuthAdminRole = ConfigurationManager.AppSettings["auth-admin"].ToString(); 
             private readonly string AuthRecruitRole = ConfigurationManager.AppSettings["auth-test1"].ToString();
        // GET: Report
        public ReportController()
        {
            _ = Thread.CurrentThread.CurrentUICulture;
        }
        [AuthorizeUser]
        public ActionResult Index()
        {
            return View();
        }
        //[HttpPost]
        //public ActionResult Index(string FNmae, string LName, string Sex, DateTime? DateFrom, DateTime? DateTo)
        //{

        //    return View();
        //}

        public JsonResult RegisterDataTable([ModelBinder(typeof(DataTablesBinder))] IDataTablesRequest datatable, bool advSearch,
            string FNmae, string LName, string Sex, DateTime? DateFrom, DateTime? DateTo)
        {
            using (var db = new ApprenticeDB())
            {
                var q = db.Applicants.AsQueryable();

                if (DateFrom.HasValue)
                    q = q.Where(e => e.UpdatedOn >= DateFrom.Value);
                if (DateTo.HasValue)
                {
                    var tdate = DateTo.Value.Date.AddDays(1);
                    q = q.Where(e => e.UpdatedOn < tdate);
                }

                if (!String.IsNullOrEmpty(FNmae))
                    q = q.Where(e => e.FirstNameEn.Contains(FNmae) || e.FirstNameTh.Contains(FNmae));

                if (!String.IsNullOrEmpty(LName))
                    q = q.Where(e => e.LastNameEn.Contains(LName) || e.LastNameTh.Contains(LName));

                if (!String.IsNullOrEmpty(Sex))
                    q = q.Where(e => e.Sex == Sex);
                //q = q.Where(e => e.SendMailStatus == false);
                var data = q.Select(s => new
                {
                    s.Id,
                    EnName = s.FirstNameEn + " " + s.LastNameEn,
                    ThName = s.FirstNameTh + " " + s.LastNameTh,
                    s.Sex,
                    Age = DateTime.Now.Year - s.DateOfBirth.Year,
                    s.Email,
                    s.Tel,
                    GPA = s.Education.OrderByDescending(o => o.ToYear).FirstOrDefault().Grade,
                    RegistDate = s.UpdatedOn,
                    s.SendMailStatus
                }).ToList();
                return Json(DataTablesService.GetDataTablesResponse(datatable, data.AsQueryable()));
            }
        }

        [HttpGet]
        public ActionResult Applicant(int ApplicantId)
        {
            List<Models.ApplicationForm> ds = new List<Models.ApplicationForm>();
            Models.ApplicationForm applicationForm = ApplicationFormController.GetApplicantById(ApplicantId);
            ds.Add(applicationForm);
            var datasources = new Dictionary<string, object>();
            datasources.Add("DataSet1", ds);
            var rpt = new ReportViewerData
            {
                ReportName = "Applicant Report",
                ReportPath = Path.Combine("bin/Reports/Templates", "Applicant.rdlc"),
                DataSources = datasources
            };

            //set parameter
            //var parameters = new Dictionary<string, string>();
            //parameters.Add("pmOrderNo", orderNo);
            //parameters.Add("pmDeliveryDate", deliveryDate);
            //parameters.Add("pmCustomerName", customerName);
            //parameters.Add("pmPrntUrl", WMS.AppSettings.PrntUrl);
            //parameters.Add("pmRefDesc", refDesc);
            //rpt.Parameters = parameters;

            Session[rpt.Id] = rpt;

            return Redirect("~/ReportViewer.aspx?rptsid=" + rpt.Id);
        }
        [AuthorizeUser]
        [HttpPost]
        public ActionResult Index(List<int> ids)
        {
            
            using (var db = new ApprenticeDB())
            {
                foreach (var id in ids)
                {
                    var applicate = db.Applicants.Find(id);
                    User objUser = new User
                    {
                        Id = applicate.Email,
                        Password = applicate.IdNo,
                        DisplayName = applicate.FirstNameEn + " " + applicate.LastNameEn,
                        Email = applicate.Email,
                        IsActive = true,
                        AuthenticateBy = UserAuthenticateBy.DB
                    };
                    //apiUsers.CreateAuthUser(objUser);
                    string UserId = UserAuthentication.UserId;
                    ManagerService.CreateUser(objUser, UserId);
                    SaveAuthItem(objUser.Id, new List<string> { AuthRecruitRole, AuthUserRole });
                    Email(objUser);
                    //Contact(objUser);
                    applicate.SendMailStatus = true;
                    db.SaveChanges();
                }
            }
            return View();
        }
       
        private void Email(User poUser)
        {
            try
            {
                var sEmailSender = ConfigurationManager.AppSettings["EmailSender"].ToString();
                var sPass = ConfigurationManager.AppSettings["EmailPass"].ToString();
                var sUrl = ConfigurationManager.AppSettings["Url"].ToString();
                var sPathUrl= HttpContext.Request.Url.ToString();
                sPathUrl = sPathUrl.Substring(0,sPathUrl.LastIndexOf('/') + 1);
                sUrl = sPathUrl + sUrl;
                var sPath = Path.Combine(Server.MapPath("~/Files"), "QuickGuide-RecruitmentTest.pdf");
                
                var sMsg1 = "เรียน คุณ "; 
                var sMsg2 = "คุณได้ผ่านการคัดเลือกเพื่อเข้าไปทำแบบทดสอบจากทางเราแล้ว";
                var sMsg3 = "กรุณากดที่ Link ด้านล่าง เพื่อเข้าไปทำแบบทดสอบ";              
                var sMsg4 = "โดยให้กรอก Username &Password ดังนี้";
                var sMsg5 = "Username : (Email ที่ใช้สมัคร)";
                var sMsg6 = "Password : (รหัสบัตรประชาชนที่ใช้สมัคร)";
                var sMsg7 = "แล้วทำตามคู่มือในไฟล์ที่แนบมา";
                
                var oBody = "<h4>{0}</h4> <p>{1}</p> <h4>{2}</h4> <h4>{3}</h4> <br> <h4>{4}</h4> <h4>{5}</h4> <h4>{6}</h4> <p>{7}</p>";
                var oMessage = new MailMessage();
                oMessage.From = new MailAddress(sEmailSender);
                oMessage.To.Add(new MailAddress(poUser.Email));
                oMessage.Subject = "คุณได้รับการคัดเลือกเพื่อทำแบบทดสอบจากทางเรา";
                oMessage.IsBodyHtml = true; //to make message body as html  
                oMessage.Body = string.Format(oBody, sMsg1 + poUser.DisplayName, sMsg2, sMsg3,sUrl, sMsg4, sMsg5, sMsg6, sMsg7);
                oMessage.Attachments.Add(new Attachment(sPath));
                //oMessage.CC.Add(adressCC.Address);
                var oSmtp = new SmtpClient
                {
                    Port = 587,
                    Host = "smtp.gmail.com", //for gmail host  
                    EnableSsl = true,
                    UseDefaultCredentials = false,
                    Credentials = new NetworkCredential(sEmailSender, sPass),
                    DeliveryMethod = SmtpDeliveryMethod.Network
                };
                oSmtp.Send(oMessage);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
            }
        }
        private void SaveAuthItem(string UserId, List<string> itemsCode)
        {
            List<string> lst = new List<string>();

            var obj = ManagerService.GetAllItems();
            foreach (var item in obj)
            {
                string item_code = item.Code;

                if (itemsCode.Contains(item_code))
                {
                    lst.Add(item_code);
                }//if
            }//foreach

            if (lst.Count > 0)
            {
                string ByUserId = UserAuthentication.UserId;
                ManagerService.UpdateUserItem(UserId, lst, ByUserId);
            }
        }

        [AuthorizeUser]
        public ActionResult Quiz()
        {

            ViewData["QuizType"] = new SelectList(dbContext.QuizTypes.Select(e => new { value = e.Id, text = e.Name }), "value", "text");

            return View();
        }
        public JsonResult QuizResponseDataTable([ModelBinder(typeof(DataTablesBinder))] IDataTablesRequest datatable, bool advSearch,
            string Name, string QuizType, DateTime? DateFrom, DateTime? DateTo)
        {
            using (var db = new DBContext.ApprenticeDB())
            {
                var q = db.Quiz_responses.AsQueryable();
                if (DateFrom.HasValue)
                    q = q.Where(e => e.Lastupdated >= DateFrom.Value);
                if (DateTo.HasValue)
                {
                    var tdate = DateTo.Value.Date.AddDays(1);
                    q = q.Where(e => e.Lastupdated < tdate);
                }
                if (!String.IsNullOrEmpty(Name))
                    q = q.Where(e => e.auth_User.DisplayName.Contains(Name));

                if (!String.IsNullOrEmpty(QuizType))
                {
                    int intQuizType = int.Parse(QuizType);
                    q = q.Where(e => e.Quizdetail.QuizTypeId == intQuizType);
                }

                var data = q.Select(s => new
                {
                    QuizResponsesId = s.Id,
                    DisplayName = s.auth_User.DisplayName,
                    Email = s.UserId,
                    QuizType = s.Quizdetail.QuizType.Name,
                    Name= s.Quizdetail.Name,
                    Correct = s.Correctanswers,
                    Wrong = s.Wronganswers,
                    UpdatedOn = s.Lastupdated
                }).ToList();

                return Json(DataTablesService.GetDataTablesResponse(datatable, data.AsQueryable()));
            }
        }
        [AuthorizeUser]
        public ActionResult QuestionRespons(int intResponseId, string Name)
        {
            Session["ResponseId"] = intResponseId;
            ViewBag.Name = Name;
            ViewData["QuizType"] = new SelectList(dbContext.QuizTypes.Select(e => new { value = e.Id, text = e.Name }), "value", "text");
            return View();
        }
        [HttpPost]
        public JsonResult QuestionResponsTable([ModelBinder(typeof(DataTablesBinder))] IDataTablesRequest datatable)
        {
            var nResponseId = Session["ResponseId"];
            var oResult = dbContext.Database.SqlQuery<QuestionReportVM>(@"SELECT 
         QuizQues.[title] AS QuestionText,
         (SELECT questionoption FROM question_options WHERE questionid=QuesRes.[questionid] AND id=QuesAnswer.[optionid]) AS QuizReqText,
         QuesOpt.[questionoption] AS QuizResText,
         CASE WHEN QuesAnswer.[optionid]=QuesRes.[optionid] THEN 'True' ELSE 'False' END AS isCorrect
         ,QuesRes.[lastupdated] AS UpdatedOn 
         ,QuesRes.[responseid] AS QuizResID
         FROM[dbo].[question_responses] AS QuesRes
         LEFT OUTER JOIN[dbo].[quiz_questions] AS QuizQues ON QuesRes.[questionid] =  QuizQues.[id]
         LEFT OUTER JOIN[dbo].[question_answer] AS QuesAnswer ON QuesRes.[questionid] =  QuesAnswer.[questionid]
         LEFT OUTER JOIN[dbo].[question_options] AS QuesOpt ON QuesRes.[optionid] =  QuesOpt.[id]");
            var lResult = oResult.ToList();
            var lQuery = nResponseId != null ? lResult.Where(x => x.QuizResID == (int)nResponseId) : lResult;
            return Json(DataTablesService.GetDataTablesResponse(datatable, lQuery.AsQueryable()));
        }
        //[HttpPost]
        //public JsonResult QuestionResponsTable([ModelBinder(typeof(DataTablesBinder))] IDataTablesRequest datatable)
        //{
        //    int intResponseId = (int)TempData["ResponseId"];
        //    using (var oDb = new ApprenticeDB())
        //    {
        //        var oQuery = (from QuesRes in oDb.question_responses
        //                      join QuizQues in oDb.quiz_questions on QuesRes.questionid equals QuizQues.id
        //                      join QuesAnswer in oDb.question_answer on QuesRes.questionid equals QuesAnswer.questionid
        //                      join QuesOpt in oDb.question_options on QuesRes.optionid equals QuesOpt.id
        //                      where (QuesRes.responseid == intResponseId)
        //                      select new QuestionReportVM
        //                      {
        //                          QuestionText = QuizQues.title,
        //                          QuizReqText = QuesOpt.questionoption,
        //                          QuizResText = QuesOpt.questionoption,
        //                          isCorrect = QuesAnswer.optionid == QuesRes.optionid ? "True" : "False",
        //                          UpdatedOn= (DateTime)QuesRes.lastupdated
        //                      }) ;

        //        //return View(oLastItemsInGroup.ToList());
        //        return Json(DataTablesService.GetDataTablesResponse(datatable, oQuery.AsQueryable()));
        //    }

        //}
    }
}