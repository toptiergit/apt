using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Web;

namespace ApplicationForm.Models
{
    public class QuestionVM
    {
        public int QuestionID { get; set; }
        public string QuestionText { get; set; }
        public string QuestionType { get; set; }
        public string Anwser { get; set; }
        public int AnswerId { get; set; }
        public string Image { get; set; }

        public ICollection<ChoiceVM> Choices { get; set; }
        public int OrderQuestion { get; set; }
    }
    public class ChoiceVM
    {
        public int ChoiceID { get; set; }
        public string ChoiceText { get; set; }
        public string Image { get; set; }
    }
    public class QuizAnswersVM
    {
        public int QuestionID { get; set; }
        [Required]
        public int AnswerId { get; set; }
        public bool isCorrect { get; set; }
        public string AnswerText { get; set; }
    }

    public class QuestionReportVM
    {
        public int QuestionID { get; set; }
        public string QuestionText { get; set; }
        public int QuizReqID { get; set; }
        public string QuizReqText { get; set; }
        public int QuizResID { get; set; }
        public string QuizResText { get; set; }
        public string isCorrect { get; set; }
        public DateTime UpdatedOn { get; set; }
        
        public ICollection<ChoiceAnsVM> Choices { get; set; }
    }
    public class ChoiceAnsVM
    {
        public int ChoiceID { get; set; }
        public string ChoiceText { get; set; }
    }
}