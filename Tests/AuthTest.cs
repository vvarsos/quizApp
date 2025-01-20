using Xunit;
using Microsoft.AspNetCore.Mvc;
using QuizApp.Controllers;
using QuizApp.Models;

namespace QuizApp.Tests
{
    public class AuthControllerTests
    {
        [Fact]
        public void Login_NullRequest_ReturnsBadRequest()
        {
            // Arrange
            var controller = new AuthController();

            // Act
            IActionResult result = controller.Login(null);

            // Assert
            var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
            Assert.Equal(400, badRequestResult.StatusCode);
            Assert.Equal("Invalid request.", badRequestResult.Value);
        }

        [Fact]
        public void Login_EmptyUsername_ReturnsBadRequest()
        {
            // Arrange
            var controller = new AuthController();
            var request = new LoginRequest
            {
                Username = "",
                Password = 200
            };

            // Act
            IActionResult result = controller.Login(request);

            // Assert
            var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
            Assert.Equal("Invalid request.", badRequestResult.Value);
        }

        [Theory]
        [InlineData("ab")]     // only 1 vowel ('a') => fails (actually "ab" has 'a' so 1 vowel)
        [InlineData("zzzz")]   // 0 vowels
        [InlineData("xyz")]    // 0 vowels
        public void Login_NotEnoughVowels_ReturnsBadRequest(string username)
        {
            // Arrange
            var controller = new AuthController();
            var request = new LoginRequest
            {
                Username = username,
                Password = 200
            };

            // Act
            IActionResult result = controller.Login(request);

            // Assert
            var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
            Assert.Equal("Username must contain at least two vowels (a,e,i,o,u).", badRequestResult.Value);
        }

        [Theory]
        [InlineData("alexander", 99)]   // password < 100
        [InlineData("alexander", 1000)] // password > 999
        public void Login_PasswordOutOfRange_ReturnsBadRequest(string username, int password)
        {
            // Arrange
            var controller = new AuthController();
            var request = new LoginRequest
            {
                Username = username,
                Password = password
            };

            // Act
            IActionResult result = controller.Login(request);

            // Assert
            var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
            Assert.Equal("Password must be between 100 and 999.", badRequestResult.Value);
        }

        [Theory]
        [InlineData("johnas", 210)]   // sum for "johnas" => 210, password = 210 => Unauthorized
        [InlineData("johnas", 500)]   // also >= 210 => Unauthorized
        [InlineData("alexander", 450)]// sum=450 => password=450 => Unauthorized
        public void Login_PasswordEqualOrAboveSum_ReturnsUnauthorized(string username, int password)
        {
            // Arrange
            var controller = new AuthController();
            var request = new LoginRequest
            {
                Username = username,
                Password = password
            };

            // Act
            IActionResult result = controller.Login(request);

            // Assert
            var unauthorizedResult = Assert.IsType<UnauthorizedObjectResult>(result);
            Assert.Equal("Invalid username or password.", unauthorizedResult.Value);
        }

        [Fact]
        public void Login_ValidCredentials_ReturnsOk()
        {
            // sum( first 6 numbers ) for "johnas" => 210, must be password < 210 => e.g. 209
            var controller = new AuthController();
            var request = new LoginRequest
            {
                Username = "johnas",  // at least 2 vowels: 'o' + 'a'
                Password = 209        // valid password < 210
            };

            // Act
            IActionResult result = controller.Login(request);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            Assert.Equal(200, okResult.StatusCode);

            // You can further check the body if you want
            // e.g. {"success": true, "message": "Login successful"}
            dynamic body = okResult.Value!;
            Assert.True(body.success);
            Assert.Equal("Login successful", (string)body.message);
        }
    }
}
