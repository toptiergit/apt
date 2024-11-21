namespace ApplicationForm.Models
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    public partial class auth_User
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public auth_User()
        {
            quiz_responses = new HashSet<Quiz_responses>();
        }

        [StringLength(100)]
        public string Id { get; set; }

        [StringLength(255)]
        public string Password { get; set; }

        [StringLength(100)]
        public string LDAPUsername { get; set; }

        public int AuthenticateBy { get; set; }

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

        [StringLength(30)]
        public string CreatedUserId { get; set; }

        public DateTime UpdatedOn { get; set; }

        [StringLength(30)]
        public string UpdatedUserId { get; set; }

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

        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<Quiz_responses> quiz_responses { get; set; }
    }
}
