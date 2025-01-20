namespace QuizApp.Models
{
    public class LoginRequest
    {
        public required string Username { get; set; }
        public required int Password { get; set; }
    }
}
