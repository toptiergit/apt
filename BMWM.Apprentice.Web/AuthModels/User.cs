namespace BMWM.Apprentice.Web.AuthModels
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    [Table("auth_User")]
    public partial class User
    {
        public User()
        {
            UserItems = new HashSet<UserItem>();
            UserRoles = new HashSet<UserRole>();
        }

        [StringLength(30)]
        public string Id { get; set; }

        [StringLength(255)]
        public string Password { get; set; }

        [StringLength(100)]
        public string LDAPUsername { get; set; }

        public UserAuthenticateBy AuthenticateBy { get; set; }

        [StringLength(100)]
        public string DisplayName { get; set; }

        [StringLength(100)]
        public string DisplayName2 { get; set; }

        [StringLength(50)]
        public string Email { get; set; }

        [StringLength(100)]
        public string Department { get; set; }

        [StringLength(25)]
        public string Level { get; set; }
        [StringLength(500)]
        public string RedirectPage { get; set; }

        public DateTime? ExpireOn { get; set; }

        public bool IsActive { get; set; }

        public DateTime? LastLogonOn { get; set; }

        [StringLength(15)]
        public string LastLogonMachineName { get; set; }

        [StringLength(15)]
        public string LastLogonIP { get; set; }

        public DateTime CreatedOn { get; set; }

        //[Required]
        [StringLength(30)]
        public string CreatedUserId { get; set; }
        //[ForeignKey("CreatedUserId")]
        //public User CreatedUser { get; set; }

        public DateTime UpdatedOn { get; set; }

        //[Required]
        [StringLength(30)]
        public string UpdatedUserId { get; set; }
        //[ForeignKey("UpdatedUserId")]
        //public User UpdatedUser { get; set; }


        [StringLength(500)]
        public string CFStr1 { get; set; }

        [StringLength(500)]
        public string CFStr2 { get; set; }

        [StringLength(500)]
        public string CFStr3 { get; set; }

        [StringLength(500)]
        public string CFStr4 { get; set; }

        [StringLength(500)]
        public string CFStr5 { get; set; }

        public int? CFInt1 { get; set; }

        public int? CFInt2 { get; set; }

        public int? CFInt3 { get; set; }

        public int? CFInt4 { get; set; }

        public int? CFInt5 { get; set; }

        public decimal? CFDec1 { get; set; }

        public decimal? CFDec2 { get; set; }

        public decimal? CFDec3 { get; set; }

        public decimal? CFDec4 { get; set; }

        public decimal? CFDec5 { get; set; }

        public DateTime? CFDtm1 { get; set; }

        public DateTime? CFDtm2 { get; set; }

        public DateTime? CFDtm3 { get; set; }

        public DateTime? CFDtm4 { get; set; }

        public DateTime? CFDtm5 { get; set; }


        public DateTime? BlockOn { get; set; }
        public DateTime? PasswordExpireOn { get; set; }


        public ICollection<UserItem> UserItems { get; set; }
        public ICollection<UserRole> UserRoles { get; set; }
    }

    public enum UserAuthenticateBy
    {
        DB = 1,
        LDAP = 2,
        CUSTOM = 3
    }
}
