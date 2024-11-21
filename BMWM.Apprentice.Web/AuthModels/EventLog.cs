namespace BMWM.Apprentice.Web.AuthModels
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    [Table("auth_EventLog")]
    public partial class EventLog
    {
        [Key]
        public Int64 Id { get; set; }

        public EventLogCategory Category { get; set; }

        [StringLength(200)]
        public string RefId { get; set; }

        [StringLength(200)]
        public string Event { get; set; }

        public string Detail { get; set; }

        [StringLength(30)]
        public string ActorUserId { get; set; }

        public DateTime CreatedOn { get; set; }

        [StringLength(500)]
        public string Ref1 { get; set; }

        [StringLength(500)]
        public string Ref2 { get; set; }

        public enum EventLogCategory
        {
            None = 0,
            User = 1,
            Item = 2,
            Role = 3
        }
    }
}
