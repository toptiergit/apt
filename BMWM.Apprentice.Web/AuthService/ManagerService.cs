using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Data.Entity;

namespace BMWM.Apprentice.Web.AuthService
{
    public class ManagerService
    {
        public static bool CreateUser(string userId, string password, string ldapUsername, AuthModels.UserAuthenticateBy authenticateBy, string displayName, string displayName2, string email, string department, string level, string redirectPage, DateTime? expireOn, string actorUserId)
        {
            return CreateUser(userId, password, ldapUsername, authenticateBy, displayName, displayName2, email, department, level, redirectPage, expireOn, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, actorUserId);
        }
        public static bool CreateUser(string userId, string password, string ldapUsername, AuthModels.UserAuthenticateBy authenticateBy, string displayName, string displayName2, string email, string department, string level, string redirectPage, DateTime? expireOn,
                                        string cfStr1, string cfStr2, string cfStr3, string cfStr4, string cfStr5,
                                        int? cfInt1, int? cfInt2, int? cfInt3, int? cfInt4, int? cfInt5,
                                        decimal? cfDec1, decimal? cfDec2, decimal? cfDec3, decimal? cfDec4, decimal? cfDec5,
                                        DateTime? cfDtm1, DateTime? cfDtm2, DateTime? cfDtm3, DateTime? cfDtm4, DateTime? cfDtm5,
                                        string actorUserId)
        {
            var obj = new AuthModels.User()
            {
                Id = userId,
                Password = password,
                LDAPUsername = ldapUsername,
                AuthenticateBy = authenticateBy,
                DisplayName = displayName,
                DisplayName2 = displayName2,
                Email = email,
                Department = department,
                Level = level,
                RedirectPage = redirectPage,
                ExpireOn = expireOn,
                CFStr1 = cfStr1,
                CFStr2 = cfStr2,
                CFStr3 = cfStr3,
                CFStr4 = cfStr4,
                CFStr5 = cfStr5,
                CFInt1 = cfInt1,
                CFInt2 = cfInt2,
                CFInt3 = cfInt3,
                CFInt4 = cfInt4,
                CFInt5 = cfInt5,
                CFDec1 = cfDec1,
                CFDec2 = cfDec2,
                CFDec3 = cfDec3,
                CFDec4 = cfDec4,
                CFDec5 = cfDec5,
                CFDtm1 = cfDtm1,
                CFDtm2 = cfDtm2,
                CFDtm3 = cfDtm3,
                CFDtm4 = cfDtm4,
                CFDtm5 = cfDtm5
            };
            return CreateUser(obj, actorUserId);
        }
        public static bool CreateUser(AuthModels.User user, string actorUserId)
        {
            if (user.AuthenticateBy == AuthModels.UserAuthenticateBy.DB && string.IsNullOrEmpty(user.Password))
                throw new Exception("A password is require for user authentication mode DB.");

            using (var db = new DBContext.AuthContext())
            {
                //check for id exists
                if (db.Users.Any(e => e.Id == user.Id)) return false;

                var now = DateTime.Now;
                user.Password = EncryptPassword(user.Password);
                if (AppSettings.PasswordAge.HasValue)
                    user.PasswordExpireOn = now.Date.AddDays(AppSettings.PasswordAge.Value);
                user.IsActive = true;
                user.LastLogonOn = null;
                user.LastLogonMachineName = null;
                user.LastLogonIP = null;
                user.CreatedOn = now;
                user.CreatedUserId = actorUserId;
                user.UpdatedOn = now;
                user.UpdatedUserId = actorUserId;
                db.Users.Add(user);
                db.SaveChanges();
                return true;
            }
        }

        public static void UpdateUser(string userId, string password, string ldapUsername, AuthModels.UserAuthenticateBy authenticateBy, string displayName, string displayName2, string email, string department, string level, string redirectPage, DateTime? expireOn, bool isActive, string actorUserId)
        {
            UpdateUser(userId, password, ldapUsername, authenticateBy, displayName, displayName2, email, department, level, redirectPage, expireOn, isActive, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, actorUserId);
        }
        public static void UpdateUser(string userId, string password, string ldapUsername, AuthModels.UserAuthenticateBy authenticateBy, string displayName, string displayName2, string email, string department, string level, string redirectPage, DateTime? expireOn, bool isActive,
                                        string cfStr1, string cfStr2, string cfStr3, string cfStr4, string cfStr5,
                                        int? cfInt1, int? cfInt2, int? cfInt3, int? cfInt4, int? cfInt5,
                                        decimal? cfDec1, decimal? cfDec2, decimal? cfDec3, decimal? cfDec4, decimal? cfDec5,
                                        DateTime? cfDtm1, DateTime? cfDtm2, DateTime? cfDtm3, DateTime? cfDtm4, DateTime? cfDtm5,
                                        string actorUserId)
        {
            var obj = new AuthModels.User()
            {
                Id = userId,
                Password = password,
                LDAPUsername = ldapUsername,
                AuthenticateBy = authenticateBy,
                DisplayName = displayName,
                DisplayName2 = displayName2,
                Email = email,
                Department = department,
                Level = level,
                RedirectPage = redirectPage,
                ExpireOn = expireOn,
                IsActive = isActive,
                UpdatedUserId = actorUserId,
                CFStr1 = cfStr1,
                CFStr2 = cfStr2,
                CFStr3 = cfStr3,
                CFStr4 = cfStr4,
                CFStr5 = cfStr5,
                CFInt1 = cfInt1,
                CFInt2 = cfInt2,
                CFInt3 = cfInt3,
                CFInt4 = cfInt4,
                CFInt5 = cfInt5,
                CFDec1 = cfDec1,
                CFDec2 = cfDec2,
                CFDec3 = cfDec3,
                CFDec4 = cfDec4,
                CFDec5 = cfDec5,
                CFDtm1 = cfDtm1,
                CFDtm2 = cfDtm2,
                CFDtm3 = cfDtm3,
                CFDtm4 = cfDtm4,
                CFDtm5 = cfDtm5
            };
            UpdateUser(obj, actorUserId);
        }
        public static void UpdateUser(AuthModels.User user, string actorUserId)
        {
            using (var db = new DBContext.AuthContext())
            {
                var t = db.Users.Find(user.Id);
                var now = DateTime.Now;

                if (user.Password != null) // check for update password if has value
                {
                    var enPwd = EncryptPassword(user.Password);
                    if (t.Password != enPwd)
                    {
                        t.Password = enPwd;
                        if (AppSettings.PasswordAge.HasValue)
                            user.PasswordExpireOn = now.Date.AddDays(AppSettings.PasswordAge.Value);
                        else
                            user.PasswordExpireOn = null;
                    }
                }

                if (user.AuthenticateBy == AuthModels.UserAuthenticateBy.DB && string.IsNullOrEmpty(t.Password))
                    throw new Exception("A password is require for user authentication mode DB.");

                t.LDAPUsername = user.LDAPUsername;
                t.AuthenticateBy = user.AuthenticateBy;
                t.DisplayName = user.DisplayName;
                t.DisplayName2 = user.DisplayName2;
                t.Email = user.Email;
                t.Department = user.Department;
                t.Level = user.Level;
                t.RedirectPage = user.RedirectPage;
                t.ExpireOn = user.ExpireOn;
                t.IsActive = user.IsActive;
                t.UpdatedOn = now;
                t.UpdatedUserId = actorUserId;
                // update custom field
                t.CFStr1 = user.CFStr1;
                t.CFStr2 = user.CFStr2;
                t.CFStr3 = user.CFStr3;
                t.CFStr4 = user.CFStr4;
                t.CFStr5 = user.CFStr5;
                t.CFInt1 = user.CFInt1;
                t.CFInt2 = user.CFInt2;
                t.CFInt3 = user.CFInt3;
                t.CFInt4 = user.CFInt4;
                t.CFInt5 = user.CFInt5;
                t.CFDec1 = user.CFDec1;
                t.CFDec2 = user.CFDec2;
                t.CFDec3 = user.CFDec3;
                t.CFDec4 = user.CFDec4;
                t.CFDec5 = user.CFDec5;
                t.CFDtm1 = user.CFDtm1;
                t.CFDtm2 = user.CFDtm2;
                t.CFDtm3 = user.CFDtm3;
                t.CFDtm4 = user.CFDtm4;
                t.CFDtm5 = user.CFDtm5;
                db.SaveChanges();
            }
        }

        public static void DeleteUser(string userId, string actorUserId)
        {
            using (var db = new DBContext.AuthContext())
            {
                var obj = db.Users
                            .Include(e => e.UserRoles)
                            .Include(e => e.UserItems)
                            .Single(e => e.Id == userId);
                db.Users.Remove(obj);
                db.SaveChanges();
            }
        }
        public static void UpdateUserPassword(string userId, string password)
        {
            using (var db = new DBContext.AuthContext())
            {
                var user = db.Users.Find(userId);
                if (user != null)
                {
                    if (user.AuthenticateBy == AuthModels.UserAuthenticateBy.DB && string.IsNullOrEmpty(password))
                        throw new Exception("A password is require for user authentication mode DB.");

                    var enPwd = EncryptPassword(password);
                    if (user.Password != enPwd)
                    {
                        user.Password = enPwd;
                        if (AppSettings.PasswordAge.HasValue)
                            user.PasswordExpireOn = DateTime.Now.Date.AddDays(AppSettings.PasswordAge.Value);
                        else
                            user.PasswordExpireOn = null;
                        db.SaveChanges();
                    }
                }
            }
        }
        public static void SetUserActive(string userId)
        {
            SetUserIsActive(userId, true);
        }
        public static void SetUserInActive(string userId)
        {
            SetUserIsActive(userId, false);
        }
        private static void SetUserIsActive(string userId, bool isActive)
        {
            using (var db = new DBContext.AuthContext())
            {
                var obj = db.Users.Find(userId);
                if (obj != null)
                {
                    obj.IsActive = isActive;
                    db.SaveChanges();
                }
            }
        }
        public static void UnblockUser(string userId, string actorUserId)
        {
            using (var db = new DBContext.AuthContext())
            {
                var t = db.Users.Single(e => e.Id == userId);
                t.BlockOn = null;

                // add event log
                AddEventLog(AuthModels.EventLog.EventLogCategory.User, userId, "Unblock", null, actorUserId, db);

                db.SaveChanges();
            }
        }
        public static AuthModels.User GetUser(string userId)
        {
            using (var db = new DBContext.AuthContext())
            {
                var obj = db.Users.Find(userId);
                if (obj != null)
                {
                    obj.Password = DecryptPassword(obj.Password);
                }
                return obj;
            }
        }
        public static List<AuthModels.User> GetAllUsers()
        {
            using (var db = new DBContext.AuthContext())
            {
                var res = db.Users.ToList();
                foreach (var user in res)
                    user.Password = DecryptPassword(user.Password);
                return res;
            }
        }
        public static int CountUser(bool onlyActive = false)
        {
            using (var db = new DBContext.AuthContext())
            {
                var q = db.Users.AsQueryable();
                if (onlyActive)
                    q = q.Where(e => e.IsActive);
                return q.Count();
            }
        }

        public static List<AuthModels.Item> GetUserItems(string userId)
        {
            using (var db = new DBContext.AuthContext())
            {
                return (from ui in db.UserItems
                        join i in db.Items on ui.ItemCode equals i.Code
                        where ui.UserId == userId
                        select i).ToList();
            }
        }
        public static void UpdateUserItem(string userId, List<string> itemCodes, string actorUserId)
        {
            using (var db = new DBContext.AuthContext())
            {
                foreach (var userItem in db.UserItems.Where(e => e.UserId == userId)) //remove all first
                    db.UserItems.Remove(userItem);

                if (itemCodes != null) //insert back
                {
                    var now = DateTime.Now;
                    foreach (var itemCode in itemCodes)
                        db.UserItems.Add(new AuthModels.UserItem()
                        {
                            UserId = userId,
                            ItemCode = itemCode,
                            CreatedOn = now,
                            CreatedUserId = actorUserId
                        });
                }
                db.SaveChanges();
            }
        }

        public static List<AuthModels.Role> GetUserRoles(string userId)
        {
            using (var db = new DBContext.AuthContext())
            {
                return (from ur in db.UserRoles
                        join r in db.Roles on ur.RoleCode equals r.Code
                        where ur.UserId == userId
                        select r).ToList();
            }
        }
        public static void UpdateUserRole(string userId, List<string> roleCodes, string actorUserId)
        {
            using (var db = new DBContext.AuthContext())
            {
                foreach (var userRole in db.UserRoles.Where(e => e.UserId == userId)) //remove all first
                    db.UserRoles.Remove(userRole);

                if (roleCodes != null) //insert back
                {
                    var now = DateTime.Now;
                    foreach (var roleCode in roleCodes)
                        db.UserRoles.Add(new AuthModels.UserRole()
                        {
                            UserId = userId,
                            RoleCode = roleCode,
                            CreatedOn = now,
                            CreatedUserId = actorUserId
                        });
                }
                db.SaveChanges();
            }
        }

        public static List<AuthModels.Role> GetAllRoles()
        {
            using (var db = new DBContext.AuthContext())
            {
                return db.Roles.ToList();
            }
        }
        public static List<AuthModels.Role> GetAllRoles(string moduleName)
        {
            using (var db = new DBContext.AuthContext())
            {
                return db.Roles.Where(e => e.ModuleName == moduleName).ToList();
            }
        }
        public static List<AuthModels.Item> GetAllItems()
        {
            using (var db = new DBContext.AuthContext())
            {
                return db.Items.ToList();
            }
        }
        public static List<AuthModels.Item> GetAllItems(string moduleName)
        {
            using (var db = new DBContext.AuthContext())
            {
                return db.Items.Where(e => e.ModuleName == moduleName).ToList();
            }
        }

        #region password encryption
        public static string EncryptPassword(string password)
        {
            if (password != null)
            {
                switch (AppSettings.PasswordEncrypt)
                {
                    case PasswordEncrypt.MD5:
                        return Encryption.EncryptMD5(password, AppSettings.PasswordEncryptKey);
                    case PasswordEncrypt.Base64:
                        return Encryption.EncodeBase64(password);
                    default: //none
                        return password;
                }
            }
            else
            {
                return password;
            }
        }
        public static string DecryptPassword(string data)
        {
            if (data != null)
            {
                switch (AppSettings.PasswordEncrypt)
                {
                    case PasswordEncrypt.MD5:
                        return Encryption.DecryptMD5(data, AppSettings.PasswordEncryptKey);
                    case PasswordEncrypt.Base64:
                        return Encryption.DecodeBase64(data);
                    default: //none
                        return data;
                }
            }
            else
            {
                return data;
            }
        }
        #endregion



        #region event log
        internal static void AddEventLog(AuthModels.EventLog.EventLogCategory category, string refId, string _event, string detail, string actorUserId, DBContext.AuthContext db)
        {
            AddEventLog(category, refId, _event, detail, actorUserId, null, null, db);
        }
        internal static void AddEventLog(AuthModels.EventLog.EventLogCategory category, string refId, string _event, string detail, string actorUserId, string ref1, string ref2, DBContext.AuthContext db)
        {
            db.EventLogs.Add(new AuthModels.EventLog
            {
                Category = category,
                RefId = refId,
                Event = _event,
                Detail = detail,
                ActorUserId = actorUserId,
                CreatedOn = DateTime.Now,
                Ref1 = ref1,
                Ref2 = ref2
            });
        }
        internal static void AddEventLog(AuthModels.EventLog.EventLogCategory category, string refId, string _event, string detail, string actorUserId)
        {
            using (var db = new DBContext.AuthContext())
            {
                AddEventLog(category, refId, _event, detail, actorUserId, db);
                db.SaveChanges();
            }
        }
        internal static void AddEventLog(AuthModels.EventLog.EventLogCategory category, string refId, string _event, string detail, string actorUserId, string ref1, string ref2)
        {
            using (var db = new DBContext.AuthContext())
            {
                AddEventLog(category, refId, _event, detail, actorUserId, ref1, ref2, db);
                db.SaveChanges();
            }
        }

        public static List<AuthModels.EventLog> GetEventLogs(AuthModels.EventLog.EventLogCategory category, string refId)
        {
            using (var db = new DBContext.AuthContext())
            {
                return db.EventLogs.Where(e => e.Category == category && e.RefId == refId).OrderByDescending(e => e.CreatedOn).ToList();
            }
        }
        public static List<AuthModels.EventLog> GetEventLogs(AuthModels.EventLog.EventLogCategory category, string refId, int top)
        {
            using (var db = new DBContext.AuthContext())
            {
                return db.EventLogs.Where(e => e.Category == category && e.RefId == refId).OrderByDescending(e => e.CreatedOn).Take(top).ToList();
            }
        }
        #endregion event log
    }

}
