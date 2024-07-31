using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain
{
    public class Event
    {
        public int ID { get; set; }
        public string Name { get; set; }    
        public DateTime? StartDate { get; set; }    
        public DateTime? EndDate { get; set; }
        public List<Network> Networks { get; set; }
        public List<Coordinator> Coordinators { get; set; }    
    }
}
