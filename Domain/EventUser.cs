using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.CompilerServices;
using System.Text;
using System.Threading.Tasks;

namespace Domain
{
    public class EventUser
    {
        public int ID { get; set; } 
        public int EventId { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string MiddleInitial { get; set; }
        public string EventName { get; set; }
        public bool Cleared {get; set;}
    }
}
