using ApplicationForm.DBContext;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace ApplicationForm.Helpers
{
    public class cGETGroupUser
    {
        public List<SelectListItem> GroupUser {get;set;}
        public  cGETGroupUser()
        {
            using (var oDb = new ApprenticeDB())
            {
                List<SelectListItem> oListGroup = new List<SelectListItem>();
                var oUser = oDb.auth_User;
                var oFirstItemsInGroup = from User in oUser
                                         group User by User.CFInt1 into g
                                         select g.FirstOrDefault();
                //oListGroup.Add(new SelectListItem { Text = "Group All", Value = "0" });
                foreach (var oGroup in oFirstItemsInGroup)
                {
                    var nGroup = oGroup.CFInt1;
                    if (nGroup > 0)
                    {
                        oListGroup.Add(new SelectListItem { Text = "Group " + nGroup, Value = nGroup.ToString() });
                    }
                }
                GroupUser = oListGroup;
            }
        }
    }
}