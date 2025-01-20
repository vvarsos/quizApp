using Microsoft.AspNetCore.Mvc;
using System.IO;
using System.Text.Json;

namespace QuizApp.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class QuizController : ControllerBase
    {
        [HttpGet]
        public IActionResult GetQuiz()
        {
            var jsonPath = Path.Combine(Directory.GetCurrentDirectory(), "Data", "quiz.json");
            if (!System.IO.File.Exists(jsonPath))
                return NotFound("Quiz data not found.");

            var quizJson = System.IO.File.ReadAllText(jsonPath);
            
            return Content(quizJson, "application/json");
        }
    }
}
