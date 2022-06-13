using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.DTOs;
using API.Entities;
using API.Extensions;
using AutoMapper;

namespace API.Helpers
{
    public class AutoMapperProfiles : Profile
    {
        public AutoMapperProfiles()
        {
            CreateMap<AppUser, MemberDTO>()
            .ForMember(dest => dest.PhotoURL, options =>
            options.MapFrom(src => src.Photos.FirstOrDefault(one => one.IsMain).Url))
            .ForMember(one => one.Age , option => option.MapFrom(src => src.DateOfBirth.CalcAge()));
            CreateMap<Photo, PhotoDto>();
        }
    }
}