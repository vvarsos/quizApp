using System.Collections.Generic;

namespace QuizApp.Models
{
    public class ResultItem
    {
        public int quiz_id { get; set; }
        public required List<ResultRangeItem> results { get; set; }
    }

    public class ResultRangeItem
    {
        public int r_id { get; set; }
        public int minpoints { get; set; }
        public int maxpoints { get; set; }
        public required string title { get; set; }
        public required string message { get; set; }
        public string? img { get; set; }
    }
}
