using System.Data.Entity;

namespace HelloAngularJS.API.Models
{
    public class Contexto : DbContext
    {
        public DbSet<Todo> Todos { get; set; }
    }
}