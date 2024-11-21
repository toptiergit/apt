namespace BMW.ClassLibrary.Models
{
    using System;

    [Serializable]
    public partial class InventoryCustom : BaseEntity
    {
        public string MenuId { get; set; }
        public string MenuName { get; set; }
        public string MenuItemCodeKey { get; set; }
        public string MenuLink { get; set; }
        public string MenuTarget { get; set; }
    }
}
