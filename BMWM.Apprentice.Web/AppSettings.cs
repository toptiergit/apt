using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace BMWM.Apprentice.Web
{
    public class AppSettings
    {
        public static string DbSchema {
            get {
                return System.Configuration.ConfigurationManager.AppSettings["auth_DbSchema"];
            }
        }
        public static AuthorizationMode AuthorizationMode {
            get {
                var strMode = System.Configuration.ConfigurationManager.AppSettings["auth_AuthorizationMode"];
                if (strMode == null) strMode = "";
                switch (strMode.ToLower())
                {
                    case "session":
                        return AuthorizationMode.Session;
                    default:
                        return AuthorizationMode.DB;
                }
            }
        }
        public static string LDAPPath {
            get {
                return System.Configuration.ConfigurationManager.AppSettings["auth_LDAPPath"];
            }
        }
        public static bool AllowNotExistsUserLoginViaLDAP {
            get {
                try
                {
                    if (string.IsNullOrEmpty(System.Configuration.ConfigurationManager.AppSettings["auth_LDAPPath"]))
                        return false;
                    else
                        return Convert.ToBoolean(System.Configuration.ConfigurationManager.AppSettings["auth_AllowNotExistsUserLoginViaLDAP"]);
                }
                catch (Exception)
                {
                    return false;
                }
            }
        }
        public static PasswordEncrypt PasswordEncrypt {
            get {
                string s = System.Configuration.ConfigurationManager.AppSettings["auth_PasswordEncrypt"];
                if (string.IsNullOrEmpty(s)) s = "none"; //default is none

                if (s.ToLower().StartsWith("md5"))
                {
                    return PasswordEncrypt.MD5;
                }
                else if (s.ToLower() == "base64")
                {
                    return PasswordEncrypt.Base64;
                }
                else
                {
                    return PasswordEncrypt.None;
                }
            }
        }
        public static string PasswordEncryptKey //key alway define after : e.g. md5:mykey
        {
            get {
                string s = System.Configuration.ConfigurationManager.AppSettings["auth_PasswordEncrypt"];
                if (string.IsNullOrEmpty(s)) s = ":"; //default is string empty

                if (s.Contains(":"))
                {
                    var startIndex = s.IndexOf(":") + 1;
                    if (s.Length > startIndex)
                        return s.Substring(startIndex);
                    else
                        return "";
                }
                else
                {
                    return s;
                }
            }
        }
        public static int AuthenticationSessionLifetime {
            get {
                int val;
                if (int.TryParse(System.Configuration.ConfigurationManager.AppSettings["auth_AuthenticationSessionLifetime"], out val))
                    return val;
                else
                    return 10080; //default is 10080 mins(7 days)
            }
        }



        public static AuthService.AuthenticationService.StrongPasswordRules StrongPasswordRules {
            get {
                var ret = new AuthService.AuthenticationService.StrongPasswordRules();
                var s = System.Configuration.ConfigurationManager.AppSettings["auth_StrongPasswordRules"];
                if (!string.IsNullOrEmpty(s))
                {
                    var a = s.Split('|');

                    // length
                    if (a.Length > 0 && !string.IsNullOrEmpty(a[0]))
                    {
                        var aa = a[0].Split(':');
                        AuthService.AuthenticationService.StrongPasswordRules.PasswordLength pwdLen;
                        pwdLen.Minimum = Convert.ToInt32(aa[0]);
                        pwdLen.Maximum = Convert.ToInt32(aa[1]);
                        ret.Length = pwdLen;
                    }

                    // require case
                    if (a.Length > 1 && !string.IsNullOrEmpty(a[1]))
                    {
                        var aa = a[1].Split(':');
                        AuthService.AuthenticationService.StrongPasswordRules.PasswordRequireCase pwdReqCase;
                        pwdReqCase.Cases = aa[0].Trim().ToUpper().ToCharArray();
                        pwdReqCase.MeetAtLeast = Convert.ToInt32(aa[1]);
                        ret.RequireCase = pwdReqCase;
                    }

                    // begin and end with alphabet
                    if (a.Length > 2 && !string.IsNullOrEmpty(a[2]))
                        ret.StartAndEndWithAlphabet = Convert.ToBoolean(a[2]);

                    // minimum variety of char
                    if (a.Length > 3 && !string.IsNullOrEmpty(a[3]))
                        ret.MinimumVarietyOfChar = Convert.ToInt32(a[3]);

                    // allow space
                    if (a.Length > 4 && !string.IsNullOrEmpty(a[4]))
                        ret.AllowSpace = Convert.ToBoolean(a[4]);

                    // allow userID as part
                    if (a.Length > 5 && !string.IsNullOrEmpty(a[5]))
                        ret.AllowUserIdAsPart = Convert.ToBoolean(a[5]);

                    // not be recent pwd
                    if (a.Length > 6 && !string.IsNullOrEmpty(a[6]))
                        ret.NotBeTopRecentPasssword = Convert.ToInt32(a[6]);
                }
                return ret;
            }
        }
        public static int? PasswordAge {
            get {
                int val;
                if (int.TryParse(System.Configuration.ConfigurationManager.AppSettings["auth_PasswordAge"], out val))
                    return val;
                else
                    return null; //default is null(forever)
            }
        }
        public static AuthService.AuthenticationService.LoginPolicy LoginPolicy {
            get {
                var ret = new AuthService.AuthenticationService.LoginPolicy();
                var s = System.Configuration.ConfigurationManager.AppSettings["auth_LoginPolicy"];
                if (!string.IsNullOrEmpty(s))
                {
                    var a = s.Split('|');

                    // fail block
                    if (a.Length > 0 && !string.IsNullOrEmpty(a[0]))
                    {
                        var aa = a[0].Split(':');
                        AuthService.AuthenticationService.LoginPolicy.LoginFailBlock loginFailBlock;
                        loginFailBlock.Times = Convert.ToInt32(aa[0]);
                        loginFailBlock.WithinSec = Convert.ToInt32(aa[1]);
                        if (!string.IsNullOrEmpty(aa[2]))
                            loginFailBlock.BlockSec = Convert.ToInt32(aa[2]);
                        else
                            loginFailBlock.BlockSec = null;
                        ret.FailBlock = loginFailBlock;
                    }
                }

                return ret;
            }
        }



        #region configuration for web
        public static string AuthorizeUserAttribute_AuthenticationTimeoutGoToArea {
            get {
                string res = System.Configuration.ConfigurationManager.AppSettings["auth_AuthorizeUserAttribute_AuthenticationTimeoutGoToArea"];
                if (res == null) res = "_self";
                return res;
            }
        }
        public static string AuthorizeUserAttribute_AuthenticationTimeoutGoToController {
            get {
                string res = System.Configuration.ConfigurationManager.AppSettings["auth_AuthorizeUserAttribute_AuthenticationTimeoutGoToController"];
                if (string.IsNullOrEmpty(res)) res = "home";
                return res;
            }
        }
        public static string AuthorizeUserAttribute_AuthenticationTimeoutGoToAction {
            get {
                string res = System.Configuration.ConfigurationManager.AppSettings["auth_AuthorizeUserAttribute_AuthenticationTimeoutGoToAction"];
                if (string.IsNullOrEmpty(res)) res = "authenticationtimeout";
                return res;
            }
        }
        public static int AuthorizeUserAttribute_AuthenticationTimeoutResponseStatusCode {
            get {
                int res;
                if (int.TryParse(System.Configuration.ConfigurationManager.AppSettings["auth_AuthorizeUserAttribute_AuthenticationTimeoutResponseStatusCode"], out res))
                    return res;
                else
                    return 419;
            }
        }

        public static string AuthorizeUserAttribute_UnauthorizedGoToArea {
            get {
                string res = System.Configuration.ConfigurationManager.AppSettings["auth_AuthorizeUserAttribute_UnauthorizedGoToArea"];
                if (res == null) res = "_self";
                return res;
            }
        }
        public static string AuthorizeUserAttribute_UnauthorizedGoToController {
            get {
                string res = System.Configuration.ConfigurationManager.AppSettings["auth_AuthorizeUserAttribute_UnauthorizedGoToController"];
                if (string.IsNullOrEmpty(res)) res = "home";
                return res;
            }
        }
        public static string AuthorizeUserAttribute_UnauthorizedGoToAction {
            get {
                string res = System.Configuration.ConfigurationManager.AppSettings["auth_AuthorizeUserAttribute_UnauthorizedGoToAction"];
                if (string.IsNullOrEmpty(res)) res = "unauthorized";
                return res;
            }
        }
        public static int AuthorizeUserAttribute_UnauthorizedResponseStatusCode {
            get {
                int res;
                if (int.TryParse(System.Configuration.ConfigurationManager.AppSettings["auth_AuthorizeUserAttribute_UnauthorizedResponseStatusCode"], out res))
                    return res;
                else
                    return 403;
            }
        }
        #endregion
    }

    public enum AuthorizationMode
    {
        DB,
        Session
    }
    public enum PasswordEncrypt
    {
        None,
        MD5,
        Base64
    }
}