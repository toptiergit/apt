namespace ApplicationForm.Models
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    public partial class Quiz_responses
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public Quiz_responses()
        {
            Question_responses = new HashSet<Question_responses>();
        }
        [Key]
        [DatabaseGenerat‌ed(DatabaseGeneratedOp‌tion.None)]
        public int Id { get; set; }

        public int? Quizid { get; set; }

        //[StringLength(250)]
        //public string Email { get; set; }

        [StringLength(500)]
        public string UserId { get; set; }

        public int? Correctanswers { get; set; }

        public int? Wronganswers { get; set; }

        public DateTime? Lastupdated { get; set; }

        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<Question_responses> Question_responses { get; set; }

        public virtual Quizdetail Quizdetail { get; set; }
        public virtual auth_User auth_User { get; set; }

    }
}
