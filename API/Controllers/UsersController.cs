using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using API.Data;
using API.DTOs;
using API.Entities;
using API.Extensions;
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
        private readonly IPhotoService photoService;
    
        public UsersController(IUserRepository userRepository, IMapper mapper, IPhotoService photoService)
        {
            this.photoService = photoService;
            this.mapper = mapper;
            this.userRepository = userRepository;
  
        }

        
        [HttpGet]
        public async Task<ActionResult<IEnumerable<MemberDTO>>> GetUsers()
        {
            var users = await userRepository.GetMembersAsync();
            return Ok(users);
        }
        [HttpGet("{username}", Name = "GetUser")]
        public async Task<ActionResult<MemberDTO>> GetUser(string username)
        {
            var user = await userRepository.GetMemberAsync(username);
            return mapper.Map<MemberDTO>(user);
        }
        [HttpPut]
        public async Task<ActionResult> updateUser(MemberUpdateDTO memberUpdateDTO)
        {
            var user = await userRepository.GetUserByUsernameAsync(User.GetUsername());

            mapper.Map(memberUpdateDTO, user);

            userRepository.Update(user);

            if(await userRepository.SaveAllAsync())
            {
                return NoContent();
            }
            return BadRequest("Failed to update user.");
        }
        [HttpPost("add-photo")]
        public async Task<ActionResult<PhotoDto>> AddPhoto(IFormFile file)
        {
            var user = await userRepository.GetUserByUsernameAsync(User.GetUsername());
            var result = await photoService.AddPhotoAsync(file);
            if(result.Error != null)
            {
                return BadRequest(result.Error.Message);
            }
            var photo = new Photo
            {
                Url = result.SecureUrl.AbsoluteUri,
                PublicId = result.PublicId
            };
            if(user.Photos.Count == 0)
            {
                photo.IsMain = true;
            }
            user.Photos.Add(photo);
            if(await userRepository.SaveAllAsync())
            {
                return CreatedAtRoute("GetUser", new {username = user.UserName}, mapper.Map<PhotoDto>(photo));
            }
            return BadRequest("Problem Adding Photo");
        }
        [HttpPut("set-main-photo/{photoId}")]
        public async Task<ActionResult> SetMainPhoto(int photoId)
        {
            var user = await userRepository.GetUserByUsernameAsync(User.GetUsername());
            var photo = user.Photos.FirstOrDefault(x => x.Id == photoId);
            if(photo.IsMain)
            {
                return BadRequest("Photo is already main");
            }
            var currentMain = user.Photos.FirstOrDefault(x=>x.IsMain);
            if(currentMain != null)
            {
                currentMain.IsMain = false;
            }
            photo.IsMain = true;
            if(await userRepository.SaveAllAsync())
            {
                return NoContent();
            }
            return BadRequest("Something went wrong!");
        }
        [HttpDelete("delete-photo/{photoId}")]
        public async Task<ActionResult> DeletePhoto(int photoId)
        {
            var user = await userRepository.GetUserByUsernameAsync(User.GetUsername());
            var photo = user.Photos.FirstOrDefault(x => x.Id == photoId);
            if(photo == null)
            {
                return NotFound();
            }
            if(photo.IsMain)
            {
                return BadRequest("You cannot delete your main photo");
            }
            if(photo.PublicId != null)
            {
               var result = await photoService.DeletePhotoAsync(photo.PublicId);
               if(result.Error != null)
               {
                return BadRequest("Could not delete photo!");
               }
            }
            user.Photos.Remove(photo);
            if(await userRepository.SaveAllAsync())
            {
                return Ok();
            }
            return BadRequest("Failed to delete photo.");
        }
    }
}