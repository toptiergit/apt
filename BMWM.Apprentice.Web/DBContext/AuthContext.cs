namespace BMWM.Apprentice.Web.DBContext
{
    using System.Data.Entity;
    using BMWM.Apprentice.Web.AuthModels;

    public partial class AuthContext : DbContext
    {
        public AuthContext()
            : base("name=ApprenticeDB")
        {
            //disable initializer
            Database.SetInitializer<AuthContext>(null);
        }

        public virtual DbSet<Item> Items { get; set; }
        public virtual DbSet<Role> Roles { get; set; }
        public virtual DbSet<RoleItem> RoleItems { get; set; }
        public virtual DbSet<User> Users { get; set; }
        public virtual DbSet<UserItem> UserItems { get; set; }
        public virtual DbSet<UserRole> UserRoles { get; set; }
        public virtual DbSet<AuthenticationSession> AuthenticationSessions { get; set; }
        public virtual DbSet<EventLog> EventLogs { get; set; }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            //var dbSchema = AppSettings.DbSchema;
            //if (!string.IsNullOrEmpty(dbSchema))
            //    modelBuilder.HasDefaultSchema(dbSchema);

            modelBuilder.Entity<User>()
                .HasMany(e => e.UserItems)
                .WithRequired(e => e.User)
                .HasForeignKey(e => e.UserId)
                .WillCascadeOnDelete(true);

            modelBuilder.Entity<User>()
                .HasMany(e => e.UserRoles)
                .WithRequired(e => e.User)
                .HasForeignKey(e => e.UserId)
                .WillCascadeOnDelete(true);

            modelBuilder.Entity<User>()
                .Property(e => e.CFDec1)
                .HasPrecision(18, 5);

            modelBuilder.Entity<User>()
                .Property(e => e.CFDec2)
                .HasPrecision(18, 5);

            modelBuilder.Entity<User>()
                .Property(e => e.CFDec3)
                .HasPrecision(18, 5);

            modelBuilder.Entity<User>()
                .Property(e => e.CFDec4)
                .HasPrecision(18, 5);

            modelBuilder.Entity<User>()
                .Property(e => e.CFDec5)
                .HasPrecision(18, 5);


            modelBuilder.Entity<Role>()
                .HasMany(e => e.RoleItems)
                .WithRequired(e => e.Role)
                .WillCascadeOnDelete(false);

            modelBuilder.Entity<Role>()
               .HasMany(e => e.RoleItems)
               .WithRequired(e => e.Role)
               .WillCascadeOnDelete(false);

            modelBuilder.Entity<Item>()
               .HasMany(e => e.RoleItems)
               .WithRequired(e => e.Item)
               .WillCascadeOnDelete(false);
        }
    }
}
