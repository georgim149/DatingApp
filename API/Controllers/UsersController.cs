using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using API.Data;
using API.DTOs;
using API.Entities;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    [Authorize]
    public class UsersController : BaseAPIController
    {
        private readonly IUserRepository userRepository;
        private readonly IMapper mapper;
    
        public UsersController(IUserRepository userRepository, IMapper mapper)
        {
            this.mapper = mapper;
            this.userRepository = userRepository;
  
        }

        
        [HttpGet]
        public async Task<ActionResult<IEnumerable<MemberDTO>>> GetUsers()
        {
            var users = await userRepository.GetMembersAsync();
            return Ok(users);
        }
        [HttpGet("{username}")]
        public async Task<ActionResult<MemberDTO>> GetUsers(string username)
        {
            var user = await userRepository.GetMemberAsync(username);
            return mapper.Map<MemberDTO>(user);
        }
        [HttpPut]
        public async Task<ActionResult> updateUser(MemberUpdateDTO memberUpdateDTO)
        {
            var username = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var user = await userRepository.GetUserByUsernameAsync(username);

            mapper.Map(memberUpdateDTO, user);

            userRepository.Update(user);

            if(await userRepository.SaveAllAsync())
            {
                return NoContent();
            }
            return BadRequest("Failed to update user.");
        }
    }
}