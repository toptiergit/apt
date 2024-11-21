using BMWM.Apprentice.Web.AuthModels;
using Newtonsoft.Json;
using RestSharp;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace BMWM.Apprentice.Web.AuthService
{
    public static class AuthenticationService
    {
        public const string EventLogRefChangePassword = "#CHANGE_PWD";
        public const string EventLogRefLoginFail = "#LOGIN_FAIL";

        #region user
        public class LoginResult
        {
            public LoginResult()
            {
                this.Success = false;
                this.AuthenticationSessionId = null;
                this.Failure = null;
            }

            public bool Success { get; set; }
            public string AuthenticationSessionId { get; set; }
            public LoginResultFailure? Failure { get; set; }

            public enum LoginResultFailure
            {
                InvalidUserIdOrPassword,
                AccountInactive,
                AccountExpired,
                AccountBlocked,
                PasswordExpired
            }
        }

        // actualy this method use after IWA verification passed
        public static LoginResult UserBlinkLogin(string userId, string machineName, string ipAddress, bool killExistingAuthSession)
        {
            return UserBlinkLogin(userId, machineName, ipAddress, killExistingAuthSession, false);
        }
        public static LoginResult UserBlinkLogin(string userId, string machineName, string ipAddress, bool killExistingAuthSession, bool allowNotExistingUser)
        {
            var ret = new LoginResult();
            var now = DateTime.Now;
            using (var db = new DBContext.AuthContext())
            {
                var user = db.Users.SingleOrDefault(e => e.Id == userId);
                var loginPolicy = AppSettings.LoginPolicy;

                if (user == null && !allowNotExistingUser)
                {
                    ret.Success = false;
                    ret.Failure = LoginResult.LoginResultFailure.InvalidUserIdOrPassword;
                }
                else if (user != null && !user.IsActive)
                {
                    ret.Success = false;
                    ret.Failure = LoginResult.LoginResultFailure.AccountInactive;
                }
                else if (user != null && user.ExpireOn.HasValue && user.ExpireOn.Value <= now)
                {
                    ret.Success = false;
                    ret.Failure = LoginResult.LoginResultFailure.AccountExpired;
                }
                else if (user != null && loginPolicy.FailBlock.HasValue && user.BlockOn.HasValue && (loginPolicy.FailBlock.Value.BlockSec == null || user.BlockOn.Value.AddSeconds(loginPolicy.FailBlock.Value.BlockSec.Value) >= now))
                {
                    ret.Success = false;
                    ret.Failure = LoginResult.LoginResultFailure.AccountBlocked;
                }
                else
                    ret.Success = true;


                ret.AuthenticationSessionId = PerformLogin(ret.Success, userId, user, machineName, ipAddress, killExistingAuthSession, loginPolicy, db, now);
            }

            if (ret.Success) //aditional method to delete expired session if login success
                DeleteExpiredAuthenticationSession();

            return ret;
        }

        public static LoginResult UserLogin(string userId, string password, string machineName, string ipAddress, bool killExistingAuthSession, bool acceptExpiredPassword)
        {
            var ret = new LoginResult();
            var now = DateTime.Now;
            using (var db = new DBContext.AuthContext())
            {
                var user = db.Users.SingleOrDefault(e => e.Id == userId);

                AuthModels.UserAuthenticateBy? authBy;
                if (user != null)
                {
                    authBy = user.AuthenticateBy;
                    userId = user.Id; // correct user id case
                }
                else if (AppSettings.AllowNotExistsUserLoginViaLDAP)
                    authBy = AuthModels.UserAuthenticateBy.LDAP;
                else
                    authBy = null;


                var loginPolicy = AppSettings.LoginPolicy;
                if (authBy.HasValue == false)
                {
                    ret.Success = false;
                    ret.Failure = LoginResult.LoginResultFailure.InvalidUserIdOrPassword;
                }
                else if (authBy.Value == AuthModels.UserAuthenticateBy.DB) // login by db password
                {
                    try
                    {
                        if (password != ManagerService.DecryptPassword(user.Password))
                        {
                            ret.Success = false;
                            ret.Failure = LoginResult.LoginResultFailure.InvalidUserIdOrPassword;
                        }
                        else if (!user.IsActive)
                        {
                            ret.Success = false;
                            ret.Failure = LoginResult.LoginResultFailure.AccountInactive;
                        }
                        else if (user.ExpireOn.HasValue && user.ExpireOn.Value <= now)
                        {
                            ret.Success = false;
                            ret.Failure = LoginResult.LoginResultFailure.AccountExpired;
                        }
                        else if (loginPolicy.FailBlock.HasValue && user.BlockOn.HasValue && (loginPolicy.FailBlock.Value.BlockSec == null || user.BlockOn.Value.AddSeconds(loginPolicy.FailBlock.Value.BlockSec.Value) >= now))
                        {
                            ret.Success = false;
                            ret.Failure = LoginResult.LoginResultFailure.AccountBlocked;
                        }
                        else if (!acceptExpiredPassword && user.PasswordExpireOn.HasValue && user.PasswordExpireOn.Value <= now)
                        {
                            ret.Success = false;
                            ret.Failure = LoginResult.LoginResultFailure.PasswordExpired;
                        }
                        else
                            ret.Success = true;
                    }
                    catch (Exception)
                    {
                        //login fail if password decrypt fail 
                        ret.Success = false;
                        ret.Failure = LoginResult.LoginResultFailure.InvalidUserIdOrPassword;
                    }
                }
                else if (authBy.Value == AuthModels.UserAuthenticateBy.LDAP) // login by ldap
                {
                    if (LDAPAuthenticate((user != null ? (!string.IsNullOrEmpty(user.LDAPUsername) ? user.LDAPUsername : userId) : userId), password) == false)
                    {
                        ret.Success = false;
                        ret.Failure = LoginResult.LoginResultFailure.InvalidUserIdOrPassword;
                    }
                    else if (user != null && !user.IsActive)
                    {
                        ret.Success = false;
                        ret.Failure = LoginResult.LoginResultFailure.AccountInactive;
                    }
                    else if (user != null && user.ExpireOn.HasValue && user.ExpireOn.Value <= now)
                    {
                        ret.Success = false;
                        ret.Failure = LoginResult.LoginResultFailure.AccountExpired;
                    }
                    // Phirachai said no need to control let LDAP to do the job
                    //else if (user != null && loginPolicy.FailBlock.HasValue && user.BlockOn.HasValue && (loginPolicy.FailBlock.Value.BlockSec == null || user.BlockOn.Value.AddSeconds(loginPolicy.FailBlock.Value.BlockSec.Value) >= now))
                    //{
                    //    ret.Success = false;
                    //    ret.Failure = LoginResult.LoginResultFailure.AccountBlocked;
                    //}
                    else
                        ret.Success = true;
                }
                else if (authBy.Value == AuthModels.UserAuthenticateBy.CUSTOM) // login by custom
                {
                    ret.Success = true;
                }

                ret.AuthenticationSessionId = PerformLogin(ret.Success, userId, user, machineName, ipAddress, killExistingAuthSession, loginPolicy, db, now);
            }

            if (ret.Success) //aditional method to delete expired session if login success
                DeleteExpiredAuthenticationSession();

            return ret;
        }
        private static string PerformLogin(bool success, string userId, AuthModels.User user, string machineName, string ipAddress, bool killExistingAuthSession, LoginPolicy loginPolicy, DBContext.AuthContext db, DateTime refDateTime)
        {
            string authSid = null;
            if (success) // auth pass
            {
                if (killExistingAuthSession) //delete existing auth session for this user
                    foreach (var existSession in db.AuthenticationSessions.Where(e => e.UserId == userId))
                        db.AuthenticationSessions.Remove(existSession);

                //insert auth session
                machineName = ((machineName?.Length ?? 0) > 15 ? machineName.Substring(0, 15) : machineName);
                ipAddress = ((ipAddress?.Length ?? 0) > 15 ? ipAddress.Substring(0, 15) : ipAddress);
                var session = new AuthModels.AuthenticationSession()
                {
                    Id = Guid.NewGuid().ToString("N"),
                    UserId = userId,
                    UserDisplayName = user?.DisplayName,
                    MachineName = machineName,
                    IP = ipAddress,
                    CreatedOn = refDateTime,
                    LastAccessedOn = refDateTime,
                    ExpireOn = refDateTime.AddMinutes(AppSettings.AuthenticationSessionLifetime)
                };
                db.AuthenticationSessions.Add(session);

                if (user != null) //update last logon info for this user
                {
                    user.LastLogonOn = refDateTime;
                    user.LastLogonMachineName = machineName;
                    user.LastLogonIP = ipAddress;
                    user.BlockOn = null; // clear block on
                }

                // insert event log, login success
                ManagerService.AddEventLog(AuthModels.EventLog.EventLogCategory.User, userId, "Login Success", $"Machine Name: {machineName}, IP Address: {ipAddress}", userId, db);
                db.SaveChanges();

                authSid = session.Id;
            }
            else // auth fail
            {
                // insert event log, login fail
                ManagerService.AddEventLog(AuthModels.EventLog.EventLogCategory.User, userId, "Login Fail", $"Machine Name: {machineName}, IP Address: {ipAddress}", null, EventLogRefLoginFail, null, db);
                db.SaveChanges();

                // check if login fail need to block
                if (user != null && user.AuthenticateBy != AuthModels.UserAuthenticateBy.LDAP && !user.BlockOn.HasValue && loginPolicy.CheckFailBlock(userId, db, refDateTime))
                {
                    user.BlockOn = refDateTime;
                    ManagerService.AddEventLog(AuthModels.EventLog.EventLogCategory.User, userId, "Block", "Block by login policy.", null, db);
                    db.SaveChanges();
                }
            }

            return authSid;
        }

        [Obsolete("This method is obsolete. Call UserLogin in another overloading method instead.", false)]
        public static string UserLogin(string userId, string password, string machineName, string ipAddress, bool killExistingAuthSession = false)
        {
            var res = UserLogin(userId, password, machineName, ipAddress, killExistingAuthSession, true);
            return res.AuthenticationSessionId;
        }

        private static bool LDAPAuthenticate(string user, string pass)
        {
            return false;

            //System.DirectoryServices.DirectoryEntry de = new System.DirectoryServices.DirectoryEntry(AppSettings.LDAPPath, user, pass, System.DirectoryServices.AuthenticationTypes.Secure);
            //try
            //{
            //    //run a search using those credentials.  
            //    //If it returns anything, then you're authenticated
            //    System.DirectoryServices.DirectorySearcher ds = new System.DirectoryServices.DirectorySearcher(de);
            //    ds.FindOne();
            //    return true;
            //}
            //catch
            //{
            //    //otherwise, it will crash out so return false
            //    return false;
            //}
        }
        public static bool ChangePassword(string userId, string oldPassword, string newPassword)
        {
            List<string> invalidRules;
            return ChangePassword(userId, oldPassword, newPassword, out invalidRules);
        }
        public static bool ChangePassword(string userId, string oldPassword, string newPassword, out List<string> invalidRules)
        {
            if (string.IsNullOrEmpty(newPassword))
                throw new ArgumentNullException(nameof(newPassword));

            var now = DateTime.Now;
            using (var db = new DBContext.AuthContext())
            {
                var user = db.Users.Single(e => e.Id == userId);
                if (oldPassword == ManagerService.DecryptPassword(user.Password) && oldPassword != newPassword)
                {
                    // validate pwd role
                    var stPwdRoles = AppSettings.StrongPasswordRules;
                    if (stPwdRoles.Validate(newPassword, user.Id, db, out invalidRules))
                    {
                        user.Password = ManagerService.EncryptPassword(newPassword);
                        if (AppSettings.PasswordAge.HasValue)
                            user.PasswordExpireOn = now.Date.AddDays(AppSettings.PasswordAge.Value);
                        else
                            user.PasswordExpireOn = null;

                        // insert event log, change pwd success
                        ManagerService.AddEventLog(AuthModels.EventLog.EventLogCategory.User, user.Id, "Change Password", null, user.Id, EventLogRefChangePassword, oldPassword, db);

                        db.SaveChanges();
                        return true;
                    }
                }
                else
                    invalidRules = new List<string>();
            }
            return false;
        }

        public static AuthModels.User GetUserInfo(string userId)
        {
            return ManagerService.GetUser(userId);
        }
        public static List<AuthModels.Item> GetUserAuthorizedItems(string userId)
        {
            using (var db = new DBContext.AuthContext())
            {
                var l1 = (from ui in db.UserItems
                          join i in db.Items on ui.ItemCode equals i.Code
                          where ui.UserId.ToUpper() == userId.ToUpper()
                          select i).ToList();
                var l2 = (from ur in db.UserRoles
                          join r in db.Roles on ur.RoleCode equals r.Code
                          join ri in db.RoleItems on r.Code equals ri.RoleCode
                          join i in db.Items on ri.ItemCode equals i.Code
                          where ur.UserId.ToUpper() == userId.ToUpper()
                          select i).ToList();
                foreach (var l in l2)
                    if (!l1.Any(e => e.Code == l.Code))
                        l1.Add(l);

                return l1;
            }
        }
        public static List<AuthModels.Role> GetUserAuthorizedRoles(string userId)
        {
            using (var db = new DBContext.AuthContext())
            {
                return (from ur in db.UserRoles
                        join r in db.Roles on ur.RoleCode equals r.Code
                        where ur.UserId.ToUpper() == userId.ToUpper()
                        select r).ToList();
            }
        }
        public static bool IsUserAuthorizedItem(string userId, string itemCode)
        {
            if (string.IsNullOrEmpty(itemCode)) return true;
            using (var db = new DBContext.AuthContext())
            {
                bool auth = db.UserItems.Any(e => e.UserId == userId && e.ItemCode == itemCode);
                if (auth)
                    return auth;
                else
                {
                    return (from ur in db.UserRoles
                            join r in db.Roles on ur.RoleCode equals r.Code
                            join ri in db.RoleItems on r.Code equals ri.RoleCode
                            where ur.UserId == userId && ri.ItemCode == itemCode
                            select ri.ItemCode).Any();
                }
            }
        }
        public static bool IsUserAuthorizedRole(string userId, string roleCode)
        {
            if (string.IsNullOrEmpty(roleCode)) return true;
            using (var db = new DBContext.AuthContext())
            {
                return db.UserRoles.Any(e => e.UserId == userId && e.RoleCode == roleCode);
            }
        }
        #endregion

        #region authentication session
        public static void DeleteExpiredAuthenticationSession()
        {
            using (var db = new DBContext.AuthContext())
            {
                var now = DateTime.Now;
                foreach (var session in db.AuthenticationSessions.Where(e => e.ExpireOn <= now))
                    db.AuthenticationSessions.Remove(session);
                db.SaveChanges();
            }
        }
        public static void DeleteAuthenticationSession(string authSid)
        {
            using (var db = new DBContext.AuthContext())
            {
                var obj = db.AuthenticationSessions.Find(authSid);
                if (obj != null)
                {
                    db.AuthenticationSessions.Remove(obj);
                    db.SaveChanges();
                }
            }
        }
        public static AuthModels.AuthenticationSession GetAuthenticationSession(string authSid, bool updateTimestampInfo = true)
        {
            if (AuthenticationSessionExists(authSid, updateTimestampInfo))
            {
                using (var db = new DBContext.AuthContext())
                {
                    return db.AuthenticationSessions.Find(authSid);
                }
            }
            else
            {
                return null;
            }
        }
        public static string SpireAuthenticationSession(string authSid, out string userId)
        {
            if (AuthenticationSessionExists(authSid, false))
            {
                AuthModels.AuthenticationSession master;
                using (var db = new DBContext.AuthContext())
                    master = db.AuthenticationSessions.Find(authSid);

                var user = GetUserInfo(master.UserId);
                userId = user.Id;
                return UserLogin(user.Id, user.Password, master.MachineName, master.IP, false, true).AuthenticationSessionId;
            }
            else
            {
                userId = null;
                return null;
            }
        }
        public static bool AuthenticationSessionExists(string authSid, bool updateTimestampInfo = true)
        {
            bool res = false;
            using (var db = new DBContext.AuthContext())
            {
                var obj = db.AuthenticationSessions.Find(authSid);
                if (obj != null)
                {
                    var now = DateTime.Now;
                    if (obj.ExpireOn <= now) //already expired
                    {
                        db.AuthenticationSessions.Remove(obj);
                    }
                    else
                    {
                        res = true;
                        if (updateTimestampInfo)
                        {
                            obj.LastAccessedOn = now;
                            obj.ExpireOn = now.AddMinutes(AppSettings.AuthenticationSessionLifetime);
                        }
                    }
                    db.SaveChanges();
                }
            }
            return res;
        }
        public static bool UserAuthenticationSessionExists(string userId)
        {
            using (var db = new DBContext.AuthContext())
            {
                return db.AuthenticationSessions.Any(e => e.UserId == userId && e.ExpireOn > DateTime.Now);
            }
        }
        #endregion


        #region security policy
        public static bool StrongPasswordValidation(string password, string userId, out List<string> invalidRules)
        {
            return AppSettings.StrongPasswordRules.Validate(password, userId, out invalidRules);
        }
        public static bool IsUserPasswordExpired(string userId)
        {
            var d = GetUserPasswordExpireInDays(userId);
            return d != null && (d.Value <= 0);
        }
        public static int? GetUserPasswordExpireInDays(string userId)
        {
            AuthModels.UserAuthenticateBy authBy;
            DateTime? pwdExp;
            using (var db = new DBContext.AuthContext())
            {
                var user = db.Users.Where(e => e.Id == userId).Select(e => new { e.AuthenticateBy, e.PasswordExpireOn }).Single();
                authBy = user.AuthenticateBy;
                pwdExp = user.PasswordExpireOn;
            }
            if (authBy == AuthModels.UserAuthenticateBy.DB)
                return GetPasswordExpireInDays(pwdExp);
            else
                return null;
        }
        internal static int? GetPasswordExpireInDays(DateTime? pwdExp)
        {
            if (pwdExp == null)
                return null;
            else
                return (pwdExp.Value.Date - DateTime.Now.Date).Days;
        }


        public class StrongPasswordRules
        {
            public struct PasswordLength
            {
                public int Minimum;
                public int Maximum;
            }
            public struct PasswordRequireCase
            {
                public char[] Cases;
                public int MeetAtLeast;
            }

            public PasswordLength? Length { get; set; }
            public PasswordRequireCase? RequireCase { get; set; }
            public bool? StartAndEndWithAlphabet { get; set; }
            public int? MinimumVarietyOfChar { get; set; }
            public bool? AllowSpace { get; set; }
            public bool? AllowUserIdAsPart { get; set; }
            public int? NotBeTopRecentPasssword { get; set; }


            public bool Validate(string password, string userId, out List<string> invalidRules)
            {
                using (var db = new DBContext.AuthContext())
                {
                    return Validate(password, userId, db, out invalidRules);
                }
            }
            public bool Validate(string password, string userId, DBContext.AuthContext db, out List<string> invalidRules)
            {
                var recentPwd = db.EventLogs.Where(e => e.Category == AuthModels.EventLog.EventLogCategory.User
                                                    && e.RefId == userId
                                                    && e.Ref1 == EventLogRefChangePassword)
                                            .OrderByDescending(e => e.CreatedOn)
                                            .Select(e => e.Ref2)
                                            .ToList();
                return Validate(password, userId, recentPwd, out invalidRules);
            }
            public bool Validate(string password, string userId, List<string> recentPwd, out List<string> invalidRules)
            {
                if (password == null)
                    throw new ArgumentNullException(nameof(password));

                invalidRules = new List<string>();

                // length
                if (this.Length.HasValue)
                    if (password.Length < this.Length.Value.Minimum || password.Length > this.Length.Value.Maximum)
                        invalidRules.Add($"Contain from {this.Length.Value.Minimum} to {this.Length.Value.Maximum} characters");

                // require case
                if (this.RequireCase.HasValue)
                {
                    var cs = new List<string>();
                    var meet = 0;
                    foreach (var c in this.RequireCase.Value.Cases)
                    {
                        switch (c)
                        {
                            case 'U':
                                cs.Add("uppercase alphabetic");
                                if (password.Any(e => char.IsUpper(e)))
                                    meet++;
                                break;
                            case 'L':
                                cs.Add("lowercase alphabetic");
                                if (password.Any(e => char.IsLower(e)))
                                    meet++;
                                break;
                            case 'N':
                                cs.Add("numeric");
                                if (password.Any(e => char.IsDigit(e)))
                                    meet++;
                                break;
                            case 'S':
                                cs.Add("special character");
                                if (password.Any(e => !char.IsLetterOrDigit(e)))
                                    meet++;
                                break;
                        }
                    }

                    if (meet < this.RequireCase.Value.MeetAtLeast)
                    {
                        string h;
                        if (this.RequireCase.Value.MeetAtLeast < cs.Count)
                            h = $"Contain at least {this.RequireCase.Value.MeetAtLeast} of the following {cs.Count} characters: ";
                        else
                            h = "Contain all of the following characters: ";

                        invalidRules.Add(h + string.Join(", ", cs));
                    }
                }

                // begin and end with alphabet
                if (this.StartAndEndWithAlphabet.HasValue)
                    if (this.StartAndEndWithAlphabet.Value
                        && (string.IsNullOrEmpty(password) || !char.IsLetter(password[0]) || !char.IsLetter(password[password.Length - 1])))
                        invalidRules.Add($"Begin and end with an alphabetic character");

                // minimum variety of char
                if (this.MinimumVarietyOfChar.HasValue)
                    if (password.Distinct().Count() < this.MinimumVarietyOfChar.Value)
                        invalidRules.Add($"Contain at least {this.MinimumVarietyOfChar.Value} different character");

                // allow space
                if (this.AllowSpace.HasValue)
                    if (this.AllowSpace.Value == false && password.Any(e => e == ' '))
                        invalidRules.Add($"Not contain spaces");

                // allow userID as part
                if (this.AllowUserIdAsPart.HasValue)
                    if (this.AllowUserIdAsPart.Value == false && password.Contains(userId))
                        invalidRules.Add($"Not contain user ID");

                // not be recent pwd
                if (this.NotBeTopRecentPasssword.HasValue)
                    if (recentPwd != null && recentPwd.Take(this.NotBeTopRecentPasssword.Value).Contains(password))
                        invalidRules.Add($"Not be {this.NotBeTopRecentPasssword.Value} recently used password");

                return !invalidRules.Any();
            }
        }
        public class LoginPolicy
        {
            public struct LoginFailBlock
            {
                public int Times;
                public int WithinSec;
                public int? BlockSec;
            }

            public LoginFailBlock? FailBlock { get; set; }

            public bool CheckFailBlock(string userId, DBContext.AuthContext db, DateTime refNow)
            {
                if (this.FailBlock == null)
                    return false;

                var times = this.FailBlock.Value.Times;
                var fromDt = refNow.AddSeconds(this.FailBlock.Value.WithinSec * -1);
                var c = db.EventLogs.Where(e => e.Category == AuthModels.EventLog.EventLogCategory.User
                                   && e.RefId == userId
                                   && e.Ref1 == EventLogRefLoginFail
                                   && e.CreatedOn >= fromDt)
                                   .Count();
                return c >= times;
            }
        }
        #endregion security policy

        public static CustomLoginResult GetCustomLoginResult(string url, string user, string password)
        {
            var client = new RestClient();
            client.BaseUrl = new Uri(url);

            var request = new RestRequest();
            request.Method = Method.POST;
            request.AddHeader("Accept", "application/json");
            request.AddParameter("user", user);
            request.AddParameter("password", password);

            var response = client.Execute(request);
            if (response.StatusCode.ToString() == "NotFound")
                return null;

            var content = response.Content; // raw content as string 

            CustomLoginResult customLoginResult = new CustomLoginResult();
            try
            {
                customLoginResult = JsonConvert.DeserializeObject<CustomLoginResult>(content);
                return customLoginResult;
            }
            catch (Exception)
            {
                return null;
            }
        }
    }
}