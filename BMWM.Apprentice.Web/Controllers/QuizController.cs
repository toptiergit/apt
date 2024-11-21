using ApplicationForm.DBContext;
using ApplicationForm.Models;
using BMWM.Apprentice.Web.AuthWebService;
using DataTables.Mvc;
using Microsoft.AspNetCore.Http;

using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Threading;
using System.Web;
using System.Web.Mvc;
using JsonResult = System.Web.Mvc.JsonResult;

namespace ApplicationForm.Controllers
{
    [AuthorizeUser]
    public class QuizController : Controller
    {
        public ApprenticeDB dbContext = new ApprenticeDB();
        // GET: Quiz
        public QuizController()
        {
            _ = Thread.CurrentThread.CurrentUICulture;
        }
        public ActionResult Index()
        {
            return View();
        }
        public ActionResult Upload()
        {
            var oQuizTypes = new SelectList(dbContext.QuizTypes.Select(e => new { value = e.Id, text = e.Name }), "value", "text");
            ViewData["QuizType"] = oQuizTypes;
            ViewData["UploadSuccess"] = false;
            return View();
        }

        [HttpPost]
        public ActionResult Upload(HttpPostedFileBase oFile)
        {
            ViewData["UploadSuccess"] = false;
            if (oFile != null && oFile.ContentLength > 0)
            {
                var sQuizTypeId = Request.Form["QuizType"].ToString();
                var sName = Request.Form["sName"].ToString();
                var dDateFrom = Request.Form["dDateFrom"].ToString();
                var dDateTo = Request.Form["dDateTo"].ToString();

                ViewData["QuizType"] = new SelectList(dbContext.QuizTypes.Select(e => new { value = e.Id, text = e.Name }), "value", "text", sQuizTypeId);
                try
                {
                    var fileName = sName + Path.GetExtension(oFile.FileName);
                    var path = Path.Combine(Server.MapPath("~/Files"), fileName);
                    if (System.IO.File.Exists(path))
                        System.IO.File.Delete(path);

                    oFile.SaveAs(path);
                    //Read from excel
                    var imp = new Toptier.ImportingService.Services.ConfigurationService(Server.MapPath("~/IMPTDB.xml"));
                    var obj = imp.GetConfiguration("quizXLS"); //ID ของการ Config ในไฟล์ IMPTDB.xml
                    obj.SourceDirectory = "~/Files";
                    obj.SourceFile = fileName;
                    var dt = Toptier.ImportingService.Services.ImportingService.ReadExcelFile(obj);
                    if (dt != null)
                    {
                        if (dt.Rows.Count > 0)
                        {
                            using (var oDb = new ApprenticeDB())
                            {
                                var nQuizdetailsId = (oDb.Quizdetails.Count() > 0 ? oDb.Quizdetails.Max(e => e.Id) : 0) + 1;
                                var oQuizdetails = new Quizdetail();
                                oQuizdetails.Id = nQuizdetailsId;
                                oQuizdetails.Name = sName;
                                oQuizdetails.QuizTypeId = int.Parse(sQuizTypeId);
                                oQuizdetails.Startdate = DateTime.Parse(dDateFrom);
                                oQuizdetails.Enddate = DateTime.Parse(dDateTo);
                                oQuizdetails.Lastupdated = DateTime.Now;
                                oQuizdetails.IsActive = true;
                                oDb.Quizdetails.Add(oQuizdetails);
                                oDb.SaveChanges();

                                foreach (DataRow row in dt.Rows)
                                {
                                    int quizNo = Int32.Parse(row[0].ToString().Trim());
                                    string question = row[1].ToString().Trim();
                                    string answer1 = row[2].ToString().Trim();
                                    string answer2 = row[3].ToString().Trim();
                                    string answer3 = row[4].ToString().Trim();
                                    string answer4 = row[5].ToString().Trim();
                                    int correct_answer = Int32.Parse(row[6].ToString().Trim());
                                    var nId = (oDb.Quiz_questions.Count() > 0 ? oDb.Quiz_questions.Max(e => e.Id) : 0) + 1;
                                    var quiz_questions = new Quiz_questions();
                                    quiz_questions.Id = nId;
                                    quiz_questions.Quizid = oQuizdetails.Id;
                                    quiz_questions.Quizdetail = oQuizdetails;
                                    quiz_questions.Questionorder = quizNo;
                                    quiz_questions.Type = "single";
                                    quiz_questions.Title = question;
                                    quiz_questions.Lastupdated = DateTime.Now;
                                    oDb.Quiz_questions.Add(quiz_questions);
                                    //db.SaveChanges();

                                    var question_options = new Models.Question_options();
                                    var question_answer = new Models.Question_answer();
                                    //answer1
                                    //question_options.questionid = quiz_questions.id;
                                    question_options.Quiz_questions = quiz_questions;
                                    question_options.Questionoption = answer1;
                                    question_options.Lastupdated = DateTime.Now;
                                    oDb.Question_options.Add(question_options);
                                    //db.SaveChanges();
                                    if (correct_answer == 1)
                                    {
                                        //question_answer.questionid = quiz_questions.id;
                                        question_answer.Quiz_questions = quiz_questions;
                                        question_answer.Question_options = question_options;
                                        question_answer.Lastupdated = DateTime.Now;
                                        oDb.Question_answer.Add(question_answer);
                                        //db.SaveChanges();
                                    }

                                    //answer2
                                    question_options = new Models.Question_options();
                                    //question_options.questionid = quiz_questions.id;
                                    question_options.Quiz_questions = quiz_questions;
                                    question_options.Questionoption = answer2;
                                    question_options.Lastupdated = DateTime.Now;
                                    oDb.Question_options.Add(question_options);
                                    //db.SaveChanges();
                                    if (correct_answer == 2)
                                    {
                                        //question_answer.questionid = quiz_questions.id;
                                        question_answer.Quiz_questions = quiz_questions;
                                        question_answer.Question_options = question_options;
                                        question_answer.Lastupdated = DateTime.Now;
                                        oDb.Question_answer.Add(question_answer);
                                        //db.SaveChanges();
                                    }

                                    //answer3
                                    question_options = new Models.Question_options();
                                    //question_options.questionid = quiz_questions.id;
                                    question_options.Quiz_questions = quiz_questions;
                                    question_options.Questionoption = answer3;
                                    question_options.Lastupdated = DateTime.Now;
                                    oDb.Question_options.Add(question_options);
                                    //db.SaveChanges();
                                    if (correct_answer == 3)
                                    {
                                        //question_answer.questionid = quiz_questions.id;
                                        question_answer.Quiz_questions = quiz_questions;
                                        question_answer.Question_options = question_options;
                                        question_answer.Lastupdated = DateTime.Now;
                                        oDb.Question_answer.Add(question_answer);
                                        //db.SaveChanges();
                                    }
                                    //answer4
                                    question_options = new Models.Question_options();
                                    //question_options.questionid = quiz_questions.id;
                                    question_options.Quiz_questions = quiz_questions;
                                    question_options.Questionoption = answer4;
                                    question_options.Lastupdated = DateTime.Now;
                                    oDb.Question_options.Add(question_options);
                                    //db.SaveChanges();
                                    if (correct_answer == 4)
                                    {
                                        //question_answer.questionid = quiz_questions.id;
                                        question_answer.Quiz_questions = quiz_questions;
                                        question_answer.Question_options = question_options;
                                        question_answer.Lastupdated = DateTime.Now;
                                        oDb.Question_answer.Add(question_answer);
                                        //db.SaveChanges();
                                    }
                                    oDb.SaveChanges();
                                }
                                //oDb.SaveChanges();
                            }
                        }
                    }

                    ViewBag.fileName = fileName;
                }
                catch (Exception ex)
                {
                    ViewBag.ErrorMsg = ex.Message;
                    ViewBag.ErrorDetail = ex.StackTrace;
                    return View();
                }
            }
            ViewData["UploadSuccess"] = true;
            return View();
        }

        public ActionResult QuizTest(int QuizId)
        {
            Session["QuizId"] = QuizId;
            ViewBag.NoQuiz = false;
            var sItemCode = UserAuthentication.User.UserItems.ToList().FirstOrDefault().ItemCode;
            if (QuizId == 0)
            {
                ViewBag.NoQuiz = true;
                return View();
            }
            var checkTested = dbContext.Quiz_responses.Any(q => q.Quizid == QuizId
                && q.UserId == UserAuthentication.UserId);
            if (checkTested)
            {
                ViewBag.CheckTested = true;
                return View();
            }
            else
            {
                ViewBag.CheckTested = false;
                var questions = dbContext.Quiz_questions.Where(q => q.Quizid == QuizId)
                 .Select(q => new QuestionVM
                 {
                     QuestionID = q.Id,
                     QuestionText = q.Title,
                     QuestionType = q.Quizdetail.QuizType.Name,
                     Image = q.Image,
                     Choices = q.Question_options.Select(c => new ChoiceVM
                     {
                         ChoiceID = c.Id,
                         ChoiceText = c.Questionoption,
                         Image = c.Image
                     }).OrderBy(x => sItemCode == "USER" ? Guid.NewGuid() : Guid.Empty).Take(6).ToList()//If User mark Random
                 }).AsQueryable();
                ViewData["QuizType"] = questions.FirstOrDefault().QuestionType;
                return View(questions);
            }
        }

        [HttpPost]
        public ActionResult QuizTest(List<QuizAnswersVM> resultQuiz)
        {
            foreach (var oRow in resultQuiz.Where(e => e.AnswerId == 0))
            {
                return Json(new { result = "" }, JsonRequestBehavior.AllowGet);
            }

            List<QuizAnswersVM> finalResultQuiz = new List<Models.QuizAnswersVM>();
            //int correct = 0;
            //int incorrect = 0;
            foreach (QuizAnswersVM answser in resultQuiz)
            {
                QuizAnswersVM result = dbContext.Question_answer.Where(a => a.Questionid == answser.QuestionID).Select(a => new QuizAnswersVM
                {
                    QuestionID = a.Questionid,
                    AnswerId = a.Optionid,
                    isCorrect = (answser.AnswerId.Equals(a.Optionid))
                }).FirstOrDefault();
                finalResultQuiz.Add(result);
            }
            using (var oDb = new ApprenticeDB())
            {
                var nId = (oDb.Quiz_responses.Count() > 0 ? oDb.Quiz_responses.Max(e => e.Id) : 0) + 1;
                var quiz_responses = new Quiz_responses();
                quiz_responses.Id = nId;
                quiz_responses.Quizid = oDb.Quiz_questions.Find(resultQuiz.FirstOrDefault().QuestionID).Quizid;
                //quiz_responses.Email = UserAuthentication.User.Email;
                quiz_responses.UserId = UserAuthentication.UserId;
                quiz_responses.Correctanswers = finalResultQuiz.Where(q => q.isCorrect == true).Count();
                quiz_responses.Wronganswers = finalResultQuiz.Where(q => q.isCorrect == false).Count();
                quiz_responses.Lastupdated = DateTime.Now;
                dbContext.Quiz_responses.Add(quiz_responses);
                dbContext.SaveChanges();
                foreach (var response in resultQuiz)
                {
                    var question_responses = new Question_responses();
                    question_responses.Responseid = quiz_responses.Id;
                    question_responses.Questionid = response.QuestionID;
                    question_responses.Optionid = response.AnswerId;
                    question_responses.Reason = response.AnswerText;
                    question_responses.Lastupdated = DateTime.Now;
                    dbContext.Question_responses.Add(question_responses);
                    dbContext.SaveChanges();
                }
            }
            return Json(new { result = finalResultQuiz }, JsonRequestBehavior.AllowGet);
        }

        public ActionResult QuizList(string QuizType)
        {
            ViewBag.QuizType = QuizType;
            return View();
        }
        public JsonResult GEToQuizResDta([ModelBinder(typeof(DataTablesBinder))] IDataTablesRequest datatable, string QuizType)
        {
            using (var oDb = new ApprenticeDB())
            {
                var nQuizTypes = oDb.QuizTypes.Where(e => e.Name == QuizType).FirstOrDefault().Id;
                var sItemCode = UserAuthentication.User.UserItems.ToList().FirstOrDefault().ItemCode;
                var oQuery = new List<Quizdetail>();
                var dDateTime = DateTime.Parse(DateTime.Now.ToString("yyyy-MM-dd", new CultureInfo("en-US")));
                switch (sItemCode)
                {
                    case "ADMIN":
                        oQuery = oDb.Quizdetails.Where(e => e.QuizTypeId == nQuizTypes).ToList();
                        ; break;
                    case "USER":

                        oQuery = oDb.Quizdetails.Where(e => e.QuizTypeId == nQuizTypes && e.IsActive && (e.Startdate <= dDateTime && e.Enddate >= dDateTime)).ToList();
                        ; break;
                }

                var oData = oQuery.Select(s => new
                {
                    Id = s.Id,
                    Name = s.Name,
                    Description = s.Description == null ? "" : s.Description,
                    Startdate = s.Startdate == null ? DateTime.Now : s.Startdate,
                    Enddate = s.Enddate == null ? DateTime.Now : s.Enddate,
                    IsActive = s.IsActive,
                    QuizType = s.QuizType.Name,
                    UserRole = sItemCode
                }).ToList();
                return Json(DataTablesService.GetDataTablesResponse(datatable, oData.AsQueryable()));
            }
        }
        [HttpPost]
        public JsonResult EditData(Quizdetail quizdetail)
        {
            using (var oDb = new ApprenticeDB())
            {
                var oQuizdetails = oDb.Quizdetails.Find(quizdetail.Id);
                oQuizdetails.Name = quizdetail.Name;
                oQuizdetails.Description = quizdetail.Description;
                oQuizdetails.Startdate = quizdetail.Startdate == null ? DateTime.Now : quizdetail.Startdate;
                oQuizdetails.Enddate = quizdetail.Enddate == null ? DateTime.Now : quizdetail.Enddate;
                oQuizdetails.QuizType = quizdetail.QuizType;
                oQuizdetails.IsActive = quizdetail.IsActive;
                oDb.SaveChanges();
                return Json(new { Id = quizdetail.Id });
            }

        }
        [HttpPost]
        public JsonResult EditQuizData(string QuestionID)
        {
            List<QuestionVM> oQuestionVM = new List<QuestionVM>();
            using (var oDb = new ApprenticeDB())
            {
                var nQuestionID = int.Parse(QuestionID);
                oQuestionVM = oDb.Quiz_questions.Where(q => q.Id == nQuestionID)
                    .Select(q => new QuestionVM
                    {
                        QuestionID = q.Id,
                        QuestionText = q.Title,
                        QuestionType = q.Quizdetail.QuizType.Name,
                        Image = q.Image,
                        AnswerId = q.Question_answer.Select(c => new
                        {
                            AnswerId = c.Optionid
                        }).ToList().FirstOrDefault().AnswerId,
                        Choices = q.Question_options.Select(c => new ChoiceVM
                        {
                            ChoiceID = c.Id,
                            ChoiceText = c.Questionoption,
                            Image = c.Image
                        }).OrderBy(x => Guid.Empty).Take(6).ToList()
                    }).ToList();
            }
            return Json(oQuestionVM);
        }
        public JsonResult DeleteQuizData(string QuestionID)
        {
            try
            {
                using (var oDb = new ApprenticeDB())
                {
                    var nQuestionID = int.Parse(QuestionID);
                    var oQuestion = oDb.Quiz_questions.Where(q => q.Id == nQuestionID).FirstOrDefault();
                    if (oQuestion != null)
                    {
                        oDb.Quiz_questions.Remove(oQuestion);
                    }
                    oDb.SaveChanges();
                }
                return Json(QuestionID);
            }
            catch
            {
                return Json("Error");
            }
        }
        [HttpPost]
        public JsonResult SaveChanges()
        {
            var oFiles = Request.Files;
            var sQuestionType = Request.Form["QuestionType"].ToString();
            var sPathFileByDb = "../Images/" + sQuestionType + "/";
            SaveAsFileToDrive(oFiles, sPathFileByDb);
            var sQuestionFile = Request.Form["QuestionFile"].ToString();
            sQuestionFile = sQuestionFile.Split('/').Last();
            sQuestionFile = sQuestionFile != "" && sQuestionFile != null ? sPathFileByDb + sQuestionFile : "";
            var nQuestionID = int.Parse(Request.Form["QuestionID"].ToString());
            var sQuestionText = Request.Form["QuestionText"].ToString();
            var nAnswerId = int.Parse(Request.Form["AnswerId"].ToString());
            var sChoices = Request.Form["Choices"].ToString();
            var oChoices = JsonConvert.DeserializeObject<QuestionVM>(sChoices);
            var dDateTime = DateTime.Now;//.Parse(DateTime.Now.ToString(new CultureInfo("en-US")));

            using (var oDb = new ApprenticeDB())
            {
                var oQuizdeQuestions = oDb.Quiz_questions.Find(nQuestionID);
                oQuizdeQuestions.Title = sQuestionText;
                oQuizdeQuestions.Image = sQuestionFile;
                oQuizdeQuestions.Lastupdated = dDateTime;
                var oQuizdeAnswer = oDb.Question_answer.Where(e => e.Questionid == nQuestionID).FirstOrDefault();
                oQuizdeAnswer.Optionid = nAnswerId;
                oQuizdeAnswer.Lastupdated = dDateTime;
                foreach (var Choices in oChoices.Choices)
                {
                    var sImage = Choices.Image.Split('/').Last();
                    var oQuizdeOptions = oDb.Question_options.Find(Choices.ChoiceID);
                    oQuizdeOptions.Questionoption = Choices.ChoiceText;
                    oQuizdeOptions.Image = sImage != "" && sImage != null ? sPathFileByDb + sImage : "";
                    oQuizdeOptions.Lastupdated = dDateTime;
                }
                oDb.SaveChanges();
                return Json("");
            }
        }
        public void SaveAsFileToDrive(HttpFileCollectionBase oFiles, string sPathFileByDb)
        {
            for (int i = 0; i < oFiles.Count; i++)
            {
                var oFile = oFiles[i];
                var sFname = "";
                // Checking for Internet Explorer  
                if (Request.Browser.Browser.ToUpper() == "IE" || Request.Browser.Browser.ToUpper() == "INTERNETEXPLORER")
                {
                    string[] testfiles = oFile.FileName.Split(new char[] { '\\' });
                    sFname = testfiles[testfiles.Length - 1];
                }
                else
                    sFname = oFile.FileName;
                var sDateTime = DateTime.Now.ToString("yyyyMMddHHmm", new CultureInfo("en-US"));
                //sFname = sDateTime + (sFname.Length>=10? sFname.Substring(0,10): sFname);
                sFname = sDateTime + "-" + sFname;
                var sPath = Path.Combine(Server.MapPath(sPathFileByDb));
                if (!Directory.Exists(sPath))
                    Directory.CreateDirectory(sPath);
                var sFile = sPath + sFname;
                if (System.IO.File.Exists(sFile))
                    System.IO.File.Delete(sFile);
                oFile.SaveAs(sFile);
            }
        }
        //public JsonResult SaveChanges(QuestionVM resultQuiz)
        //{
        //    using (var oDb = new ApprenticeDB())
        //    {
        //        var oQuizdeQuestions = oDb.quiz_questions.Find(resultQuiz.QuestionID);
        //        oQuizdeQuestions.title = resultQuiz.QuestionText;
        //        var oQuizdeAnswer = oDb.question_answer.Find(resultQuiz.QuestionID);
        //        oQuizdeAnswer.optionid = resultQuiz.AnswerId;
        //        foreach (var oChoices in resultQuiz.Choices)
        //        {
        //            var oQuizdeOptions = oDb.question_options.Find(oChoices.ChoiceID);
        //            oQuizdeOptions.questionoption = oChoices.ChoiceText;
        //        }
        //        oDb.SaveChanges();
        //        return Json(resultQuiz);
        //    }
        //}
        [HttpPost]
        public JsonResult CreateData()
        {
            var oFiles = Request.Files;
            var sQuestionType = Request.Form["QuestionType"].ToString();
            var sPathFileByDb = "../Images/" + sQuestionType + "/";
            SaveAsFileToDrive(oFiles, sPathFileByDb);
            var sQuestionFile = Request.Form["QuestionFile"].ToString();
            sQuestionFile = sQuestionFile.Split('/').Last();
            sQuestionFile = sQuestionFile != "" && sQuestionFile != null ? sPathFileByDb + sQuestionFile : "";
            var sQuestionText = Request.Form["QuestionText"].ToString();

            var nAnswerId = int.Parse(Request.Form["AnswerId"].ToString());
            var sChoices = Request.Form["Choices"].ToString();
            var oChoices = JsonConvert.DeserializeObject<QuestionVM>(sChoices);
            var dDateTime = DateTime.Parse(DateTime.Now.ToString(new CultureInfo("en-US")));
            var nQuizId = int.Parse(Session["QuizId"].ToString());
            using (var oDb = new ApprenticeDB())
            {
                var nQuizTypeId = oDb.QuizTypes.Where(e => e.Name == sQuestionType).FirstOrDefault().Id;
                var nQuestionorder = oDb.Quiz_questions.Where(e => e.Quizid == nQuizId)
                    .OrderByDescending(q => q.Questionorder)
                    .Select(q => new { questionorder = q.Questionorder }).FirstOrDefault().questionorder;

                var oQuestions = new Quiz_questions()
                {
                    Quizid = nQuizId,
                    Questionorder = ++nQuestionorder,
                    Type = "single",
                    Title = sQuestionText,
                    Image = sQuestionFile,
                    Lastupdated = dDateTime
                };
                oDb.Quiz_questions.Add(oQuestions);
                var nIndex = 1;
                foreach (var oChoice in oChoices.Choices)
                {
                    var sImage = oChoice.Image.Split('/').Last();
                    var oOptions = new Question_options();
                    oOptions.Quiz_questions = oQuestions;
                    oOptions.Questionoption = oChoice.ChoiceText;
                    oOptions.Image = sImage != "" && sImage != null ? sPathFileByDb + sImage : ""; ;
                    oOptions.Lastupdated = dDateTime;
                    oDb.Question_options.Add(oOptions);
                    if (nIndex == nAnswerId)
                    {
                        var oAnswer = new Question_answer();
                        oAnswer.Quiz_questions = oQuestions;
                        oAnswer.Question_options = oOptions;
                        oAnswer.Lastupdated = dDateTime;
                        oDb.Question_answer.Add(oAnswer);
                    }
                    nIndex++;
                }
                oDb.SaveChanges();
                return Json("");
            }
        }

    }
}