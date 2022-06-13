using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Extensions
{
    public static class DateTimeExtensions
    {
        public static int CalcAge(this DateTime dob)
        {
            var dateDifferenceInDays = (DateTime.Now - dob).Days;
            return dateDifferenceInDays/365;
        }
    }
}