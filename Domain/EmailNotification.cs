using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain
{
    public class EmailNotification
    {
        public Guid Id { get; set; }
        public int EventUserLookup { get; set; }
        public bool Sent { get; set; }
    }
}
