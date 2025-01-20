using Microsoft.AspNetCore.Mvc;
using System.IO;

namespace QuizApp.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ResultController : ControllerBase
    {
        [HttpGet]
        public IActionResult GetResults()
        {
            var jsonPath = Path.Combine(Directory.GetCurrentDirectory(), "Data", "result.json");
            if (!System.IO.File.Exists(jsonPath))
                return NotFound("Result data not found.");

            var resultJson = System.IO.File.ReadAllText(jsonPath);
            return Content(resultJson, "application/json");
        }
    }
}
