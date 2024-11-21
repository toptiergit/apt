namespace BMWM.Apprentice.Web.AuthModels
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    [Table("auth_Item")]
    public partial class Item
    {
        public Item()
        {
            RoleItems = new HashSet<RoleItem>();
        }

        [Key]
        [StringLength(100)]
        public string Code { get; set; }

        [Required]
        [StringLength(100)]
        public string Name { get; set; }

        [StringLength(255)]
        public string Description { get; set; }

        public bool IsActive { get; set; }

        public ICollection<RoleItem> RoleItems { get; set; }

        public string ModuleName { get; set; }
    }
}
