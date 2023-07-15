using api.Models;
using api.Service;
using Microsoft.Extensions.Configuration;
using System.IdentityModel.Tokens.Jwt;

namespace api.Tests.Service;

public class TokenServiceTests
{
    private readonly IConfiguration _config;

    public TokenServiceTests()
    {
        var inMemorySettings = new Dictionary<string, string?>
        {
            { "JWT:SigningKey", "testtesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttest" },
            { "JWT:Issuer", "https://localhost" },
            { "JWT:Audience", "https://localhost" }
        };

        _config = new ConfigurationBuilder()
            .AddInMemoryCollection(inMemorySettings)
            .Build();
    }

    [Fact]
    public void CreateToken_ReturnsValidJwt()
    {
        var service = new TokenService(_config);
        var user = new AppUser
        {
            Email = "test@test.com",
            UserName = "testuser"
        };

        var token = service.CreateToken(user);

        Assert.False(string.IsNullOrEmpty(token));
        var handler = new JwtSecurityTokenHandler();
        var jwt = handler.ReadJwtToken(token);
        Assert.Contains(jwt.Claims, c => c.Type == "email" && c.Value == "test@test.com");
        Assert.Contains(jwt.Claims, c => c.Type == "given_name" && c.Value == "testuser");
    }

    [Fact]
    public void CreateToken_SetsExpirationToSevenDays()
    {
        var service = new TokenService(_config);
        var user = new AppUser
        {
            Email = "test@test.com",
            UserName = "testuser"
        };

        var token = service.CreateToken(user);

        var handler = new JwtSecurityTokenHandler();
        var jwt = handler.ReadJwtToken(token);
        Assert.True(jwt.ValidTo > DateTime.UtcNow.AddMinutes(5));
        Assert.True(jwt.ValidTo <= DateTime.UtcNow.AddDays(7).AddMinutes(5));
    }

    [Fact]
    public void CreateToken_SetsIssuerAndAudience()
    {
        var service = new TokenService(_config);
        var user = new AppUser
        {
            Email = "test@test.com",
            UserName = "testuser"
        };

        var token = service.CreateToken(user);

        var handler = new JwtSecurityTokenHandler();
        var jwt = handler.ReadJwtToken(token);
        Assert.Equal("https://localhost", jwt.Issuer);
        Assert.Contains("https://localhost", jwt.Audiences);
    }

    [Fact]
    public void CreateToken_WithDifferentUsers_ReturnsDifferentTokens()
    {
        var service = new TokenService(_config);

        var user1 = new AppUser { Email = "user1@test.com", UserName = "user1" };
        var user2 = new AppUser { Email = "user2@test.com", UserName = "user2" };

        var token1 = service.CreateToken(user1);
        var token2 = service.CreateToken(user2);

        Assert.NotEqual(token1, token2);
    }
}
