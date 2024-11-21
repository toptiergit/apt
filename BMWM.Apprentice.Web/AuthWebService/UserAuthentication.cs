using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace BMWM.Apprentice.Web.AuthWebService
{
    public static class UserAuthentication
    {
        public static bool HttpSessionAlive
        {
            get
            {
                return (HttpContext.Current.Session["auth_AuthenticationSessionId"] != null);
            }
        }
        public static string AuthenticationSessionId
        {
            get
            {
                return (string)HttpContext.Current.Session["auth_AuthenticationSessionId"];
            }
        }
        public static string UserId
        {
            get
            {
                return (string)HttpContext.Current.Session["auth_UserId"];
            }
        }
        public static AuthModels.User User
        {
            get
            {
                return (AuthModels.User)HttpContext.Current.Session["auth_User"];
            }
        }
        public static List<AuthModels.Item> AuthorizedItems
        {
            get
            {
                if (UserId != null)
                    if (AppSettings.AuthorizationMode == AuthorizationMode.Session) //session mode
                        return (List<AuthModels.Item>)HttpContext.Current.Session["auth_UserAuthorizedItemcode"];
                    else
                        return AuthService.AuthenticationService.GetUserAuthorizedItems(UserId);
                else
                    return null;
            }
        }
        public static List<AuthModels.Role> AuthorizedRoles
        {
            get
            {
                if (UserId != null)
                    if (AppSettings.AuthorizationMode == AuthorizationMode.Session) //session mode
                        return (List<AuthModels.Role>)HttpContext.Current.Session["auth_UserAuthorizedRole"];
                    else
                        return AuthService.AuthenticationService.GetUserAuthorizedRoles(UserId);
                else
                    return null;

            }
        }
        public static bool IsPasswordExpired
        {
            get
            {
                if (User != null && User.AuthenticateBy == AuthModels.UserAuthenticateBy.DB)
                {
                    var d = AuthService.AuthenticationService.GetPasswordExpireInDays(User.PasswordExpireOn);
                    return d == null ? false : (d.Value <= 0);
                }
                else
                    return false;
            }
        }
        public static int? PasswordExpireInDays
        {
            get
            {
                if (User != null && User.AuthenticateBy == AuthModels.UserAuthenticateBy.DB)
                    return AuthService.AuthenticationService.GetPasswordExpireInDays(User.PasswordExpireOn);
                else
                    return null;
            }
        }

        public static AuthService.AuthenticationService.LoginResult BlinkLogin(string userId, string machineName, string ipAddress, bool killExistingAuthSession, bool allowNotExistingUser = false)
        {
            var ret = AuthService.AuthenticationService.UserBlinkLogin(userId, machineName, ipAddress, killExistingAuthSession, allowNotExistingUser);
            if (ret.Success) //passed so, store userId in session
                SetHttpSession(ret.AuthenticationSessionId, userId);
            return ret;
        }
        public static AuthService.AuthenticationService.LoginResult Login(string userId, string password, string machineName, string ipAddress, bool killExistingAuthSession, bool acceptExpiredPassword)
        {
            var ret = AuthService.AuthenticationService.UserLogin(userId, password, machineName, ipAddress, killExistingAuthSession, acceptExpiredPassword);
            if (ret.Success) //passed so, store userId in session
                SetHttpSession(ret.AuthenticationSessionId, userId);
            return ret;
        }
        [Obsolete("This method is obsolete. Call Login in another overloading method instead.", false)]
        public static bool Login(string userId, string password, string machineName, string ipAddress, bool killExistingAuthSession = false)
        {
            string authSid = AuthService.AuthenticationService.UserLogin(userId, password, machineName, ipAddress, killExistingAuthSession);
            if (authSid != null) //passed so, store userId in session
                SetHttpSession(authSid, userId);
            return (authSid != null);
        }
        public static bool ContinueSession(string authSessionId)
        {
            var authSession = AuthService.AuthenticationService.GetAuthenticationSession(authSessionId, true);
            if (authSession != null)
                SetHttpSession(authSession.Id, authSession.UserId);
            return (authSession != null);
        }
        public static bool SpireSession(string authSessionId)
        {
            string userId;
            var authSid = AuthService.AuthenticationService.SpireAuthenticationSession(authSessionId, out userId);
            if (authSid != null) //passed so, store userId in session
                SetHttpSession(authSid, userId);
            return (authSid != null);
        }
        private static void SetHttpSession(string authSid, string userId)
        {
            HttpContext.Current.Session["auth_AuthenticationSessionId"] = authSid;
            var user = AuthService.AuthenticationService.GetUserInfo(userId);
            HttpContext.Current.Session["auth_User"] = user;
            HttpContext.Current.Session["auth_UserId"] = (user?.Id ?? userId);
            if (AppSettings.AuthorizationMode == AuthorizationMode.Session) //store auth item code in session
            {
                HttpContext.Current.Session["auth_UserAuthorizedItemcode"] = AuthService.AuthenticationService.GetUserAuthorizedItems(userId);
                HttpContext.Current.Session["auth_UserAuthorizedRole"] = AuthService.AuthenticationService.GetUserAuthorizedRoles(userId);
            }
        }
        public static void Logout(bool deleteSessionFromDb = true)
        {
            string authSid = AuthenticationSessionId;
            if (deleteSessionFromDb && authSid != null) //delete session from db
                AuthService.AuthenticationService.DeleteAuthenticationSession(authSid);

            HttpContext.Current.Session["auth_AuthenticationSessionId"] = null;
            HttpContext.Current.Session["auth_User"] = null;
            HttpContext.Current.Session["auth_UserId"] = null;
            if (AppSettings.AuthorizationMode == AuthorizationMode.Session) //store auth item code in session
            {
                HttpContext.Current.Session["auth_UserAuthorizedItemcode"] = null;
                HttpContext.Current.Session["auth_UserAuthorizedRole"] = null;
            }
        }

        public static bool ChangePassword(string oldPassword, string newPassword)
        {
            return (UserId != null ? AuthService.AuthenticationService.ChangePassword(UserId, oldPassword, newPassword) : false);
        }
        public static bool IsAuthorizedItem(string itemCode)
        {
            if (UserId != null)
            {
                if (string.IsNullOrEmpty(itemCode)) return true;

                if (AppSettings.AuthorizationMode == AuthorizationMode.Session)
                    return AuthorizedItems.Any(e => e.Code.ToUpper() == itemCode.ToUpper()); //session mode
                else
                    return AuthService.AuthenticationService.IsUserAuthorizedItem(UserId, itemCode); //db mode
            }
            else
                return false;
        }
        public static bool IsAuthorizedRole(string roleCode)
        {
            if (UserId != null)
            {
                if (string.IsNullOrEmpty(roleCode)) return true;

                if (AppSettings.AuthorizationMode == AuthorizationMode.Session)
                    return AuthorizedRoles.Any(e => e.Code.ToUpper() == roleCode.ToUpper()); //session mode
                else
                    return AuthService.AuthenticationService.IsUserAuthorizedRole(UserId, roleCode); //db mode
            }
            else
                return false;
        }
    }
}
