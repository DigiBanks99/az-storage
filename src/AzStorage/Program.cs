using AzStorage;
using Azure.Storage.Blobs;

WebApplicationBuilder builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddAntiforgery();

builder.Services
    .AddScoped<WeatherForcastHandler>()
    .AddScoped<FileInfoHandler>()
    .AddScoped<FileUploadHandler>()
    .AddKeyedScoped<BlobContainerClient>("file", (provider, _) =>
    {
        IConfiguration config = provider.GetRequiredService<IConfiguration>();
        return new BlobContainerClient(config.GetConnectionString("AzStorageAccount"), "files");
    });

if (builder.Environment.IsDevelopment())
{
    builder.Services
        .AddEndpointsApiExplorer()
        .AddSwaggerGen();
}

WebApplication app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseHttpsRedirection()
    .UseStaticFiles()
    .UseRouting()
    .UseAntiforgery();

RouteGroupBuilder api = app.MapGroup("/api");
api.MapGet("/weatherForecast", (WeatherForcastHandler handler) => Results.Ok(handler.Handle()));
api.MapPost("/file", async (FileUploadHandler handler, IFormFile file) =>
    {
        await handler.Handle(file);
        return Results.LocalRedirect("/file");
    })
    .DisableAntiforgery();
api.MapGet("/file", (FileInfoHandler handler) => Results.Ok(handler.GetAll()));
api.MapGet("/file/{fileName}", async (FileInfoHandler handler, string fileName) =>
{
    (Stream? stream, string? contentType) = await handler.Download(fileName);
    return Results.File(stream, contentType, fileName);
});

if (app.Environment.IsDevelopment())
{
    app.UseSwagger()
       .UseSwaggerUI();
}

app.MapFallbackToFile("index.html");

app.Run();
