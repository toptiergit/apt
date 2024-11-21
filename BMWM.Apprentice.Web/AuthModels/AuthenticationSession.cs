namespace BMWM.Apprentice.Web.AuthModels
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    [Table("auth_AuthenticationSession")]
    public partial class AuthenticationSession
    {
        public AuthenticationSession()
        {
        }

        [Key]
        [StringLength(32)]
        public string Id { get; set; }

        [Required]
        [StringLength(30)]
        public string UserId { get; set; }
        [ForeignKey("UserId")]
        public User User { get; set; }

        [StringLength(100)]
        public string UserDisplayName { get; set; }

        [StringLength(15)]
        public string MachineName { get; set; }

        [StringLength(15)]
        public string IP { get; set; }

        public DateTime CreatedOn { get; set; }

        public DateTime? LastAccessedOn { get; set; }

        public DateTime ExpireOn { get; set; }

    }
}
