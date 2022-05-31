using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Data;
using API.Entities;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class BuggyController : BaseAPIController
    {
        private readonly DataContext dataContext;
        public BuggyController(DataContext dataContext)
        {
            this.dataContext = dataContext;
        }
        [HttpGet("auth")]
        public ActionResult<string> GetSecret()
        {
            return "secret text";
        }
        [HttpGet("not-found")]
        public ActionResult<AppUser> GetNotFound()
        {
            var thing = dataContext.Users.Find(-1);
            if(thing == null)
            {
                return NotFound();
            }
            else
            {
                return Ok(thing);
            }
        }
        [HttpGet("server-error")]
        public ActionResult<string> GetServerError()
        {
            var thing = dataContext.Users.Find(-1);
            var thingToReturn = thing.ToString();
            return thingToReturn;
        }
        [HttpGet("bad-request")]
        public ActionResult<string> GetBadRequest()
        {
            return BadRequest("this was a bad request");
        }
    }
}