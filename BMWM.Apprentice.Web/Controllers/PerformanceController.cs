using ApplicationForm.DBContext;
using ApplicationForm.Helpers;
using ApplicationForm.Models;
using BMWM.Apprentice.Web.AuthWebService;
using DataTables.Mvc;
using System;
using System.Collections.Generic;
using System.Configuration;
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
    public class PerformanceController : Controller
    {
        private readonly string AuthUserRole = ConfigurationManager.AppSettings["auth-user"].ToString();
        private readonly string AuthAdminRole = ConfigurationManager.AppSettings["auth-admin"].ToString();
        // GET: Performance
        public PerformanceController()
        {
            _ = Thread.CurrentThread.CurrentUICulture;
        }
        public ActionResult Index()
        {
            List<SelectListItem> oList = new List<SelectListItem>();
            oList.Add(new SelectListItem { Text = "1st Half", Value = "1" });
            oList.Add(new SelectListItem { Text = "2nd Half", Value = "2" });
            ViewData["Half"] = oList;
            ViewData["UserGroup"] = new cGETGroupUser().GroupUser;
            return View();
        }
        public JsonResult GEToUserList([ModelBinder(typeof(DataTablesBinder))] IDataTablesRequest datatable, string UserGroup)
        {
            var oDatatable = datatable;
            //var sItemCode = UserAuthentication.User.UserItems.ToList().FirstOrDefault().ItemCode;
            using (var oDb = new ApprenticeDB())
            {
                var oQuery = (from User in oDb.auth_User
                              join UserItem in oDb.auth_UserItem on User.Id equals UserItem.UserId
                              where UserItem.ItemCode == AuthUserRole && User.IsActive
                              select new
                              {
                                  Id = User.Id,
                                  FullName = User.DisplayName,
                                  Department = User.CFStr3,
                                  Status = "",
                                  UserGroup = User.CFInt1,
                                  Half1 = oDb.Evaluations.Where(e => e.Half == "1" && e.UserId == User.Id).Count(),
                                  Half2 = oDb.Evaluations.Where(e => e.Half == "2" && e.UserId == User.Id).Count()
                              }).ToList();
                //var oEvaluations = oDb.Evaluations.Where(e => e.Name == FNmae).AsQueryable();
                //var SearchValues = false;
                if (!String.IsNullOrEmpty(UserGroup))
                {
                    oQuery = oQuery.Where(e => e.UserGroup == int.Parse(UserGroup)).ToList();
                    //SearchValues = true;
                }
                //oQuery.se;

                return Json(DataTablesService.GetDataTablesResponse(oDatatable, oQuery.AsQueryable()));
            }
        }
        // GET: Performance/Details/5
        public ActionResult PerformanceForm(string id, string Half)
        {
            using (var oDb = new ApprenticeDB())
            {
                var sId = id;
                var sHalf = Half;
                var dDate = DateTime.Parse(DateTime.Now.ToString("yyyy-MM-dd", new CultureInfo("en-US")));
                var oResult = oDb.Evaluations.Where(e => e.UserId == sId && e.Half == sHalf && e.CreateOn.Year == DateTime.Now.Year) ;
                //var oResult = (from User in oDb.auth_User
                //               join Evalues in oDb.Evaluations on User.Id equals Evalues.UserId
                //               where Evalues.UserId == sId && Evalues.Half == sHalf && Evalues.CreateOn.Year == DateTime.Now.Year
                //               select new 
                //               {
                //                   UserId = Evalues.UserId,
                //                   FullName = User.DisplayName,
                //                   Department = User.CFStr3,
                //                   ProcessManager = User.CFStr4,
                //                   PPASubject = Evalues.PPASubject,
                //                   DiscActionLevel = Evalues.DiscActionLevel,
                //                   Startdate = Evalues.Startdate,
                //                   EvaluateFdate = Evalues.EvaluateFdate,
                //                   EvaluateTdate = Evalues.EvaluateTdate,
                //                   PPAIssuedate = Evalues.PPAIssuedate,
                //                   DiscActionIssuedate = Evalues.DiscActionIssuedate,
                //                   PlanGetdate = Evalues.PlanGetdate,
                //                   ServicesInYear=Evalues.ServicesInYear,
                //                   QOJRank = Evalues.QOJRank,
                //                   Evalues.QOJRecord,
                //                   Evalues.QOJARank,
                //                   Evalues.QOJARecord,
                //                   Evalues.STWRank,
                //                   Evalues.STWRecord,
                //                   Evalues.WRRank,
                //                   Evalues.WRRecord,
                //                   Evalues.TWRank,
                //                   Evalues.TWRecord,
                //                   Evalues.PTRank,
                //                   Evalues.PTRecord,
                //                   Half = Evalues.Half
                //               });

                if (oResult.Count() > 0)
                {

                    Session["PerformanceActionType"] = "Update";
                    var oEvaluations = oResult.FirstOrDefault();
                    oEvaluations.FullName = oDb.auth_User.Where(e => e.Id == oEvaluations.UserId).FirstOrDefault().DisplayName;
                    oEvaluations.Department = oDb.auth_User.Where(e => e.Id == oEvaluations.UserId).FirstOrDefault().CFStr3;
                    oEvaluations.ProcessManager = oDb.auth_User.Where(e => e.Id == oEvaluations.UserId).FirstOrDefault().CFStr4;
                    return View(oEvaluations);
                }
                else
                {
                    Session["PerformanceActionType"] = "Insert";
                    var oQuery = (from User in oDb.auth_User
                                  join UserItem in oDb.auth_UserItem on User.Id equals UserItem.UserId
                                  where UserItem.UserId == sId && User.IsActive
                                  select new
                                  {
                                      UserId = User.Id,
                                      UserName = User.DisplayName,
                                      Department = User.CFStr3,
                                      PM = User.CFStr4,
                                      PPASubject = "Performance evaluation for Half" + sHalf,
                                      DiscActionLevel = "Notices of Consultation (NOC) \r\n Verbal warning with written record \r\n First written warning \r\n Last written warning"
                                  }).FirstOrDefault();
                    var oPerformance = new Evaluation
                    {
                        UserId = oQuery.UserId,
                        FullName = oQuery.UserName,
                        Department = oQuery.Department,
                        ProcessManager = oQuery.PM,
                        PPASubject = oQuery.PPASubject,
                        DiscActionLevel = oQuery.DiscActionLevel,
                        Startdate = dDate,
                        EvaluateFdate = dDate,
                        EvaluateTdate = dDate,
                        PPAIssuedate = dDate,
                        DiscActionIssuedate = dDate,
                        PlanGetdate = dDate,
                        Half = sHalf
                    };
                    return View(oPerformance);
                }
            }
        }
        [HttpPost]
        public ActionResult PerformanceForm(Evaluation poEvaluation)
        {
            if (ModelState.IsValid)
            {
                var oEvaluation = poEvaluation;
                var sUserId = oEvaluation.UserId;
                var sHalf = oEvaluation.Half;
                using (var oDb = new ApprenticeDB())
                {
                    var oPerformance = new Evaluation
                    {
                        FullName = oEvaluation.FullName,
                        UserId = oEvaluation.UserId,
                        Department = oEvaluation.Department,
                        Startdate = oEvaluation.Startdate,
                        EvaluateFdate = oEvaluation.EvaluateFdate,
                        EvaluateTdate = oEvaluation.EvaluateTdate,
                        ServicesInYear = oEvaluation.ServicesInYear,
                        ProcessManager = oEvaluation.ProcessManager,
                        PPASubject = oEvaluation.PPASubject,
                        PPAIssuedate = oEvaluation.PPAIssuedate,
                        DiscActionLevel = oEvaluation.DiscActionLevel,
                        DiscActionIssuedate = oEvaluation.DiscActionIssuedate,
                        QOJRank = oEvaluation.QOJRank,
                        QOJRecord = oEvaluation.QOJRecord,
                        QOJARank = oEvaluation.QOJARank,
                        QOJARecord = oEvaluation.QOJARecord,
                        STWRank = oEvaluation.STWRank,
                        STWRecord = oEvaluation.STWRecord,
                        WRRank = oEvaluation.WRRank,
                        WRRecord = oEvaluation.WRRecord,
                        TWRank = oEvaluation.TWRank,
                        TWRecord = oEvaluation.TWRecord,
                        PTRank = oEvaluation.PTRank,
                        PTRecord = oEvaluation.PTRecord,
                        ATTActwork = oEvaluation.ATTActwork,
                        ATTLeave = oEvaluation.ATTLeave,
                        ATTActworkLeft = oEvaluation.ATTActworkLeft,
                        ATTRate = oEvaluation.ATTRate,
                        ATTRank = oEvaluation.ATTRank,
                        ATTTotal = oEvaluation.ATTTotal,
                        OverallEvaluation = oEvaluation.OverallEvaluation,
                        Half = oEvaluation.Half,
                        TopicStr = oEvaluation.TopicStr,
                        AreaImp = oEvaluation.AreaImp,
                        Course = oEvaluation.Course,
                        PlanGetdate = oEvaluation.PlanGetdate,
                        OriginalDeptConf = oEvaluation.OriginalDeptConf,
                        AssociateFeedback = oEvaluation.AssociateFeedback,
                        HumanResources = oEvaluation.HumanResources
                    };
                    switch (Session["PerformanceActionType"].ToString())
                    {
                        case "Update":
                            var oUpdate = oDb.Evaluations.Where(e => e.UserId == sUserId && e.Half == sHalf && e.CreateOn.Year == DateTime.Now.Year).FirstOrDefault();
                            if (oUpdate != null)
                            {
                                //oUpdate = oEvaluations;
                                oUpdate.FullName = oPerformance.FullName;
                                oUpdate.UserId = oPerformance.UserId;
                                oUpdate.Department = oPerformance.Department;
                                oUpdate.Startdate = oPerformance.Startdate;
                                oUpdate.EvaluateFdate = oPerformance.EvaluateFdate;
                                oUpdate.EvaluateTdate = oPerformance.EvaluateTdate;
                                oUpdate.ServicesInYear = oPerformance.ServicesInYear;
                                oUpdate.ProcessManager = oPerformance.ProcessManager;
                                oUpdate.PPASubject = oPerformance.PPASubject;
                                oUpdate.PPAIssuedate = oPerformance.PPAIssuedate;
                                oUpdate.DiscActionLevel = oPerformance.DiscActionLevel;
                                oUpdate.DiscActionIssuedate = oPerformance.DiscActionIssuedate;
                                oUpdate.QOJRank = oPerformance.QOJRank;
                                oUpdate.QOJRecord = oPerformance.QOJRecord;
                                oUpdate.QOJARank = oPerformance.QOJARank;
                                oUpdate.QOJARecord = oPerformance.QOJARecord;
                                oUpdate.STWRank = oPerformance.STWRank;
                                oUpdate.STWRecord = oPerformance.STWRecord;
                                oUpdate.WRRank = oPerformance.WRRank;
                                oUpdate.WRRecord = oPerformance.WRRecord;
                                oUpdate.TWRank = oPerformance.TWRank;
                                oUpdate.TWRecord = oPerformance.TWRecord;
                                oUpdate.PTRank = oPerformance.PTRank;
                                oUpdate.PTRecord = oPerformance.PTRecord;
                                oUpdate.ATTActwork = oPerformance.ATTActwork;
                                oUpdate.ATTLeave = oPerformance.ATTLeave;
                                oUpdate.ATTActworkLeft = oPerformance.ATTActworkLeft;
                                oUpdate.ATTRate = oPerformance.ATTRate;
                                oUpdate.ATTRank = oPerformance.ATTRank;
                                oUpdate.ATTTotal = oPerformance.ATTTotal;
                                oUpdate.OverallEvaluation = oPerformance.OverallEvaluation;
                                oUpdate.Half = oPerformance.Half;
                                oUpdate.TopicStr = oPerformance.TopicStr;
                                oUpdate.AreaImp = oPerformance.AreaImp;
                                oUpdate.Course = oPerformance.Course;
                                oUpdate.PlanGetdate = oPerformance.PlanGetdate;
                                oUpdate.OriginalDeptConf = oPerformance.OriginalDeptConf;
                                oUpdate.AssociateFeedback = oPerformance.AssociateFeedback;
                                oUpdate.HumanResources = oPerformance.HumanResources;
                                oUpdate.UpdateBy = UserAuthentication.UserId;
                                oUpdate.UpdateOn = DateTime.Now;
                            }
                            break;
                        case "Insert":
                            //var nEvaluationsId = (oDb.Evaluations.Count() > 0 ? oDb.Evaluations.Max(e => e.Id) : 0) + 1;
                            //oPerformance.Id = nEvaluationsId;
                            oPerformance.CreateBy = UserAuthentication.UserId;
                            oPerformance.UpdateBy = UserAuthentication.UserId;
                            oPerformance.CreateOn = DateTime.Now;
                            oPerformance.UpdateOn = DateTime.Now;
                            oDb.Evaluations.Add(oPerformance);
                            break;
                    }
                    oDb.SaveChanges();
                }
                return RedirectToAction("Index");
            }
            return View(poEvaluation);
        }
        public JsonResult Report(string Id, string Half)
        {
            using (var oDb = new ApprenticeDB())
            {
                var sId = Id;
                var sHalf = Half;
                var aPerformance = new List<Evaluation>();
                var oResult = oDb.Evaluations.Where(e => e.UserId == sId && e.Half == sHalf && e.CreateOn.Year == DateTime.Now.Year);
                if (oResult.Count() > 0)
                {
                    var oEvaluations = oResult.FirstOrDefault();
                    oEvaluations.FullName = oDb.auth_User.Where(e => e.Id == oEvaluations.UserId).FirstOrDefault().DisplayName;
                    oEvaluations.Department = oDb.auth_User.Where(e => e.Id == oEvaluations.UserId).FirstOrDefault().CFStr3;
                    oEvaluations.ProcessManager = oDb.auth_User.Where(e => e.Id == oEvaluations.UserId).FirstOrDefault().CFStr4;
                    aPerformance.Add(oEvaluations);
                    var oRpt = new Toptier.Reporting.ReportViewerData();
                    oRpt.ReportName = "Performance Report";
                    //set report model
                    oRpt.ReportPath = Path.Combine("bin/Reports/Templates", "Performance.rdlc");

                    // set datasource
                    var datasources = new Dictionary<string, object>();
                    datasources.Add("DataSet", aPerformance);
                    oRpt.DataSources = datasources;

                    //set parameter
                    //var parameters = new Dictionary<string, string>();
                    //parameters.Add("pmTrainerName", "XXX XXXX");
                    //parameters.Add("pmApprentic", "TV 4261");
                    //parameters.Add("pmModel", "All Model");
                    //parameters.Add("pmShift", "A");
                    //parameters.Add("pmYear", "2021");
                    //rpt.Parameters = parameters;
                    Session[oRpt.Id] = oRpt;
                    //return Redirect("~/ReportViewer.aspx?rptsid=" + rpt.Id);
                    return Json(new { Id = oRpt.Id });
                }
                else
                    return Json("");
            }
        }
        public JsonResult SummaryReport(List<string> Id)
        {
            using (var oDb = new ApprenticeDB())
            {
                var sId = Id;
                var aEvaluation = new List<Evaluation>();
                var oResult = oDb.Evaluations.Where(e => sId.Contains(e.UserId) && e.CreateOn.Year == DateTime.Now.Year);
                foreach (var oEvaluation in oResult)
                { 
                    oEvaluation.FullName = oDb.auth_User.Where(e => e.Id == oEvaluation.UserId).FirstOrDefault().DisplayName;
                    aEvaluation.Add(oEvaluation);
                }
                var rpt = new Toptier.Reporting.ReportViewerData();
                rpt.ReportName = "Summary Report";
                //set report model
                rpt.ReportPath = Path.Combine("bin/Reports/Templates", "SummaryReport.rdlc");

                // set datasource
                var datasources = new Dictionary<string, object>();
                datasources.Add("DataSet", aEvaluation);
                rpt.DataSources = datasources;

                //set parameter
                //var parameters = new Dictionary<string, string>();
                //parameters.Add("pmTrainerName", "XXX XXXX");
                //parameters.Add("pmApprentic", "TV 4261");
                //parameters.Add("pmModel", "All Model");
                //parameters.Add("pmShift", "A");
                //parameters.Add("pmYear", "2021");
                //rpt.Parameters = parameters;
                Session[rpt.Id] = rpt;
                //return Redirect("~/ReportViewer.aspx?rptsid=" + rpt.Id);
                return Json(new { Id = rpt.Id });
            }
        }
    }
}
