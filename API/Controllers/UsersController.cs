using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Data;
using API.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    [Authorize]
    public class UsersController : BaseAPIController
    {
        private readonly DataContext context;
        public UsersController(DataContext context)
        {
            this.context = context;
        }

        
        [HttpGet]
        public async Task<ActionResult<IEnumerable<AppUser>>> GetUsers()
        {
            return await context.Users.ToListAsync();
        }
        [HttpGet("{id}")]
        public async Task<ActionResult<AppUser>> GetUsers(int id)
        {
            return await context.Users.FindAsync(id);
        }
    }
}