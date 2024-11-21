using ApplicationForm.DBContext;
using ApplicationForm.Helpers;
using BMWM.Apprentice.Web.AuthModels;
using BMWM.Apprentice.Web.AuthService;
using BMWM.Apprentice.Web.AuthWebService;
using DataTables.Mvc;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.IO;
using System.Linq;
using System.Linq.Dynamic;
using System.Threading;
using System.Web;
using System.Web.Mvc;
using Toptier.Filters;
using Toptier.ImportingService.Services;

namespace ApplicationForm.Controllers
{
    [AuthorizeUser]
    public class UserAccountController : Controller
    {
        private readonly string AuthUserRole = ConfigurationManager.AppSettings["auth-user"].ToString();
        private readonly string AuthAdminRole = ConfigurationManager.AppSettings["auth-admin"].ToString();
        private readonly string AuthInproRole = ConfigurationManager.AppSettings["auth-test2"].ToString();
        private readonly string AuthMsgRole = ConfigurationManager.AppSettings["auth-msg"].ToString();
        private readonly string AuthQualifRole = ConfigurationManager.AppSettings["auth-test3"].ToString();
        // GET: UserAccount
        public UserAccountController()
        {
            _ = Thread.CurrentThread.CurrentUICulture;
        }
        public ActionResult Index()
        {
            ViewData["UserGroup"] = new cGETGroupUser().GroupUser;
            TempData["UserId"] = "";
            ViewBag.btnNewVisible = true;
            return View();
        }
        public JsonResult GetDataForDataTable([ModelBinder(typeof(DataTablesBinder))] IDataTablesRequest datatable, string UserGroup)
        {

            //all data(active)
            var data = ManagerService.GetAllUsers().AsQueryable(); //db.auth_User.Include(e => e.UpdatedByUser);
            int total = data.Count();

            //fillter
            if (string.IsNullOrEmpty(datatable.Search.Value) == false)
                //data = data.Where("DisplayName.Contains(@0)", datatable.Search.Value);
                data = data.Where(x => x.Id.Contains(datatable.Search.Value) || x.DisplayName.Contains(datatable.Search.Value));

            //order(single column)
            var orderCol = datatable.Columns.Where(e => e.Orderable && e.IsOrdered).FirstOrDefault();
            if (orderCol != null)
                data = data.OrderBy(orderCol.Name + (orderCol.SortDirection == Column.OrderDirection.Ascendant ? "" : " desc"));
            else
                data = data.OrderBy(e => e.Id);

            //take and select
            data = data.Skip(datatable.Start).Take(datatable.Length);
            if (!String.IsNullOrEmpty(UserGroup))
                data = data.Where(x => x.CFInt1 == int.Parse(UserGroup));

            return Json(new DataTablesResponse(datatable.Draw, data, data.Count(), total));
        }
        public ActionResult Manage(string id)
        {
            var obj = new User();
            try
            {
                var sId = string.IsNullOrEmpty(id) ? TempData["UserId"].ToString() : id;
                //id = TempData["UserId"].ToString();
                if (string.IsNullOrEmpty(sId))
                {
                    //Create
                    ViewBag.action = "create";
                }
                else
                {
                    //update
                    ViewBag.action = "update";
                    obj = ManagerService.GetUser(sId);
                }
                ViewBag.start = "<div class='col-sm-6'><div class='control-group'>";
                ViewBag.end = "</div></div>";
                ViewBag.IsRegister = "";
                return View(obj);
            }
            catch
            {
                return RedirectToAction("Index");
            }
        }
        [HttpPost]
        [ActionName("Manage")]
        [OnAction(ButtonName = "create")]
        public ActionResult CreateAuthUser(User obj, FormCollection frm)
        {
            CHKxDuplicateKey(obj, "Create");
            if (ViewBag.IsRegister != "")
            {
                ViewBag.action = "create";
                ViewBag.start = "<div class='col-sm-6'><div class='control-group'>";
                ViewBag.end = "</div></div>";
                return View(new User());
            }
            else
            {
                var UserId = UserAuthentication.UserId;
                bool chkAdd = ManagerService.CreateUser(obj, UserId);
                if (chkAdd)
                {
                    SaveAuthRole(obj.Id, frm);
                }
                //TempData["UserId"] = obj.Id;
                return RedirectToAction("Index");
            }
        }
        [HttpPost]
        [ActionName("Manage")]
        [OnAction(ButtonName = "update")]
        public ActionResult UpdateAuthUser(User obj, FormCollection frm)
        {
            CHKxDuplicateKey(obj, "Update");
            if (ViewBag.IsRegister != "")
            {
                ViewBag.action = "update";
                ViewBag.start = "<div class='col-sm-6'><div class='control-group'>";
                ViewBag.end = "</div></div>";
                return View(obj);
            }
            else
            {
                string UserId = UserAuthentication.UserId;
                bool chkAdd = false;
                if (obj.Password == null)
                {
                    ManagerService.UpdateUser(obj, UserId);
                    chkAdd = true;
                }
                else
                {
                    ManagerService.UpdateUser(obj.Id, obj.Password, null, obj.AuthenticateBy
                        , obj.DisplayName, null, obj.Email, null, null, obj.RedirectPage, null, obj.IsActive, UserId);
                    chkAdd = true;
                }

                if (chkAdd)
                {
                    SaveAuthRole(obj.Id, frm);
                }
                //TempData["UserId"] = obj.Id;
                return RedirectToAction("Index");
            }
        }
        private void SaveAuthRole(string UserId, FormCollection frm)
        {
            List<string> lst = new List<string>();

            var obj = ManagerService.GetAllItems();
            foreach (var item in obj)
            {
                string role_code = item.Code;

                if (!string.IsNullOrEmpty(Request.Form[role_code]))
                {
                    lst.Add(role_code);
                }//if
            }//foreach

            if (lst.Count > 0)
            {
                var ByUserId = UserAuthentication.UserId;
                ManagerService.UpdateUserItem(UserId, lst, ByUserId);
            }
        }
        private void CHKxDuplicateKey(User obj, string psAction)
        {
            ViewBag.IsRegister = "";
            using (var oDb = new ApprenticeDB())
            {
                if (psAction == "Create")
                {
                    if (oDb.auth_User.Where(e => e.Id == obj.Id).Count() > 0)
                    {
                        ViewBag.IsRegister += "U";
                    }
                    //if (oDb.auth_User.Where(e => e.Email == obj.Email).Count() > 0)
                    //{
                    //    ViewBag.IsRegister += "E";
                    //}
                }
                else
                {
                    //if (oDb.auth_User.Where(e => e.Email == obj.Email &&e.Id!=obj.Id).Count() > 0)
                    //{
                    //    ViewBag.IsRegister += "E";
                    //}
                }
                //if (oDb.auth_User.Where(e => e.DisplayName == obj.DisplayName).Count() > 0)
                //{
                //    ViewBag.IsRegister += "F";
                //}
            }
        }
        [HttpPost]
        public ActionResult Upload(HttpPostedFileBase FileUser)
        {
            if (FileUser != null && FileUser.ContentLength > 0)
            {
                var sUserfileName = "Userlist";
                var sFileName = sUserfileName + Path.GetExtension(FileUser.FileName);
                var sPath = Path.Combine(Server.MapPath("~/Files"), sFileName);
                if (!Directory.Exists(Server.MapPath("~/Files")))
                    Directory.CreateDirectory(Server.MapPath("~/Files"));
                if (System.IO.File.Exists(sPath))
                    System.IO.File.Delete(sPath);

                FileUser.SaveAs(sPath);

                //Read from excel
                var oImp = new ConfigurationService(Server.MapPath("~/IMPTDB.xml"));
                var oObj = oImp.GetConfiguration("UserXLS"); //ID ของการ Config ในไฟล์ IMPTDB.xml
                oObj.SourceDirectory = "~/Files";
                oObj.SourceFile = sFileName;
                var oDt = ImportingService.ReadExcelFile(oObj);
                using (var oDb = new ApprenticeDB())
                {
                    foreach (DataRow oRows in oDt.Rows)
                    {
                        if (!oRows.IsNull(0))
                        {

                            var sUserId = oRows["UserId"].ToString();
                            var sGroup = oRows["Group"].ToString();
                            var sHireDate = oRows["HireDate"].ToString();
                            int? nGroup = null;
                            DateTime? dHireDate = null;
                            if (sGroup != "") nGroup = int.Parse(sGroup);
                            if (sHireDate != "") dHireDate = DateTime.Parse(sHireDate);
                            var oUser = new User
                            {
                                AuthenticateBy = UserAuthenticateBy.DB,
                                Id = sUserId,
                                Password = sUserId,
                                DisplayName = oRows["Name(English)"].ToString() + " " + oRows["Surname(English)"].ToString(),
                                DisplayName2 = oRows["Name(Thai)"].ToString() + " " + oRows["Surname(Thai)"].ToString(),
                                Email = oRows["Email"].ToString(),
                                IsActive = true,
                                CFStr1 = oRows["Title"].ToString(),
                                CFStr2 = oRows["Profession"].ToString(),
                                CFStr3 = oRows["OJTLocation"].ToString(),
                                CFStr4 = oRows["Supervisor"].ToString(),
                                CFInt1 = nGroup,
                                CFDtm1 = dHireDate
                            };
                            var oUsr = oDb.auth_User.Where(e => e.Id == sUserId);
                            if (oUsr.Count() > 0)
                                UpdateAuthUser(oUser);
                            else
                                CreateAuthUser(oUser);
                        }
                    }
                }
            }
            return RedirectToAction("Index");
        }
        public JsonResult AddQualification(List<string> Id)
        {
            if (Id != null)
            {
                using (var oDb = new ApprenticeDB())
                {
                    foreach (var sId in Id)
                    {
                        var oItemCode = oDb.auth_UserItem.Where(w => w.UserId == sId).Select(s => s.ItemCode).ToList();
                        var oAuthQualif = new List<string> { AuthQualifRole };
                        oAuthQualif.AddRange(oItemCode);
                        SaveAuthRole(sId, oAuthQualif);
                    }
                    return Json(new { Status = "true" });
                }
            }
            else
                return Json(new { Status = "false" });
        }
        public void CreateAuthUser(User Obj)
        {
            var UserId = UserAuthentication.UserId;
            bool bChkAdd = ManagerService.CreateUser(Obj, UserId);
            if (bChkAdd)
                SaveAuthRole(Obj.Id, new List<string> { AuthMsgRole, AuthInproRole, AuthUserRole });
        }
        public void UpdateAuthUser(User Obj)
        {
            string UserId = UserAuthentication.UserId;
            ManagerService.UpdateUser(Obj, UserId);
            //if (bChkAdd)
            //   SaveAuthRole(Obj.Id, new List<string> { "APT-002", "APT-003", "USER" });
        }
        private void SaveAuthRole(string UserId, List<string> UserRole)
        {
            List<string> oList = new List<string>();
            var oObj = ManagerService.GetAllItems();
            foreach (var item in oObj)
            {
                var sRole_code = item.Code;
                if (UserRole.Distinct().Contains(sRole_code))
                    oList.Add(sRole_code);
            }//foreach
            if (oList.Count > 0)
            {
                var sByUserId = UserAuthentication.UserId;
                ManagerService.UpdateUserItem(UserId, oList, sByUserId);
            }
        }
    }
}