using ApplicationForm.DBContext;
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
    public class SkillMatrixController : Controller
    {
        private readonly string AuthUserRole = ConfigurationManager.AppSettings["auth-user"].ToString();
        private readonly string AuthAdminRole = ConfigurationManager.AppSettings["auth-admin"].ToString();
        // GET: OJT
        public SkillMatrixController()
        {
            _ = Thread.CurrentThread.CurrentUICulture;
        }
        public ActionResult Index()
        {
            return View();
        }
        public JsonResult GEToDataTable([ModelBinder(typeof(DataTablesBinder))] IDataTablesRequest datatable)
        {
            var sItemCode = UserAuthentication.User.UserItems.ToList().FirstOrDefault().ItemCode;
            using (var oDb = new ApprenticeDB())
            {
                var oQuery = (from User in oDb.auth_User
                              join UserItem in oDb.auth_UserItem on User.Id equals UserItem.UserId
                              where UserItem.ItemCode == AuthUserRole && User.IsActive
                              select new
                              {
                                  Id = User.Id,
                                  Displayname = User.DisplayName,
                                  Email = User.Email,
                                  Status = oDb.SkillMatrices.Any(f => f.UserId == User.Id)
                              }).ToList();

                return Json(DataTablesService.GetDataTablesResponse(datatable, oQuery.AsQueryable()));
            }
        }
        public ActionResult Manage(string id)
        {
            var sId = id;
            using (var oDb = new ApprenticeDB())
            {
                var oUser = (from User in oDb.auth_User
                             where User.Id == sId
                             select new
                             {
                                 UserId = User.Id,
                                 UserName = User.DisplayName,
                                 Email = User.Email
                             }).FirstOrDefault();
                var oStations = oDb.Stations;
                var oSkillMatrixView = new SkillMatrixView
                {
                    Station = oStations.OrderBy(e => e.Area).ToList(),
                    UserId = oUser.UserId,
                    UserName = oUser.UserName,
                    Email = oUser.Email
                };
                ViewBag.start = "<div class='col-sm-4'><div class='control-group'>";
                ViewBag.end = "</div></div>";
                return View(oSkillMatrixView);
            }
        }
        [HttpPost]
        public ActionResult Manage()
        {
            var sId = Request.Form["Id"];
            using (var oDb = new ApprenticeDB())
            {
                var oStations = oDb.Stations.OrderBy(e => e.Area);
                //var oSkillMatrices = oDb.SkillMatrices;
                var dDateTime = DateTime.Parse(DateTime.Now.ToString("yyyy-MM-dd", new CultureInfo("en-US")));
                foreach (var oRows in oStations)
                {
                    var sArea = oRows.Area;
                    var sSkillId = oRows.Id;
                    var sSkillName = oRows.Name;
                    var IdMapField = (oRows.Name.Replace(" ", string.Empty)) + sSkillId;
                    if (!string.IsNullOrEmpty(Request.Form[IdMapField]))
                    {
                        var nScore = Request.Form[IdMapField].ToString();
                        oDb.SkillMatrices.Add(new SkillMatrices()
                        {
                            UserId = sId,
                            StationId = sSkillId,
                            Score = int.Parse(nScore),
                            LastUpdate = dDateTime
                        });
                    }
                }
                oDb.SaveChanges();
                return RedirectToAction("Index");
            }
        }
        [HttpPost]
        public JsonResult Report(List<string> ids)
        {
            using (var oDb = new ApprenticeDB())
            {
                var oSkillMatrices = (from oSkill in oDb.SkillMatrices
                                      join oUser in oDb.auth_User on oSkill.UserId equals oUser.Id
                                      join oStation in oDb.Stations on oSkill.StationId equals oStation.Id
                                      select new BMW.ClassLibrary.Reports.Models.SkillMatrix
                                      {
                                          UserId = oSkill.UserId,
                                          UserName = oUser.DisplayName,
                                          SkillId = oStation.Id,
                                          SkillName = oStation.Name,
                                          Area = oStation.Area,
                                          Score = oSkill.Score,
                                          LastUpdate = oSkill.LastUpdate
                                      }).OrderBy(e => e.UserId).ThenBy(e => e.Area).ToList();
                var oResult = oSkillMatrices.Where(e=> ids.Contains(e.UserId)).ToList();
                var rpt = new Toptier.Reporting.ReportViewerData();
                rpt.ReportName = "SkillMatrix Report";
                //set report model
                rpt.ReportPath = Path.Combine("bin/Reports/Templates", "SkillMatrix.rdlc");

                // set datasource
                var datasources = new Dictionary<string, object>();
                datasources.Add("DataSet", oResult);
                rpt.DataSources = datasources;

                //set parameter
                var parameters = new Dictionary<string, string>();
                parameters.Add("pmTrainerName", "XXX XXXX");
                parameters.Add("pmApprentic", "TV 4261");
                parameters.Add("pmModel", "All Model");
                parameters.Add("pmShift", "A");
                parameters.Add("pmYear", "2021");
                rpt.Parameters = parameters;
                Session[rpt.Id] = rpt;
                //return Redirect("~/ReportViewer.aspx?rptsid=" + rpt.Id);
                return Json(new { Id=rpt.Id });
            }
        }

        public ActionResult WorkStationMain()
        {
            using (var oDb = new ApprenticeDB())
            {
                //var Station = oDb.Stations.OrderBy(e => e.Area).ToList();                  
                return View();
            }
        }
        public JsonResult GEToDataStation([ModelBinder(typeof(DataTablesBinder))] IDataTablesRequest datatable)
        {
            using (var oDb = new ApprenticeDB())
            {
                var Station = oDb.Stations.OrderBy(e => e.Area).ToList();
                return Json(DataTablesService.GetDataTablesResponse(datatable, Station.AsQueryable()));
            }
        }
        public ActionResult WorkStationMtn(string Id)
        {
            ViewBag.action = string.IsNullOrEmpty(Id) ? "Create" : "Update";           
            if (!string.IsNullOrEmpty(Id))
            {
                var nId = int.Parse(Id);
                using (var oDb = new ApprenticeDB())
                {
                    var Station = oDb.Stations.Where(e => e.Id == nId).OrderBy(e => e.Area).FirstOrDefault();
                    return View(Station);
                }
            }
            else
            {
                return View(new Station());
            }
          
        }
        [HttpPost]
        public ActionResult WorkStationMtn(FormCollection frm)
        {
            var sAction = frm["Action"].ToString();
            var nId = int.Parse(frm["Id"].ToString());
            var sName = frm["Name"].ToString();
            var sArea = frm["Area"].ToString();

            using (var oDb = new ApprenticeDB())
            {
                switch (sAction)
                {
                    case "Create":
                        oDb.Stations.Add(new Station()
                        {
                            Name = sName,
                            Area = sArea
                        });
                        oDb.SaveChanges();
                        break;
                    case "Update":
                        var Station = oDb.Stations.Where(e => e.Id == nId).OrderBy(e => e.Area).FirstOrDefault();
                        Station.Name = sName;
                        Station.Area = sArea;
                        oDb.SaveChanges();
                        break;
                }
                //var Station = oDb.Stations.Where(e => e.Id == Id).OrderBy(e => e.Area).ToList();
                return RedirectToAction("WorkStationMain");
            }
        }
    }
}