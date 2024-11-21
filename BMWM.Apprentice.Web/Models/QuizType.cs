namespace ApplicationForm.Models
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    [Table("QuizType")]
    public partial class QuizType
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public QuizType()
        {
            Quizdetails = new HashSet<Quizdetail>();
        }

        public int Id { get; set; }

        [StringLength(500)]
        public string Name { get; set; }

        public DateTime? UpdatedOn { get; set; }

        [StringLength(30)]
        public string UpdateBy { get; set; }

        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<Quizdetail> Quizdetails { get; set; }
    }
}
