using Microsoft.AspNetCore.Mvc;
using QuizApp.Models;
using System.Linq;

namespace QuizApp.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly int[] _numberList = new int[]
        {
            10, 20, 30, 40, 50, 60, 70, 80, 90,
            100, 110, 120, 130, 140, 150
        };

        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginRequest? request)
        {
            // Basic null checks
            if (request == null || string.IsNullOrWhiteSpace(request.Username))
            {
                return BadRequest("Invalid request.");
            }

            // 1) Validate username: Only a-z, length <= 15, at least two vowels
            if (!System.Text.RegularExpressions.Regex.IsMatch(request.Username, "^[a-z]+$"))
            {
                return BadRequest("Username must contain only lowercase letters (a-z).");
            }
            if (request.Username.Length > 15)
            {
                return BadRequest("Username must be max 15 characters.");
            }

            // Check for at least two vowels
            int vowelCount = request.Username.Count(c => "aeiou".Contains(c));
            if (vowelCount < 2)
            {
                return BadRequest("Username must contain at least two vowels (a,e,i,o,u).");
            }

            // 2) Validate password: Must be between 100 and 999
            if (request.Password < 100 || request.Password > 999)
            {
                return BadRequest("Password must be between 100 and 999.");
            }

            // 3) Calculate the sum of the first N numbers from the list
            int N = request.Username.Length;
            if (N > _numberList.Length)
            {
                return BadRequest("Username must be max 15 characters.");
            }

            int sum = _numberList.Take(N).Sum();

            // 4) Check if password < sum
            if (request.Password >= sum)
            {
                // Wrong password
                return Unauthorized("Invalid username or password.");
            }

            // If we reach here, login is successful
            return Ok(new { success = true, message = "Login successful" });
        }
    }
}
