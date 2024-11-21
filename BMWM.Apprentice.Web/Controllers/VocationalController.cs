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
using System.Web.Mvc;
using JsonResult = System.Web.Mvc.JsonResult;

namespace ApplicationForm.Controllers
{
    [AuthorizeUser]
    public class VocationalController : Controller
    {
        private readonly string AuthUserRole = ConfigurationManager.AppSettings["auth-user"].ToString();
        private readonly string AuthAdminRole = ConfigurationManager.AppSettings["auth-admin"].ToString();
        // GET: Vocational
        public VocationalController()
        {
            _ = Thread.CurrentThread.CurrentUICulture;
        }
        public ActionResult Index()
        {
            List<SelectListItem> oList = new List<SelectListItem>();
            oList.Add(new SelectListItem { Text = "Quarter1", Value = "1" });
            oList.Add(new SelectListItem { Text = "Quarter2", Value = "2" });
            oList.Add(new SelectListItem { Text = "Quarter3", Value = "3" });
            oList.Add(new SelectListItem { Text = "Quarter4", Value = "4" });
            ViewData["Quarter"] = oList;
            ViewData["UserGroup"] = new cGETGroupUser().GroupUser;
            return View();
        }
        public JsonResult GEToUserList([ModelBinder(typeof(DataTablesBinder))] IDataTablesRequest datatable, string UserGroup)
        {
            var oDatatable = datatable;
            using (var oDb = new ApprenticeDB())
            {
                var oQuery = (from User in oDb.auth_User
                              join UserItem in oDb.auth_UserItem on User.Id equals UserItem.UserId
                              where UserItem.ItemCode == AuthUserRole && User.IsActive
                              select new
                              {
                                  Id = User.Id,
                                  Displayname = User.DisplayName,
                                  Department = User.CFStr3,
                                  Status = "",
                                  UserGroup = User.CFInt1,
                                  Quarter1 = oDb.Vocationals.Where(e=>e.Quarter=="1"&&e.UserId== User.Id).Count(),
                                  Quarter2 = oDb.Vocationals.Where(e => e.Quarter == "2" && e.UserId == User.Id).Count(),
                                  Quarter3 = oDb.Vocationals.Where(e => e.Quarter == "3" && e.UserId == User.Id).Count(),
                                  Quarter4 = oDb.Vocationals.Where(e => e.Quarter == "4" && e.UserId == User.Id).Count()
                              }).ToList();

                if (!string.IsNullOrEmpty(UserGroup))
                {
                    oQuery = oQuery.Where(e => e.UserGroup == int.Parse(UserGroup)).ToList();
                }
                return Json(DataTablesService.GetDataTablesResponse(oDatatable, oQuery.AsQueryable().Distinct()));
            }
        }
        public ActionResult VocationalForm(string Id, string Quarter)
        {
            using (var oDb = new ApprenticeDB())
            {
                var sId = Id;
                var sQuarter = Quarter;
                var oResult = oDb.Vocationals.Where(e => e.UserId == sId && e.Quarter == sQuarter && e.CreateOn.Year == DateTime.Now.Year);
                var dDate = DateTime.Parse(DateTime.Now.ToString("yyyy-MM-dd", new CultureInfo("en-US")));
                var sDate = DateTime.Now.ToString("yyyy-MM-dd", new CultureInfo("en-US"));
                if (oResult.Count() > 0)
                {
                    Session["VocationalActionType"] = "Update";
                    var oVocationals = oResult.FirstOrDefault();
                    oVocationals.FullName = oDb.auth_User.Where(e => e.Id == oVocationals.UserId).FirstOrDefault().DisplayName;
                    return View(oVocationals);
                }
                else
                {
                    Session["VocationalActionType"] = "Insert";
                    var oQuery = (from User in oDb.auth_User
                                  join UserItem in oDb.auth_UserItem on User.Id equals UserItem.UserId
                                  where UserItem.UserId == sId && User.IsActive
                                  select new
                                  {
                                      UserId = User.Id,
                                      UserName = User.DisplayName,
                                      PositionTitle = "Apprentice-wave"+ User.CFInt1,
                                      CostCenter = "",
                                      HireDate=User.CFDtm1,
                                      ReviewPeriod = "Q"+sQuarter+"/"+ sDate
                                  }).FirstOrDefault();
                  
                    var oVocational = new Vocational
                    {
                        UserId = oQuery.UserId,
                        FullName = oQuery.UserName,
                        HireDate = dDate,
                        PositionTitle = oQuery.PositionTitle,
                        CostCenter = oQuery.CostCenter,
                        ReviewPeriod = oQuery.ReviewPeriod,
                        Quarter = sQuarter
                    };
                    return View(oVocational);
                }
            }
        }
        [HttpPost]
        public ActionResult VocationalForm(Vocational poVocationals)
        {
            if (ModelState.IsValid)
            {
                var oVocationals = poVocationals;
                var sUserId = oVocationals.UserId;
                var sQuarter = oVocationals.Quarter;
                using (var oDb = new ApprenticeDB())
                {
                    var oVocational = new Vocational
                    {
                        UserId = oVocationals.UserId,
                        FullName = oVocationals.FullName,
                        HireDate = oVocationals.HireDate,
                        PositionTitle = oVocationals.PositionTitle,
                        CostCenter = oVocationals.CostCenter,
                        ReviewPeriod = oVocationals.ReviewPeriod,
                        SafetyRank = oVocationals.SafetyRank,
                        SafetyRecord = oVocationals.SafetyRecord,
                        QualityRank = oVocationals.QualityRank,
                        QualityRecord = oVocationals.QualityRecord,
                        ProJKnRank = oVocationals.ProJKnRank,
                        ProJKnRecord = oVocationals.ProJKnRecord,
                        TeamWorkRank = oVocationals.TeamWorkRank,
                        TeamWorkRecord = oVocationals.TeamWorkRecord,
                        PunctuallityRank = oVocationals.PunctuallityRank,
                        PunctuallityRecord = oVocationals.PunctuallityRecord,
                        AreasforImp = oVocationals.AreasforImp,
                        OverallRatingPointSystem = oVocationals.OverallRatingPointSystem,
                        OverallTotalpoint = oVocationals.OverallTotalpoint,
                        StudentComments = oVocationals.StudentComments,
                        Quarter = oVocationals.Quarter
                    };
                    switch (Session["VocationalActionType"].ToString())
                    {
                        case "Update":
                            var oUpdate = oDb.Vocationals.Where(e => e.UserId == sUserId && e.Quarter == sQuarter && e.CreateOn.Year == DateTime.Now.Year).FirstOrDefault();
                            if (oUpdate != null)
                            {
                                //oUpdate = oEvaluations;
                                oUpdate.FullName = oVocational.FullName;
                                oUpdate.UserId = oVocational.UserId;
                                oUpdate.HireDate = oVocational.HireDate;
                                oUpdate.PositionTitle = oVocational.PositionTitle;
                                oUpdate.CostCenter = oVocational.CostCenter;
                                oUpdate.ReviewPeriod = oVocational.ReviewPeriod;
                                oUpdate.SafetyRank = oVocational.SafetyRank;
                                oUpdate.SafetyRecord = oVocational.SafetyRecord;
                                oUpdate.QualityRank = oVocational.QualityRank;
                                oUpdate.QualityRecord = oVocational.QualityRecord;
                                oUpdate.PositionTitle = oVocational.PositionTitle;
                                oUpdate.ProJKnRank = oVocational.ProJKnRank;
                                oUpdate.ProJKnRecord = oVocational.ProJKnRecord;
                                oUpdate.TeamWorkRank = oVocational.TeamWorkRank;
                                oUpdate.TeamWorkRecord = oVocational.TeamWorkRecord;
                                oUpdate.PunctuallityRank = oVocational.PunctuallityRank;
                                oUpdate.PunctuallityRecord = oVocational.PunctuallityRecord;
                                oUpdate.AreasforImp = oVocational.AreasforImp;
                                oUpdate.OverallRatingPointSystem = oVocational.OverallRatingPointSystem;
                                oUpdate.OverallTotalpoint = oVocational.OverallTotalpoint;
                                oUpdate.StudentComments = oVocational.StudentComments;
                                oUpdate.Quarter = oVocational.Quarter;
                                oUpdate.UpdateBy = UserAuthentication.UserId;
                                oUpdate.UpdateOn = DateTime.Now;
                            }
                            break;
                        case "Insert":
                            //var nVocationalsId = (oDb.Vocationals.Count() > 0 ? oDb.Vocationals.Max(e => e.Id) : 0) + 1;
                            //oVocational.Id = nVocationalsId;
                            oVocational.CreateBy = UserAuthentication.UserId;
                            oVocational.UpdateBy = UserAuthentication.UserId;
                            oVocational.CreateOn = DateTime.Now;
                            oVocational.UpdateOn = DateTime.Now;
                            oDb.Vocationals.Add(oVocational);
                            break;
                    }
                    oDb.SaveChanges();
                }
                return RedirectToAction("Index");
            }
            return View(poVocationals);
        }
        public JsonResult Report(string Id, string Quarter)
        {
            using (var oDb = new ApprenticeDB())
            {
                var sId = Id;
                var sQuarter = Quarter;
                var aVocational = new List<Vocational>();
                var oResult = oDb.Vocationals.Where(e => e.UserId == sId && e.Quarter == sQuarter && e.CreateOn.Year == DateTime.Now.Year);
                if (oResult.Count() > 0)
                {
                    var oVocational = oResult.FirstOrDefault();
                    oVocational.FullName = oDb.auth_User.Where(e => e.Id == oVocational.UserId).FirstOrDefault().DisplayName;
                    aVocational.Add(oVocational);
                    var oRpt = new Toptier.Reporting.ReportViewerData();
                    oRpt.ReportName = "Vocational Report";
                    //set report model
                    oRpt.ReportPath = Path.Combine("bin/Reports/Templates", "Vocational.rdlc");
                    // set datasource
                    var oDtsources = new Dictionary<string, object>();
                    oDtsources.Add("DataSet", aVocational);
                    oRpt.DataSources = oDtsources;
                    Session[oRpt.Id] = oRpt;
                    //return Redirect("~/ReportViewer.aspx?rptsid=" + rpt.Id);
                    return Json(new { Id = oRpt.Id });
                }
                else
                    return Json("");
            }
        }
        public JsonResult SummaryReport(List<string> Id, string UserGroup)
        {
            using (var oDb = new ApprenticeDB())
            {
                var sId = Id;
                var sUserGroup = UserGroup;
                var aVocational = new List<Vocational>();
                var oResult = oDb.Vocationals.Where(e => sId.Contains(e.UserId) && e.CreateOn.Year == DateTime.Now.Year);
                foreach (var Vocationals in oResult)
                {
                    Vocationals.FullName = oDb.auth_User.Where(e => e.Id == Vocationals.UserId).FirstOrDefault().DisplayName;
                    aVocational.Add(Vocationals);
                }
                var rpt = new Toptier.Reporting.ReportViewerData();
                rpt.ReportName = "Summary Report";
                //set report model
                rpt.ReportPath = Path.Combine("bin/Reports/Templates", "SummaryReportVoc.rdlc");

                // set datasource
                var datasources = new Dictionary<string, object>();
                datasources.Add("DataSet", oResult.ToList());
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