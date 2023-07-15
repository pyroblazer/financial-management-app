using api.Dtos.Account;
using System.ComponentModel.DataAnnotations;

namespace api.Tests.Dtos;

public class AccountDtoTests
{
    [Fact]
    public void LoginDto_RequiresUsername()
    {
        var dto = new LoginDto { Password = "password" };
        var results = ValidateModel(dto);
        Assert.Contains(results, r => r.MemberNames.Contains("Username"));
    }

    [Fact]
    public void LoginDto_RequiresPassword()
    {
        var dto = new LoginDto { Username = "user" };
        var results = ValidateModel(dto);
        Assert.Contains(results, r => r.MemberNames.Contains("Password"));
    }

    [Fact]
    public void LoginDto_ValidModel_Passes()
    {
        var dto = new LoginDto { Username = "user", Password = "password" };
        var results = ValidateModel(dto);
        Assert.Empty(results);
    }

    [Fact]
    public void RegisterDto_RequiresUsername()
    {
        var dto = new RegisterDto { Email = "test@test.com", Password = "password" };
        var results = ValidateModel(dto);
        Assert.Contains(results, r => r.MemberNames.Contains("Username"));
    }

    [Fact]
    public void RegisterDto_RequiresEmail()
    {
        var dto = new RegisterDto { Username = "user", Password = "password" };
        var results = ValidateModel(dto);
        Assert.Contains(results, r => r.MemberNames.Contains("Email"));
    }

    [Fact]
    public void RegisterDto_RequiresValidEmail()
    {
        var dto = new RegisterDto { Username = "user", Email = "not-an-email", Password = "password" };
        var results = ValidateModel(dto);
        Assert.Contains(results, r => r.MemberNames.Contains("Email"));
    }

    [Fact]
    public void RegisterDto_RequiresPassword()
    {
        var dto = new RegisterDto { Username = "user", Email = "test@test.com" };
        var results = ValidateModel(dto);
        Assert.Contains(results, r => r.MemberNames.Contains("Password"));
    }

    [Fact]
    public void RegisterDto_ValidModel_Passes()
    {
        var dto = new RegisterDto { Username = "user", Email = "test@test.com", Password = "password" };
        var results = ValidateModel(dto);
        Assert.Empty(results);
    }

    private static List<ValidationResult> ValidateModel(object model)
    {
        var results = new List<ValidationResult>();
        var context = new ValidationContext(model);
        Validator.TryValidateObject(model, context, results, true);
        return results;
    }
}
