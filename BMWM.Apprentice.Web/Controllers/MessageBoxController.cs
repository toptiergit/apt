using ApplicationForm.DBContext;
using ApplicationForm.Models;
using BMWM.Apprentice.Web.AuthWebService;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Globalization;
using System.Linq;
using System.Threading;
using System.Web;
using System.Web.Mvc;

namespace ApplicationForm.Controllers
{
    public class MessageBoxController : Controller
    {
        //public ApprenticeDB dbContext = new ApprenticeDB();
        private readonly string sUser = UserAuthentication.UserId;
        private readonly string AuthUserRole= ConfigurationManager.AppSettings["auth-user"].ToString();
        private readonly string AuthAdminRole = ConfigurationManager.AppSettings["auth-admin"].ToString();

        // GET: MessageBox
        public MessageBoxController()
        {
            _ = Thread.CurrentThread.CurrentUICulture;
        }
        public ActionResult Index()
        {
            using (var oDb = new ApprenticeDB())
            {
                var oMessageBox = oDb.MessageBoxes.Where(e => (e.AdminUserId == sUser || e.UserId == sUser) && e.IsRead == false && e.SenderUserId != sUser);
                var oFirstItemsInGroup = from MessageBox in oMessageBox
                                         group MessageBox by MessageBox.SenderUserId into g
                                         select g.FirstOrDefault();
                return PartialView(oFirstItemsInGroup.ToList());
            }
        }
        [AuthorizeUser]
        // GET: MessageBox/Details/5
        public ActionResult Details(string SenderUserId, string Image)
        {
            var sImage = Image == null ? "../images/MessageBox/avatar.png" : Image;//Fixไว้ ยังไม่มีที่เก็บชื่อรูป
            Session["SenderId"] = SenderUserId;
            Session["Image"] = sImage;
            var OMessageBox = GEToMessageBox(SenderUserId, sImage);
            return View(OMessageBox);
        }

        private List<MessageBox> GEToMessageBox(string SenderUserId, string sImage)
        {
            var OMessageBox = new List<MessageBox>();
            using (var oDb = new ApprenticeDB())
            {
                (from oMessageBoxes in oDb.MessageBoxes
                 where oMessageBoxes.SenderUserId == SenderUserId
                 select oMessageBoxes).ToList().ForEach(x => x.IsRead = true);
                oDb.SaveChanges();
                ViewBag.UserImage = sImage;
                OMessageBox = oDb.MessageBoxes.Where(e => (e.AdminUserId == sUser || e.UserId == sUser) && (e.AdminUserId == SenderUserId || e.UserId == SenderUserId)).ToList();
            }
            return OMessageBox;
        }
        [AuthorizeUser]
        [HttpPost]
        public ActionResult Details(string Msg)
        {
            try
            {
                var sSenderId = Session["SenderId"].ToString();
                var sImage = Session["Image"].ToString();
                var sItemCode = UserAuthentication.User.UserItems.ToList().FirstOrDefault().ItemCode;
                using (var oDb = new ApprenticeDB())
                {
                    var oMessageBox = new MessageBox()
                    {
                        Message = Msg,
                        AdminUserId = sItemCode == AuthAdminRole ? sUser : sSenderId,
                        UserId = sItemCode == AuthUserRole ? sUser : sSenderId,
                        IsRead = false,
                        SenderUserId = sUser,
                        CreatedOn = DateTime.Parse(DateTime.Now.ToString(new CultureInfo("en-US")))
                    };
                    oDb.MessageBoxes.Add(oMessageBox);
                    oDb.SaveChanges();
                }
                var OMessageBox = GEToMessageBox(sSenderId, sImage);
                return View(OMessageBox);

                // TODO: Add insert logic here
            }
            catch (Exception)
            {
                return View();
            }
        }
        // GET: MessageBox/Create
        [AuthorizeUser]
        public ActionResult MsgBoard()
        {
            var sItemCode = UserAuthentication.User.UserItems.ToList().FirstOrDefault().ItemCode;
            using (var oDb = new ApprenticeDB())
            {
                var oQuery = (from UserItem in oDb.auth_UserItem
                              join User in oDb.auth_User on UserItem.UserId equals User.Id
                              join Msg in oDb.MessageBoxes on UserItem.UserId equals Msg.SenderUserId into Msg2
                              from x in Msg2.DefaultIfEmpty()
                              where (UserItem.ItemCode == AuthAdminRole || UserItem.ItemCode == AuthUserRole) && UserItem.ItemCode != sItemCode
                              select new MsgBoxHD { SenderUserName = User.DisplayName, SenderUserId = User.Id, TimeLine = x.CreatedOn == null ? DateTime.Now : x.CreatedOn }).OrderByDescending(o => o.TimeLine);
                var oLastItemsInGroup = from MessageBox in oQuery
                                        group MessageBox by MessageBox.SenderUserId into g
                                        select g.FirstOrDefault();
                return View(oLastItemsInGroup.ToList());
            }
        }
      
    }
}
