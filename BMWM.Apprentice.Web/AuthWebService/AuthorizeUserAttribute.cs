using BMWM.Apprentice.Web.AuthService;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace BMWM.Apprentice.Web.AuthWebService
{
    public class AuthorizeUserAttribute : AuthorizeAttribute
    {
        public AuthorizeUserAttribute()
        {
        }
        public AuthorizeUserAttribute(string itemCodeKey)
        {
            if (itemCodeKey != null)
                ItemCodeKeys = new string[] { itemCodeKey };
        }
        public AuthorizeUserAttribute(string itemCodeKey, string roleCodeKey)
        {
            if (itemCodeKey != null)
                ItemCodeKeys = new string[] { itemCodeKey };
            if (roleCodeKey != null)
                RoleCodeKeys = new string[] { roleCodeKey };
        }
        public AuthorizeUserAttribute(string itemCodeKey, string roleCodeKey, string userLevel)
        {
            if (itemCodeKey != null)
                ItemCodeKeys = new string[] { itemCodeKey };
            if (roleCodeKey != null)
                RoleCodeKeys = new string[] { roleCodeKey };
            if (userLevel != null)
                UserLevels = new string[] { userLevel };
        }
        public AuthorizeUserAttribute(string[] itemCodeKeys)
        {
            ItemCodeKeys = itemCodeKeys;
        }
        public AuthorizeUserAttribute(string[] itemCodeKeys, string[] roleCodeKeys)
        {
            ItemCodeKeys = itemCodeKeys;
            RoleCodeKeys = roleCodeKeys;
        }
        public AuthorizeUserAttribute(string[] itemCodeKeys, string[] roleCodeKeys, string[] userLevels)
        {
            ItemCodeKeys = itemCodeKeys;
            RoleCodeKeys = roleCodeKeys;
            UserLevels = userLevels;
        }

        public string[] ItemCodeKeys { get; set; }
        public string[] RoleCodeKeys { get; set; }
        public string[] UserLevels { get; set; }

        //0 = None
        //1 = NotAuthenticated
        //2 = NotAuthorized
        private int authorizeFail;
        protected override bool AuthorizeCore(HttpContextBase httpContext)
        {
            if (UserAuthentication.HttpSessionAlive == false)
            {
                authorizeFail = 1;
                return false;
            }
            else
            {
                string authSid = UserAuthentication.AuthenticationSessionId;
                //check and update timestamp info if exists
                if (AuthenticationService.AuthenticationSessionExists(authSid, true) == false)
                {
                    authorizeFail = 1;
                    return false;
                }
                else
                {
                    bool pass = true;
                    //Check for itemcode
                    if ((ItemCodeKeys?.Length ?? 0) > 0)
                    {
                        bool tpass = false;
                        foreach (var itemCodeKey in ItemCodeKeys)
                        {
                            string itemCode = System.Configuration.ConfigurationManager.AppSettings[itemCodeKey];
                            tpass = tpass || (string.IsNullOrEmpty(itemCode) ? true : UserAuthentication.IsAuthorizedItem(itemCode));
                        }
                        pass = pass && tpass;
                    }

                    //Check for rolecode
                    if ((RoleCodeKeys?.Length ?? 0) > 0)
                    {
                        bool rpass = false;
                        foreach (var roleCodeKey in RoleCodeKeys)
                        {
                            string roleCode = System.Configuration.ConfigurationManager.AppSettings[roleCodeKey];
                            rpass = rpass || (string.IsNullOrEmpty(roleCode) ? true : UserAuthentication.IsAuthorizedRole(roleCode));
                        }
                        pass = pass && rpass;
                    }

                    //Check for level
                    if ((UserLevels?.Length ?? 0) > 0)
                    {
                        var user = UserAuthentication.User;
                        if (user == null)
                        {
                            pass = pass && false;
                        }
                        else
                        {
                            bool lpass = false;
                            foreach (var userLevel in UserLevels)
                            {
                                lpass = lpass || ((user.Level ?? "").Trim().ToUpper() == (userLevel ?? "").Trim().ToUpper());
                            }
                            pass = pass && lpass;
                        }
                    }

                    if (pass)
                    {
                        authorizeFail = 0;
                        return true;
                    }
                    else
                    {
                        authorizeFail = 2;
                        return false;
                    }
                }
            }
        }

        //public override void OnAuthorization(AuthorizationContext filterContext)
        //{
        //    base.OnAuthorization(filterContext);
        //}

        protected override void HandleUnauthorizedRequest(AuthorizationContext filterContext)
        {
            if (authorizeFail == 1)
            {
                if (filterContext.HttpContext.Request.IsAjaxRequest())
                {
                    //http code result
                    filterContext.HttpContext.Response.StatusCode = AppSettings.AuthorizeUserAttribute_AuthenticationTimeoutResponseStatusCode;
                    filterContext.HttpContext.Response.End();
                    base.HandleUnauthorizedRequest(filterContext);
                }
                else
                {
                    string areaName = AppSettings.AuthorizeUserAttribute_AuthenticationTimeoutGoToArea;
                    string controllerName = AppSettings.AuthorizeUserAttribute_AuthenticationTimeoutGoToController;
                    string actionName = AppSettings.AuthorizeUserAttribute_AuthenticationTimeoutGoToAction;
                    if (areaName == "_self")
                        filterContext.Result = new RedirectToRouteResult(new System.Web.Routing.RouteValueDictionary(new { controller = controllerName, action = actionName }));
                    else
                        filterContext.Result = new RedirectToRouteResult(new System.Web.Routing.RouteValueDictionary(new { area = areaName, controller = controllerName, action = actionName }));
                }
            }
            else if (authorizeFail == 2)
            {
                if (filterContext.HttpContext.Request.IsAjaxRequest())
                {
                    //http code result
                    filterContext.HttpContext.Response.StatusCode = AppSettings.AuthorizeUserAttribute_UnauthorizedResponseStatusCode;
                    filterContext.HttpContext.Response.End();
                    base.HandleUnauthorizedRequest(filterContext);
                }
                else
                {
                    string areaName = AppSettings.AuthorizeUserAttribute_UnauthorizedGoToArea;
                    string controllerName = AppSettings.AuthorizeUserAttribute_UnauthorizedGoToController;
                    string actionName = AppSettings.AuthorizeUserAttribute_UnauthorizedGoToAction;
                    if (areaName == "_self")
                        filterContext.Result = new RedirectToRouteResult(new System.Web.Routing.RouteValueDictionary(new { controller = controllerName, action = actionName }));
                    else
                        filterContext.Result = new RedirectToRouteResult(new System.Web.Routing.RouteValueDictionary(new { area = areaName, controller = controllerName, action = actionName }));
                }
            }
        }
    }


}
