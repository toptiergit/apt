using ApplicationForm.DBContext;
using DataTables.Mvc;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace ApplicationForm.Controllers
{
    public class TopicController : Controller
    {
        public ApprenticeDB dbContext = new ApprenticeDB();
        // GET: Topic
        public ActionResult Index()
        {
            return View(dbContext.TopicHDs.ToList());
        }
        [HttpPost]
        public JsonResult Index([ModelBinder(typeof(DataTablesBinder))] IDataTablesRequest datatable)
        {
            using (var db = new ApprenticeDB())
            {
                var q = db.TopicHDs.AsQueryable();
               
                var data = q.Select(s => new
                {
                    TopicHD = "<h2>"+ "<a style='text-decoration:none' target ='_blank' href='./Topic/TopicDetail?TopicId=" + s.Id + "'>" + s.Name + "</a>" + "</h2>" + "<br>"+ "by&nbsp" + s.CreatedBy+ ".&nbsp" + s.CreatedOn
                }).ToList();

                return Json(DataTablesService.GetDataTablesResponse(datatable, data.AsQueryable()));
            }          
        }   
        public ActionResult TopicDetail(int TopicId)
        {
            using (var db = new ApprenticeDB())
            {
                var q = db.TopicDTs.Where(e => e.TopicId == TopicId);
                //var data = q.Select(s => new
                //{
                //    TopicHD = "<h2>"+ "<a target='_blank' href='./Topic/Applicant?ApplicantId=" + s.Id + "'>" + s.Name + "'</a>'" + "</h2>" + "<br>"+ "by&nbsp" + s.CreatedBy+ ".&nbsp" + s.CreatedOn
                //}).ToList();

                return View(q);
            }          
        }
    }
}