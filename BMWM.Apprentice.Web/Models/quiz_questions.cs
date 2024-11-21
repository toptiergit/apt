namespace ApplicationForm.Models
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    public partial class Quiz_questions
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public Quiz_questions()
        {
            Question_answer = new HashSet<Question_answer>();
            Question_options = new HashSet<Question_options>();
        }
        [Key]
        [DatabaseGenerat‌ed(DatabaseGeneratedOp‌tion.None)]
        public int Id { get; set; }

        public int Quizid { get; set; }

        public int? Questionorder { get; set; }

        [StringLength(50)]
        public string Type { get; set; }

        [StringLength(2000)]
        public string Title { get; set; }
        public string Image { get; set; }

        public DateTime Lastupdated { get; set; }

        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<Question_answer> Question_answer { get; set; }

        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<Question_options> Question_options { get; set; }

        public virtual Quizdetail Quizdetail { get; set; }
    }
}
