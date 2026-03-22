using System.Linq.Expressions;
using backend.ApplicationUser.Entities;
using Microsoft.AspNetCore.Identity;

namespace backend.ApplicationUser.Repositories;


internal class UserRepository : IUserRepository
{
    // private readonly UserManager<AppUser> userManager;

    // public UserRepository(UserManager<AppUser> userManager)
    // {
    //     this.userManager = userManager;
    // }
    public Task<AppUser> AddAsync(AppUser entity)
    {
        throw new NotImplementedException();
    }

    public Task AddRangeAsync(IEnumerable<AppUser> entities)
    {
        throw new NotImplementedException();
    }

    public Task<int> DeleteWhereAsync(Expression<Func<AppUser, bool>> predicate)
    {
        throw new NotImplementedException();
    }

    public Task<IEnumerable<AppUser>> FindAllAsync(Expression<Func<AppUser, bool>> predicate)
    {
        throw new NotImplementedException();
    }

    public Task<AppUser?> FindAsync(Expression<Func<AppUser, bool>> predicate)
    {
        throw new NotImplementedException();
    }

    public Task<IEnumerable<AppUser>> GetAllAsync()
    {
        throw new NotImplementedException();
    }

    public Task<AppUser?> GetByIdAsync(Guid id)
    {
        throw new NotImplementedException();
    }

    public Task SaveChangesAsync()
    {
        throw new NotImplementedException();
    }

    public void Update(AppUser entity)
    {
        throw new NotImplementedException();
    }
}