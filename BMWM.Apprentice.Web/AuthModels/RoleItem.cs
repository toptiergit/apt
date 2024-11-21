namespace BMWM.Apprentice.Web.AuthModels
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    [Table("auth_RoleItem")]
    public partial class RoleItem
    {
        [Key]
        [Column(Order = 0)]
        [StringLength(50)]
        public string RoleCode { get; set; }
        [ForeignKey("RoleCode")]
        public Role Role { get; set; }

        [Key]
        [Column(Order = 1)]
        [StringLength(100)]
        public string ItemCode { get; set; }
        [ForeignKey("ItemCode")]
        public Item Item { get; set; }
    }
}
