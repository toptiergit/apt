using DataTables.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using ApplicationForm.DBContext;
using BMWM.Apprentice.Web.AuthWebService;
using BMWM.Apprentice.Web.AuthService;
using BMWM.Apprentice.Web.DBContext;
using BMWM.Apprentice.Web.AuthModels;
using ApplicationForm.AuthModels;
using System.Threading;

namespace ApplicationForm.Controllers
{
    public class HomeController : Controller
    {
        public HomeController()
        {
            _ = Thread.CurrentThread.CurrentUICulture;
        }
        public ActionResult Index()
        {
            if (string.IsNullOrEmpty(UserAuthentication.UserId))
            {

                return RedirectToAction("Login");
            }
            else
            {
                return RedirectToAction("Home", "ApplicationForm");
            }
        }

        [HttpGet]
        public ActionResult Login(string sid)
        {
            string licenseKey = System.Configuration.ConfigurationManager.AppSettings["LicenseKey"];
            ViewBag.login = "";

            //string msg = api.CheckLicense(licenseKey);
            //if (msg != "ValidLicense")
            //{
            //    ViewBag.license = "InvalidLicense";
            //    ViewBag.licenseMsg = msg;

            //    ViewBag.licenseRequestCode = "License Request Code : " + api.GetLicenseRequestCode();
            //}
            //else
            //{
            //    ViewBag.license = "ValidLicense";
            //    ViewBag.licenseMsg = "";

            //    BMW.ClassLibrary.API.License lsApi = new BMW.ClassLibrary.API.License();
            //    string[] license = lsApi.GetLicense(licenseKey);
            //    if (license[0] != "")
            //        ViewBag.licenseExpireDate = "Expire Date: " + license[0];
            //}

            //Kitti added, to passed auth session id for auto login 
            if (string.IsNullOrEmpty(sid))
            {
                string connectionString = System.Configuration.ConfigurationManager.ConnectionStrings["ApprenticeDB"].ConnectionString;
                System.Data.SqlClient.SqlConnectionStringBuilder builder = new System.Data.SqlClient.SqlConnectionStringBuilder(connectionString);

                string dbConn = System.Configuration.ConfigurationManager.AppSettings["LoginShowDatabaseConnction"];
                ViewBag.Conn = (dbConn == "true" ? "DatabaseConnection <br />Server : " + builder.DataSource + "<br />Name : " + builder.InitialCatalog : "");

                return View();
            }
            else
            {
                string userid = null;
                if (AuthenticationService.AuthenticationSessionExists(sid, false))
                {
                    using (var authDb = new AuthContext())
                    {
                        userid = authDb.AuthenticationSessions.Where(e => e.Id == sid).Select(e => e.UserId).FirstOrDefault();
                    }
                }

                var user = ManagerService.GetUser(userid);
                //do same as Login[Post]
                var loginRes = UserAuthentication.Login(user.Id, user.Password, Request.ServerVariables["REMOTE_HOST"], Request.ServerVariables["REMOTE_ADDR"], true, true);
                if (loginRes.Success)
                {
                    return RedirectToAction("Home", "ApplicationForm");
                }
                else
                {
                    ViewBag.login = loginRes.Failure.Description();
                    return View();
                }
            }
        }

        [HttpPost]
        public ActionResult Login(string username, string password)
        {
            AuthenticationService.LoginResult loginRes = new AuthenticationService.LoginResult();
            ViewBag.login = "";
            var user = ManagerService.GetUser(username);
            if (user != null)
            {
                var userAuthenticateBy = user.AuthenticateBy;
                if (userAuthenticateBy == UserAuthenticateBy.CUSTOM)
                {
                    var url = System.Configuration.ConfigurationManager.AppSettings["CustomLoginUrl"];
                    var customLoginResult = BMWM.Apprentice.Web.AuthService.AuthenticationService.GetCustomLoginResult(url, username, password);
                    if (customLoginResult == null)
                    {
                        loginRes.Success = false;
                        loginRes.Failure = AuthenticationService.LoginResult.LoginResultFailure.InvalidUserIdOrPassword;
                    }
                    else if (customLoginResult.Result)
                    {
                        loginRes = UserAuthentication.Login(username, password, Request.ServerVariables["REMOTE_HOST"], Request.ServerVariables["REMOTE_ADDR"], true, true);
                        loginRes.Success = true;
                    }
                    else
                    {
                        loginRes.Success = false;
                        loginRes.Failure = AuthenticationService.LoginResult.LoginResultFailure.InvalidUserIdOrPassword;
                    }
                }
                else
                {
                    loginRes = UserAuthentication.Login(username, password, Request.ServerVariables["REMOTE_HOST"], Request.ServerVariables["REMOTE_ADDR"], true, true);
                }
            }
            else
                loginRes = UserAuthentication.Login(username, password, Request.ServerVariables["REMOTE_HOST"], Request.ServerVariables["REMOTE_ADDR"], true, true);

            if (loginRes.Success)
            {
                using (var oDb = new ApprenticeDB())
                {
                    var oItemCode = oDb.auth_UserItem.Where(e => e.UserId == username && (e.ItemCode == "ADMIN" || e.ItemCode == "USER")).Select(e => e.ItemCode).ToList().FirstOrDefault();
                    UserAuthentication.User.UserItems.Add(new UserItem { ItemCode = oItemCode });
                }
                //return Redirect(ApplicationForm.Helpers.RedirectPage.GetRedirectPage());
                return RedirectToAction("Home", "ApplicationForm");
            }
            else
            {
                ViewBag.login = loginRes.Failure.Description();
                return View();
            }
        }

        public ActionResult Logout()
        {
            UserAuthentication.Logout();
            return RedirectToAction("Login", "Home");
        }

        public ActionResult AuthenticationTimeout()
        {
            return View();
        }

        public ActionResult Unauthorized()
        {
            return View();
        }

        //Get
        [AuthorizeUser]
        public ActionResult ChangePassword()
        {

            return View();
        }

        [HttpPost]
        [AuthorizeUser]
        public ActionResult ChangePassword(string oldPassword, string newPassword)
        {
            ManagerService.UpdateUserPassword(UserAuthentication.UserId, newPassword);
            return RedirectToAction("Logout", "Home");

            /*bool res = Toptier.Authentication.Web.UserAuthentication.ChangePassword(oldPassword, newPassword);

           if (res)
               return RedirectToAction("Logout", "Home");
           else
               ViewBag.ChangeSuccess = false;
               return View();
               */
        }

        [HttpPost]
        public JsonResult CheckOldPassword(string userId, string pwd)
        {
            using (var db = new AuthContext())
            {
                bool rs;
                var user = db.Users.Single(e => e.Id == userId);
                if (pwd == ManagerService.DecryptPassword(user.Password))
                    rs = true;
                else
                    rs = false;

                return Json(new { success = rs });
            }
        }

        [AuthorizeUser("auth-enumInfo")]
        public ActionResult EnumInfo()
        {
            return View();
        }


        [AuthorizeUser]
        public ActionResult LicenseInfo()
        {
            var licenseKey = System.Configuration.ConfigurationManager.AppSettings["LicenseKey"];
            var api = new BMWM.Apprentice.Web.Helpers.License();
            string[] license = api.GetLicense(licenseKey);

            if (license != null)
            {
                ViewBag.ExpireDate = license[0];
                ViewBag.LicenseKey = license[1];
                ViewBag.MACAddress = license[2];
                ViewBag.MachineName = license[3];
                ViewBag.MaximumNumberOfEnabledUser = license[4];
                ViewBag.MaximumNumberOfUser = license[5];
                ViewBag.Remark = license[6];
                ViewBag.Signature = license[7];
            }
            return View();
        }

        public ActionResult ChangeLanguage(string lang, string url, string refType)
        {
            Toptier.Web.Resource.ResourceManager.CurrentLanguage = lang;
            if (string.IsNullOrEmpty(url))
                return RedirectToAction("index");
            else
            {
                if (!string.IsNullOrEmpty(refType))
                    url += "&refType=" + refType;

                return Redirect(url);
            }
        }

    }
}