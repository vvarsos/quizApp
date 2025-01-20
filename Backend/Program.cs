using System.Net;

var builder = WebApplication.CreateBuilder(args);

builder.WebHost.ConfigureKestrel(options =>
{
    // Clear all endpoints (removes the default HTTP on port 5000)
    options.ListenLocalhost(5001, listenOptions =>
    {
        // Use the dev certificate for HTTPS
        listenOptions.UseHttps();
    });
});

// 1) Configure services
builder.Services.AddControllers();

// 2) Build app
var app = builder.Build();

app.UseDefaultFiles();
app.UseStaticFiles();


// 3) Configure middleware and endpoints
app.MapControllers();

// 4) Run the app
app.Run();
