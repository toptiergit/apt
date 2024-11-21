namespace ApplicationForm.DBContext
{
    using System;
    using System.Data.Entity;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Linq;
    using ApplicationForm.Models;
    using System.ComponentModel;
 

    public partial class ApprenticeDB : DbContext
    {
        public ApprenticeDB()
            : base("name=ApprenticeDB")
        {
            //disable initializer
            Database.SetInitializer<ApprenticeDB>(null);
        }


        public virtual DbSet<Applicant> Applicants { get; set; }
        public virtual DbSet<Brethren> Brethrens { get; set; }
        public virtual DbSet<Children> Childrens { get; set; }
        public virtual DbSet<Disease> Diseases { get; set; }
        public virtual DbSet<Education> Educations { get; set; }
        public virtual DbSet<LanguageSkill> LanguageSkills { get; set; }
        public virtual DbSet<Spouse> Spouses { get; set; }
        public virtual DbSet<Training> Trainings { get; set; }
        public virtual DbSet<WorkExperience> WorkExperiences { get; set; }

        //Quiz
        public virtual DbSet<Question_answer> Question_answer { get; set; }
        public virtual DbSet<Question_options> Question_options { get; set; }
        public virtual DbSet<Question_responses> Question_responses { get; set; }
        public virtual DbSet<Quiz_questions> Quiz_questions { get; set; }
        public virtual DbSet<Quiz_responses> Quiz_responses { get; set; }
        public virtual DbSet<Quizdetail> Quizdetails { get; set; }
        public virtual DbSet<Question_useradmin> Question_useradmin { get; set; }
        public virtual DbSet<QuizType> QuizTypes { get; set; }
        //Topic
        public virtual DbSet<TopicHD> TopicHDs { get; set; }
        public virtual DbSet<TopicDT> TopicDTs { get; set; }
        //MessageBox
        public virtual DbSet<MessageBox> MessageBoxes { get; set; }
        public virtual DbSet<auth_UserItem> auth_UserItem { get; set; }
        public virtual DbSet<auth_User> auth_User { get; set; }
        public virtual DbSet<SkillMatrices> SkillMatrices { get; set; }
        public DbSet<Station> Stations { get; set; }
        public DbSet<Evaluation> Evaluations { get; set; }
        public DbSet<Vocational> Vocationals { get; set; }
        //public DbSet<ApplicantExport> ApplicantExport { get; set; }
        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            //modelBuilder.Entity<Applicant>()
            //    .Property(e => e.Address)
            //    .IsUnicode(false);

            modelBuilder.Entity<Applicant>()
                .HasMany(e => e.Brethren)
                .WithRequired(e => e.Applicant)
                .WillCascadeOnDelete(false);

            modelBuilder.Entity<Applicant>()
                .HasMany(e => e.Children)
                .WithRequired(e => e.Applicant)
                .WillCascadeOnDelete(false);

            modelBuilder.Entity<Applicant>()
                .HasMany(e => e.Disease)
                .WithRequired(e => e.Applicant)
                .WillCascadeOnDelete(false);

            modelBuilder.Entity<Applicant>()
                .HasMany(e => e.Education)
                .WithRequired(e => e.Applicant)
                .WillCascadeOnDelete(false);

            modelBuilder.Entity<Applicant>()
                .HasMany(e => e.LanguageSkill)
                .WithRequired(e => e.Applicant)
                .WillCascadeOnDelete(false);

            modelBuilder.Entity<Applicant>()
                .HasMany(e => e.Spouse)
                .WithRequired(e => e.Applicant)
                .WillCascadeOnDelete(false);

            modelBuilder.Entity<Applicant>()
                .HasMany(e => e.Training)
                .WithRequired(e => e.Applicant)
                .WillCascadeOnDelete(false);

            modelBuilder.Entity<Applicant>()
                .HasMany(e => e.WorkExperience)
                .WithRequired(e => e.Applicant)
                .WillCascadeOnDelete(false);


            //Quiz
            modelBuilder.Entity<Quiz_questions>()
                .HasMany(e => e.Question_answer)
                .WithRequired(e => e.Quiz_questions)
                .HasForeignKey(e => e.Questionid);

            modelBuilder.Entity<Quiz_questions>()
                .HasMany(e => e.Question_options)
                .WithRequired(e => e.Quiz_questions)
                .HasForeignKey(e => e.Questionid);

            modelBuilder.Entity<Quiz_responses>()
                .HasMany(e => e.Question_responses)
                .WithOptional(e => e.Quiz_responses)
                .HasForeignKey(e => e.Responseid)
                .WillCascadeOnDelete();

            modelBuilder.Entity<Quizdetail>()
                .HasMany(e => e.Quiz_questions)
                .WithRequired(e => e.Quizdetail)
                .HasForeignKey(e => e.Quizid);

            modelBuilder.Entity<Quizdetail>()
                .HasMany(e => e.Quiz_responses)
                .WithOptional(e => e.Quizdetail)
                .HasForeignKey(e => e.Quizid)
                .WillCascadeOnDelete();

            modelBuilder.Entity<auth_User>()
                .HasMany(e => e.quiz_responses)
                .WithOptional(e => e.auth_User)
                .HasForeignKey(e => e.UserId);
        }
    }
}
