namespace BMWM.Apprentice.Web.AuthModels
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    [Table("auth_UserItem")]
    public partial class UserItem
    {
        [Key]
        [Column(Order = 0)]
        [StringLength(30)]
        public string UserId { get; set; }
        [ForeignKey("UserId")]
        public User User { get; set; }

        [Key]
        [Column(Order = 1)]
        [StringLength(100)]
        public string ItemCode { get; set; }
        [ForeignKey("ItemCode")]
        public Item Item { get; set; }

        public DateTime CreatedOn { get; set; }

        //[Required]
        [StringLength(30)]
        public string CreatedUserId { get; set; }
        [ForeignKey("CreatedUserId")]
        public User CreatedUser { get; set; }
    }
}
