namespace ApplicationForm.Models
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    public partial class Quizdetail
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public Quizdetail()
        {
            Quiz_questions = new HashSet<Quiz_questions>();
            Quiz_responses = new HashSet<Quiz_responses>();
        }
        [Key]
        [DatabaseGenerat‌ed(DatabaseGeneratedOp‌tion.None)]
        public int Id { get; set; }

        [StringLength(1000)]
        public string Name { get; set; }

        [StringLength(4000)]
        public string Description { get; set; }

        public int? QuizTypeId { get; set; }

        [StringLength(4000)]
        public string Completiondescription { get; set; }

        public DateTime? Startdate { get; set; }

        public DateTime? Enddate { get; set; }

        public string Termsandconditions { get; set; }

        public DateTime Lastupdated { get; set; }
        public bool IsActive { get; set; }

        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<Quiz_questions> Quiz_questions { get; set; }

        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<Quiz_responses> Quiz_responses { get; set; }

        public virtual QuizType QuizType { get; set; }
    }
}