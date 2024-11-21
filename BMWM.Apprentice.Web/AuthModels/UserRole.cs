namespace BMWM.Apprentice.Web.AuthModels
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    [Table("auth_UserRole")]
    public partial class UserRole
    {
        [Key]
        [Column(Order = 0)]
        [StringLength(30)]
        public string UserId { get; set; }
        [ForeignKey("UserId")]
        public User User { get; set; }

        [Key]
        [Column(Order = 1)]
        [StringLength(50)]
        public string RoleCode { get; set; }
        [ForeignKey("RoleCode")]
        public Role Role { get; set; }

        public DateTime CreatedOn { get; set; }

        //[Required]
        [StringLength(30)]
        public string CreatedUserId { get; set; }
        [ForeignKey("CreatedUserId")]
        public User CreatedUser { get; set; }
    }
}
