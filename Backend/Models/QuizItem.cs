using System.Collections.Generic;

namespace QuizApp.Models
{
    public class QuizItem
    {
        public int quiz_id { get; set; }
        public string? title { get; set; }
        public string? description { get; set; }
        public required List<QuestionItem> questions { get; set; }
    }

    public class QuestionItem
    {
        public int q_id { get; set; }
        public required string title { get; set; }
        public string? img { get; set; }
        public string? question_type { get; set; }
        public required List<PossibleAnswer> possible_answers { get; set; }
        public required object correct_answer { get; set; }
        public int points { get; set; }
    }

    public class PossibleAnswer
    {
        public int a_id { get; set; }
        public string? caption { get; set; }
    }
}
